// Enhanced affiliate monitoring system to detect and alert on non-converting clicks
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function monitorAffiliatePerformance() {
  try {
    console.log('🔍 Enhanced Affiliate Performance Monitoring...');
    
    const baseUrl = 'https://thebenchmarktrader.com';
    
    // 1. Get all affiliates with their performance
    const affiliatesResponse = await fetch(`${baseUrl}/api/admin/monitor-affiliates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!affiliatesResponse.ok) {
      throw new Error(`Failed to fetch affiliates: ${affiliatesResponse.status}`);
    }
    
    const affiliatesData = await affiliatesResponse.json();
    const affiliates = affiliatesData.affiliates || [];
    
    console.log(`📊 Monitoring ${affiliates.length} affiliates...`);
    
    // 2. Analyze each affiliate's performance
    const performanceReport = {
      excellent: [],      // >50% conversion rate
      good: [],          // 20-50% conversion rate  
      needsAttention: [], // 1-20% conversion rate
      problematic: [],    // 0% conversion rate with clicks
      newAffiliates: []   // No clicks yet
    };
    
    for (const affiliate of affiliates) {
      const conversionRate = parseFloat(affiliate.conversionRate.replace('%', ''));
      const totalClicks = affiliate.totalClicks;
      const conversions = affiliate.conversions;
      
      if (totalClicks === 0) {
        performanceReport.newAffiliates.push(affiliate);
      } else if (conversions === 0) {
        performanceReport.problematic.push(affiliate);
      } else if (conversionRate >= 50) {
        performanceReport.excellent.push(affiliate);
      } else if (conversionRate >= 20) {
        performanceReport.good.push(affiliate);
      } else {
        performanceReport.needsAttention.push(affiliate);
      }
    }
    
    // 3. Generate detailed report
    console.log('\n📈 AFFILIATE PERFORMANCE REPORT');
    console.log('='.repeat(50));
    
    console.log(`\n🟢 EXCELLENT PERFORMERS (${performanceReport.excellent.length}):`);
    performanceReport.excellent.forEach(aff => {
      console.log(`   ✅ ${aff.username} (${aff.email})`);
      console.log(`      Conversion Rate: ${aff.conversionRate}`);
      console.log(`      Total Commission: ${aff.totalCommission.toLocaleString('vi-VN')}đ`);
    });
    
    console.log(`\n🟡 GOOD PERFORMERS (${performanceReport.good.length}):`);
    performanceReport.good.forEach(aff => {
      console.log(`   👍 ${aff.username} (${aff.email})`);
      console.log(`      Conversion Rate: ${aff.conversionRate}`);
      console.log(`      Total Commission: ${aff.totalCommission.toLocaleString('vi-VN')}đ`);
    });
    
    console.log(`\n🟠 NEEDS ATTENTION (${performanceReport.needsAttention.length}):`);
    performanceReport.needsAttention.forEach(aff => {
      console.log(`   ⚠️ ${aff.username} (${aff.email})`);
      console.log(`      Conversion Rate: ${aff.conversionRate}`);
      console.log(`      Total Clicks: ${aff.totalClicks}, Conversions: ${aff.conversions}`);
      console.log(`      Total Commission: ${aff.totalCommission.toLocaleString('vi-VN')}đ`);
    });
    
    console.log(`\n🔴 PROBLEMATIC AFFILIATES (${performanceReport.problematic.length}):`);
    performanceReport.problematic.forEach(aff => {
      console.log(`   ❌ ${aff.username} (${aff.email})`);
      console.log(`      Conversion Rate: ${aff.conversionRate}`);
      console.log(`      Total Clicks: ${aff.totalClicks}, Conversions: ${aff.conversions}`);
      console.log(`      Total Commission: ${aff.totalCommission.toLocaleString('vi-VN')}đ`);
      console.log(`      Issue: Has clicks but no conversions`);
    });
    
    console.log(`\n🆕 NEW AFFILIATES (${performanceReport.newAffiliates.length}):`);
    performanceReport.newAffiliates.forEach(aff => {
      console.log(`   🆕 ${aff.username} (${aff.email})`);
      console.log(`      Status: No clicks yet`);
    });
    
    // 4. Generate recommendations
    console.log('\n💡 RECOMMENDATIONS');
    console.log('='.repeat(50));
    
    if (performanceReport.problematic.length > 0) {
      console.log('\n🔧 For Problematic Affiliates:');
      console.log('   1. Send personalized coaching emails');
      console.log('   2. Provide better marketing materials');
      console.log('   3. Offer conversion optimization tips');
      console.log('   4. Consider temporary bonus incentives');
    }
    
    if (performanceReport.needsAttention.length > 0) {
      console.log('\n📈 For Affiliates Needing Attention:');
      console.log('   1. Analyze their traffic sources');
      console.log('   2. Review their marketing approach');
      console.log('   3. Provide conversion rate optimization tips');
    }
    
    if (performanceReport.excellent.length > 0) {
      console.log('\n🌟 For Excellent Performers:');
      console.log('   1. Feature them as success stories');
      console.log('   2. Offer higher commission tiers');
      console.log('   3. Provide exclusive marketing tools');
    }
    
    // 5. Summary statistics
    console.log('\n📊 SUMMARY STATISTICS');
    console.log('='.repeat(50));
    console.log(`Total Affiliates: ${affiliates.length}`);
    console.log(`Excellent (50%+): ${performanceReport.excellent.length}`);
    console.log(`Good (20-50%): ${performanceReport.good.length}`);
    console.log(`Needs Attention (1-20%): ${performanceReport.needsAttention.length}`);
    console.log(`Problematic (0%): ${performanceReport.problematic.length}`);
    console.log(`New (0 clicks): ${performanceReport.newAffiliates.length}`);
    
    const totalClicks = affiliates.reduce((sum, aff) => sum + aff.totalClicks, 0);
    const totalConversions = affiliates.reduce((sum, aff) => sum + aff.conversions, 0);
    const overallConversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(2) : 0;
    
    console.log(`\nOverall Conversion Rate: ${overallConversionRate}%`);
    console.log(`Total Clicks: ${totalClicks}`);
    console.log(`Total Conversions: ${totalConversions}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the monitoring
monitorAffiliatePerformance();
