package com.zerotrust.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * AccessLogResponse is a DTO (Data Transfer Object) returned by the API when the client
 * asks for access decision history (audit logs).
 * <p>
 * In a Zero Trust application, every access attempt can be evaluated (ALLOW/DENY) and stored.
 * This DTO is the "read-only view" of a stored access event.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessLogResponse {
    /** Unique identifier of the log entry in the database. */
    private Long id;

    /** Email of the user who attempted the action (example: "alice@company.com"). */
    private String userEmail;

    /** Target resource that was accessed (example: "/admin/report" or "database"). */
    private String resource;

    /** Action performed on the resource (example: "READ", "WRITE", "DELETE"). */
    private String action;

    /** Source IP address of the request (example: "203.0.113.10"). */
    private String ipAddress;

    /** Approximate geographic location (example: "Paris, FR"). */
    private String location;

    /** Device description (example: "Chrome on Windows" or a device ID). */
    private String device;

    /** Final access decision (commonly "ALLOW" or "DENY"). */
    private String decision;

    /** Numeric risk score computed by the policy engine (higher usually means more risky). */
    private Integer riskScore;

    /** Human-readable summary explaining the decision. */
    private String message;

    /**
     * List of short reasons that explain why the decision was made.
     * Example: ["IP not trusted", "Risk score too high"].
     */
    private List<String> reasons;

    /** Date/time when this log entry was created (server time). */
    private LocalDateTime createdAt;
}

