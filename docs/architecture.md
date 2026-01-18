# Architecture Overview

## System Design

Slow-Check follows a simple, event-driven architecture that wraps command execution with monitoring capabilities.

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Input    │───▶│   Slow-Check     │───▶│  Target Command │
│  (CLI Command)  │    │   (Wrapper)      │    │   (Any Process) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │                          │
                              ▼                          │
                       ┌──────────────────┐              │
                       │  Visual Feedback │              │
                       │   (Spinner +     │              │
                       │   Status Info)   │              │
                       └──────────────────┘              │
                              ▲                          │
                              └──────────────────────────┘
                                   Output Monitoring
```

## Core Components

### 1. Command Parser
**Location**: `index.js` lines 7-14
**Purpose**: Processes command-line arguments and validates input

```javascript
const args = process.argv.slice(2);
const command = args[0];
const commandArgs = args.slice(1);
```

**Responsibilities**:
- Extract command and arguments from process.argv
- Validate that a command was provided
- Prepare arguments for child process spawning

### 2. Process Manager
**Location**: `index.js` lines 21-25
**Purpose**: Spawns and manages the target command process

```javascript
const child = spawn(command, commandArgs, {
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe']
});
```

**Key Features**:
- Uses shell mode for maximum command compatibility
- Inherits stdin for interactive commands
- Pipes stdout/stderr for monitoring while preserving output

### 3. Status Tracker
**Location**: `index.js` lines 16-19, 35-42
**Purpose**: Monitors command activity and determines execution status

```javascript
let lastOutputTime = Date.now();
let status = 'initializing';

// Status determination logic
if (idle < 2000) status = 'active';
else if (idle < 8000) status = 'quiet';
else status = 'still running';
```

**Status States**:
- `initializing`: Command just started
- `active`: Recent output detected (< 2 seconds)
- `quiet`: No recent output but normal (2-8 seconds)
- `still running`: Extended quiet period (> 8 seconds)

### 4. Visual Feedback System
**Location**: `index.js` lines 28-43
**Purpose**: Provides real-time visual progress indication

```javascript
const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const spinner = setInterval(() => {
  const frame = frames[i++ % frames.length];
  process.stdout.write(`\r${frame} Elapsed: ${elapsed}s | Status: ${status}`);
}, 120);
```

**Features**:
- Braille-pattern spinner animation (10 frames)
- 120ms refresh rate for smooth animation
- Real-time elapsed time display
- Dynamic status indication

### 5. Stream Handler
**Location**: `index.js` lines 46-55
**Purpose**: Manages input/output streams and activity detection

```javascript
child.stdout.on('data', (data) => {
  lastOutputTime = Date.now();
  process.stdout.write(`\n${data}`);
});
```

**Responsibilities**:
- Monitor stdout/stderr for activity
- Update last output timestamp
- Preserve all command output
- Handle stream errors gracefully

### 6. Completion Handler
**Location**: `index.js` lines 58-67
**Purpose**: Manages process completion and cleanup

```javascript
child.on('close', (code) => {
  clearInterval(spinner);
  const total = Date.now() - startTime;
  console.log(`Completed in ${(total / 1000).toFixed(1)}s`);
  process.exit(code);
});
```

**Features**:
- Clean spinner termination
- Execution time summary
- Exit code preservation
- Proper process cleanup

## Data Flow

### 1. Initialization Phase
1. Parse command-line arguments
2. Validate input parameters
3. Initialize timing and status variables
4. Start visual feedback system

### 2. Execution Phase
1. Spawn target command process
2. Monitor stdout/stderr streams
3. Update activity timestamps
4. Refresh visual indicators
5. Pass through all command output

### 3. Completion Phase
1. Detect process termination
2. Stop visual feedback
3. Display execution summary
4. Exit with original command's exit code

## Design Patterns

### Event-Driven Architecture
The system is built around Node.js event emitters:
- Process events (`close`, `error`)
- Stream events (`data`)
- Timer events (spinner updates)

### Observer Pattern
The status tracker observes stream activity to determine command state without interfering with execution.

### Decorator Pattern
Slow-Check decorates any command with additional functionality (progress indication) without modifying the original command's behavior.

## Performance Considerations

### Memory Usage
- Minimal memory footprint
- No output buffering (streams pass through)
- Efficient string operations for status display

### CPU Usage
- Lightweight spinner updates (120ms intervals)
- Minimal processing overhead
- Event-driven architecture reduces polling

### I/O Handling
- Non-blocking stream operations
- Preserved command interactivity
- Efficient output forwarding

## Error Handling Strategy

### Process Spawn Errors
```javascript
child.on('error', (err) => {
  clearInterval(spinner);
  console.error('\n Failed to start process:', err.message);
  process.exit(1);
});
```

### Input Validation
```javascript
if (args.length === 0) {
  console.error('No command provided');
  process.exit(1);
}
```

### Graceful Degradation
- Continues operation even if visual updates fail
- Preserves command functionality as primary concern
- Provides meaningful error messages

## Extensibility Points

### Custom Status Logic
The status determination logic can be easily modified to add new states or adjust timing thresholds.

### Additional Visual Elements
The spinner system can be extended with:
- Progress bars for commands that provide progress information
- Color coding for different status states
- Custom animation frames

### Output Processing
Stream handlers can be enhanced to:
- Parse command output for progress indicators
- Filter or transform output
- Log execution details

This architecture ensures Slow-Check remains lightweight, reliable, and easy to maintain while providing valuable functionality for command-line workflows.