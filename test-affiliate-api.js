// Simple script to test affiliate commission system
const fetch = require('node-fetch');

async function testAffiliateSystem() {
  try {
    console.log('🔍 Testing Affiliate System...\n');

    // Test 1: Check kietdangtong affiliate data
    console.log('📊 Test 1: Checking kietdangtong affiliate data...');
    
    // First, let's try to get affiliate stats via API
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    // We need to simulate a login first to get a token
    console.log('🔑 Attempting to login as kietdangtong...');
    
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'kietdangtong@example.com', // Assuming this is the email
        password: 'password123' // Assuming this is the password
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful');
      
      const token = loginData.token;
      
      // Test affiliate stats
      console.log('\n📊 Getting affiliate stats...');
      const statsResponse = await fetch(`${baseUrl}/api/affiliate/track?affiliateCode=AFF-KIETDANGTONG-ABC123`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('✅ Affiliate stats:', JSON.stringify(statsData, null, 2));
      } else {
        console.log('❌ Failed to get affiliate stats:', statsResponse.status);
      }
      
    } else {
      console.log('❌ Login failed:', loginResponse.status);
      const errorData = await loginResponse.json();
      console.log('Error:', errorData);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testAffiliateSystem();

