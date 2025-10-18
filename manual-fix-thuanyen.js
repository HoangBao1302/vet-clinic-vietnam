// Fix Thuanyen Conversions - Manual Fix Script
// This script manually fixes the conversion tracking for thuanyen

console.log('🔧 Manual Fix for Thuanyen Conversions...');

// 1. Fix conversion for anhkim's PayPal payment
async function fixPayPalConversion() {
    console.log('1️⃣ Fixing PayPal conversion...');
    
    try {
        const conversionData = {
            affiliateCode: 'AFF-THUANYEN-FA7F52',
            orderId: 'PAYPAL-ANHKIM-1', // This should be the actual PayPal order ID
            productId: 'ea-full',
            productName: 'EA ThebenchmarkTrader Full Version',
            amount: 7900000, // 7.9M VND
            customerEmail: 'sb-xapgt47022791@personal.example.com',
            customerName: 'Anh Kim'
        };
        
        const response = await fetch('/api/admin/fix-conversions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(conversionData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ PayPal conversion fixed:', data.data);
        } else {
            console.log('❌ PayPal conversion fix failed:', data.error);
        }
        
        return data;
    } catch (error) {
        console.error('❌ Error fixing PayPal conversion:', error);
        return null;
    }
}

// 2. Fix conversion for anhkim's Stripe payment
async function fixStripeConversion() {
    console.log('2️⃣ Fixing Stripe conversion...');
    
    try {
        const conversionData = {
            affiliateCode: 'AFF-THUANYEN-FA7F52',
            orderId: 'STRIPE-ANHKIM-1', // This should be the actual Stripe session ID
            productId: 'ea-full',
            productName: 'EA ThebenchmarkTrader Full Version',
            amount: 7900000, // 7.9M VND
            customerEmail: 'anhkim.230923@gmail.com',
            customerName: 'Anh Kim'
        };
        
        const response = await fetch('/api/admin/fix-conversions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(conversionData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Stripe conversion fixed:', data.data);
        } else {
            console.log('❌ Stripe conversion fix failed:', data.error);
        }
        
        return data;
    } catch (error) {
        console.error('❌ Error fixing Stripe conversion:', error);
        return null;
    }
}

// 3. Check updated stats
async function checkUpdatedStats() {
    console.log('3️⃣ Checking updated stats...');
    
    try {
        const response = await fetch('/api/admin/fix-conversions?affiliateCode=AFF-THUANYEN-FA7F52', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('📊 Updated Stats:', data.summary);
            console.log('👤 Affiliate Info:', data.affiliate);
            console.log('📋 All Clicks:', data.clicks);
        } else {
            console.log('❌ Failed to get updated stats:', data.error);
        }
        
        return data;
    } catch (error) {
        console.error('❌ Error checking updated stats:', error);
        return null;
    }
}

// 4. Test affiliate dashboard access
async function testDashboardAccess() {
    console.log('4️⃣ Testing affiliate dashboard access...');
    
    try {
        const response = await fetch('/api/affiliate/dashboard', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Dashboard access OK:', data);
        } else {
            console.log('❌ Dashboard access failed:', response.status);
        }
    } catch (error) {
        console.error('❌ Error testing dashboard access:', error);
    }
}

// 5. Run all fixes
async function runAllFixes() {
    console.log('🚀 Running All Fixes for Thuanyen...\n');
    
    // Check if user is logged in as admin
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('❌ Please login as admin first');
        return;
    }
    
    // Fix PayPal conversion
    const paypalResult = await fixPayPalConversion();
    
    // Fix Stripe conversion
    const stripeResult = await fixStripeConversion();
    
    // Check updated stats
    const updatedStats = await checkUpdatedStats();
    
    // Test dashboard access
    await testDashboardAccess();
    
    console.log('\n✅ All fixes completed!');
    
    // Summary
    console.log('\n📋 Fix Summary:');
    console.log(`- PayPal Fix: ${paypalResult?.success ? '✅ Success' : '❌ Failed'}`);
    console.log(`- Stripe Fix: ${stripeResult?.success ? '✅ Success' : '❌ Failed'}`);
    
    if (updatedStats?.success) {
        console.log(`- Total Clicks: ${updatedStats.summary.totalClicks}`);
        console.log(`- Conversions: ${updatedStats.summary.conversions}`);
        console.log(`- Total Commission: ${updatedStats.summary.totalCommission}đ`);
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Check thuanyen dashboard for updated stats');
    console.log('2. Verify commission calculations');
    console.log('3. Test affiliate dashboard button visibility');
}

// Auto-run fixes
runAllFixes();

// Export for manual use
window.ThuanyenManualFix = {
    fixPayPalConversion,
    fixStripeConversion,
    checkUpdatedStats,
    testDashboardAccess,
    runAllFixes
};

console.log('✅ Thuanyen Manual Fix Script loaded. Use window.ThuanyenManualFix.* to run functions manually.');
