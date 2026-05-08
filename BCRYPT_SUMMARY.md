# BCrypt Hash Verification - Summary

## Issue
The BCrypt hashes in `V3__seed_users_and_races.sql` are custom-generated and likely **not valid**. This means users won't be able to login with their credentials.

Current hashes:
```
admin123   -> $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
password123 -> $2a$10$8KzaNdKIMyOkASCmBKfLku6RMBQOSBHzHbPVPYhKLCe5YSR5qK8qK
ivka123    -> $2a$10$VqGMz8.b3CMJkCYxUxKBQeQl8nJvFyLJWigHIB.3O1YMwBuKPLmai
```

## Quick Solution (5 minutes)

### Option A: Generate Valid Hashes Using Test
```bash
cd backend
mvn test -Dtest=BCryptHashValidationTest#generateNewHashes
```
This will output valid hashes you can copy into the SQL file.

### Option B: Use Online Tool
1. Go to https://bcrypt-generator.com/
2. For each password, enter it and set cost factor to `10`
3. Generate and copy the hash
4. Replace in SQL file

## What Was Created For You

### 1. Test Class
**File:** `backend/src/test/java/cz/bezcisobe/backend/util/BCryptHashValidationTest.java`

This test class can:
- Validate whether current hashes work
- Generate new valid hashes automatically
- Run with: `mvn test -Dtest=BCryptHashValidationTest`

### 2. Documentation Files
- `BCRYPT_HASH_VERIFICATION.md` - Technical details about BCrypt format and validation
- `BCRYPT_REPLACEMENT_GUIDE.md` - Step-by-step instructions for replacing hashes
- `BCRYPT_SUMMARY.md` - This file (quick reference)

## Key Facts About BCrypt

1. **Format:** `$2a$10$[22-char-salt][31-char-hash]` (always 60 characters)
2. **Cost Factor:** Set to `10` for security (2^10 = 1024 iterations)
3. **Random Salt:** Each generated hash is unique, even for the same password
4. **Validation:** Spring's BCryptPasswordEncoder will verify password against hash

## Next Actions

1. **Verify Current Hashes**
   ```bash
   mvn test -Dtest=BCryptHashValidationTest
   ```

2. **If invalid:** Generate new hashes
   ```bash
   mvn test -Dtest=BCryptHashValidationTest#generateNewHashes
   ```

3. **Update the SQL file** with generated hashes

4. **Test Login**
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

## Files Involved

| File | Purpose |
|------|---------|
| `backend/src/main/resources/db/migration/V3__seed_users_and_races.sql` | Contains user seed data with passwords |
| `backend/src/main/java/cz/bezcisobe/backend/config/SecurityConfig.java` | Defines BCryptPasswordEncoder bean |
| `backend/src/test/java/cz/bezcisobe/backend/util/BCryptHashValidationTest.java` | NEW - Test to validate/generate hashes |

## Why This Matters

Without valid BCrypt hashes:
- Users cannot login
- Application will not throw errors (hashes look correct structurally)
- Authentication will silently fail
- No indication in logs that hashes are invalid

## Cost Factor Explanation

The `10` in `$2a$10$...` means:
- 2^10 = 1024 iterations
- Takes longer to compute (slow is good for security)
- Consistent across your application
- Don't change unless you understand the implications

## Prevention for Future

1. Always generate BCrypt hashes using actual BCrypt libraries
2. Never manually create or guess BCrypt hashes
3. Use online tools or code to generate them
4. Always verify generated hashes work before committing

## Support

If hashes still don't work after replacement:
1. Verify hash is exactly 60 characters
2. Ensure password matches the hash metadata
3. Check Spring Security configuration
4. Review application logs for exceptions
5. Test with simple password first (no special chars)
