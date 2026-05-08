# Běžci sobě - React Application

A modern carpooling platform for runners built with React, TypeScript, Vite (unit and component testing) and Playwright (e2e testing).

## Features

- Create and manage carpooling offers for running races
- Find rides to popular Czech running events
- User authentication and profiles
- Fully responsive design
- Testing (31 unit tests + 21 E2E tests)

## Security Features

This project is configured with security best practices:

- **`.npmrc`**: Configured to ignore post-install scripts (`ignore-scripts=true`)
- **Exact versions**: Dependencies use exact versions to prevent unexpected updates
- **Audit enabled**: Automatic security audits on package installation
- **Source maps disabled**: Production builds don't expose source code

## Installation

```bash
# Install dependencies with security settings
npm install

# Or use clean install with lockfile
npm ci
```

## Development

```bash
# Start development server (http://localhost:5173)
npm run dev

# Run unit tests (watch mode)
npm test

# Run unit tests with UI
npm run test:ui

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests
npm run e2e

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Testing

### Unit Tests (Vitest)

- **31 unit tests** covering components, API services, and utilities
- Test files: `src/**/*.test.ts(x)`
- Technologies: Vitest, React Testing Library

```bash
npm test              # Watch mode
npm run test:ui       # UI mode with visualization
npm run test:coverage # Generate coverage report
```

### E2E Tests (Playwright)

- **21 E2E test scenarios** across 4 test files
- Browsers: Chrome (Chromium) and Firefox
- Test files: `tests/*.spec.ts`

```bash
npm run e2e          # Run all tests (headless)
npm run e2e:ui       # UI mode (recommended for debugging)
npm run e2e:headed   # See browser during tests
npm run e2e:debug    # Debug mode (step through tests)
```

**Test Coverage:**

- `login.spec.ts` - User authentication flows (6 scenarios)
- `registration.spec.ts` - User registration flows (7 scenarios)
- `navigation.spec.ts` - Navigation and menu tests (3 scenarios)
- `races.spec.ts` - Races and rides management (5 scenarios)

**View test reports:**

```bash
npx playwright show-report
```

## Test Accounts

- **Admin**: `admin` / `admin123`
- **User**: `ivka` / `ivka123`

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── layout/      # Header, Footer, Layout
├── pages/           # Page components (9 views)
├── contexts/        # React Context for state management
├── services/        # API and data services
├── types/           # TypeScript type definitions
├── routes/          # App routing configuration
├── utils/           # Utility functions
└── test/            # Test utilities and setup
tests/               # E2E tests (Playwright)
```

## Technologies

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Routing**: React Router DOM 6
- **Styling**: Tailwind CSS 3 + Bootstrap 5
- **Unit Testing**: Vitest 2 + React Testing Library
- **E2E Testing**: Playwright 1.48
- **Data Storage**: LocalStorage (mock backend)

## Security Notes

- Always review `package-lock.json` changes before committing
- Run `npm audit` regularly to check for vulnerabilities
- Use `npm audit fix` to automatically fix issues when safe
- Never ignore security warnings without investigation

## Documentation

- **TECHNICKA_DOKUMENTACE.md** - Technical documentation in Czech
