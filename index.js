#!/usr/bin/env node

const { spawn } = require('child_process');


// Read arguments

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('No command provided');
  process.exit(1);
}

const command = args[0];
const commandArgs = args.slice(1);

// Status 

const startTime = Date.now();
let lastOutputTime = Date.now();
let status = 'initializing';

//spawn process

const child = spawn(command, commandArgs, {
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe']
});


// Spinner code for better dev experience

const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
let i = 0;

const spinner = setInterval(() => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const idle = Date.now() - lastOutputTime;

  if (idle < 2000) status = 'active';
  else if (idle < 8000) status = 'quiet';
  else status = 'still running';

  const frame = frames[i++ % frames.length];
  process.stdout.write(
    `\r${frame} Elapsed: ${elapsed}s | Status: ${status}`
  );
}, 120);


// Stream output

child.stdout.on('data', (data) => {
  lastOutputTime = Date.now();
  process.stdout.write(`\n${data}`);
});

child.stderr.on('data', (data) => {
  lastOutputTime = Date.now();
  process.stderr.write(`\n${data}`);
});


// Finish

child.on('close', (code) => {
  clearInterval(spinner);
  process.stdout.write('\r');

  const total = Date.now() - startTime;

  console.log(`Completed in ${(total / 1000).toFixed(1)}s`);
  console.log(`Exit code: ${code}`);

  process.exit(code);
});


// Spawn error

child.on('error', (err) => {
  clearInterval(spinner);
  console.error('\n Failed to start process:', err.message);
  process.exit(1);
});
