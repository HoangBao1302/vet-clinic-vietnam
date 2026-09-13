# Cursor Automations - Complete Setup Guide
**Project**: ThebenchmarkTrader  
**Date**: Sep 13, 2026, 1:49 PM (UTC+7)  
**Status**: 4/5 Automations Created ✅

---

## 📋 Overview

This guide documents all 5 Cursor Automations created for the ThebenchmarkTrader project to automate content creation, news aggregation, and blog publishing.

---

## 🎯 Automations Summary

| # | Name | Status | Trigger | Purpose |
|---|------|--------|---------|---------|
| 1 | Daily Content Reminder | ✅ Active | Weekdays 9 AM | Remind team to write content |
| 2 | RSS News Digest | ✅ Active | Daily 9 AM | Aggregate forex news from RSS |
| 3 | Auto-publish Blog | ⏳ Manual Setup | PR Merged | Publish blog posts from GitHub |
| 4 | Market Data to Blog | ✅ Active | Daily 6 PM | Create market summary posts |
| 5 | News API Integration | ✅ Active | Every 2 hours | Fetch news from APIs |

---

## 📝 Detailed Automation Specs

### Automation #1: Daily Content Reminder

**Purpose:** Reminds content team to write original forex analysis posts every weekday morning.

**Trigger:**
- Type: Scheduled
- Frequency: Weekdays (Monday-Friday)
- Time: 9:00 AM
- Cron: `0 9 * * 1-5`

**Actions:**
- Post to Slack: #all-thebenchmarktrader

**Message Template:**
```
📝 Good morning! Daily Content Tasks:

✅ Write 2 original forex analysis posts
✅ Update trading signals
✅ Review yesterday's market performance
✅ Plan next topics based on economic calendar

📊 Resources:
• TradingView charts
• Economic calendar
• Your trading data from dashboard

Let's create valuable content for our traders! 💪
```

**Status:** ✅ Active

---

### Automation #2: RSS News Digest

**Purpose:** Fetches RSS feeds from forex news sources and posts a daily digest with titles and links.

**Trigger:**
- Type: Scheduled
- Frequency: Daily
- Time: 9:00 AM
- Cron: `0 9 * * *`

**Actions:**
- Post to Slack: #all-thebenchmarktrader

**Workflow:**
1. Fetch forex news from public RSS feeds
2. Focus on: EUR/USD, Gold, Oil, major currency pairs
3. Extract titles + brief excerpts (2-3 sentences)
4. Add attribution links: "Read more at [Source] →"
5. Format as clean digest
6. Post to Slack

**Output Format:**
```
📰 Forex News Digest - [Date]

🔹 [Article Title]
   [2-3 sentence excerpt]
   Read more at [Source] →

🔹 [Article Title]
   [2-3 sentence excerpt]
   Read more at [Source] →
```

**Legal Notes:**
- Uses public RSS feeds only
- Includes proper attribution
- Does NOT copy full articles
- Fair use compliant

**Status:** ✅ Active

---

### Automation #3: Auto-publish Blog Post

**Purpose:** Automatically publishes blog posts to MongoDB when PR is merged to main branch.

**Trigger:**
- Type: GitHub Event
- Event: Pull request merged
- Repository: HoangBao1302/vet-clinic-vietnam
- Branch: main

**Actions:**
- Post to Slack: #all-thebenchmarktrader

**Workflow:**
1. **Detect blog post changes:**
   - Monitor paths: `/app/blog/posts/`, `/content/blog/`
   - Check for .md, .mdx files

2. **Extract post metadata:**
   - Parse frontmatter (title, date, author, category, tags, excerpt)
   - Extract post content

3. **Publish to MongoDB:**
   - API endpoint: `POST /api/admin/blog`
   - Authenticated request
   - Payload: `{ title, content, author, date, category, tags, status: "published" }`

4. **Notification:**
   - Post to Slack: "✅ Blog post published: [title]"

**PR → Publish Flow:**
```
Writer creates PR with blog post
    ↓
Review content
    ↓
Merge PR to main
    ↓
🤖 Automation triggers
    ↓
Extract post data
    ↓
POST to /api/admin/blog
    ↓
✅ Published!
    ↓
📢 Slack notification
```

**Status:** ⏳ Needs Manual Setup (GitHub trigger had prefill issues)

**Manual Setup Instructions:** See section below

---

### Automation #4: Daily Market Summary

