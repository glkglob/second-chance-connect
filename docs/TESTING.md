# Testing Guide

## Overview

This document provides comprehensive guidance for testing the Second Chance Connect application, including unit tests, integration tests, and end-to-end tests.

## Table of Contents

- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [API Testing](#api-testing)
- [RLS Policy Testing](#rls-policy-testing)
- [Component Testing](#component-testing)
- [Integration Testing](#integration-testing)
- [Test Coverage](#test-coverage)
- [Continuous Integration](#continuous-integration)

## Testing Stack

- **Test Runner**: Jest
- **React Testing**: React Testing Library
- **User Interactions**: @testing-library/user-event
- **Assertions**: @testing-library/jest-dom
- **Mocking**: Jest mocks

## Running Tests

### Basic Commands

```bash
# Run all tests in watch mode (development)
npm test

# Run tests once (CI)
npm run test:ci

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- path/to/test.test.js

# Run tests matching pattern
npm test -- --testNamePattern="API routes"
```

### Test Environment

Tests use environment variables from `.env.test`:

```bash
# .env.test
NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key
NODE_ENV=test
```

## Test Structure

```
/
├── tests/
│   ├── api/              # API route tests
│   │   ├── jobs.test.js
│   │   ├── applications.test.js
│   │   └── messages.test.js
│   ├── rls/              # Row Level Security tests
│   │   └── rls-policies.test.md
│   ├── components/       # Component tests
│   │   ├── error-boundary.test.jsx
│   │   └── ...
│   └── integration/      # Integration tests
│       └── ...
├── jest.config.js        # Jest configuration
└── jest.setup.js         # Test setup
```

## Writing Tests

### Test Naming Convention

```javascript
describe('Component/Feature Name', () => {
  describe('specific functionality', () => {
    it('should do something specific', () => {
      // Test implementation
    })
  })
})
```

### Test Structure (AAA Pattern)

```javascript
it('should return user data for authenticated user', async () => {
  // Arrange - Set up test data and mocks
  const mockUser = { id: '123', email: 'test@example.com' }
  mockAuth.getUser.mockResolvedValue({ data: { user: mockUser } })

  // Act - Execute the code being tested
  const response = await GET(mockRequest)
  const data = await response.json()

  // Assert - Verify the results
  expect(response.status).toBe(200)
  expect(data.user).toEqual(mockUser)
})
```

## API Testing

### Testing API Routes

```javascript
import { GET, POST } from '@/app/api/jobs/route'
import { createClient } from '@/lib/supabase/server'

jest.mock('@/lib/supabase/server')

describe('/api/jobs', () => {
  let mockSupabase
  
  beforeEach(() => {
    mockSupabase = {
      auth: { getUser: jest.fn() },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        // ... other methods
      })),
    }
    
    createClient.mockResolvedValue(mockSupabase)
  })
  
  it('should authenticate user', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: '123' } }
    })
    
    const response = await GET(mockRequest)
    
    expect(response.status).toBe(200)
  })
})
```

### Testing Error Cases

```javascript
it('should handle database errors gracefully', async () => {
  mockSupabase.from().select().mockResolvedValue({
    data: null,
    error: { message: 'Database error' }
  })
  
  const response = await GET(mockRequest)
  
  expect(response.status).toBe(500)
  expect(await response.json()).toEqual({
    error: 'Failed to fetch jobs'
  })
})
```

## RLS Policy Testing

RLS policies require testing against a real database. See [tests/rls/rls-policies.test.md](../tests/rls/rls-policies.test.md) for detailed instructions.

### Example RLS Test

```javascript
import { createClient } from '@supabase/supabase-js'

describe('Jobs RLS Policies', () => {
  let employerClient, seekerClient
  
  beforeAll(async () => {
    // Create test users and authenticate
    employerClient = await createTestUser('EMPLOYER')
    seekerClient = await createTestUser('SEEKER')
  })
  
  it('should allow employers to create jobs', async () => {
    const { data, error } = await employerClient
      .from('jobs')
      .insert({
        title: 'Test Job',
        company: 'Test Co',
        location: 'Remote',
        description: 'Test description'
      })
    
    expect(error).toBeNull()
    expect(data).toBeDefined()
  })
  
  it('should prevent seekers from creating jobs', async () => {
    const { data, error } = await seekerClient
      .from('jobs')
      .insert({
        title: 'Test Job',
        company: 'Test Co',
        location: 'Remote',
        description: 'Test description'
      })
    
    expect(error).toBeDefined()
    expect(error.code).toBe('42501') // insufficient_privilege
  })
})
```

## Component Testing

### Testing React Components

```javascript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from '@/components/error-boundary'

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })
  
  it('should display error UI when child throws', () => {
    const ThrowError = () => {
      throw new Error('Test error')
    }
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })
})
```

### Testing User Interactions

```javascript
it('should handle button click', async () => {
  const user = userEvent.setup()
  const handleClick = jest.fn()
  
  render(<button onClick={handleClick}>Click me</button>)
  
  await user.click(screen.getByText('Click me'))
  
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### Testing Forms

```javascript
it('should submit form with valid data', async () => {
  const user = userEvent.setup()
  const handleSubmit = jest.fn()
  
  render(<LoginForm onSubmit={handleSubmit} />)
  
  await user.type(screen.getByLabelText('Email'), 'test@example.com')
  await user.type(screen.getByLabelText('Password'), 'password123')
  await user.click(screen.getByRole('button', { name: /sign in/i }))
  
  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123'
  })
})
```

## Integration Testing

Integration tests verify multiple components/features working together.

```javascript
describe('Job Application Flow', () => {
  it('should allow seeker to apply to job', async () => {
    // 1. User logs in as seeker
    await loginAsSeeker()
    
    // 2. User navigates to job listing
    await navigateToJob('job-123')
    
    // 3. User clicks apply
    await clickApplyButton()
    
    // 4. User fills application form
    await fillApplicationForm({
      coverLetter: 'I am interested...'
    })
    
    // 5. User submits application
    await submitApplication()
    
    // 6. Verify success message
    expect(screen.getByText('Application submitted')).toBeInTheDocument()
    
    // 7. Verify database was updated
    const applications = await getApplications()
    expect(applications).toHaveLength(1)
  })
})
```

## Test Coverage

### Coverage Goals

- **Overall**: 80% minimum
- **Critical paths**: 100% (auth, payments, etc.)
- **API routes**: 100%
- **RLS policies**: 100%
- **Components**: 80%

### Running Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

### Coverage Thresholds

Configured in `jest.config.js`:

```javascript
coverageThresholds: {
  global: {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50,
  },
}
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
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test:ci
        
      - name: Run coverage
        run: npm run test:coverage
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Best Practices

### Do's ✅

- Write tests alongside code
- Test behavior, not implementation
- Use descriptive test names
- Keep tests isolated and independent
- Mock external dependencies
- Test error cases and edge cases
- Aim for high coverage on critical paths

### Don'ts ❌

- Don't test implementation details
- Don't share state between tests
- Don't test third-party libraries
- Don't write tests that depend on test order
- Don't mock everything (test real interactions when possible)
- Don't ignore failing tests

## Debugging Tests

### Running Single Test

```bash
npm test -- path/to/test.test.js
```

### Debug Mode

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Console Output

Add `console.log` statements or use `screen.debug()`:

```javascript
import { render, screen } from '@testing-library/react'

it('should render component', () => {
  render(<MyComponent />)
  
  // Print entire DOM
  screen.debug()
  
  // Print specific element
  screen.debug(screen.getByRole('button'))
})
```

## Mocking

### Mocking Modules

```javascript
jest.mock('@/lib/supabase/client', () => ({
  createBrowserClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: null } }))
    }
  }))
}))
```

### Mocking Functions

```javascript
const mockFunction = jest.fn()
mockFunction.mockReturnValue('value')
mockFunction.mockResolvedValue(Promise.resolve('value'))
mockFunction.mockRejectedValue(new Error('error'))
```

### Clearing Mocks

```javascript
beforeEach(() => {
  jest.clearAllMocks()
})
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [RLS Testing Guide](https://supabase.com/docs/guides/auth/row-level-security#testing-policies)

## Getting Help

- Check existing tests for examples
- Review [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines
- Ask in GitHub Discussions
- Report test infrastructure issues

---

**Remember**: Good tests make refactoring safe and bugs rare. Invest time in writing quality tests!
