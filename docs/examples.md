# Usage Examples

This document provides comprehensive examples of using Slow-Check in various scenarios.

## Basic Examples

### 1. Simple Command Monitoring
```bash
slow-check echo "Hello World"
```
**Output**:
```
⠋ Elapsed: 0s | Status: initializing
Hello World
Completed in 0.1s
Exit code: 0
```

### 2. File Operations
```bash
slow-check ls -la
```
**Output**:
```
⠙ Elapsed: 1s | Status: active
total 48
drwxr-xr-x  8 user user 4096 Jan 18 10:30 .
drwxr-xr-x  3 user user 4096 Jan 18 10:25 ..
-rw-r--r--  1 user user 1234 Jan 18 10:30 index.js
-rw-r--r--  1 user user  567 Jan 18 10:29 package.json
Completed in 1.2s
Exit code: 0
```

## Development Workflow Examples

### 3. NPM Operations
```bash
# Package installation with progress
slow-check npm install express
```
**Output**:
```
⠸ Elapsed: 3s | Status: active
npm WARN deprecated package@1.0.0: This package is deprecated
added 57 packages, and audited 58 packages in 4s
⠴ Elapsed: 4s | Status: active
found 0 vulnerabilities
Completed in 4.2s
Exit code: 0
```

### 4. Build Processes
```bash
# React build monitoring
slow-check npm run build
```
**Output**:
```
⠋ Elapsed: 2s | Status: active
> react-app@1.0.0 build
> react-scripts build

Creating an optimized production build...
⠙ Elapsed: 15s | Status: quiet
Compiled successfully.
⠹ Elapsed: 18s | Status: active

File sizes after gzip:
  41.2 KB  build/static/js/main.abc123.js
  1.4 KB   build/static/css/main.def456.css

Completed in 18.7s
Exit code: 0
```

### 5. Test Suite Execution
```bash
# Jest test monitoring
slow-check npm test
```
**Output**:
```
⠸ Elapsed: 5s | Status: active
> project@1.0.0 test
> jest

 PASS  src/components/Button.test.js
 PASS  src/utils/helpers.test.js
⠼ Elapsed: 12s | Status: quiet
 PASS  src/integration/api.test.js

Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        12.456 s
Completed in 12.5s
Exit code: 0
```

## System Administration Examples

### 6. File Search Operations
```bash
# Large directory search
slow-check find /usr -name "*.log" -type f
```
**Output**:
```
⠇ Elapsed: 8s | Status: still running
/usr/local/var/log/nginx/access.log
/usr/local/var/log/nginx/error.log
⠏ Elapsed: 15s | Status: active
/usr/share/doc/package/changelog.log
/var/log/system.log
Completed in 16.3s
Exit code: 0
```

### 7. Network Operations
```bash
# File download monitoring
slow-check curl -O https://releases.ubuntu.com/20.04/ubuntu-20.04.3-desktop-amd64.iso
```
**Output**:
```
⠋ Elapsed: 5s | Status: active
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
⠙ Elapsed: 30s | Status: active
 12 2847M   12  364M    0     0  12.1M      0  0:03:55  0:00:30  0:03:25 11.8M
⠹ Elapsed: 60s | Status: active
 25 2847M   25  728M    0     0  12.1M      0  0:03:55  0:01:00  0:02:55 12.2M
Completed in 235.4s
Exit code: 0
```

### 8. System Monitoring
```bash
# Ping monitoring
slow-check ping -c 10 google.com
```
**Output**:
```
⠸ Elapsed: 2s | Status: active
PING google.com (172.217.164.110): 56 data bytes
64 bytes from 172.217.164.110: icmp_seq=0 ttl=116 time=12.345 ms
64 bytes from 172.217.164.110: icmp_seq=1 ttl=116 time=11.234 ms
⠼ Elapsed: 5s | Status: active
64 bytes from 172.217.164.110: icmp_seq=2 ttl=116 time=13.456 ms
...
--- google.com ping statistics ---
10 packets transmitted, 10 received, 0% packet loss
Completed in 9.8s
Exit code: 0
```

## Advanced Examples

### 9. Interactive Commands
```bash
# NPM init with user input
slow-check npm init
```
**Output**:
```
⠋ Elapsed: 1s | Status: active
This utility will walk you through creating a package.json file.
package name: (my-project) my-awesome-project
version: (1.0.0) 
description: A sample project
⠙ Elapsed: 15s | Status: quiet
entry point: (index.js) 
test command: jest
git repository: 
keywords: 
author: John Doe
license: (ISC) MIT
Completed in 45.2s
Exit code: 0
```

