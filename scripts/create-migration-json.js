/**
 * Interactive script to create migration JSON file
 * Usage: node scripts/create-migration-json.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('═'.repeat(80));
  console.log('🔧 PayPal Orders Migration JSON Creator');
  console.log('═'.repeat(80));
  console.log('\nThis script will help you create a JSON file for migrating PayPal orders.');
  console.log('Please have the following information ready:');
  console.log('  - PayPal Transaction IDs');
  console.log('  - Customer emails');
  console.log('  - Transaction dates');
  console.log('  - Affiliate code\n');

  const orders = [];
  
  // Get affiliate code
  const affiliateCode = await question('Enter affiliate code (e.g., AFF-HOANGKIM-IBQ095): ');
  
  // Get number of orders
  const numOrdersStr = await question('How many orders to migrate? (1-10): ');
  const numOrders = Math.min(Math.max(parseInt(numOrdersStr) || 1, 1), 10);
  
  console.log(`\nOK! Creating JSON for ${numOrders} order(s)...\n`);
  
  for (let i = 0; i < numOrders; i++) {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`ORDER ${i + 1} of ${numOrders}`);
    console.log('─'.repeat(80));
    
    const orderId = await question(`  PayPal Order ID: `);
    
    const productIdInput = await question(`  Product (1=EA Full, 2=EA Pro, 3=Indicator, 4=Course, 5=Social Copy) [1]: `);
    const productMap = {
      '1': { id: 'ea-full', name: 'EA ThebenchmarkTrader Full Version', amount: 790000000 },
      '2': { id: 'ea-pro-source', name: 'EA Pro + Source Code', amount: 1400000000 },
      '3': { id: 'indicator-pro', name: 'Multi-Indicator Pro Pack', amount: 190000000 },
      '4': { id: 'course', name: 'Khóa học Forex Trading', amount: 500000000 },
      '5': { id: 'social-copy', name: 'Copy Social Trading', amount: 200000000 }
    };
    const product = productMap[productIdInput || '1'];
    
    const customerEmail = await question(`  Customer email: `);
    const customerName = await question(`  Customer name: `);
    
    const dateInput = await question(`  Date (YYYY-MM-DD) [today]: `);
    const date = dateInput || new Date().toISOString().split('T')[0];
    
    const timeInput = await question(`  Time (HH:MM) [14:30]: `);
    const time = timeInput || '14:30';
    
    const createdAt = `${date}T${time}:00+07:00`;
    const paidDate = new Date(`${date}T${time}:00+07:00`);
    paidDate.setMinutes(paidDate.getMinutes() + 5);
    const paidAt = paidDate.toISOString().replace('Z', '+07:00').slice(0, -10) + '+07:00';
    
    orders.push({
      orderId,
      productId: product.id,
      productName: product.name,
      amount: product.amount,
      customerEmail,
      customerName,
      customerPhone: '+84000000000',
      customId: `${product.id}|${affiliateCode}`,
      createdAt,
      paidAt,
      paymentMethod: 'paypal'
    });
    
    console.log(`\n  ✅ Order ${i + 1} added!`);
    console.log(`     Product: ${product.name}`);
    console.log(`     Amount: ${(product.amount / 100).toLocaleString('vi-VN')}đ`);
    console.log(`     Commission: ${Math.round(product.amount * 0.30 / 100).toLocaleString('vi-VN')}đ (30%)`);
  }
  
  // Summary
  console.log(`\n${'═'.repeat(80)}`);
  console.log('📊 SUMMARY');
  console.log('═'.repeat(80));
  console.log(`Total orders: ${orders.length}`);
  const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalCommission = Math.round(totalAmount * 0.30);
  console.log(`Total amount: ${(totalAmount / 100).toLocaleString('vi-VN')}đ`);
  console.log(`Total commission (30%): ${(totalCommission / 100).toLocaleString('vi-VN')}đ`);
  console.log(`Affiliate code: ${affiliateCode}`);
  
  // Save to file
  const outputFile = 'scripts/paypal-orders-hoangkim.json';
  const output = {
    _created: new Date().toISOString(),
    _affiliate: affiliateCode,
    _total_orders: orders.length,
    _total_amount: totalAmount,
    _total_commission: totalCommission,
    orders
  };
  
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf8');
  
  console.log(`\n✅ JSON file created: ${outputFile}`);
  console.log('\nNext steps:');
  console.log('1. Review the file to make sure all data is correct');
  console.log('2. Run dry-run migration:');
  console.log(`   node scripts/migrate-paypal-commissions.js --file=${outputFile}`);
  console.log('3. If looks good, apply:');
  console.log(`   node scripts/migrate-paypal-commissions.js --file=${outputFile} --apply`);
  
  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});

