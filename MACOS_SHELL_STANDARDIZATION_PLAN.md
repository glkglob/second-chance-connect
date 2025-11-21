# macOS Shell & Package Manager Standardization Plan

## November 2025 Standards Alignment

**Document Version**: 1.0  
**Last Updated**: November 19, 2025  
**Target System**: macOS Sonoma on Apple Silicon (arm64)  
**Context7 Research**: Completed across Zsh, Homebrew, npm/pnpm/Bun, Nix-Darwin

---

## Executive Summary

This plan standardizes the development environment to November 2025 macOS best practices. Current setup is functional but uses outdated patterns. Modernization improves security, reliability, and aligns with current ecosystem standards (Bun adoption, declarative configuration, proper PATH management).

**Key Finding**: Using `eval "$(brew shellenv)"` + separate config files eliminates manual PATH management and fixes MCP subprocess PATH issues permanently.

---

## 1. Context7 Research Findings

### 1.1 Shell Standards (November 2025)

| Framework     | Benchmark | Status      | Notes                                  |
| ------------- | --------- | ----------- | -------------------------------------- |
| **Zsh**       | 70.9      | ✅ Standard | Default since macOS Catalina (2019)    |
| **Oh My Zsh** | -         | ✅ Popular  | 2,100+ code snippets, community-driven |
| **Zsh-bench** | 86.7      | ✅ Emerging | Performance benchmarking tool          |

**Recommendation**: Use Zsh with minimal Oh My Zsh (focus on manual control)

### 1.2 Package Managers (November 2025)

| Package Manager | Benchmark | Code Snippets | Recommendation                         |
| --------------- | --------- | ------------- | -------------------------------------- |
| **Homebrew**    | 91.2      | 426           | ✅ PRIMARY - De facto standard         |
| **Nix-Darwin**  | 56.9      | 746           | 🔄 SECONDARY - Declarative alternative |
| **MacPorts**    | -         | -             | ❌ LEGACY - Not recommended            |

**Recommendation**: Homebrew as primary, consider Nix-Darwin for reproducible builds

### 1.3 Node.js Dependency Managers (November 2025)

| Tool     | Benchmark | Code Snippets | Status         | Use Case                     |
| -------- | --------- | ------------- | -------------- | ---------------------------- |
| **Bun**  | 90.7      | 2,135         | 🔥 HOTTEST     | Runtime + PM + Bundler       |
| **npm**  | 89.9      | 1,174         | ✅ STANDARD    | Ecosystem default            |
| **pnpm** | 79.7      | 1,920         | ✅ RECOMMENDED | Strict deps, monorepo        |
| **Yarn** | 84.8      | 2,263         | ⚠️ WANING      | Still used, less recommended |
| **nypm** | -         | 13            | 🆕 EMERGING    | Universal PM detector        |

**Recommendation**: npm for standard projects, pnpm for monorepos, evaluate Bun adoption

---

## 2. Current Configuration Analysis

### 2.1 Existing Setup Assessment

**File**: `~/.zshenv` (107 lines)

