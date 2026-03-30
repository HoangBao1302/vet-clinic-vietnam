/**
 * Migration Script: Import Content Data to MongoDB
 * 
 * This script imports Partners, Trading Accounts, and Featured Accounts
 * from TypeScript data files into MongoDB database.
 * 
 * Usage: npm run migrate-content
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Import data from files
const { partners } = require('../data/partners');
const { tradingAccounts } = require('../data/tradingAccounts');
const { featuredAccounts } = require('../data/featuredAccounts');

// Import models
const Partner = require('../lib/models/Partner').default;
const TradingAccount = require('../lib/models/TradingAccount').default;
const FeaturedAccount = require('../lib/models/FeaturedAccount').default;

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔄 Content Data Migration Script');
console.log('================================\n');

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function migrate() {
  try {
    // Connect to MongoDB
    console.log('📍 Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Migrate Partners
    console.log('👥 Migrating Partners...');
    console.log(`   Found ${partners.length} partners in file`);
    
    let partnerCount = 0;
    for (const partnerData of partners) {
      try {
        const existing = await Partner.findOne({ id: partnerData.id });
        if (existing) {
          console.log(`   ⏭️  Skipping existing partner: ${partnerData.name}`);
          continue;
        }

        const partner = new Partner(partnerData);
        await partner.save();
        partnerCount++;
        console.log(`   ✅ Created partner: ${partnerData.name}`);
      } catch (error) {
        console.error(`   ❌ Error creating partner ${partnerData.name}:`, error.message);
      }
    }
    console.log(`   📊 Migrated ${partnerCount} new partners\n`);

    // Migrate Trading Accounts
    console.log('💹 Migrating Trading Accounts...');
    console.log(`   Found ${tradingAccounts.length} accounts in file`);
    
    let accountCount = 0;
    for (const accountData of tradingAccounts) {
      try {
        const existing = await TradingAccount.findOne({ id: accountData.id });
        if (existing) {
          console.log(`   ⏭️  Skipping existing account: ${accountData.broker} ${accountData.account}`);
          continue;
        }

        const account = new TradingAccount(accountData);
        await account.save();
        accountCount++;
        console.log(`   ✅ Created account: ${accountData.broker} ${accountData.account}`);
      } catch (error) {
        console.error(`   ❌ Error creating account ${accountData.id}:`, error.message);
      }
    }
    console.log(`   📊 Migrated ${accountCount} new trading accounts\n`);

    // Migrate Featured Accounts
    console.log('⭐ Migrating Featured Accounts...');
    console.log(`   Found ${featuredAccounts.length} featured accounts in file`);
    
    let featuredCount = 0;
    for (const featuredData of featuredAccounts) {
      try {
        const existing = await FeaturedAccount.findOne({ id: featuredData.id });
        if (existing) {
          console.log(`   ⏭️  Skipping existing featured account: ${featuredData.broker} ${featuredData.year}`);
          continue;
        }

        const featured = new FeaturedAccount(featuredData);
        await featured.save();
        featuredCount++;
        console.log(`   ✅ Created featured account: ${featuredData.broker} ${featuredData.year}`);
      } catch (error) {
        console.error(`   ❌ Error creating featured account ${featuredData.id}:`, error.message);
      }
    }
    console.log(`   📊 Migrated ${featuredCount} new featured accounts\n`);

    // Summary
    console.log('================================');
    console.log('✅ Migration completed!\n');
    console.log('📊 Summary:');
    console.log(`   Partners: ${partnerCount} new / ${partners.length} total`);
    console.log(`   Trading Accounts: ${accountCount} new / ${tradingAccounts.length} total`);
    console.log(`   Featured Accounts: ${featuredCount} new / ${featuredAccounts.length} total`);
    console.log('');

    // Display current database stats
    const totalPartners = await Partner.countDocuments();
    const totalAccounts = await TradingAccount.countDocuments();
    const totalFeatured = await FeaturedAccount.countDocuments();
    
    console.log('💾 Database stats:');
    console.log(`   Total Partners: ${totalPartners}`);
    console.log(`   Total Trading Accounts: ${totalAccounts}`);
    console.log(`   Total Featured Accounts: ${totalFeatured}`);

    await mongoose.connection.close();
    console.log('\n👋 Connection closed');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run migration
migrate();
