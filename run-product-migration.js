// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Run the product migration script
require('child_process').execSync(
  'npx ts-node --project tsconfig.node.json scripts/migrate-products-to-mongodb.ts',
  { stdio: 'inherit' }
);

