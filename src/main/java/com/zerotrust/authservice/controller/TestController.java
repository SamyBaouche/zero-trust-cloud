package com.zerotrust.authservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// Marks this class as a REST controller (handles HTTP requests)
@RestController
public class TestController {

    // Maps HTTP GET requests to /test endpoint
    @GetMapping("/test")
    public String test() {
        // Returns a simple response to verify the service is running
        return "Auth service is running";
    }
}
