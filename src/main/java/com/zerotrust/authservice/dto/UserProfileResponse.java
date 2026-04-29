package com.zerotrust.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * This class is a DTO (Data Transfer Object) used to send user profile data
 * from the backend to the client.
 * <p>
 * Simple explanation:
 * - It represents the data returned when a user profile is requested.
 * - It contains all the information that will be displayed to the user.
 * <p>
 * Important behavior:
 * - This class is used only for responses (output), not for updating data.
 * - All fields are expected to be filled when sent to the client.
 * <p>
 * Example:
 *   UserProfileResponse res = new UserProfileResponse(
 *       "john@email.com",
 *       "John",
 *       "Doe",
 *       "1990-01-01",
 *       "Google",
 *       "Software Engineer",
 *       "USA",
 *       "123456789",
 *       "Engineering",
 *       "HIGH"
 *   );
 * <p>
 * Fields description:
 * - email: User's email address
 * - firstName: User's first name
 * - lastName: User's last name
 * - dateOfBirth: User's date of birth (stored as String, e.g. "1990-01-01")
 * - company: Company where the user works
 * - jobTitle: User's job title
 * - country: User's country
 * - phone: User's phone number
 * - department: Department in the company (e.g. IT, HR)
 * - securityClearance: Security level of the user
 */

@Getter
@Setter
@AllArgsConstructor
public class UserProfileResponse {

    /** User email address. */
    private String email;

    /** User first name. */
    private String firstName;

    /** User last name. */
    private String lastName;

    /**
     * User date of birth as a String.
     * <p>
     * Common format: ISO-8601 (example: "1990-01-01").
     */
    private String dateOfBirth;

    /** Company name. */
    private String company;

    /** Job title. */
    private String jobTitle;

    /** Country (example: "FR"). */
    private String country;

    /** Phone number. */
    private String phone;

    /** Department/team in the company. */
    private String department;

    /** Clearance level used as security context (example: "HIGH"). */
    private String securityClearance;
}