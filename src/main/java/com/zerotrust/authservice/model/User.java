package com.zerotrust.authservice.model;

// JPA annotations for database mapping
import jakarta.persistence.*;

// Lombok to reduce boilerplate code
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * This class represents a User entity in the database.
 *
 * It will be automatically mapped to a table called "users" in PostgreSQL.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    /**
     * Primary key of the user table
     *
     * @Id → marks this field as the primary key
     * @GeneratedValue → auto-generates ID (auto-increment in PostgreSQL)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Email of the user
     *
     * nullable = false → cannot be null
     * unique = true → no duplicate emails allowed
     *
     * This is important for authentication (email = login)
     */
    @Column(nullable = false, unique = true)
    private String email;

    /**
     * Password of the user
     *
     * IMPORTANT:
     * This is NOT stored as plain text
     * It must be hashed using BCrypt before saving
     */
    @Column(nullable = false)
    private String password;
}
