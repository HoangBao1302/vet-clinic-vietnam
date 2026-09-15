#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const STATE_DIR = '/cursor/stores/automation';
const STATE_FILE = path.join(STATE_DIR, 'forex-news-state.json');

const NEWS_API_DAILY_LIMIT = 100;
const ALPHA_VANTAGE_DAILY_LIMIT = 25;
const FETCH_INTERVAL_MS = 2 * 60 * 60 * 1000;
const ARTICLE_MAX_AGE_MS = 2 * 60 * 60 * 1000;

const NEWS_QUERY = 'forex OR currency OR EUR/USD OR gold trading';
const FOREX_RELEVANCE_PATTERN = /\b(forex|fx\b|currency|currencies|eur\/usd|gbp\/usd|usd\/jpy|exchange rate|central bank|fed\b|ecb\b|boe\b|boj\b|interest rate|gold trading|xauusd|foreign exchange)\b/i;

function loadEnv() {
  try {
    require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });
  } catch {
    // dotenv is optional if env vars are already set
  }
}

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

function hoursUntilUtcMidnight() {
  const now = new Date();
  const midnight = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  ));
  return Math.ceil((midnight.getTime() - now.getTime()) / (60 * 60 * 1000));
}

function defaultState() {
  return {
    newsApiUsage: { date: todayUtc(), count: 0 },
    alphaVantageUsage: { date: todayUtc(), count: 0 },
    postedUrls: [],
    lastFetchAt: null,
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

function resetDailyUsage(state) {
  const today = todayUtc();
  if (state.newsApiUsage?.date !== today) {
    state.newsApiUsage = { date: today, count: 0 };
  }
  if (state.alphaVantageUsage?.date !== today) {
    state.alphaVantageUsage = { date: today, count: 0 };
  }
}

function normalizeTitle(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function isForexRelevant(article) {
  const text = `${article.title || ''} ${article.source || ''}`;
  return FOREX_RELEVANCE_PATTERN.test(text);
}

function isRecentArticle(article, now = Date.now()) {
  const publishedAt = new Date(article.publishedAt).getTime();
  if (Number.isNaN(publishedAt)) {
    return false;
  }
  return now - publishedAt <= ARTICLE_MAX_AGE_MS;
}

function dedupeArticles(articles) {
  const seen = new Set();
  const unique = [];

  for (const article of articles) {
    const urlKey = article.url ? article.url.trim().toLowerCase() : '';
    const titleKey = normalizeTitle(article.title);
    const key = urlKey || titleKey;
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(article);
  }

  return unique;
}

function formatTimestamp(date = new Date()) {
  return date.toUTCString().replace(' GMT', ' UTC');
}

function formatSlackMessage(articles, timestamp = new Date()) {
  const lines = [`📰 Forex News Update - ${formatTimestamp(timestamp)}`, ''];

  for (const article of articles) {
    lines.push(`🔹 ${article.title}`);
    lines.push(`   Source: ${article.source}`);
    lines.push(`   Link → ${article.url}`);
    lines.push('');
  }

  return lines.join('\n').trim();
}

async function fetchNewsApi(apiKey, fromIso) {
  const params = new URLSearchParams({
    q: NEWS_QUERY,
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '5',
    from: fromIso,
    apiKey,
  });

  const response = await fetch(`https://newsapi.org/v2/everything?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || data?.code || `HTTP ${response.status}`;
    throw new Error(`NewsAPI error: ${message}`);
  }

  return (data.articles || []).map((article) => ({
    title: article.title,
    url: article.url,
    source: article.source?.name || 'Unknown',
    publishedAt: article.publishedAt,
    provider: 'newsapi',
  }));
}

async function fetchAlphaVantage(apiKey) {
  const params = new URLSearchParams({
    function: 'NEWS_SENTIMENT',
    topics: 'forex',
    limit: '5',
    apikey: apiKey,
  });

  const response = await fetch(`https://www.alphavantage.co/query?${params.toString()}`);
  const data = await response.json();

  if (data?.Note || data?.Information) {
    throw new Error(`Alpha Vantage error: ${data.Note || data.Information}`);
  }

  return (data.feed || []).map((item) => ({
    title: item.title,
    url: item.url,
    source: item.source || 'Unknown',
    publishedAt: `${item.time_published.slice(0, 4)}-${item.time_published.slice(4, 6)}-${item.time_published.slice(6, 8)}T${item.time_published.slice(9, 11)}:${item.time_published.slice(11, 13)}:${item.time_published.slice(13, 15)}Z`,
    provider: 'alphavantage',
  }));
}

function buildRateLimitMessage(provider, hours) {
  return `API limit reached for ${provider}, will resume in ${hours} hours`;
}

async function main() {
  loadEnv();

  const newsApiKey = process.env.NEWS_API_KEY;
  const alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY || process.env.ALPHA_VANTAGE_KEY;
  const now = Date.now();
  const fromIso = new Date(now - ARTICLE_MAX_AGE_MS).toISOString();
  const state = loadState();

  resetDailyUsage(state);

  const result = {
    action: 'skip',
    message: null,
    articles: [],
    reason: null,
  };

  if (!newsApiKey && !alphaVantageKey) {
    result.reason = 'missing_api_keys';
    console.log(JSON.stringify(result));
    return;
  }

  if (state.lastFetchAt && now - Date.parse(state.lastFetchAt) < FETCH_INTERVAL_MS) {
    result.reason = 'fetch_interval_not_elapsed';
    console.log(JSON.stringify(result));
    return;
  }

  const newsApiLimited = state.newsApiUsage.count >= NEWS_API_DAILY_LIMIT;
  const alphaLimited = state.alphaVantageUsage.count >= ALPHA_VANTAGE_DAILY_LIMIT;
  const hoursToReset = hoursUntilUtcMidnight();

  if (newsApiKey && newsApiLimited && (!alphaVantageKey || alphaLimited)) {
    result.action = 'rate_limit';
    result.message = buildRateLimitMessage('NewsAPI and Alpha Vantage', hoursToReset);
    console.log(JSON.stringify(result));
    return;
  }

  if (newsApiKey && newsApiLimited && !alphaVantageKey) {
    result.action = 'rate_limit';
    result.message = buildRateLimitMessage('NewsAPI', hoursToReset);
    console.log(JSON.stringify(result));
    return;
  }

  const collected = [];

  if (newsApiKey && !newsApiLimited) {
    try {
      collected.push(...await fetchNewsApi(newsApiKey, fromIso));
      state.newsApiUsage.count += 1;
    } catch (error) {
      if (/rate limit|too many requests|429/i.test(error.message)) {
        state.newsApiUsage.count = NEWS_API_DAILY_LIMIT;
        result.action = 'rate_limit';
        result.message = buildRateLimitMessage('NewsAPI', hoursToReset);
        saveState(state);
        console.log(JSON.stringify(result));
        return;
      }
      result.reason = `newsapi_error:${error.message}`;
    }
  }

  if (alphaVantageKey && !alphaLimited) {
    try {
      collected.push(...await fetchAlphaVantage(alphaVantageKey));
      state.alphaVantageUsage.count += 1;
    } catch (error) {
      if (/rate limit|too many requests|429|call frequency/i.test(error.message)) {
        state.alphaVantageUsage.count = ALPHA_VANTAGE_DAILY_LIMIT;
        if (result.action !== 'rate_limit') {
          result.action = 'rate_limit';
          result.message = buildRateLimitMessage('Alpha Vantage', hoursToReset);
        }
      }
    }
  }

  state.lastFetchAt = new Date(now).toISOString();

  const postedSet = new Set((state.postedUrls || []).map((url) => url.toLowerCase()));
  const freshArticles = dedupeArticles(collected)
    .filter((article) => isRecentArticle(article, now))
    .filter((article) => article.provider !== 'alphavantage' || isForexRelevant(article))
    .filter((article) => article.url && !postedSet.has(article.url.toLowerCase()))
    .slice(0, 5);

  if (freshArticles.length === 0) {
    result.reason = result.reason || 'no_new_articles';
    saveState(state);
    console.log(JSON.stringify(result));
    return;
  }

  result.action = 'post';
  result.articles = freshArticles;
  result.message = formatSlackMessage(freshArticles);

  for (const article of freshArticles) {
    state.postedUrls.push(article.url);
  }

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
