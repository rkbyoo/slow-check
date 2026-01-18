# Development Guide

This guide covers setting up a development environment, contributing to Slow-Check, and extending its functionality.

## Development Setup

### Prerequisites
- Node.js 12.0 or higher
- npm or yarn package manager
- Git for version control

### Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd slow-check
   ```

2. **Install dependencies** (if any are added in future):
   ```bash
   npm install
   ```

3. **Link for local testing**:
   ```bash
   npm link
   ```

4. **Test the installation**:
   ```bash
   slow-check echo "Development setup complete"
   ```

### Development Workflow

#### Making Changes
1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes to `index.js`

3. Test locally:
   ```bash
   slow-check node -e "console.log('Testing changes')"
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

#### Testing Changes

Since Slow-Check uses only standard libraries, testing is straightforward:

```bash
# Test basic functionality
slow-check echo "Hello World"

# Test with different command types
slow-check ls -la
slow-check npm --version
slow-check ping -c 3 localhost

# Test error handling
slow-check nonexistent-command

# Test long-running commands
slow-check node -e "setTimeout(() => console.log('Done'), 5000)"
```

## Code Structure

### Main Components

```javascript
// index.js structure overview
#!/usr/bin/env node

// 1. Dependencies and setup
const { spawn } = require('child_process');

// 2. Argument parsing
const args = process.argv.slice(2);
// ... validation logic

// 3. State management
const startTime = Date.now();
let lastOutputTime = Date.now();
let status = 'initializing';

// 4. Process spawning
const child = spawn(command, commandArgs, options);

// 5. Visual feedback system
const spinner = setInterval(() => {
  // ... spinner logic
}, 120);

// 6. Stream handling
child.stdout.on('data', handler);
child.stderr.on('data', handler);

// 7. Completion handling
child.on('close', handler);
child.on('error', handler);
```

### Key Design Principles

1. **Minimal Dependencies**: Only use Node.js standard library
2. **Non-Intrusive**: Preserve original command behavior
3. **Robust Error Handling**: Graceful failure modes
4. **Cross-Platform**: Work on Windows, macOS, and Linux
5. **Performance**: Minimal overhead on wrapped commands

## Contributing Guidelines

### Code Style

#### JavaScript Standards
- Use ES6+ features where appropriate
- Prefer `const` and `let` over `var`
- Use template literals for string interpolation
- Follow consistent indentation (2 spaces)

#### Example Code Style:
```javascript
// Good
const elapsed = Math.floor((Date.now() - startTime) / 1000);
const frame = frames[i++ % frames.length];
process.stdout.write(`\r${frame} Elapsed: ${elapsed}s | Status: ${status}`);

// Avoid
var elapsed = Math.floor((Date.now() - startTime) / 1000);
var frame = frames[i++ % frames.length];
process.stdout.write('\r' + frame + ' Elapsed: ' + elapsed + 's | Status: ' + status);
```

#### Error Handling Patterns
```javascript
// Consistent error handling
child.on('error', (err) => {
  clearInterval(spinner);
  console.error('\n Failed to start process:', err.message);
  process.exit(1);
});
```

### Commit Message Format

Use conventional commit format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test additions or modifications
- `chore:` - Maintenance tasks

Examples:
```
feat: add color coding for different status states
fix: handle SIGINT gracefully for process cleanup
docs: update README with new usage examples
refactor: extract status logic into separate function
```

### Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Update documentation** if needed
6. **Submit pull request** with:
   - Clear description of changes
   - Test results
   - Any breaking changes noted

## Extension Points

### Adding New Status States

To add custom status logic:

```javascript
// Current status logic
if (idle < 2000) status = 'active';
else if (idle < 8000) status = 'quiet';
else status = 'still running';

// Extended status logic
if (idle < 1000) status = 'very active';
else if (idle < 2000) status = 'active';
else if (idle < 8000) status = 'quiet';
else if (idle < 30000) status = 'still running';
else status = 'possibly hung';
```

### Custom Spinner Animations

Replace the spinner frames:

```javascript
// Current frames
const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

// Alternative animations
const dotsFrames = ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'];
const arrowFrames = ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙'];
const blockFrames = ['▁', '▃', '▄', '▅', '▆', '▇', '█', '▇', '▆', '▅', '▄', '▃'];
```

### Output Processing

Add custom output processing:

```javascript
child.stdout.on('data', (data) => {
  lastOutputTime = Date.now();
  
  // Custom processing
  const output = data.toString();
  if (output.includes('ERROR')) {
    status = 'error detected';
  }
  
  process.stdout.write(`\n${data}`);
});
```

### Configuration System

Add configuration file support:

```javascript
// Load configuration
const fs = require('fs');
const path = require('path');

function loadConfig() {
  const configPath = path.join(process.cwd(), '.slow-check.json');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  return {};
}

const config = loadConfig();
const refreshRate = config.refreshRate || 120;
const customFrames = config.spinnerFrames || frames;
```

## Testing Strategy

### Manual Testing Scenarios

1. **Basic Functionality**:
   ```bash
   slow-check echo "test"
   slow-check ls
   slow-check pwd
   ```

2. **Long-Running Commands**:
   ```bash
   slow-check sleep 10
   slow-check ping -c 20 google.com
   ```

3. **Interactive Commands**:
   ```bash
   slow-check node -p "require('readline').createInterface({input:process.stdin,output:process.stdout}).question('Name: ', console.log)"
   ```

4. **Error Conditions**:
   ```bash
   slow-check nonexistent-command
   slow-check
   ```

5. **Different Output Patterns**:
   ```bash
   slow-check node -e "setInterval(() => console.log(Date.now()), 1000)"
   slow-check find /usr -name "*.log"
   ```

### Automated Testing (Future Enhancement)

Consider adding automated tests:

```javascript
// test/basic.test.js
const { spawn } = require('child_process');
const path = require('path');

describe('slow-check', () => {
  const slowCheckPath = path.join(__dirname, '..', 'index.js');
  
  test('should execute simple command', (done) => {
    const child = spawn('node', [slowCheckPath, 'echo', 'test']);
    let output = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.on('close', (code) => {
      expect(code).toBe(0);
      expect(output).toContain('test');
      expect(output).toContain('Completed in');
      done();
    });
  });
});
```

## Performance Considerations

### Memory Usage
- Monitor memory usage with long-running commands
- Avoid buffering large outputs
- Clean up timers and event listeners

### CPU Usage
- Keep spinner refresh rate reasonable (120ms is optimal)
- Minimize string operations in hot paths
- Use efficient timestamp comparisons

### I/O Performance
- Stream data without buffering
- Minimize write operations to stdout
- Handle backpressure appropriately

## Debugging

### Debug Mode
Add debug logging:

```javascript
const DEBUG = process.env.SLOW_CHECK_DEBUG === '1';

function debug(message) {
  if (DEBUG) {
    console.error(`[DEBUG] ${message}`);
  }
}

// Usage
debug(`Command: ${command}, Args: ${commandArgs.join(' ')}`);
debug(`Status changed to: ${status}`);
```

### Common Issues

1. **Spinner not clearing**: Ensure `clearInterval(spinner)` is called
2. **Output formatting**: Check newline handling in stream processors
3. **Exit code preservation**: Verify `process.exit(code)` uses original code
4. **Cross-platform compatibility**: Test path handling and shell commands

## Release Process

### Version Management
1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create git tag
4. Publish to npm (if applicable)

### Documentation Updates
- Update README.md with new features
- Add examples for new functionality
- Update API documentation
- Record breaking changes

This development guide provides the foundation for contributing to and extending Slow-Check while maintaining its core principles of simplicity and reliability.