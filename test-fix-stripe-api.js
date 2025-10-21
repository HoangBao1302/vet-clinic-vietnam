// Test script to fix missing Stripe order via API
const fetch = require('node-fetch');

async function fixMissingStripeOrder() {
  try {
    console.log('🔧 Fixing missing Stripe order via API...\n');

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/admin/fix-missing-stripe-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerEmail: 'haidangtong2612@gmail.com',
        customerName: 'Hai Tong',
        customerPhone: '0948617091'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Missing Stripe order fixed successfully!');
      
      console.log('\n📊 Results:');
      console.log(`   Total Orders: ${data.data.orders.length}`);
      console.log(`   Total Commission: ${data.data.totalCommission.toLocaleString('vi-VN')}đ`);
      
      console.log('\n📦 All Orders:');
      data.data.orders.forEach((order, index) => {
        console.log(`   ${index + 1}. ${order.productName}`);
        console.log(`      Order ID: ${order.orderId}`);
        console.log(`      Amount: ${order.amount.toLocaleString('vi-VN')}đ`);
        console.log(`      Payment Method: ${order.paymentMethod}`);
        console.log(`      Status: ${order.status}`);
        console.log(`      Created: ${new Date(order.createdAt).toLocaleString('vi-VN')}`);
        console.log('');
      });
      
      console.log('💰 Converted Affiliate Clicks:');
      data.data.convertedClicks.forEach((click, index) => {
        console.log(`   ${index + 1}. ${click.productName}`);
        console.log(`      Commission: ${click.commissionAmount.toLocaleString('vi-VN')}đ`);
        console.log(`      Order ID: ${click.orderId}`);
        console.log('');
      });
      
      console.log('🎯 Summary:');
      console.log(`   ✅ PayPal Order: ${data.data.orders.find(o => o.paymentMethod === 'paypal')?.productName || 'Not found'}`);
      console.log(`   ✅ Stripe Order: ${data.data.orders.find(o => o.paymentMethod === 'stripe')?.productName || 'Not found'}`);
      console.log(`   ✅ Total Commission: ${data.data.totalCommission.toLocaleString('vi-VN')}đ`);
      console.log(`   ✅ kietdangtong will see this commission in affiliate dashboard`);
      
    } else {
      const errorData = await response.json();
      console.log('❌ Failed to fix missing Stripe order:', errorData);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the fix
fixMissingStripeOrder();

