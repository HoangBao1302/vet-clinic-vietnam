#!/usr/bin/env node
/**
 * Forex / markets headline roundup: fetch NewsAPI, publish bilingual HTML blog, notify Slack.
 * Run via: node scripts/forex-news-roundup.js
 * Env: NEWS_API_KEY, AUTOMATION_BLOG_API_KEY (optional SLACK_WEBHOOK for standalone — automation uses MCP send_slack_message)
 */
'use strict';

const path = require('path');

function loadEnv() {
  try {
    require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });
  } catch {
    /* optional */
  }
}

const VIETNAM_TZ = 'Asia/Ho_Chi_Minh';
const SIX_H_MS = 6 * 60 * 60 * 1000;
const FORTY_EIGHT_H_MS = 48 * 60 * 60 * 1000;
const NEWS_QUERY =
  'forex OR "EUR/USD" OR gold OR oil OR "federal reserve" OR "stock market"';

const EXCLUDE_TITLE_PATTERNS = [
  /health|covid|virus|hospital|doctor|patient|vaccine|disease|cancer|mental health/i,
  /celebrity|movie|film|music|concert|nfl|nba|sport(s)?\s+news|entertainment|netflix|hollywood/i,
  /gold cup|world cup|championship|premier league|olympic|nba\s|nfl\s/i,
  /porsche|lexus|ferrari|lamborghini|at no reserve|auction lot|car auction/i,
  /louis vuitton|handbag|fashion week|tequila|limited-edition bottle/i,
  /missile|drone|iran|saudi arabia|war|military strike|pentagon/i,
  /women'?s shooting|shooting ball|up cricket|women'?s cricket/i,
  /mayor|city council|local election|school board|high school football/i,
];

const STRONG_MARKET_RE =
  /\bforex\b|fx\b|eur\/usd|\bfed\b|federal reserve|ecb|central bank|interest rate|rate hike|rate cut|nasdaq|s&p|dow jones|\bcpi\b|inflation|bond yield|treasury yield|crude|brent|\bwti\b|\boil price\b|gold price|\btrader\b|\btrading desk\b|currency|usd\/|stock market|market selloff|market rally/i;

/** DD/MM/YYYY HH:mm in GMT+7 */
function formatVietnamTitleDate(now = new Date()) {
  const d = new Intl.DateTimeFormat('en-GB', {
    timeZone: VIETNAM_TZ,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const map = Object.fromEntries(d.map((p) => [p.type, p.value]));
  return `${map.day}/${map.month}/${map.year} ${map.hour}:${map.minute}`;
}

/** Month DD, YYYY HH:mm in GMT+7 (24h), English */
function formatEnglishTitleDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: VIETNAM_TZ,
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);
}

/** slug part: ddmmyyyy and hhmm GMT+7 */
function slugTimeParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: VIETNAM_TZ,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const m = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const ddmmyyyy = `${m.day}${m.month}${m.year}`;
  const hhmm = `${m.hour}${m.minute}`;
  return { ddmmyyyy, hhmm };
}

function isoPublishDate(now = new Date()) {
  return now.toISOString();
}

/** Strip HTML tags; collapse whitespace */
function stripHtml(html) {
  if (!html) return '';
  return String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Remove Twitter-style topic hashtags from auto-translated Vietnamese lines */
function stripHashtagsVi(text) {
  return String(text || '')
    .replace(/#\s*\S+/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s+|\s+$/g, '');
}

/** Relative time from publishedAt to now */
function relativeTimeVi(publishedAtMs, nowMs) {
  const sec = Math.floor((nowMs - publishedAtMs) / 1000);
  if (sec < 60) return 'vừa xong';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} phút trước`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  return `${d} ngày trước`;
}

function relativeTimeEn(publishedAtMs, nowMs) {
  const sec = Math.floor((nowMs - publishedAtMs) / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} minutes ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} hours ago`;
  const d = Math.floor(h / 24);
  return `${d} days ago`;
}

async function googleTranslate(text, sourceLang, targetLang) {
  const q = String(text || '').trim();
  if (!q) return '';
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', sourceLang);
  url.searchParams.set('tl', targetLang);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', q.slice(0, 4500));
  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ThebenchmarkTrader/1.0)' },
  });
  if (!res.ok) throw new Error(`Google Translate HTTP ${res.status}`);
  const data = await res.json();
  if (data?.[0]?.[0]?.[0]) {
    return data[0].map((chunk) => chunk[0]).join('');
  }
  throw new Error('Google Translate: unexpected response');
}

