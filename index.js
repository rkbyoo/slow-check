#!/usr/bin/env node

const { spawn } = require('child_process');

const args = process.argv.slice(2);
const command = args[0];
const commandArgs = args.slice(1);

const start=Date.now();

const child = spawn(command, commandArgs, {
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe']
});

child.stdout.on('data', (data) => {
  process.stdout.write(data);
});

child.stderr.on('data', (data) => {
  process.stderr.write(data);
});

child.on('close', (code) => {
    const end=Date.now();
    console.log("Time:",end-start,"ms");
  console.log('Exit code:', code);
});
