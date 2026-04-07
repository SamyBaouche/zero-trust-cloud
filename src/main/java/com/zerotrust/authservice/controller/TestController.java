package com.zerotrust.authservice.controller;

// Import annotation to map HTTP GET requests
import org.springframework.web.bind.annotation.GetMapping;

// Import annotation to mark this class as a REST controller
import org.springframework.web.bind.annotation.RestController;


/**
 * This controller is used only for testing purposes.
 *
 * It helps verify that:
 * - the backend is running
 * - the server is reachable
 * - Spring Boot is correctly configured
 */
@RestController
public class TestController {

    /**
     * This method handles GET requests to /test
     *
     * Example:
     * http://localhost:8081/test
     *
     * If this returns a response, it means the backend is working.
     */
    @GetMapping("/test")
    public String test() {

        // Simple response message
        return "Auth service is running";
    }
}
