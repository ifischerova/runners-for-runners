# Běžci sobě

A modern carpooling platform for runners going to Czech running races. The
project is a full-stack application with a React + TypeScript frontend and a
Spring Boot + PostgreSQL backend.

## Architecture

```
┌──────────────────────┐      HTTPS / fetch      ┌────────────────────────┐
│  React + TS frontend │ ──────────────────────▶ │  Spring Boot 3.2 API   │
│  Vite, Tailwind, R.R │ ◀────── JWT auth ────── │  Java 17, Spring       │
└──────────────────────┘                         │  Security, Flyway, JPA │
                                                 └─────────────┬──────────┘
                                                               │ JDBC
                                                               ▼
                                                       ┌───────────────┐
                                                       │  PostgreSQL   │
                                                       └───────────────┘
```

## Features

- Browse Czech running races and event details
- Create, accept, and cancel ride OFFERs (driver) and REQUESTs (runner)
- User registration, login, and JWT-protected actions
- Admin role for elevated access
- Fully responsive UI (Tailwind + Bootstrap utilities)
- 26 frontend unit tests (Vitest) + 21 E2E scenarios (Playwright)
- Backend tests with JUnit 5 and Mockito (controllers + service layer)

## Repository layout

```
.
├── src/                 React + TypeScript frontend (Vite)
├── tests/               Playwright E2E specs
├── backend/             Spring Boot 3.2 service
│   ├── pom.xml
│   └── src/main/...     entities, repos, services, controllers, security
└── *.config.ts / *.json build, lint, test configuration
```

## Prerequisites

| Tool       | Version       |
| ---------- | ------------- |
| Node.js    | 20+           |
| npm        | 10+           |
| Java JDK   | 17            |
| Maven      | 3.9+          |
| PostgreSQL | 14+           |

## Frontend

```bash
# Install (with security-hardened .npmrc — ignore-scripts, save-exact, audit)
npm install

# Start dev server on http://localhost:5173
npm run dev

# Lint, unit tests, build
npm run lint
npm test            # watch mode
npm test -- --run   # single pass (CI mode)
npm run build

# E2E (requires backend running for race / login flows)
npm run e2e
npm run e2e:ui      # UI mode for debugging
```

## Backend

### One-time setup

Create the Postgres database and a user matching `application.yml` defaults
(`bezcisobe` / `postgres` / `postgres` — change in `application.yml` for any
non-development environment):

```sql
CREATE DATABASE bezcisobe;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE bezcisobe TO postgres;
```

Flyway will create the schema and seed the reference data, races, users, and
sample rides automatically on first run via migrations `V1`–`V4`.

### Run

```bash
cd backend

# Run unit tests (uses in-memory H2, no Postgres needed)
mvn test

# Start the API on http://localhost:8080
mvn spring-boot:run
```

### REST surface

| Endpoint                       | Method | Auth        | Purpose                            |
| ------------------------------ | ------ | ----------- | ---------------------------------- |
| `/api/auth/register`           | POST   | public      | Create account                     |
| `/api/auth/login`              | POST   | public      | Issue JWT                          |
| `/api/auth/me`                 | GET    | bearer      | Current user                       |
| `/api/races`                   | GET    | public      | List races                         |
| `/api/races/{id}`              | GET    | public      | Race detail                        |
| `/api/rides`                   | GET    | public      | List rides (filterable by `raceId`)|
| `/api/rides`                   | POST   | bearer      | Create OFFER or REQUEST            |
| `/api/rides/{id}`              | DELETE | bearer      | Delete own ride                    |
| `/api/rides/{id}/accept`       | POST   | bearer      | Accept an OFFER                    |
| `/api/rides/{id}/cancel`       | POST   | bearer      | Cancel an acceptance               |
| `/api/reference-data/*`        | GET    | public      | Track lengths, types, calendars    |

## Test accounts (seed data)

| Username        | Password      | Role(s)                |
| --------------- | ------------- | ---------------------- |
| `admin`         | `admin123`    | ROLE_ADMIN + ROLE_USER |
| `jana.novakova` | `password123` | ROLE_USER              |
| `ivka`          | `ivka123`     | ROLE_USER              |

The seed BCrypt hashes were regenerated against
`BCryptPasswordEncoder` and self-verified — `mvn test
-Dtest=BCryptHashValidationTest` will fail loudly if a hash drifts
from its password.

## Documentation

- `TECHNICKA_DOKUMENTACE.md` – Czech-language technical write-up of the
  full-stack architecture, state management, validation rules, design system,
  testing strategy, and security notes.

## Security notes

- npm hardening via `.npmrc` (`ignore-scripts=true`, `save-exact=true`,
  `audit=true`)
- Source maps disabled in production builds
- BCrypt cost-10 password hashing on the backend
- Stateless JWT with HS256, 24 h expiration
- React's automatic XSS escaping; client-side input validation mirrored by
  Bean Validation on the API
