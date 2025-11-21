# Branching Strategy

This document outlines the branching strategy for the Second Chance Connect project.

## Branch Structure

We follow a simplified Git Flow strategy with the following branches:

### Protected Branches

#### `main`

- **Purpose**: Production-ready code
- **Protection**: ✅ Enabled
- **Deployment**: Automatically deploys to production (Vercel)
- **Direct commits**: ❌ Not allowed
- **Merge requirements**:
  - ✅ At least 1 approving review required
  - ✅ All CI checks must pass (Lint, Test, Build)
  - ✅ Conversations must be resolved
  - ✅ Stale reviews automatically dismissed

#### `develop`

- **Purpose**: Integration branch for features
- **Protection**: 🔄 Recommended (not yet enabled)
- **Direct commits**: ⚠️ Allowed but discouraged
- **Merge requirements**: Feature branches merge here first

### Working Branches

#### Feature Branches

- **Pattern**: `feature/<ticket-id>-<description>` or `feature/<description>`
- **Base**: `develop`
- **Merge to**: `develop`
- **Lifecycle**: Delete after merge

**Examples**:

\`\`\`
feature/add-user-notifications
feature/123-job-search-filters
feature/improve-dashboard-performance
\`\`\`

#### Bugfix Branches

- **Pattern**: `bugfix/<ticket-id>-<description>` or `bugfix/<description>`
- **Base**: `develop`
- **Merge to**: `develop`
- **Lifecycle**: Delete after merge

**Examples**:

\`\`\`
bugfix/fix-login-redirect
bugfix/456-message-pagination
bugfix/profile-image-upload
\`\`\`

#### Hotfix Branches

- **Pattern**: `hotfix/<description>`
- **Base**: `main`
- **Merge to**: `main` AND `develop`
- **Use case**: Critical production bugs only
- **Lifecycle**: Delete after merge

**Examples**:

\`\`\`
hotfix/security-vulnerability
hotfix/payment-processing-error
hotfix/database-connection-issue
\`\`\`

---

## Workflow

### Standard Feature Development

1. **Create feature branch from develop**:

   \`\`\`bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   \`\`\`

2. **Develop and commit**:

   \`\`\`bash
   # Make changes
   git add .
   git commit -m "feat: add your feature"
   \`\`\`

3. **Push to remote**:

   \`\`\`bash
   git push -u origin feature/your-feature-name
   \`\`\`

4. **Create Pull Request**:
   - Base: `develop`
   - Title: Clear description of feature
   - Description: Use PR template
   - Reviewers: Assign team members

5. **After approval and CI passes**:
   - Merge using "Squash and merge"
   - Delete feature branch

### Release to Production

1. **Create release PR from develop to main**:

   \`\`\`bash
   # Ensure develop is up to date
   git checkout develop
   git pull origin develop

   # Create PR via GitHub CLI
   gh pr create --base main --head develop --title "Release: v1.x.x"
   \`\`\`

2. **Review and test**:
   - Comprehensive testing in staging
   - All CI checks pass
   - Team review and approval

3. **Merge to main**:
   - Use "Create a merge commit" (preserve history)
   - Tag the release

4. **Sync develop with main** (if hotfixes were applied):
   \`\`\`bash
   git checkout develop
   git merge main
   git push origin develop
   \`\`\`

### Hotfix Workflow (Emergency Only)

1. **Create hotfix from main**:

   \`\`\`bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-issue
   \`\`\`

2. **Fix and test thoroughly**:

   \`\`\`bash
   git commit -m "fix: critical security issue"
   git push -u origin hotfix/critical-issue
   \`\`\`

3. **Create PR to main**:

   \`\`\`bash
   gh pr create --base main --head hotfix/critical-issue --title "Hotfix: Critical Issue"
   \`\`\`

4. **After merging to main, also merge to develop**:
   \`\`\`bash
   git checkout develop
   git merge main
   git push origin develop
   \`\`\`

---

## Commit Message Guidelines

We use **Conventional Commits** format enforced by git hooks.

### Format

\`\`\`
type(scope): subject

body (optional)

footer (optional)
\`\`\`

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks
- `revert`: Revert previous commit

### Examples

\`\`\`bash
feat(auth): add two-factor authentication

fix(api): resolve rate limiting bug in jobs endpoint

docs: update README with setup instructions

chore(deps): upgrade Next.js to version 15.5.7

fix: security vulnerability in token handling

BREAKING CHANGE: API endpoint /api/v1/jobs changed to /api/v2/jobs
\`\`\`

---

## Pull Request Guidelines

### PR Title Format

Use conventional commit format:

\`\`\`
feat: Add user notification system
fix: Resolve dashboard loading issue
docs: Update API documentation
\`\`\`

### PR Description Template

PRs should include:

- **Summary**: What and why
- **Type of change**: Checkboxes
- **Testing**: What was tested
- **Screenshots**: For UI changes
- **Breaking changes**: If applicable
- **Related issues**: Link tickets

### PR Review Process

1. **Automated checks** (must pass):
   - ✅ ESLint
   - ✅ TypeScript type check
   - ✅ Jest tests
   - ✅ Build successful

2. **Code review** (at least 1 approval):
   - Code quality
   - Test coverage
   - Documentation
   - Security considerations

3. **Merge**:
   - Use "Squash and merge" for features
   - Use "Create a merge commit" for releases
   - Delete branch after merge

---

## Branch Protection Rules

### Main Branch Protection

Currently enabled protections:

| Rule                                | Status        | Description                      |
| ----------------------------------- | ------------- | -------------------------------- |
| **Require pull request**            | ✅ Enabled    | No direct commits to main        |
| **Require approvals**               | ✅ 1 required | At least one approval needed     |
| **Dismiss stale reviews**           | ✅ Enabled    | Re-approval needed after changes |
| **Require status checks**           | ✅ Enabled    | Lint, Test, Build must pass      |
| **Require conversation resolution** | ✅ Enabled    | All comments must be resolved    |
| **Require linear history**          | ❌ Disabled   | Allows merge commits             |
| **Allow force pushes**              | ❌ Disabled   | Force push blocked               |
| **Allow deletions**                 | ❌ Disabled   | Branch cannot be deleted         |

### Recommended: Develop Branch Protection

To enable protection on develop:

\`\`\`bash
gh api repos/glkglob/second-chance-connect/branches/develop/protection -X PUT --input - << 'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Lint & Type Check", "Test", "Build"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
\`\`\`

---

## CI/CD Integration

### GitHub Actions Workflows

All branches trigger CI checks:

1. **Lint & Type Check**: ESLint and TypeScript validation
2. **Test**: Jest test suite execution
3. **Build**: Next.js production build verification
4. **Security Audit**: npm audit for vulnerabilities

### Deployment Triggers

- **main branch**: Automatic deployment to Vercel production
- **develop branch**: Can be configured for staging deployment
- **feature branches**: No automatic deployment

---

## Best Practices

### 1. Keep Branches Up to Date

\`\`\`bash
# Regularly sync with develop
git checkout feature/your-feature
git fetch origin
git merge origin/develop
\`\`\`

### 2. Small, Focused PRs

- Aim for PRs under 400 lines of changes
- One feature or fix per PR
- Easy to review and test

### 3. Write Descriptive Commits

\`\`\`bash
# Good
git commit -m "feat(auth): add email verification with token expiration"

# Bad
git commit -m "fix stuff"
\`\`\`

### 4. Test Before Pushing

\`\`\`bash
# Always run before pushing
npm test
npm run type-check
npm run lint
npm run build
\`\`\`

### 5. Clean Up After Merge

\`\`\`bash
# Delete local branch
git branch -d feature/your-feature

# Delete remote branch (happens automatically with GitHub PR merge)
git push origin --delete feature/your-feature
\`\`\`

---

## Quick Reference

### Common Commands

\`\`\`bash
# Start new feature
git checkout develop && git pull && git checkout -b feature/my-feature

# Commit with conventional format
git commit -m "feat(scope): description"

# Push and create PR
git push -u origin feature/my-feature
gh pr create --base develop

# Update feature branch with develop
git fetch origin && git merge origin/develop

# Clean up after merge
git checkout develop && git pull && git branch -d feature/my-feature
\`\`\`

### Branch Naming Cheatsheet

| Type                | Pattern                      | Example                      |
| ------------------- | ---------------------------- | ---------------------------- |
| Feature             | `feature/<description>`      | `feature/user-dashboard`     |
| Feature with ticket | `feature/<id>-<description>` | `feature/123-search-filters` |
| Bugfix              | `bugfix/<description>`       | `bugfix/login-error`         |
| Hotfix              | `hotfix/<description>`       | `hotfix/security-patch`      |
| Release             | `release/v<version>`         | `release/v1.2.0`             |
| Experiment          | `experiment/<description>`   | `experiment/new-ui-design`   |

---

## FAQ

**Q: Can I commit directly to develop?**
A: Technically yes, but it's strongly discouraged. Always use feature branches.

**Q: When should I use a hotfix branch?**
A: Only for critical production bugs that need immediate fixing. Use bugfix branches for normal bugs.

**Q: How often should I merge develop into my feature branch?**
A: At least once a day if develop is active. Before creating a PR is mandatory.

**Q: What if my PR conflicts with main/develop?**
A: Merge the target branch into your feature branch, resolve conflicts, and push.

**Q: Can I merge my own PR?**
A: No. Branch protection requires at least one approval from another team member.

**Q: What happens if CI checks fail?**
A: You cannot merge until all checks pass. Fix the issues and push again.

---

## Updating This Strategy

This branching strategy should be reviewed quarterly and updated as the team grows or project needs change.

**Last updated**: November 19, 2025
**Next review**: February 2026

---

## Related Documentation

- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Code of conduct
- [.github/pull_request_template.md](.github/pull_request_template.md) - PR template
- [CI_CD_SETUP.md](CI_CD_SETUP.md) - CI/CD configuration
