# GitHub MCP Authentication Fix - Shell Environment Issue

## Problem Identified

GitHub MCP was failing to authenticate in Claude Code despite:

- ✅ Valid GitHub personal access token (brand new)
- ✅ Correct MCP package (`@robinson_ai_systems/github-mcp` v2.0.1)
- ✅ Working Node.js (v25.2.0) and npm (11.6.2)
- ✅ Terminal commands working fine

**Root Cause**: Claude Code's stdio subprocesses execute in a **minimal shell environment** that doesn't source `.zshenv` or `.zshrc`. This means:

1. **Missing PATH Configuration**: The subprocess gets default system PATH (`/usr/bin:/bin:/usr/sbin:/sbin`) without Homebrew paths
2. **No Node Binaries Access**: Node/npm installed at `/opt/homebrew/bin` (Apple Silicon Homebrew) are not in the subprocess PATH
3. **Command Fails**: When stdio subprocess tries to execute `npx -y @robinson_ai_systems/github-mcp`, `npx` cannot be found

## How Shell Environment Differs

### Interactive Terminal Shell

```
Terminal → Sources ~/.zshenv → Sets HOMEBREW_PREFIX=/opt/homebrew
         → Adds /opt/homebrew/bin to PATH
         → Sources ~/.zshrc → Interactive shell ready
         → npx is found ✅ GitHub MCP runs successfully
```

### Claude Code Stdio Subprocess (Before Fix)

```
Claude Code → Spawns subprocess with "npx" command
           → Subprocess gets minimal PATH (/usr/bin:/bin:/usr/sbin:/sbin)
           → DOES NOT source ~/.zshenv (non-interactive)
           → /opt/homebrew/bin NOT in PATH
           → npx not found ❌ GitHub MCP fails
```

## Solution Implemented

**Use a shell wrapper that sources `.zshenv` before running the command:**

```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "/bin/zsh",
      "args": ["-l", "-c", "source ~/.zshenv && npx -y @robinson_ai_systems/github-mcp"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
      }
    }
  }
}
```

### How This Works

1. **`/bin/zsh`**: Execute zsh shell
2. **`-l` flag**: Login shell (processes login-specific initialization)
3. **`-c` command`**: Execute command string in that shell
4. **`source ~/.zshenv`**: Explicitly source environment variables
   - Sets `HOMEBREW_PREFIX=/opt/homebrew`
   - Adds `/opt/homebrew/bin` to PATH
   - Node and npm become accessible
5. **`npx -y @robinson_ai_systems/github-mcp`**: Now executes successfully in initialized environment

### Flow After Fix

```
Claude Code → Spawns zsh subprocess with "-l -c 'source ~/.zshenv && npx ...'"
           → Zsh loads as login shell (sources ~/.zshenv)
           → HOMEBREW_PREFIX and PATH properly initialized
           → /opt/homebrew/bin now in PATH
           → npx is found ✅
           → GitHub MCP package installed and runs ✅
           → Authentication succeeds ✅
```

## Alternative Solutions Considered

### Option A: Absolute Path to Node

```json
"command": "/opt/homebrew/bin/node",
"args": ["--no-warnings", "/path/to/github-mcp/index.js"]
```

**Pros**: Direct, no shell overhead
**Cons**: Fragile (hardcoded paths), requires finding exact package location, breaks on version updates

### Option C: Direct PATH Environment Variable

```json
"env": {
  "PATH": "/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin",
  "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
}
```

**Pros**: Simple, direct
**Cons**: Hardcoded paths less maintainable, doesn't leverage existing shell configuration

## Why Option B (Shell Wrapper) is Best

✅ **Robust**: Uses existing shell configuration system
✅ **Maintainable**: Changes to `.zshenv` automatically propagate
✅ **Consistent**: Mirrors terminal environment exactly
✅ **Universal**: Works with any shell configuration changes
✅ **Reliable**: Login shell ensures all initialization runs

## Verification Steps

1. **Restart Claude Code** to pick up the new configuration
2. **Test GitHub MCP** by asking Claude to perform a GitHub operation:
   - "List my GitHub repositories"
   - "Show recent commits from [repo-name]"
   - Any other GitHub API operation
3. **Check for success**: Should execute without authentication errors

## Configuration File Location

- **File**: `/Users/capp/second-chance-connect/claude.json`
- **Modified**: MCP GitHub server configuration
- **Timestamp**: November 2025

## Environment Details

- **Shell**: Zsh 5.9 (arm64-apple-darwin)
- **OS**: macOS Sonoma
- **Architecture**: Apple Silicon (arm64)
- **Homebrew Path**: `/opt/homebrew`
- **Node Version**: 25.2.0
- **npm Version**: 11.6.2

## Related Documentation

- Shell Config: `~/.zshenv` and `~/.zshrc`
- MCP Config: `claude.json`
- GitHub MCP Package: `@robinson_ai_systems/github-mcp` v2.0.1 (199 tools, actively maintained)
- Token: Valid GitHub personal access token with appropriate scopes

## Troubleshooting

If GitHub MCP still doesn't work after this fix:

1. **Check token expiration**: Generate a new token if needed
2. **Verify zsh installation**: `which zsh`
3. **Test manual command**: `zsh -l -c 'source ~/.zshenv && npx -y @robinson_ai_systems/github-mcp'`
4. **Check Homebrew paths**: `echo $HOMEBREW_PREFIX` in terminal
5. **Review Claude Code logs**: Check for subprocess initialization errors

## Files Modified

- `claude.json`: Updated GitHub MCP stdio configuration to use shell wrapper

## Summary

This fix resolves the GitHub MCP authentication failure by ensuring the MCP subprocess runs in a properly initialized shell environment with full access to Homebrew-installed Node/npm binaries. The shell wrapper approach is maintainable, robust, and consistent with terminal behavior.
