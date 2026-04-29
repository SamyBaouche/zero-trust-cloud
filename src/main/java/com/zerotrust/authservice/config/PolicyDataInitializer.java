package com.zerotrust.authservice.config;

import com.zerotrust.authservice.model.AccessPolicy;
import com.zerotrust.authservice.repository.AccessPolicyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * PolicyDataInitializer seeds the database with a few default {@link AccessPolicy} records.
 * <p>
 * Why this exists:
 * - On a fresh database, the policy table is empty.
 * - Having a few policies makes the demo usable immediately (no manual setup required).
 * <p>
 * This runs once at application startup.
 */
@Configuration
public class PolicyDataInitializer {
    /**
     * Creates a {@link CommandLineRunner} that inserts policies only if the table is empty.
     */
    @Bean
    public CommandLineRunner initPolicies(AccessPolicyRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(AccessPolicy.builder()
                        .resource("AWS_IAM_ADMIN_ROLE")
                        .action("DELETE")
                        .decision("DENY")
                        .minRiskScore(null)
                        .condition(null)
                        .enabled(true)
                        .build());
                repo.save(AccessPolicy.builder()
                        .resource("SECRETS_MANAGER")
                        .action("WRITE")
                        .decision("CHALLENGE")
                        .minRiskScore(50)
                        .condition("location=Unknown")
                        .enabled(true)
                        .build());
                repo.save(AccessPolicy.builder()
                        .resource("AWS_RDS_CUSTOMER_DATABASE")
                        .action("DELETE")
                        .decision("DENY")
                        .minRiskScore(70)
                        .condition(null)
                        .enabled(true)
                        .build());
                repo.save(AccessPolicy.builder()
                        .resource("AWS_S3_FINANCE_BUCKET")
                        .action("WRITE")
                        .decision("CHALLENGE")
                        .minRiskScore(40)
                        .condition("newDevice=true")
                        .enabled(true)
                        .build());
            }
        };
    }
}

