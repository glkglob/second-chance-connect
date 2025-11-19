# CI/CD Pipeline Guide

Complete guide to the Continuous Integration and Continuous Deployment pipeline for Second Chance Connect.

## Overview

Our CI/CD pipeline uses **GitHub Actions** for automated testing, building, and deployment to **Vercel**.

## Pipeline Architecture

```
┌─────────────┐
│   PR/Push   │
└──────┬──────┘
       │
       ├──────────────┬──────────────┬──────────────┬──────────────┐
       │              │              │              │              │
       v              v              v              v              v
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│   Lint   │   │   Test   │   │  Build   │   │ Security │   │  Deploy  │
│  & Type  │   │          │   │          │   │  Audit   │   │ (Vercel) │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
       │              │              │              │              │
       └──────────────┴──────────────┴──────────────┴──────────────┘
                                    │
                                    v
                            ┌────────────────┐
                            │  All Checks    │
                            │    Passed      │
                            └────────────────┘
```

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Jobs:**

#### Lint & Type Check
- Runs ESLint on all JavaScript/TypeScript files
- Performs TypeScript type checking
- **Duration:** ~30-60 seconds

```bash
npm run lint
npm run type-check
```

#### Test
- Runs all Jest tests with coverage
- Uploads coverage to Codecov
- **Duration:** ~1-2 minutes

```bash
npm test -- --coverage
```

#### Build
- Builds Next.js production bundle
- Verifies build artifacts
- **Duration:** ~2-3 minutes

```bash
npm run build
```

#### Security Audit
- Runs npm audit for vulnerabilities
- Checks production and all dependencies
- **Non-blocking:** Warnings don't fail the build

```bash
npm audit --production --audit-level=high
```

#### All Checks Passed
- Final gate that requires all previous jobs to succeed
- **Blocks merge if any job fails**

### 2. Deploy Workflow (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to `main` (production deploy)
- Pull requests to `main` (preview deploy)

**Jobs:**

#### Deploy to Vercel
- **Production:** Deploys to production on push to `main`
- **Preview:** Creates preview URL for pull requests
- Posts deployment URL as PR comment

**Required Secrets:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Local Development Hooks

### Pre-commit Hook

Runs **before** each commit:

```bash
# 1. Lint-staged (auto-fix)
npx lint-staged

# 2. Type check
npm run type-check
```

**What it does:**
- Formats code with Prettier
- Fixes ESLint errors automatically
- Ensures no TypeScript errors

**Skip (emergency only):**
```bash
git commit --no-verify -m "message"
```

### Pre-push Hook

Runs **before** pushing to remote:

```bash
# Run all tests
npm run test:ci
```

**What it does:**
- Runs entire test suite
- Ensures all tests pass before push

**Skip (emergency only):**
```bash
git push --no-verify
```

### Commit-msg Hook

Validates commit message format:

**Required format:**
```
type(scope): subject

Examples:
  feat: add user authentication
  fix(api): resolve rate limiting bug
  docs: update README
```

**Valid types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `build`: Build system changes
- `ci`: CI/CD changes
- `revert`: Revert previous commit

## Environment Variables

### CI Environment

Set in **GitHub Secrets** (Settings → Secrets and variables → Actions):

| Secret Name | Purpose | Required |
|------------|---------|----------|
| `CODECOV_TOKEN` | Code coverage reporting | No |
| `VERCEL_TOKEN` | Vercel CLI authentication | Yes |
| `VERCEL_ORG_ID` | Vercel organization ID | Yes |
| `VERCEL_PROJECT_ID` | Vercel project ID | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Yes |

### Local Development

Stored in `.env.local` (not committed):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
REDIS_URL=redis://your-redis-url
```

## Deployment Flow

### Pull Request Deployment

1. **Create PR** → Triggers CI checks
2. **CI passes** → Deploy workflow creates preview
3. **Preview URL** posted as PR comment
4. **Review & approve** → Ready to merge
5. **Merge to main** → Production deployment

### Production Deployment

```
main branch ──→ GitHub Actions ──→ Vercel Production
                      │
                      ├──→ Run tests
                      ├──→ Build Next.js
                      └──→ Deploy to Vercel
```

**Automatic on push to `main`:**
```bash
git push origin main
```

## Monitoring & Debugging

### View Workflow Runs

1. Go to **Actions** tab in GitHub
2. Select workflow run
3. View job logs

### Common Issues

#### ❌ Lint Errors

**Error:** ESLint fails

**Solution:**
```bash
npm run lint -- --fix
git add .
git commit --amend
```

#### ❌ Type Errors

**Error:** TypeScript errors

**Solution:**
```bash
npm run type-check
# Fix errors in editor
```

#### ❌ Test Failures

**Error:** Jest tests fail

**Solution:**
```bash
npm test
# Fix failing tests
# Ensure mocks are up to date
```

#### ❌ Build Failures

**Error:** Next.js build fails

**Solution:**
```bash
npm run build
# Check for missing environment variables
# Fix import errors
```

#### ❌ Deployment Failures

**Error:** Vercel deployment fails

**Solution:**
1. Check Vercel dashboard for logs
2. Verify secrets are configured
3. Ensure build passes locally

### Debug Locally

Run the same checks that CI runs:

```bash
# Full CI check locally
npm run lint
npm run type-check
npm test -- --coverage
npm run build

# Verify all pass
echo "All checks passed! Ready to push."
```

## Performance Optimization

### Caching

GitHub Actions caches:
- Node modules (`cache: 'npm'`)
- Next.js build cache

**Clear cache:**
1. Go to Actions → Caches
2. Delete caches manually

### Parallel Jobs

Jobs run in parallel for speed:
- Lint & Type Check: ~30-60s
- Test: ~1-2min
- Build: ~2-3min

**Total time:** ~2-3min (not 6min) due to parallelization

## Best Practices

### ✅ DO

- ✅ Write meaningful commit messages
- ✅ Run tests locally before pushing
- ✅ Keep PRs focused and small
- ✅ Add tests for new features
- ✅ Update documentation with code changes

### ❌ DON'T

- ❌ Skip hooks with `--no-verify`
- ❌ Push directly to `main`
- ❌ Commit broken code
- ❌ Ignore failing CI checks
- ❌ Commit sensitive data (secrets, keys)

## Continuous Improvement

### Adding New Checks

1. Edit `.github/workflows/ci.yml`
2. Add new job or step
3. Test with a PR
4. Update branch protection rules

### Updating Dependencies

Dependabot automatically creates PRs for:
- Security updates
- Package updates

Review and merge regularly.

## Quick Reference

### Commands

```bash
# Run CI checks locally
npm run lint
npm run type-check
npm test
npm run build

# Fix issues
npm run lint -- --fix
npx prettier --write .

# Deploy to Vercel manually
vercel --prod

# View Vercel logs
vercel logs
```

### Status Badge

Add to README.md:

```markdown
![CI](https://github.com/your-username/second-chance-connect/actions/workflows/ci.yml/badge.svg)
```

---

**Last Updated:** 2025-11-19
**Maintainer:** Development Team

For questions, create an issue or contact the development team.