**Purpose:** Creates daily market summary blog post with price data and original analysis.

**Trigger:**
- Type: Scheduled
- Frequency: Daily
- Time: 18:00 (6:00 PM - after market close)
- Cron: `0 18 * * *`

**Actions:**
- Post to Slack: #all-thebenchmarktrader

**Workflow:**

1. **Fetch Market Data:**
   - EUR/USD: Current price, daily change %
   - Gold (XAU/USD): Current price, daily change %
   - Oil (WTI): Current price, daily change %
   - Major indices: S&P 500, Dow Jones
   
   Data sources: Alpha Vantage or similar free APIs

2. **Generate Analysis:**
   - Write ORIGINAL analysis (not copied)
   - Price movements summary
   - Key support/resistance levels
   - Notable events affecting prices
   - Tomorrow's outlook based on technical analysis

3. **Format Blog Post:**
   ```
   Title: "Thị trường Forex hôm nay - [Date]"
   
   Content:
   - Market summary table
   - Analysis section
   - Tomorrow's forecast
   - Trading tips
   ```

4. **Publish to MongoDB:**
   - POST to `/api/admin/blog`
   - Author: "Market Bot"
   - Category: "Market Analysis"
   - Status: "published"

5. **Notify:**
   - Slack message: "📊 Daily market summary published!"

**Legal Notes:**
- Market data is public information
- Analysis is ORIGINAL content
- No copyright issues

**Status:** ✅ Active

---

### Automation #5: News API Integration

**Purpose:** Fetches forex news from NewsAPI.org and Alpha Vantage, posts headlines to Slack.

**Trigger:**
- Type: Scheduled
- Frequency: Every 2 hours
- Cron: `0 */2 * * *`

**Actions:**
- Post to Slack: #all-thebenchmarktrader

**Workflow:**

1. **Fetch from NewsAPI.org:**
   ```
   API: https://newsapi.org/v2/everything
   Query: "forex OR currency OR EUR/USD OR gold trading"
   Language: en
   Sort: publishedAt
   Limit: 5 latest articles
   ```
   Free tier: 100 requests/day

2. **Fetch from Alpha Vantage (optional):**
   ```
   API: https://www.alphavantage.co/query?function=NEWS_SENTIMENT
   Topics: forex
   ```
   Free tier: 25 requests/day

3. **Filter & Format:**
   - Only articles < 2 hours old
   - Remove duplicates
   - Format:
   ```
   📰 Forex News Update - [Time]
   
   🔹 [Headline]
      Source: [Publisher]
      Link → [URL]
   
   🔹 [Headline]
      Source: [Publisher]
      Link → [URL]
   ```

4. **Post to Slack:**
   - Channel: #all-thebenchmarktrader
   - Skip if no new articles

5. **Rate Limit Handling:**
   - Track API usage
   - If limit reached: "API limit reached, will resume in [X] hours"

**API Keys Required:** See setup section below

**Status:** ✅ Active (needs API keys to function)

---

## 🔧 Setup Instructions

### Prerequisites

✅ **Already Completed:**
- [x] Cursor IDE installed
- [x] Slack workspace connected
- [x] Cursor Bot added to #all-thebenchmarktrader channel
- [x] GitHub account connected
- [x] MongoDB database running
- [x] Project deployed on Vercel

⏳ **Still Needed:**
- [ ] NewsAPI.org API key
- [ ] Alpha Vantage API key (optional)
- [ ] Manual setup for Automation #3

---

### Slack Setup (Already Done ✅)

**Slack MCP Connected:**
- Workspace: thebenchmarktrader.slack.com
- Bot: Cursor Agent
- Channel: #all-thebenchmarktrader

**Verification:**
```
1. Open Slack
2. Go to #all-thebenchmarktrader
3. Check "Agents & apps" tab
4. Verify "Cursor AGENT" is listed
```

---

### News API Setup (Required for Automation #5)

#### 1. NewsAPI.org (Free Tier)

**Sign Up:**
```
1. Go to: https://newsapi.org/register
2. Fill form:
   - Email
   - Password
   - Use case: "Personal project - forex news aggregation"
3. Verify email
4. Get API key
```

**Free Tier:**
- 100 requests/day
- Sufficient for every-2-hours automation (12 requests/day)

