package com.zerotrust.authservice.repository;

// Import the User entity (mapped to the database table)
import com.zerotrust.authservice.model.User;

// Spring Data JPA interface that provides built-in database operations
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


/**
 * Repository interface for User entity.
 *
 * This interface allows you to interact with the database
 * without writing SQL queries manually.
 *
 * Spring automatically implements this at runtime.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by email
     *
     * Example:
     * SELECT * FROM users WHERE email = ?
     *
     * Optional<User> means:
     * - user may exist
     * - or may not exist (null-safe)
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if a user already exists by email
     *
     * Example:
     * SELECT COUNT(*) > 0 FROM users WHERE email = ?
     *
     * Returns:
     * - true → email already exists
     * - false → email available
     */
    boolean existsByEmail(String email);
}
