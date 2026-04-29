package com.zerotrust.authservice.repository;

import com.zerotrust.authservice.model.SecurityAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * SecurityAlertRepository provides database access for {@link SecurityAlert}.
 * <p>
 * It exposes convenience methods to fetch recent alerts for dashboards.
 */
public interface SecurityAlertRepository extends JpaRepository<SecurityAlert, Long> {
    /** Returns the 10 most recent alerts across all users (admin-style view). */
    List<SecurityAlert> findTop10ByOrderByCreatedAtDesc();

    /** Returns the 10 most recent alerts for a specific user (case-insensitive email). */
    List<SecurityAlert> findTop10ByUserEmailIgnoreCaseOrderByCreatedAtDesc(String userEmail);
}
