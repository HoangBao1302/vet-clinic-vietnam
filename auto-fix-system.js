// Auto-Fix System for All Affiliate Users
// This system automatically detects and fixes affiliate dashboard issues

console.log('🚀 Auto-Fix System for All Affiliate Users Started...');

// 1. Auto-detect affiliate dashboard issues
async function autoDetectIssues() {
    console.log('1️⃣ Auto-detecting affiliate dashboard issues...');
    
    try {
        const token = localStorage.getItem('token');
        
        // Get all affiliates with potential issues
        const response = await fetch('/api/admin/monitor-affiliates', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('📊 Monitor Results:', data);
            
            if (data.issues && data.issues.length > 0) {
                console.log('⚠️ Issues detected:', data.issues.length);
                return data.issues;
            } else {
                console.log('✅ No issues detected');
                return [];
            }
        } else {
            console.log('❌ Failed to get monitor data:', response.status);
            return [];
        }
    } catch (error) {
        console.error('❌ Error auto-detecting issues:', error);
        return [];
    }
}

// 2. Auto-fix user data refresh
async function autoFixUserData(userEmail) {
    console.log(`2️⃣ Auto-fixing user data for: ${userEmail}`);
    
    try {
        const token = localStorage.getItem('token');
        
        // Force refresh user data via admin API
        const response = await fetch('/api/admin/refresh-user-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email: userEmail })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ User data refreshed for ${userEmail}:`, data);
            return true;
        } else {
            console.log(`❌ Failed to refresh user data for ${userEmail}:`, response.status);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error auto-fixing user data for ${userEmail}:`, error);
        return false;
    }
}

// 3. Auto-fix affiliate status
async function autoFixAffiliateStatus(userEmail) {
    console.log(`3️⃣ Auto-fixing affiliate status for: ${userEmail}`);
    
    try {
        const token = localStorage.getItem('token');
        
        // Check and fix affiliate status
        const response = await fetch('/api/admin/fix-affiliate-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email: userEmail })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Affiliate status fixed for ${userEmail}:`, data);
            return true;
        } else {
            console.log(`❌ Failed to fix affiliate status for ${userEmail}:`, response.status);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error auto-fixing affiliate status for ${userEmail}:`, error);
        return false;
    }
}

// 4. Auto-fix conversion tracking
async function autoFixConversions(userEmail) {
    console.log(`4️⃣ Auto-fixing conversions for: ${userEmail}`);
    
    try {
        const token = localStorage.getItem('token');
        
        // Check for missing conversions
        const response = await fetch('/api/admin/auto-fix-conversions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email: userEmail })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Conversions auto-fixed for ${userEmail}:`, data);
            return true;
        } else {
            console.log(`❌ Failed to auto-fix conversions for ${userEmail}:`, response.status);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error auto-fixing conversions for ${userEmail}:`, error);
        return false;
    }
}

// 5. Run complete auto-fix for all users
async function runCompleteAutoFix() {
    console.log('🚀 Running Complete Auto-Fix for All Affiliate Users...\n');
    
    // Step 1: Detect issues
    const issues = await autoDetectIssues();
    
    if (issues.length === 0) {
        console.log('✅ No issues found. All affiliate users are working correctly!');
        return;
    }
    
    console.log(`🔧 Found ${issues.length} users with issues. Starting auto-fix...\n`);
    
    const fixResults = [];
    
    for (const issue of issues) {
        console.log(`\n🔧 Fixing user: ${issue.email}`);
        
        const results = {
            email: issue.email,
            userDataFixed: false,
            affiliateStatusFixed: false,
            conversionsFixed: false
        };
        
        // Fix user data
        results.userDataFixed = await autoFixUserData(issue.email);
        
        // Fix affiliate status
        results.affiliateStatusFixed = await autoFixAffiliateStatus(issue.email);
        
        // Fix conversions
        results.conversionsFixed = await autoFixConversions(issue.email);
        
        fixResults.push(results);
        
        console.log(`✅ Fix completed for ${issue.email}`);
    }
    
    // Summary
    console.log('\n📋 Auto-Fix Summary:');
    fixResults.forEach(result => {
        console.log(`\n👤 ${result.email}:`);
        console.log(`  - User Data: ${result.userDataFixed ? '✅ Fixed' : '❌ Failed'}`);
        console.log(`  - Affiliate Status: ${result.affiliateStatusFixed ? '✅ Fixed' : '❌ Failed'}`);
        console.log(`  - Conversions: ${result.conversionsFixed ? '✅ Fixed' : '❌ Failed'}`);
    });
    
    console.log('\n🎯 Auto-fix process completed!');
    console.log('💡 Users should now be able to access their affiliate dashboards.');
}

// 6. Schedule automatic monitoring
function scheduleAutoMonitoring() {
    console.log('⏰ Scheduling automatic monitoring...');
    
    // Run auto-fix every 30 minutes
    setInterval(async () => {
        console.log('🔄 Running scheduled auto-fix...');
        await runCompleteAutoFix();
    }, 30 * 60 * 1000); // 30 minutes
    
    console.log('✅ Automatic monitoring scheduled every 30 minutes');
}

// Auto-run complete fix
runCompleteAutoFix();

// Schedule monitoring
scheduleAutoMonitoring();

// Export for manual use
window.AutoFixSystem = {
    autoDetectIssues,
    autoFixUserData,
    autoFixAffiliateStatus,
    autoFixConversions,
    runCompleteAutoFix,
    scheduleAutoMonitoring
};

console.log('✅ Auto-Fix System loaded. Use window.AutoFixSystem.* to run functions manually.');
