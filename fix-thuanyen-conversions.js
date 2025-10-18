// Fix Thuanyen Affiliate Conversions
// This script helps debug and fix the conversion tracking issue

console.log('🔧 Fixing Thuanyen Affiliate Conversions...');

// 1. Check current affiliate stats
async function checkCurrentStats() {
    console.log('1️⃣ Checking current affiliate stats...');
    
    try {
        const response = await fetch('/api/affiliate/track?affiliateCode=AFF-THUANYEN-FA7F52');
        const data = await response.json();
        
        if (data.success) {
            console.log('📊 Current Stats:', data.stats);
            console.log('📋 Recent Clicks:', data.clicks.slice(0, 5));
            return data;
        } else {
            console.log('❌ Failed to get stats:', data.error);
            return null;
        }
    } catch (error) {
        console.error('❌ Error getting stats:', error);
        return null;
    }
}

// 2. Check for anhkim orders
async function checkAnhkimOrders() {
    console.log('2️⃣ Checking anhkim orders...');
    
    try {
        // Check if there are any orders with anhkim email
        const response = await fetch('/api/admin/orders', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('📦 All Orders:', data);
            
            // Filter for anhkim orders
            const anhkimOrders = data.orders?.filter(order => 
                order.customerEmail?.includes('anhkim') || 
                order.customerEmail?.includes('sb-xapgt47022791')
            );
            
            console.log('🎯 Anhkim Orders:', anhkimOrders);
            return anhkimOrders;
        } else {
            console.log('⚠️ Cannot access orders (need admin access)');
            return null;
        }
    } catch (error) {
        console.error('❌ Error checking orders:', error);
        return null;
    }
}

// 3. Simulate conversion for existing clicks
async function simulateConversion() {
    console.log('3️⃣ Simulating conversion for existing clicks...');
    
    try {
        // Get current clicks
        const statsResponse = await fetch('/api/affiliate/track?affiliateCode=AFF-THUANYEN-FA7F52');
        const statsData = await statsResponse.json();
        
        if (!statsData.success) {
            console.log('❌ Cannot get clicks data');
            return;
        }
        
        const unconvertedClicks = statsData.clicks.filter(click => click.status === 'clicked');
        console.log('🔍 Unconverted Clicks:', unconvertedClicks);
        
        if (unconvertedClicks.length === 0) {
            console.log('ℹ️ No unconverted clicks found');
            return;
        }
        
        // Simulate conversion for the first click
        const clickToConvert = unconvertedClicks[0];
        console.log('🎯 Converting click:', clickToConvert);
        
        // This would need to be done via API or database directly
        // For now, we'll just show what should happen
        console.log('📋 Conversion Process:');
        console.log('1. Find click with status "clicked"');
        console.log('2. Update status to "converted"');
        console.log('3. Add orderId, commissionAmount, etc.');
        console.log('4. Update user totalCommissionEarned');
        
    } catch (error) {
        console.error('❌ Error simulating conversion:', error);
    }
}

// 4. Create manual conversion record
async function createManualConversion() {
    console.log('4️⃣ Creating manual conversion record...');
    
    try {
        // This would create a manual conversion record
        const conversionData = {
            affiliateCode: 'AFF-THUANYEN-FA7F52',
            orderId: 'MANUAL-CONVERSION-' + Date.now(),
            productId: 'ea-full',
            productName: 'EA ThebenchmarkTrader Full Version',
            amount: 7900000,
            commissionAmount: 2765000, // 35% for paid member
            customerEmail: 'anhkim.230923@gmail.com',
            customerName: 'Anh Kim',
            status: 'converted'
        };
        
        console.log('📝 Manual Conversion Data:', conversionData);
        
        // This would need to be implemented as an API endpoint
        console.log('⚠️ Manual conversion creation not implemented yet');
        
    } catch (error) {
        console.error('❌ Error creating manual conversion:', error);
    }
}

// 5. Check webhook logs
async function checkWebhookLogs() {
    console.log('5️⃣ Checking webhook logs...');
    
    try {
        // Check if there are any webhook debug endpoints
        const response = await fetch('/api/debug/webhooks', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('🔧 Webhook Logs:', data);
            return data;
        } else {
            console.log('⚠️ No webhook debug endpoint available');
            return null;
        }
    } catch (error) {
        console.error('❌ Error checking webhooks:', error);
        return null;
    }
}

// 6. Test affiliate link tracking
async function testAffiliateTracking() {
    console.log('6️⃣ Testing affiliate link tracking...');
    
    try {
        // Test clicking an affiliate link
        const testData = {
            affiliateCode: 'AFF-THUANYEN-FA7F52',
            productId: 'ea-full',
            productName: 'EA ThebenchmarkTrader Full Version'
        };
        
        const response = await fetch('/api/affiliate/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Affiliate tracking test successful');
            console.log('Click ID:', data.clickId);
        } else {
            console.log('❌ Affiliate tracking test failed:', data.error);
        }
        
    } catch (error) {
        console.error('❌ Error testing affiliate tracking:', error);
    }
}

// 7. Run all diagnostics and fixes
async function runDiagnosticsAndFixes() {
    console.log('🚀 Running Diagnostics and Fixes...\n');
    
    // Check current stats
    const currentStats = await checkCurrentStats();
    
    // Check anhkim orders
    const anhkimOrders = await checkAnhkimOrders();
    
    // Check webhook logs
    await checkWebhookLogs();
    
    // Test affiliate tracking
    await testAffiliateTracking();
    
    // Simulate conversion
    await simulateConversion();
    
    // Create manual conversion
    await createManualConversion();
    
    console.log('\n✅ Diagnostics and fixes completed!');
    
    // Summary
    console.log('\n📋 Summary:');
    if (currentStats) {
        console.log(`- Total Clicks: ${currentStats.stats.totalClicks}`);
        console.log(`- Conversions: ${currentStats.stats.conversions}`);
        console.log(`- Conversion Rate: ${currentStats.stats.conversionRate}%`);
        console.log(`- Total Commission: ${currentStats.stats.totalCommission}đ`);
    }
    
    if (anhkimOrders && anhkimOrders.length > 0) {
        console.log(`- Anhkim Orders Found: ${anhkimOrders.length}`);
        anhkimOrders.forEach((order, index) => {
            console.log(`  ${index + 1}. Order ID: ${order.orderId}, Amount: ${order.amount}đ`);
        });
    }
    
    console.log('\n🔧 Next Steps:');
    console.log('1. Check if webhooks are being triggered');
    console.log('2. Verify affiliate code is passed correctly');
    console.log('3. Check if AffiliateClick records exist');
    console.log('4. Manually update conversions if needed');
}

// Auto-run diagnostics
runDiagnosticsAndFixes();

// Export for manual use
window.ThuanyenFix = {
    checkCurrentStats,
    checkAnhkimOrders,
    simulateConversion,
    createManualConversion,
    checkWebhookLogs,
    testAffiliateTracking,
    runDiagnosticsAndFixes
};

console.log('✅ Thuanyen Fix Script loaded. Use window.ThuanyenFix.* to run functions manually.');
