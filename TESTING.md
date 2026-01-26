# Testing Guide

## Overview
This project includes comprehensive tests for authentication pages, OAuth flow, form validation, error states, and loading states.

## Test Files Created

### 1. Login Page Tests
**Location:** `app/(auth)/login/__tests__/page.test.tsx`

**Coverage:**
- ✅ Form validation (empty fields, invalid email)
- ✅ Form submission with valid data
- ✅ Error state rendering
- ✅ Loading state with disabled button
- ✅ "Remember Me" checkbox
- ✅ "Forgot Password" link
- ✅ Register link
- ✅ Input placeholders

### 2. OAuth Button Component Tests
**Location:** `components/auth/__tests__/OAuthButton.test.tsx`

**Coverage:**
- ✅ Google, Microsoft, Meta provider rendering
- ✅ Button click interactions
- ✅ Disabled state functionality
- ✅ Image rendering with correct dimensions
- ✅ Accessibility features

### 3. Auth API Function Tests
**Location:** `lib/api/__tests__/auth.test.ts`

**Coverage:**
- ✅ forgotPassword() function
- ✅ resetPassword() function
- ✅ resendVerificationEmail() function
- ✅ Error handling for each function
- ✅ Integration tests for complete flows

## Setup

### Install Testing Dependencies
```bash
pnpm add -D @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

### Create Jest Configuration
Create `jest.config.js` in the project root:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### Create Jest Setup File
Create `jest.setup.js` in the project root:

```javascript
import '@testing-library/jest-dom'
```

## Running Tests

### Run all tests
```bash
pnpm test
```

### Run tests in watch mode
```bash
pnpm test:watch
```

### Run tests with coverage
```bash
pnpm test:coverage
```

## Test Coverage Goals

- **Login Page:** 100% coverage of form validation, error states, and loading states
- **OAuth Button:** 100% coverage of all provider configurations and interactions
- **Auth API Functions:** 100% coverage of all new auth endpoints

## Future Test Additions

### Forgot Password Page Tests
- Form validation
- Success message display
- Email sent confirmation

### Reset Password Page Tests
- Token validation
- Password strength requirements
- Password confirmation matching

### Register Complete Page Tests
- Resend verification button
- Loading states
- Success/error messages

### OAuth Flow End-to-End Tests
- Complete OAuth flow simulation
- Callback parameter validation
- Token storage verification
- Redirect behavior

## Notes

- All tests use React Testing Library for component testing
- Jest is used as the test runner
- Mocks are created for external dependencies (API calls, router, etc.)
- Tests follow AAA pattern (Arrange, Act, Assert)