function isRelevantArticle(article) {
  const title = article.title || '';
  const desc = stripHtml(article.description || '');
  const blob = `${title} ${desc}`;
  for (const re of EXCLUDE_TITLE_PATTERNS) {
    if (re.test(blob)) return false;
  }
  const strong = STRONG_MARKET_RE.test(blob);
  if (!strong) {
    return false;
  }
  return true;
}

async function fetchNewsArticles(apiKey) {
  const params = new URLSearchParams({
    q: NEWS_QUERY,
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '100',
    apiKey,
  });
  const response = await fetch(`https://newsapi.org/v2/everything?${params}`);
  const data = await response.json();
  if (!response.ok) {
    const message = data?.message || data?.code || `HTTP ${response.status}`;
    throw new Error(`NewsAPI error: ${message}`);
  }
  return data.articles || [];
}

function dedupeArticles(list) {
  const unique = [];
  const seen = new Set();
  for (const a of list) {
    const key = (a.url || a.title || '').toLowerCase().trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(a);
  }
  return unique;
}

/**
 * Prefer last 6 hours; if fewer than 3 matches, widen to 48h (NewsAPI often lags; still newest-first).
 */
function pickArticles(rawArticles, nowMs) {
  const withTime = rawArticles.filter((a) => !Number.isNaN(Date.parse(a.publishedAt)));
  const sorted = [...withTime].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  );

  const within = (maxAgeMs) =>
    dedupeArticles(
      sorted.filter((a) => {
        const t = Date.parse(a.publishedAt);
        if (nowMs - t > maxAgeMs) return false;
        return isRelevantArticle(a);
      })
    );

  let chosen = within(SIX_H_MS);
  if (chosen.length < 3) {
    chosen = within(FORTY_EIGHT_H_MS);
  }

  return chosen.slice(0, 6);
}

async function buildStoryItem(article, index, nowMs) {
  const originalTitle = stripHtml(article.title || 'Headline').slice(0, 200);
  const description = stripHtml(article.description || '');
  const source = article.source?.name || 'Unknown';
  const url = article.url || '#';
  const publishedAtMs = Date.parse(article.publishedAt);

  let summaryEn =
    description.length > 40 ? description : `${originalTitle} (${source} report).`;
  const sentences = summaryEn.split(/(?<=[.!?])\s+/).filter(Boolean);
  summaryEn = sentences.slice(0, 2).join(' ').slice(0, 400);
  if (!summaryEn.endsWith('.') && !summaryEn.endsWith('!') && !summaryEn.endsWith('?')) {
    summaryEn += '.';
  }

  const titleVi = stripHashtagsVi(await googleTranslate(originalTitle, 'en', 'vi'));
  const summaryVi = stripHashtagsVi(await googleTranslate(summaryEn, 'en', 'vi'));

  return {
    n: index + 1,
    originalTitle,
    titleVi: titleVi.slice(0, 200),
    summaryEn,
    summaryVi: summaryVi.slice(0, 500),
    source,
    url,
    relativeVi: relativeTimeVi(publishedAtMs, nowMs),
    relativeEn: relativeTimeEn(publishedAtMs, nowMs),
  };
}

