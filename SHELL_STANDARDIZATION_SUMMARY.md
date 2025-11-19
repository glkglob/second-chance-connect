# macOS Shell Standardization - Executive Summary

**Date**: November 19, 2025  
**Status**: Plan Complete, Ready for Implementation  
**Context**: Sequential thinking analysis + Context7 research

---

## Key Findings

### Current State vs. November 2025 Standards

| Aspect              | Current               | Standard 2025             | Gap            |
| ------------------- | --------------------- | ------------------------- | -------------- |
| **Shell Init**      | Manual Homebrew setup | `eval "$(brew shellenv)"` | ⚠️ Manual      |
| **API Keys**        | In `.zshenv`          | In `.env.local` + direnv  | ⚠️ Security    |
| **npm Config**      | Exported in shell     | `~/.npmrc` file           | ⚠️ Wrong place |
| **Subprocesses**    | Fail without wrapper  | Work with `brew shellenv` | ✅ FIXABLE     |
| **Version Manager** | Not configured        | fnm or nvm                | ⚠️ Missing     |
| **Package Manager** | npm only              | npm/pnpm/Bun options      | ⚠️ Limited     |
| **Documentation**   | Incomplete            | Full standards            | ⚠️ Missing     |

---

## Research Highlights (Context7)

**Zsh**: De facto macOS default since Catalina (2019)  
**Homebrew**: 91.2 benchmark score, 426 code snippets - PRIMARY standard  
**Bun**: 90.7 benchmark, 2,135 snippets - HOTTEST emerging tool  
**npm**: 89.9 benchmark, 1,174 snippets - STABLE ecosystem default  
**pnpm**: 79.7 benchmark, 1,920 snippets - RECOMMENDED for monorepos

---

## Root Cause: Why MCP Subprocess Fails

```
PROBLEM:
→ MCP uses stdio subprocess
→ Subprocess gets minimal PATH from system defaults
→ Missing /opt/homebrew/bin (where npm/node are)
→ npx not found → MCP fails

SOLUTION (Already Implemented):
→ Shell wrapper sources .zshenv
→ OR (Better): Use `eval "$(brew shellenv)"` in .zshenv
→ This runs in ALL shell contexts, including subprocesses
→ Now npx IS found
```

---

## Critical Changes Needed

### Immediate (Week 1)

1. ✅ **GitHub MCP Shell Wrapper** - DONE
2. **Create `~/.npmrc`** - Move npm config from shell
3. **Create `~/.zprofile`** - macOS login shell setup
4. **Move API keys** - From `~/.zshenv` to `.env.local`

### Short-term (Week 2)

1. **Simplify `~/.zshenv`** - Use `brew shellenv` instead of manual setup
2. **Create Brewfile** - System package reproducibility
3. **Setup direnv** - Project-specific environment management
4. **Create `.envrc`** - Environment variable per-project setup

### Medium-term (Week 3)

1. **Add version manager** - fnm or nvm for Node.js
2. **Evaluate Bun** - Modern all-in-one runtime
3. **Document pnpm** - For monorepo support
4. **Test Bun adoption** - Performance benefits

### Long-term (Week 4)

1. **Create verification script** - Validate setup
2. **Document all PATH entries** - Understand each one
3. **Create troubleshooting guide** - Common issues
4. **Update team documentation** - For consistency

---

## Benefits of Standardization

### Immediate

✅ MCP stdio subprocesses work without wrapper  
✅ Better security (API keys out of shell config)  
✅ Simplified shell configuration

### Short-term

✅ Reproducible system setup (Brewfile)  
✅ Project-specific environments (direnv)  
✅ Cleaner configuration (separate config files)

### Long-term

✅ Aligned with November 2025 standards  
✅ Modern tooling support (Bun, pnpm)  
✅ Better team consistency  
✅ Future-proof (easy to update)

---

## Implementation Path

```
Phase 1 (Week 1) - Foundation
├─ ~/.npmrc creation
├─ ~/.zprofile creation
└─ API keys relocation
   ↓
Phase 2 (Week 2) - Modernization
├─ ~/.zshenv simplification
├─ Brewfile creation
├─ direnv setup
└─ .envrc template
   ↓
Phase 3 (Week 3) - Modern Tools
├─ Node version manager
├─ Bun evaluation
└─ pnpm documentation
   ↓
Phase 4 (Week 4) - Validation
├─ Verification scripts
├─ Documentation complete
└─ Team alignment
```

---

## Key Decision Points

### 1. Node Version Manager

- **Option A**: fnm (Rust-based, FASTER) ← RECOMMENDED
- **Option B**: nvm (JavaScript, traditional)
- **Decision**: Choose based on performance preference

### 2. Package Manager for Projects

- **Option A**: npm (default, safe)
- **Option B**: pnpm (strict, for monorepo)
- **Option C**: Bun (modern, fast alternative)
- **Decision**: Depends on project requirements

### 3. System Configuration

- **Option A**: Homebrew (current) ← RECOMMENDED
- **Option B**: Nix-Darwin (declarative, reproducible)
- **Decision**: Homebrew for now, Nix-Darwin as future option

---

## Success Definition

After 4 weeks of implementation:

✅ Shell startup time < 500ms  
✅ MCP subprocesses work without shell wrapper  
✅ All commands findable in PATH (npm, node, git, brew)  
✅ API keys NOT in shell config files  
✅ Environment reproducible via Brewfile  
✅ Projects use direnv for env management  
✅ Documentation complete and tested  
✅ Team aligned on standards

---

## Files Created During Analysis

1. **MACOS_SHELL_STANDARDIZATION_PLAN.md** (832 lines)
   - Complete implementation plan
   - Phase-by-phase breakdown
   - Templates and examples
   - Troubleshooting guide

2. **MCP_GITHUB_SHELL_FIX.md** (154 lines)
   - Details on GitHub MCP subprocess issue
   - Root cause analysis
   - Shell wrapper solution explanation

3. **MCP_GITHUB_QUICKREF.txt** (50 lines)
   - Quick reference for MCP fix

---

## Immediate Next Steps

1. **Review** this summary with the team
2. **Approve** the standardization plan
3. **Begin Week 1** foundation phase
4. **Create** ~/.npmrc and ~/.zprofile
5. **Implement** by November 26, 2025

---

## Questions to Answer

1. **Priority**: Implement all 4 phases or just foundation?
2. **Timeline**: Weekly or faster pace?
3. **Version Manager**: fnm or nvm preference?
4. **Package Manager**: Stick with npm or evaluate pnpm/Bun?
5. **System Config**: Homebrew only or consider Nix-Darwin?

---

**Research Completed**: November 19, 2025, 14:30  
**Next Review**: November 20, 2025 (Plan discussion)  
**Implementation Start**: November 21, 2025 (Phase 1)  
**Target Completion**: December 12, 2025 (All phases)
