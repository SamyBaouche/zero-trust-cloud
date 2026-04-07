package com.zerotrust.authservice.config;

// Spring annotation to declare this class as a configuration class
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// Used to customize default security behavior
import org.springframework.security.config.Customizer;

// Main class to configure HTTP security (routes, auth, etc.)
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

// Used to hash passwords securely
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

// Represents the security filter chain (core of Spring Security)
import org.springframework.security.web.SecurityFilterChain;


// Marks this class as a configuration class for Spring
@Configuration
public class SecurityConfig {

    /**
     * This method defines the security rules for your application.
     * It tells Spring Security:
     * - which endpoints are protected
     * - which are public
     * - how authentication works
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Disable CSRF protection
                // CSRF is useful for browser apps, but we disable it for APIs (like yours)
                .csrf(csrf -> csrf.disable())

                // Define authorization rules
                .authorizeHttpRequests(auth -> auth

                        // Allow ALL requests without authentication (temporary for development)
                        // Later you will restrict this (e.g. only /auth/register and /auth/login public)
                        .anyRequest().permitAll()
                )

                // Enables HTTP Basic authentication (username/password popup in browser)
                // Not needed for your project, but kept for now
                .httpBasic(Customizer.withDefaults());

        // Build and return the security configuration
        return http.build();
    }

    /**
     * This bean defines how passwords are encoded (hashed)
     * NEVER store plain passwords in database
     *
     * BCrypt is the industry standard:
     * - hashes passwords
     * - adds salt automatically
     * - protects against brute force attacks
     */
    @Bean
    public PasswordEncoder passwordEncoder() {

        // Create a BCrypt encoder instance
        return new BCryptPasswordEncoder();
    }
}