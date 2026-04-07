package com.zerotrust.authservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

// Marks this class as a configuration class
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Disable CSRF protection (for testing purposes only)
                .csrf(csrf -> csrf.disable())

                // Allow all requests without authentication
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )

                // Enable basic authentication (not required here but included by default)
                .httpBasic(Customizer.withDefaults());

        // Return the configured security filter chain
        return http.build();
    }
}