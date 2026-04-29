package com.zerotrust.authservice.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;


/**
 * RegisterRequest is a DTO (Data Transfer Object) used to receive registration data from the client.
 * <p>
 * This class represents the JSON body sent to the registration endpoint (for example: {@code POST /auth/register}).
 * It contains the required identity fields (email/password) plus extra profile fields used as
 * security context in a Zero Trust application.
 */
@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest {

    /**
     * User email sent by the client.
     * Example: "test@example.com".
     */
    private String email;

    /**
     * User password sent by the client.
     * <p>
     * Important: this is the raw password (NOT hashed yet). It will be hashed later in the service layer.
     */
    private String password;

    /** User first name (example: "Alice"). */
    private String firstName;

    /** User last name (example: "Dupont"). */
    private String lastName;

    /**
     * User date of birth as a String.
     * <p>
     * Common format: ISO-8601 (example: "1990-01-01").
     */
    private String dateOfBirth;

    /** Company name (example: "Contoso"). */
    private String company;

    /** Job title (example: "DevOps Engineer"). */
    private String jobTitle;

    /** Country (example: "FR"). */
    private String country;

    /** Phone number (example: "+33 6 12 34 56 78"). */
    private String phone;

    /** Department/team in the company (example: "IT", "Finance"). */
    private String department;

    /** Optional clearance level used in access decisions (example: "LOW", "HIGH"). */
    private String securityClearance;
}
