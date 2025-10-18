// Manual Fix for hoangkim.helen@gmail.com Data Inconsistency
// This script specifically fixes the data inconsistency issue

console.log('🔧 Manual Fix for hoangkim.helen@gmail.com Data Inconsistency...');

// 1. Fix user commission data
async function fixHoangkimCommission() {
    console.log('1️⃣ Fixing hoangkim commission data...');
    
    try {
        const token = localStorage.getItem('token');
        
        // Fix user commission via admin API
        const response = await fetch('/api/admin/fix-conversions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                affiliateCode: 'AFF-HOANGKIM-BD295D',
                orderId: 'manual-fix-hoangkim',
                productId: 'ea-full',
                productName: 'EA Full Package',
                amount: 2370000,
                customerEmail: 'hoangkim.helen@gmail.com',
                customerName: 'Hoang Kim'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Hoangkim commission fixed:', data);
            return true;
        } else {
            console.log('❌ Failed to fix hoangkim commission:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Error fixing hoangkim commission:', error);
        return false;
    }
}

// 2. Refresh user data
async function refreshHoangkimData() {
    console.log('2️⃣ Refreshing hoangkim user data...');
    
    try {
        const token = localStorage.getItem('token');
        
        // Refresh user data
        const response = await fetch('/api/admin/refresh-user-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email: 'hoangkim.helen@gmail.com' })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Hoangkim data refreshed:', data);
            return true;
        } else {
            console.log('❌ Failed to refresh hoangkim data:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Error refreshing hoangkim data:', error);
        return false;
    }
}

// 3. Run complete fix
async function runHoangkimFix() {
    console.log('🚀 Running Complete Fix for Hoangkim...\n');
    
    // Step 1: Fix commission
    const commissionFixed = await fixHoangkimCommission();
    
    // Step 2: Refresh data
    const dataRefreshed = await refreshHoangkimData();
    
    // Summary
    console.log('\n📋 Hoangkim Fix Summary:');
    console.log(`- Commission Fixed: ${commissionFixed ? '✅ Success' : '❌ Failed'}`);
    console.log(`- Data Refreshed: ${dataRefreshed ? '✅ Success' : '❌ Failed'}`);
    
    if (commissionFixed && dataRefreshed) {
        console.log('\n🎯 Fix completed successfully!');
        console.log('💡 Refresh the admin auto-fix page to see updated results.');
    } else {
        console.log('\n❌ Fix failed. Please try again or contact support.');
    }
}

// Auto-run fix
runHoangkimFix();

// Export for manual use
window.HoangkimFix = {
    fixHoangkimCommission,
    refreshHoangkimData,
    runHoangkimFix
};

console.log('✅ Hoangkim Fix Script loaded. Use window.HoangkimFix.* to run functions manually.');