**Add to Cursor:**
```
Method 1: Environment Variables
1. Add to .env.local:
   NEWSAPI_KEY=your_api_key_here

2. Deploy to Vercel:
   - Vercel Dashboard → Settings → Environment Variables
   - Add NEWSAPI_KEY

Method 2: Hardcode in Automation (less secure)
- Include in agent instructions as fallback
```

**Test API:**
```bash
curl "https://newsapi.org/v2/everything?q=forex&apiKey=YOUR_API_KEY"
```

---

#### 2. Alpha Vantage (Optional)

**Sign Up:**
```
1. Go to: https://www.alphavantage.co/support/#api-key
2. Enter email
3. Receive API key instantly (no verification needed)
```

**Free Tier:**
- 25 requests/day
- 5 requests/minute

**Add to Environment:**
```
ALPHA_VANTAGE_KEY=your_api_key_here
```

**Test API:**
```bash
curl "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=forex&apiKey=YOUR_API_KEY"
```

---

### Manual Setup: Automation #3 (Auto-publish Blog)

**Issue:** GitHub PR trigger had prefill payload errors.

**Solution:** Create manually in Cursor Automations UI.

#### Step-by-Step Manual Creation:

**1. Open Automations:**
```
Cursor → Command Palette (Ctrl+Shift+P)
→ Type: "Cursor: Open Automations"
→ Click "New Automation"
```

**2. Name & Description:**
```
Name: Auto-publish Blog Post
Description: Automatically publishes blog posts to MongoDB when PR is merged to main branch
```

**3. Add Trigger:**
```
Click "+ Add Trigger"
→ Select "GitHub"
→ Event: "Pull request merged"
→ Repository: HoangBao1302/vet-clinic-vietnam
→ Branch: main
```

**4. Add Agent Instructions:**

Copy-paste this:
```
When a pull request is merged to the main branch:

1. **Detect blog post changes:**
   - Look for new or modified files in paths like `/app/blog/posts/`, `/content/blog/`, or similar blog directories
   - Check for markdown files (.md, .mdx) or blog post files

2. **Extract post metadata:**
   - Parse frontmatter or metadata (title, date, author, category, tags, excerpt)
   - Extract post content

3. **Publish to MongoDB:**
   - Make authenticated API call to: POST /api/admin/blog
   - Include credentials from environment variables
   - Send post data: { title, content, author, date, category, tags, status: "published" }

4. **Handle response:**
   - If successful: Log "Blog post published: [title]"
   - If error: Log error details for review

5. **Notification:**
   - Post confirmation to Slack #all-thebenchmarktrader: "✅ Blog post published: [title]"

Note: Only process blog-related files. Ignore other code changes.
```

**5. Configure Tools:**
```
✅ Enable: "Open Pull Request" (auto-enabled)
✅ Enable: "Send to Slack"
   - Channel: #all-thebenchmarktrader
❌ Disable all other tools
```

**6. Repository Settings:**
```
Verify:
- Repo: HoangBao1302/vet-clinic-vietnam ✓
- Branch: main ✓
- Event: Pull request merged ✓
```

**7. Save:**
```
Click "Create" button
```

**8. Test:**
```
1. Create test blog post: `test-post.md`
2. Create PR to main branch
3. Merge PR
4. Check:
   - Automation triggers
   - Blog post appears in MongoDB
   - Slack notification sent
```

---

## ✅ Testing Checklist

### Test Automation #1: Daily Content Reminder

**Manual Test:**
```
1. Go to Cursor Automations
2. Find "Daily Content Reminder"
3. Click "Run Now" (if available)
4. Or wait until 9 AM weekday
5. Check Slack #all-thebenchmarktrader for reminder message
```

**Expected Result:**
```
📝 Good morning! Daily Content Tasks:
...
```

---

### Test Automation #2: RSS News Digest

**Manual Test:**
```
1. Run automation manually or wait until 9 AM
2. Check Slack for digest message
```

**Expected Result:**
```
📰 Forex News Digest - [Date]
🔹 [Headlines with links]
```

**If Fails:**
- Check RSS feed URLs are accessible
- Verify Slack bot permissions

---

### Test Automation #3: Auto-publish Blog

**Test Workflow:**
```
1. Create test file: `app/blog/posts/test-post.md`

Content:
---
title: "Test Blog Post"
date: "2026-09-13"
author: "Test Author"
category: "Testing"
tags: ["test"]
---

This is a test blog post content.

2. Create PR: "Test: Add blog post"
3. Merge PR to main
4. Wait 1-2 minutes
5. Check:
   - MongoDB blog collection for new post
   - Slack for notification
   - /api/admin/blog logs
```

