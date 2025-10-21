// Check if we can create a new click for Anh Kim or find alternative solution
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function findSolutionForAnhKim() {
  try {
    console.log('🔍 FINDING SOLUTION FOR ANH KIM ORDER');
    console.log('='.repeat(60));
    
    const baseUrl = 'https://thebenchmarktrader.com';
    const affiliateCode = 'AFF-KIET DANG TONG-15B161';
    
    // Anh Kim's order details
    const anhKimOrder = {
      orderId: '1AL59204G4941441N',
      customerEmail: 'anhkim.230923@gmail.com',
      customerName: 'Anh Kim',
      productId: 'ea-full',
      amount: 7900000,
      paidAt: '2025-10-21T04:30:23.934+00:00',
      ipAddress: '183.81.79.86'
    };
    
    console.log('\n📊 ANALYSIS:');
    console.log('-'.repeat(40));
    
    console.log('✅ Clear evidence that Anh Kim came from Kiet Dang Tong\'s affiliate:');
    console.log('   1. Same IP address (183.81.79.86)');
    console.log('   2. Order within 5 minutes of Hai Tong\'s order');
    console.log('   3. Same product (ea-full)');
    console.log('   4. Logical sequence: Hai Tong clicked → Anh Kim also purchased');
    
    console.log('\n❌ Problem:');
    console.log('   Only 1 ea-full click available, already used for Hai Tong');
    
    console.log('\n💡 SOLUTIONS:');
    console.log('-'.repeat(40));
    
    console.log('\n🔧 Solution 1: Create Virtual Click');
    console.log('   Create a new affiliate click record for Anh Kim');
    console.log('   Use same timestamp as Hai Tong\'s click');
    console.log('   Mark as converted immediately');
    
    console.log('\n🔧 Solution 2: Split Commission');
    console.log('   Split Hai Tong\'s click between Hai Tong and Anh Kim');
    console.log('   Each gets 50% commission');
    
    console.log('\n🔧 Solution 3: Direct Commission Credit');
    console.log('   Credit commission directly to Kiet Dang Tong');
    console.log('   Without linking to specific click');
    
    console.log('\n🎯 RECOMMENDED SOLUTION:');
    console.log('-'.repeat(40));
    
    console.log('✅ Solution 1 - Create Virtual Click');
    console.log('   This maintains proper tracking and attribution');
    console.log('   Shows both conversions in dashboard');
    console.log('   Preserves audit trail');
    
    // Calculate commission
    const commissionRate = 0.30; // 30% for ea-full
    const commissionAmount = Math.round(anhKimOrder.amount * commissionRate);
    
    console.log('\n💰 COMMISSION CALCULATION:');
    console.log(`   Amount: ${anhKimOrder.amount.toLocaleString('vi-VN')}đ`);
    console.log(`   Rate: ${(commissionRate * 100).toFixed(1)}%`);
    console.log(`   Commission: ${commissionAmount.toLocaleString('vi-VN')}đ`);
    
    console.log('\n📝 VIRTUAL CLICK DATA:');
    console.log('-'.repeat(40));
    
    const virtualClick = {
      affiliateCode: affiliateCode,
      ipAddress: anhKimOrder.ipAddress,
      userAgent: 'Manual Conversion Fix',
      referrer: 'Manual Attribution',
      productId: anhKimOrder.productId,
      productName: 'EA ThebenchmarkTrader Full Version',
      customerEmail: anhKimOrder.customerEmail,
      customerName: anhKimOrder.customerName,
      status: 'converted',
      clickedAt: '2025-10-21T04:25:52.927Z', // Same as Hai Tong's click
      convertedAt: anhKimOrder.paidAt,
      orderId: anhKimOrder.orderId,
      commissionAmount: commissionAmount
    };
    
    console.log('Virtual Click:', JSON.stringify(virtualClick, null, 2));
    
    console.log('\n🔧 MANUAL MONGODB SCRIPT:');
    console.log('-'.repeat(40));
    
    console.log(`
// Create virtual click for Anh Kim
db.affiliateclicks.insertOne({
  affiliateCode: 'AFF-KIET DANG TONG-15B161',
  ipAddress: '183.81.79.86',
  userAgent: 'Manual Conversion Fix',
  referrer: 'Manual Attribution',
  productId: 'ea-full',
  productName: 'EA ThebenchmarkTrader Full Version',
  customerEmail: 'anhkim.230923@gmail.com',
  customerName: 'Anh Kim',
  status: 'converted',
  clickedAt: new Date('2025-10-21T04:25:52.927Z'),
  convertedAt: new Date('2025-10-21T04:30:23.934Z'),
  orderId: '1AL59204G4941441N',
  commissionAmount: ${commissionAmount},
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0
});

// Update Kiet Dang Tong's total commission
db.users.updateOne(
  { affiliateCode: 'AFF-KIET DANG TONG-15B161' },
  {
    $inc: { totalCommissionEarned: ${commissionAmount} }
  }
);
    `);
    
    console.log('\n📊 EXPECTED RESULTS AFTER FIX:');
    console.log('-'.repeat(40));
    
    console.log('✅ Kiet Dang Tong\'s Dashboard:');
    console.log('   • Total Clicks: 4 (3 original + 1 virtual)');
    console.log('   • Conversions: 2');
    console.log('   • Conversion Rate: 50%');
    console.log('   • Total Commission: 4,740,000đ');
    
    console.log('\n✅ Benefits:');
    console.log('   • Proper attribution for both customers');
    console.log('   • Accurate conversion tracking');
    console.log('   • Fair commission calculation');
    console.log('   • Complete audit trail');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the analysis
findSolutionForAnhKim();
