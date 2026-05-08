# Quick Start: Fix BCrypt Hashes

## TL;DR - Do This Now

### Step 1: Generate Valid Hashes (1 minute)
```bash
cd C:\Users\iva.fischerova\repositories\school-project-2\backend
mvn test -Dtest=BCryptHashValidationTest#generateNewHashes
```

You'll see output like:
```
Password: admin123
Hash:     $2a$10$XXXXX...
```

### Step 2: Copy the New Hashes
Take the long `$2a$10$...` strings from the output.

### Step 3: Update the SQL File
Edit: `backend/src/main/resources/db/migration/V3__seed_users_and_races.sql`

Replace lines with the new hashes (example):
```sql
-- OLD (these are likely invalid)
'$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'

-- NEW (from generated output)
'$2a$10$YOUR_NEWLY_GENERATED_HASH_HERE'
```

### Step 4: Test It Works
```bash
# Reset database (delete H2 file if using H2)
# Start application
mvn spring-boot:run

# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Should return success with JWT token
```

## Why This Matters

Your current hashes look correct BUT they probably won't validate when Spring tries to authenticate users. BCrypt is cryptographic - you can't just guess hashes. You must generate them properly.

## Alternative: If Maven Fails

Go to: https://bcrypt-generator.com/
1. Enter `admin123`, set cost to `10`, click Hash
2. Copy result, paste into SQL for admin user
3. Repeat for other two passwords
4. Save file, test

## Files Modified
- `backend/src/main/resources/db/migration/V3__seed_users_and_races.sql` - Update hashes here

## Files Created
- `backend/src/test/java/cz/bezcisobe/backend/util/BCryptHashValidationTest.java` - Helper test

## Documentation Created
- `BCRYPT_SUMMARY.md` - This summary
- `BCRYPT_HASH_VERIFICATION.md` - Technical details
- `BCRYPT_REPLACEMENT_GUIDE.md` - Step-by-step guide
- `QUICK_START.md` - This file

---
**Time to fix:** 5-10 minutes
**Priority:** High (blocks login functionality)
**Risk:** None (only test credentials affected)
