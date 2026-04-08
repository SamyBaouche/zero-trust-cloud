package com.zerotrust.authservice.controller;

import com.zerotrust.authservice.dto.AuthResponse;
import com.zerotrust.authservice.dto.LoginRequest;
import com.zerotrust.authservice.dto.RegisterRequest;
import com.zerotrust.authservice.service.AuthService;
import org.springframework.web.bind.annotation.*;

/**
 * Controller responsible for authentication endpoints.
 *
 * This class exposes routes for:
 * - user registration
 * - user login
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    /**
     * Constructor injection
     */
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Register a new user.
     */
    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    /**
     * Authenticate a user and return a JWT token.
     */
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}