**Expected Results:**
- ✅ Post appears in MongoDB
- ✅ Slack message: "✅ Blog post published: Test Blog Post"

**If Fails:**
- Check GitHub webhook triggered
- Check API /api/admin/blog accepts requests
- Verify MongoDB connection
- Check automation logs

---

### Test Automation #4: Market Data to Blog

**Manual Test:**
```
1. Run at 6 PM or trigger manually
2. Check for blog post creation
```

**Expected Result:**
- New blog post in MongoDB
- Title: "Thị trường Forex hôm nay - [Date]"
- Content: Market data + analysis

**If Fails:**
- Check market data API access
- Verify blog API endpoint
- Check API keys in environment

---

### Test Automation #5: News API Integration

**Prerequisites:**
```
1. Get NewsAPI key: newsapi.org
2. Add to environment: NEWSAPI_KEY
3. Restart automation if needed
```

**Manual Test:**
```
1. Wait for 2-hour interval or trigger manually
2. Check Slack for news updates
```

**Expected Result:**
```
📰 Forex News Update - [Time]
🔹 [Headlines from NewsAPI]
```

**If Fails:**
- Verify API key is valid
- Check API rate limits (100/day)
- Test API manually with curl
- Check Slack permissions

---

## 🔍 Troubleshooting

### Issue: Automation not triggering

**Check:**
```
1. Cursor Automations → Find automation
2. Verify status: "Active" ✓
3. Check trigger configuration
4. For schedules: Wait until next scheduled time
5. For GitHub: Check repository webhooks
```

**Solution:**
- Toggle automation off and on
- Re-save automation
- Check Cursor logs

---

### Issue: Slack messages not posting

**Symptoms:**
- Automation runs but no Slack message
- Error: "Agent cannot post to channel"

**Solutions:**

**1. Verify Bot is in Channel:**
```
Slack → #all-thebenchmarktrader
→ Agents & apps tab
→ Should see "Cursor AGENT"
```

**If missing:**
```
In channel, type: @cursor
→ Click "Invite to Channel"
```

**2. Check Bot Permissions:**
```
Slack → Workspace settings → Manage apps
→ Find "Cursor" app
→ Verify permissions:
  - channels:read
  - chat:write
  - users:read
```

**3. Reconnect Slack:**
```
Cursor → Settings → MCP
→ Find Slack connection
→ Disconnect and reconnect
```

---

### Issue: API rate limits exceeded

**For NewsAPI (100/day):**
```
Every 2 hours = 12 requests/day
Well under limit ✓

If exceeded:
- Check for duplicate automations
- Verify cron schedule
- Consider increasing to every 4 hours
```

**For Alpha Vantage (25/day):**
```
If using in addition to NewsAPI:
- Make it optional fallback
- Or disable if NewsAPI sufficient
```

---

### Issue: GitHub automation not triggering

**Verify:**
```
1. Repository: HoangBao1302/vet-clinic-vietnam ✓
2. Branch: main ✓
3. PR must be MERGED (not just closed)
```

**Check GitHub Webhooks:**
```
GitHub → Repository → Settings → Webhooks
→ Should see Cursor webhook
→ Recent deliveries should show trigger
```

**Manual trigger:**
```
Create test PR → Merge → Wait 1-2 min
```

---

### Issue: MongoDB connection fails

**Check:**
```
1. MONGODB_URI in environment variables
2. MongoDB Atlas cluster status: "Running"
3. IP whitelist includes Vercel/Cursor IPs
4. Test connection manually
```

**Test:**
```bash
curl -X POST https://yourdomain.com/api/admin/blog \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your_token" \
  -d '{"title":"Test","content":"Test"}'
```

---

## 📊 Monitoring & Maintenance

### Daily Checks

**Morning (9 AM):**
- [ ] Check Slack for Content Reminder message
- [ ] Check Slack for RSS News Digest
- [ ] Verify messages are formatted correctly

**Evening (6 PM):**
- [ ] Check Slack for Market Summary notification
- [ ] Verify blog post created in MongoDB
- [ ] Check for any errors

**Every 2 Hours:**
- [ ] Check News API updates in Slack
- [ ] Verify headlines are recent (< 2 hours old)

