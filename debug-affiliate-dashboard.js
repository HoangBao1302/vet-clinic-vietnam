// Debug Affiliate Dashboard Loading Issue
// This script helps debug why affiliate dashboard is not loading

console.log('🔍 Debugging Affiliate Dashboard Loading...');

// 1. Check current user data
async function checkUserData() {
    console.log('1️⃣ Checking current user data...');
    
    try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        console.log('📊 Local Storage Data:', {
            hasToken: !!token,
            hasUser: !!user,
            tokenLength: token?.length,
            userData: user ? JSON.parse(user) : null
        });
        
        // Get fresh user stats
        const response = await fetch('/api/user/stats', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Fresh User Stats:', data.stats);
            console.log('🔍 Affiliate Details:', {
                affiliateStatus: data.stats.affiliateStatus,
                affiliateCode: data.stats.affiliateCode,
                isPaid: data.stats.isPaid,
                membershipTier: data.stats.membershipTier
            });
            
            return data.stats;
        } else {
            console.log('❌ Failed to get user stats:', data.error);
            return null;
        }
    } catch (error) {
        console.error('❌ Error checking user data:', error);
        return null;
    }
}

// 2. Check affiliate dashboard access
async function checkAffiliateAccess() {
    console.log('2️⃣ Checking affiliate dashboard access...');
    
    try {
        const token = localStorage.getItem('token');
        
        // Check affiliate access
        const accessResponse = await fetch('/api/affiliate/check-access', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        
        if (accessResponse.ok) {
            const accessData = await accessResponse.json();
            console.log('✅ Affiliate Access Check:', accessData);
            return accessData;
        } else {
            console.log('❌ Affiliate access check failed:', accessResponse.status);
            return null;
        }
    } catch (error) {
        console.error('❌ Error checking affiliate access:', error);
        return null;
    }
}

// 3. Test affiliate dashboard API
async function testAffiliateDashboard() {
    console.log('3️⃣ Testing affiliate dashboard API...');
    
    try {
        const token = localStorage.getItem('token');
        
        // Test affiliate track API
        const trackResponse = await fetch('/api/affiliate/track?affiliateCode=AFF-KIET DANG TONG-158161', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        
        if (trackResponse.ok) {
            const trackData = await trackResponse.json();
            console.log('✅ Affiliate Track Data:', trackData);
            return trackData;
        } else {
            console.log('❌ Affiliate track API failed:', trackResponse.status);
            return null;
        }
    } catch (error) {
        console.error('❌ Error testing affiliate dashboard:', error);
        return null;
    }
}

// 4. Force refresh user data
async function forceRefreshUserData() {
    console.log('4️⃣ Force refreshing user data...');
    
    try {
        const token = localStorage.getItem('token');
        
        // Force refresh user data
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
            console.log('✅ User data refreshed:', data.stats);
            
            // Reload page to apply changes
            console.log('🔄 Reloading page to apply changes...');
            window.location.reload();
        } else {
            console.log('❌ Failed to refresh user data:', data.error);
        }
    } catch (error) {
        console.error('❌ Error force refreshing user data:', error);
    }
}

// 5. Clear cache and reload
function clearCacheAndReload() {
    console.log('5️⃣ Clearing cache and reloading...');
    
    try {
        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Clear cookies
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        console.log('✅ Cache cleared, redirecting to login...');
        window.location.href = '/login';
    } catch (error) {
        console.error('❌ Error clearing cache:', error);
    }
}

// 6. Run all diagnostics
async function runDiagnostics() {
    console.log('🚀 Running Affiliate Dashboard Diagnostics...\n');
    
    const userData = await checkUserData();
    const accessData = await checkAffiliateAccess();
    const trackData = await testAffiliateDashboard();
    
    console.log('\n📋 Diagnostic Summary:');
    console.log(`- User Data: ${userData ? '✅ OK' : '❌ Failed'}`);
    console.log(`- Access Check: ${accessData ? '✅ OK' : '❌ Failed'}`);
    console.log(`- Track API: ${trackData ? '✅ OK' : '❌ Failed'}`);
    
    if (userData) {
        console.log(`- Affiliate Status: ${userData.affiliateStatus}`);
        console.log(`- Affiliate Code: ${userData.affiliateCode}`);
        console.log(`- Should Show Dashboard: ${userData.affiliateStatus === 'approved' ? 'Yes' : 'No'}`);
    }
    
    console.log('\n🔧 Recommended Actions:');
    console.log('1. Try force refresh user data');
    console.log('2. Clear cache and login again');
    console.log('3. Check if affiliate code is correct');
    console.log('4. Verify admin approval in database');
}

// Auto-run diagnostics
runDiagnostics();

// Export for manual use
window.AffiliateDashboardDebug = {
    checkUserData,
    checkAffiliateAccess,
    testAffiliateDashboard,
    forceRefreshUserData,
    clearCacheAndReload,
    runDiagnostics
};

console.log('✅ Affiliate Dashboard Debug Script loaded. Use window.AffiliateDashboardDebug.* to run functions manually.');
