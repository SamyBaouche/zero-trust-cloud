package com.zerotrust.authservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;


/**
 * User is a JPA entity that represents an application user stored in the database.
 * <p>
 * In simple terms:
 * - This class becomes a row in the {@code users} table.
 * - It contains login data (email/password) and profile data used as security context.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    /**
     * Primary key of the user table
     * <p>
     * {@code @Id} marks this field as the primary key.
     * {@code @GeneratedValue} auto-generates the ID (auto-increment in PostgreSQL).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Email of the user
     * <p>
     * nullable = false → cannot be null
     * unique = true → no duplicate emails allowed
     * <p>
     * This is important for authentication (email = login)
     */
    @Column(nullable = false, unique = true)
    private String email;

    /**
     * Password of the user
     * <p>
     * IMPORTANT:
     * This is NOT stored as plain text
     * It must be hashed using BCrypt before saving
     */
    @Column(nullable = false)
    private String password;

    /** User first name (display purpose and optional security context). */
    @Column(length = 120)
    private String firstName;

    /** User last name. */
    @Column(length = 120)
    private String lastName;

    /** User date of birth (stored as a {@link LocalDate}). */
    private LocalDate dateOfBirth;

    /** Company name. */
    @Column(length = 180)
    private String company;

    /** Job title/role in the company. */
    @Column(length = 120)
    private String jobTitle;

    /** Country (example: "FR", "USA"). */
    @Column(length = 120)
    private String country;

    /** Phone number (kept as a string to preserve formatting). */
    @Column(length = 40)
    private String phone;

    /** Department/team name (example: "IT", "Security"). */
    @Column(length = 120)
    private String department;

    /** Optional clearance level (example: "LOW", "HIGH"). */
    @Column(length = 80)
    private String securityClearance;

}
