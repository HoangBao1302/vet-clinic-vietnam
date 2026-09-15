#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const STATE_DIR = '/cursor/stores/automation';
const STATE_FILE = path.join(STATE_DIR, 'forex-news-rss-state.json');
const MAX_ARTICLES = 8;
const MAX_ARTICLE_AGE_HOURS = 36;
const MIN_EXCERPT_LENGTH = 80;

const RSS_FEEDS = [
  {
    url: 'https://investinglive.com/feed/news/',
    source: 'ForexLive',
  },
  {
    url: 'https://www.actionforex.com/feed/',
    source: 'ActionForex',
  },
  {
    url: 'https://www.investing.com/rss/news_1.rss',
    source: 'Investing.com',
    category: 'forex',
  },
  {
    url: 'https://www.investing.com/rss/news_11.rss',
    source: 'Investing.com',
    category: 'commodities',
  },
  {
    url: 'https://feeds.bbci.co.uk/news/business/rss.xml',
    source: 'BBC News',
  },
];

const RELEVANCE_KEYWORDS = [
  'eur/usd', 'eurusd', 'gbp/usd', 'gbpusd', 'usd/jpy', 'usdjpy',
  'eur', 'usd', 'gbp', 'jpy', 'yen', 'dollar', 'euro', 'pound', 'loonie',
  'gold', 'silver', 'oil', 'crude', 'brent', 'wti', 'commodity', 'commodities',
  'fed', 'ecb', 'boj', 'central bank', 'rate hike', 'rate cut', 'interest rate',
  'cpi', 'inflation', 'gdp', 'jobs report', 'payroll', 'nfp', 'pmi',
  'forex', 'fx', 'currency', 'currencies', 'treasury yield', 'yields',
];

const TITLE_EXCLUDE_KEYWORDS = [
  'bitcoin', 'crypto', 'ethereum', 'blockchain', 'nft', 'emmy', 'emmys',
  'eco data', 'wave analysis', 'daily outlook', 's&p 500', 'sp 500',
  'what are the main events', 'markets wrap', 'fx news wrap', 'market news:',
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
    return { ...defaultState(), ...JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')) };
  } catch {
    return defaultState();
  }
}