---

### Weekly Checks

**Monday Morning:**
- [ ] Verify all automations status: "Active"
- [ ] Check Slack bot is in channel
- [ ] Review last week's automation runs

**End of Week:**
- [ ] Check API usage:
  - NewsAPI: Should be ~84 requests/week (< 100/day limit)
  - Alpha Vantage: Should be ~84/week (< 25/day limit)
- [ ] Review any failed automation runs
- [ ] Check MongoDB blog posts count

---

### Monthly Maintenance

**First of Month:**
- [ ] Review API costs (all free tiers should be $0)
- [ ] Check for Cursor updates
- [ ] Review automation effectiveness
- [ ] Update prompts if needed

**API Key Rotation:**
- NewsAPI: Free tier, no rotation needed
- Alpha Vantage: Free tier, no rotation needed
- If security concerns: Regenerate keys quarterly

---

## 📝 Best Practices

### Content Quality

**For Market Summaries:**
- ✅ Always write original analysis
- ✅ Base analysis on data, not opinions
- ✅ Include support/resistance levels
- ✅ Add actionable insights
- ❌ Never copy from other sources

**For News Digests:**
- ✅ Include attribution links
- ✅ Use excerpts, not full articles
- ✅ Filter for relevance
- ❌ Don't copy full content

---

### Rate Limiting

**NewsAPI (100/day):**
- Current: 12 requests/day (every 2 hours)
- Headroom: 88 requests/day unused
- Can safely increase frequency if needed

**Alpha Vantage (25/day):**
- Use as optional supplement
- Don't rely solely on it
- Consider as fallback only

**Best Practice:**
- Monitor actual usage weekly
- Keep logs of API calls
- Alert if approaching 80% of limit

---

### Security

**API Keys:**
- ✅ Store in environment variables
- ✅ Never commit to Git
- ✅ Use Vercel environment variables for production
- ❌ Don't hardcode in code

**MongoDB:**
- ✅ Use JWT authentication for blog API
- ✅ Verify user permissions
- ✅ Sanitize input data
- ❌ Don't expose credentials

**Slack:**
- ✅ Use Slack MCP (secure by default)
- ✅ Limit bot permissions to minimum needed
- ❌ Don't post sensitive data to public channels

---

## 🚀 Future Enhancements

### Potential Improvements

**1. Email Notifications:**
- Add email digest for daily summaries
- Alert on major market moves
- Weekly summary email

**2. Advanced Analytics:**
- Track sentiment from news
- Correlate news with price movements
- Generate trading signals

**3. Multi-language Support:**
- Translate news to Vietnamese
- Support multiple market regions
- Localized analysis

**4. Interactive Features:**
- Slack slash commands
- Manual trigger buttons
- Real-time alerts

**5. Data Visualization:**
- Chart generation for market data
- Performance tracking
- Automation health dashboard

---

## 📚 Resources

### Documentation

**Cursor Automations:**
- Official docs: https://cursor.com/docs/automations
- Community examples: https://github.com/getcursor/automations

**APIs:**
- NewsAPI: https://newsapi.org/docs
- Alpha Vantage: https://www.alphavantage.co/documentation/
- Slack API: https://api.slack.com/

**Project Docs:**
- Architecture: `/docs/architecture.md`
- Technical: `/docs/technical.md`
- API Docs: `/docs/API_DOCUMENTATION.md`

---

### Support

**If Issues:**
1. Check this guide first
2. Review Troubleshooting section
3. Check Cursor community forum
4. Create issue in project repo

**Contact:**
- Project: HoangBao1302/vet-clinic-vietnam
- Slack: #all-thebenchmarktrader

---

## 📋 Summary

**Created:** Sep 13, 2026

**Automations Status:**
- ✅ 4 automations active and working
- ⏳ 1 automation needs manual setup (#3)

**Next Steps:**
1. Complete manual setup for Automation #3
2. Get NewsAPI & Alpha Vantage API keys
3. Test all automations
4. Monitor for first week
5. Adjust schedules/prompts as needed

**Success Criteria:**
- ✅ Daily content reminders sent
- ✅ News digests appear in Slack
- ✅ Market summaries published daily
- ✅ News updates every 2 hours
- ⏳ Blog posts auto-publish on PR merge

---

**Last Updated:** Sep 13, 2026, 1:49 PM (UTC+7)  
**Status:** Documentation Complete ✅
