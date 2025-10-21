// Test the new affiliate alert system
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAffiliateAlerts() {
  try {
    console.log('🔍 Testing Affiliate Alert System...');
    
    const baseUrl = 'https://thebenchmarktrader.com';
    
    // Test the new alert endpoint
    const alertsResponse = await fetch(`${baseUrl}/api/admin/affiliate-alerts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!alertsResponse.ok) {
      throw new Error(`Failed to fetch alerts: ${alertsResponse.status}`);
    }
    
    const alertsData = await alertsResponse.json();
    
    console.log('\n📊 AFFILIATE ALERT SYSTEM RESULTS');
    console.log('='.repeat(60));
    
    // Summary
    console.log('\n📈 SUMMARY:');
    console.log(`   Total Affiliates: ${alertsData.summary.totalAffiliates}`);
    console.log(`   Problematic Affiliates: ${alertsData.summary.problematicAffiliates}`);
    console.log(`   Alerts Generated: ${alertsData.summary.alertsGenerated}`);
    console.log(`   High Priority: ${alertsData.summary.highPriority}`);
    console.log(`   Medium Priority: ${alertsData.summary.mediumPriority}`);
    console.log(`   Low Priority: ${alertsData.summary.lowPriority}`);
    
    // Alerts
    if (alertsData.alerts.length > 0) {
      console.log('\n🚨 ACTIVE ALERTS:');
      console.log('-'.repeat(60));
      
      alertsData.alerts.forEach((alert, index) => {
        const priorityIcon = alert.priority === 'high' ? '🔴' : 
                           alert.priority === 'medium' ? '🟡' : '🟢';
        
        console.log(`\n${priorityIcon} Alert ${index + 1}: ${alert.affiliate.username}`);
        console.log(`   Email: ${alert.affiliate.email}`);
        console.log(`   Affiliate Code: ${alert.affiliate.affiliateCode}`);
        console.log(`   Days Since Created: ${alert.affiliate.daysSinceCreated}`);
        console.log(`   Priority: ${alert.priority.toUpperCase()}`);
        
        console.log(`\n   📊 Stats:`);
        console.log(`      Total Clicks: ${alert.stats.totalClicks}`);
        console.log(`      Conversions: ${alert.stats.conversions}`);
        console.log(`      Conversion Rate: ${alert.stats.conversionRate}%`);
        console.log(`      Total Commission: ${alert.stats.totalCommission.toLocaleString('vi-VN')}đ`);
        console.log(`      User Commission Earned: ${alert.stats.userCommissionEarned.toLocaleString('vi-VN')}đ`);
        
        console.log(`\n   ⚠️ Issues:`);
        alert.issues.forEach((issue, issueIndex) => {
          const severityIcon = issue.severity === 'high' ? '🔴' : 
                              issue.severity === 'medium' ? '🟡' : '🟢';
          console.log(`      ${severityIcon} ${issueIndex + 1}. ${issue.message}`);
          console.log(`         Recommendation: ${issue.recommendation}`);
        });
      });
    } else {
      console.log('\n✅ No alerts generated - all affiliates performing well!');
    }
    
    // Recommendations
    if (alertsData.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      console.log('-'.repeat(60));
      
      alertsData.recommendations.forEach((rec, index) => {
        const typeIcon = rec.type === 'urgent' ? '🚨' : 
                        rec.type === 'training' ? '📚' : '💪';
        
        console.log(`\n${typeIcon} ${index + 1}. ${rec.message}`);
        console.log(`   Action: ${rec.action}`);
      });
    }
    
    // Specific analysis for Kiet Dang Tong
    const kietdangtongAlert = alertsData.alerts.find(alert => 
      alert.affiliate.username === 'kiet dang tong' ||
      alert.affiliate.email.includes('kietdangtong')
    );
    
    if (kietdangtongAlert) {
      console.log('\n🎯 KIET DANG TONG SPECIFIC ANALYSIS:');
      console.log('='.repeat(60));
      console.log(`   Status: ${kietdangtongAlert.priority.toUpperCase()} PRIORITY`);
      console.log(`   Issue: ${kietdangtongAlert.issues[0].message}`);
      console.log(`   Recommendation: ${kietdangtongAlert.issues[0].recommendation}`);
      
      console.log('\n   📋 Action Plan:');
      console.log('   1. Send personalized coaching email');
      console.log('   2. Provide conversion optimization tips');
      console.log('   3. Share successful affiliate case studies');
      console.log('   4. Offer 1-on-1 consultation call');
      console.log('   5. Consider temporary bonus incentive');
    } else {
      console.log('\n✅ Kiet Dang Tong not flagged - no immediate action needed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testAffiliateAlerts();
