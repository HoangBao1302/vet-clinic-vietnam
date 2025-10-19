require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Define schemas inline since we can't import ES modules
const UserSchema = new mongoose.Schema({
  email: String,
  affiliateCode: String,
  affiliateStatus: String,
  totalCommissionEarned: Number,
  totalCommissionPaid: Number
}, { collection: 'users' });

const PaymentRequestSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  status: String,
  paymentMethod: String,
  createdAt: Date
}, { collection: 'paymentrequests' });

const User = mongoose.model('User', UserSchema);
const PaymentRequest = mongoose.model('PaymentRequest', PaymentRequestSchema);

async function testCommissionCalculation() {
  try {
    console.log('🔍 Testing Commission Calculation for All Users...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users with affiliate codes
    const users = await User.find({ 
      affiliateCode: { $exists: true, $ne: null },
      affiliateStatus: 'approved'
    }).select('email affiliateCode totalCommissionEarned totalCommissionPaid');

    console.log(`📊 Found ${users.length} approved affiliate users:\n`);

    for (const user of users) {
      console.log(`👤 User: ${user.email}`);
      console.log(`   Affiliate Code: ${user.affiliateCode}`);
      console.log(`   Stored Earned: ${(user.totalCommissionEarned || 0).toLocaleString('vi-VN')}đ`);
      console.log(`   Stored Paid: ${(user.totalCommissionPaid || 0).toLocaleString('vi-VN')}đ`);

      // Calculate actual paid amount from PaymentRequest
      const paidRequests = await PaymentRequest.find({
        userId: user._id,
        status: 'paid'
      });

      const actualPaid = paidRequests.reduce((sum, request) => sum + request.amount, 0);
      
      console.log(`   Actual Paid (from PaymentRequest): ${actualPaid.toLocaleString('vi-VN')}đ`);
      console.log(`   Payment Requests Count: ${paidRequests.length}`);
      
      if (paidRequests.length > 0) {
        console.log(`   Payment Requests:`);
        paidRequests.forEach((req, index) => {
          console.log(`     ${index + 1}. ${req.amount.toLocaleString('vi-VN')}đ - ${req.paymentMethod} - ${new Date(req.createdAt).toLocaleDateString('vi-VN')}`);
        });
      }

      // Check if there's a discrepancy
      const storedPaid = user.totalCommissionPaid || 0;
      if (Math.abs(storedPaid - actualPaid) > 0) {
        console.log(`   ⚠️  DISCREPANCY: Stored (${storedPaid.toLocaleString('vi-VN')}đ) vs Actual (${actualPaid.toLocaleString('vi-VN')}đ)`);
      } else {
        console.log(`   ✅ No discrepancy`);
      }

      console.log(''); // Empty line for readability
    }

    console.log('🎯 Summary:');
    console.log('- The fix should now calculate totalCommissionPaid from PaymentRequest collection');
    console.log('- This ensures accurate "Đã rút" amounts in the dashboard');
    console.log('- Users with payment history should see correct withdrawn amounts\n');

  } catch (error) {
    console.error('❌ Error testing commission calculation:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testCommissionCalculation();
