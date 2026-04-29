package com.zerotrust.authservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

/**
 * HealthController provides a simple health check endpoint.
 * <p>
 * This is typically used by:
 * - Docker/Kubernetes health probes
 * - Monitoring tools
 * - Quick manual checks while developing
 */
@RestController
@RequestMapping("/health")
public class HealthController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Returns a basic status map and tries a lightweight database query.
     * <p>
     * Endpoint: {@code GET /health}
     */
    @GetMapping
    public Map<String, Object> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "auth-service");
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            status.put("database", "UP");
        } catch (Exception e) {
            status.put("database", "DOWN");
        }
        return status;
    }
}

