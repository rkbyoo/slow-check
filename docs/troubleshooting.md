# Troubleshooting Guide

This guide helps resolve common issues when using Slow-Check.

## Common Issues

### 1. Command Not Found Error

**Problem**: `slow-check: command not found`

**Symptoms**:
```bash
$ slow-check npm --version
bash: slow-check: command not found
```

**Solutions**:

#### Option A: Global Installation
```bash
npm install -g .
```

#### Option B: Local Linking
```bash
npm link
```

#### Option C: Direct Execution
```bash
node index.js npm --version
```

#### Option D: Add to PATH
```bash
# Add to ~/.bashrc or ~/.zshrc
export PATH="$PATH:/path/to/slow-check"
```

**Verification**:
```bash
which slow-check
slow-check --help
```

### 2. Permission Denied

**Problem**: Permission errors when installing or running

**Symptoms**:
```bash
$ npm install -g .
EACCES: permission denied, mkdir '/usr/local/lib/node_modules/slow-check'
```

**Solutions**:

#### Option A: Use sudo (not recommended)
```bash
sudo npm install -g .
```

#### Option B: Configure npm prefix
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g .
```

#### Option C: Use npx
```bash
npx . npm --version
```

### 3. Spinner Not Displaying

**Problem**: No visual feedback, only command output

**Symptoms**:
- Command runs but no spinner appears
- Missing elapsed time and status information

**Possible Causes**:
1. Terminal doesn't support Unicode characters
2. Output redirection interfering with display
3. Terminal width too narrow

**Solutions**:

#### Check Terminal Support
```bash
# Test Unicode support
echo "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
```

#### Check Terminal Width
```bash
# Ensure terminal is wide enough
tput cols  # Should be > 40 characters
```

#### Test in Different Terminal
```bash
# Try in different terminal emulator
# or different shell
```

### 4. Output Formatting Issues

**Problem**: Garbled output or formatting problems

**Symptoms**:
```bash
⠋ Elapsed: 5s | Status: activeHello World
⠙ Elapsed: 6s | Status: quietDone!
```

**Cause**: Newline handling in output streams

**Solution**: This is expected behavior. The spinner updates on the same line, and command output appears on new lines.

**Workaround**: If problematic, redirect output:
```bash
slow-check npm run build > build.log 2>&1
```

### 5. Process Hanging

**Problem**: Command appears to hang indefinitely

**Symptoms**:
- Spinner shows "still running" for extended periods
- No output from wrapped command
- Process doesn't respond to Ctrl+C

**Debugging Steps**:

#### Check if Command Actually Hangs
```bash
# Run command without slow-check
npm run build
```

#### Check Process Status
```bash
# In another terminal
ps aux | grep slow-check
ps aux | grep <your-command>
```

#### Force Termination
```bash
# Ctrl+C should work
# If not, find and kill process
kill -9 <process-id>
```

**Common Causes**:
1. Interactive prompts waiting for input
2. Network timeouts
3. File system locks
4. Infinite loops in wrapped command

### 6. Exit Code Issues

**Problem**: Wrong exit codes returned

**Symptoms**:
- Script continues after command failure
- CI/CD pipeline doesn't fail when it should

**Verification**:
```bash
slow-check false  # Should exit with code 1
echo $?           # Should print 1

slow-check true   # Should exit with code 0
echo $?           # Should print 0
```

**Solution**: This should work correctly. If not, check:
1. Shell configuration
2. Other wrappers interfering
3. Signal handling issues

### 7. Interactive Command Issues

**Problem**: Interactive commands don't work properly

**Symptoms**:
- Prompts don't appear
- Input not accepted
- Command hangs waiting for input

**Example Problem**:
```bash
slow-check npm init  # Prompts don't show
```

**Cause**: stdin inheritance configuration

**Current Behavior**: Should work correctly with `stdio: ['inherit', 'pipe', 'pipe']`

**Debugging**:
```bash
# Test simple interactive command
slow-check node -e "process.stdin.setRawMode(true); process.stdin.on('data', d => console.log('Got:', d)); console.log('Type something:')"
```

### 8. Performance Issues

**Problem**: Slow-Check adds significant overhead

**Symptoms**:
- Commands run much slower than normal
- High CPU usage
- Memory consumption

**Debugging**:

#### Compare Performance
```bash
# Time without slow-check
time npm run build

