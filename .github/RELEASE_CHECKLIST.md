# Release Checklist

Use this checklist when preparing a release from `develop` to `main`.

## Pre-Release Preparation

### Version Planning

- [ ] Version number decided (following [Semantic Versioning](https://semver.org/))
  - **MAJOR**: Breaking changes
  - **MINOR**: New features (backwards compatible)
  - **PATCH**: Bug fixes (backwards compatible)
- [ ] Release date determined
- [ ] Release notes drafted
- [ ] Changelog updated

### Code Quality

- [ ] All feature branches merged to `develop`
- [ ] All tests passing on `develop`: `npm test`
- [ ] Type checking passes: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No known critical bugs
- [ ] Code review completed for all changes

### Testing

- [ ] Unit tests coverage adequate (>80%)
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] User acceptance testing (UAT) completed
- [ ] Performance testing completed
- [ ] Security testing completed
- [ ] Accessibility testing completed
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing completed (iOS, Android)

### Documentation

- [ ] README updated with new features
- [ ] API documentation updated
- [ ] User guides updated
- [ ] Migration guide created (if breaking changes)
- [ ] CHANGELOG.md updated
- [ ] Version number updated in `package.json`

### Dependencies

- [ ] Dependencies up to date: `npm outdated`
- [ ] Security vulnerabilities addressed: `npm audit`
- [ ] License compliance verified
- [ ] Third-party licenses documented

---

## Release Process

### Step 1: Create Release Branch (Optional for Large Releases)

\`\`\`bash
git checkout develop
git pull origin develop
git checkout -b release/v1.x.x
\`\`\`

### Step 2: Final Checks

- [ ] Run full test suite: `npm test`
- [ ] Run type check: `npm run type-check`
- [ ] Run linting: `npm run lint`
- [ ] Build for production: `npm run build`
- [ ] Test production build locally: `npm start`

### Step 3: Update Version

\`\`\`bash
# Update version in package.json
npm version [major|minor|patch] --no-git-tag-version

# Example for minor version:
npm version minor --no-git-tag-version
\`\`\`

- [ ] Version updated in `package.json`
- [ ] Version committed: `git commit -am "chore: bump version to vX.X.X"`

### Step 4: Update Changelog

- [ ] CHANGELOG.md updated with:
  - Release date
  - New features
  - Bug fixes
  - Breaking changes
  - Deprecations
  - Security fixes

### Step 5: Create Release PR

\`\`\`bash
gh pr create --base main --head develop --title "Release: v1.x.x" --body-file .github/RELEASE_PR_TEMPLATE.md
\`\`\`

- [ ] Release PR created
- [ ] PR description complete
- [ ] All CI checks passing
- [ ] Team review requested

### Step 6: Deploy to Staging (if applicable)

- [ ] Deployed to staging environment
- [ ] Smoke tests completed on staging
- [ ] Performance tested on staging
- [ ] User acceptance testing on staging

---

## Release Approval

### Review Requirements

- [ ] At least 2 approvals from team leads
- [ ] All CI/CD checks passing
- [ ] All conversations resolved
- [ ] No blocking issues identified
- [ ] Deployment plan reviewed

### Sign-Off

- [ ] Technical Lead approval
- [ ] Product Owner approval
- [ ] QA Lead approval
- [ ] Security Lead approval (if security changes)

---

## Deployment

### Pre-Deployment

- [ ] Deployment window scheduled
- [ ] Team notified of deployment
- [ ] Rollback plan prepared
- [ ] Monitoring dashboards ready
- [ ] On-call engineer assigned

### Merge to Main

\`\`\`bash
# Merge PR via GitHub UI or:
gh pr merge <pr-number> --merge --delete-branch=false
\`\`\`

- [ ] PR merged to `main`
- [ ] Build triggered successfully
- [ ] Deployment to production initiated

### Post-Deployment Verification

- [ ] Health check endpoint responding: `/api/health`
- [ ] Homepage loads correctly
- [ ] User authentication working
- [ ] Critical user flows tested:
  - [ ] Job seeker can browse jobs
  - [ ] Employer can post job
  - [ ] Messages can be sent
  - [ ] Profile updates work
- [ ] Database connections verified
- [ ] API endpoints responding correctly
- [ ] No error spikes in logs
- [ ] Performance metrics normal

### Create Git Tag

\`\`\`bash
git checkout main
git pull origin main
git tag -a v1.x.x -m "Release version 1.x.x"
git push origin v1.x.x
\`\`\`

- [ ] Git tag created
- [ ] Tag pushed to remote

### Create GitHub Release

\`\`\`bash
gh release create v1.x.x --title "Release v1.x.x" --notes-file RELEASE_NOTES.md
\`\`\`

- [ ] GitHub release created
- [ ] Release notes published
- [ ] Assets attached (if applicable)

---

## Post-Release

### Monitoring (First 24 Hours)

- [ ] Monitor error rates
- [ ] Monitor response times
- [ ] Monitor server resources
- [ ] Monitor user feedback
- [ ] Check for regression issues

### Documentation

- [ ] Release announced to team
- [ ] Release notes sent to stakeholders
- [ ] User documentation updated
- [ ] Support team briefed
- [ ] Known issues documented

### Sync Develop Branch

\`\`\`bash
git checkout develop
git merge main
git push origin develop
\`\`\`

- [ ] `develop` synced with `main`
- [ ] Any hotfixes merged back
- [ ] Development continues on `develop`

---

## Rollback Procedure (If Needed)

### Immediate Actions

1. **Assess the issue**: Determine severity and impact
2. **Communicate**: Notify team immediately
3. **Decision**: Decide on rollback vs. hotfix

### Rollback Steps

\`\`\`bash
# Option 1: Revert the merge commit
git revert -m 1 <merge-commit-hash>
git push origin main

# Option 2: Deploy previous version
gh release list
# Redeploy previous stable version

# Option 3: Use Vercel rollback
vercel rollback <deployment-url>
\`\`\`

- [ ] Rollback executed
- [ ] Production verified
- [ ] Team notified
- [ ] Incident documented

### Post-Rollback

- [ ] Root cause identified
- [ ] Fix developed in `develop`
- [ ] Testing completed
- [ ] New release planned

---

## Release Types

### Major Release (X.0.0)

- Breaking changes
- Major new features
- Significant refactoring
- **Requires**: Extended testing, migration guide, user notification

### Minor Release (1.X.0)

- New features
- Enhancements
- Non-breaking changes
- **Requires**: Standard testing, release notes

### Patch Release (1.0.X)

- Bug fixes
- Security patches
- Minor improvements
- **Requires**: Focused testing, quick release

### Hotfix Release

- Critical production bugs
- Security vulnerabilities
- **Requires**: Immediate testing and deployment

---

## Metrics to Track

### Pre-Release

- [ ] Test coverage: \_\_\_\_%
- [ ] Code quality score: \_\_\_\_
- [ ] Build time: \_\_\_\_
- [ ] Bundle size: \_\_\_\_ MB

### Post-Release

- [ ] Deployment time: \_\_\_\_
- [ ] Error rate: \_\_\_\_%
- [ ] Response time: \_\_\_\_ ms
- [ ] User adoption: \_\_\_\_%

---

## Emergency Contacts

- **Technical Lead**: ******\_\_\_\_******
- **DevOps**: ******\_\_\_\_******
- **Product Owner**: ******\_\_\_\_******
- **On-Call Engineer**: ******\_\_\_\_******
- **Support Team**: ******\_\_\_\_******

---

## Release Notes Template

\`\`\`markdown
# Release v1.x.x - [Date]

## 🎉 Highlights

[Brief summary of major changes]

## ✨ New Features

- Feature 1
- Feature 2

## 🐛 Bug Fixes

- Fix 1
- Fix 2

## ⚡ Performance Improvements

- Improvement 1

## 🔒 Security

- Security fix 1

## 💥 Breaking Changes

- Breaking change 1
- Migration guide: [link]

## 📝 Documentation

- Updated API docs
- New user guide

## 🙏 Contributors

Thank you to all contributors!

---

**Full Changelog**: https://github.com/org/repo/compare/v1.0.0...v1.1.0
\`\`\`

---

## Sign-Off

**Release Version**: v**\_\_**
**Release Date**: ****\_\_****
**Released By**: ****\_\_****

**Approvals**:

- [ ] Technical Lead: ******\_\_\_\_****** (Date: **\_\_**)
- [ ] Product Owner: ******\_\_\_\_****** (Date: **\_\_**)
- [ ] QA Lead: ******\_\_\_\_****** (Date: **\_\_**)

---

**Template Version**: 1.0
**Last Updated**: November 19, 2025
