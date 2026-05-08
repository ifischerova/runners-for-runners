package cz.bezcisobe.backend.util;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Test class to validate BCrypt hashes used in Flyway migration V3__seed_users_and_races.sql
 *
 * This test verifies whether the hashes in the migration file will correctly authenticate users.
 * If this test fails, it means the hashes in the migration file are invalid and need to be regenerated.
 *
 * To generate new valid hashes:
 * 1. Visit https://bcrypt-generator.com/
 * 2. Enter the password and set cost factor to 10
 * 3. Copy the generated hash
 * 4. Replace the hash in V3__seed_users_and_races.sql
 */
public class BCryptHashValidationTest {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Test
    void validateAdmin123Hash() {
        String password = "admin123";
        String hash = "$2a$10$mGsI68a2foSCV/fW.wX4Verb4vYuedKEcx8pcddqKwsHgroCiaD96";

        org.junit.jupiter.api.Assertions.assertTrue(
            encoder.matches(password, hash),
            "Seed hash for 'admin' must verify against BCryptPasswordEncoder"
        );
    }

    @Test
    void validatePassword123Hash() {
        String password = "password123";
        String hash = "$2a$10$XovRDfRfVvmgiXd1rXL7bOTRi/m6KPVmNitbnyUoR97tq8hXh5xfy";

        org.junit.jupiter.api.Assertions.assertTrue(
            encoder.matches(password, hash),
            "Seed hash for 'jana.novakova' must verify against BCryptPasswordEncoder"
        );
    }

    @Test
    void validateIvka123Hash() {
        String password = "ivka123";
        String hash = "$2a$10$4zCsCZ29WwEFxJr6/1DmEeWR.pMMRDzb4ixRtF15u3QPE5W4Gku.y";

        org.junit.jupiter.api.Assertions.assertTrue(
            encoder.matches(password, hash),
            "Seed hash for 'ivka' must verify against BCryptPasswordEncoder"
        );
    }

    @Test
    void generateNewHashes() {
        String[] passwords = {"admin123", "password123", "ivka123"};

        System.out.println("\n=== Generating new BCrypt hashes (cost factor 10) ===\n");
        for (String password : passwords) {
            String hash = encoder.encode(password);
            System.out.println("Password: " + password);
            System.out.println("Hash:     " + hash);
            System.out.println();
        }
        System.out.println("Use these hashes to update V3__seed_users_and_races.sql");
    }
}
