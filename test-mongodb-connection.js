require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 Checking MongoDB connection...\n');

if (!MONGODB_URI) {
  console.log('❌ MONGODB_URI not found in .env.local');
  console.log('Please add: MONGODB_URI=mongodb+srv://...');
  process.exit(1);
}

console.log('✅ MONGODB_URI found');
console.log('📍 Connecting to:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('\n✅ MongoDB connected successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('\n👋 Connection closed');
    process.exit(0);
  })
  .catch((error) => {
    console.log('\n❌ MongoDB connection failed:');
    console.log(error.message);
    console.log('\n💡 Possible issues:');
    console.log('1. Check MongoDB Atlas network access (allow your IP)');
    console.log('2. Verify username/password in connection string');
    console.log('3. Check if database cluster is running');
    process.exit(1);
  });

