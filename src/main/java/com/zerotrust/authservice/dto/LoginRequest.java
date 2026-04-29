package com.zerotrust.authservice.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * LoginRequest is a DTO (Data Transfer Object) used to receive login data from the client.
 * <p>
 * This class represents the JSON body sent to the login endpoint (for example: {@code POST /auth/login}).
 */
@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {

    /**
     * User email sent by the client.
     * Example: "john.doe@example.com".
     */
    private String email;

    /**
     * Raw password sent by the client.
     * <p>
     * Important: this is NOT hashed yet. Hashing is done on the backend.
     */
    private String password;
}
