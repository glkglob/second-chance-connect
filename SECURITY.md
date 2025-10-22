# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The Second Chance Connect team takes security vulnerabilities seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**Please DO NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by emailing:

**security@secondchanceconnect.org**

Include the following information:
- Type of vulnerability
- Full paths of affected source files
- Location of the affected code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability
- Any suggested fixes (if available)

### What to Expect

You should receive a response within **48 hours** acknowledging receipt of your report. We will:

1. Confirm the vulnerability and determine its impact
2. Work on a fix with priority based on severity
3. Release a security patch as soon as possible
4. Credit you in the security advisory (unless you prefer to remain anonymous)

### Disclosure Policy

- **Immediate Response**: We respond to security reports within 48 hours
- **Fix Timeline**: Critical vulnerabilities are patched within 7 days
- **Public Disclosure**: We coordinate disclosure with the reporter
- **Advisory**: We publish a security advisory after the patch is released

### Security Best Practices

When contributing to this project, please follow these security practices:

#### Authentication & Authorization

- Never bypass Row Level Security (RLS) policies
- Always verify user identity before data access
- Use Supabase Auth for all authentication
- Implement proper role-based access control
- Never store passwords in plain text

#### Data Protection

- Use HTTPS for all production deployments
- Sanitize all user inputs
- Use parameterized queries to prevent SQL injection
- Implement rate limiting on API routes
- Never expose sensitive data in error messages
- Use environment variables for secrets

#### Code Security

- Keep dependencies up to date
- Run security audits regularly (`npm audit`)
- Use CSP headers to prevent XSS
- Implement CSRF protection
- Validate all input on both client and server
- Use prepared statements for database queries

#### API Security

- Authenticate all API requests
- Implement request rate limiting
- Validate and sanitize all inputs
- Use proper HTTP methods (GET for reads, POST for writes)
- Return appropriate error codes without exposing internals
- Log security events for monitoring

#### Database Security

- Enable Row Level Security on all tables
- Use least privilege principle for database roles
- Regularly backup database
- Encrypt sensitive data at rest
- Use SSL for database connections
- Audit database access logs

#### Environment Variables

Never commit the following to source control:
- Database credentials
- API keys
- Supabase keys (except anon key in public code)
- JWT secrets
- Third-party service credentials

Use `.env.local` for local development and set environment variables in your deployment platform.

### Known Security Considerations

#### Supabase RLS Policies

Our application relies on Supabase Row Level Security (RLS) for data access control. The policies are defined in `scripts/002_enable_rls.sql`. 

**Critical RLS Policies:**

1. **Profiles**: Users can view all profiles but only update their own
2. **Jobs**: Anyone can view active jobs; only employers can create/modify
3. **Applications**: Seekers see their applications; employers see applications for their jobs
4. **Messages**: Users can only access their own messages
5. **Services**: Public read access; admin-only write access

**Security Review Checklist:**

- [ ] All tables have RLS enabled
- [ ] Policies are tested with different user roles
- [ ] No policy allows unrestricted access
- [ ] Service role key is never exposed to client
- [ ] Admin role checks are properly implemented

#### Common Vulnerabilities to Check

- **SQL Injection**: Use parameterized queries (Supabase handles this)
- **XSS**: Sanitize all user-generated content
- **CSRF**: Use SameSite cookies and CSRF tokens
- **Authentication Bypass**: Always verify user session
- **Authorization Issues**: Check user roles before data access
- **Mass Assignment**: Explicitly define allowed fields
- **Rate Limiting**: Implement on all public endpoints
- **File Upload**: Validate file types and scan for malware

### Security Tools

We use the following tools to maintain security:

- **npm audit**: Dependency vulnerability scanning
- **ESLint**: Code quality and security linting
- **CodeQL**: Static code analysis (GitHub Actions)
- **Supabase RLS**: Database-level access control
- **Vercel Security Headers**: CSP, HSTS, etc.

### Automated Security Checks

Our CI/CD pipeline includes:

- Dependency vulnerability scans on every PR
- Static code analysis with CodeQL
- Security headers verification
- RLS policy tests

### Incident Response

In case of a security incident:

1. **Contain**: Immediately isolate affected systems
2. **Assess**: Determine scope and impact
3. **Notify**: Inform affected users within 72 hours
4. **Remediate**: Deploy fixes and patches
5. **Review**: Conduct post-incident analysis
6. **Document**: Update security measures

### Security Contacts

- **General Security**: security@secondchanceconnect.org
- **Urgent Issues**: Include [URGENT] in email subject

### Acknowledgments

We appreciate researchers and contributors who help keep Second Chance Connect secure. Security researchers who report valid vulnerabilities will be:

- Credited in our security advisories (with permission)
- Listed in our Hall of Fame
- Eligible for recognition in release notes

Thank you for helping keep Second Chance Connect and our users safe!

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [CWE Top 25](https://cwe.mitre.org/top25/archive/2023/2023_top25_list.html)
