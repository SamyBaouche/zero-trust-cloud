package com.zerotrust.authservice.service;

import com.zerotrust.authservice.dto.AccessRequest;
import com.zerotrust.authservice.dto.AccessResponse;
import com.zerotrust.authservice.dto.AttackScenarioResponse;
import com.zerotrust.authservice.model.AccessLog;
import com.zerotrust.authservice.model.AccessPolicy;
import com.zerotrust.authservice.model.SecurityAlert;
import com.zerotrust.authservice.repository.AccessLogRepository;
import com.zerotrust.authservice.repository.AccessPolicyRepository;
import com.zerotrust.authservice.repository.SecurityAlertRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * AccessService handles access control logic and risk-based decisions for resources.
 * <p>
 * Responsibilities:
 * - Evaluate access requests and calculate risk scores
 * - Apply dynamic access policies
 * - Log access attempts and generate security alerts
 * - Simulate attack scenarios for testing
 * <p>
 * Main methods:
 * - checkAccess(AccessRequest, String): Evaluates access and returns a decision
 * - getAttackScenarios(): Returns predefined attack scenarios
 * - simulateScenario(String, String): Simulates a scenario for a user
 * <p>
 * Example usage:
 *   AccessResponse resp = accessService.checkAccess(request, userEmail);
 */
@Service
public class AccessService {

    private final AccessLogRepository accessLogRepository;
    private final AccessPolicyRepository accessPolicyRepository;
    private final SecurityAlertRepository securityAlertRepository;

    public AccessService(AccessLogRepository accessLogRepository,
                         AccessPolicyRepository accessPolicyRepository,
                         SecurityAlertRepository securityAlertRepository) {
        this.accessLogRepository = accessLogRepository;
        this.accessPolicyRepository = accessPolicyRepository;
        this.securityAlertRepository = securityAlertRepository;
    }

