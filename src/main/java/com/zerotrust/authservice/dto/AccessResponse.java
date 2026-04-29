package com.zerotrust.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

/**
 * AccessResponse is a DTO returned by the API after evaluating an {@link AccessRequest}.
 * <p>
 * It contains the decision (allow/deny), the computed risk score, and explanations that can be
 * displayed in the UI.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccessResponse {
    /** Final decision for the access attempt (commonly "ALLOW" or "DENY"). */
    private String decision;

    /** Numeric risk score computed for this attempt (higher usually means more risky). */
    private int riskScore;

    /** Human-readable message explaining the decision. */
    private String message;

    /** List of reasons that contributed to the decision. */
    private List<String> reasons;
}
