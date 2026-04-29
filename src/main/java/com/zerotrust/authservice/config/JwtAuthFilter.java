package com.zerotrust.authservice.config;

import com.zerotrust.authservice.service.CustomUserDetailsService;
import com.zerotrust.authservice.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * This filter runs once for every HTTP request.
 * <p>
 * It checks if the request contains a JWT token.
 * If yes, it validates the token and authenticates the user.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    /** Service used to extract/validate JWT tokens. */
    private final JwtService jwtService;

    /** Service used to load users from the database for Spring Security. */
    private final CustomUserDetailsService userDetailsService;

    /**
     * Constructor injection.
     */
    public JwtAuthFilter(JwtService jwtService, CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Main filter logic executed for every request.
     * <p>
     * If there is no Bearer token, we do nothing and let the request continue.
     * If there is a token, we try to authenticate the user and set it in the SecurityContext.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Read Authorization header
        final String authHeader = request.getHeader("Authorization");

        // If there is no Authorization header or it doesn't start with Bearer, continue
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Remove "Bearer " prefix to get the raw token
            final String jwtToken = authHeader.substring(7);

            // Extract user email from token
            final String userEmail = jwtService.extractUsername(jwtToken);

            // Only authenticate if userEmail exists and no auth is already set
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Load user details from DB
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                // Validate token
                if (jwtService.isTokenValid(jwtToken, userDetails)) {

                    // Create authentication object recognized by Spring Security
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    // Attach request details
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Save authenticated user in Spring Security context
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception ignored) {
            // Invalid/expired JWT must not break public endpoints.
            SecurityContextHolder.clearContext();
        }

        // Continue to next filter
        filterChain.doFilter(request, response);
    }
}
