#!/usr/bin/env node
'use strict';

const FEEDS = [
  { name: 'Investing.com Forex', url: 'https://www.investing.com/rss/news_1.rss' },
  { name: 'Investing.com Commodities', url: 'https://www.investing.com/rss/news_11.rss' },
  { name: 'Bloomberg Markets', url: 'https://feeds.bloomberg.com/markets/news.rss' },
  { name: 'CNBC Economy', url: 'https://www.cnbc.com/id/20910258/device/rss/rss.html' },
  { name: 'BBC Business', url: 'https://feeds.bbci.co.uk/news/business/rss.xml' },
  { name: 'Federal Reserve', url: 'https://www.federalreserve.gov/feeds/press_all.xml' },
  { name: 'ECB', url: 'https://www.ecb.europa.eu/rss/press.html' },
  { name: 'Bank of England', url: 'https://www.bankofengland.co.uk/rss/news' },
  { name: 'ForexR EUR/USD', url: 'https://forexr.com/analysis/eurusd/feed.xml' },
  { name: 'ForexR GBP/USD', url: 'https://forexr.com/analysis/gbpusd/feed.xml' },
  { name: 'ForexR USD/JPY', url: 'https://forexr.com/analysis/usdjpy/feed.xml' },
  { name: 'ForexR Gold', url: 'https://forexr.com/analysis/xauusd/feed.xml' },
  { name: 'ForexR Oil', url: 'https://forexr.com/analysis/xtiusd/feed.xml' },
  { name: 'InvestingLive News', url: 'https://investinglive.com/feed/news' },
  { name: 'InvestingLive Central Banks', url: 'https://investinglive.com/feed/centralbanks' },
];

const KEYWORDS = [
  /\beur\/?usd\b/i,
  /\bgbp\/?usd\b/i,
  /\busd\/?jpy\b/i,
  /\bgold\b/i,
  /\bxau\b/i,
  /\boil\b/i,
  /\bbrent\b/i,
  /\bwti\b/i,
  /\bforex\b/i,
  /\bcurrency\b/i,
  /\bdollar\b/i,
  /\beuro\b/i,
  /\bsterling\b/i,
  /\bpound\b/i,
  /\byen\b/i,
  /\bfed\b/i,
  /\bfederal reserve\b/i,
  /\becb\b/i,
  /\bboe\b/i,
  /\bbank of england\b/i,
  /\bcentral bank\b/i,
  /\binterest rate\b/i,
  /\binflation\b/i,
  /\bnfp\b/i,
  /\bcpi\b/i,
  /\bgdp\b/i,
  /\btreasury\b/i,
  /\byield\b/i,
];

function decodeEntities(text) {
  return String(text || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function stripHtml(html) {
  return decodeEntities(String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function excerptFromText(text, maxSentences = 3) {
  const clean = stripHtml(text);
  if (!clean) return '';
  const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];
  let excerpt = sentences.slice(0, maxSentences).join(' ').trim();
  if (excerpt.length > 420) {
    excerpt = `${excerpt.slice(0, 417).replace(/\s+\S*$/, '')}...`;
  }
  return excerpt;
}

function parseRssItems(xml, sourceName) {
  const items = [];
  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = (block.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i) || [])[1];
    const link = (block.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i) || [])[1];
    const desc = (block.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i) || [])[1];
    const contentEncoded = (block.match(/<content:encoded[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/i) || [])[1];
    const pubDate = (block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i) || [])[1];
    if (!title || !link) continue;
    items.push({
      title: stripHtml(title),
      url: stripHtml(link).trim(),
      description: contentEncoded || desc || '',
      pubDate: pubDate ? stripHtml(pubDate) : '',
      source: sourceName,
    });
  }
  return items;
}

function isRelevant(item) {
  const hay = `${item.title} ${stripHtml(item.description)}`;
  return KEYWORDS.some((re) => re.test(hay));
}

function normalizeUrl(url) {
  return url.trim().toLowerCase().replace(/\/$/, '');
}