# Time with slow-check
time slow-check npm run build
```

#### Check Resource Usage
```bash
# Monitor during execution
top -p $(pgrep -f slow-check)
```

**Solutions**:
1. Adjust spinner refresh rate (modify code)
2. Check for memory leaks in long-running commands
3. Ensure proper cleanup of timers

### 9. Windows-Specific Issues

**Problem**: Issues on Windows systems

**Common Windows Problems**:

#### PowerShell Execution Policy
```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy if needed
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Path Separator Issues
```bash
# Use forward slashes or escape backslashes
slow-check dir /s *.js
```

#### Unicode Support
```cmd
# Ensure Unicode support in cmd
chcp 65001
```

### 10. Node.js Version Issues

**Problem**: Compatibility issues with Node.js versions

**Symptoms**:
- Syntax errors
- Missing features
- Unexpected behavior

**Check Node Version**:
```bash
node --version  # Should be 12.0 or higher
```

**Solutions**:
1. Update Node.js to supported version
2. Use nvm to manage Node versions:
   ```bash
   nvm install 16
   nvm use 16
   ```

## Debugging Techniques

### 1. Enable Debug Mode

Add debug logging to the code:

```javascript
// Add at the top of index.js
const DEBUG = process.env.SLOW_CHECK_DEBUG === '1';
function debug(msg) {
  if (DEBUG) console.error(`[DEBUG] ${msg}`);
}

// Use throughout code
debug(`Spawning: ${command} ${commandArgs.join(' ')}`);
debug(`Status: ${status}, Idle: ${idle}ms`);
```

**Usage**:
```bash
SLOW_CHECK_DEBUG=1 slow-check npm --version
```

### 2. Test with Simple Commands

Start with basic commands to isolate issues:

```bash
# Test basic functionality
slow-check echo "test"
slow-check pwd
slow-check date

# Test timing
slow-check sleep 5

# Test output handling
slow-check ls -la
```

### 3. Check Environment

```bash
# Check Node.js setup
node --version
npm --version
which node

# Check terminal capabilities
echo $TERM
tput colors
```

### 4. Isolate the Problem

```bash
# Run without slow-check
your-command

# Run with slow-check
slow-check your-command

# Compare behavior
```

## Getting Help

### 1. Gather Information

When reporting issues, include:

- Operating system and version
- Node.js version
- Terminal/shell being used
- Complete command that fails
- Full error output
- Expected vs actual behavior

### 2. Create Minimal Reproduction

```bash
# Simplest command that reproduces the issue
slow-check echo "test"  # Does this work?
slow-check your-failing-command
```

### 3. Check Logs

```bash
# Enable debug mode
SLOW_CHECK_DEBUG=1 slow-check your-command 2> debug.log

# Check system logs if needed
tail -f /var/log/system.log  # macOS
journalctl -f               # Linux
```

## Prevention Tips

### 1. Regular Testing

```bash
# Test after system updates
slow-check echo "System check"
slow-check npm --version
```

### 2. Environment Consistency

```bash
# Use consistent Node.js versions
nvm use 16

# Document dependencies
node --version > .nvmrc
```

### 3. Proper Installation

```bash
# Clean installation
npm uninstall -g slow-check
npm cache clean --force
npm install -g .
```

### 4. Shell Configuration

```bash
# Add to shell profile
echo 'alias sc="slow-check"' >> ~/.bashrc
source ~/.bashrc
```

This troubleshooting guide covers the most common issues users might encounter. Most problems are related to installation, environment setup, or terminal compatibility rather than bugs in the core functionality.