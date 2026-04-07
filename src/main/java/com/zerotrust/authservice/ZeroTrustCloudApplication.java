package com.zerotrust.authservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// This annotation tells Spring Boot to start the application
@SpringBootApplication
public class ZeroTrustCloudApplication {

    public static void main(String[] args) {
        // This line launches the Spring Boot application
        SpringApplication.run(ZeroTrustCloudApplication.class, args);
    }
}
