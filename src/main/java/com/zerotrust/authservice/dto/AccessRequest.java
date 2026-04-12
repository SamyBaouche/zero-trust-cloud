package com.zerotrust.authservice.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AccessRequest {

    private String resource;
    private String action;
    private String ipAddress;
    private String location;
    private String device;
}
