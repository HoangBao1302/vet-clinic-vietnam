/**
 * 🔄 Keep MongoDB Atlas Alive Script
 * 
 * Purpose: Prevent MongoDB Atlas M0 free tier from auto-pausing after 30 days
 * Usage: node keep-mongodb-alive.js
 * 
 * This script will:
 * 1. Connect to MongoDB
 * 2. Perform a simple ping operation
 * 3. Reset the inactivity timer
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔄 MongoDB Keep-Alive Script');
console.log('================================\n');

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in .env.local');
  console.log('\n💡 Please add your MongoDB connection string to .env.local');
  process.exit(1);
}

// Hide password in logs
const safeUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
console.log('📍 Target:', safeUri);
console.log('⏰ Started at:', new Date().toLocaleString());
console.log('\n🔌 Connecting...\n');

async function keepAlive() {
  try {
    // Connect with timeout options
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ Connected successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔢 Port:', mongoose.connection.port);
    
    // Perform a ping operation
    const adminDb = mongoose.connection.db.admin();
    const pingResult = await adminDb.ping();
    
    console.log('\n🏓 Ping result:', pingResult);
    console.log('✅ Activity timer has been reset!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n👋 Connection closed gracefully');
    console.log('⏰ Completed at:', new Date().toLocaleString());
    console.log('\n🎉 Success! Your cluster will remain active.');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    
    console.log('\n🔍 Troubleshooting steps:');
    console.log('1. Check if your cluster is already paused:');
    console.log('   → Visit: https://cloud.mongodb.com');
    console.log('   → Click "Resume" if cluster shows as paused');
    console.log('');
    console.log('2. Verify Network Access:');
    console.log('   → MongoDB Atlas → Network Access');
    console.log('   → Add your current IP or allow 0.0.0.0/0 (all IPs)');
    console.log('');
    console.log('3. Check credentials:');
    console.log('   → Verify username/password in MONGODB_URI');
    console.log('   → Special characters in password may need URL encoding');
    console.log('');
    console.log('4. Verify cluster status:');
    console.log('   → Check if cluster0.gqhymaa is correct');
    console.log('   → Ensure cluster is running (not paused/deleted)');
    
    process.exit(1);
  }
}

// Run the keep-alive function
keepAlive();
