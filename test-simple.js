// Simple test to verify module resolution
const path = require('path');
const fs = require('fs');

// Check if the source file exists
const sourceFile = path.join(__dirname, 'src/core/utils/string-utils.ts');
console.log('Source file exists:', fs.existsSync(sourceFile));

// Try to require the compiled version if it exists
try {
  const stringUtils = require('./src/core/utils/string-utils.ts');
  console.log('Module loaded successfully');
} catch (error) {
  console.log('Error loading module:', error.message);
}

console.log('Test completed');