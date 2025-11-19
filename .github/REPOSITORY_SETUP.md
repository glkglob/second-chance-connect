# GitHub Repository Setup Guide

This guide walks you through setting up branch protection rules, required status checks, and other GitHub repository settings for the Second Chance Connect project.

## Branch Protection Rules

### Main Branch Protection

Navigate to **Settings → Branches → Add branch protection rule** for `main`:

#### Required Settings

**Branch name pattern:** `main`

- ✅ **Require a pull request before merging**
  - ✅ Require approvals: `1`
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners (if CODEOWNERS file exists)

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Required status checks:
    - `Lint & Type Check`
    - `Test`
    - `Build`
    - `All Checks Passed`

- ✅ **Require conversation resolution before merging**
  - All review comments must be resolved

- ✅ **Require signed commits** (recommended)

- ✅ **Require linear history**
  - Prevents merge commits, enforces rebase or squash

- ✅ **Include administrators**
  - Apply rules to repository administrators too

- ❌ **Allow force pushes** (disabled for safety)

- ❌ **Allow deletions** (disabled for safety)

### Develop Branch Protection (Optional)

If using a develop branch, apply similar but slightly relaxed rules:

**Branch name pattern:** `develop`

- ✅ Require a pull request before merging
- ✅ Require status checks to pass
- ✅ Require conversation resolution
- ❌ Require signed commits (optional)
- ❌ Include administrators (allow admins to bypass)

## Repository Secrets

### Required Secrets

Navigate to **Settings → Secrets and variables → Actions → New repository secret**

#### For CI/CD

1. **CODECOV_TOKEN** (optional)
   - Get from https://codecov.io
   - Enables code coverage reporting

#### For Vercel Deployment

2. **VERCEL_TOKEN**
   - Generate at https://vercel.com/account/tokens
   - Enables automated deployments

3. **VERCEL_ORG_ID**
   - Found in Vercel project settings
   - Required for CLI deployments

4. **VERCEL_PROJECT_ID**
   - Found in Vercel project settings
   - Required for CLI deployments

#### For Build Environment

5. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Public variable, safe to expose in builds

6. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anon key
   - Public variable, safe to expose in builds

## Code Owners (Optional)

Create `.github/CODEOWNERS` file:

\`\`\`
# Global owners
*                       @your-username

# Frontend components
/components/**          @frontend-team @your-username

# API routes
/app/api/**             @backend-team @your-username

# Database & schemas
/supabase/**            @database-team @your-username
/lib/validations/**     @backend-team

# CI/CD & tooling
/.github/**             @devops-team @your-username
/scripts/**             @devops-team
\`\`\`

## Repository Settings

### General Settings

Navigate to **Settings → General**

- ✅ **Allow merge commits** - Disabled
- ✅ **Allow squash merging** - Enabled (default)
- ✅ **Allow rebase merging** - Enabled
- ✅ **Automatically delete head branches** - Enabled
- ❌ **Allow auto-merge** - Optional

### Collaborators & Teams

Navigate to **Settings → Collaborators and teams**

Add team members with appropriate permissions:

- **Admin:** Repository owners
- **Write:** Core contributors
- **Read:** External contributors

### Actions Settings

Navigate to **Settings → Actions → General**

- **Actions permissions:**
  - ✅ Allow all actions and reusable workflows
- **Workflow permissions:**
  - ✅ Read and write permissions
  - ✅ Allow GitHub Actions to create and approve pull requests

## Environment Configuration

### Production Environment

Navigate to **Settings → Environments → New environment**

**Name:** `Production`

- ✅ **Required reviewers:** Select 1-2 reviewers
- ✅ **Wait timer:** 0 minutes
- ✅ **Deployment branches:** Selected branches only → `main`

**Environment secrets:**

- All production secrets (Supabase, Redis, etc.)

### Preview Environment

**Name:** `Preview`

- ❌ **Required reviewers** (optional for previews)
- ✅ **Deployment branches:** All branches

**Environment secrets:**

- Preview/staging secrets

## Webhooks & Integrations

### Recommended Integrations

1. **Codecov**
   - Code coverage reporting
   - https://github.com/marketplace/codecov

2. **Dependabot**
   - Automated dependency updates
   - Enable in **Settings → Code security and analysis**

3. **CodeQL Analysis**
   - Security scanning
   - Enable in **Settings → Code security and analysis**

## Notifications

### Branch Protection Notifications

Set up Slack/Discord webhooks for:

- Failed status checks
- Required reviews
- Protected branch policy violations

## Verification Checklist

After setup, verify:

- [ ] Branch protection rules are active on `main`
- [ ] Required status checks are configured
- [ ] CI/CD workflows run successfully
- [ ] Secrets are properly configured
- [ ] Team members have appropriate access
- [ ] CODEOWNERS file is recognized
- [ ] Auto-delete branches is enabled
- [ ] Deployment environments are configured
- [ ] Webhooks/integrations are working

## Troubleshooting

### Status Checks Not Appearing

1. Make at least one PR to trigger the workflows
2. Wait for workflows to complete
3. Status checks will then appear in branch protection settings

### Required Reviews Not Enforcing

1. Check that branch protection includes administrators
2. Verify CODEOWNERS file syntax
3. Ensure reviewers have write access

### Secrets Not Available in Workflows

1. Check secret names match exactly (case-sensitive)
2. Verify secrets are set at repository level (not environment)
3. Confirm workflows have proper permissions

---

**Last Updated:** 2025-11-19
**Maintainer:** Development Team
GitHub secrets configured for CI/CD pipeline
