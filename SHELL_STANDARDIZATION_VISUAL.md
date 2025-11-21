# macOS Shell Standardization - Visual Overview

## Current State → Standardized State

\`\`\`
CURRENT (November 2025 - SUBOPTIMAL)
═══════════════════════════════════════════

~/.zshenv (107 lines)                  MCP Subprocess
├─ Manual HOMEBREW_PREFIX setup        ├─ Gets minimal PATH
├─ Manual PATH construction            ├─ Missing /opt/homebrew/bin
├─ npm config via export               ├─ npx not found
├─ API keys hardcoded ⚠️               ├─ GitHub auth fails ❌
└─ Works for interactive shell         └─ Fails for stdio

~/.zshrc (260 lines)
├─ Contains aliases & functions
├─ Some duplication
└─ Good but could be modular

Missing:
├─ ~/.zprofile (macOS login setup)
├─ ~/.npmrc (npm configuration)
├─ Brewfile (system reproducibility)
└─ .envrc (project environment)


STANDARDIZED (November 2025 - OPTIMIZED)
═══════════════════════════════════════════

~/.zprofile (5 lines)                  MCP Subprocess
├─ eval "$(brew shellenv)"             ├─ Gets full PATH from parent
├─ direnv setup                        ├─ /opt/homebrew/bin available
└─ Login shell setup only              ├─ npx found ✅
                                       └─ GitHub auth works ✅
~/.zshenv (30-40 lines)
├─ eval "$(brew shellenv)"
├─ LANG/LC_ALL setup
├─ XDG Base Directory
└─ Minimal, focused

~/.zshrc (260 lines)
├─ Aliases & functions
├─ Completions
└─ Interactive features

~/.npmrc (8 lines)
├─ prefix configuration
├─ save-exact
└─ registry setup

Brewfile (in version control)
├─ System packages documented
├─ Reproducible setup
└─ Easy to share with team

.envrc (in project)
├─ Project environment variables
├─ API keys in .env.local
└─ Loaded by direnv
\`\`\`

---

## Shell Initialization Flow

### Current Flow (Works for interactive, fails for subprocess)

\`\`\`
┌─────────────────────────────────────────────────┐
│ User opens Terminal or runs command             │
└────────────────┬────────────────────────────────┘
                 │
                 ├─ LOGIN SHELL? ─ Yes ──────────→ Run ~/.profile or ~/.bash_profile
                 │                    │
                 │                    └──────────→ (macOS usually goes to ~/.zshrc)
                 │
                 └─ INTERACTIVE? ─ Yes ──────────→ Run ~/.zshrc
                           │
                           ├─ No ───────────────→ Run ~/.zshenv only
                           │
                           └─ Subprocess! ──────→ Minimal PATH ❌
                                    │
                                    └───────────→ MCP FAILS

PROBLEM: ~/.zshenv has manual Homebrew setup
→ If subprocess doesn't source it properly
→ Homebrew PATH missing
→ npx not found


Fixed Flow (Works for all contexts)

┌─────────────────────────────────────────────────┐
│ User opens Terminal or runs command             │
└────────────────┬────────────────────────────────┘
                 │
                 ├─ ANY SHELL ──────────────────→ Run ~/.zshenv
                 │     │
                 │     └─ eval "$(brew shellenv)"
                 │        → Sets HOMEBREW_PREFIX
                 │        → Sets correct PATH
                 │        → Works in SUBPROCESS ✅
                 │
                 ├─ LOGIN? ─ Yes ───────────────→ Run ~/.zprofile
                 │     │
                 │     └─ Setup Homebrew + direnv
                 │
                 └─ INTERACTIVE? ─ Yes ────────→ Run ~/.zshrc
                        │
                        └─ Functions, aliases, prompts

SOLUTION: Use brew shellenv in ~/.zshenv
→ Runs in all shell contexts
→ Includes subprocesses
→ PATH always correct
→ MCP WORKS ✅
\`\`\`

---

## PATH Evolution

### Current Implementation

\`\`\`
Manual construction in ~/.zshenv:
├─ Detects architecture (arm64/Intel)
├─ Sets HOMEBREW_PREFIX
├─ Manually adds to PATH
├─ Multiple exports
├─ Error-prone if paths change
└─ Doesn't work reliably for subprocesses
\`\`\`

### Standardized Implementation

\`\`\`
Using brew shellenv (RECOMMENDED):
├─ Single command: eval "$(brew shellenv)"
├─ Automatically detects arch
├─ Sets HOMEBREW_PREFIX correctly
├─ Handles PATH properly
├─ Future-proof (Homebrew updates it)
└─ Works in ALL shell contexts ✅
\`\`\`

### Comparison

\`\`\`
Manual Approach:
──────────────
if [[ "$(uname -m)" == "arm64" ]]; then
    export HOMEBREW_PREFIX="/opt/homebrew"
else
    export HOMEBREW_PREFIX="/usr/local"
fi
export PATH="$HOMEBREW_PREFIX/bin:$PATH"
export PATH="$HOMEBREW_PREFIX/sbin:$PATH"

Automated Approach (Better):
──────────────────────────
eval "$(brew shellenv)"
# That's it! Homebrew handles everything.
\`\`\`

---

## Configuration Files Organization

### Current (Scattered)

\`\`\`
~/.zshenv
├─ Shell environment ✅
├─ npm config (WRONG) ⚠️
├─ API keys (WRONG) ⚠️
└─ Manual Homebrew setup (OK) ✅

~/.zshrc
├─ Shell interactive setup ✅
└─ Duplicates from ~/.zshenv ⚠️

~/.npmrc → MISSING ❌

~/.zprofile → MISSING ❌

Brewfile → MISSING ❌
\`\`\`

### Standardized (Organized)

\`\`\`
~/.zprofile
└─ macOS login setup (NEW) ✅

~/.zshenv
├─ Universal environment variables ✅
├─ Homebrew setup (via brew shellenv) ✅
└─ Minimal and focused ✅

~/.zshrc
├─ Interactive shell setup ✅
├─ Aliases & functions ✅
└─ Prompt configuration ✅

~/.npmrc
└─ npm configuration (NEW) ✅

Brewfile
└─ System packages (NEW) ✅

.envrc (project)
└─ Project environment (NEW) ✅
\`\`\`

---

## Security: API Keys Evolution

### Current (Vulnerable)

\`\`\`
~/.zshenv
├─ V0_API_KEY="YOUR_V0_API_KEY_HERE"
├─ Problem: Visible in shell config
├─ Problem: In version control if not careful
├─ Problem: Exposed in process listing
└─ Problem: Shared across all contexts
\`\`\`

### Standardized (Secure)

\`\`\`
.env.local (project root, NOT version controlled)
├─ SUPABASE_URL="https://..."
├─ SUPABASE_ANON_KEY="..."
├─ GITHUB_PERSONAL_ACCESS_TOKEN="ghp_..."
└─ Ignored by git (.gitignore includes)

.envrc (project root, version controlled)
├─ export $(cat .env.local | xargs)
└─ Loaded by direnv automatically

Benefits:
├─ Secrets not in shell config ✅
├─ Per-project secrets ✅
├─ Easy to manage (direnv) ✅
├─ Safe to share project config ✅
└─ IDE integration (VS Code supports direnv) ✅
\`\`\`

---

## Phase Timeline

\`\`\`
Nov 19 (Today)          Nov 21-25          Nov 28-Dec 2       Dec 5-12
──────────────────────────────────────────────────────────────────────

IMMEDIATE              FOUNDATION         MODERNIZATION      VALIDATION
5 actions              Create files       Advanced setup     Documentation
(15 mins)              (1 hour)           (2 hours)          (1 hour)

├─ ~/.npmrc            ├─ Brewfile        ├─ Version mgr      ├─ Verify script
├─ ~/.zprofile         ├─ .envrc          ├─ Bun evaluation   ├─ Guide
├─ Verify .zshenv      ├─ direnv setup    ├─ pnpm docs        └─ Team alignment
├─ Remove API keys     └─ Test setup      └─ Performance test
└─ Run tests

    ↓                      ↓                   ↓                   ↓
  WEEK 1               WEEK 2              WEEK 3             WEEK 4
(Ready to start)    (Building block)   (Modern tools)     (Complete)
\`\`\`

---

## Success Criteria

\`\`\`
┌─────────────────────────────────────────┐
│ November 2025 macOS Standards MET       │
└─────────────────────────────────────────┘

✅ MCP subprocess PATH working
   └─ npx accessible in all contexts

✅ Security hardened
   └─ No API keys in shell config

✅ Configuration organized
   └─ Each file has single responsibility

✅ Environment reproducible
   └─ Brewfile + .envrc version controlled

✅ Performance optimized
   └─ Shell startup < 500ms

✅ Team ready
   └─ Documentation complete

✅ Modern tooling ready
   └─ Version managers, package managers configured

✅ Future-proof
   └─ Easy to update standards
\`\`\`

---

## Key Learnings

### From Context7 Research:

- **Zsh** (70.9 score) - De facto standard, well-maintained
- **Homebrew** (91.2 score) - BEST package manager for macOS
- **Bun** (90.7 score) - HOTTEST emerging tool (2,135 code examples!)
- **npm** (89.9 score) - Stable, ecosystem default
- **pnpm** (79.7 score) - Best for monorepos

### From Shell Analysis:

- Use `eval "$(brew shellenv)"` instead of manual setup
- Separate concerns: profiles, envs, rcfiles
- Subprocesses need .zshenv sourcing (NOT .zshrc)
- Security: Keep secrets out of shell configs

### From MCP Investigation:

- Stdio subprocesses need full environment
- Shell wrapper is workaround, not permanent fix
- Using brew shellenv in .zshenv is proper solution
- Now: MCP works without wrapper needed

---

## Next Steps

1. **TODAY** - Complete 5 immediate actions (15 mins)
2. **TOMORROW** - Verify everything works
3. **WEEK 2** - Implement foundation phase (1 hour)
4. **WEEK 3** - Add modern tools (2 hours)
5. **WEEK 4** - Complete documentation (1 hour)

**Total Investment**: ~5 hours over 4 weeks
**Benefit**: Aligned with November 2025 standards, improved security, better team consistency

---

**Created**: November 19, 2025  
**Status**: Ready for implementation  
**Owner**: Development Team  
**Review**: Weekly progress check
