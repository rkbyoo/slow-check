#!/usr/bin/env node

// Simulates a file download with progress updates
console.log('🌐 Starting download...');
console.log('📁 Downloading: large-dataset.zip (125 MB)');

let progress = 0;
const totalSize = 125;

const downloadInterval = setInterval(() => {
  progress += Math.random() * 15 + 5; // Random progress between 5-20 MB
  
  if (progress >= totalSize) {
    progress = totalSize;
    console.log(`📊 Progress: ${progress.toFixed(1)}MB / ${totalSize}MB (100%)`);
    console.log('✅ Download completed successfully!');
    console.log('🔍 Verifying file integrity...');
    
    setTimeout(() => {
      console.log('✅ File verification passed');
      console.log('💾 File saved to: ./downloads/large-dataset.zip');
      clearInterval(downloadInterval);
      process.exit(0);
    }, 1500);
  } else {
    const percentage = ((progress / totalSize) * 100).toFixed(1);
    console.log(`📊 Progress: ${progress.toFixed(1)}MB / ${totalSize}MB (${percentage}%)`);
  }
}, 1200);

// Handle cleanup on exit
process.on('SIGINT', () => {
  clearInterval(downloadInterval);
  console.log('\n❌ Download cancelled by user');
  process.exit(1);
});