function normalizeTitle(title) {
  return String(title || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function excerptScore(item) {
  const excerpt = excerptFromText(item.description, 3);
  if (!excerpt || normalizeTitle(excerpt) === normalizeTitle(item.title)) {
    return 0;
  }
  return excerpt.length;
}

async function fetchFeed(feed) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(feed.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'ForexNewsDigestBot/1.0 (+https://thebenchmarktrader.com)',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    return parseRssItems(xml, feed.name);
  } catch (e) {
    return { error: e.message, feed: feed.name };
  } finally {
    clearTimeout(timeout);
  }
}

function formatDateHeader(d = new Date()) {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function buildDigest(articles) {
  const lines = [`📰 Forex News Digest - ${formatDateHeader()}`, ''];
  for (const a of articles) {
    const excerpt = excerptFromText(a.description, 3);
    lines.push(`🔹 ${a.title}`);
    if (excerpt && normalizeTitle(excerpt) !== normalizeTitle(a.title)) {
      lines.push(`   ${excerpt}`);
    }
    lines.push(`   Read more at ${a.source} → ${a.url}`);
    lines.push('');
  }
  return lines.join('\n').trim();
}

async function main() {
  const allItems = [];
  const errors = [];

  for (const feed of FEEDS) {
    const result = await fetchFeed(feed);
    if (result.error) {
      errors.push({ feed: result.feed, error: result.error });
      continue;
    }
    for (const item of result) {
      if (isRelevant(item)) allItems.push(item);
    }
  }

  const seen = new Set();
  const unique = [];
  for (const item of allItems) {
    const key = normalizeUrl(item.url);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  unique.sort((a, b) => excerptScore(b) - excerptScore(a));

  const themeOf = (item) => {
    const t = `${item.title} ${stripHtml(item.description)}`.toLowerCase();
    if (/gold|xau/.test(t)) return 'gold';
    if (/oil|brent|wti|crude/.test(t)) return 'oil';
    if (/eur\/?usd|\beuro\b/.test(t)) return 'eur';
    if (/gbp\/?usd|sterling|pound/.test(t)) return 'gbp';
    if (/usd\/?jpy|\byen\b/.test(t)) return 'jpy';
    if (/fed|federal reserve|fomc/.test(t)) return 'fed';
    if (/ecb|european central/.test(t)) return 'ecb';
    if (/boe|bank of england/.test(t)) return 'boe';
    if (/boj|bank of japan/.test(t)) return 'boj';
    if (/rba|rbnz|boc|snb|pboc|rbi/.test(t)) return 'other_cb';
    if (/dollar|treasury|yield|inflation|cpi|gdp|nfp|jobs/.test(t)) return 'macro';
    return 'other';
  };

  const mustHaveThemes = ['eur', 'gbp', 'jpy', 'gold', 'oil'];
  const selected = [];
  const usedThemes = new Set();

  function pickForTheme(theme) {
    return unique.find(
      (item) => themeOf(item) === theme
        && (excerptScore(item) > 0 || item.title.length > 35)
        && !selected.some((s) => normalizeUrl(s.url) === normalizeUrl(item.url)),
    );
  }

  for (const theme of mustHaveThemes) {
    const pick = pickForTheme(theme);
    if (pick) {
      selected.push(pick);
      usedThemes.add(theme);
    }
  }

  for (const theme of mustHaveThemes) {
    if (selected.some((s) => themeOf(s) === theme)) continue;
    const fallback = unique.find(
      (item) => themeOf(item) === theme
        && !selected.some((s) => normalizeUrl(s.url) === normalizeUrl(item.url)),
    );
    if (fallback) {
      selected.push(fallback);
      usedThemes.add(theme);
    }
  }

  for (const item of unique) {
    if (selected.length >= 10) break;
    if (selected.some((s) => normalizeUrl(s.url) === normalizeUrl(item.url))) continue;
    const theme = themeOf(item);
    const duplicateTheme = selected.some((s) => themeOf(s) === theme);
    if (duplicateTheme && excerptScore(item) < 120) continue;
    selected.push(item);
    usedThemes.add(theme);
  }

  const digest = buildDigest(selected);
  const output = {
    articleCount: selected.length,
    errors,
    digest,
    articles: selected.map((a) => ({
      title: a.title,
      url: a.url,
      source: a.source,
      excerpt: excerptFromText(a.description, 3),
    })),
  };

  console.log(JSON.stringify(output, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
