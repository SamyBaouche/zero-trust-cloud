package com.zerotrust.authservice.service;

import com.zerotrust.authservice.model.User;
import com.zerotrust.authservice.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * CustomUserDetailsService is used by Spring Security to load a user from the database.
 * <p>
 * It converts our {@link User} entity into Spring Security's {@link UserDetails} object.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    /** Repository used to fetch users from the database. */
    private final UserRepository userRepository;

    /** Constructor injection. */
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Loads a user by email.
     * <p>
     * Spring Security calls this method when it needs user details to authenticate a request.
     *
     * @param email the email (username) to search
     * @return a Spring Security {@link UserDetails} object
     * @throws UsernameNotFoundException if no user exists for that email
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // Find the user in the database by email
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Convert our User entity into Spring Security's built-in UserDetails implementation.
        // For now, every authenticated user receives a basic role: ROLE_USER.
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}
