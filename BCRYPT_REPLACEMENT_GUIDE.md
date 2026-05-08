# BCrypt Hash Replacement Guide

## Problem Statement
You have inserted BCrypt hashes into `V3__seed_users_and_races.sql` that may not be valid. This will prevent users from logging in.

## Current Setup
- Migration file: `backend/src/main/resources/db/migration/V3__seed_users_and_races.sql`
- Users being seeded:
  - `admin` / `admin123`
  - `jana.novakova` / `password123`
  - `ivka` / `ivka123`

## How to Fix

### Method 1: Run Test to Generate New Hashes (Recommended)

**Step 1: Run the validation test**
```bash
cd backend
mvn test -Dtest=BCryptHashValidationTest#generateNewHashes
```

**Output will look like:**
```
=== Generating new BCrypt hashes (cost factor 10) ===

Password: admin123
Hash:     $2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

Password: password123
Hash:     $2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

Password: ivka123
Hash:     $2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

Use these hashes to update V3__seed_users_and_races.sql
```

**Step 2: Copy the hashes**
- Take the generated hash values (the long strings starting with `$2a$10$`)

**Step 3: Update the migration file**
- Open: `backend/src/main/resources/db/migration/V3__seed_users_and_races.sql`
- Replace the old hashes in the INSERT statements with the new generated ones
- Keep the hash for each user aligned with their password

### Method 2: Use Online Generator

**Step 1: Visit the generator**
- Go to: https://bcrypt-generator.com/

**Step 2: Generate each hash**
1. First hash:
   - Password field: Enter `admin123`
   - Cost factor: Set to `10` (important!)
   - Click "Hash"
   - Copy the result

2. Second hash:
   - Password field: Enter `password123`
   - Cost factor: Set to `10`
   - Click "Hash"
   - Copy the result

3. Third hash:
   - Password field: Enter `ivka123`
   - Cost factor: Set to `10`
   - Click "Hash"
   - Copy the result

**Step 3: Update migration file**
Replace the corresponding hashes in:
```sql
INSERT INTO users (id, username, email, password, first_name, last_name, city) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin', 'admin@bezcisobe.cz',
     'PASTE_NEW_ADMIN123_HASH_HERE',
     'Admin', 'User', NULL),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'jana.novakova', 'jana@example.cz',
     'PASTE_NEW_PASSWORD123_HASH_HERE',
     'Jana', 'Nováková', 'Praha'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'ivka', 'ivka@bezcisobe.cz',
     'PASTE_NEW_IVKA123_HASH_HERE',
     'Ivka', 'Fischerová', 'Praha');
```

## Verification

### Before deploying to a test environment:

**Step 1: Reset your database**
```bash
# If using Docker or local database, delete and recreate it
# Or add this to your migration cleanup process
```

**Step 2: Run the application**
```bash
mvn spring-boot:run
```

**Step 3: Test login credentials**
Use Postman, curl, or your frontend to test:

```bash
# Test admin user
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test jana user
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"jana.novakova","password":"password123"}'

# Test ivka user
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ivka","password":"ivka123"}'
```

Expected response (successful):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "username": "admin",
  "roles": ["ROLE_USER", "ROLE_ADMIN"]
}
```

Expected response (failure - invalid hash):
```json
{
  "error": "Invalid credentials"
}
```

## Understanding BCrypt Hash Format

A valid BCrypt hash looks like:
```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

Breaking it down:
- `$2a$` - Algorithm identifier (BCrypt version 2a)
- `10` - Cost factor (2^10 = 1024 iterations, standard for security)
- `N9qo8uLOickgx2ZMRZoMy` - 22 character salt (base64-encoded)
- `eIjZAgcfl7p92ldGxad68LJZdL17lhWy` - 31 character hash (base64-encoded)
- **Total length: Always 60 characters**

If your hash is not 60 characters, it's definitely invalid!

## Troubleshooting

### "Login fails even with new hashes"
1. Check that the hash is exactly 60 characters
2. Verify the password matches the one in the hash comments
3. Make sure you're using username, not email (username is the login field)
4. Check application logs for BCrypt errors

### "Can't generate hashes from test"
- Make sure Maven is installed: `mvn --version`
- Run from the `backend` directory
- Check that you have Spring Security in your dependencies

### "Hashes don't match"
- The hashes you generated won't be identical to the examples shown here
- That's normal! BCrypt includes random salt, so each hash is unique
- What matters is that the password validates against the hash you generated

## Important Notes
- Each time you run the test, it generates new hashes (because of random salt)
- The password must match the hash exactly
- Cost factor of `10` is standard; don't change it
- These are development credentials only
- In production, use proper password management and environment variables