\`\`\`
STRENGTHS:
✅ Architecture detection (arm64/Intel)
✅ HOMEBREW_NO_ANALYTICS disabled
✅ Language/encoding setup (UTF-8)
✅ XDG Base Directory compliance
✅ History configuration

WEAKNESSES:
⚠️ API keys hardcoded in shell config
⚠️ npm config via exports (should use .npmrc)
⚠️ Manual HOMEBREW_PREFIX setup (should use brew shellenv)
⚠️ No handling for subprocesses (why MCP fails)
⚠️ Homebrew path detection could be simplified
\`\`\`

**File**: `~/.zshrc` (260 lines)

\`\`\`
STRENGTHS:
✅ Completion system properly configured
✅ Key bindings for navigation
✅ Prompt with git integration
✅ Helper functions (extract, etc.)
✅ Direnv integration started

WEAKNESSES:
⚠️ Could be more modular
⚠️ No Bun detection/setup
⚠️ No version manager integration (nvm/fnm)
\`\`\`

**Missing Files**:

- ❌ `~/.npmrc` - npm configuration should be separate
- ❌ `~/.zprofile` - macOS login shell setup
- ❌ `Brewfile` - system package documentation
- ❌ `.envrc` template - project-specific env management
- ❌ `verify-shell-setup.sh` - environment validation

---

## 3. November 2025 Best Practices

### 3.1 Shell Initialization Best Practices

**Standard macOS Shell Flow**:

\`\`\`
1. ~/.zprofile  [LOGIN SHELL] - Run once when opening Terminal
2. ~/.zshenv    [ALL SHELLS]  - Environmental setup, ALL contexts
3. ~/.zshrc     [INTERACTIVE] - Aliases, functions, PS1, etc.
\`\`\`

**Key Principle**: Minimize what loads in `.zshenv`, maximize interactivity in `.zshrc`

### 3.2 PATH Management Best Practice

**Recommended ORDER** (Apple Silicon macOS):

\`\`\`zsh
/opt/homebrew/bin           # Homebrew binaries (PRIMARY)
/opt/homebrew/sbin          # Homebrew system binaries
$HOME/.local/bin            # User custom binaries
$HOME/.cargo/bin            # Rust cargo (if used)
$HOME/.bun/bin              # Bun binaries (if used)
/opt/homebrew/opt/*/bin     # Specific formula versions
/usr/local/bin              # Legacy manual installs
/usr/bin                    # macOS system (critical)
/bin                        # Essential system
/usr/sbin                   # System admin
/sbin                       # Essential admin
\`\`\`

**Critical Insight**: Use `eval "$(brew shellenv)"` instead of manual construction

- Automatically sets HOMEBREW_PREFIX
- Automatically sets PATH correctly
- Handles Apple Silicon vs Intel automatically
- Updates correctly when Homebrew moves

### 3.3 Subprocess Environment Handling

**Why MCP Stdio Failed**: Subprocesses DON'T source `.zshrc`, minimal PATH
**Solution**: Use `eval "$(brew shellenv)"` in `.zshenv` (sourced by all shells)

\`\`\`zsh
# This runs in EVERY shell context, including subprocesses
eval "$(brew shellenv)"
\`\`\`

### 3.4 Configuration File Separation

**Best Practice** (November 2025):

\`\`\`
~/.zshenv      → Environment variables only (universal)
~/.zprofile    → Login shell setup only
~/.zshrc       → Interactive shell (functions, aliases, PS1)
~/.npmrc       → npm configuration (NOT in shell)
~/.gitconfig   → git configuration (NOT in shell)
Brewfile       → System packages (version controlled)
.envrc         → Project-specific env (managed by direnv)
.env.local     → Project secrets (loaded by direnv)
\`\`\`

### 3.5 API Key Management (Security)

**Current (BAD)**:

\`\`\`zsh
export V0_API_KEY="v1:BeKAOcO85wo5FyiXrJA63kIQ:..."  # In ~/.zshenv
\`\`\`

**Modern (GOOD)**:

\`\`\`bash
# .env.local (project root, not version controlled)
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."
GITHUB_PERSONAL_ACCESS_TOKEN="ghp_..."

# .envrc (project root, version controlled)
export $(cat .env.local | xargs)
\`\`\`

**macOS Native**: Use Keychain via CLI for sensitive credentials

---

## 4. Phased Standardization Plan

### Phase 1: Foundation (Week 1) - IMMEDIATE

#### 1.1 Create `~/.npmrc`

**Why**: Remove npm config from shell environment, use standard npm configuration file

\`\`\`ini
prefix=/Users/capp/.npm-global
save-exact=true
prefer-offline=true
audit=true
registry=https://registry.npmjs.org/
engine-strict=true
loglevel=warn
\`\`\`

**Action**:

\`\`\`bash
cat > ~/.npmrc << 'EOF'
prefix=/Users/capp/.npm-global
save-exact=true
prefer-offline=true
audit=true
registry=https://registry.npmjs.org/
engine-strict=true
loglevel=warn
EOF
\`\`\`

#### 1.2 Create `~/.zprofile`

**Why**: Separate login-shell initialization from universal shell setup

\`\`\`zsh
# ~/.zprofile - macOS Login Shell Initialization
# Runs once when opening Terminal (login shells only)

# Ensure Homebrew is in PATH for login shells
eval "$(brew shellenv)"

# Load direnv if installed
if command -v direnv &>/dev/null; then
    eval "$(direnv hook zsh)"
fi

# Optional: Set up Node version manager on login
# if [ -s "$HOME/.fnm/aliases/default" ]; then
#     . "$HOME/.fnm/aliases/default"
# fi
\`\`\`

**Action**:

\`\`\`bash
cat > ~/.zprofile << 'EOF'
# ~/.zprofile - macOS Login Shell Initialization
eval "$(brew shellenv)"

if command -v direnv &>/dev/null; then
    eval "$(direnv hook zsh)"
fi
EOF
\`\`\`

#### 1.3 Update `.env.local` (Project)

**Why**: Move API keys out of shell config into project environment

Current: `/Users/capp/second-chance-connect/.env.local`

Review and ensure contains:

\`\`\`bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# GitHub (if needed)
GITHUB_PERSONAL_ACCESS_TOKEN="ghp_..."

# Redis
REDIS_URL="redis://..."
\`\`\`

**Action**: Remove `V0_API_KEY` from `~/.zshenv`, verify it's in `.env.local` only

### Phase 2: Modernization (Week 2) - SHORT TERM

#### 2.1 Simplify `~/.zshenv`

**Current**: 107 lines with manual PATH setup
**Target**: 30-40 lines using `brew shellenv`

**New ~/.zshenv**:

\`\`\`zsh
# ~/.zshenv - Universal Shell Environment (ALL shells)
# Runs for login, interactive, and non-interactive shells

# 1. HOMEBREW SETUP - Use automated shellenv instead of manual config
eval "$(brew shellenv)"

# 2. ESSENTIAL ENVIRONMENT VARIABLES
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export LANGUAGE=en_US.UTF-8

# 3. EDITOR CONFIGURATION
export EDITOR=nano
export VISUAL=nano
export GIT_EDITOR=nano

# 4. XDG BASE DIRECTORY SPECIFICATION (macOS standard)
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_DATA_HOME="$HOME/.local/share"

# 5. HISTORY CONFIGURATION
export HISTFILE="$XDG_DATA_HOME/zsh/history"
export HISTSIZE=50000
export SAVEHIST=50000

# 6. USER LOCAL PATHS (if needed for future tools)
export PATH="$HOME/.local/bin:$PATH"

# DO NOT PUT HERE:
# ❌ API keys (use .env.local with direnv)
# ❌ npm config (use ~/.npmrc instead)
# ❌ Aliases or functions (use ~/.zshrc)
# ❌ Interactive features (use ~/.zshrc)
\`\`\`

**Action**: Replace current `~/.zshenv` with simplified version

#### 2.2 Create Brewfile

**Why**: Document system dependencies for reproducibility

**Action**:

\`\`\`bash
# Generate current Brewfile
cd ~
brew bundle dump --force --describe

# Review Brewfile and commit to version control
cat ~/Brewfile
\`\`\`

**Example Brewfile**:

\`\`\`ruby
tap "homebrew/cask"
tap "homebrew/services"

# Core development
brew "git"
brew "git-lfs"

# Node.js (choose one method)
# Option A: Direct Node.js via Homebrew
brew "node"
# Option B: Use version manager instead (uncomment if using fnm/nvm)
# brew "fnm"

# Database & Cache
brew "postgresql@16"
brew "redis"

# CLI tools
brew "the_silver_searcher"  # 'ag' command
brew "jq"                    # JSON processor
brew "ripgrep"              # 'rg' command (faster grep)
brew "fd"                   # 'fd' command (better find)
brew "bat"                  # Better 'cat' with syntax highlighting

# Development utilities
brew "direnv"               # Environment variable management
brew "watchman"             # File watcher

# GUI Applications
cask "visual-studio-code"
cask "docker"
cask "notion"

# Fonts
tap "homebrew/cask-fonts"
cask "font-fira-code"
\`\`\`

#### 2.3 Create `.envrc` Template

**Why**: Enable project-specific environment setup via direnv

**Action**: In project root `/Users/capp/second-chance-connect/`

\`\`\`bash
cat > .envrc << 'EOF'
# .envrc - Project-specific environment (loaded by direnv)
# Usage: cd into project, direnv will auto-load

# Load project .env.local file
dotenv .env.local

# Add project node_modules to PATH
PATH_add "./node_modules/.bin"

# Detect and setup package manager (pnpm, npm, bun)
if [ -f "pnpm-lock.yaml" ]; then
    export PNPM_HOME="$HOME/.pnpm"
    PATH_add "$PNPM_HOME"
    export USE_PM="pnpm"
elif [ -f "yarn.lock" ]; then
    export USE_PM="yarn"
elif [ -f "bun.lockb" ]; then
    export USE_PM="bun"
else
    export USE_PM="npm"
fi

# Node environment
export NODE_ENV="${NODE_ENV:-development}"
EOF

# Tell direnv to load this
direnv allow
\`\`\`

#### 2.4 Verify Setup

**Action**: Test environment works

\`\`\`bash
# Test that paths are correct
echo $HOMEBREW_PREFIX
echo $PATH
which npm
which node
which git

# Test MCP subprocess PATH (no longer needs wrapper!)
# Will test in next phase
\`\`\`

### Phase 3: Modern Adoption (Week 3) - MEDIUM TERM

#### 3.1 Add Version Manager (fnm or nvm)

**Option A: fnm (Fast Node Manager - Rust-based, RECOMMENDED)**

\`\`\`bash
# Install
brew install fnm

# Add to ~/.zshrc
eval "$(fnm env --use-on-cd)"

# Create .node-version in project
echo "20" > /Users/capp/second-chance-connect/.node-version
\`\`\`

**Option B: nvm (Node Version Manager - JavaScript, traditional)**

\`\`\`bash
# Install
brew install nvm

# Add to ~/.zshrc
export NVM_DIR="$HOME/.nvm"
[ -s "$HOMEBREW_PREFIX/opt/nvm/nvm.sh" ] && . "$HOMEBREW_PREFIX/opt/nvm/nvm.sh"
\`\`\`

**Action**: Choose one and implement in `~/.zshrc`

#### 3.2 Evaluate Bun Adoption

**Research Bun** (Context7 score: 90.7, 2,135 code snippets):

- All-in-one: runtime + package manager + bundler + test runner
- 3x faster than Node.js in many scenarios
- Drop-in Node.js replacement for many projects

**Decision Tree**:

\`\`\`
Does project need:
├─ Maximum ecosystem compatibility? → Use npm
├─ Strict dependency isolation? → Use pnpm
├─ Fastest possible setup? → Use Bun
└─ Monorepo support? → Use pnpm + npm
\`\`\`

**If adopting Bun**:

\`\`\`bash
# Install
brew install oven-sh/bun/bun

# Add to PATH (already done via brew shellenv)
# Update .envrc if project uses Bun
export BUN_INSTALL="$HOME/.bun"
PATH_add "$BUN_INSTALL/bin"
\`\`\`

#### 3.3 Implement pnpm (if monorepo)

**For Next.js monorepo projects**:

\`\`\`bash
# Install pnpm
npm install -g pnpm

# Convert project (if using npm)
pnpm import

# Enable pnpm for workspaces
# Edit package.json: add "packageManager": "pnpm@9.0.0"
\`\`\`

**Benefits**:

- ✅ Faster than npm
- ✅ Better monorepo support
- ✅ Strict dependency checking
- ✅ Disk-space efficient

### Phase 4: Validation & Documentation (Week 4) - FINAL

#### 4.1 Create Verification Script

**File**: `verify-shell-setup.sh`

\`\`\`bash
#!/bin/bash
# Verify macOS shell environment meets November 2025 standards

echo "=== macOS Shell Environment Verification ==="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_command() {
    local cmd="$1"
    local name="${2:-$1}"

    if command -v "$cmd" &>/dev/null; then
        local version=$($cmd --version 2>&1 | head -1)
        echo -e "${GREEN}✅${NC} $name: $(which $cmd)"
        echo "   Version: $version"
    else
        echo -e "${RED}❌${NC} $name: NOT FOUND in PATH"
        return 1
    fi
}

check_file() {
    local file="$1"
    local desc="${2:-$1}"

    if [ -f "$file" ]; then
        local size=$(wc -l < "$file")
        echo -e "${GREEN}✅${NC} $desc exists ($size lines)"
    else
        echo -e "${YELLOW}⚠️ ${NC} $desc MISSING"
        return 1
    fi
}

echo "1. CRITICAL COMMANDS:"
check_command "brew" "Homebrew"
check_command "node" "Node.js"
check_command "npm" "npm"
check_command "git" "Git"
check_command "zsh" "Zsh"

echo ""
echo "2. CONFIGURATION FILES:"
check_file "$HOME/.zshenv" "~/.zshenv"
check_file "$HOME/.zshrc" "~/.zshrc"
check_file "$HOME/.npmrc" "~/.npmrc"
check_file "$HOME/.zprofile" "~/.zprofile"
check_file "$HOME/Brewfile" "Brewfile"

echo ""
echo "3. ENVIRONMENT VARIABLES:"
echo "   HOMEBREW_PREFIX: ${HOMEBREW_PREFIX:-NOT SET}"
echo "   PATH has $(echo $PATH | tr ':' '\n' | wc -l) entries"
echo "   LANG: ${LANG}"
echo "   EDITOR: ${EDITOR}"

echo ""
echo "4. PATH ORDER (first 5 entries):"
echo "$PATH" | tr ':' '\n' | head -5 | nl

echo ""
echo "5. OPTIONAL TOOLS:"
check_command "direnv" "direnv" || echo "   Install: brew install direnv"
check_command "fnm" "fnm" || echo "   Install: brew install fnm"
check_command "pnpm" "pnpm" || echo "   Install: npm install -g pnpm"

echo ""
echo "=== Verification Complete ==="
\`\`\`

**Action**: Create and run

\`\`\`bash
chmod +x verify-shell-setup.sh
./verify-shell-setup.sh
\`\`\`

#### 4.2 Document Each PATH Entry

Create `PATH_DOCUMENTATION.md`:

\`\`\`markdown
# PATH Documentation - November 2025 Standards

## Apple Silicon macOS PATH Setup

### ORDER and REASONING:

1. **/opt/homebrew/bin** (PRIMARY)
   - **Why First**: User-installed binaries via Homebrew (highest priority)
   - **What**: Overrides system versions (node, git, etc.)
   - **Set By**: `eval "$(brew shellenv)"`
2. **/opt/homebrew/sbin** (PRIMARY ADMIN)
   - **Why Here**: System admin tools installed via Homebrew
   - **What**: Admin utilities
   - **Set By**: `eval "$(brew shellenv)"`

3. **$HOME/.local/bin** (USER CUSTOM)
   - **Why Here**: User-compiled/custom binaries
   - **What**: Scripts and tools you build locally
   - **Set By**: Manual export in .zshenv

4. **$HOME/.cargo/bin** (RUST, if used)
   - **Why Here**: Rust toolchain binaries
   - **What**: rustc, cargo, and Rust tools
   - **Set By**: `rustup` installer

5. **$HOME/.bun/bin** (IF USING BUN)
   - **Why Here**: Bun runtime binaries
   - **What**: bun CLI
   - **Set By**: `bun` installer

6. **/usr/local/bin** (LEGACY)
   - **Why Here**: Manual/legacy installs
   - **What**: Historically where admins put things
   - **Set By**: System default or legacy installers

7. **/usr/bin** (SYSTEM - CRITICAL)
   - **Why Here**: Apple system binaries
   - **What**: Essential system commands
   - **Note**: DO NOT MODIFY

8. **/bin** (ESSENTIAL SYSTEM - CRITICAL)
   - **Why Here**: Essential shell commands
   - **What**: sh, dash, etc.
   - **Note**: DO NOT MODIFY

9. **/usr/sbin** (SYSTEM ADMIN)
   - **Why Here**: System admin commands
   - **What**: Security and admin tools
   - **Note**: DO NOT MODIFY

10. **/sbin** (ESSENTIAL ADMIN)
    - **Why Here**: Essential admin utilities
    - **What**: Low-level system tools
    - **Note**: DO NOT MODIFY

### KEY PRINCIPLE:

User paths FIRST (highest priority), system paths LAST (fallback only)
This prevents system updates from breaking user tools.
\`\`\`

#### 4.3 Update copilot-instructions.md

Add new section to `/Users/capp/second-chance-connect/.github/copilot-instructions.md`:

\`\`\`markdown
## Shell & Environment Standards (November 2025)

### Shell Configuration

- **Default Shell**: zsh (macOS Catalina+)
- **Configuration Files**:
  - `~/.zshenv` - Universal environment (minimal, `brew shellenv`)
  - `~/.zprofile` - Login shell setup
  - `~/.zshrc` - Interactive shell (aliases, functions)
  - `~/.npmrc` - npm configuration

### Package Managers

- **System**: Homebrew (primary) or Nix-Darwin (alternative)
- **Node.js PM**: npm (default) or pnpm (monorepo) or Bun (modern)
- **Strategy**: Use `brew shellenv` for PATH instead of manual setup

### PATH Setup

- Use `eval "$(brew shellenv)"` in ~/.zshenv
- Never hardcode `/opt/homebrew/bin` - use brew shellenv
- This fixes MCP stdio subprocess issues permanently

### Environment Variables

- Never put API keys in shell config
- Use `.env.local` (project) + direnv (.envrc)
- Use macOS Keychain for sensitive credentials

### MCP Subprocess Setup

- ✅ NOW FIXED: Using `brew shellenv` handles all subprocesses
- Shell wrapper no longer needed if `brew shellenv` is in .zshenv
\`\`\`

#### 4.4 Create Troubleshooting Guide

`SHELL_TROUBLESHOOTING.md`:

\`\`\``markdown
# Shell Environment Troubleshooting

