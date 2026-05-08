# BCrypt Hash Verification for Flyway Migration

## Issue Status
The current hashes in `V3__seed_users_and_races.sql` appear to be made-up and may not validate properly with actual BCrypt verification.

## Current Hashes in File
```
admin123   -> $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
password123 -> $2a$10$8KzaNdKIMyOkASCmBKfLku6RMBQOSBHzHbPVPYhKLCe5YSR5qK8qK
ivka123    -> $2a$10$VqGMz8.b3CMJkCYxUxKBQeQl8nJvFyLJWigHIB.3O1YMwBuKPLmai
```

## BCrypt Hash Format
A valid BCrypt hash has the format: `$2a$10$[22-character-salt][31-character-hash]`

- Prefix: `$2a$` (algorithm identifier and version)
- Cost factor: `10` (represents 2^10 = 1024 iterations)
- Salt: 22 characters (base64-encoded 16 bytes)
- Hash: 31 characters (base64-encoded 24 bytes)
- Total length: 60 characters

## Validation Approach

Since we cannot run Java code directly in this environment, here are your options:

### Option 1: Use an Online BCrypt Verifier (RECOMMENDED)
1. Go to: https://bcrypt-generator.com/ or https://www.dailycred.com/article/bcrypt-generator
2. Enter password (e.g., "admin123")
3. Generate hash with cost factor 10
4. Copy the generated hash
5. Use the verify function to confirm password matches

### Option 2: Use Spring Boot Startup
When your application first runs, BCrypt will validate the password hashes. If they're invalid:
- The application may start but users won't be able to login
- Check application logs for any BCrypt validation errors

### Option 3: Use a Test Class
Create a simple test in `AuthServiceTest.java` or similar to verify:
```java
@Test
public void testBcryptHashes() {
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // Test admin123
    String hash1 = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
    assertTrue(encoder.matches("admin123", hash1), "admin123 hash failed");

    // Test password123
    String hash2 = "$2a$10$8KzaNdKIMyOkASCmBKfLku6RMBQOSBHzHbPVPYhKLCe5YSR5qK8qK";
    assertTrue(encoder.matches("password123", hash2), "password123 hash failed");

    // Test ivka123
    String hash3 = "$2a$10$VqGMz8.b3CMJkCYxUxKBQeQl8nJvFyLJWigHIB.3O1YMwBuKPLmai";
    assertTrue(encoder.matches("ivka123", hash3), "ivka123 hash failed");
}
```

## RECOMMENDED ACTION
Since the hashes you have are custom-generated and may not be valid, I recommend:

1. Use an online BCrypt generator tool to create valid hashes
2. Replace the hashes in `V3__seed_users_and_races.sql` with the generated ones
3. Test by running the application and attempting to login

## Known Good BCrypt Hash Examples
For reference, here are BCrypt hashes that validate correctly (cost 10):

- Password "password" hashes commonly to variations like:
  - `$2a$10$dXJ3SW6G7P50eS3WsxJVmeCzarqeaZmwo2q45CnDQldzR5iPl/J9.`

The exact hash varies because BCrypt includes a random salt, so the same password will generate different hashes each time.

## Next Steps

### Quick Verification (Recommended)
1. Run the test class: `BCryptHashValidationTest.java`
   - Located at: `backend/src/test/java/cz/bezcisobe/backend/util/BCryptHashValidationTest.java`
   - Command: `mvn test -Dtest=BCryptHashValidationTest#generateNewHashes`

2. This will either:
   - Confirm the current hashes are VALID (and login will work)
   - Show that hashes are INVALID (need replacement)

### If Hashes Are Invalid
1. Run the `generateNewHashes()` test method to create valid hashes
2. Copy the generated hashes
3. Replace the old ones in `V3__seed_users_and_races.sql`

### Alternative: Online Generator
If you prefer an online tool:
1. Go to https://bcrypt-generator.com/
2. For each password, set cost factor to **10** (important for consistency)
3. Generate the hash
4. Replace the hash in the SQL file

### Validate Before Deploying
After updating the migration:
1. Delete the database (or use a fresh one)
2. Run the application to re-apply migrations
3. Test login with credentials:
   - Username: `admin`, Password: `admin123`
   - Username: `jana.novakova`, Password: `password123`
   - Username: `ivka`, Password: `ivka123`

## Security Note
These are test/development credentials only. For production:
- Use strong, unique passwords
- Never commit credentials to version control
- Use environment variables or secure credential management

## Test File Location
The validation test has been created at:
```
backend/src/test/java/cz/bezcisobe/backend/util/BCryptHashValidationTest.java
```

Run with:
```bash
# Validate current hashes
mvn test -Dtest=BCryptHashValidationTest

# Generate new valid hashes
mvn test -Dtest=BCryptHashValidationTest#generateNewHashes
```
