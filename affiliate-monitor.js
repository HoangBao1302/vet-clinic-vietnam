// Monitor Affiliate Conversions - Auto-fix Script
// This script monitors and auto-fixes conversion tracking issues

console.log('🔍 Affiliate Conversion Monitor Started...');

// 1. Monitor recent payments for missing conversions
async function monitorRecentPayments() {
    console.log('1️⃣ Monitoring recent payments...');
    
    try {
        // Check for payments in the last 24 hours
        const response = await fetch('/api/admin/recent-payments', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('📊 Recent Payments:', data);
            
            // Check each payment for missing conversions
            for (const payment of data.payments || []) {
                if (payment.affiliateCode && !payment.conversionTracked) {
                    console.log('⚠️ Missing conversion detected:', payment);
                    await autoFixConversion(payment);
                }
            }
        }
    } catch (error) {
        console.error('❌ Error monitoring payments:', error);
    }
}

// 2. Auto-fix missing conversions
async function autoFixConversion(payment) {
    console.log('2️⃣ Auto-fixing conversion for:', payment.orderId);
    
    try {
        const conversionData = {
            affiliateCode: payment.affiliateCode,
            orderId: payment.orderId,
            productId: payment.productId,
            productName: payment.productName,
            amount: payment.amount,
            customerEmail: payment.customerEmail,
            customerName: payment.customerName
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
            console.log('✅ Auto-fix successful:', data.data);
        } else {
            console.log('❌ Auto-fix failed:', data.error);
        }
    } catch (error) {
        console.error('❌ Error auto-fixing conversion:', error);
    }
}

// 3. Check affiliate stats for anomalies
async function checkAffiliateStats() {
    console.log('3️⃣ Checking affiliate stats for anomalies...');
    
    try {
        // Get all affiliates
        const response = await fetch('/api/admin/affiliates', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            for (const affiliate of data.affiliates || []) {
                // Check for affiliates with clicks but no conversions
                if (affiliate.totalClicks > 0 && affiliate.conversions === 0) {
                    console.log('⚠️ Potential issue detected:', {
                        affiliate: affiliate.email,
                        clicks: affiliate.totalClicks,
                        conversions: affiliate.conversions
                    });
                }
            }
        }
    } catch (error) {
        console.error('❌ Error checking affiliate stats:', error);
    }
}

// 4. Run monitoring
async function runMonitoring() {
    console.log('🚀 Running Affiliate Conversion Monitoring...\n');
    
    await monitorRecentPayments();
    await checkAffiliateStats();
    
    console.log('\n✅ Monitoring completed!');
    
    // Schedule next check in 1 hour
    setTimeout(runMonitoring, 60 * 60 * 1000);
}

// Start monitoring
runMonitoring();

// Export for manual use
window.AffiliateMonitor = {
    monitorRecentPayments,
    autoFixConversion,
    checkAffiliateStats,
    runMonitoring
};

console.log('✅ Affiliate Monitor loaded. Use window.AffiliateMonitor.* to run functions manually.');
