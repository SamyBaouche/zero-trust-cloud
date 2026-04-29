package com.zerotrust.authservice.controller;

import com.zerotrust.authservice.dto.AccessPolicyResponse;
import com.zerotrust.authservice.model.AccessPolicy;
import com.zerotrust.authservice.repository.AccessPolicyRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * PolicyController exposes read-only endpoints to list access policies.
 * <p>
 * The access engine uses policies internally, and the UI can display them for transparency.
 */
@RestController
@RequestMapping("/policies")
public class PolicyController {
    private final AccessPolicyRepository accessPolicyRepository;

    public PolicyController(AccessPolicyRepository accessPolicyRepository) {
        this.accessPolicyRepository = accessPolicyRepository;
    }

    /**
     * Returns enabled access policies.
     * <p>
     * Endpoint: {@code GET /policies}
     */
    @GetMapping
    public List<AccessPolicyResponse> getPolicies() {
        return accessPolicyRepository.findByEnabledTrue().stream()
                .map(policy -> AccessPolicyResponse.builder()
                        .id(policy.getId())
                        .resource(policy.getResource())
                        .action(policy.getAction())
                        .decision(policy.getDecision())
                        .minRiskScore(policy.getMinRiskScore())
                        .condition(policy.getCondition())
                        .enabled(policy.getEnabled())
                        .build())
                .collect(Collectors.toList());
    }
}