### 10. Long-Running Processes
```bash
# Database backup
slow-check mysqldump -u root -p mydb > backup.sql
```
**Output**:
```
⠇ Elapsed: 30s | Status: still running
⠏ Elapsed: 60s | Status: still running
⠋ Elapsed: 90s | Status: still running
⠙ Elapsed: 120s | Status: active
Completed in 125.7s
Exit code: 0
```

### 11. Compilation Tasks
```bash
# C++ compilation
slow-check g++ -O2 -o myapp main.cpp utils.cpp
```
**Output**:
```
⠹ Elapsed: 3s | Status: active
⠸ Elapsed: 8s | Status: quiet
⠼ Elapsed: 12s | Status: active
Completed in 12.8s
Exit code: 0
```

### 12. Docker Operations
```bash
# Docker image build
slow-check docker build -t myapp:latest .
```
**Output**:
```
⠴ Elapsed: 5s | Status: active
Sending build context to Docker daemon  15.36kB
Step 1/8 : FROM node:16-alpine
 ---> 1234567890ab
Step 2/8 : WORKDIR /app
⠦ Elapsed: 15s | Status: active
 ---> Running in abcdef123456
 ---> fedcba654321
Step 3/8 : COPY package*.json ./
⠧ Elapsed: 25s | Status: quiet
 ---> 987654321098
Successfully built 987654321098
Successfully tagged myapp:latest
Completed in 45.6s
Exit code: 0
```

## Error Handling Examples

### 13. Command Not Found
```bash
slow-check nonexistent-command
```
**Output**:
```
⠋ Elapsed: 0s | Status: initializing
 Failed to start process: spawn nonexistent-command ENOENT
```

### 14. Command with Non-Zero Exit
```bash
slow-check npm test
# (when tests fail)
```
**Output**:
```
⠸ Elapsed: 8s | Status: active
> project@1.0.0 test
> jest

 FAIL  src/components/Button.test.js
  ● Button component › should render correctly
    expect(received).toBe(expected)
    Expected: "Click me"
    Received: "Click"

Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 14 passed, 15 total
Completed in 8.5s
Exit code: 1
```

## Performance Monitoring Examples

### 15. Benchmarking Commands
```bash
# Compare build times
slow-check npm run build:dev
# vs
slow-check npm run build:prod
```

### 16. Identifying Bottlenecks
```bash
# Monitor slow operations
slow-check npm audit fix
```
**Output**:
```
⠋ Elapsed: 5s | Status: active
npm WARN deprecated package1@1.0.0
⠙ Elapsed: 30s | Status: still running
npm WARN deprecated package2@2.0.0
⠹ Elapsed: 45s | Status: active
fixed 3 vulnerabilities in 1234 packages
Completed in 47.2s
Exit code: 0
```

## Integration Examples

### 17. Shell Scripts
```bash
#!/bin/bash
echo "Starting deployment..."
slow-check npm run build
slow-check npm run test
slow-check docker build -t app:latest .
echo "Deployment complete!"
```

### 18. Makefile Integration
```makefile
build:
	slow-check npm run build

test:
	slow-check npm test

deploy: build test
	slow-check docker push myapp:latest
```

### 19. CI/CD Pipeline
```yaml
# GitHub Actions example
- name: Build application
  run: slow-check npm run build

- name: Run tests
  run: slow-check npm test

- name: Deploy
  run: slow-check ./deploy.sh
```

## Status Behavior Examples

### Active Status (< 2 seconds idle)
Commands producing frequent output show "active" status:
```bash
slow-check npm install
# Shows: ⠋ Elapsed: 5s | Status: active
```

### Quiet Status (2-8 seconds idle)
Commands with normal pauses show "quiet" status:
```bash
slow-check npm run build
# Shows: ⠙ Elapsed: 15s | Status: quiet
```

### Still Running Status (> 8 seconds idle)
Long-running commands with extended quiet periods:
```bash
slow-check find / -name "*.log"
# Shows: ⠇ Elapsed: 45s | Status: still running
```

These examples demonstrate the versatility and practical applications of Slow-Check across different development and system administration scenarios. The tool provides consistent, valuable feedback regardless of the underlying command being executed.