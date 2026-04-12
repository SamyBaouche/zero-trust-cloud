package com.zerotrust.authservice.service;

import com.zerotrust.authservice.dto.AccessRequest;
import com.zerotrust.authservice.dto.AccessResponse;
import com.zerotrust.authservice.model.AccessLog;
import com.zerotrust.authservice.repository.AccessLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AccessService {

    private final AccessLogRepository accessLogRepository;

    public AccessService(AccessLogRepository accessLogRepository) {
        this.accessLogRepository = accessLogRepository;
    }

    public AccessResponse checkAccess(AccessRequest request, String userEmail) {
        int riskScore = 0;

        // Action risk
        if (request.getAction() != null) {
            String action = request.getAction().toUpperCase();

            if (action.equals("READ")) {
                riskScore += 5;
            } else if (action.equals("WRITE")) {
                riskScore += 20;
            } else if (action.equals("DELETE")) {
                riskScore += 40;
            }
        }

        // Resource risk
        if (request.getResource() != null) {
            String resource = request.getResource().toUpperCase();

            if (resource.equals("PUBLIC_DOCS")) {
                riskScore += 5;
            } else if (resource.equals("INTERNAL_API")) {
                riskScore += 15;
            } else if (resource.equals("S3_FINANCE_BUCKET")) {
                riskScore += 30;
            } else if (resource.equals("ADMIN_PANEL")) {
                riskScore += 45;
            }
        }

        // Location risk
        if (request.getLocation() != null &&
                request.getLocation().equalsIgnoreCase("Unknown")) {
            riskScore += 20;
        }

        // IP risk
        if (request.getIpAddress() != null &&
                request.getIpAddress().startsWith("203.")) {
            riskScore += 25;
        }

        // Final decision
        String decision;
        String message;

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

        // Save audit log
        AccessLog accessLog = AccessLog.builder()
                .userEmail(userEmail)
                .resource(request.getResource())
                .action(request.getAction())
                .ipAddress(request.getIpAddress())
                .location(request.getLocation())
                .device(request.getDevice())
                .decision(decision)
                .createdAt(LocalDateTime.now())
                .build();

        accessLogRepository.save(accessLog);

        return new AccessResponse(decision, riskScore, message);
    }
}