    /**
     * Evaluates a single access attempt.
     * <p>
     * Steps (simplified):
     * 1) Compute a risk score from the request context (action/resource/ip/location)
     * 2) Decide ALLOW / CHALLENGE / DENY based on thresholds
     * 3) Optionally override using dynamic policies stored in the database
     * 4) Persist an {@link AccessLog} entry for auditing
     * 5) Create a {@link SecurityAlert} for high-risk or denied decisions
     *
     * @param request  access attempt data coming from the client
     * @param userEmail authenticated user email (from JWT)
     * @return decision + score + explanations
     */
    public AccessResponse checkAccess(AccessRequest request, String userEmail) {
        int riskScore = 0;
        java.util.List<String> reasons = new java.util.ArrayList<>();

        // Action risk
        if (request.getAction() != null) {
            String action = request.getAction().toUpperCase();
            if (action.equals("READ")) {
                riskScore += 5;
                reasons.add("READ action: +5");
            } else if (action.equals("WRITE")) {
                riskScore += 20;
                reasons.add("WRITE action: +20");
            } else if (action.equals("DELETE")) {
                riskScore += 40;
                reasons.add("DELETE action: +40");
            }
        }

        // Resource risk
        if (request.getResource() != null) {
            String resource = request.getResource().toUpperCase();
            if (resource.equals("PUBLIC_DOCS")) {
                riskScore += 5;
                reasons.add("PUBLIC_DOCS resource: +5");
            } else if (resource.equals("INTERNAL_API")) {
                riskScore += 15;
                reasons.add("INTERNAL_API resource: +15");
            } else if (resource.equals("S3_FINANCE_BUCKET")) {
                riskScore += 30;
                reasons.add("S3_FINANCE_BUCKET resource: +30");
            } else if (resource.equals("ADMIN_PANEL")) {
                riskScore += 45;
                reasons.add("ADMIN_PANEL resource: +45");
            }
        }

        // Location risk
        if (request.getLocation() != null &&
                request.getLocation().equalsIgnoreCase("Unknown")) {
            riskScore += 20;
            reasons.add("Unknown location: +20");
        }

        // IP risk
        if (request.getIpAddress() != null &&
                request.getIpAddress().startsWith("203.")) {
            riskScore += 25;
            reasons.add("Suspicious IP (203.x): +25");
        }

        String decision;
        String message;

        // Default decision
        if (riskScore < 30) {
            decision = "ALLOW";
            message = "Access granted. Low risk.";
        } else if (riskScore < 70) {
            decision = "CHALLENGE";
            message = "Access requires additional verification.";
        } else {
            decision = "DENY";
            message = "Access denied due to high risk.";
        }

        // Dynamic policy override
        List<AccessPolicy> policies = accessPolicyRepository.findByEnabledTrue();
        for (AccessPolicy policy : policies) {
            boolean sameResource = policy.getResource() != null
                    && request.getResource() != null
                    && policy.getResource().equalsIgnoreCase(request.getResource());
            boolean sameAction = policy.getAction() != null
                    && request.getAction() != null
                    && policy.getAction().equalsIgnoreCase(request.getAction());
            boolean enoughRisk = policy.getMinRiskScore() != null
                    && riskScore >= policy.getMinRiskScore();
            if (sameResource && sameAction && enoughRisk) {
                decision = policy.getDecision();
                message = "Decision applied from dynamic policy.";
                reasons.add("Policy override: " + policy.getDecision() + " for " + policy.getAction() + " on " + policy.getResource());
                break;
            }
        }

        // Save audit log enrichi
        String reasonsStr = String.join("; ", reasons);
        AccessLog accessLog = AccessLog.builder()
                .userEmail(userEmail)
                .resource(request.getResource())
                .action(request.getAction())
                .ipAddress(request.getIpAddress())
                .location(request.getLocation())
                .device(request.getDevice())
                .decision(decision)
                .riskScore(riskScore)
                .message(message)
                .reasons(reasonsStr)
                .createdAt(LocalDateTime.now())
                .build();

        accessLogRepository.save(accessLog);

        // Après la décision et le log, générer des alertes si nécessaire
        if ("DENY".equals(decision) || riskScore >= 70) {
            String alertType = "HIGH_RISK";
            String alertMsg = "High-risk access attempt detected";
            if ("DENY".equals(decision)) {
                alertType = "DENY";
                alertMsg = "Sensitive resource access denied";
            } else if (request.getLocation() != null && request.getLocation().equalsIgnoreCase("Unknown")) {
                alertType = "UNKNOWN_LOCATION";
                alertMsg = "Unknown location access";
            } else if (request.getIpAddress() != null && request.getIpAddress().startsWith("203.")) {
                alertType = "SUSPICIOUS_IP";
                alertMsg = "Suspicious IP range detected";
            }
            securityAlertRepository.save(SecurityAlert.builder()
                    .userEmail(userEmail)
                    .type(alertType)
                    .message(alertMsg)
                    .resource(request.getResource())
                    .action(request.getAction())
                    .riskScore(riskScore)
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        return new AccessResponse(decision, riskScore, message, reasons);
    }

    /**
     * Returns a list of predefined scenarios used by the "Attack Simulator" screen.
     * <p>
     * Each scenario includes a ready-to-use access context to test how the engine reacts.
     */
    public List<AttackScenarioResponse> getAttackScenarios() {
        List<AttackScenarioResponse> scenarios = new ArrayList<>();
        scenarios.add(new AttackScenarioResponse(
                "suspicious-ip-admin-delete",
                "Suspicious IP on admin panel",
                "Delete request on ADMIN_PANEL from suspicious IP range 203.x and unknown location.",
                "ADMIN_PANEL",
                "DELETE",
                "203.45.10.21",
                "Unknown",
                "Unmanaged browser"
        ));
        scenarios.add(new AttackScenarioResponse(
                "finance-bucket-write-unknown",
                "Finance bucket write from unknown location",
                "Write request targeting finance data with context considered risky.",
                "S3_FINANCE_BUCKET",
                "WRITE",
                "203.66.4.9",
                "Unknown",
                "Personal laptop"
        ));
        scenarios.add(new AttackScenarioResponse(
                "internal-api-normal-read",
                "Internal API normal read",
                "Low risk baseline to compare simulator behavior against attack scenarios.",
                "INTERNAL_API",
                "READ",
                "192.168.1.40",
                "Paris, FR",
                "Managed laptop"
        ));
        return scenarios;
    }

    /**
     * Finds a scenario by ID and runs it through {@link #checkAccess(AccessRequest, String)}.
     *
     * @param scenarioId scenario identifier from the URL
     * @param userEmail  current user (used for logging/alerts)
     * @return the same decision structure as a normal access check
     */
    public AccessResponse simulateScenario(String scenarioId, String userEmail) {
        AttackScenarioResponse scenario = getAttackScenarios().stream()
                .filter(item -> item.getId().equalsIgnoreCase(scenarioId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Scenario not found: " + scenarioId));

        AccessRequest request = new AccessRequest();
        request.setResource(scenario.getResource());
        request.setAction(scenario.getAction());
        request.setIpAddress(scenario.getIpAddress());
        request.setLocation(scenario.getLocation());
        request.setDevice(scenario.getDevice());

        return checkAccess(request, userEmail);
    }
}