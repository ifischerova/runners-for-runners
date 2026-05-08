# Běžci sobě

Full-stack carpooling platform for runners going to Czech running races. The
project pairs a React + TypeScript frontend with a Spring Boot + PostgreSQL
backend that demonstrates layered architecture, JWT authentication,
role-based authorization, validation, OpenAPI documentation, logging, and
monitoring.

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

### Backend layers

```
controller  →  service  →  repository  →  entity (JPA)
   │             │            │
   ↓             ↓            └──→  PostgreSQL
   DTO          DTO
(request /    (mapper)
 response)
```

Cross-cutting: `config/` (Security, CORS, OpenAPI), `security/` (JWT
filter/provider/UserDetails), `validation/` (custom `@ValidRideRequest`
constraint), `exception/` (typed exceptions + global handler).

## Features

- Browse Czech running races; filter by name/place/date with pagination
- Create, update, accept, and cancel ride OFFERs and REQUESTs
- User registration, login, and JWT-protected actions
- Two roles: `ROLE_USER` and `ROLE_ADMIN`; admin-only endpoints enforced via
  `@PreAuthorize` and URL filter (defence in depth)
- Custom cross-field validation for ride creation (`@ValidRideRequest`)
- OpenAPI 3 documentation at **`/swagger-ui.html`** with the JWT bearer
  scheme so endpoints can be exercised directly from the UI
- Operational monitoring via Spring Boot Actuator
  (`/actuator/health`, `/actuator/info`)
- Structured SLF4J logging at INFO/WARN/ERROR levels for business events,
  validation failures, and unexpected errors
- 26 frontend unit tests (Vitest) + 21 E2E scenarios (Playwright)
- Backend tests with JUnit 5 + Mockito + Spring MockMvc + Spring Security
  Test (controllers, service layer, custom validator)

## Prerequisites

| Tool       | Version |
| ---------- | ------- |
| Node.js    | 20+     |
| npm        | 10+     |
| Java JDK   | 17      |
| Maven      | 3.9+    |
| PostgreSQL | 14+     |

## Frontend

```bash
npm install
npm run dev          # http://localhost:5173
npm run lint
npm test -- --run    # 26 unit tests, single pass
npm run build        # tsc + Vite, ESLint clean, build clean
npm run e2e          # Playwright (Chromium + Firefox)
```

## Backend

### One-time setup

```sql
CREATE DATABASE bezcisobe;
-- The application connects as user 'postgres' / password 'postgres' by default
-- (override in application.yml for non-development environments).
```

Flyway creates the schema and seeds reference data, races, users, and sample
rides automatically on first run via migrations `V1`–`V4`.

### Run

```bash
cd backend

mvn test                # JUnit 5 against in-memory H2 (no Postgres needed)
mvn spring-boot:run     # API on http://localhost:8080
```

### REST surface

| Endpoint                              | Method | Auth         | Purpose                                   |
| ------------------------------------- | ------ | ------------ | ----------------------------------------- |
| `/api/auth/register`                  | POST   | public       | Create account                            |
| `/api/auth/login`                     | POST   | public       | Issue JWT                                 |
| `/api/auth/me`                        | GET    | bearer       | Current user                              |
| `/api/races`                          | GET    | public       | List all races                            |
| `/api/races/search`                   | GET    | public       | Paginated search by name/place/date       |
| `/api/races/{id}`                     | GET    | public       | Race detail                               |
| `/api/rides?raceId={id}`              | GET    | public       | List rides for a race                     |
| `/api/rides`                          | POST   | bearer       | Create OFFER or REQUEST                   |
| `/api/rides/{id}`                     | PUT    | bearer       | Update own ride                           |
| `/api/rides/{id}`                     | DELETE | bearer       | Delete own ride                           |
| `/api/rides/{id}/accept`              | POST   | bearer       | Accept an OFFER                           |
| `/api/rides/{id}/cancel`              | POST   | bearer       | Cancel an acceptance                      |
| `/api/reference/track-lengths`        | GET    | public       | Track-length enum                         |
| `/api/reference/track-types`          | GET    | public       | Track-type enum                           |
| `/api/reference/race-calendars`       | GET    | public       | Race calendars (years)                    |
| **`/api/admin/users`**                | GET    | **ADMIN**    | Paginated user list (search via `?q=`)    |
| **`/api/admin/rides/{id}`**           | DELETE | **ADMIN**    | Force-delete any ride                     |

### API documentation (OpenAPI 3 / Swagger UI)

After starting the backend:

- **Swagger UI**: <http://localhost:8080/swagger-ui.html>
- **Raw spec (JSON)**: <http://localhost:8080/v3/api-docs>

The Swagger UI exposes the JWT bearer scheme — click **Authorize**, paste a
token from `POST /api/auth/login`, and authenticated endpoints become
callable from the page.

### Monitoring (Spring Boot Actuator)

- **Liveness / readiness**: <http://localhost:8080/actuator/health>
- **Build / version info**: <http://localhost:8080/actuator/info>

Health details are visible only to authenticated callers
(`management.endpoint.health.show-details=when_authorized`).

### Validation

Beyond the standard `@NotBlank` / `@Email` / `@Size` annotations, the project
ships a custom cross-field constraint:

- **`@ValidRideRequest`** (in `cz.bezcisobe.backend.validation`) — enforces
  that a ride of `type=OFFER` has a non-empty `car` and `availableSeats >= 1`,
  and that a ride of `type=REQUEST` does **not** carry a `car`. Failures are
  reported per-field via `ConstraintValidatorContext` and mapped to a 400
  `ErrorResponse` by `GlobalExceptionHandler`.

### Logging

SLF4J + Logback (auto-configured by Spring Boot). The configuration in
`application.yml` sets:

- Root and `cz.bezcisobe.backend` at **INFO** by default
- Spring Security at **WARN** to suppress noise
- Hibernate SQL at **WARN**

Business events log at INFO (login, ride created/accepted), client errors at
WARN (validation, not found, unauthorized attempts), and unexpected failures
at ERROR (`GlobalExceptionHandler#handleUnexpected`).

## Test accounts (seed)

| Username        | Password      | Roles                          |
| --------------- | ------------- | ------------------------------ |
| `admin`         | `admin123`    | `ROLE_ADMIN`, `ROLE_USER`      |
| `jana.novakova` | `password123` | `ROLE_USER`                    |
| `ivka`          | `ivka123`     | `ROLE_USER`                    |

The seed BCrypt hashes were regenerated against
`BCryptPasswordEncoder` and self-verified — `mvn test
-Dtest=BCryptHashValidationTest` will fail loudly if a hash drifts from
its password.

## Documentation

- `TECHNICKA_DOKUMENTACE.md` – Czech-language technical write-up of the
  full-stack architecture, state management, validation rules, logging,
  monitoring, design system, testing strategy, and security notes.

## Security notes

- npm hardening via `.npmrc` (`ignore-scripts=true`, `save-exact=true`,
  `audit=true`)
- Source maps disabled in production frontend builds
- BCrypt cost-10 password hashing on the backend
- Stateless JWT with HS256, 24 h expiration; secret in `application.yml`
  is suitable for local development only — move to a secret store before
  any real deployment
- Method-level authorization via Spring Security `@EnableMethodSecurity`
  (`@PreAuthorize`); URL filter gives a second layer of role checks
- React's automatic XSS escaping; client-side input validation mirrored by
  Bean Validation + custom constraints on the API
