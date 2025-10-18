// Debug Thuanyen Affiliate Conversions
// This script helps debug why thuanyen has 4 clicks but 0 conversions

console.log('🔍 Debugging Thuanyen Affiliate Conversions...');

// 1. Check thuanyen affiliate data
async function checkThuanyenAffiliateData() {
    console.log('1️⃣ Checking thuanyen affiliate data...');
    
    try {
        // Login as thuanyen first
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
                console.log('📊 Thuanyen Stats:', {
                    affiliateStatus: statsData.stats.affiliateStatus,
                    affiliateCode: statsData.stats.affiliateCode,
                    isPaid: statsData.stats.isPaid,
                    membershipTier: statsData.stats.membershipTier,
                    totalCommissionEarned: statsData.stats.totalCommissionEarned,
                    totalCommissionPaid: statsData.stats.totalCommissionPaid
                });
                
                return {
                    token: loginData.token,
                    user: loginData.user,
                    stats: statsData.stats
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
        console.error('❌ Error checking thuanyen data:', error);
        return null;
    }
}

// 2. Check affiliate dashboard data
async function checkAffiliateDashboard(token) {
    console.log('2️⃣ Checking affiliate dashboard data...');
    
    try {
        const response = await fetch('/api/affiliate/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('📈 Affiliate Dashboard Data:', data);
            return data;
        } else {
            console.log('❌ Failed to get dashboard data:', response.status);
            return null;
        }
    } catch (error) {
        console.error('❌ Error getting dashboard data:', error);
        return null;
    }
}

// 3. Check recent orders for anhkim
async function checkAnhkimOrders() {
    console.log('3️⃣ Checking anhkim orders...');
    
    try {
        // This would need admin access or a specific API endpoint
        // For now, we'll check if we can find any orders
        const response = await fetch('/api/admin/orders', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('📦 Recent Orders:', data);
            return data;
        } else {
            console.log('⚠️ Cannot access orders (need admin or different endpoint)');
            return null;
        }
    } catch (error) {
        console.error('❌ Error checking orders:', error);
        return null;
    }
}

// 4. Test affiliate link generation
function testAffiliateLinkGeneration(affiliateCode) {
    console.log('4️⃣ Testing affiliate link generation...');
    
    if (!affiliateCode) {
        console.log('❌ No affiliate code found');
        return;
    }
    
    const products = [
        { id: 'ea-full', name: 'EA ThebenchmarkTrader Full Version', price: 7900000 },
        { id: 'ea-pro-source', name: 'EA Pro + Source Code', price: 14900000 },
        { id: 'indicator-pro', name: 'Multi-Indicator Pro Pack', price: 1990000 }
    ];
    
    console.log('🔗 Generated Affiliate Links:');
    products.forEach(product => {
        const link = `https://thebenchmarktrader.com?affiliate=${affiliateCode}&product=${product.id}`;
        console.log(`${product.name}: ${link}`);
    });
}

// 5. Check webhook processing
async function checkWebhookProcessing() {
    console.log('5️⃣ Checking webhook processing...');
    
    try {
        // Check if there are any recent webhook logs
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

// 6. Simulate conversion tracking
function simulateConversionTracking() {
    console.log('6️⃣ Simulating conversion tracking...');
    
    // This would simulate what should happen when a conversion occurs
    const mockConversion = {
        affiliateCode: 'AFF-THUANYEN-FA7F52',
        orderId: 'TEST-ORDER-123',
        productId: 'ea-full',
        amount: 7900000,
        commissionRate: 0.35,
        commissionAmount: 2765000,
        customerEmail: 'anhkim.230923@gmail.com'
    };
    
    console.log('🎯 Mock Conversion:', mockConversion);
    
    // Show what should happen
    console.log('📋 Expected Process:');
    console.log('1. Customer clicks affiliate link');
    console.log('2. Customer completes purchase');
    console.log('3. Webhook receives payment confirmation');
    console.log('4. System finds matching affiliate click');
    console.log('5. System updates click status to "converted"');
    console.log('6. System calculates and records commission');
    console.log('7. Dashboard shows updated stats');
}

// 7. Run all diagnostics
async function runDiagnostics() {
    console.log('🚀 Running Thuanyen Affiliate Diagnostics...\n');
    
    // Check thuanyen data
    const thuanyenData = await checkThuanyenAffiliateData();
    
    if (!thuanyenData) {
        console.log('❌ Cannot continue without thuanyen data');
        return;
    }
    
    // Check dashboard data
    const dashboardData = await checkAffiliateDashboard(thuanyenData.token);
    
    // Test link generation
    testAffiliateLinkGeneration(thuanyenData.stats.affiliateCode);
    
    // Check orders
    await checkAnhkimOrders();
    
    // Check webhooks
    await checkWebhookProcessing();
    
    // Simulate conversion
    simulateConversionTracking();
    
    console.log('\n✅ Diagnostics completed!');
    console.log('\n📋 Summary:');
    console.log(`- Affiliate Status: ${thuanyenData.stats.affiliateStatus}`);
    console.log(`- Affiliate Code: ${thuanyenData.stats.affiliateCode}`);
    console.log(`- Total Commission: ${thuanyenData.stats.totalCommissionEarned || 0}đ`);
    console.log(`- Dashboard Access: ${dashboardData ? 'OK' : 'Failed'}`);
}

// Auto-run diagnostics
runDiagnostics();

// Export for manual use
window.ThuanyenDebug = {
    checkThuanyenAffiliateData,
    checkAffiliateDashboard,
    checkAnhkimOrders,
    testAffiliateLinkGeneration,
    checkWebhookProcessing,
    simulateConversionTracking,
    runDiagnostics
};

console.log('✅ Thuanyen Debug Script loaded. Use window.ThuanyenDebug.* to run functions manually.');
