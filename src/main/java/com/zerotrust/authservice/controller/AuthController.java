package com.zerotrust.authservice.controller;

import com.zerotrust.authservice.dto.AuthResponse;
import com.zerotrust.authservice.dto.LoginRequest;
import com.zerotrust.authservice.dto.RegisterRequest;
import com.zerotrust.authservice.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * Controller responsible for authentication endpoints.
 * <p>
 * This class exposes routes for:
 * - user registration
 * - user login
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    /**
     * Constructor injection.
     */
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Registers a new user.
     * <p>
     * Endpoint: {@code POST /auth/register}
     *
     * @param request registration payload
     * @return a simple success message
     */
    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        try {
            return authService.register(request);
        } catch (RuntimeException exception) {
            throw mapToHttpException(exception);
        }
    }

    /**
     * Authenticates a user and returns a JWT token.
     * <p>
     * Endpoint: {@code POST /auth/login}
     *
     * @param request login payload
     * @return JWT token wrapper
     */
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        try {
            return authService.login(request);
        } catch (RuntimeException exception) {
            throw mapToHttpException(exception);
        }
    }

    /**
     * Converts a business exception into a proper HTTP status for the client.
     * <p>
     * This keeps controller methods clean while still returning useful statuses
     * like 401 (unauthorized) or 409 (conflict).
     */
    private ResponseStatusException mapToHttpException(RuntimeException exception) {
        String message = exception.getMessage() == null ? "Authentication request failed" : exception.getMessage();

        if (message.contains("already in use")) {
            return new ResponseStatusException(HttpStatus.CONFLICT, message, exception);
        }
        if (message.contains("Please wait")) {
            return new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, message, exception);
        }
        if (message.contains("Invalid email or password")) {
            return new ResponseStatusException(HttpStatus.UNAUTHORIZED, message, exception);
        }

        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message, exception);
    }
}