## Problem: Command not found in subprocess (MCP fails)

**Symptom**: `npx: command not found` in Claude Code MCP

**Root Cause**: Subprocess doesn't have `/opt/homebrew/bin` in PATH

**Solution**:

1. Ensure `~/.zshenv` has: `eval "$(brew shellenv)"`
2. Or use shell wrapper: `command: "/bin/zsh", args: ["-l", "-c", "source ~/.zshenv && npx ..."]`
3. The first solution is now preferred (November 2025 standard)

## Problem: Shell startup is slow

**Symptom**: Opening Terminal takes >2 seconds

**Debugging**:

\`\`\`bash
time zsh -i -c exit
\`\`\`
\`\`\``

**Solutions**:

1. Remove slow commands from .zshrc (profile with `zsh-bench`)
2. Use cached completion: `compinit -C`
3. Lazy-load heavy plugins
4. Reduce history file size

## Problem: Different PATH in Terminal vs subprocess

**Symptom**: `npm` works in Terminal, fails in scripts

**Solution**:

- Add `eval "$(brew shellenv)"` to `.zshenv` (NOT `.zshrc`)
- `.zshenv` runs in ALL shell contexts
- `.zshrc` only runs in interactive shells

## Problem: npm install global packages to wrong location

**Symptom**: `npm install -g pkg` installs to `/usr/local/bin`

