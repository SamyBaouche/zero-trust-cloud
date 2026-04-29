package com.zerotrust.authservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CorsConfig configures CORS (Cross-Origin Resource Sharing) for this backend.
 * <p>
 * Why this exists:
 * - The React frontend usually runs on a different origin (different port like 5173).
 * - Browsers block cross-origin calls by default.
 * - CORS tells the browser which origins/methods/headers are allowed.
 */
@Configuration
public class CorsConfig {

    /**
     * Defines a Spring MVC configurer that adds CORS rules for all endpoints.
     * <p>
     * Note: we allow localhost/127.0.0.1 on any port to simplify local development.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Apply CORS rules to every API endpoint.
                registry.addMapping("/**")
                        .allowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}