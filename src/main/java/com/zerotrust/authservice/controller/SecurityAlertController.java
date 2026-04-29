package com.zerotrust.authservice.controller;

import com.zerotrust.authservice.dto.SecurityAlertResponse;
import com.zerotrust.authservice.repository.SecurityAlertRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * SecurityAlertController exposes endpoints to fetch recent security alerts.
 * <p>
 * Alerts are generated automatically by the access engine when something looks suspicious.
 */
@RestController
@RequestMapping("/alerts")
public class SecurityAlertController {
    private final SecurityAlertRepository securityAlertRepository;

    public SecurityAlertController(SecurityAlertRepository securityAlertRepository) {
        this.securityAlertRepository = securityAlertRepository;
    }

    /**
     * Returns the most recent alerts for the current authenticated user.
     * <p>
     * Endpoint: {@code GET /alerts}
     */
    @GetMapping
    public List<SecurityAlertResponse> getAlerts(Authentication authentication) {
        String userEmail = authentication != null && authentication.getName() != null
                ? authentication.getName().trim()
                : "";

        if (userEmail.isBlank()) {
            return List.of();
        }

        return securityAlertRepository.findTop10ByUserEmailIgnoreCaseOrderByCreatedAtDesc(userEmail).stream()
                .map(alert -> SecurityAlertResponse.builder()
                        .id(alert.getId())
                        .userEmail(alert.getUserEmail())
                        .type(alert.getType())
                        .message(alert.getMessage())
                        .resource(alert.getResource())
                        .action(alert.getAction())
                        .riskScore(alert.getRiskScore())
                        .createdAt(alert.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
