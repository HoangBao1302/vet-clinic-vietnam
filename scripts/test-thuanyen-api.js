const fetch = require('node-fetch');

// Test thuanyen API endpoints
async function testThuanyenAPI() {
    console.log('🔍 Testing Thuanyen API Endpoints...\n');

    let authToken = null;

    try {
        // 1. Test Login
        console.log('1️⃣ Testing Login...');
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'phamthithuanyen93@gmail.com',
                password: 'test123' // Update with correct password
            })
        });

        const loginData = await loginResponse.json();
        
        if (loginData.success && loginData.token) {
            authToken = loginData.token;
            console.log('✅ Login successful');
            console.log(`   Token: ${authToken.substring(0, 20)}...`);
            console.log(`   User: ${loginData.user.username} (${loginData.user.email})`);
            console.log(`   Role: ${loginData.user.role}`);
        } else {
            console.log('❌ Login failed:', loginData.message);
            return;
        }

        // 2. Test User Stats API
        console.log('\n2️⃣ Testing User Stats API...');
        const statsResponse = await fetch('http://localhost:3000/api/user/stats', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            }
        });

        const statsData = await statsResponse.json();
        
        if (statsData.success) {
            console.log('✅ User stats retrieved successfully');
            console.log('   Key Affiliate Info:');
            console.log(`   - Affiliate Status: ${statsData.stats.affiliateStatus}`);
            console.log(`   - Affiliate Code: ${statsData.stats.affiliateCode || 'NOT SET'}`);
            console.log(`   - Is Paid: ${statsData.stats.isPaid}`);
            console.log(`   - Membership Tier: ${statsData.stats.membershipTier}`);
            
            // Check if dashboard button should show
            if (statsData.stats.affiliateStatus === 'approved') {
                console.log('✅ Dashboard button SHOULD be visible');
                console.log('   - Status is "approved"');
                console.log('   - Code is set:', !!statsData.stats.affiliateCode);
            } else {
                console.log('❌ Dashboard button should NOT be visible');
                console.log(`   - Status is "${statsData.stats.affiliateStatus}", not "approved"`);
            }
        } else {
            console.log('❌ User stats failed:', statsData.message);
        }

        // 3. Test Affiliate Dashboard Access
        console.log('\n3️⃣ Testing Affiliate Dashboard Access...');
        const dashboardResponse = await fetch('http://localhost:3000/affiliate/dashboard', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            }
        });

        if (dashboardResponse.ok) {
            console.log('✅ Can access affiliate dashboard');
            console.log(`   Status: ${dashboardResponse.status}`);
        } else {
            console.log('❌ Cannot access affiliate dashboard');
            console.log(`   Status: ${dashboardResponse.status}`);
        }

        // 4. Test Profile Page
        console.log('\n4️⃣ Testing Profile Page...');
        const profileResponse = await fetch('http://localhost:3000/profile', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            }
        });

        if (profileResponse.ok) {
            console.log('✅ Can access profile page');
            console.log(`   Status: ${profileResponse.status}`);
        } else {
            console.log('❌ Cannot access profile page');
            console.log(`   Status: ${profileResponse.status}`);
        }

    } catch (error) {
        console.error('❌ Error testing API:', error.message);
    }
}

// Run the test
testThuanyenAPI();
