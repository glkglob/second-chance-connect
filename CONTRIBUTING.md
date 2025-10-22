# Contributing to Second Chance Connect

Thank you for your interest in contributing to Second Chance Connect! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- A Supabase account and project
- Git

### Initial Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/v0-second-chance-connect.git
   cd v0-second-chance-connect
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create your environment file:
   ```bash
   cp .env.example .env.local
   ```

5. Configure your Supabase credentials in `.env.local`

6. Initialize the database using the SQL scripts in `scripts/` folder

7. Start the development server:
   ```bash
   npm run dev
   ```

See [SETUP.md](SETUP.md) for detailed setup instructions.

## Development Workflow

1. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. Make your changes following our [coding standards](#coding-standards)

3. Test your changes thoroughly

4. Commit your changes with clear, descriptive messages:
   ```bash
   git commit -m "Add feature: description of what you added"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request

## Coding Standards

### General Guidelines

- Write clear, self-documenting code
- Follow existing code patterns and conventions
- Keep functions small and focused
- Use meaningful variable and function names
- Add comments for complex logic only

### File Structure

- **Components**: Use `.jsx` for shared components, `.tsx` for UI primitives
- **App Routes**: Use `.jsx` (following existing pattern)
- **Hooks**: Use `.js` files in `lib/hooks/`
- **Utilities**: Add to existing `lib/utils.js` or `lib/utils.ts`

### TypeScript/JavaScript

- Follow existing patterns in the codebase
- Use TypeScript for type safety where appropriate
- Avoid `any` types; use proper typing
- Use optional chaining (`?.`) for safer property access

### React Components

- Use functional components with hooks
- Follow the component structure in existing files
- Use proper prop validation with TypeScript interfaces or PropTypes
- Implement proper loading and error states

### API Routes

- Always check authentication using Supabase
- Use proper error handling with try-catch
- Return consistent error responses
- Log errors with `[v0]` prefix for debugging
- Respect RLS policies - never bypass them

### Styling

- Use Tailwind CSS utilities exclusively
- Follow the design system in `styles/globals.css`
- Maintain WCAG-AA accessibility standards
- Use existing color tokens and design variables
- Ensure responsive design (mobile-first)

### Database

- Never bypass Row Level Security (RLS)
- Use provided Supabase client utilities
- Always check user permissions
- Handle constraint violations gracefully

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- path/to/test.spec.js
```

### Writing Tests

- Write tests for all new features
- Include unit tests for utilities and hooks
- Add integration tests for API routes
- Test component rendering and user interactions
- Verify RLS policies work as expected
- Test error handling paths

### Test Coverage

- Aim for at least 80% code coverage
- Critical paths should have 100% coverage
- All API routes must have tests
- All RLS policies must have tests

## Pull Request Process

1. **Update Documentation**: Update README.md, IMPLEMENTATION_SUMMARY.md, or other docs if your changes affect them

2. **Test Thoroughly**: Ensure all tests pass and add new tests for your changes

3. **Check Build**: Verify the production build works:
   ```bash
   npm run build
   ```

4. **Lint Your Code**: Run the linter and fix any issues:
   ```bash
   npm run lint
   ```

5. **Write Clear Description**: Explain what your PR does and why

6. **Link Issues**: Reference any related issues

7. **Request Review**: Tag appropriate reviewers

8. **Address Feedback**: Respond to review comments promptly

### PR Title Format

Use conventional commit format:
- `feat: add new feature`
- `fix: resolve bug in component`
- `docs: update README`
- `test: add tests for API route`
- `refactor: improve code structure`
- `style: format code`
- `chore: update dependencies`

## Reporting Bugs

### Before Submitting a Bug Report

- Check existing issues to avoid duplicates
- Verify the bug exists in the latest version
- Collect relevant information (browser, OS, steps to reproduce)

### How to Submit a Bug Report

Create an issue with:

**Title**: Clear, descriptive summary

**Description**:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (browser, OS, Node version)
- Error messages or console logs

**Labels**: Add appropriate labels (bug, priority-high, etc.)

## Suggesting Enhancements

We welcome feature suggestions! Please create an issue with:

**Title**: Clear feature name

**Description**:
- Problem it solves
- Proposed solution
- Alternative solutions considered
- Additional context or mockups

**Labels**: Add `enhancement` label

## Questions or Need Help?

- **Documentation**: Check [SETUP.md](SETUP.md) and [DEBUGGING_GUIDE.md](DEBUGGING_GUIDE.md)
- **Issues**: Search existing issues or create a new one
- **Discussions**: Use GitHub Discussions for general questions
- **Email**: Contact support@secondchanceconnect.org

## Recognition

Contributors who make significant contributions will be:
- Added to the CONTRIBUTORS.md file
- Mentioned in release notes
- Credited in the README

Thank you for contributing to Second Chance Connect! Together, we're building a platform that creates real opportunities for second chances. ❤️
