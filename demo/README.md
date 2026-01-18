# Demo Scripts

This directory contains demonstration scripts that showcase Slow-Check's capabilities.

## Running the Demo

### Quick Demo
```bash
# Make the demo script executable
chmod +x demo/demo-commands.sh

# Run the complete demo
./demo/demo-commands.sh
```

### Individual Demos

#### 1. Build Process Simulation
```bash
slow-check node demo/simulate-build.js
```
**Demonstrates**: Active status with regular output during build phases

#### 2. Download Simulation
```bash
slow-check node demo/simulate-download.js
```
**Demonstrates**: Progress tracking for network operations

#### 3. Long-Running Task
```bash
slow-check node demo/simulate-long-task.js
```
**Demonstrates**: Different status states (active, quiet, still running)

#### 4. Error Handling
```bash
slow-check node demo/simulate-error.js
```
**Demonstrates**: Error detection and proper exit code handling

## Demo Scripts Overview

### simulate-build.js
- Simulates a typical application build process
- Shows multiple build phases with timing
- Demonstrates active status with regular output
- Duration: ~10 seconds

### simulate-download.js
- Simulates downloading a large file
- Shows progress updates with file size information
- Demonstrates handling of Ctrl+C interruption
- Duration: ~15 seconds

### simulate-long-task.js
- Simulates data processing with multiple phases
- Alternates between active and quiet periods
- Shows how Slow-Check handles different activity patterns
- Duration: ~20 seconds

### simulate-error.js
- Simulates a deployment process that fails
- Shows error handling and non-zero exit codes
- Demonstrates stderr output handling
- Duration: ~7 seconds (ends with error)

## Expected Output Examples

### Build Process Demo
```
⠋ Elapsed: 1s | Status: active
🚀 Starting build process...
📦 Installing dependencies...
⠙ Elapsed: 3s | Status: active
🔍 Analyzing source files...
⠹ Elapsed: 5s | Status: active
⚡ Compiling TypeScript...
⠸ Elapsed: 7s | Status: active
🎨 Processing CSS and assets...
⠼ Elapsed: 9s | Status: active
📊 Running optimizations...
✅ Build completed successfully!
📈 Bundle size: 2.4MB (gzipped: 847KB)
⏱️  Total build time: 12.3 seconds
Completed in 10.1s
Exit code: 0
```

### Long Task Demo (showing status changes)
```
⠋ Elapsed: 2s | Status: active
🔄 Starting long-running data processing task...
🔧 Phase 1: Data ingestion
📈 Processing batch...
⠙ Elapsed: 5s | Status: quiet
🔧 Phase 2: Data validation
⠹ Elapsed: 12s | Status: still running
✅ Data validation completed
⠸ Elapsed: 15s | Status: active
🔧 Phase 3: Data transformation
📈 Processing batch...
Completed in 20.3s
Exit code: 0
```

## Customizing Demos

You can modify the demo scripts to test different scenarios:

### Adjust Timing
```javascript
// In simulate-build.js, change delays
setTimeout(() => {
  console.log('📦 Installing dependencies...');
}, 2000); // Changed from 1000 to 2000
```

### Add More Output
```javascript
// Add more progress messages
const messages = [
  '📈 Processing batch...',
  '🔍 Validating records...',
  '⚙️  Applying transformations...',
  '💾 Writing to database...',
  '🔄 Updating indexes...',
  '🎯 Your custom message here...'
];
```

### Test Different Exit Codes
```javascript
// Test different exit scenarios
process.exit(2); // Custom exit code
```

## Using for Presentations

These demos are perfect for:
- Demonstrating Slow-Check capabilities
- Showing different command patterns
- Testing terminal compatibility
- Training team members
- Creating screenshots/recordings

## Recording Demo Output

To capture demo output for documentation:

```bash
# Using script command (Unix/Linux/macOS)
script -c "./demo/demo-commands.sh" demo-output.txt

# Using PowerShell (Windows)
Start-Transcript -Path "demo-output.txt"
./demo/demo-commands.sh
Stop-Transcript
```

This creates a comprehensive demonstration environment that showcases all of Slow-Check's key features and benefits.