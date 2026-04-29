package com.zerotrust.authservice.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DeleteAccountRequest is a DTO sent by the client when a user wants to delete their account.
 * <p>
 * The password is required as a confirmation step (so someone cannot delete your account if they
 * only have access to your browser session).
 */
@Getter
@Setter
@NoArgsConstructor
public class DeleteAccountRequest {
    /** The current (raw) password provided by the user for confirmation. */
    private String password;
}

