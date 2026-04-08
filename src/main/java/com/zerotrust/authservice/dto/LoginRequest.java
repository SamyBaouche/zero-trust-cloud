package com.zerotrust.authservice.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO used to receive login data from the client.
 *
 * This class represents the JSON body sent to:
 * POST /auth/login
 */
@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {

    /**
     * User email sent by the client.
     */
    private String email;

    /**
     * Raw password sent by the client.
     */
    private String password;
}
