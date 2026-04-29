package com.zerotrust.authservice.repository;

import com.zerotrust.authservice.model.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * AccessLogRepository provides database access methods for {@link AccessLog}.
 * <p>
 * Spring Data JPA generates the implementation automatically based on method names.
 */
public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {

    /**
     * Returns all access logs for a given user email (case-insensitive), ordered from newest to oldest.
     */
    List<AccessLog> findAllByUserEmailIgnoreCaseOrderByCreatedAtDesc(String userEmail);
}
