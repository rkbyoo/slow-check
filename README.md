# Slow-Check: Command Progress Monitor

A Node.js command-line utility that provides visual feedback and timing information for long-running commands.

## Problem Statement

When running long-running commands (like builds, tests, or deployments), users often face uncertainty about:
- Whether the command is still running or has hung
- How long the command has been executing
- The current status of the command execution

Slow-Check solves this by wrapping any command with a visual progress indicator, elapsed time tracking, and intelligent status detection.

## Features

- **Visual Progress Indicator**: Animated spinner showing the command is active
- **Elapsed Time Tracking**: Real-time display of execution duration
- **Intelligent Status Detection**: 
  - `active` - Recent output detected
  - `quiet` - No recent output but still running
  - `still running` - Extended period without output
- **Command Output Preservation**: All stdout and stderr are passed through
- **Exit Code Preservation**: Maintains the original command's exit code

## Installation

### Prerequisites
- Node.js (version 12 or higher)
- npm

### Setup
1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd slow-check
   ```

2. Install globally:
   ```bash
   npm install -g .
   ```

   Or run locally:
   ```bash
   npm link
   ```

## Usage

### Basic Usage
```bash
slow-check <command> [arguments...]
```

### Examples

1. **Monitor a build process:**
   ```bash
   slow-check npm run build
   ```

2. **Track a long-running test suite:**
   ```bash
   slow-check npm test
   ```

3. **Monitor file operations:**
   ```bash
   slow-check cp -r large-directory destination
   ```

4. **Track network operations:**
   ```bash
   slow-check curl -O https://example.com/large-file.zip
   ```

### Sample Output
```
⠋ Elapsed: 15s | Status: active
Building application...
Compiling assets...
⠙ Elapsed: 23s | Status: quiet
Optimizing bundle...
Completed in 45.2s
Exit code: 0
```

## Design Decisions

### 1. **Minimal Dependencies**
- Uses only Node.js standard library (`child_process`)
- No external dependencies for maximum compatibility and lightweight installation

### 2. **Non-Intrusive Design**
- Preserves all original command output
- Maintains exit codes for proper shell integration
- Spinner updates on a separate line to avoid interfering with command output

### 3. **Intelligent Status Detection**
- **Active** (< 2 seconds since last output): Command is actively producing output
- **Quiet** (2-8 seconds): Normal pause in output, still healthy
- **Still Running** (> 8 seconds): Extended quiet period, but process is alive

### 4. **Cross-Platform Compatibility**
- Uses shell spawning for maximum command compatibility
- Unicode spinner characters work on modern terminals
- Handles both stdout and stderr streams

### 5. **User Experience Focus**
- 120ms spinner refresh rate for smooth animation
- Clear completion summary with total time and exit code
- Immediate feedback on process start failures

## Technical Implementation

### Core Components

1. **Process Spawning**: Uses `child_process.spawn()` with shell mode for maximum compatibility
2. **Stream Handling**: Pipes stdout/stderr while monitoring for activity
3. **Status Tracking**: Time-based logic to determine command activity level
4. **Visual Feedback**: Animated spinner with contextual status information

### Error Handling

- **Command Not Found**: Clear error message and exit code 1
- **Process Spawn Errors**: Graceful handling with descriptive error messages
- **Signal Handling**: Proper cleanup of spinner on process termination

## Benefits

1. **Improved User Experience**: Visual confirmation that commands are running
2. **Better Debugging**: Timing information helps identify performance bottlenecks
3. **Reduced Anxiety**: Clear status indicators prevent uncertainty about hung processes
4. **Universal Compatibility**: Works with any command-line tool
5. **Zero Configuration**: Works out of the box with any existing workflow

## Demo Commands

Try these commands to see Slow-Check in action:

```bash
# Simulate a build process
slow-check node -e "console.log('Starting...'); setTimeout(() => console.log('Done!'), 5000)"

# Monitor a file operation
slow-check find . -name "*.js" -type f

# Track a network request
slow-check ping -c 10 google.com
```

## License

ISC License - See LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This tool is designed to enhance command-line workflows by providing visual feedback for long-running operations. It's particularly useful in CI/CD pipelines, development workflows, and system administration tasks.