function saveState(state) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  state.postedUrls = (state.postedUrls || []).slice(-500);
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function decodeHtml(text) {
  return String(text || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function stripHtml(text) {
  return decodeHtml(String(text || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

function parseRssItems(xml) {
  const items = [];
  const itemBlocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];

  for (const block of itemBlocks) {
    const title = stripHtml(
      (block.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '',
    );
    const link = stripHtml(
      (block.match(/<link[^>]*>([\s\S]*?)<\/link>/i) || [])[1] || '',
    );
    const description = stripHtml(
      (block.match(/<description[^>]*>([\s\S]*?)<\/description>/i) || [])[1] || '',
    );
    const pubDateRaw = stripHtml(
      (block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i) || [])[1]
      || (block.match(/<pubdate[^>]*>([\s\S]*?)<\/pubdate>/i) || [])[1]
      || '',
    );

    if (!title || !link) {
      continue;
    }

    items.push({
      title,
      url: link,
      description,
      publishedAt: pubDateRaw ? new Date(pubDateRaw) : null,
    });
  }

  return items;
}

function isRelevant(article) {
  const title = article.title.toLowerCase();
  const text = `${article.title} ${article.description}`.toLowerCase();

  if (TITLE_EXCLUDE_KEYWORDS.some((keyword) => title.includes(keyword))) {
    return false;
  }

  return RELEVANCE_KEYWORDS.some((keyword) => text.includes(keyword));
}

function relevanceScore(article) {
  const title = article.title.toLowerCase();
  const text = `${article.title} ${article.description}`.toLowerCase();
  let score = 0;

  const highValue = [
    'eur/usd', 'eurusd', 'gbp/usd', 'gbpusd', 'usd/jpy', 'usdjpy',
    'gold', 'oil', 'fed', 'ecb', 'boj', 'central bank', 'cpi', 'inflation',
    'rate hike', 'rate cut', 'treasury yield', 'economic calendar',
  ];

  for (const keyword of highValue) {
    if (title.includes(keyword)) {
      score += 5;
    } else if (text.includes(keyword)) {
      score += 2;
    }
  }

  const sourceBoost = {
    ForexLive: 4,
    'BBC News': 3,
    'Investing.com': 2,
    ActionForex: 1,
  };
  score += sourceBoost[article.source] || 0;

  return score;
}

function isRecent(article, maxAgeHours = MAX_ARTICLE_AGE_HOURS) {
  if (!article.publishedAt || Number.isNaN(article.publishedAt.getTime())) {
    return true;
  }
  const ageMs = Date.now() - article.publishedAt.getTime();
  return ageMs <= maxAgeHours * 60 * 60 * 1000;
}

function normalizeTitle(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dedupeArticles(articles) {
  const seen = new Set();
  const unique = [];

  for (const article of articles) {
    const key = article.url.toLowerCase() || normalizeTitle(article.title);
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(article);
  }

  return unique;
}

function splitSentences(text) {
  const cleaned = String(text || '').trim();
  if (!cleaned) {
    return [];
  }

  const withoutHeadlineList = cleaned.replace(/^Headlines:\s*/i, '');
  const parts = withoutHeadlineList
    .replace(/\[\.\.\.\]|…/g, '.')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 40)
    .filter((sentence) => !/^Headlines?:/i.test(sentence))
    .filter((sentence) => {
      const words = sentence.split(/\s+/).length;
      return words >= 8 && words <= 80;
    });

  return parts;
}

function cleanExcerptText(text) {
  return String(text || '')
    .replace(/\[\.\.\.\]|\[\.\]/g, '')
    .replace(/The post .*? appeared first on .*?\.?/gi, '')
    .replace(/\bActionForex\s*\.?$/i, '')
    .replace(/Read more .*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildExcerpt(description, title) {
  const cleanedDescription = cleanExcerptText(stripHtml(description));
  const sentences = splitSentences(cleanedDescription);

  if (sentences.length === 0) {
    return null;
  }

  let excerpt = cleanExcerptText(sentences.slice(0, 3).join(' '));
  if (excerpt.length > 450) {
    const trimmed = excerpt.slice(0, 447).replace(/\s+\S*$/, '');
    excerpt = `${trimmed}...`;
  }
  if (excerpt.length < MIN_EXCERPT_LENGTH) {
    return null;
  }

  const titleNorm = normalizeTitle(title);
  const firstSentenceNorm = normalizeTitle(sentences[0]);
  if (firstSentenceNorm && titleNorm.includes(firstSentenceNorm.slice(0, 30))) {
    const alternate = cleanExcerptText(sentences.slice(1, 3).join(' '));
    return alternate.length >= MIN_EXCERPT_LENGTH ? alternate : null;
  }

  return excerpt;
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
    headers: {
      'User-Agent': 'ForexNewsDigest/1.0 (+https://thebenchmarktrader.com)',
      Accept: 'application/rss+xml, application/xml, text/xml, */*',
    },
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const xml = await response.text();
  const items = parseRssItems(xml);

  return items.map((item) => ({
    ...item,
    source: feed.source,
    feedUrl: feed.url,
    category: feed.category || null,
  }));
}

async function fetchAllArticles() {
  const collected = [];

  for (const feed of RSS_FEEDS) {
    try {
      const items = await fetchFeed(feed);
      collected.push(...items);
    } catch (error) {
      console.error(`Feed error (${feed.source}): ${error.message}`);
    }
  }

  return collected;
}

function selectArticles(rawArticles, postedUrls = [], debug = false) {
  const postedSet = new Set(postedUrls.map((url) => url.toLowerCase()));

  const deduped = dedupeArticles(rawArticles);
  const recent = deduped.filter((article) => isRecent(article));
  const relevant = recent.filter((article) => isRelevant(article));

  if (debug) {
    const countBySource = (items) => items.reduce((acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    }, {});
    const forexLiveItems = deduped.filter((item) => item.source === 'ForexLive');
    console.error('Filter counts:', {
      raw: countBySource(rawArticles),
      deduped: countBySource(deduped),
      recent: countBySource(recent),
      relevant: countBySource(relevant),
      forexLiveRecent: forexLiveItems.filter((article) => isRecent(article)).length,
      forexLiveRelevant: forexLiveItems.filter((article) => isRelevant(article)).length,
      forexLiveWithExcerpt: forexLiveItems.filter((item) => buildExcerpt(item.description, item.title)).length,
    });
  }

  const candidates = relevant
    .map((article) => {
      const excerpt = buildExcerpt(article.description, article.title);
      return {
        ...article,
        excerpt,
        score: relevanceScore(article),
      };
    })
    .filter((article) => article.excerpt)
    .filter((article) => !postedSet.has(article.url.toLowerCase()))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      const dateA = a.publishedAt?.getTime() || 0;
      const dateB = b.publishedAt?.getTime() || 0;
      return dateB - dateA;
    });

  const diverse = [];
  const pickedUrls = new Set();
  const usedTitles = new Set();
  const usedTopics = new Set();
  const sourceLimits = {
    ForexLive: 3,
    'Investing.com': 2,
    'BBC News': 2,
    ActionForex: 3,
  };
  const sourceCounts = {};

  if (debug) {
    console.error('Top candidates:', candidates.slice(0, 12).map((article) => ({
      source: article.source,
      score: article.score,
      title: article.title.slice(0, 60),
    })));
  }

  for (const article of candidates) {
    const titleKey = normalizeTitle(article.title);
    const source = article.source;
    const count = sourceCounts[source] || 0;
    const limit = sourceLimits[source] || 2;
    const topicKey = ['canada cpi', 'canadian inflation', 'eurusd', 'gbpusd', 'usdjpy', 'gold', 'oil']
      .find((topic) => titleKey.includes(topic.replace(/\s+/g, ' '))) || titleKey;

    if (
      usedTitles.has(titleKey)
      || usedTopics.has(topicKey)
      || count >= limit
      || pickedUrls.has(article.url)
    ) {
      continue;
    }

    diverse.push(article);
    pickedUrls.add(article.url);
    usedTitles.add(titleKey);
    usedTopics.add(topicKey);
    sourceCounts[source] = count + 1;

    if (diverse.length >= MAX_ARTICLES) {
      break;
    }
  }

  if (debug) {
    console.error('Selected:', diverse.map((article) => ({
      source: article.source,
      title: article.title.slice(0, 60),
    })));
  }

  return diverse;
}

async function main() {
  const debug = process.argv.includes('--debug');
  const state = loadState();
  const rawArticles = await fetchAllArticles();

  if (debug) {
    const forexLiveRaw = rawArticles.filter((item) => item.source === 'ForexLive');
    console.error(`Fetched ${rawArticles.length} raw articles`, {
      forexLiveCount: forexLiveRaw.length,
      forexLiveRecent: forexLiveRaw.filter((article) => isRecent(article)).length,
      forexLiveDates: forexLiveRaw.slice(0, 5).map((item) => ({
        title: item.title.slice(0, 35),
        publishedAt: item.publishedAt,
        recent: isRecent(item),
        ageHours: item.publishedAt ? ((Date.now() - item.publishedAt.getTime()) / 3600000).toFixed(1) : null,
      })),
    });
  }

  const articles = selectArticles(rawArticles, state.postedUrls, debug);

  const result = {
    action: articles.length > 0 ? 'post' : 'skip',
    articleCount: articles.length,
    digest: articles.length > 0 ? formatDigest(articles) : null,
    articles: articles.map(({ title, url, source, excerpt, publishedAt }) => ({
      title,
      url,
      source,
      excerpt,
      publishedAt: publishedAt?.toISOString() || null,
    })),
    reason: articles.length === 0 ? 'no_qualifying_articles' : null,
  };

  if (articles.length > 0) {
    for (const article of articles) {
      state.postedUrls.push(article.url);
    }
    state.lastDigestDate = new Date().toISOString();
    saveState(state);
  }

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({
    action: 'error',
    message: error.message,
  }));
  process.exit(1);
});
