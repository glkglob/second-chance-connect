# macOS Shell Standardization - Immediate Action Items

**Priority**: HIGH  
**Timeline**: This week (November 19-22, 2025)  
**Status**: Ready to implement

---

## ✅ COMPLETED

- [x] GitHub MCP shell wrapper fix (using `/bin/zsh` with source ~/.zshenv)
- [x] Sequential thinking analysis completed
- [x] Context7 research on standards completed
- [x] Comprehensive standardization plan created
- [x] All documentation written

---

## 🎯 DO NOW (Today)

### Action 1: Create ~/.npmrc

**Why**: Move npm configuration out of shell into dedicated file  
**Time**: 2 minutes

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

# Verify
cat ~/.npmrc
\`\`\`

### Action 2: Create ~/.zprofile

**Why**: macOS login shell setup separate from universal shell setup  
**Time**: 2 minutes

\`\`\`bash
cat > ~/.zprofile << 'EOF'
# ~/.zprofile - macOS Login Shell Initialization
# Runs once when opening Terminal (login shells only)

# Ensure Homebrew is in PATH for login shells
eval "$(brew shellenv)"

# Load direnv if installed
if command -v direnv &>/dev/null; then
    eval "$(direnv hook zsh)"
fi
EOF

# Verify
cat ~/.zprofile
\`\`\`

### Action 3: Verify ~/.zshenv has brew shellenv

**Why**: Ensures all shell contexts (including subprocesses) have proper PATH  
**Time**: 2 minutes

\`\`\`bash
# Check if brew shellenv is present
grep -n "brew shellenv" ~/.zshenv

# If NOT present, add near the top after the header:
# Find the line number for the first export
head -20 ~/.zshenv
\`\`\`

**Expected**: Should see line with `eval "$(brew shellenv)"`

If missing, add after line 5:

\`\`\`bash
sed -i '' '5a\
eval "$(brew shellenv)"' ~/.zshenv
\`\`\`

### Action 4: Move API keys from ~/.zshenv to .env.local

**Why**: Security - API keys shouldn't be in shell config  
**Time**: 3 minutes

\`\`\`bash
# Check what's in ~/.zshenv
grep -i "api_key\|token" ~/.zshenv

# These lines should be REMOVED from ~/.zshenv:
# export V0_API_KEY="YOUR_V0_API_KEY_HERE"

# Verify they're in .env.local (project root)
cat /Users/capp/second-chance-connect/.env.local | grep -i "supabase\|github"

# Should see SUPABASE_URL, SUPABASE_ANON_KEY, etc.
\`\`\`

### Action 5: Test that everything works

**Why**: Validate changes before proceeding  
**Time**: 5 minutes

\`\`\`bash
# Open new Terminal window (to load ~/.zprofile)
# Then run these tests:

# Test 1: npm works
npm --version
# Expected: version number (11.6.2 or higher)

# Test 2: Homebrew in PATH
which brew
# Expected: /opt/homebrew/bin/brew

# Test 3: Node in PATH
node --version
# Expected: v25 or higher

# Test 4: Git in PATH
git --version
# Expected: git version 2.x or higher

# Test 5: Check if ~/.zprofile was sourced
echo $HOMEBREW_PREFIX
# Expected: /opt/homebrew
\`\`\`

---

## 📋 VERIFY BEFORE PROCEEDING (Week 2)

After doing the above 5 actions, verify:

\`\`\`bash
# 1. Check all config files exist and are readable
ls -la ~/.zshenv ~/.zshrc ~/.zprofile ~/.npmrc

# 2. Test MCP subprocess (no more shell wrapper needed)
# This should work directly without the wrapper:
npx @robinson_ai_systems/github-mcp --version

# 3. Verify ~/.zshenv simplification is compatible
# Restart Claude Code and test GitHub MCP again
\`\`\`

---

## 🚀 NEXT WEEK (Week 2) - Don't do yet

- [ ] Simplify ~/.zshenv further (remove manual Homebrew setup)
- [ ] Run `brew bundle dump` to create Brewfile
- [ ] Create .envrc template in project
- [ ] Test direnv integration

---

## 📚 Reference Documents

- **Full Plan**: `MACOS_SHELL_STANDARDIZATION_PLAN.md` (832 lines)
- **Summary**: `SHELL_STANDARDIZATION_SUMMARY.md` (205 lines)
- **MCP Details**: `MCP_GITHUB_SHELL_FIX.md` (154 lines)

---

## ⏱️ Estimated Time

Total for all 5 actions: **15-20 minutes**

---

## ✨ Expected Results After These 5 Actions

✅ npm/node/git all work in all shell contexts  
✅ MCP subprocess PATH issues FIXED  
✅ API keys no longer in shell config  
✅ Standard ~/.npmrc file exists  
✅ macOS-specific login setup separate  
✅ Ready for Week 2 modernization

---

## 🆘 If Something Goes Wrong

**Symptom**: Changes broke shell initialization

**Recovery**:

\`\`\`bash
# Restore from backup or reinstall from defaults
# ~/.zshenv and ~/.zshrc are usually OK to edit, but if broken:

# Reinstall Homebrew environment:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Verify basic shell still works
zsh --version
\`\`\`

---

## ✅ Completion Checklist

When all 5 actions are done:

- [ ] ~/.npmrc created with npm config
- [ ] ~/.zprofile created with login shell setup
- [ ] ~/.zshenv verified to have `eval "$(brew shellenv)"`
- [ ] API keys removed from ~/.zshenv
- [ ] All 5 test commands passed
- [ ] Verified in new Terminal window
- [ ] Ready to proceed to Week 2

---

**Status**: Ready to start  
**Start Date**: November 19, 2025  
**Expected Completion**: November 19, 2025 (same day)
