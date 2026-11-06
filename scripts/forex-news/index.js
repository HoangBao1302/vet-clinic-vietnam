#!/usr/bin/env node
/**
 * Forex / markets headline roundup: NewsAPI → bilingual HTML blog post → stdout for automation Slack.
 *
 * Env: NEWS_API_KEY, AUTOMATION_BLOG_API_KEY
 * Optional: FOREX_ROUNDUP_DRY_RUN=1 (fetch + build only, no POST)
 */
'use strict';

const fs = require('fs');
const path = require('path');

const STATE_DIR = '/cursor/stores/automation';
const STATE_FILE = path.join(STATE_DIR, 'forex-roundup-state.json');

const NEWS_API_QUERY =
  'forex OR "EUR/USD" OR gold OR oil OR "federal reserve" OR "stock market"';

const ARTICLE_PREFER_MAX_AGE_MS = 6 * 60 * 60 * 1000;
const ARTICLE_FALLBACK_MAX_AGE_MS = 48 * 60 * 60 * 1000;
const MIN_ARTICLES = 3;
const MAX_ARTICLES = 6;
const TARGET_FETCH = 30;
const TRANSLATE_DELAY_MS = 200;

const VIETNAMESE_RE =
  /[àáạảãăằắặẳẵâầấậẩẫèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃĂẰẮẶẲẴÂẦẤẬẨẪÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/;

function loadEnv() {
  try {
    require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });
  } catch {
    /* optional */
  }
}

function looksVietnamese(text) {
  return typeof text === 'string' && text.length > 0 && VIETNAMESE_RE.test(text);
}

function stripHtml(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadState() {
  try {
    if (!fs.existsSync(STATE_FILE)) {
      return { publishedSlugs: [] };
    }
    const parsed = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    return {
      publishedSlugs: Array.isArray(parsed.publishedSlugs) ? parsed.publishedSlugs : [],
    };
  } catch {
    return { publishedSlugs: [] };
  }
}

function saveState(state) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  const trimmed = (state.publishedSlugs || []).slice(-200);
  fs.writeFileSync(
    STATE_FILE,
    JSON.stringify({ publishedSlugs: trimmed, updatedAt: new Date().toISOString() }, null, 2)
  );
}

/** Vietnam time (GMT+7) for titles and Slack */
function getVietnamDate(now = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const pick = (t) => parts.find((p) => p.type === t)?.value || '';
  const y = pick('year');
  const mo = pick('month');
  const d = pick('day');
  const h = pick('hour');
  const mi = pick('minute');
  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthNum = parseInt(mo, 10);
  const monthEn = monthsEn[monthNum - 1] || 'January';
  return {
    ddmmyyyy: `${d}/${mo}/${y}`,
    hhmm: `${h}:${mi}`,
    ddmmyyyyCompact: `${d}${mo}${y}`,
    hhmmCompact: `${h}${mi}`,
    slugTime: `${d}${mo}${y}-${h}${mi}`,
    monthEn,
    dayNum: parseInt(d, 10),
    yearNum: parseInt(y, 10),
    isoLocalVi: `${y}-${mo}-${d}T${h}:${mi}:00+07:00`,
  };
}

function relativeTimeVi(publishedAt, now = Date.now()) {
  const t = new Date(publishedAt).getTime();
  if (Number.isNaN(t)) return 'gần đây';
  const diff = Math.max(0, now - t);
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'vừa xong';
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  return `${d} ngày trước`;
}

