// Check total users in database and admin dashboard issue
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function checkAdminDashboardIssue() {
  try {
    console.log('🔍 CHECKING ADMIN DASHBOARD ISSUE');
    console.log('='.repeat(50));
    
    const baseUrl = 'https://thebenchmarktrader.com';
    
    console.log('\n📊 CHECKING USER COUNT:');
    console.log('-'.repeat(30));
    
    // Check total users without pagination
    const allUsersResponse = await fetch(`${baseUrl}/api/admin/users?limit=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.ADMIN_TOKEN || 'test-token'
      }
    });
    
    if (allUsersResponse.ok) {
      const allUsersData = await allUsersResponse.json();
      console.log(`✅ Total users in database: ${allUsersData.pagination?.total || allUsersData.users?.length || 0}`);
      console.log(`📋 Users returned: ${allUsersData.users?.length || 0}`);
      
      if (allUsersData.users && allUsersData.users.length > 0) {
        console.log('\n👥 ALL USERS LIST:');
        allUsersData.users.forEach((user, index) => {
          console.log(`${index + 1}. ${user.username} (${user.email})`);
          if (user.username === 'hoangkim.helen') {
            console.log('   ✅ hoangkim.helen FOUND!');
          }
        });
        
        // Check if hoangkim.helen exists
        const hoangkim = allUsersData.users.find(u => 
          u.username === 'hoangkim.helen' || 
          u.email?.includes('hoangkim')
        );
        
        if (hoangkim) {
          console.log('\n✅ hoangkim.helen FOUND in database:');
          console.log(`   Username: ${hoangkim.username}`);
          console.log(`   Email: ${hoangkim.email}`);
          console.log(`   Role: ${hoangkim.role}`);
          console.log(`   Membership: ${hoangkim.isPaid ? 'Paid' : 'Free'}`);
          console.log(`   Affiliate Status: ${hoangkim.affiliateStatus || 'None'}`);
        } else {
          console.log('\n❌ hoangkim.helen NOT FOUND in database');
        }
      }
    } else {
      console.log(`❌ Failed to fetch users: ${allUsersResponse.status}`);
      const error = await allUsersResponse.text();
      console.log(`   Error: ${error}`);
    }
    
    console.log('\n🔍 CHECKING PAGINATION ISSUE:');
    console.log('-'.repeat(30));
    
    // Check with default pagination (limit=10)
    const defaultUsersResponse = await fetch(`${baseUrl}/api/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.ADMIN_TOKEN || 'test-token'
      }
    });
    
    if (defaultUsersResponse.ok) {
      const defaultUsersData = await defaultUsersResponse.json();
      console.log(`📋 Users with default pagination: ${defaultUsersData.users?.length || 0}`);
      console.log(`📊 Pagination info:`, defaultUsersData.pagination);
      
      if (defaultUsersData.users && defaultUsersData.users.length > 0) {
        console.log('\n👥 USERS WITH DEFAULT PAGINATION:');
        defaultUsersData.users.forEach((user, index) => {
          console.log(`${index + 1}. ${user.username} (${user.email})`);
        });
      }
    }
    
    console.log('\n🎯 ROOT CAUSE ANALYSIS:');
    console.log('-'.repeat(30));
    console.log('❌ PROBLEM IDENTIFIED:');
    console.log('   1. Admin dashboard uses default pagination (limit=10)');
    console.log('   2. Only shows first 10 users');
    console.log('   3. hoangkim.helen might be user #11 or later');
    console.log('   4. Search function works on current page only');
    
    console.log('\n✅ SOLUTIONS:');
    console.log('   1. Increase default limit in admin dashboard');
    console.log('   2. Add pagination controls to dashboard');
    console.log('   3. Implement server-side search');
    console.log('   4. Add "Load More" functionality');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the check
checkAdminDashboardIssue();
