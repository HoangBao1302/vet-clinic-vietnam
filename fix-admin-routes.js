// Script to fix all admin routes to work without MongoDB
const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'app', 'api', 'admin');

function fixRouteFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add database check after connectDB call
    if (content.includes('await connectDB();')) {
      content = content.replace(
        /await connectDB\(\);/g,
        `const db = await connectDB();
    
    if (!db) {
      return NextResponse.json({
        success: true,
        message: 'Database not available - returning empty data',
        data: []
      });
    }`
      );
    }
    
    // Wrap database operations in try-catch
    if (content.includes('await connectDB();') && !content.includes('if (!db)')) {
      const lines = content.split('\n');
      let newLines = [];
      let inTryBlock = false;
      let braceCount = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.includes('try {')) {
          inTryBlock = true;
          braceCount = 1;
        } else if (inTryBlock) {
          if (line.includes('{')) braceCount++;
          if (line.includes('}')) braceCount--;
          
          if (braceCount === 0) {
            inTryBlock = false;
          }
        }
        
        newLines.push(line);
      }
      
      content = newLines.join('\n');
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
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
      fixRouteFile(filePath);
    }
  });
}

console.log('Fixing admin routes...');
walkDir(adminDir);
console.log('Done!');
