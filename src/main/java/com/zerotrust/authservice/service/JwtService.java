package com.zerotrust.authservice.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

/**
 * JwtService is responsible for generating and validating JWT (JSON Web Token) strings.
 * <p>
 * Beginner explanation:
 * - A JWT is a signed token that proves a user is authenticated.
 * - The backend creates it at login.
 * - The frontend sends it with each request (Authorization: Bearer ...).
 */
@Service
public class JwtService {

    /**
     * Secret key used to sign and verify JWT tokens.
     * <p>
     * In real production systems this should be stored in an environment variable / secret manager.
     */
    private static final String SECRET_KEY = "my-super-secret-key-for-zero-trust-cloud-auth-12345";

    /**
     * Generates a JWT token for a given user email.
     * <p>
     * Current behavior: token expires after 1 hour.
     *
     * @param email user email to store as the JWT subject
     * @return signed JWT string
     */
    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour
                .signWith(getSignInKey())
                .compact();
    }

    /**
     * Extracts the email (the JWT "subject") from a token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Generic method to extract any claim from the token.
     */
    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    /**
     * Validates the token against a user.
     * <p>
     * We consider the token valid if:
     * - the subject matches the provided {@link UserDetails}
     * - the token is not expired
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);

        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    /**
     * Check if the token is expired.
     */
    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    /**
     * Extract all claims from the token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Convert the secret key string into a SecretKey object.
     */
    private SecretKey getSignInKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }
}
