package com.zerotrust.authservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Basic Spring Boot smoke test.
 * <p>
 * The goal is simply to verify that the Spring application context starts without errors.
 * If this test fails, it usually means a bean configuration problem (missing property, DB issue, etc.).
 */
@SpringBootTest
class ZeroTrustCloudApplicationTests {

    /** Loads the Spring context. There are no assertions: startup success is the test. */
    @Test
    void contextLoads() {
    }

}
