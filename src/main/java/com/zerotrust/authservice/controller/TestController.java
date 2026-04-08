package com.zerotrust.authservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller used for testing public and protected endpoints.
 */
@RestController
public class TestController {

    /**
     * Public test endpoint.
     */
    @GetMapping("/test")
    public String test() {
        return "Auth service is running";
    }

    /**
     * Protected endpoint.
     * Requires a valid JWT token.
     */
    @GetMapping("/test/secure")
    public String secure() {
        return "You accessed a protected endpoint!";
    }
}