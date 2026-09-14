#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const STATE_DIR = '/cursor/stores/automation';
const STATE_FILE = path.join(STATE_DIR, 'forex-news-state.json');

const MAX_ARTICLES = 8;
const ARTICLE_MAX_AGE_MS = 48 * 60 * 60 * 1000;

const RSS_FEEDS = [
  { name: 'ForexLive', url: 'https://www.forexlive.com/feed' },
  { name: 'Investing.com', url: 'https://www.investing.com/rss/news.rss' },
  { name: 'CNBC', url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664' },
  { name: 'MarketWatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories/' },
  { name: 'OilPrice.com', url: 'https://oilprice.com/rss/main' },
  { name: 'Federal Reserve', url: 'https://www.federalreserve.gov/feeds/press_all.xml' },
  { name: 'ECB', url: 'https://www.ecb.europa.eu/rss/press.html' },
  { name: 'Bank of England', url: 'https://www.bankofengland.co.uk/rss/news' },
  { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/rssindex' },
];

const KEYWORDS = [
  'forex', 'currency', 'eur/usd', 'eur-usd', 'gbp/usd', 'gbp-usd', 'usd/jpy', 'usd-jpy',
  'dollar', 'euro', 'yen', 'pound', 'sterling', 'gold', 'oil', 'crude', 'brent', 'wti',
  'fed', 'federal reserve', 'ecb', 'european central bank', 'boj', 'bank of england',
  'interest rate', 'rate cut', 'rate hike', 'inflation', 'cpi', 'gdp', 'employment',
  'nonfarm', 'nfp', 'central bank', 'fx', 'foreign exchange', 'commodities', 'opec',
  'xau', 'precious metal', 'treasury', 'bond yield', 'usd', 'eur', 'gbp', 'jpy', 'cny',
  'hormuz', 'pboc', 'reserve bank', 'lagarde', 'powell',
];

const PRIORITY_KEYWORDS = [
  'eur/usd', 'gbp/usd', 'usd/jpy', 'gold', 'oil', 'crude', 'fed', 'ecb',
  'bank of england', 'interest rate', 'cpi', 'inflation', 'nonfarm', 'central bank',
];

const EXCLUDE_KEYWORDS = [
  'crypto', 'bitcoin', 'ethereum', 'xrp', 'stablecoin', 'nft', 'blockchain',
];

function defaultState() {
  return {
    postedUrls: [],
    lastDigestDate: null,
  };
}

function loadState() {
  try {
    if (!fs.existsSync(STATE_FILE)) {
      return defaultState();
    }
    const parsed = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

function saveState(state) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  state.postedUrls = (state.postedUrls || []).slice(-500);
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTag(block, tag) {
  const cdata = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[(.*?)\\]\\]></${tag}>`, 'is'));
  if (cdata) {
    return cdata[1].trim();
  }
  const plain = block.match(new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, 'is'));
  return plain ? plain[1].trim() : '';
}

function parseRss(xml, sourceName) {
  const items = [];
  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = decodeHtml(extractTag(block, 'title'));
    const link = decodeHtml(extractTag(block, 'link'))
      || (block.match(/<link[^>]*href="([^"]+)"/i)?.[1] || '');
    const description = decodeHtml(
      extractTag(block, 'description')
      || extractTag(block, 'summary')
      || extractTag(block, 'content:encoded'),
    );
    const pubDate = decodeHtml(
      extractTag(block, 'pubDate')
      || extractTag(block, 'dc:date')
      || extractTag(block, 'updated'),
    );

    if (title && link) {
      items.push({
        title,
        url: link,
        excerpt: description,
        source: sourceName,
        publishedAt: pubDate,
      });
    }
  }

  return items;
}

function parsePublishedAt(value) {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function isRecentArticle(article, now = Date.now()) {
  const publishedAt = parsePublishedAt(article.publishedAt);
  if (!publishedAt) {
    return true;
  }
  return now - publishedAt <= ARTICLE_MAX_AGE_MS;
}

function isRelevant(article) {
  const text = `${article.title} ${article.excerpt}`.toLowerCase();
  if (EXCLUDE_KEYWORDS.some((keyword) => text.includes(keyword))) {
    return false;
  }
  return KEYWORDS.some((keyword) => text.includes(keyword));
}

function scoreArticle(article) {
  const text = `${article.title} ${article.excerpt}`.toLowerCase();
  let score = 0;

  for (const keyword of PRIORITY_KEYWORDS) {
    if (text.includes(keyword)) {
      score += 3;
    }
  }

  if (['Federal Reserve', 'ECB', 'Bank of England'].includes(article.source)) {
    score += 5;
  }

  const publishedAt = parsePublishedAt(article.publishedAt);
  if (publishedAt) {
    const ageHours = (Date.now() - publishedAt) / (60 * 60 * 1000);
    score += Math.max(0, 24 - ageHours);
  }

  return score;
}

function excerptSentences(text, maxSentences = 3) {
  const clean = decodeHtml(text).replace(/\s+/g, ' ').trim();
  if (!clean) {
    return '';
  }

  const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];
  return sentences.slice(0, maxSentences).join(' ').trim();
}

function fallbackExcerpt(title) {
  const cleanTitle = decodeHtml(title);
  const lower = cleanTitle.toLowerCase();

  if (lower.includes('gold')) {
    return 'Precious metals traders are reassessing positioning as gold price moves interact with inflation data, rate expectations, and broader risk sentiment.';
  }
  if (lower.includes('oil') || lower.includes('crude') || lower.includes('brent') || lower.includes('pipeline')) {
    return 'Energy markets remain in focus as supply disruptions and geopolitical risks keep crude price volatility elevated for FX and inflation outlooks.';
  }
  if (lower.includes('ecb') || lower.includes('lagarde') || lower.includes('euro')) {
    return 'Euro-area policy and inflation developments continue to shape EUR crosses and expectations for European Central Bank action.';
  }
  if (lower.includes('fed') || lower.includes('federal reserve')) {
    return 'US monetary policy expectations are shifting, with implications for the dollar and major currency pairs.';
  }

  return `This headline is being tracked for potential impacts on major currency pairs, commodities, and central bank policy: ${cleanTitle}.`;
}

function dedupeArticles(articles) {
  const seen = new Set();
  const unique = [];

  for (const article of articles) {
    const key = article.url.toLowerCase().replace(/\/$/, '');
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(article);
  }

  return unique;
}

function formatDigestDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function formatDigest(articles, date = new Date()) {
  const lines = [`📰 Forex News Digest - ${formatDigestDate(date)}`, ''];

  for (const article of articles) {
    lines.push(`🔹 ${article.title}`);
    lines.push(`   ${article.excerpt}`);
    lines.push(`   Read more at ${article.source} → ${article.url}`);
    lines.push('');
  }

  return lines.join('\n').trim();
}

async function fetchFeed(feed) {
  const response = await fetch(feed.url, {
    headers: { 'User-Agent': 'ForexNewsDigest/1.0' },
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const xml = await response.text();
  if (!xml.includes('<item')) {
    throw new Error('No RSS items found');
  }

  return parseRss(xml, feed.name);
}

async function fetchAllArticles() {
  const collected = [];

  for (const feed of RSS_FEEDS) {
    try {
      collected.push(...await fetchFeed(feed));
    } catch {
      // Skip unavailable feeds and continue with the rest.
    }
  }

  return collected;
}

async function main() {
  const state = loadState();
  const postedSet = new Set((state.postedUrls || []).map((url) => url.toLowerCase()));

  const result = {
    action: 'skip',
    message: null,
    articles: [],
    reason: null,
  };

  const collected = await fetchAllArticles();
  const articles = dedupeArticles(collected)
    .filter(isRelevant)
    .filter(isRecentArticle)
    .filter((article) => article.url && !postedSet.has(article.url.toLowerCase()))
    .sort((left, right) => scoreArticle(right) - scoreArticle(left))
    .slice(0, MAX_ARTICLES);

  for (const article of articles) {
    article.excerpt = excerptSentences(article.excerpt, 3)
      || fallbackExcerpt(article.title);
  }

  if (articles.length === 0) {
    result.reason = 'no_new_articles';
    console.log(JSON.stringify(result));
    return;
  }

  result.action = 'post';
  result.articles = articles;
  result.message = formatDigest(articles);

  for (const article of articles) {
    state.postedUrls.push(article.url);
  }
  state.lastDigestDate = new Date().toISOString();
  saveState(state);

  console.log(JSON.stringify(result));
}

main().catch((error) => {
  console.error(JSON.stringify({
    action: 'error',
    message: error.message,
  }));
  process.exit(1);
});
