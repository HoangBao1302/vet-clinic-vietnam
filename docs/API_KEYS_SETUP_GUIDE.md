# API Keys Setup - Quick Guide
**Project**: ThebenchmarkTrader Automations  
**Date**: Sep 13, 2026

---

## 🔑 Required API Keys

### 1. NewsAPI.org (FREE - Required for Automation #5)

**Sign Up:**
```
URL: https://newsapi.org/register

Steps:
1. Enter email address
2. Create password
3. Use case: "Personal project"
4. Verify email
5. Copy API key from dashboard
```

**Free Tier:**
- 100 requests/day
- No credit card required
- Sufficient for automation (12 requests/day)

**Your API Key:**
```
Copy from: https://newsapi.org/account
Format: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 2. Alpha Vantage (FREE - Optional)

**Sign Up:**
```
URL: https://www.alphavantage.co/support/#api-key

Steps:
1. Enter email
2. Receive key instantly (no verification)
3. Copy API key
```

**Free Tier:**
- 25 requests/day
- 5 requests/minute
- No credit card required

**Your API Key:**
```
Format: XXXXXXXXXXXX (shorter than NewsAPI)
```

---

## 📝 Add Keys to Project

### Method 1: Local Development (.env.local)

**File:** `d:\CursorP\Thebenchmarktrader\.env.local`

```env
# Existing vars
MONGODB_URI=...
JWT_SECRET=...

# Add new API keys
NEWSAPI_KEY=your_newsapi_key_here
ALPHA_VANTAGE_KEY=your_alphavantage_key_here
```

---

### Method 2: Vercel Deployment

**Steps:**
```
1. Go to: https://vercel.com/dashboard
2. Select project: Thebenchmarktrader
3. Settings → Environment Variables
4. Add:
   - Name: NEWSAPI_KEY
   - Value: [paste your key]
   - Environment: Production, Preview, Development
   - Click "Save"

5. Repeat for ALPHA_VANTAGE_KEY
```

**Redeploy:**
```
After adding keys:
1. Vercel → Deployments
2. Latest deployment → "..." menu
3. Click "Redeploy"
```

---

## ✅ Test API Keys

### Test NewsAPI

**Using curl:**
```bash
curl "https://newsapi.org/v2/everything?q=forex&apiKey=YOUR_NEWSAPI_KEY&pageSize=5"
```

**Expected response:**
```json
{
  "status": "ok",
  "totalResults": 1234,
  "articles": [...]
}
```

**If error:**
- Status 401: Invalid API key
- Status 426: Need to upgrade (shouldn't happen on free tier)
- Status 429: Rate limit exceeded (100/day)

---

### Test Alpha Vantage

**Using curl:**
```bash
curl "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=forex&apiKey=YOUR_ALPHA_VANTAGE_KEY"
```

**Expected response:**
```json
{
  "items": "50",
  "sentiment_score_definition": "...",
  "relevance_score_definition": "...",
  "feed": [...]
}
```

**If error:**
- Error message in JSON: Invalid API key
- Empty feed: No news available (normal)
- Rate limit: Wait 1 minute

---

## 🔄 Update Automation #5

After adding keys, automation should work automatically. No code changes needed - automation will read from environment variables.

**Verify:**
```
1. Wait for next 2-hour interval
2. Check Slack #all-thebenchmarktrader
3. Should see: "📰 Forex News Update - [Time]"
```

**If not working:**
- Check Vercel logs for errors
- Verify env vars are deployed
- Test APIs manually
- Check automation is "Active"

---

## 💰 Cost & Limits

### NewsAPI Free Tier

**Limits:**
- 100 requests/day
- Developer plan (free forever)

**Current Usage:**
- Automation runs every 2 hours = 12 times/day
- Well under limit (88 requests unused)

**Monitoring:**
```
Check: https://newsapi.org/account
→ View usage statistics
→ Should see ~12 requests/day
```

---

### Alpha Vantage Free Tier

**Limits:**
- 25 API calls/day
- 5 API calls/minute

**Current Usage:**
- Optional supplement to NewsAPI
- Only called if NewsAPI fails or as backup

**Monitoring:**
```
No dashboard available
Track manually in logs
Limit is generous for our use case
```

---

## 🔒 Security Best Practices

### DO:
✅ Store keys in environment variables  
✅ Use .env.local for local development  
✅ Add .env.local to .gitignore  
✅ Use Vercel env vars for production  
✅ Rotate keys if compromised  

### DON'T:
❌ Commit keys to Git  
❌ Hardcode in source code  
❌ Share keys publicly  
❌ Use same key for multiple projects  
❌ Post keys in Slack/Discord  

---

## 📋 Checklist

Before proceeding:
- [ ] Signed up for NewsAPI.org
- [ ] Got NewsAPI key
- [ ] (Optional) Signed up for Alpha Vantage
- [ ] (Optional) Got Alpha Vantage key
- [ ] Added keys to .env.local
- [ ] Added keys to Vercel environment variables
- [ ] Redeployed on Vercel
- [ ] Tested APIs with curl
- [ ] Verified automation #5 is active
- [ ] Waiting for next 2-hour interval to test

---

## 🆘 Troubleshooting

### "Invalid API key" error

**Cause:** Key copied incorrectly or expired

**Fix:**
1. Go to API provider dashboard
2. Regenerate key
3. Copy new key carefully (no spaces)
4. Update in .env.local and Vercel
5. Redeploy

---

### "Rate limit exceeded" error

**NewsAPI (100/day):**
- Check for duplicate automations
- Verify automation schedule
- Wait 24 hours for reset

**Alpha Vantage (25/day):**
- Make it optional
- Or disable if not needed
- Wait 24 hours for reset

---

### Automation runs but no news

**Possible causes:**
1. API keys not in environment
2. No news matching query
3. API temporarily down

**Fix:**
1. Check Vercel logs
2. Test API manually
3. Verify keys deployed
4. Check API status pages

---

## 🎯 Next Steps

After setup:
1. ✅ Wait for next automation run (every 2 hours)
2. ✅ Check Slack for news updates
3. ✅ Monitor for first 24 hours
4. ✅ Adjust frequency if needed
5. ✅ Consider adding Alpha Vantage as backup

---

**Status:** Ready for API keys setup  
**Last Updated:** Sep 13, 2026, 1:49 PM (UTC+7)
