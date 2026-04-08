package com.zerotrust.authservice.service;

import com.zerotrust.authservice.dto.AuthResponse;
import com.zerotrust.authservice.dto.LoginRequest;
import com.zerotrust.authservice.dto.RegisterRequest;
import com.zerotrust.authservice.model.User;
import com.zerotrust.authservice.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * This class contains the business logic for authentication.
 *
 * Responsibilities:
 * - Register users
 * - Authenticate users
 * - Hash passwords
 * - Generate JWT tokens
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Constructor injection
     */
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    /**
     * Register a new user.
     */
    public String register(RegisterRequest request) {

        // Prevent duplicate emails
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        // Create new user entity
        User user = new User();

        // Set email
        user.setEmail(request.getEmail());

        // Hash password before saving
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Save in database
        userRepository.save(user);

        return "User registered successfully";
    }

    /**
     * Authenticate user and return JWT token.
     */
    public AuthResponse login(LoginRequest request) {

        // Find user by email or throw error if not found
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Check if raw password matches hashed password stored in DB
        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT token after successful login
        String token = jwtService.generateToken(user.getEmail());

        // Return token inside response DTO
        return new AuthResponse(token);
    }
}
