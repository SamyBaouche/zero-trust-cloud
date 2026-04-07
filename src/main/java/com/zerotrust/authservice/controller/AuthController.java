package com.zerotrust.authservice.controller;

// Import DTO that contains user registration data (email, password)
import com.zerotrust.authservice.dto.RegisterRequest;

// Import service that contains business logic
import com.zerotrust.authservice.service.AuthService;

// Spring annotations for REST API
import org.springframework.web.bind.annotation.*;


// This annotation tells Spring that this class handles HTTP requests
@RestController

// Base URL for all endpoints in this controller
// All routes will start with /auth
@RequestMapping("/auth")
public class AuthController {

    // This service will handle the business logic (register, login, etc.)
    private final AuthService authService;

    /**
     * Constructor injection
     * Spring automatically injects AuthService here
     *
     * This is the recommended way (clean, testable, professional)
     */
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * This method handles POST requests to /auth/register
     *
     * Example request:
     * POST http://localhost:8081/auth/register
     *
     * Body (JSON):
     * {
     *   "email": "test@example.com",
     *   "password": "password123"
     * }
     */
    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        // @RequestBody converts JSON into a Java object (RegisterRequest)

        // Call the service to handle registration logic
        return authService.register(request);
    }
}