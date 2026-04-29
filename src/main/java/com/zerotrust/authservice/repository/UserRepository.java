package com.zerotrust.authservice.repository;

import com.zerotrust.authservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


/**
 * UserRepository is the Spring Data JPA repository for {@link User}.
 * <p>
 * It lets the service layer load and store users without writing SQL manually.
 * Spring generates the implementation automatically at runtime.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /** Finds a user by an exact (case-sensitive) email match. */
    Optional<User> findByEmail(String email);

    /**
     * Finds a user by email, ignoring case.
     * <p>
     * Returns an {@link Optional} so callers can handle "user not found" safely.
     */
    Optional<User> findByEmailIgnoreCase(String email);

    /**
     * Checks if a user already exists for the given email (case-insensitive).
     * <p>
     * Useful for validation during registration or email updates.
     */
    boolean existsByEmailIgnoreCase(String email);
}
