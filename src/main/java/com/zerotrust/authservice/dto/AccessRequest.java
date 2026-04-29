package com.zerotrust.authservice.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * AccessRequest is a DTO (Data Transfer Object) sent by the client when it wants the backend
 * to evaluate an access attempt.
 * <p>
 * Think of it as: "I want to do ACTION on RESOURCE, from this device and location".
 * The backend will use this context to compute a decision and a risk score.
 */
@Getter
@Setter
@NoArgsConstructor
public class AccessRequest {
    /** The resource being accessed (example: "/api/files/123"). */
    private String resource;

    /** The requested action (example: "READ", "UPDATE"). */
    private String action;

    /** Source IP address of the request (example: "198.51.100.5"). */
    private String ipAddress;

    /** Optional user location (example: "Lyon, FR"). */
    private String location;

    /** Optional device information (example: "Firefox on Linux"). */
    private String device;
}
