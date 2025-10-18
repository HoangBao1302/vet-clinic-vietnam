// Debug Dashboard Button Visibility
// This script helps debug why the dashboard button doesn't show for thuanyen

console.log('🔍 Debugging Dashboard Button Visibility...');

// 1. Check thuanyen user stats API
async function checkThuanyenStats() {
    console.log('1️⃣ Checking thuanyen user stats...');
    
    try {
        // Login as thuanyen
        const loginResponse = await fetch('/api/auth/login', {
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
            console.log('✅ Login as thuanyen successful');
            
            // Get user stats
            const statsResponse = await fetch('/api/user/stats', {
                headers: {
                    'Authorization': `Bearer ${loginData.token}`,
                }
            });
            
            const statsData = await statsResponse.json();
            
            if (statsData.success) {
                console.log('📊 Thuanyen Stats:', statsData.stats);
                
                // Check dashboard button conditions
                const shouldShowDashboard = statsData.stats.affiliateStatus === 'approved';
                console.log('🔍 Dashboard Button Check:', {
                    affiliateStatus: statsData.stats.affiliateStatus,
                    shouldShowDashboard,
                    affiliateCode: statsData.stats.affiliateCode,
                    isPaid: statsData.stats.isPaid
                });
                
                return {
                    token: loginData.token,
                    user: loginData.user,
                    stats: statsData.stats,
                    shouldShowDashboard
                };
            } else {
                console.log('❌ Failed to get stats:', statsData.message);
                return null;
            }
        } else {
            console.log('❌ Login failed:', loginData.message);
            return null;
        }
    } catch (error) {
        console.error('❌ Error checking thuanyen stats:', error);
        return null;
    }
}

// 2. Check hoangkim stats for comparison
async function checkHoangkimStats() {
    console.log('2️⃣ Checking hoangkim stats for comparison...');
    
    try {
        // Login as hoangkim
        const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'hoangkim.helen@gmail.com',
                password: 'test123' // Update with correct password
            })
        });
        
        const loginData = await loginResponse.json();
        
        if (loginData.success && loginData.token) {
            console.log('✅ Login as hoangkim successful');
            
            // Get user stats
            const statsResponse = await fetch('/api/user/stats', {
                headers: {
                    'Authorization': `Bearer ${loginData.token}`,
                }
            });
            
            const statsData = await statsResponse.json();
            
            if (statsData.success) {
                console.log('📊 Hoangkim Stats:', statsData.stats);
                
                // Check dashboard button conditions
                const shouldShowDashboard = statsData.stats.affiliateStatus === 'approved';
                console.log('🔍 Hoangkim Dashboard Button Check:', {
                    affiliateStatus: statsData.stats.affiliateStatus,
                    shouldShowDashboard,
                    affiliateCode: statsData.stats.affiliateCode,
                    isPaid: statsData.stats.isPaid
                });
                
                return {
                    token: loginData.token,
                    user: loginData.user,
                    stats: statsData.stats,
                    shouldShowDashboard
                };
            } else {
                console.log('❌ Failed to get hoangkim stats:', statsData.message);
                return null;
            }
        } else {
            console.log('❌ Hoangkim login failed:', loginData.message);
            return null;
        }
    } catch (error) {
        console.error('❌ Error checking hoangkim stats:', error);
        return null;
    }
}

