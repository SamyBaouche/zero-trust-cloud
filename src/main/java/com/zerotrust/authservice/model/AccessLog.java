package com.zerotrust.authservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * AccessLog is a JPA entity that stores a history of access decisions.
 * <p>
 * Every time the access engine evaluates a request, we persist an AccessLog entry so we can:
 * - audit what happened
 * - show logs in the dashboard
 * - troubleshoot why access was allowed/denied
 */
@Entity
@Table(name = "access_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessLog {

    /** Database identifier for the log entry. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Email of the user associated with this access attempt. */
    private String userEmail;

    /** Target resource (example: "ADMIN_PANEL"). */
    private String resource;

    /** Action performed (example: "READ", "DELETE"). */
    private String action;

    /** Source IP address of the request. */
    private String ipAddress;

    /** Optional location string (example: "Paris, FR" or "Unknown"). */
    private String location;

    /** Optional device information (browser, device name, etc.). */
    private String device;

    /** Final access decision (example: "ALLOW", "CHALLENGE", "DENY"). */
    private String decision;

    /** Computed risk score used to decide the final decision. */
    private Integer riskScore;

    /** Human-readable message that summarizes the decision. */
    private String message;

    /**
     * Technical explanation (often a joined string) describing which factors contributed to the score.
     * Example: "DELETE action: +40; Unknown location: +20".
     */
    @Column(length = 1024)
    private String reasons;

    /** Date/time when the decision was recorded (server time). */
    private LocalDateTime createdAt;
}
