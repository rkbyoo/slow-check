#!/bin/bash

# Demo Commands for Slow-Check
# This script demonstrates various use cases of slow-check

echo "=== Slow-Check Demo Script ==="
echo "This script demonstrates the capabilities of slow-check"
echo ""

echo "1. Basic command monitoring:"
echo "Command: slow-check echo 'Hello from Slow-Check!'"
slow-check echo "Hello from Slow-Check!"
echo ""

echo "2. File operations:"
echo "Command: slow-check ls -la"
slow-check ls -la
echo ""

echo "3. Simulated build process:"
echo "Command: slow-check node demo/simulate-build.js"
slow-check node demo/simulate-build.js
echo ""

echo "4. Network operation simulation:"
echo "Command: slow-check node demo/simulate-download.js"
slow-check node demo/simulate-download.js
echo ""

echo "5. Long-running process:"
echo "Command: slow-check node demo/simulate-long-task.js"
slow-check node demo/simulate-long-task.js
echo ""

echo "6. Error handling demonstration:"
echo "Command: slow-check node demo/simulate-error.js"
slow-check node demo/simulate-error.js
echo ""

echo "=== Demo Complete ==="
echo "Slow-Check provides visual feedback and timing for all commands!"