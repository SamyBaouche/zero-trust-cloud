package com.zerotrust.authservice.service;

import com.zerotrust.authservice.dto.AuthResponse;
import com.zerotrust.authservice.dto.LoginRequest;
import com.zerotrust.authservice.dto.RegisterRequest;
import com.zerotrust.authservice.model.User;
import com.zerotrust.authservice.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeParseException;
import java.util.regex.Pattern;

/**
 * AuthService contains the business logic for user authentication and registration.
 * <p>
 * Responsibilities:
 * - Register new users (validates input, hashes passwords, saves users)
 * - Authenticate users (checks credentials, generates JWT tokens)
 * - Utility methods for normalization and validation
 * <p>
 * Main methods:
 * - register(RegisterRequest): Handles user registration
 * - login(LoginRequest): Authenticates user and returns JWT
 * <p>
 * Example usage:
 *   authService.register(request);
 *   AuthResponse resp = authService.login(loginRequest);
 */
@Service
public class AuthService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^[+0-9()\\-\\s]{8,20}$");

    /** Repository used to persist and query users. */
    private final UserRepository userRepository;
    /** Password encoder (BCrypt) used to hash and verify passwords. */
    private final PasswordEncoder passwordEncoder;
    /** JWT utility service used to create tokens after login. */
    private final JwtService jwtService;

    /** Constructor injection. */
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    /**
     * Register a new user.
     * <p>
     * This method validates the request, hashes the password, and saves the new {@link User}.
     *
     * @param request registration payload coming from the client
     * @return a simple success message
     * @throws RuntimeException if validation fails or email already exists
     */
    public String register(RegisterRequest request) {
        String email = normalize(request.getEmail());
        String password = request.getPassword() == null ? "" : request.getPassword().trim();
        String firstName = normalize(request.getFirstName());
        String lastName = normalize(request.getLastName());
        String rawDateOfBirth = normalize(request.getDateOfBirth());

        if (isBlank(email) || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new RuntimeException("Please provide a valid email address");
        }
        if (password.length() < 8) {
            throw new RuntimeException("Password must contain at least 8 characters");
        }
        if (isBlank(firstName) || isBlank(lastName)) {
            throw new RuntimeException("First name and last name are required");
        }
        if (isBlank(rawDateOfBirth)) {
            throw new RuntimeException("Date of birth is required");
        }

        LocalDate dateOfBirth = parseDateOfBirth(rawDateOfBirth);

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("Email is already in use");
        }

        User user = new User();

        user.setEmail(email.toLowerCase());
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setDateOfBirth(dateOfBirth);
        user.setCompany(normalize(request.getCompany()));
        user.setJobTitle(normalize(request.getJobTitle()));
        user.setCountry(normalize(request.getCountry()));
        user.setPhone(normalizePhone(request.getPhone()));
        user.setDepartment(normalize(request.getDepartment()));
        user.setSecurityClearance(normalize(request.getSecurityClearance()));

        userRepository.save(user);

        return "User registered successfully";
    }

    /**
     * Authenticate user and return JWT token.
     * <p>
     * The email/password are verified against the database, and if correct, a JWT is returned.
     *
     * @param request login payload coming from the client
     * @return an {@link AuthResponse} containing the JWT token
     * @throws RuntimeException if credentials are invalid
     */
    public AuthResponse login(LoginRequest request) {
        String email = normalize(request.getEmail());
        String password = request.getPassword() == null ? "" : request.getPassword();

        if (isBlank(email) || isBlank(password)) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        boolean passwordMatches = passwordEncoder.matches(
                password,
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(token);
    }

    private LocalDate parseDateOfBirth(String rawDateOfBirth) {
        try {
            LocalDate date = LocalDate.parse(rawDateOfBirth);
            int age = Period.between(date, LocalDate.now()).getYears();
            if (age < 13) {
                throw new RuntimeException("You must be at least 13 years old to register");
            }
            return date;
        } catch (DateTimeParseException exception) {
            throw new RuntimeException("Date of birth must use format YYYY-MM-DD");
        }
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String normalizePhone(String value) {
        String normalized = normalize(value);
        if (normalized == null) {
            return null;
        }
        if (!PHONE_PATTERN.matcher(normalized).matches()) {
            throw new RuntimeException("Phone format is invalid");
        }
        return normalized;
    }

}
