# Contributing to Second Chance Connect

Thank you for your interest in contributing to Second Chance Connect! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm
- Supabase account (for local development)
- Git

### Setup Development Environment

1. **Fork and Clone**
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/v0-second-chance-connect.git
   cd v0-second-chance-connect
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set Up Environment Variables**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   \`\`\`

4. **Run Database Migrations**
   - Open your Supabase project dashboard
   - Run SQL scripts in order from `scripts/` directory

5. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

## Development Process

### Branch Naming

- `feature/` - New features (e.g., `feature/add-job-alerts`)
- `fix/` - Bug fixes (e.g., `fix/login-redirect`)
- `docs/` - Documentation updates (e.g., `docs/api-endpoints`)
- `refactor/` - Code refactoring (e.g., `refactor/api-error-handling`)
- `test/` - Test additions or updates (e.g., `test/add-rls-tests`)

### Making Changes

1. **Create a feature branch**
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code patterns
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   \`\`\`bash
   npm run lint        # Run linter
   npm run type-check  # TypeScript type checking
   npm run build       # Test production build
   npm run test        # Run tests (when available)
   \`\`\`

4. **Commit your changes**
   \`\`\`bash
   git add .
   git commit -m "feat: add job alert notifications"
   \`\`\`

## Pull Request Process

1. **Update Documentation**
   - Update README.md if you changed functionality
   - Update IMPLEMENTATION_SUMMARY.md for significant features
   - Add JSDoc comments to new functions

2. **Create Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - List any breaking changes

3. **PR Template**
   \`\`\`markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Tested locally
   - [ ] Added/updated tests
   - [ ] All tests passing

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No new warnings
   \`\`\`

4. **Code Review**
   - Address reviewer feedback promptly
   - Keep discussions focused and professional
   - Update your branch as needed

## Coding Standards

### JavaScript/TypeScript

- Use ES6+ features
- Prefer `const` over `let`, avoid `var`
- Use async/await over promises when possible
- Use meaningful variable and function names
- Keep functions small and focused

### React Components

- Use functional components with hooks
- Keep components focused on a single responsibility
- Extract reusable logic into custom hooks
- Use TypeScript for type safety
- Follow existing component patterns

### File Structure

\`\`\`
component-name/
  ├── index.jsx         # Component export
  ├── component.jsx     # Main component
  └── component.test.jsx # Tests
\`\`\`

### Styling

- Use Tailwind CSS utility classes
- Follow existing design system
- Maintain responsive design (mobile-first)
- Ensure accessibility (WCAG-AA)

### API Routes

- Always validate user authentication
- Use Supabase RLS for data security
- Return consistent error responses
- Log errors with `[v0]` prefix
- Document with JSDoc comments

### Database

- Never bypass RLS policies
- Use migrations for schema changes
- Add indexes for performance
- Document complex queries

## Testing Guidelines

### Unit Tests

- Test individual functions and components
- Mock external dependencies
- Aim for >80% coverage on new code

### Integration Tests

- Test API endpoints end-to-end
- Verify RLS policy enforcement
- Test error scenarios

### E2E Tests

- Test critical user journeys
- Cover authentication flows
- Test role-based access control

### Running Tests

\`\`\`bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Generate coverage report
\`\`\`

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Examples

\`\`\`bash
feat(auth): add password reset functionality

fix(jobs): resolve duplicate job listings bug

docs(api): document message endpoints

test(rls): add tests for job posting policies
\`\`\`

## Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities. Instead, email [INSERT SECURITY EMAIL] with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

See [SECURITY.md](SECURITY.md) for full security policy.

### Security Best Practices

- Never commit sensitive data (API keys, passwords)
- Validate all user input
- Use prepared statements for database queries
- Follow OWASP security guidelines
- Keep dependencies updated

## Getting Help

- 📖 Read the [Documentation](README.md)
- 💬 Ask questions in [Discussions](https://github.com/bischoff99/v0-second-chance-connect/discussions)
- 🐛 Report bugs via [Issues](https://github.com/bischoff99/v0-second-chance-connect/issues)
- 📧 Contact maintainers at [INSERT CONTACT EMAIL]

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for contributing to Second Chance Connect! Your efforts help create opportunities for individuals seeking second chances. 🙏
