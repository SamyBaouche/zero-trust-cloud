package com.zerotrust.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * AuthResponse is a DTO (Data Transfer Object) returned after a successful authentication.
 * <p>
 * In this project, logging in returns a JWT token. The frontend stores this token and sends it
 * in the "Authorization" header for subsequent requests.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    /**
     * JWT token generated after successful authentication.
     * <p>
     * The client typically sends it as: {@code Authorization: Bearer <token>}.
     */
    private String token;
}