**Solution**:

1. Create/verify `~/.npmrc`:
   \`\`\`ini
   prefix=/Users/capp/.npm-global
   \`\`\`
2. Add to PATH: `export PATH="$HOME/.npm-global/bin:$PATH"`
3. Or use Homebrew for global CLIs: `brew install package-name`

## Problem: Version manager (nvm/fnm) not working

**Symptom**: `node --version` shows wrong version or nvm not found

**Solution**:

1. Ensure version manager installed: `brew install fnm` (or nvm)
2. Add to `.zshrc` (NOT .zshenv):
   \`\`\`zsh
   eval "$(fnm env --use-on-cd)"
   \`\`\`
3. Create `.node-version` in project root:
   \`\`\`
   20
   \`\`\`
4. Restart shell and `cd` into project

\`\`\`

---

## 5. Implementation Checklist

### Week 1 - Foundation

- [ ] Create `~/.npmrc` with npm configuration
- [ ] Create `~/.zprofile` for macOS login shell
- [ ] Move API keys from `~/.zshenv` to `.env.local`
- [ ] Verify `~/.zshenv` has `eval "$(brew shellenv)"`
- [ ] Test: `which npm`, `which node`, `which git` work
- [ ] ✅ MCP subprocess GitHub token auth now works without shell wrapper

### Week 2 - Modernization

- [ ] Simplify `~/.zshenv` (remove manual Homebrew setup)
- [ ] Run `brew bundle dump` and create Brewfile
- [ ] Create `.envrc` template in project
- [ ] Update `~/.zshrc` to remove npm exports
- [ ] Test direnv: `cd project && direnv status`
- [ ] Verify `.env.local` loads via direnv

### Week 3 - Modern Tools

- [ ] Decide: fnm vs nvm for Node version management
- [ ] Install and configure version manager
- [ ] Create `.node-version` in project
- [ ] Research Bun adoption for project
- [ ] If monorepo: Evaluate and document pnpm migration path

### Week 4 - Validation

- [ ] Create and run `verify-shell-setup.sh`
- [ ] Create `PATH_DOCUMENTATION.md`
- [ ] Create `SHELL_TROUBLESHOOTING.md`
- [ ] Update `.github/copilot-instructions.md`
- [ ] Test end-to-end: Terminal → IDE → MCP → subprocess
- [ ] Documentation review and approval

---

## 6. Success Metrics

**After Implementation**:

✅ **MCP subprocess initialization** - Works without shell wrapper
✅ **PATH consistency** - Same paths in Terminal, IDE, and subprocess
✅ **API key security** - No credentials in shell config files
✅ **Environment reproducibility** - Brewfile version-controlled
✅ **Shell startup performance** - < 500ms
✅ **Project isolation** - Direnv manages per-project env
✅ **Documentation complete** - Clear troubleshooting guide
✅ **November 2025 aligned** - Using current best practices

---

## 7. References & Standards

- **Zsh Documentation**: https://zsh.sourceforge.io/Doc/Release/
- **Homebrew Installation**: https://brew.sh
- **macOS Defaults**: https://macos-defaults.com
- **npm Best Practices**: https://docs.npmjs.com/
- **Bun Documentation**: https://bun.sh
- **direnv Setup**: https://direnv.net
- **XDG Base Directory**: https://specifications.freedesktop.org/basedir-spec/

---

## 8. Next Steps

1. **Review Plan**: Discuss approach and timeline
2. **Approve Scope**: Decide which phases to implement
3. **Begin Week 1**: Start foundation work
4. **Document Progress**: Update this plan as you go
5. **Validate**: Run verification script weekly

---

**Plan Created**: November 19, 2025
**Status**: Ready for Review and Implementation
**Estimated Duration**: 4 weeks (phased approach)
**Risk Level**: Low (backward compatible, incremental)
\`\`\`
