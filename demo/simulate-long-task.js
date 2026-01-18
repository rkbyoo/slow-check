#!/usr/bin/env node

// Simulates a long-running task with periods of activity and quiet
console.log('🔄 Starting long-running data processing task...');

let phase = 1;
const phases = [
  { name: 'Data ingestion', duration: 3000, quiet: false },
  { name: 'Data validation', duration: 5000, quiet: true },
  { name: 'Data transformation', duration: 4000, quiet: false },
  { name: 'Index building', duration: 6000, quiet: true },
  { name: 'Final optimization', duration: 2000, quiet: false }
];

function runPhase(phaseIndex) {
  if (phaseIndex >= phases.length) {
    console.log('✅ All processing phases completed!');
    console.log('📊 Processed 1,234,567 records');
    console.log('⚡ Average processing speed: 12,345 records/second');
    process.exit(0);
    return;
  }

  const currentPhase = phases[phaseIndex];
  console.log(`🔧 Phase ${phaseIndex + 1}: ${currentPhase.name}`);

  if (!currentPhase.quiet) {
    // Active phase with regular output
    const interval = setInterval(() => {
      const messages = [
        '📈 Processing batch...',
        '🔍 Validating records...',
        '⚙️  Applying transformations...',
        '💾 Writing to database...',
        '🔄 Updating indexes...'
      ];
      console.log(messages[Math.floor(Math.random() * messages.length)]);
    }, 800);

    setTimeout(() => {
      clearInterval(interval);
      console.log(`✅ ${currentPhase.name} completed`);
      runPhase(phaseIndex + 1);
    }, currentPhase.duration);
  } else {
    // Quiet phase - minimal output
    setTimeout(() => {
      console.log(`✅ ${currentPhase.name} completed`);
      runPhase(phaseIndex + 1);
    }, currentPhase.duration);
  }
}

runPhase(0);