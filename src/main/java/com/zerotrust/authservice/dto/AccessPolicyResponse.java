package com.zerotrust.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * AccessPolicyResponse is a DTO returned by the API when the client requests the list of
 * configured access policies.
 * <p>
 * Policies are the rules used by the backend to decide whether an access request should be
 * allowed or denied.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessPolicyResponse {
    /** Unique identifier of the policy. */
    private Long id;

    /** Resource this policy applies to (example: "/api/admin/*"). */
    private String resource;

    /** Action this policy applies to (example: "READ", "WRITE"). */
    private String action;

    /** Policy outcome if the rule matches (example: "ALLOW" or "DENY"). */
    private String decision;

    /** Minimum risk score required by the policy (or a threshold used by the policy). */
    private Integer minRiskScore;

    /**
     * Optional extra condition, usually stored as a text expression.
     * Example: "country == 'FR' && securityClearance == 'HIGH'".
     */
    private String condition;

    /** Whether this policy is currently active. */
    private boolean enabled;
}

