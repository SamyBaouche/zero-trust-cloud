package com.zerotrust.authservice.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * This class is a DTO (Data Transfer Object) used when a user wants to update their profile.
 * <p>
 * Simple explanation:
 * - It contains the data sent from the client (frontend) to the backend.
 * - Each field represents information that the user can modify.
 * - Fields can be null, which means "do not update this value".
 * <p>
 * Important behavior:
 * - The backend will only update fields that are NOT null.
 * - Example: if only firstName is set, only the first name will be updated.
 * <p>
 * Example:
 *   UpdateProfileRequest req = new UpdateProfileRequest();
 *   req.setFirstName("Alice"); // Only first name will be updated
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
@NoArgsConstructor
public class UpdateProfileRequest {

    /** New email address. If null, the email will not be changed. */
    private String email;

    /** New first name. If null, the first name will not be changed. */
    private String firstName;

    /** New last name. If null, the last name will not be changed. */
    private String lastName;

    /**
     * New date of birth as a String.
     * <p>
     * Common format: ISO-8601 (example: "1990-01-01"). If null, it will not be changed.
     */
    private String dateOfBirth;

    /** New company name. If null, it will not be changed. */
    private String company;

    /** New job title. If null, it will not be changed. */
    private String jobTitle;

    /** New country (example: "FR"). If null, it will not be changed. */
    private String country;

    /** New phone number. If null, it will not be changed. */
    private String phone;

    /** New department/team. If null, it will not be changed. */
    private String department;

    /** New clearance level. If null, it will not be changed. */
    private String securityClearance;
}