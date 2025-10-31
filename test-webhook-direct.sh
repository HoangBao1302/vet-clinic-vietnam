#!/bin/bash

# Test if webhook is using new code

echo "🧪 Testing webhook endpoint directly..."
echo ""

# Test PayPal webhook with mock data
curl -X POST https://thebenchmarktrader.com/api/webhooks/paypal \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "CHECKOUT.ORDER.APPROVED",
    "resource": {
      "id": "TEST123",
      "payer": {
        "email_address": "test@example.com",
        "name": {"given_name": "Test", "surname": "User"}
      },
      "purchase_units": [{
        "custom_id": "ea-full-mt4|",
        "reference_id": "ea-full-mt4",
        "amount": {"value": "329.17"},
        "description": "EA Full Version MT4"
      }]
    }
  }'

echo ""
echo ""
echo "✅ Check Vercel logs now!"
echo "If you see '🔍 PayPal Webhook ProductID Detection' = NEW CODE ✅"
echo "If you don't see it = OLD CODE still cached ❌"



