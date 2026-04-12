package com.zerotrust.authservice.controller;

import com.zerotrust.authservice.dto.AccessRequest;
import com.zerotrust.authservice.dto.AccessResponse;
import com.zerotrust.authservice.service.AccessService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/access")
public class AccessController {

    private final AccessService accessService;

    public AccessController(AccessService accessService) {
        this.accessService = accessService;
    }

    @PostMapping("/check")
    public AccessResponse checkAccess(@RequestBody AccessRequest request,
                                      Authentication authentication) {
        String userEmail = authentication.getName();
        return accessService.checkAccess(request, userEmail);
    }
}