// 3. Compare the two accounts
function compareAccounts(thuanyenData, hoangkimData) {
    console.log('3️⃣ Comparing accounts...');
    
    if (!thuanyenData || !hoangkimData) {
        console.log('❌ Cannot compare - missing data');
        return;
    }
    
    console.log('📊 Comparison:');
    console.log('Thuanyen:', {
        affiliateStatus: thuanyenData.stats.affiliateStatus,
        affiliateCode: thuanyenData.stats.affiliateCode,
        isPaid: thuanyenData.stats.isPaid,
        shouldShowDashboard: thuanyenData.shouldShowDashboard
    });
    
    console.log('Hoangkim:', {
        affiliateStatus: hoangkimData.stats.affiliateStatus,
        affiliateCode: hoangkimData.stats.affiliateCode,
        isPaid: hoangkimData.stats.isPaid,
        shouldShowDashboard: hoangkimData.shouldShowDashboard
    });
    
    // Check differences
    const differences = [];
    
    if (thuanyenData.stats.affiliateStatus !== hoangkimData.stats.affiliateStatus) {
        differences.push(`Affiliate Status: ${thuanyenData.stats.affiliateStatus} vs ${hoangkimData.stats.affiliateStatus}`);
    }
    
    if (thuanyenData.stats.isPaid !== hoangkimData.stats.isPaid) {
        differences.push(`Is Paid: ${thuanyenData.stats.isPaid} vs ${hoangkimData.stats.isPaid}`);
    }
    
    if (thuanyenData.shouldShowDashboard !== hoangkimData.shouldShowDashboard) {
        differences.push(`Should Show Dashboard: ${thuanyenData.shouldShowDashboard} vs ${hoangkimData.shouldShowDashboard}`);
    }
    
    if (differences.length > 0) {
        console.log('🔍 Differences found:', differences);
    } else {
        console.log('✅ No differences found in API responses');
    }
}

// 4. Check profile page rendering
function checkProfilePageRendering(thuanyenData) {
    console.log('4️⃣ Checking profile page rendering...');
    
    if (!thuanyenData) {
        console.log('❌ No thuanyen data to check');
        return;
    }
    
    // Check if the dashboard button should show
    const shouldShow = thuanyenData.stats.affiliateStatus === 'approved';
    
    console.log('🔍 Profile Page Check:', {
        affiliateStatus: thuanyenData.stats.affiliateStatus,
        shouldShowDashboard: shouldShow,
        condition: 'stats?.affiliateStatus === "approved"'
    });
    
    if (shouldShow) {
        console.log('✅ Dashboard button SHOULD be visible');
        console.log('🔧 Possible issues:');
        console.log('1. Frontend cache - try hard refresh');
        console.log('2. JavaScript error preventing rendering');
        console.log('3. CSS hiding the button');
        console.log('4. Auth context not updating');
    } else {
        console.log('❌ Dashboard button should NOT be visible');
        console.log('🔧 Fix needed: Update affiliate status to "approved"');
    }
}

// 5. Run all diagnostics
async function runDashboardDiagnostics() {
    console.log('🚀 Running Dashboard Button Diagnostics...\n');
    
    // Check thuanyen stats
    const thuanyenData = await checkThuanyenStats();
    
    // Check hoangkim stats
    const hoangkimData = await checkHoangkimStats();
    
    // Compare accounts
    compareAccounts(thuanyenData, hoangkimData);
    
    // Check profile page rendering
    checkProfilePageRendering(thuanyenData);
    
    console.log('\n✅ Dashboard diagnostics completed!');
    
    // Summary
    console.log('\n📋 Summary:');
    if (thuanyenData) {
        console.log(`- Thuanyen Affiliate Status: ${thuanyenData.stats.affiliateStatus}`);
        console.log(`- Should Show Dashboard: ${thuanyenData.shouldShowDashboard}`);
    }
    
    if (hoangkimData) {
        console.log(`- Hoangkim Affiliate Status: ${hoangkimData.stats.affiliateStatus}`);
        console.log(`- Should Show Dashboard: ${hoangkimData.shouldShowDashboard}`);
    }
    
    console.log('\n🔧 Next Steps:');
    console.log('1. If affiliate status is not "approved", update it in database');
    console.log('2. If status is "approved" but button not showing, check frontend');
    console.log('3. Clear browser cache and try again');
    console.log('4. Check browser console for JavaScript errors');
}

// Auto-run diagnostics
runDashboardDiagnostics();

// Export for manual use
window.DashboardDebug = {
    checkThuanyenStats,
    checkHoangkimStats,
    compareAccounts,
    checkProfilePageRendering,
    runDashboardDiagnostics
};

console.log('✅ Dashboard Debug Script loaded. Use window.DashboardDebug.* to run functions manually.');
