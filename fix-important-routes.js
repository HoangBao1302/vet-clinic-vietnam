// Script to fix important API routes to work with MongoDB
const fs = require('fs');
const path = require('path');

const importantRoutes = [
  'app/api/auth/login/route.ts',
  'app/api/auth/register/route.ts', 
  'app/api/auth/forgot-password/route.ts',
  'app/api/auth/reset-password/route.ts',
  'app/api/downloads/stats/route.ts',
  'app/api/downloads/track/route.ts',
  'app/api/affiliate/apply/route.ts',
  'app/api/blog/check-access/route.ts',
  'app/api/blog/track-read/route.ts',
  'app/api/verify-order/route.ts'
];

function fixImportantRoute(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add database check after connectDB call for important routes
    if (content.includes('await connectDB();') && !content.includes('if (!db)')) {
      content = content.replace(
        /await connectDB\(\);/g,
        `const db = await connectDB();
    
    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Database không khả dụng' },
        { status: 503 }
      );
    }`
      );
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed important route: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

console.log('Fixing important API routes...');
importantRoutes.forEach(route => {
  fixImportantRoute(route);
});
console.log('Done!');
