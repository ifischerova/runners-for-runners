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
        String hash = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

        boolean matches = encoder.matches(password, hash);
        System.out.println("admin123 hash validation: " + (matches ? "VALID" : "INVALID"));
        if (!matches) {
            System.out.println("  Password: " + password);
            System.out.println("  Hash: " + hash);
            System.out.println("  This hash will NOT work for login. Generate a new one at https://bcrypt-generator.com/");
        }
    }

    @Test
    void validatePassword123Hash() {
        String password = "password123";
        String hash = "$2a$10$8KzaNdKIMyOkASCmBKfLku6RMBQOSBHzHbPVPYhKLCe5YSR5qK8qK";

        boolean matches = encoder.matches(password, hash);
        System.out.println("password123 hash validation: " + (matches ? "VALID" : "INVALID"));
        if (!matches) {
            System.out.println("  Password: " + password);
            System.out.println("  Hash: " + hash);
            System.out.println("  This hash will NOT work for login. Generate a new one at https://bcrypt-generator.com/");
        }
    }

    @Test
    void validateIvka123Hash() {
        String password = "ivka123";
        String hash = "$2a$10$VqGMz8.b3CMJkCYxUxKBQeQl8nJvFyLJWigHIB.3O1YMwBuKPLmai";

        boolean matches = encoder.matches(password, hash);
        System.out.println("ivka123 hash validation: " + (matches ? "VALID" : "INVALID"));
        if (!matches) {
            System.out.println("  Password: " + password);
            System.out.println("  Hash: " + hash);
            System.out.println("  This hash will NOT work for login. Generate a new one at https://bcrypt-generator.com/");
        }
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
