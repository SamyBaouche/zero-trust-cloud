package com.zerotrust.authservice.repository;

import com.zerotrust.authservice.model.AccessPolicy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * AccessPolicyRepository provides database access for {@link AccessPolicy} rules.
 * <p>
 * The access engine loads enabled policies and uses them to override decisions when applicable.
 */
public interface AccessPolicyRepository extends JpaRepository<AccessPolicy, Long> {

    /** Returns only policies that are currently enabled (active). */
    List<AccessPolicy> findByEnabledTrue();
}
