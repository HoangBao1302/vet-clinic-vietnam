// Test the restore commission API
async function testRestoreAPI() {
  console.log('🧪 Testing Restore Commission API...');
  
  try {
    const response = await fetch('/api/admin/restore-commission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.success) {
      console.log('✅ API call successful!');
      console.log('Results:');
      data.results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.email}: ${result.updated ? 'Updated' : 'Failed'}`);
        if (result.updated) {
          console.log(`   Earned: ${result.oldEarned} → ${result.newEarned}`);
          console.log(`   Paid: ${result.oldPaid} → ${result.newPaid}`);
        } else {
          console.log(`   Error: ${result.error}`);
        }
      });
    } else {
      console.log('❌ API call failed:', data.error);
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

// Also test the user stats API to see current values
async function testUserStats() {
  console.log('\n🧪 Testing User Stats API...');
  
  try {
    const response = await fetch('/api/user/stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const data = await response.json();
    console.log('User stats:', data);
    
    if (data.success) {
      console.log('Current commission values:');
      console.log('- Total earned:', data.stats.totalCommissionEarned);
      console.log('- Total paid:', data.stats.totalCommissionPaid);
      console.log('- Available:', data.stats.totalCommissionEarned - data.stats.totalCommissionPaid);
    }
    
  } catch (error) {
    console.log('❌ User stats error:', error.message);
  }
}

// Run both tests
testRestoreAPI().then(() => testUserStats());