function relativeTimeEn(publishedAt, now = Date.now()) {
  const t = new Date(publishedAt).getTime();
  if (Number.isNaN(t)) return 'recently';
  const diff = Math.max(0, now - t);
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? '' : 's'} ago`;
}

const OFF_TOPIC_RE =
  /\b(nfl|nba|nhl|mlb|ufc|packers|chiefs|lakers|celebrity|gossip|beyonc|taylor swift|movie trailer|healthcare|hospital|surgery|covid vaccine|k-pop|reality show|pachinko|free play days|playstation|xbox|video game|dating show|kashmir|anantnag|football|soccer|uniforms vs|midnight football|savannah james|zhuri)\b/i;

/** Title or description must mention core markets (reduces sports/celebrity noise). */
const CORE_MARKET_RE =
  /\b(forex|fx\b|eur\/usd|gbp\/usd|usd\/jpy|currency|currencies|exchange rate|foreign exchange|central bank|fed\b|federal reserve|ecb|boj|boe|interest rate|rate cut|rate hike|bond yield|treasury|inflation|cpi|ppi|gold\b|silver\b|xau|xag|oil\b|brent|wti|crude|opec|commodit|stock market|stocks\b|equities|s&p\b|nasdaq|dow jones|trading session|traders|usd\b|dxy|dollar index|euro\b|yen\b|yuan\b)\b/i;

const STRONG_MARKET_RE =
  /\b(forex|fx\b|currency|currencies|usd\b|eur\/usd|dxy|dollar|euro|yen|yuan|pound sterling|gold|xau|oil|brent|wti|opec|fed\b|federal reserve|interest rate|ecb|cpi|inflation|treasury|bond yield|stock market|s&p|nasdaq|dow jones|stocks|traders|trading|commodit|bitcoin|btc\b|crypto)\b/i;

function isOffTopic(article) {
  const blob = `${article.title} ${article.description || ''}`;
  if (OFF_TOPIC_RE.test(blob)) return true;
  // Geopolitical / conflict headlines unless they clearly tie to prices or markets
  if (
    /\b(hormuz|blockade|warships|sanctions on iran|military strike)\b/i.test(blob) &&
    !/\b(oil price|crude|brent|wti|energy market|gasoline|diesel|commodit|traders|investors|stocks|forex|inflation)\b/i.test(
      blob
    )
  ) {
    return true;
  }
  // Consumer auto / lifestyle (not markets)
  if (/\b(automaker|car makers|dealership|vehicles you want|recession cars|recessionmobiles|want automakers to build)\b/i.test(blob)) {
    return true;
  }
  return false;
}

function relevanceScore(article) {
  const blob = `${article.title} ${article.description || ''}`;
  let score = 0;
  if (STRONG_MARKET_RE.test(blob)) score += 4;
  if (/\b(forex|eur\/usd|fx\b|currency|currencies|usd\b|dxy|fed|federal reserve|gold|xau|oil|brent|wti|stock market|s&p|nasdaq|dow)\b/i.test(blob)) {
    score += 2;
  }
  if (/\b(fed|forex|gold|oil|usd|eur|yen|stocks|market|trading|inflation|rates?)\b/i.test(blob)) {
    score += 1;
  }
  return score;
}

function isMarketRelevant(article) {
  const blob = `${article.title} ${article.description || ''}`;
  if (!CORE_MARKET_RE.test(blob)) {
    return false;
  }
  if (relevanceScore(article) < 3) {
    return false;
  }
  // Soft lifestyle / auto content that still matched "stock" loosely
  if (/\b(recession[- ]era|automaker|dealership|concept car|vehicles you want)\b/i.test(blob)) {
    return /\b(stock market|nasdaq|s&p|dow jones|equities|shares|earnings|fed|forex|oil price|gold)\b/i.test(
      blob
    );
  }
  return true;
}

function dedupeByUrl(articles) {
  const seen = new Set();
  const out = [];
  for (const a of articles) {
    const u = (a.url || '').trim().toLowerCase();
    if (!u || seen.has(u)) continue;
    seen.add(u);
    out.push(a);
  }
  return out;
}

function extractEnglishSummary(description, title) {
  const text = stripHtml(description);
  if (!text) {
    return `Market watchers are discussing this headline: ${String(title).slice(0, 140)}.`;
  }
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);
  let sum = sentences.slice(0, 2).join(' ');
  if (!sum) sum = text.slice(0, 220);
  if (sum.length > 360) sum = sum.slice(0, 357).trim() + '...';
  return sum;
}

async function translateMyMemory(text, langpair) {
  const q = encodeURIComponent(String(text).slice(0, 450));
  const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=${langpair}`;
  const res = await fetch(url);
  const data = await res.json();
  const out = data?.responseData?.translatedText;
  if (!out || typeof out !== 'string') {
    throw new Error('MyMemory: no translation');
  }
  return out.trim();
}

async function translateEnToVi(text) {
  await sleep(TRANSLATE_DELAY_MS);
  return translateMyMemory(text, 'en|vi');
}

async function translateViToEn(text) {
  await sleep(TRANSLATE_DELAY_MS);
  return translateMyMemory(text, 'vi|en');
}

function cleanMyMemoryOutput(text) {
  return String(text || '')
    .replace(/\s*MYMEMORY\s+WARNING[\s\S]*$/i, '')
    .replace(/\s*!\s*!+\s*$/g, '')
    .trim();
}

