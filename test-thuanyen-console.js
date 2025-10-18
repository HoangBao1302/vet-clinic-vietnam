// Test script for thuanyen profile page
// Run this in browser console on the profile page

console.log('🔍 Testing Thuanyen Profile Page...');

// 1. Check if user is authenticated
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);

// 2. Check user stats API
async function testUserStats() {
    try {
        const response = await fetch('/api/user/stats', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        
        const data = await response.json();
        console.log('User Stats API Response:', data);
        
        if (data.success) {
            console.log('✅ Affiliate Status:', data.stats.affiliateStatus);
            console.log('✅ Affiliate Code:', data.stats.affiliateCode);
            console.log('✅ Is Paid:', data.stats.isPaid);
            
            // Check if dashboard button should show
            if (data.stats.affiliateStatus === 'approved') {
                console.log('✅ Dashboard button SHOULD be visible');
            } else {
                console.log('❌ Dashboard button should NOT be visible');
            }
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// 3. Check DOM elements
function checkDOM() {
    const dashboardButton = document.querySelector('button[onclick*="affiliate/dashboard"]');
    console.log('Dashboard button found:', !!dashboardButton);
    
    if (dashboardButton) {
        console.log('Button text:', dashboardButton.textContent);
        console.log('Button classes:', dashboardButton.className);
    }
    
    // Check affiliate status display
    const affiliateStatus = document.querySelector('[class*="text-green-600"]');
    console.log('Affiliate status display:', affiliateStatus?.textContent);
}

// Run tests
testUserStats();
checkDOM();

// 4. Test affiliate dashboard access
async function testDashboardAccess() {
    try {
        const response = await fetch('/affiliate/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        
        console.log('Dashboard access test:', response.status);
        if (response.ok) {
            console.log('✅ Can access affiliate dashboard');
        } else {
            console.log('❌ Cannot access affiliate dashboard');
        }
    } catch (error) {
        console.error('❌ Dashboard access error:', error);
    }
}

testDashboardAccess();
