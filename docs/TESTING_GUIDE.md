# Testing Guide

## Overview

This guide covers the testing strategy and implementation for Second Chance Connect. Our testing approach follows industry best practices with multiple layers of testing to ensure reliability and security.

## Testing Strategy

### Testing Pyramid

```
        /\
       /  \    E2E Tests (Few)
      /____\
     /      \  Integration Tests (Some)
    /________\
   /          \ Unit Tests (Many)
  /____________\
```

1. **Unit Tests** (70%) - Test individual functions and components
2. **Integration Tests** (20%) - Test API endpoints and database interactions
3. **End-to-End Tests** (10%) - Test complete user journeys

## Test Setup

### Prerequisites

Install testing dependencies (with compatible versions):

```bash
npm install --save-dev \
  jest@^29.0.0 \
  @jest/globals@^29.0.0 \
  @testing-library/react@^14.0.0 \
  @testing-library/jest-dom@^6.0.0 \
  @testing-library/user-event@^14.0.0 \
  jest-environment-jsdom@^29.0.0
```

> **Note:** Jest 29+ is required for `@jest/globals`. React Testing Library packages listed above are compatible with React 19+. If you are using a different React version, please consult the respective package documentation for compatibility.

### Configuration Files

#### jest.config.js

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
    'app/**/*.{js,jsx}',
    'components/**/*.{js,jsx}',
    'lib/**/*.{js,jsx}',
    '!app/layout.jsx',
    '!app/**/layout.jsx',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

#### jest.setup.js

```javascript
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  createBrowserClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  })),
}))
```

### Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

## Unit Testing

### Testing Components

**Example: Testing StatCard Component**

```javascript
// components/__tests__/stat-card.test.jsx
import { render, screen } from '@testing-library/react'
import { StatCard } from '@/components/stat-card'

describe('StatCard', () => {
  it('renders title and value', () => {
    render(
      <StatCard
        title="Active Jobs"
        value="42"
        description="Jobs posted this month"
      />
    )

    expect(screen.getByText('Active Jobs')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('Jobs posted this month')).toBeInTheDocument()
  })

  it('renders with icon when provided', () => {
    const TestIcon = () => <svg data-testid="test-icon" />
    
    render(
      <StatCard
        title="Test"
        value="10"
        icon={TestIcon}
      />
    )

    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })
})
```

### Testing Utilities

**Example: Testing Logger**

```javascript
// lib/__tests__/logger.test.js
import { logError, logWarn, logInfo, sanitizeLogData } from '@/lib/logger'

describe('Logger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(console, 'warn').mockImplementation()
    jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('logError', () => {
    it('logs error with message and context', () => {
      const error = new Error('Test error')
      logError('Something failed', error, { userId: '123' })

      expect(console.error).toHaveBeenCalled()
      const loggedData = JSON.parse(console.error.mock.calls[0][0])
      expect(loggedData.level).toBe('error')
      expect(loggedData.message).toBe('Something failed')
    })
  })

  describe('sanitizeLogData', () => {
    it('removes sensitive fields', () => {
      const data = {
        username: 'john',
        password: 'secret123',
        apiKey: 'key123'
      }

      const sanitized = sanitizeLogData(data)
      
      expect(sanitized.username).toBe('john')
      expect(sanitized.password).toBe('***REDACTED***')
      expect(sanitized.apiKey).toBe('***REDACTED***')
    })
  })
})
```

## Integration Testing

### Testing API Routes

**Example: Testing Jobs API**

```javascript
// app/api/jobs/__tests__/route.test.js
import { GET, POST } from '@/app/api/jobs/route'
import { createClient } from '@/lib/supabase/server'

jest.mock('@/lib/supabase/server')

describe('/api/jobs', () => {
  let mockSupabase

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getUser: jest.fn()
      },
      from: jest.fn()
    }
    createClient.mockResolvedValue(mockSupabase)
  })

  describe('GET', () => {
    it('returns 401 when not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null }
      })

      const request = new Request('http://localhost/api/jobs')
      const response = await GET(request)

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })

    it('returns jobs for authenticated user', async () => {
      const mockUser = { id: 'user-123' }
      const mockJobs = [
        { id: '1', title: 'Job 1', status: 'ACTIVE' },
        { id: '2', title: 'Job 2', status: 'ACTIVE' }
      ]

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser }
      })

      const mockQuery = {
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: mockJobs,
          error: null
        })
      }

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockQuery)
      })

      const request = new Request('http://localhost/api/jobs')
      const response = await GET(request)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.jobs).toHaveLength(2)
    })
  })

  describe('POST', () => {
    it('creates job for employer', async () => {
      const mockUser = { id: 'employer-123' }
      const mockProfile = { role: 'EMPLOYER' }
      const mockJob = {
        id: 'job-123',
        title: 'New Job',
        employer_id: 'employer-123'
      }

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser }
      })

      mockSupabase.from
        .mockReturnValueOnce({ // for profile check
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockProfile,
                error: null
              })
            })
          })
        })
        .mockReturnValueOnce({ // for job insert
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockJob,
                error: null
              })
            })
          })
        })

      const request = new Request('http://localhost/api/jobs', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Job',
          company: 'Test Co',
          location: 'Remote',
          description: 'Test job'
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(201)
    })
  })
})
```

