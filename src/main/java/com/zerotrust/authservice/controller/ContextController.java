package com.zerotrust.authservice.controller;

import com.zerotrust.authservice.dto.DeleteAccountRequest;
import com.zerotrust.authservice.dto.UpdateProfileRequest;
import com.zerotrust.authservice.dto.UserProfileResponse;
import com.zerotrust.authservice.model.User;
import com.zerotrust.authservice.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Exposes user context and account settings endpoints for authenticated users.
 * <p>
 * Responsibilities:
 * - Return runtime request context (IP and device)
 * - Return the current user's profile
 * - Update the current user's profile
 * - Delete the current user's account after password confirmation
 */
@RestController
@RequestMapping("/context")
public class ContextController {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^[+0-9()\\-\\s]{8,20}$");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ContextController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Returns request context details used by the access engine and UI helpers.
     * <p>
     * Endpoint: {@code GET /context/me}
     *
     * @return a small map containing at least ipAddress and device
     */
    @GetMapping("/me")
    public Map<String, String> getContext(
            HttpServletRequest request,
            @RequestHeader(value = "User-Agent", required = false) String userAgent
    ) {
        Map<String, String> context = new HashMap<>();

        String ip = request.getHeader("X-Forwarded-For");

        if (ip == null || ip.isBlank()) {
            ip = request.getRemoteAddr();
        } else {
            ip = ip.split(",")[0].trim();
        }

        context.put("ipAddress", ip);
        context.put("device", userAgent != null ? userAgent : "Unknown");

        return context;
    }

    /**
     * Returns the profile associated with the authenticated JWT principal.
     * <p>
     * Endpoint: {@code GET /context/profile}
     */
    @GetMapping("/profile")
    public UserProfileResponse getProfile(Principal principal) {
        User user = getCurrentUser(principal);
        return toProfileResponse(user);
    }

    /**
     * Updates editable profile fields.
     * <p>
     * Supports both PUT and POST for compatibility with environments/proxies
     * that may block one of the two methods.
     * <p>
     * Endpoint: {@code PUT /context/profile} (or {@code POST /context/profile})
     */
    @RequestMapping(path = "/profile", method = {RequestMethod.PUT, RequestMethod.POST})
    public UserProfileResponse updateProfile(@RequestBody UpdateProfileRequest request, Principal principal) {
        User user = getCurrentUser(principal);

        if (request.getEmail() != null) {
            String normalizedEmail = normalize(request.getEmail());
            if (normalizedEmail == null || !EMAIL_PATTERN.matcher(normalizedEmail).matches()) {
                throw new RuntimeException("Please provide a valid email address");
            }
            if (!normalizedEmail.equalsIgnoreCase(user.getEmail())
                    && userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
                throw new RuntimeException("Email is already in use");
            }
            user.setEmail(normalizedEmail.toLowerCase());
        }

        if (request.getFirstName() != null) {
            user.setFirstName(normalize(request.getFirstName()));
        }
        if (request.getLastName() != null) {
            user.setLastName(normalize(request.getLastName()));
        }
        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(parseDateOfBirth(request.getDateOfBirth()));
        }
        if (request.getCompany() != null) {
            user.setCompany(normalize(request.getCompany()));
        }
        if (request.getJobTitle() != null) {
            user.setJobTitle(normalize(request.getJobTitle()));
        }
        if (request.getCountry() != null) {
            user.setCountry(normalize(request.getCountry()));
        }
        if (request.getPhone() != null) {
            user.setPhone(normalizePhone(request.getPhone()));
        }
        if (request.getDepartment() != null) {
            user.setDepartment(normalize(request.getDepartment()));
        }
        if (request.getSecurityClearance() != null) {
            user.setSecurityClearance(normalize(request.getSecurityClearance()));
        }

        userRepository.save(user);
        return toProfileResponse(user);
    }

    /**
     * Deletes the authenticated account after validating the provided password.
     * <p>
     * Endpoint: {@code DELETE /context/account}
     */
    @DeleteMapping("/account")
    public String deleteAccount(@RequestBody DeleteAccountRequest request, Principal principal) {
        User user = getCurrentUser(principal);
        String password = request == null ? null : request.getPassword();

        if (password == null || password.isBlank()) {
            throw new RuntimeException("Password is required to delete account");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        userRepository.delete(user);
        return "Account deleted successfully";
    }

    private User getCurrentUser(Principal principal) {
        if (principal == null || principal.getName() == null || principal.getName().isBlank()) {
            throw new RuntimeException("Unauthorized user profile request");
        }

        String email = principal.getName().trim();
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User profile not found"));
    }

    private UserProfileResponse toProfileResponse(User user) {
        return new UserProfileResponse(
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                toIsoDate(user.getDateOfBirth()),
                user.getCompany(),
                user.getJobTitle(),
                user.getCountry(),
                user.getPhone(),
                user.getDepartment(),
                user.getSecurityClearance()
        );
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
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

    private LocalDate parseDateOfBirth(String rawDateOfBirth) {
        String normalized = normalize(rawDateOfBirth);
        if (normalized == null) {
            return null;
        }
        try {
            LocalDate date = LocalDate.parse(normalized);
            int age = Period.between(date, LocalDate.now()).getYears();
            if (age < 13) {
                throw new RuntimeException("You must be at least 13 years old");
            }
            return date;
        } catch (DateTimeParseException exception) {
            throw new RuntimeException("Date of birth must use format YYYY-MM-DD");
        }
    }

    private String toIsoDate(LocalDate date) {
        return date == null ? null : date.toString();
    }
}
