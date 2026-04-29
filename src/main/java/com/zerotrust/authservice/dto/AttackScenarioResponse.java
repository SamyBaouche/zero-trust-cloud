package com.zerotrust.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * AttackScenarioResponse is a DTO returned by the API to describe an attack simulation scenario.
 * <p>
 * The frontend can display these scenarios (title + description) and reuse the embedded access
 * context (resource/action/ip/location/device) to simulate a risky request.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttackScenarioResponse {
    /** Scenario identifier (often a short string like "SCN-001"). */
    private String id;

    /** Short title shown in the UI. */
    private String title;

    /** Longer description explaining what is being simulated. */
    private String description;

    /** Resource used when simulating the access request. */
    private String resource;

    /** Action used when simulating the access request. */
    private String action;

    /** IP address used in the simulated request. */
    private String ipAddress;

    /** Location used in the simulated request. */
    private String location;

    /** Device information used in the simulated request. */
    private String device;
}

