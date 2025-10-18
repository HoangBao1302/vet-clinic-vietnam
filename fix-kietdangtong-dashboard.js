// Fix Affiliate Dashboard for Kietdangtong
// This script specifically fixes the dashboard loading issue

console.log('🔧 Fixing Affiliate Dashboard for Kietdangtong...');

// 1. Check kietdangtong affiliate status
async function checkKietdangtongStatus() {
    console.log('1️⃣ Checking kietdangtong affiliate status...');
    
    try {
        const token = localStorage.getItem('token');
        
        // Get user stats
        const response = await fetch('/api/user/stats', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('📊 Kietdangtong Stats:', data.stats);
            
            // Check affiliate status
            if (data.stats.affiliateStatus === 'approved' && data.stats.affiliateCode) {
                console.log('✅ Affiliate status is correct');
                console.log('🔍 Affiliate Code:', data.stats.affiliateCode);
                
                // Test affiliate track API
                const trackResponse = await fetch(`/api/affiliate/track?affiliateCode=${data.stats.affiliateCode}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                
                if (trackResponse.ok) {
                    const trackData = await trackResponse.json();
                    console.log('✅ Affiliate Track Data:', trackData);
                    return { success: true, stats: data.stats, trackData };
                } else {
                    console.log('❌ Affiliate track API failed:', trackResponse.status);
                    return { success: false, error: 'Track API failed' };
                }
            } else {
                console.log('❌ Affiliate status issue:', {
                    affiliateStatus: data.stats.affiliateStatus,
                    affiliateCode: data.stats.affiliateCode
                });
                return { success: false, error: 'Affiliate not approved or no code' };
            }
        } else {
            console.log('❌ Failed to get user stats:', data.error);
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('❌ Error checking kietdangtong status:', error);
        return { success: false, error: error.message };
    }
}

// 2. Force refresh user data
async function forceRefreshUserData() {
    console.log('2️⃣ Force refreshing user data...');
    
    try {
        const token = localStorage.getItem('token');
        
        // Get fresh user data with no cache
        const response = await fetch('/api/user/stats', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update localStorage
            localStorage.setItem('user', JSON.stringify(data.stats));
            console.log('✅ User data refreshed and updated in localStorage');
            
            return data.stats;
        } else {
            console.log('❌ Failed to refresh user data:', data.error);
            return null;
        }
    } catch (error) {
        console.error('❌ Error force refreshing user data:', error);
        return null;
    }
}

// 3. Test dashboard access
async function testDashboardAccess() {
    console.log('3️⃣ Testing dashboard access...');
    
    try {
        const token = localStorage.getItem('token');
        
        // Test affiliate access
        const accessResponse = await fetch('/api/affiliate/check-access', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        
        if (accessResponse.ok) {
            const accessData = await accessResponse.json();
            console.log('✅ Affiliate Access Check:', accessData);
            
            if (accessData.canAccessDashboard) {
                console.log('✅ Dashboard access confirmed');
                return true;
            } else {
                console.log('❌ Dashboard access denied:', accessData.reason);
                return false;
            }
        } else {
            console.log('❌ Access check failed:', accessResponse.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing dashboard access:', error);
        return false;
    }
}

// 4. Navigate to dashboard
function navigateToDashboard() {
    console.log('4️⃣ Navigating to affiliate dashboard...');
    
    try {
        // Navigate to affiliate dashboard
        window.location.href = '/affiliate/dashboard';
    } catch (error) {
        console.error('❌ Error navigating to dashboard:', error);
    }
}

// 5. Complete fix process
async function runCompleteFix() {
    console.log('🚀 Running Complete Fix for Kietdangtong...\n');
    
    // Step 1: Check current status
    const statusCheck = await checkKietdangtongStatus();
    
    if (!statusCheck.success) {
        console.log('❌ Status check failed:', statusCheck.error);
        console.log('🔧 Trying to refresh user data...');
        
        const refreshedData = await forceRefreshUserData();
        if (!refreshedData) {
            console.log('❌ Failed to refresh user data');
            return;
        }
    }
    
    // Step 2: Test dashboard access
    const dashboardAccess = await testDashboardAccess();
    
    if (dashboardAccess) {
        console.log('✅ Dashboard access confirmed');
        console.log('🎯 Ready to navigate to dashboard');
        
        // Ask user if they want to navigate
        const shouldNavigate = confirm('Dashboard access confirmed! Navigate to affiliate dashboard now?');
        if (shouldNavigate) {
            navigateToDashboard();
        }
    } else {
        console.log('❌ Dashboard access still denied');
        console.log('🔧 Try logging out and logging back in');
    }
    
    console.log('\n✅ Fix process completed!');
}

// Auto-run fix
runCompleteFix();

// Export for manual use
window.KietdangtongFix = {
    checkKietdangtongStatus,
    forceRefreshUserData,
    testDashboardAccess,
    navigateToDashboard,
    runCompleteFix
};

console.log('✅ Kietdangtong Fix Script loaded. Use window.KietdangtongFix.* to run functions manually.');
