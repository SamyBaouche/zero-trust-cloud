package com.zerotrust.authservice.service;

// Import DTO containing registration data
import com.zerotrust.authservice.dto.RegisterRequest;

// Import User entity (mapped to database)
import com.zerotrust.authservice.model.User;

// Import repository for database operations
import com.zerotrust.authservice.repository.UserRepository;

// Used to hash passwords securely
import org.springframework.security.crypto.password.PasswordEncoder;

// Marks this class as a service (business logic layer)
import org.springframework.stereotype.Service;


/**
 * This class contains the business logic for authentication.
 *
 * Responsibilities:
 * - Register users
 * - Validate data
 * - Secure passwords
 * - Save users in the database
 */
@Service
public class AuthService {

    // Repository used to interact with the database
    private final UserRepository userRepository;

    // Used to hash passwords (BCrypt)
    private final PasswordEncoder passwordEncoder;

    /**
     * Constructor injection
     * Spring automatically provides the dependencies
     */
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Handles user registration
     *
     * @param request contains email and password from client
     * @return success message
     */
    public String register(RegisterRequest request) {

        /**
         * Step 1: Check if email already exists
         *
         * Prevents duplicate users
         */
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        /**
         * Step 2: Create a new User object
         */
        User user = new User();

        /**
         * Step 3: Set email from request
         */
        user.setEmail(request.getEmail());

        /**
         * Step 4: Hash the password BEFORE saving
         *
         * NEVER store raw passwords
         *
         * Example:
         * "password123" → "$2a$10$..."
         */
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        /**
         * Step 5: Save user in database
         */
        userRepository.save(user);

        /**
         * Step 6: Return response
         */
        return "User registered successfully";
    }
}