### Testing RLS Policies

**Example: RLS Policy Test**

```javascript
// tests/rls/jobs.test.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

describe('Jobs RLS Policies', () => {
  let supabase
  let seekerClient
  let employerClient

  beforeAll(async () => {
    // Set up test users
    supabase = createClient(supabaseUrl, supabaseKey)
  })

  describe('Read access', () => {
    it('allows anyone to view active jobs', async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'ACTIVE')

      expect(error).toBeNull()
      expect(data).toBeDefined()
    })

    it('prevents viewing draft jobs by others', async () => {
      // Create draft job as employer
      // Try to read as seeker
      // Should not return the draft job
    })
  })

  describe('Write access', () => {
    it('prevents seekers from creating jobs', async () => {
      // Authenticate as seeker
      // Try to create job
      // Should fail with RLS error
    })

    it('allows employers to create jobs', async () => {
      // Authenticate as employer
      // Create job
      // Should succeed
    })
  })
})
```

## End-to-End Testing

### Playwright Setup

Install Playwright:

```bash
npm install --save-dev @playwright/test
npx playwright install
```

**Example: E2E Test**

```javascript
// tests/e2e/job-application-flow.spec.js
import { test, expect } from '@playwright/test'

test.describe('Job Application Flow', () => {
  test('seeker can browse and apply to jobs', async ({ page }) => {
    // Login as seeker
    await page.goto('/auth/login')
    await page.fill('[name="email"]', 'seeker@test.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Navigate to jobs
    await page.waitForURL('/dashboard')
    await page.click('text=Browse Jobs')

    // View job details
    await page.click('text=Software Developer')
    await expect(page).toHaveURL(/\/dashboard\/jobs\//)

    // Apply to job
    await page.click('text=Apply Now')
    await page.fill('[name="coverLetter"]', 'I am interested...')
    await page.click('button:has-text("Submit Application")')

    // Verify success
    await expect(page.locator('text=Application submitted')).toBeVisible()
  })
})
```

## Running Tests

### Development

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- jobs.test.js

# Run tests with coverage
npm run test:coverage
```

### CI/CD

```bash
# Run tests in CI environment
npm run test:ci
```

## Test Coverage

### Viewing Coverage

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

### Coverage Goals

- **Overall**: 80%+ coverage
- **Critical paths**: 90%+ coverage
- **API routes**: 85%+ coverage
- **RLS policies**: 100% coverage
- **Utility functions**: 90%+ coverage

## Best Practices

### 1. Test Organization

```
tests/
├── unit/
│   ├── components/
│   ├── lib/
│   └── utils/
├── integration/
│   ├── api/
│   └── database/
├── e2e/
│   └── flows/
└── fixtures/
    ├── users.js
    └── jobs.js
```

### 2. Test Naming

```javascript
describe('Component/Function Name', () => {
  describe('specific behavior', () => {
    it('does something specific', () => {
      // test implementation
    })
  })
})
```

### 3. AAA Pattern

```javascript
it('should do something', () => {
  // Arrange - Set up test data
  const input = { ... }
  
  // Act - Execute the function
  const result = myFunction(input)
  
  // Assert - Verify the result
  expect(result).toBe(expected)
})
```

### 4. Test Data

Use fixtures and factories:

```javascript
// tests/fixtures/users.js
export const mockSeeker = {
  id: 'seeker-123',
  role: 'SEEKER',
  name: 'John Seeker'
}

export const mockEmployer = {
  id: 'employer-123',
  role: 'EMPLOYER',
  name: 'Jane Employer'
}
```

### 5. Mocking

```javascript
// Mock external dependencies
jest.mock('@/lib/supabase/client')
jest.mock('next/navigation')

// Mock specific functions
const mockFetch = jest.fn()
global.fetch = mockFetch
```

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - uses: codecov/codecov-action@v2
        with:
          files: ./coverage/lcov.info
```

## Debugging Tests

### VSCode Debug Configuration

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

### Console Logs

```javascript
// Enable console logs in tests
process.env.DEBUG = 'true'
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)

---

**Last Updated**: 2025-01-22  
**Next Review**: 2025-04-22
