package com.zerotrust.authservice.service;

import com.zerotrust.authservice.model.User;
import com.zerotrust.authservice.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * This service is used by Spring Security to load a user from the database.
 *
 * It converts your User entity into Spring Security's UserDetails object.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    // Repository used to fetch users from the database
    private final UserRepository userRepository;

    /**
     * Constructor injection
     */
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Load a user by email.
     *
     * Spring Security calls this method when it needs user details.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // Find the user in the database by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        /**
         * Convert your User entity into Spring Security's User object.
         *
         * For now, we give every user a basic role: ROLE_USER
         */
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}
