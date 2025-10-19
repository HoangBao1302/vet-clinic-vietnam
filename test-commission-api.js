// Test script to check commission calculation via API
async function testCommissionAPI() {
  console.log('🔍 Testing Commission Calculation via API...\n');
  
  // Test users (you can add more emails here)
  const testUsers = [
    'hoangkim.helen@gmail.com',
    'thuanyen@gmail.com', 
    'kietdangtong@gmail.com'
  ];

  for (const email of testUsers) {
    console.log(`👤 Testing user: ${email}`);
    
    try {
      // This would need to be run in browser console with actual tokens
      console.log(`   To test this user, open browser console and run:`);
      console.log(`   fetch('/api/user/stats', {`);
      console.log(`     headers: { 'Authorization': 'Bearer YOUR_TOKEN' }`);
      console.log(`   }).then(r => r.json()).then(console.log);`);
      console.log('');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log('📋 Manual Testing Steps:');
  console.log('1. Open browser and login as each user');
  console.log('2. Go to /affiliate/dashboard');
  console.log('3. Check console logs for commission calculations');
  console.log('4. Verify "Đã rút" amount matches payment history');
  console.log('5. Test payment request form functionality\n');

  console.log('🎯 Expected Results:');
  console.log('- hoangkim.helen@gmail.com: Should show ~2,150,000đ "Đã rút"');
  console.log('- thuanyen@gmail.com: Should show correct paid amount from history');
  console.log('- kietdangtong@gmail.com: Should show correct paid amount from history');
}

testCommissionAPI();
