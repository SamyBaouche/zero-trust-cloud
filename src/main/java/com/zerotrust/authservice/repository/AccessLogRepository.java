package com.zerotrust.authservice.repository;

import com.zerotrust.authservice.model.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {
}