async function fetchNewsApi(apiKey) {
  const params = new URLSearchParams({
    q: NEWS_API_QUERY,
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: String(TARGET_FETCH),
    apiKey,
  });
  const response = await fetch(`https://newsapi.org/v2/everything?${params.toString()}`);
  const data = await response.json();
  if (!response.ok) {
    const message = data?.message || data?.code || `HTTP ${response.status}`;
    throw new Error(`NewsAPI error: ${message}`);
  }
  return (data.articles || [])
    .map((article) => ({
      title: stripHtml(article.title || ''),
      description: article.description || '',
      url: (article.url || '').trim(),
      source: article.source?.name || 'Unknown',
      publishedAt: article.publishedAt,
    }))
    .filter((a) => a.title && a.url);
}

function buildVietnameseHtml(items) {
  const headerIntro =
    '<p style="font-size:1.05rem;color:#374151;margin:0 0 1.5rem 0;">Tổng hợp tin nổi bật về Forex và thị trường trong vài giờ qua. Chỉ gồm tiêu đề + tóm tắt ngắn, kèm link bài gốc.</p>';
  const h2 =
    '<h2 style="font-size:1.25rem;margin:0 0 1rem 0;padding-bottom:0.5rem;border-bottom:2px solid #2563eb;">Tin tức chính</h2>';
  const cards = items
    .map(
      (it, i) => `
<div style="margin:0 0 1.25rem 0;padding:1.25rem 1.5rem;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;">
  <p style="margin:0 0 0.35rem 0;font-size:0.75rem;color:#2563eb;font-weight:600;">TIN ${i + 1}</p>
  <h3 style="margin:0 0 0.35rem 0;font-size:1.1rem;line-height:1.4;">${escapeHtml(it.titleVi)}</h3>
  <p style="margin:0 0 0.75rem 0;font-size:0.85rem;color:#6b7280;font-style:italic;">${escapeHtml(it.titleEn)}</p>
  <p style="margin:0 0 0.5rem 0;font-size:0.9rem;color:#4b5563;"><strong>Nguồn:</strong> ${escapeHtml(it.source)} · ${escapeHtml(it.relVi)}</p>
  <p style="margin:0 0 0.85rem 0;color:#111827;line-height:1.7;">${escapeHtml(it.summaryVi)}</p>
  <p style="margin:0;"><a href="${escapeAttr(it.url)}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-weight:600;text-decoration:none;">Đọc bài gốc →</a></p>
</div>`
    )
    .join('\n');

  const footer =
    '<p style="margin:1.5rem 0 0 0;padding:1rem 1.25rem;background:#eff6ff;border-radius:10px;color:#1e3a8a;font-size:0.95rem;">Đây là bản tổng hợp tiêu đề từ nguồn quốc tế, không sao chép nội dung gốc. Click link để đọc bài đầy đủ.</p>';

  return [headerIntro, h2, cards.trim(), footer].join('\n');
}

