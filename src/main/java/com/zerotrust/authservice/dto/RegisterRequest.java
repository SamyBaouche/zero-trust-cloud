package com.zerotrust.authservice.dto;

// Lombok annotation: generates getters automatically (getEmail, getPassword)
import lombok.Getter;

// Lombok annotation: generates setters automatically (setEmail, setPassword)
import lombok.Setter;

// Lombok annotation: creates a default constructor (required by Spring)
import lombok.NoArgsConstructor;


/**
 * DTO (Data Transfer Object) used to receive registration data
 * from the client (frontend or Postman).
 *
 * This class represents the JSON body sent to:
 * POST /auth/register
 */
@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest {

    /**
     * User email sent by the client
     * Example: "test@example.com"
     */
    private String email;

    /**
     * User password sent by the client
     * Example: "password123"
     *
     * IMPORTANT:
     * This is the raw password (NOT hashed yet)
     * It will be hashed later in the service layer
     */
    private String password;
}
