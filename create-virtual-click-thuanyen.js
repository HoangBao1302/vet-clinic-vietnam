// Create virtual click for Pham Thi Thuan Yen's order
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function createVirtualClickForThuanyen() {
  try {
    console.log('🔧 CREATING VIRTUAL CLICK FOR THUANYEN ORDER');
    console.log('='.repeat(50));
    
    const baseUrl = 'https://thebenchmarktrader.com';
    
    // Order details for Pham Thi Thuan Yen
    const orderDetails = {
      orderId: '10U263026W384614C',
      customerEmail: 'phamthithuanyen93@gmail.com',
      customerName: 'Pham Thi Thuan Yen',
      customerPhone: '0765452514',
      productId: 'ea-full',
      productName: 'EA ThebenchmarkTrader Full Version',
      amount: 7900000,
      affiliateCode: 'AFF-KIET DANG TONG-15B161',
      paidAt: '2025-10-21T05:20:34.446+00:00'
    };
    
    console.log('📊 Order Details:');
    console.log(`   Order ID: ${orderDetails.orderId}`);
    console.log(`   Customer: ${orderDetails.customerName}`);
    console.log(`   Email: ${orderDetails.customerEmail}`);
    console.log(`   Product: ${orderDetails.productName}`);
    console.log(`   Amount: ${orderDetails.amount.toLocaleString('vi-VN')}đ`);
    console.log(`   Affiliate: ${orderDetails.affiliateCode}`);
    
    // Create virtual click
    console.log('\n🔧 Creating virtual click...');
    
    const virtualClickResponse = await fetch(`${baseUrl}/api/admin/create-virtual-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        affiliateCode: orderDetails.affiliateCode,
        orderId: orderDetails.orderId,
        customerEmail: orderDetails.customerEmail,
        customerName: orderDetails.customerName,
        customerPhone: orderDetails.customerPhone,
        productId: orderDetails.productId,
        productName: orderDetails.productName,
        amount: orderDetails.amount,
        clickedAt: new Date(orderDetails.paidAt).toISOString(),
        commissionAmount: Math.round(orderDetails.amount * 0.3), // 30% commission
        status: 'converted',
        trackingData: {
          method: 'virtual-click',
          reason: 'missing-correlation',
          createdBy: 'admin-fix'
        }
      })
    });
    
    if (virtualClickResponse.ok) {
      const result = await virtualClickResponse.json();
      console.log('✅ Virtual click created successfully!');
      console.log(`   Click ID: ${result.clickId}`);
      console.log(`   Commission: ${result.commissionAmount.toLocaleString('vi-VN')}đ`);
      console.log(`   Status: ${result.status}`);
    } else {
      const error = await virtualClickResponse.text();
      console.log(`❌ Failed to create virtual click: ${virtualClickResponse.status}`);
      console.log(`   Error: ${error}`);
    }
    
    // Verify the fix
    console.log('\n🔍 Verifying the fix...');
    
    const verifyResponse = await fetch(`${baseUrl}/api/admin/affiliates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (verifyResponse.ok) {
      const affiliatesData = await verifyResponse.json();
      const affiliates = affiliatesData.affiliates || [];
      const kietdangtong = affiliates.find(aff =>
        aff.username === 'kietdangtong' ||
        aff.email?.includes('kietdangtong') ||
        aff.affiliateCode?.includes('KIETDANGTONG')
      );
      
      if (kietdangtong) {
        console.log('✅ Updated affiliate stats:');
        console.log(`   Total Commission: ${(kietdangtong.stats?.totalCommission || 0).toLocaleString('vi-VN')}đ`);
        console.log(`   Total Conversions: ${kietdangtong.stats?.conversions || 0}`);
        console.log(`   Total Clicks: ${kietdangtong.stats?.totalClicks || 0}`);
        console.log(`   Conversion Rate: ${kietdangtong.stats?.conversionRate || 0}%`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the fix
createVirtualClickForThuanyen();
