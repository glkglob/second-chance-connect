# CI/CD Setup - Quick Start Guide

Complete CI/CD pipeline with GitHub Actions and automated git hooks is now configured!

## What Was Set Up

### 1. GitHub Actions Workflows

**📁 Location:** `.github/workflows/`

#### CI Workflow ([ci.yml](.github/workflows/ci.yml))
Runs on every push and pull request:
- ✅ **Lint & Type Check** - ESLint + TypeScript
- ✅ **Tests** - Jest with coverage reporting
- ✅ **Build** - Next.js production build
- ✅ **Security Audit** - npm vulnerability scanning
- ✅ **All Checks Gate** - Blocks merge if any check fails

#### Deploy Workflow ([deploy.yml](.github/workflows/deploy.yml))
Automated Vercel deployment:
- ✅ **Production** - Deploys on push to `main`
- ✅ **Preview** - Creates preview URLs for PRs

### 2. Git Hooks (Husky)

**📁 Location:** `.husky/`

#### Pre-commit Hook
Runs before every commit:
```bash
# Formats code and fixes linting
npx lint-staged

# Checks TypeScript
npm run type-check
```

#### Pre-push Hook
Runs before every push:
```bash
# Runs all tests
npm run test:ci
```

#### Commit-msg Hook
Enforces Conventional Commits:
```bash
✅ feat: add user authentication
✅ fix(api): resolve rate limiting bug
❌ updated stuff  # Invalid format
```

### 3. GitHub Templates

**📁 Location:** `.github/`

- **Bug Report Template** - [ISSUE_TEMPLATE/bug_report.md](.github/ISSUE_TEMPLATE/bug_report.md)
- **Feature Request Template** - [ISSUE_TEMPLATE/feature_request.md](.github/ISSUE_TEMPLATE/feature_request.md)
- **Pull Request Template** - [pull_request_template.md](.github/pull_request_template.md)

### 4. Code Formatting

- **Prettier** - Auto-formats on commit
- **ESLint** - Auto-fixes linting errors
- **Lint-staged** - Only formats changed files

### 5. Documentation

- **Repository Setup Guide** - [.github/REPOSITORY_SETUP.md](.github/REPOSITORY_SETUP.md)
- **CI/CD Guide** - [.github/CI_CD_GUIDE.md](.github/CI_CD_GUIDE.md)

## Getting Started

### First Time Setup

1. **Install dependencies** (hooks will be set up automatically):
```bash
npm install
```

2. **Configure GitHub Secrets** (for CI/CD):
   - Go to GitHub repo → Settings → Secrets and variables → Actions
   - Add these secrets:
     ```
     VERCEL_TOKEN
     VERCEL_ORG_ID
     VERCEL_PROJECT_ID
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     ```

3. **Set up branch protection** (optional but recommended):
   - Follow [.github/REPOSITORY_SETUP.md](.github/REPOSITORY_SETUP.md)

### Daily Workflow

#### Making Changes

1. **Create a branch**:
```bash
git checkout -b feature/your-feature
```

2. **Make your changes** and commit:
```bash
git add .
git commit -m "feat: add awesome feature"
```

The pre-commit hook will automatically:
- Format your code with Prettier
- Fix ESLint errors
- Check TypeScript types

3. **Push your branch**:
```bash
git push origin feature/your-feature
```

The pre-push hook will run all tests before pushing.

4. **Create a Pull Request**:
   - PR template will guide you
   - CI checks will run automatically
   - Preview deployment will be created

5. **After CI passes** and review approval:
   - Merge to `main`
   - Automatic production deployment

### Commit Message Format

Use Conventional Commits:

```bash
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
perf: improve performance
test: add tests
chore: update dependencies
ci: update GitHub Actions
```

**With scope:**
```bash
feat(auth): add OAuth login
fix(api): resolve rate limiting
docs(readme): update setup guide
```

## Testing the Setup

### Test Git Hooks

```bash
# Test pre-commit (should format and type-check)
echo "const test = 'test'" >> test.js
git add test.js
git commit -m "test: verify pre-commit hook"

# Clean up
git reset HEAD~1
rm test.js
```

### Test CI Locally

Run the same checks that CI runs:

```bash
npm run lint          # ESLint
npm run type-check    # TypeScript
npm test              # Jest tests
npm run build         # Next.js build
```

All should pass!

### Test Commit Message Validation

```bash
# This will FAIL (invalid format)
git commit --allow-empty -m "updated stuff"

# This will PASS (valid format)
git commit --allow-empty -m "chore: test commit message hook"
```

## Bypassing Hooks (Emergency Only)

```bash
# Skip pre-commit and commit-msg hooks
git commit --no-verify -m "emergency fix"

# Skip pre-push hook
git push --no-verify
```

**⚠️ Only use in emergencies! Always fix issues properly.**

## CI/CD Pipeline Flow

```
Developer pushes code
        ↓
GitHub Actions triggered
        ↓
    ┌───────────────────┐
    │ Run in parallel:  │
    │ - Lint & Type     │
    │ - Tests           │
    │ - Build           │
    │ - Security        │
    └───────────────────┘
        ↓
  All checks pass?
   ↙️          ↘️
  YES          NO
   ↓            ↓
Deploy to   Block merge
Vercel      (fix issues)
```

## Troubleshooting

### Hook not running

```bash
# Reinstall hooks
npm run prepare
```

### CI failing but local passes

```bash
# Clear npm cache
npm ci

# Clear Next.js cache
rm -rf .next

# Try again
npm run build
```

### Commit message rejected

Ensure format is: `type(scope): message`

```bash
# Good
git commit -m "feat: add feature"
git commit -m "fix(api): resolve bug"

# Bad
git commit -m "updated files"
git commit -m "Fix bug"  # Missing type
```

## Next Steps

1. ✅ **Push this setup to GitHub**
2. ✅ **Configure GitHub Secrets** (see [Repository Setup Guide](.github/REPOSITORY_SETUP.md))
3. ✅ **Set up branch protection rules**
4. ✅ **Make your first PR to test the pipeline**
5. ✅ **Add status badges to README**

## Resources

- **Full CI/CD Guide:** [.github/CI_CD_GUIDE.md](.github/CI_CD_GUIDE.md)
- **Repository Setup:** [.github/REPOSITORY_SETUP.md](.github/REPOSITORY_SETUP.md)
- **Conventional Commits:** https://www.conventionalcommits.org
- **GitHub Actions:** https://docs.github.com/en/actions
- **Husky:** https://typicode.github.io/husky

---

**Setup completed:** 2025-11-19

Your CI/CD pipeline is ready! 🚀