function buildVietnameseHtml(stories) {
  const blocks = [
    '<p style="font-size:1.05rem;color:#374151;margin:0 0 1.5rem 0;">Tổng hợp tin nổi bật về Forex và thị trường trong vài giờ qua. Chỉ gồm tiêu đề + tóm tắt ngắn, kèm link bài gốc.</p>',
    '<h2 style="font-size:1.25rem;margin:0 0 1rem 0;padding-bottom:0.5rem;border-bottom:2px solid #2563eb;">Tin tức chính</h2>',
  ];

  for (const s of stories) {
    blocks.push(
      `<div style="margin:0 0 1.25rem 0;padding:1.25rem 1.5rem;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;">`,
      `  <p style="margin:0 0 0.35rem 0;font-size:0.75rem;color:#2563eb;font-weight:600;">TIN ${s.n}</p>`,
      `  <h3 style="margin:0 0 0.35rem 0;font-size:1.1rem;line-height:1.4;">${escapeHtml(s.titleVi)}</h3>`,
      `  <p style="margin:0 0 0.75rem 0;font-size:0.85rem;color:#6b7280;font-style:italic;">${escapeHtml(s.originalTitle)}</p>`,
      `  <p style="margin:0 0 0.5rem 0;font-size:0.9rem;color:#4b5563;"><strong>Nguồn:</strong> ${escapeHtml(s.source)} · ${escapeHtml(s.relativeVi)}</p>`,
      `  <p style="margin:0 0 0.85rem 0;color:#111827;line-height:1.7;">${escapeHtml(s.summaryVi)}</p>`,
      `  <p style="margin:0;"><a href="${escapeAttr(s.url)}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-weight:600;text-decoration:none;">Đọc bài gốc →</a></p>`,
      `</div>`
    );
  }

  blocks.push(
    '<p style="margin:1.5rem 0 0 0;padding:1rem 1.25rem;background:#eff6ff;border-radius:10px;color:#1e3a8a;font-size:0.95rem;">Đây là bản tổng hợp tiêu đề từ nguồn quốc tế, không sao chép nội dung gốc. Click link để đọc bài đầy đủ.</p>'
  );

  return blocks.join('\n');
}

function buildEnglishHtml(stories) {
  const blocks = [
    '<p style="font-size:1.05rem;color:#374151;margin:0 0 1.5rem 0;">A short roundup of notable Forex and market headlines from the past few hours. Titles, brief summaries, and original links only.</p>',
    '<h2 style="font-size:1.25rem;margin:0 0 1rem 0;padding-bottom:0.5rem;border-bottom:2px solid #2563eb;">Top stories</h2>',
  ];

  for (const s of stories) {
    blocks.push(
      `<div style="margin:0 0 1.25rem 0;padding:1.25rem 1.5rem;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;">`,
      `  <p style="margin:0 0 0.35rem 0;font-size:0.75rem;color:#2563eb;font-weight:600;">STORY ${s.n}</p>`,
      `  <h3 style="margin:0 0 0.35rem 0;font-size:1.1rem;line-height:1.4;">${escapeHtml(s.originalTitle)}</h3>`,
      `  <p style="margin:0 0 0.5rem 0;font-size:0.9rem;color:#4b5563;"><strong>Source:</strong> ${escapeHtml(s.source)} · ${escapeHtml(s.relativeEn)}</p>`,
      `  <p style="margin:0 0 0.85rem 0;color:#111827;line-height:1.7;">${escapeHtml(s.summaryEn)}</p>`,
      `  <p style="margin:0;"><a href="${escapeAttr(s.url)}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-weight:600;text-decoration:none;">Read original →</a></p>`,
      `</div>`
    );
  }

  blocks.push(
    '<p style="margin:1.5rem 0 0 0;padding:1rem 1.25rem;background:#eff6ff;border-radius:10px;color:#1e3a8a;font-size:0.95rem;">This is a headline roundup from international sources. It does not copy original articles. Follow the link to read the full story.</p>'
  );

  return blocks.join('\n');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/'/g, '&#39;');
}

function buildExcerpts(stories) {
  const titlesVi = stories.map((s) => s.titleVi);
  const titlesEn = stories.map((s) => s.originalTitle);
  const excerpt =
    `Tóm tắt nhanh: ${titlesVi.slice(0, 3).join('; ')}`.slice(0, 490);
  const excerptEn = `Quick take: ${titlesEn.slice(0, 3).join('; ')}`.slice(0, 490);
  return { excerpt, excerptEn };
}

function buildSlackMessage(storyCount, slug, vietnameseTitles, postedAtVi) {
  const lines = [
    '📰 Tổng hợp tin Forex đã đăng!',
    '',
    `🗞️ ${storyCount} tin nổi bật`,
    `📅 ${postedAtVi} (GMT+7)`,
    `🔗 https://thebenchmarktrader.com/blog/${slug}`,
    '',
    'Tin chính:',
  ];
  for (const t of vietnameseTitles.slice(0, 3)) {
    lines.push(`• ${t}`);
  }
  return lines.join('\n');
}

