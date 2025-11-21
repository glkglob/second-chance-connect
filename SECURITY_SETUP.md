# Security Setup Guide

This guide explains how to securely configure the Second Chance Connect application with proper credential management.

## Critical Security Principle

**NEVER commit secrets, API keys, or tokens to version control.**

## Claude Code Configuration

### Setup Instructions

1. **Copy the template**:

   \`\`\`bash
   cp claude.json.template claude.json
   \`\`\`

2. **Set up your GitHub Personal Access Token**:

   a. Generate a new token at https://github.com/settings/tokens

   b. Click "Generate new token (classic)"

   c. Set permissions (minimum required):
   - `repo` - Full control of private repositories
   - `read:org` - Read org data (if working with org repos)

   d. Copy the token (starts with `ghp_`)

3. **Configure environment variable**:

   **Option A: Using direnv (Recommended)**

   \`\`\`bash
   # Install direnv if not already installed
   brew install direnv

   # Add to ~/.zshrc
   eval "$(direnv hook zsh)"

   # Create .envrc in project root
   echo 'export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_YOUR_TOKEN_HERE' > .envrc

   # Allow direnv to load
   direnv allow
   \`\`\`

   **Option B: Using .env.local**

   \`\`\`bash
   # Add to .env.local
   echo 'GITHUB_PERSONAL_ACCESS_TOKEN=ghp_YOUR_TOKEN_HERE' >> .env.local

   # Source before starting Claude Code
   source .env.local
   \`\`\`

   **Option C: Using ~/.zshenv (Last resort)**

   \`\`\`bash
   # Add to ~/.zshenv
   echo 'export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_YOUR_TOKEN_HERE' >> ~/.zshenv

   # Source it
   source ~/.zshenv
   \`\`\`

4. **Verify configuration**:

   \`\`\`bash
   # Check environment variable is set
   echo $GITHUB_PERSONAL_ACCESS_TOKEN

   # Should output: ghp_YOUR_TOKEN_HERE (or similar)
   \`\`\`

5. **Test Claude Code**:
   - Restart Claude Code
   - GitHub MCP should now work with environment variable

## Supabase Configuration

Supabase credentials should be stored in `.env.local`:

\`\`\`bash
# Add to .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

## Vercel KV Configuration

For rate limiting with Vercel KV:

\`\`\`bash
# Add to .env.local
KV_REST_API_URL=https://your-kv-instance.upstash.io
KV_REST_API_TOKEN=your-kv-token
\`\`\`

## Files That Should NEVER Be Committed

These files are already in `.gitignore`:

- `.env` - Environment variables
- `.env.local` - Local environment overrides
- `.envrc` - direnv configuration
- `claude.json` - Claude Code configuration with secrets

## Security Checklist

Before committing:

- [ ] No API keys in code
- [ ] No tokens in configuration files
- [ ] All secrets in environment variables
- [ ] `.gitignore` includes secret files
- [ ] Ran secret scanner: `gitleaks detect`

## Installing Secret Scanner

Prevent accidental commits of secrets:

\`\`\`bash
# Install gitleaks
brew install gitleaks

# Scan repository
gitleaks detect --source . --verbose

# Add as pre-commit hook (optional)
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
gitleaks protect --staged --verbose
EOF
chmod +x .git/hooks/pre-commit
\`\`\`

## What To Do If You Accidentally Commit A Secret

1. **Revoke the secret immediately**:
   - GitHub tokens: https://github.com/settings/tokens
   - Supabase: Regenerate keys in dashboard
   - Vercel KV: Rotate tokens

2. **Remove from git history**:

   \`\`\`bash
   # Use BFG Repo-Cleaner or git-filter-repo
   # DO NOT use git filter-branch (deprecated)
   \`\`\`

3. **Force push** (if on feature branch):

   \`\`\`bash
   git push --force-with-lease
   \`\`\`

4. **Notify your team** about the exposure

5. **Generate new secrets** with minimal required permissions

## Best Practices

1. **Principle of Least Privilege**: Grant minimum permissions needed
2. **Token Rotation**: Rotate tokens every 90 days
3. **Environment Separation**: Different tokens for dev/staging/production
4. **Secret Scanning**: Run `gitleaks` before every commit
5. **Code Review**: Always check for secrets in PRs
6. **CI/CD**: Add secret scanning to GitHub Actions

## Additional Resources

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP: Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [12-Factor App: Config](https://12factor.net/config)

## Questions?

See [SECURITY.md](SECURITY.md) for reporting security issues.
