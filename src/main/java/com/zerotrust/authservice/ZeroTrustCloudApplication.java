package com.zerotrust.authservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Zero Trust Cloud Authentication Service.
 * <p>
 * This class bootstraps the Spring Boot application.
  * <p>
 * Responsibilities:
 * - Starts the embedded web server
 * - Loads Spring context and beans
 * - Launches the authentication microservice
  * <p>
 * Usage:
 *   Run the main method to start the backend server.
 */
// This annotation tells Spring Boot to scan components and start the application.
@SpringBootApplication
public class ZeroTrustCloudApplication {
    /**
     * Main method to launch the Spring Boot application.
     * <p>
     * When you run this, Spring Boot starts an embedded web server (Tomcat by default).
     *
     * @param args command-line arguments
     */
    public static void main(String[] args) {
        // This line launches the Spring Boot application
        SpringApplication.run(ZeroTrustCloudApplication.class, args);
    }
}
