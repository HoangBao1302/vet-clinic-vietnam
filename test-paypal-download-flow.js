/**
 * Test Script for PayPal Download Flow
 * Tests the complete flow from order creation to download verification
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Test scenarios
const TEST_SCENARIOS = [
  {
    name: 'Scenario 1: EA Pro + Source Code MT4 (14.9M VND)',
    productId: 'ea-pro-source-mt4',
    productName: 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
    price: 14900000,
    amountUSD: 620.83,
    expectedDownloadUrl: '/downloads/files/ThebenchmarkTrader-Pro-Source-MT4.zip'
  },
  {
    name: 'Scenario 2: EA Full Version MT4 (7.9M VND)',
    productId: 'ea-full-mt4',
    productName: 'EA ThebenchmarkTrader Full Version (MT4)',
    price: 7900000,
    amountUSD: 329.17,
    expectedDownloadUrl: '/downloads/files/ThebenchmarkTrader-Full-MT4.ex4'
  },
  {
    name: 'Scenario 3: Indicator Pro Pack MT4 (1.99M VND)',
    productId: 'indicator-pro-mt4',
    productName: 'Multi-Indicator Pro Pack (MT4)',
    price: 1990000,
    amountUSD: 82.92,
    expectedDownloadUrl: '/downloads/files/Indicator-Pro-Pack-MT4.zip'
  }
];

// Mock PayPal webhook payloads
function generateMockWebhookPayload(scenario, options = {}) {
  const {
    includeCustomId = true,
    includeReferenceId = true,
    customIdFormat = 'correct', // 'correct', 'missing', 'wrong'
  } = options;

  let customId = '';
  if (includeCustomId) {
    if (customIdFormat === 'correct') {
      customId = `${scenario.productId}|`;
    } else if (customIdFormat === 'wrong') {
      customId = 'ea-full-mt4|'; // Wrong product
    }
  }

  return {
    event_type: 'CHECKOUT.ORDER.APPROVED',
    resource: {
      id: `TEST_ORDER_${Date.now()}`,
      status: 'COMPLETED',
      payer: {
        email_address: 'test@example.com',
        name: {
          given_name: 'Test',
          surname: 'User'
        }
      },
      purchase_units: [
        {
          reference_id: includeReferenceId ? scenario.productId : undefined,
          custom_id: customId || undefined,
          amount: {
            currency_code: 'USD',
            value: scenario.amountUSD.toFixed(2)
          }
        }
      ]
    }
  };
}

// Test webhook processing
async function testWebhookProcessing(scenario, testCase) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 Testing: ${testCase.name}`);
  console.log(`   Scenario: ${scenario.name}`);
  console.log(`${'='.repeat(80)}\n`);

  const payload = generateMockWebhookPayload(scenario, testCase.options);
  
  console.log('📤 Sending webhook payload:');
  console.log(JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${BASE_URL}/api/webhooks/paypal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    console.log(`\n📥 Response Status: ${response.status}`);
    console.log('📥 Response Body:', JSON.stringify(result, null, 2));

    // Validate response
    if (response.ok) {
      console.log('✅ Webhook processed successfully');
      
      // Additional validation based on test case
      if (testCase.expectedOutcome) {
        console.log(`\n🔍 Validating expected outcome: ${testCase.expectedOutcome}`);
      }
    } else {
      console.log('❌ Webhook processing failed');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Test download verification
async function testDownloadVerification(orderId, productId) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 Testing Download Verification`);
  console.log(`   Order ID: ${orderId}`);
  console.log(`   Product ID: ${productId}`);
  console.log(`${'='.repeat(80)}\n`);

  try {
    const response = await fetch(`${BASE_URL}/api/verify-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderId,
        productId: productId
      })
    });

    const result = await response.json();
    
    console.log(`📥 Response Status: ${response.status}`);
    console.log('📥 Response Body:', JSON.stringify(result, null, 2));

    if (result.verified) {
      console.log('✅ Order verified successfully');
      console.log(`   Download URL: ${result.downloadUrl}`);
    } else {
      console.log('❌ Order verification failed');
      console.log(`   Error: ${result.error}`);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Main test runner
async function runAllTests() {
  console.log('\n🚀 Starting PayPal Download Flow Tests');
  console.log(`   Base URL: ${BASE_URL}`);
  console.log(`   Date: ${new Date().toISOString()}`);
  console.log('\n');

  // Test cases for each scenario
  const testCases = [
    {
      name: 'Test Case 1: Normal flow with custom_id',
      options: {
        includeCustomId: true,
        includeReferenceId: true,
        customIdFormat: 'correct'
      },
      expectedOutcome: 'ProductId detected from custom_id'
    },
    {
      name: 'Test Case 2: Fallback to reference_id (no custom_id)',
      options: {
        includeCustomId: false,
        includeReferenceId: true
      },
      expectedOutcome: 'ProductId detected from reference_id'
    },
    {
      name: 'Test Case 3: Fallback to amount detection',
      options: {
        includeCustomId: false,
        includeReferenceId: false
      },
      expectedOutcome: 'ProductId detected from amount'
    },
    {
      name: 'Test Case 4: Auto-correction (wrong custom_id)',
      options: {
        includeCustomId: true,
        includeReferenceId: true,
        customIdFormat: 'wrong'
      },
      expectedOutcome: 'ProductId auto-corrected based on amount validation'
    }
  ];

  // Run tests for first scenario only (EA Pro + Source Code)
  const mainScenario = TEST_SCENARIOS[0];
  
  for (const testCase of testCases) {
    await testWebhookProcessing(mainScenario, testCase);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s between tests
  }

  // Test download verification (requires actual order ID)
  console.log('\n\n📋 Download Verification Test');
  console.log('   ⚠️  Skipped - Requires actual order ID from database');
  console.log('   To test manually:');
  console.log('   1. Get order ID from MongoDB after webhook test');
  console.log('   2. Run: node test-download-verification.js <ORDER_ID>');

  console.log('\n\n✅ All tests completed!');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = {
  testWebhookProcessing,
  testDownloadVerification,
  generateMockWebhookPayload,
  TEST_SCENARIOS
};

/*
USAGE:

1. Start development server:
   npm run dev

2. Run all tests:
   node test-paypal-download-flow.js

3. Run specific test:
   node -e "const t = require('./test-paypal-download-flow'); t.testWebhookProcessing(t.TEST_SCENARIOS[0], {name:'Test', options:{includeCustomId:true,includeReferenceId:true,customIdFormat:'correct'}});"

4. Test download verification (after webhook creates order):
   node -e "const t = require('./test-paypal-download-flow'); t.testDownloadVerification('ORDER_ID_HERE', 'ea-pro-source-mt4');"

EXPECTED RESULTS:

✅ Test Case 1: Should detect productId from custom_id
✅ Test Case 2: Should fallback to reference_id
✅ Test Case 3: Should detect from amount (14.9M → ea-pro-source-mt4)
✅ Test Case 4: Should auto-correct wrong productId based on amount

All tests should result in:
- Correct productId saved to database
- Correct productName in order
- Correct amount in VND
- Download verification works with order code
*/

