// Script to fix syntax errors in admin routes
const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'app', 'api', 'admin');

function fixSyntaxErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix duplicate const declarations
    content = content.replace(/const db = const db = await connectDB\(\);/g, 'const db = await connectDB();');
    
    // Fix other common syntax errors
    content = content.replace(/const db = const db =/g, 'const db =');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed syntax: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.ts') && file === 'route.ts') {
      fixSyntaxErrors(filePath);
    }
  });
}

console.log('Fixing syntax errors...');
walkDir(adminDir);
console.log('Done!');
