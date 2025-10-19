// Script to fix user data sync issue
// This will refresh user data from API and update localStorage

console.log('🔧 Fixing User Data Sync Issue...');

async function fixUserDataSync() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('❌ No token found');
      return;
    }

    console.log('📡 Fetching fresh user data from API...');
    
    // Get fresh user stats
    const response = await fetch('/api/user/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Fresh user data received:', data.stats);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(data.stats));
      console.log('✅ User data updated in localStorage');
      
      // Show results
      console.log('📊 Updated User Data:', {
        email: data.stats.email,
        affiliateStatus: data.stats.affiliateStatus,
        affiliateCode: data.stats.affiliateCode,
        membershipTier: data.stats.membershipTier,
        isPaid: data.stats.isPaid
      });
      
      alert('✅ User data synced successfully!\n\nAffiliate Status: ' + data.stats.affiliateStatus + '\nAffiliate Code: ' + data.stats.affiliateCode + '\n\nPlease refresh the page.');
      
      return data.stats;
    } else {
      console.log('❌ Failed to fetch user data:', response.status);
      const errorText = await response.text();
      console.log('Error:', errorText);
      alert('❌ Failed to sync user data. Status: ' + response.status);
      return null;
    }
  } catch (error) {
    console.error('❌ Error syncing user data:', error);
    alert('❌ Error: ' + error.message);
    return null;
  }
}

// Run the fix
fixUserDataSync();

// Export for manual use
window.fixUserDataSync = fixUserDataSync;

console.log('✅ Fix script loaded. Run window.fixUserDataSync() to sync user data manually.');

