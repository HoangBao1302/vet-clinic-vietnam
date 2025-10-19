// Test debug affiliate data API
async function testDebugAPI() {
  const affiliateCodes = ['HOANGKIM', 'THUANYEN', 'KIETDANGTONG'];
  
  for (const code of affiliateCodes) {
    console.log(`\n=== Testing affiliate code: ${code} ===`);
    
    try {
      const response = await fetch(`http://localhost:3000/api/debug-affiliate-data?affiliateCode=${code}`);
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Success');
        console.log('- Total clicks:', data.totalClicks);
        console.log('- Commission stats:', data.commissionStats);
        
        if (data.clicks.length > 0) {
          console.log('\nClick details:');
          data.clicks.forEach((click, index) => {
            console.log(`  ${index + 1}. Amount: ${click.commissionAmount}, Status: ${click.status}, Date: ${click.clickedAt}`);
          });
        }
      } else {
        console.log('❌ Error:', data.error);
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
  }
}

// Test user stats API
async function testUserStats() {
  const emails = ['hoangkim@gmail.com', 'thuanyen@gmail.com', 'kietdangtong@gmail.com'];
  
  for (const email of emails) {
    console.log(`\n=== Testing user stats for: ${email} ===`);
    
    try {
      const response = await fetch('http://localhost:3000/api/user/stats', {
        headers: {
          'Authorization': 'Bearer test-token', // This might not work without proper auth
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Success');
        console.log('- Affiliate status:', data.stats.affiliateStatus);
        console.log('- Affiliate code:', data.stats.affiliateCode);
        console.log('- Total commission earned:', data.stats.totalCommissionEarned);
        console.log('- Total commission paid:', data.stats.totalCommissionPaid);
      } else {
        console.log('❌ Error:', data.error);
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
  }
}

console.log('Testing Debug Affiliate Data API...');
testDebugAPI().then(() => {
  console.log('\n\nTesting User Stats API...');
  return testUserStats();
}).catch(console.error);