function buildEnglishHtml(items) {
  const headerIntro =
    '<p style="font-size:1.05rem;color:#374151;margin:0 0 1.5rem 0;">A short roundup of notable Forex and market headlines from the past few hours. Titles, brief summaries, and original links only.</p>';
  const h2 =
    '<h2 style="font-size:1.25rem;margin:0 0 1rem 0;padding-bottom:0.5rem;border-bottom:2px solid #2563eb;">Top stories</h2>';
  const cards = items
    .map(
      (it, i) => `
<div style="margin:0 0 1.25rem 0;padding:1.25rem 1.5rem;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;">
  <p style="margin:0 0 0.35rem 0;font-size:0.75rem;color:#2563eb;font-weight:600;">STORY ${i + 1}</p>
  <h3 style="margin:0 0 0.35rem 0;font-size:1.1rem;line-height:1.4;">${escapeHtml(it.titleEn)}</h3>
  <p style="margin:0 0 0.5rem 0;font-size:0.9rem;color:#4b5563;"><strong>Source:</strong> ${escapeHtml(it.source)} · ${escapeHtml(it.relEn)}</p>
  <p style="margin:0 0 0.85rem 0;color:#111827;line-height:1.7;">${escapeHtml(it.summaryEn)}</p>
  <p style="margin:0;"><a href="${escapeAttr(it.url)}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-weight:600;text-decoration:none;">Read original →</a></p>
</div>`
    )
    .join('\n');

  const footer =
    '<p style="margin:1.5rem 0 0 0;padding:1rem 1.25rem;background:#eff6ff;border-radius:10px;color:#1e3a8a;font-size:0.95rem;">This is a headline roundup from international sources. It does not copy original articles. Follow the link to read the full story.</p>';

  return [headerIntro, h2, cards.trim(), footer].join('\n');
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

function formatSlackMarkdown(items, slug, vd) {
  const lines = [
    '📰 *Tổng hợp tin Forex đã đăng!*',
    '',
    `🗞️ *${items.length}* tin nổi bật`,
    `📅 *${vd.ddmmyyyy} ${vd.hhmm}* (GMT+7)`,
    `🔗 https://thebenchmarktrader.com/blog/${slug}`,
    '',
    '*Tin chính:*',
  ];
  const top = items.slice(0, 3);
  for (const it of top) {
    lines.push(`• ${it.titleVi}`);
  }
  return lines.join('\n');
}

function formatSlackSkipped(reason, extraLines = []) {
  return [
    '📰 *Tổng hợp tin Forex — không đăng bài*',
    '',
    `Lý do: ${reason}`,
    ...extraLines,
  ].join('\n');
}

async function postBlog(payload, apiKey) {
  const res = await fetch('https://thebenchmarktrader.com/api/admin/blog', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { ok: res.ok, status: res.status, json };
}

async function main() {
  loadEnv();

  const newsApiKey = process.env.NEWS_API_KEY;
  const blogApiKey = process.env.AUTOMATION_BLOG_API_KEY;
  const dryRun = process.env.FOREX_ROUNDUP_DRY_RUN === '1';

  const result = {
    action: 'skip',
    slackMessage: null,
    reason: null,
    blog: null,
  };

  if (!newsApiKey) {
    result.reason = 'missing_news_api_key';
    result.slackMessage = formatSlackSkipped('NEWS_API_KEY is not set.');
    console.log(JSON.stringify(result));
    return;
  }

  const now = Date.now();
  let articles;
  try {
    articles = await fetchNewsApi(newsApiKey);
  } catch (e) {
    result.reason = `newsapi:${e.message}`;
    result.slackMessage = formatSlackSkipped(`NewsAPI failed: ${e.message}`);
    console.log(JSON.stringify(result));
    return;
  }

  const deduped = dedupeByUrl(articles)
    .map((a) => {
      const pt = new Date(a.publishedAt).getTime();
      return { ...a, _publishedMs: pt };
    })
    .filter((a) => !Number.isNaN(a._publishedMs));

  const recentPrefer = deduped.filter((a) => now - a._publishedMs <= ARTICLE_PREFER_MAX_AGE_MS);
  const recentFallback = deduped.filter((a) => now - a._publishedMs <= ARTICLE_FALLBACK_MAX_AGE_MS);

  function pickPool(pool) {
    return pool
      .filter((a) => !isOffTopic(a))
      .filter((a) => isMarketRelevant(a))
      .sort(
        (a, b) =>
          relevanceScore(b) - relevanceScore(a) || b._publishedMs - a._publishedMs
      );
  }

  let filtered = pickPool(recentPrefer);
  let windowNote = '6 giờ';
  if (filtered.length < MIN_ARTICLES) {
    filtered = pickPool(recentFallback);
    windowNote = '48 giờ (fallback vì ít tin trong 6 giờ)';
  }

  const picked = filtered.slice(0, MAX_ARTICLES).map(({ _publishedMs, ...rest }) => rest);

  if (picked.length < MIN_ARTICLES) {
    result.action = 'slack_only';
    result.reason = `too_few_articles:${picked.length}`;
    result.slackMessage = formatSlackSkipped(
      `Chỉ có ${picked.length} bài thị trường liên quan trong ${windowNote} (cần ít nhất ${MIN_ARTICLES}).`,
      [
        `NewsAPI trả về ${articles.length} bài; sau lọc trùng còn ${deduped.length}.`,
        `Ưu tiên 6h: ${recentPrefer.length} bài; mở rộng 48h: ${recentFallback.length} bài.`,
      ]
    );
    console.log(JSON.stringify(result));
    return;
  }

  const vd = getVietnamDate(new Date());

  /** @type {Array<{titleEn: string, titleVi: string, summaryEn: string, summaryVi: string, source: string, url: string, publishedAt: string, relVi: string, relEn: string}>} */
  const items = [];

  for (const a of picked) {
    const titleEn = a.title;
    const summaryEn = extractEnglishSummary(a.description, titleEn);
    let titleVi = cleanMyMemoryOutput(await translateEnToVi(titleEn));
    let summaryVi = cleanMyMemoryOutput(await translateEnToVi(summaryEn));

    if (!looksVietnamese(titleVi)) {
      titleVi = cleanMyMemoryOutput(await translateEnToVi(titleEn));
    }
    if (!looksVietnamese(titleVi)) {
      titleVi = `Tin thị trường: ${titleEn}`;
    }
    if (!looksVietnamese(summaryVi)) {
      summaryVi = cleanMyMemoryOutput(await translateEnToVi(summaryEn));
    }
    if (!looksVietnamese(summaryVi)) {
      summaryVi =
        'Bài viết nhấn mạnh các diễn biến gần đây liên quan đến thị trường tài chính; xem link để nắm đầy đủ ngữ cảnh.';
    }

    items.push({
      titleEn,
      titleVi,
      summaryEn,
      summaryVi,
      source: a.source,
      url: a.url,
      publishedAt: a.publishedAt,
      relVi: relativeTimeVi(a.publishedAt, now),
      relEn: relativeTimeEn(a.publishedAt, now),
    });
  }

  const slug = `tong-hop-tin-forex-${vd.slugTime}`;

  const state = loadState();
  if (state.publishedSlugs.includes(slug)) {
    result.action = 'skip';
    result.reason = 'duplicate_slug_state';
    result.slackMessage = formatSlackSkipped('already published (slug in state)', [`Slug: ${slug}`]);
    console.log(JSON.stringify(result));
    return;
  }

  const excerptVi = items
    .slice(0, 3)
    .map((i) => i.titleVi)
    .join('; ')
    .slice(0, 480);
  const excerptEn = items
    .slice(0, 3)
    .map((i) => i.titleEn)
    .join('; ')
    .slice(0, 480);

  const contentVi = buildVietnameseHtml(items);
  const contentEn = buildEnglishHtml(items);

  const titleVi = `Tổng hợp tin Forex - ${vd.ddmmyyyy} ${vd.hhmm}`;
  const titleEn = `Forex News Roundup - ${vd.monthEn} ${vd.dayNum}, ${vd.yearNum} ${vd.hhmm}`;

  let payload = {
    title: titleVi,
    title_en: titleEn,
    slug,
    excerpt: excerptVi,
    excerpt_en: excerptEn,
    content: contentVi,
    content_en: contentEn,
    author: 'ThebenchmarkTrader',
    category: 'news',
    tags: ['forex', 'tin-tuc', 'tong-hop'],
    date: new Date().toISOString(),
    status: 'published',
  };

  if (dryRun) {
    result.action = 'dry_run';
    result.blog = { slug, skipped: true };
    result.slackMessage = formatSlackMarkdown(items, slug, vd);
    console.log(JSON.stringify(result));
    return;
  }

  if (!blogApiKey) {
    result.reason = 'missing_blog_key';
    result.slackMessage = formatSlackSkipped('AUTOMATION_BLOG_API_KEY is not set.');
    console.log(JSON.stringify(result));
    return;
  }

  let post = await postBlog(payload, blogApiKey);

  if (!post.ok && post.status === 400 && post.json?.error) {
    const err = String(post.json.error);
    if (err.includes('title_en') && looksVietnamese(payload.title_en)) {
      payload.title_en = await translateViToEn(payload.title);
    }
    if (err.includes('excerpt_en') && looksVietnamese(payload.excerpt_en)) {
      payload.excerpt_en = await translateViToEn(payload.excerpt);
    }
    if (err.includes('content_en') && looksVietnamese(payload.content_en)) {
      payload.content_en = await translateViToEn(payload.content);
    }
    post = await postBlog(payload, blogApiKey);
  }

  if (!post.ok) {
    result.reason = `blog_api:${post.status}`;
    result.blog = post.json;
    result.slackMessage = formatSlackSkipped(`Blog API ${post.status}`, [JSON.stringify(post.json).slice(0, 400)]);
    console.log(JSON.stringify(result));
    return;
  }

  const updated = post.json?.updated === true;
  if (updated) {
    result.action = 'skip';
    result.reason = 'duplicate_roundup_updated_existing';
    result.slackMessage = [
      '📰 *Tổng hợp tin Forex*',
      '',
      'already published — bài với slug hoặc tiêu đề này đã có trên hệ thống (bản ghi được cập nhật).',
      `🔗 https://thebenchmarktrader.com/blog/${post.json?.post?.slug || slug}`,
    ].join('\n');
    console.log(JSON.stringify(result));
    return;
  }

  state.publishedSlugs.push(slug);
  saveState(state);

  result.action = 'published';
  result.blog = post.json;
  result.slackMessage = formatSlackMarkdown(items, slug, vd);
  console.log(JSON.stringify(result));
}

main().catch((error) => {
  console.error(
    JSON.stringify({
      action: 'error',
      message: error.message,
      stack: error.stack,
    })
  );
  process.exit(1);
});
