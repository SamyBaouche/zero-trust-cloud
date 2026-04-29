package com.zerotrust.authservice.controller;

import com.zerotrust.authservice.dto.AccessLogResponse;
import com.zerotrust.authservice.repository.AccessLogRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * AccessLogController exposes endpoints to retrieve access decision logs.
 * <p>
 * Logs are stored when the access engine evaluates a request. The UI can display them as an audit trail.
 */
@RestController
@RequestMapping("/logs")
public class AccessLogController {
    private final AccessLogRepository accessLogRepository;

    public AccessLogController(AccessLogRepository accessLogRepository) {
        this.accessLogRepository = accessLogRepository;
    }

    /**
     * Returns all access logs for the current authenticated user, newest first.
     * <p>
     * Endpoint: {@code GET /logs}
     */
    @GetMapping
    public List<AccessLogResponse> getAllLogs(Authentication authentication) {
        String userEmail = authentication != null && authentication.getName() != null
                ? authentication.getName().trim()
                : "";

        if (userEmail.isBlank()) {
            return List.of();
        }

        return accessLogRepository.findAllByUserEmailIgnoreCaseOrderByCreatedAtDesc(userEmail).stream()
                .map(log -> AccessLogResponse.builder()
                        .id(log.getId())
                        .userEmail(log.getUserEmail())
                        .resource(log.getResource())
                        .action(log.getAction())
                        .ipAddress(log.getIpAddress())
                        .location(log.getLocation())
                        .device(log.getDevice())
                        .decision(log.getDecision())
                        .riskScore(log.getRiskScore())
                        .message(log.getMessage())
                        .reasons(log.getReasons() != null && !log.getReasons().isBlank()
                                ? Arrays.stream(log.getReasons().split("; ")).collect(Collectors.toList())
                                : List.of())
                        .createdAt(log.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
