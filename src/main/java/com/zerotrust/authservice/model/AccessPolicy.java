package com.zerotrust.authservice.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * AccessPolicy is a JPA entity representing a dynamic rule used by the access engine.
 * <p>
 * A policy typically says something like:
 * "For RESOURCE + ACTION, if riskScore is high enough, then DECISION = DENY/CHALLENGE".
 * <p>
 * These policies are stored in the {@code access_policies} table.
 */
@Entity
@Table(name = "access_policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessPolicy {

    /** Database identifier for the policy. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Resource this policy targets (example: "ADMIN_PANEL"). */
    private String resource;

    /** Action this policy targets (example: "DELETE"). */
    private String action;

    /** Minimum risk score required before the policy can apply (nullable). */
    private Integer minRiskScore;

    /** Decision applied when the policy matches (example: "ALLOW", "CHALLENGE", "DENY"). */
    private String decision;

    /** Optional extra condition stored as a string (project-specific format). */
    private String condition;

    /** Whether this policy is active. Disabled policies are ignored by the engine. */
    private Boolean enabled;
}
