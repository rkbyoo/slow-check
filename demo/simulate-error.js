#!/usr/bin/env node

// Simulates a command that encounters an error
console.log('🚀 Starting application deployment...');

setTimeout(() => {
  console.log('📦 Building application...');
}, 1000);

setTimeout(() => {
  console.log('🔍 Running tests...');
}, 2500);

setTimeout(() => {
  console.log('✅ All tests passed');
  console.log('🚀 Deploying to production...');
}, 4000);

setTimeout(() => {
  console.log('🔗 Connecting to deployment server...');
}, 5500);

setTimeout(() => {
  console.error('❌ ERROR: Connection to deployment server failed');
  console.error('🔧 Details: ECONNREFUSED - Connection refused by server');
  console.error('💡 Suggestion: Check server status and network connectivity');
  console.error('📞 Contact: devops@company.com for server issues');
  process.exit(1);
}, 7000);