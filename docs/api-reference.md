# API Reference

## Command Line Interface

### Synopsis
```bash
slow-check <command> [arguments...]
```

### Parameters

#### `<command>` (required)
- **Type**: String
- **Description**: The command to execute and monitor
- **Examples**: `npm`, `node`, `curl`, `ping`

#### `[arguments...]` (optional)
- **Type**: String array
- **Description**: Arguments to pass to the target command
- **Examples**: `run build`, `--version`, `-c 5 google.com`

### Exit Codes

| Code | Description |
|------|-------------|
| 0    | Command completed successfully |
| 1    | No command provided or spawn error |
| N    | Exit code from the wrapped command |

## Core Functions

### Command Parser

#### `parseArguments()`
```javascript
const args = process.argv.slice(2);
const command = args[0];
const commandArgs = args.slice(1);
```

**Purpose**: Extracts command and arguments from process.argv

**Returns**: 
- `command`: String - The main command to execute
- `commandArgs`: Array - Arguments for the command

**Validation**:
- Exits with code 1 if no command provided
- Preserves all argument formatting and spacing

### Process Management

#### `spawnCommand(command, args)`
```javascript
const child = spawn(command, commandArgs, {
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe']
});
```

**Parameters**:
- `command`: String - Command to execute
- `args`: Array - Command arguments

**Configuration**:
- `shell: true` - Enables shell command interpretation
- `stdio: ['inherit', 'pipe', 'pipe']` - Inherits stdin, pipes stdout/stderr

**Returns**: ChildProcess object

### Status Management

#### Status States

| State | Condition | Description |
|-------|-----------|-------------|
| `initializing` | Process just started | Initial state before any output |
| `active` | `idle < 2000ms` | Command is actively producing output |
| `quiet` | `2000ms <= idle < 8000ms` | Normal pause in output |
| `still running` | `idle >= 8000ms` | Extended quiet period |

#### `updateStatus()`
```javascript
const idle = Date.now() - lastOutputTime;
if (idle < 2000) status = 'active';
else if (idle < 8000) status = 'quiet';
else status = 'still running';
```

**Purpose**: Determines current command status based on output activity

**Variables**:
- `lastOutputTime`: Timestamp of last output
- `idle`: Milliseconds since last output
- `status`: Current status string

### Visual Feedback

#### Spinner Configuration
```javascript
const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const refreshRate = 120; // milliseconds
```

**Frames**: 10 Braille pattern characters for smooth animation
**Refresh Rate**: 120ms for optimal visual experience

#### `displayProgress()`
```javascript
const spinner = setInterval(() => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const frame = frames[i++ % frames.length];
  process.stdout.write(`\r${frame} Elapsed: ${elapsed}s | Status: ${status}`);
}, 120);
```

**Output Format**: `⠋ Elapsed: 15s | Status: active`

**Components**:
- Animated spinner character
- Elapsed time in seconds
- Current status description

### Stream Handling

#### `handleOutputStream(stream, outputStream)`
```javascript
child.stdout.on('data', (data) => {
  lastOutputTime = Date.now();
  process.stdout.write(`\n${data}`);
});

child.stderr.on('data', (data) => {
  lastOutputTime = Date.now();
  process.stderr.write(`\n${data}`);
});
```

**Purpose**: Monitors and forwards command output

**Behavior**:
- Updates activity timestamp on any output
- Preserves original output formatting
- Handles both stdout and stderr streams
- Adds newline before output to separate from spinner

### Completion Handling

#### `handleCompletion(exitCode)`
```javascript
child.on('close', (code) => {
  clearInterval(spinner);
  process.stdout.write('\r');
  
  const total = Date.now() - startTime;
  console.log(`Completed in ${(total / 1000).toFixed(1)}s`);
  console.log(`Exit code: ${code}`);
  
  process.exit(code);
});
```

**Purpose**: Handles process completion and cleanup

**Actions**:
1. Stops spinner animation
2. Clears spinner line
3. Calculates total execution time
4. Displays completion summary
5. Exits with original command's exit code

### Error Handling

#### `handleSpawnError(error)`
```javascript
child.on('error', (err) => {
  clearInterval(spinner);
  console.error('\n Failed to start process:', err.message);
  process.exit(1);
});
```

**Purpose**: Handles process spawn failures

**Common Errors**:
- Command not found
- Permission denied
- Invalid arguments

**Response**:
- Stops spinner
- Displays error message
- Exits with code 1

## Global Variables

### Timing Variables
```javascript
const startTime = Date.now();     // Process start timestamp
let lastOutputTime = Date.now();  // Last output timestamp
```

### Status Variables
```javascript
let status = 'initializing';      // Current status string
let i = 0;                        // Spinner frame index
```

### Process Variables
```javascript
const child = spawn(...);         // Child process object
const spinner = setInterval(...); // Spinner timer reference
```

## Configuration Options

### Timing Thresholds
```javascript
// Status determination thresholds (milliseconds)
const ACTIVE_THRESHOLD = 2000;    // Active vs quiet
const QUIET_THRESHOLD = 8000;     // Quiet vs still running
```

### Display Settings
```javascript
// Spinner configuration
const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const REFRESH_RATE = 120;         // Milliseconds between updates
```

### Process Configuration
```javascript
// Child process spawn options
const spawnOptions = {
  shell: true,                    // Enable shell interpretation
  stdio: ['inherit', 'pipe', 'pipe'] // stdin inherited, stdout/stderr piped
};
```

## Usage Examples

### Basic Command Monitoring
```bash
slow-check npm install
```

### Long-running Build Process
```bash
slow-check npm run build:production
```

### Network Operations
```bash
slow-check curl -O https://example.com/large-file.zip
```

### System Commands
```bash
slow-check find /usr -name "*.log" -type f
```

### Interactive Commands
```bash
slow-check npm init
# stdin is inherited, so interactive prompts work normally
```

## Integration Notes

### Shell Integration
- Works with any shell (bash, zsh, cmd, PowerShell)
- Preserves command exit codes for script integration
- Supports command chaining and piping

### CI/CD Integration
- Provides visual feedback in automated environments
- Maintains original command behavior
- Useful for identifying slow build steps

### Development Workflow
- Can wrap any development command
- Helps identify performance bottlenecks
- Provides timing information for optimization

This API reference covers all public interfaces and internal functions of the Slow-Check utility, providing developers with comprehensive information for usage, integration, and potential contributions.