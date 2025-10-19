// Debug Affiliate Dashboard Redirect Issue
// This script helps debug why users are redirected to /referral

console.log('🔍 Debugging Affiliate Dashboard Redirect Issue...');

// 1. Check current authentication state
function checkAuthState() {
    console.log('1️⃣ Checking authentication state...');
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('📊 Local Storage Data:', {
        hasToken: !!token,
        hasUser: !!user,
        tokenLength: token?.length,
        userData: user ? JSON.parse(user) : null
    });
    
    return { token, user: user ? JSON.parse(user) : null };
}

// 2. Test affiliate dashboard access
async function testDashboardAccess() {
    console.log('2️⃣ Testing dashboard access...');
    
    try {
        const { token, user } = checkAuthState();
        
        if (!token) {
            console.log('❌ No token found');
            return false;
        }
        
        if (!user) {
            console.log('❌ No user data found');
            return false;
        }
        
        console.log('👤 User Data:', {
            email: user.email,
            username: user.username,
            affiliateStatus: user.affiliateStatus,
            affiliateCode: user.affiliateCode,
            membershipTier: user.membershipTier,
            isPaid: user.isPaid
        });
        
        // Check affiliate status
        if (user.affiliateStatus !== 'approved') {
            console.log('❌ Affiliate status not approved:', user.affiliateStatus);
            return false;
        }
        
        if (!user.affiliateCode) {
            console.log('❌ No affiliate code found');
            return false;
        }
        
        console.log('✅ User has approved affiliate status and code');
        
        // Test API access
        const response = await fetch('/api/affiliate/check-access', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Access Check:', data);
            return data.canAccessDashboard;
        } else {
            console.log('❌ API access check failed:', response.status);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error testing dashboard access:', error);
        return false;
    }
}

// 3. Simulate dashboard loading
async function simulateDashboardLoad() {
    console.log('3️⃣ Simulating dashboard loading...');
    
    try {
        const { token, user } = checkAuthState();
        
        if (!token || !user) {
            console.log('❌ Missing auth data');
            return;
        }
        
        // Simulate the dashboard loading process
        console.log('🔄 Simulating dashboard initialization...');
        
        // Check 1: Auth loading
        console.log('✅ Auth loading: false');
        
        // Check 2: Authentication
        console.log('✅ Authentication: true');
        
        // Check 3: User data
        console.log('✅ User data: loaded');
        
        // Check 4: Affiliate status
        if (user.affiliateStatus !== 'approved') {
            console.log('❌ Affiliate status check failed:', user.affiliateStatus);
            console.log('🔄 Would redirect to /referral');
            return;
        }
        
        console.log('✅ Affiliate status: approved');
        console.log('✅ All checks passed, would load dashboard data');
        
    } catch (error) {
        console.error('❌ Error simulating dashboard load:', error);
    }
}

// 4. Force refresh user data
async function forceRefreshUserData() {
    console.log('4️⃣ Force refreshing user data...');
    
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.log('❌ No token found');
            return;
        }
        
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
            console.log('✅ Fresh user data:', data.stats);
            
            // Update localStorage
            localStorage.setItem('user', JSON.stringify(data.stats));
            console.log('✅ User data updated in localStorage');
            
            return data.stats;
        } else {
            console.log('❌ Failed to refresh user data:', response.status);
            return null;
        }
    } catch (error) {
        console.error('❌ Error refreshing user data:', error);
        return null;
    }
}

// 5. Run complete diagnostic
async function runDiagnostic() {
    console.log('🚀 Running Complete Diagnostic...\n');
    
    // Step 1: Check auth state
    const authState = checkAuthState();
    
    // Step 2: Test dashboard access
    const dashboardAccess = await testDashboardAccess();
    
    // Step 3: Simulate dashboard load
    await simulateDashboardLoad();
    
    // Step 4: Force refresh if needed
    if (!dashboardAccess) {
        console.log('\n🔄 Dashboard access failed, trying to refresh user data...');
        const refreshedData = await forceRefreshUserData();
        
        if (refreshedData) {
            console.log('✅ User data refreshed, testing again...');
            await testDashboardAccess();
        }
    }
    
    console.log('\n📋 Diagnostic Summary:');
    console.log(`- Auth State: ${authState.token && authState.user ? '✅ OK' : '❌ Failed'}`);
    console.log(`- Dashboard Access: ${dashboardAccess ? '✅ OK' : '❌ Failed'}`);
    console.log(`- User Affiliate Status: ${authState.user?.affiliateStatus || 'Unknown'}`);
    console.log(`- User Affiliate Code: ${authState.user?.affiliateCode || 'None'}`);
    
    if (dashboardAccess) {
        console.log('\n🎯 Dashboard should be accessible!');
        console.log('💡 Try navigating to /affiliate/dashboard now.');
    } else {
        console.log('\n❌ Dashboard access denied.');
        console.log('💡 Check the issues above and try refreshing user data.');
    }
}

// Auto-run diagnostic
runDiagnostic();

// Export for manual use
window.DashboardDebug = {
    checkAuthState,
    testDashboardAccess,
    simulateDashboardLoad,
    forceRefreshUserData,
    runDiagnostic
};

console.log('✅ Dashboard Debug Script loaded. Use window.DashboardDebug.* to run functions manually.');
