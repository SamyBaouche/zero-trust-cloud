package com.zerotrust.authservice.controller;

import com.zerotrust.authservice.dto.AccessRequest;
import com.zerotrust.authservice.dto.AccessResponse;
import com.zerotrust.authservice.dto.AttackScenarioResponse;
import com.zerotrust.authservice.service.AccessService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AccessController exposes endpoints related to access evaluation and the attack simulator.
 * <p>
 * All endpoints under {@code /access} require authentication (JWT), because the decision/logs
 * are tied to the current user.
 */
@RestController
@RequestMapping("/access")
public class AccessController {

    private final AccessService accessService;

    public AccessController(AccessService accessService) {
        this.accessService = accessService;
    }

    /**
     * Evaluates an access attempt (resource + action + context) and returns the decision.
     * <p>
     * Endpoint: {@code POST /access/check}
     */
    @PostMapping("/check")
    public AccessResponse checkAccess(@RequestBody AccessRequest request,
                                      Authentication authentication) {
        String userEmail = authentication.getName();
        return accessService.checkAccess(request, userEmail);
    }

    /**
     * Returns predefined scenarios used by the UI to simulate suspicious behavior.
     * <p>
     * Endpoint: {@code GET /access/scenarios}
     */
    @GetMapping("/scenarios")
    public List<AttackScenarioResponse> getScenarios() {
        return accessService.getAttackScenarios();
    }

    /**
     * Simulates a scenario by ID and returns the computed decision.
     * <p>
     * Endpoint: {@code POST /access/simulate/{scenarioId}}
     */
    @PostMapping("/simulate/{scenarioId}")
    public AccessResponse simulateScenario(@PathVariable String scenarioId,
                                           Authentication authentication) {
        String userEmail = authentication.getName();
        return accessService.simulateScenario(scenarioId, userEmail);
    }
}