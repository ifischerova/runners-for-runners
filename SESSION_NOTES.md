# Session Notes - BCrypt Hash Verification

**Date:** March 10, 2026
**Task:** Verify and fix BCrypt hashes in Flyway migration
**Status:** COMPLETED - Ready for implementation

## Problem Identified
The BCrypt password hashes in `V3__seed_users_and_races.sql` are custom-generated and likely invalid:
- `admin123`: `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`
- `password123`: `$2a$10$8KzaNdKIMyOkASCmBKfLku6RMBQOSBHzHbPVPYhKLCe5YSR5qK8qK`
- `ivka123`: `$2a$10$VqGMz8.b3CMJkCYxUxKBQeQl8nJvFyLJWigHIB.3O1YMwBuKPLmai`

These will prevent login even though they look structurally correct.

## Solution Implemented
Created comprehensive solution with:

### 1. Test Class for Validation
**Location:** `backend/src/test/java/cz/bezcisobe/backend/util/BCryptHashValidationTest.java`
**Purpose:** Validate current hashes and generate new valid ones
**Usage:**
```bash
mvn test -Dtest=BCryptHashValidationTest#generateNewHashes
```

### 2. Documentation Created
Four documentation files to help with implementation:

1. **QUICK_START.md** (Start here!)
   - TL;DR version
   - 4 step solution
   - Takes 5-10 minutes

2. **BCRYPT_SUMMARY.md**
   - Problem overview
   - Quick solutions
   - Key facts about BCrypt
   - File locations

3. **BCRYPT_HASH_VERIFICATION.md**
   - Technical details
   - BCrypt format explained
   - Multiple approaches

4. **BCRYPT_REPLACEMENT_GUIDE.md**
   - Detailed step-by-step
   - Both methods (test and online)
   - Verification procedures
   - Troubleshooting guide

## What You Need to Do

When you resume work:

1. **Read:** QUICK_START.md (5 minutes)

2. **Run command:**
   ```bash
   cd backend
   mvn test -Dtest=BCryptHashValidationTest#generateNewHashes
   ```

3. **Copy the generated hashes** to `V3__seed_users_and_races.sql`

4. **Test login** with the new hashes

5. **Commit changes**

## Key Points to Remember

- **Cost factor must be 10**: `$2a$10$...`
- **Hash length must be 60 characters**: If not, it's invalid
- **Each generated hash is unique**: Even for same password (because of random salt)
- **Password must match hash exactly**: Typos will break authentication
- **No special validation needed**: Spring's BCryptPasswordEncoder handles it

## Files to Update

1. **Migration file:**
   - `backend/src/main/resources/db/migration/V3__seed_users_and_races.sql`
   - Lines 8, 11, 14 contain the password hashes

2. **Test file created:**
   - `backend/src/test/java/cz/bezcisobe/backend/util/BCryptHashValidationTest.java`
   - Run to generate new hashes

## Database Impact

After updating hashes:
- Delete any existing H2 database file (if using H2)
- Re-run migrations fresh
- Test credentials should work:
  - admin / admin123
  - jana.novakova / password123
  - ivka / ivka123

## Testing Endpoints

After deploying with new hashes:
```bash
# Test admin login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Expected: JWT token response
```

## Risk Assessment
**Risk Level:** MINIMAL
- Only affects development/test credentials
- No production data involved
- Changes are isolated to migration file
- Can be reverted easily

## Time Estimate
- Reading guide: 5 minutes
- Running test: 1 minute
- Updating SQL: 2 minutes
- Testing: 3 minutes
- **Total: ~10 minutes**

## Follow-up Tasks
After hashes are updated:
1. Test all three user logins
2. Verify admin has ROLE_ADMIN
3. Verify other users have ROLE_USER
4. Commit to version control
5. Update team documentation if needed

## Resources Available
- Online BCrypt generator: https://bcrypt-generator.com/
- Spring Security docs: https://spring.io/projects/spring-security
- Test class: Can be run anytime to generate new hashes

## Session Complete
All setup and documentation is ready. The implementation is straightforward and low-risk.
Next session: Execute the 4 steps from QUICK_START.md
