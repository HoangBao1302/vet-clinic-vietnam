// Script to fix affiliate commission for kietdangtong using API endpoints
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function fixAffiliateCommission() {
  try {
    console.log('🔍 Starting affiliate commission fix for Kiet Dang Tong...');
    
    const baseUrl = 'https://thebenchmarktrader.com'; // Production URL
    
    // 1. Check current affiliate data
    console.log('\n📊 Checking current affiliate data...');
    
    const affiliateResponse = await fetch(`${baseUrl}/api/admin/affiliates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!affiliateResponse.ok) {
      throw new Error(`Failed to fetch affiliates: ${affiliateResponse.status}`);
    }
    
    const affiliatesData = await affiliateResponse.json();
    const affiliates = affiliatesData.affiliates || [];
    console.log(`✅ Found ${affiliates.length} affiliates`);
    
    // Find kietdangtong
    const kietdangtong = affiliates.find(aff => 
      aff.username === 'kietdangtong' || 
      aff.email?.includes('kietdangtong') ||
      aff.affiliateCode?.includes('KIETDANGTONG')
    );
    
    if (!kietdangtong) {
      console.log('❌ kietdangtong affiliate not found');
      return;
    }
    
    console.log('✅ kietdangtong found:', {
      username: kietdangtong.username,
      email: kietdangtong.email,
      affiliateCode: kietdangtong.affiliateCode,
      affiliateStatus: kietdangtong.affiliateStatus,
      totalCommissionEarned: kietdangtong.stats?.totalCommission || 0,
      totalClicks: kietdangtong.stats?.totalClicks || 0,
      totalConversions: kietdangtong.stats?.conversions || 0
    });
    
    // 2. Check affiliate clicks
    console.log('\n📊 Checking affiliate clicks...');
    
    const clicksResponse = await fetch(`${baseUrl}/api/affiliate/track?affiliateCode=${encodeURIComponent(kietdangtong.affiliateCode)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!clicksResponse.ok) {
      throw new Error(`Failed to fetch clicks: ${clicksResponse.status}`);
    }
    
    const clicksData = await clicksResponse.json();
    const kietdangtongClicks = clicksData.clicks || [];
    
    console.log(`📈 Found ${kietdangtongClicks.length} clicks for kietdangtong`);
    console.log('📊 Click stats:', clicksData.stats);
    
    // Check for clicks with 0 commission
    const zeroCommissionClicks = kietdangtongClicks.filter(click => 
      click.commissionAmount === 0 && click.status === 'clicked'
    );
    
    console.log(`⚠️ Found ${zeroCommissionClicks.length} clicks with 0 commission`);
    
    if (zeroCommissionClicks.length > 0) {
      console.log('\n🔧 Attempting to fix commission calculation...');
      
      // Try to fix missing stripe order
      const fixResponse = await fetch(`${baseUrl}/api/admin/fix-missing-stripe-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          affiliateCode: kietdangtong.affiliateCode
        })
      });
      
      if (fixResponse.ok) {
        const fixResult = await fixResponse.json();
        console.log('✅ Fix attempt completed:', fixResult);
      } else {
        console.log('❌ Fix attempt failed:', await fixResponse.text());
      }
    }
    
    // 3. Verify the fix
    console.log('\n🔍 Verifying the fix...');
    
    const verifyResponse = await fetch(`${baseUrl}/api/admin/affiliates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (verifyResponse.ok) {
      const updatedAffiliatesData = await verifyResponse.json();
      const updatedAffiliates = updatedAffiliatesData.affiliates || [];
      const updatedKietdangtong = updatedAffiliates.find(aff => 
        aff.username === 'kietdangtong' || 
        aff.email?.includes('kietdangtong') ||
        aff.affiliateCode?.includes('KIETDANGTONG')
      );
      
      if (updatedKietdangtong) {
        console.log('✅ Final verification:');
        console.log(`   Total Commission Earned: ${(updatedKietdangtong.stats?.totalCommission || 0).toLocaleString('vi-VN')}đ`);
        console.log(`   Total Conversions: ${updatedKietdangtong.stats?.conversions || 0}`);
        console.log(`   Total Clicks: ${updatedKietdangtong.stats?.totalClicks || 0}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the fix
fixAffiliateCommission();