async function postBlog(body, apiKey) {
  const res = await fetch('https://thebenchmarktrader.com/api/admin/blog', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function main() {
  loadEnv();
  const newsKey = process.env.NEWS_API_KEY;
  const blogKey = process.env.AUTOMATION_BLOG_API_KEY;

  if (!newsKey) {
    console.error(JSON.stringify({ error: 'NEWS_API_KEY missing' }));
    process.exit(1);
  }

  const now = new Date();
  const nowMs = now.getTime();

  let raw;
  try {
    raw = await fetchNewsArticles(newsKey);
  } catch (e) {
    console.error(JSON.stringify({ error: String(e.message) }));
    process.exit(1);
  }

  const picked = pickArticles(raw, nowMs);

  const result = {
    action: 'skip',
    articleCount: picked.length,
    reason: null,
    blog: null,
    slackDraft: null,
  };

  if (picked.length < 3) {
    result.reason = 'insufficient_articles';
    result.slackDraft =
      `⚠️ Forex roundup: chỉ có ${picked.length} tin phù hợp trong 6 giờ qua (cần ít nhất 3). Không đăng blog.`;
    console.log(JSON.stringify(result));
    return result;
  }

  const stories = [];
  for (let i = 0; i < picked.length; i++) {
    stories.push(await buildStoryItem(picked[i], i, nowMs));
    await new Promise((r) => setTimeout(r, 120));
  }

  const content = buildVietnameseHtml(stories);
  const content_en = buildEnglishHtml(stories);
  const { excerpt, excerptEn } = buildExcerpts(stories);
  const { ddmmyyyy, hhmm } = slugTimeParts(now);
  const slug = `tong-hop-tin-forex-${ddmmyyyy}-${hhmm}`;
  const title = `Tổng hợp tin Forex - ${formatVietnamTitleDate(now)}`;
  const title_en = `Forex News Roundup - ${formatEnglishTitleDate(now)}`;

  const body = {
    title,
    title_en,
    slug,
    excerpt,
    excerpt_en: excerptEn,
    content,
    content_en,
    author: 'ThebenchmarkTrader',
    category: 'news',
    tags: ['forex', 'tin-tuc', 'tong-hop'],
    date: isoPublishDate(now),
    status: 'published',
  };

  if (!blogKey) {
    result.reason = 'AUTOMATION_BLOG_API_KEY missing';
    result.slackDraft = buildSlackMessage(
      stories.length,
      slug,
      stories.map((s) => s.titleVi),
      formatVietnamTitleDate(now)
    );
    console.log(JSON.stringify(result));
    return result;
  }

  let blogRes = await postBlog(body, blogKey);

  if (!blogRes.ok && blogRes.status === 400) {
    const msg = JSON.stringify(blogRes.data || {});
    if (/title_en|excerpt_en|content_en|Vietnamese/i.test(msg)) {
      const fixed = {
        ...body,
        title_en: await googleTranslate(body.title, 'vi', 'en').then((t) =>
          t.slice(0, 190)
        ),
        excerpt_en: await googleTranslate(body.excerpt, 'vi', 'en').then((t) =>
          t.slice(0, 480)
        ),
        content_en: body.content_en,
      };
      blogRes = await postBlog(fixed, blogKey);
    }
  }

  result.blog = { status: blogRes.status, data: blogRes.data };

  if (!blogRes.ok) {
    if (blogRes.status === 409) {
      result.action = 'duplicate';
      result.slackDraft = 'Forex roundup: already published (409).';
    } else {
      result.action = 'error';
      result.reason = `blog_${blogRes.status}`;
    }
    console.log(JSON.stringify(result));
    return result;
  }

  result.action = 'published';
  result.slackDraft = buildSlackMessage(
    stories.length,
    blogRes.data?.post?.slug || slug,
    stories.map((s) => s.titleVi),
    formatVietnamTitleDate(now)
  );

  console.log(JSON.stringify(result));
  return result;
}

if (require.main === module) {
  main().catch((e) => {
    console.error(JSON.stringify({ error: e.message }));
    process.exit(1);
  });
}

module.exports = { main, pickArticles, buildVietnameseHtml, buildEnglishHtml };
