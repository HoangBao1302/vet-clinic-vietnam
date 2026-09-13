const { MAX_ARTICLES, MAX_ARTICLE_AGE_MS } = require('./config');

function normalizeTitle(title) {
  return (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isRecent(publishedAt, now = Date.now()) {
  if (!publishedAt) return false;
  const published = new Date(publishedAt).getTime();
  if (Number.isNaN(published)) return false;
  return now - published < MAX_ARTICLE_AGE_MS;
}

function dedupeArticles(articles, postedUrls = new Set()) {
  const seenTitles = new Set();
  const result = [];

  for (const article of articles) {
    if (!article?.title || !article?.url) continue;
    if (postedUrls.has(article.url)) continue;

    const normalized = normalizeTitle(article.title);
    if (!normalized || seenTitles.has(normalized)) continue;

    seenTitles.add(normalized);
    result.push(article);
  }

  return result;
}

function filterRecentArticles(articles) {
  return articles.filter((article) => isRecent(article.publishedAt));
}

function formatSlackMessage(articles, timestamp = new Date()) {
  const timeLabel = timestamp.toUTCString().replace(' GMT', ' UTC');

  const lines = [`📰 Forex News Update - ${timeLabel}`, ''];

  for (const article of articles) {
    lines.push(`🔹 ${article.title}`);
    lines.push(`   Source: ${article.source}`);
    lines.push(`   Link → ${article.url}`);
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

function formatRateLimitMessage(provider, resumeInHours) {
  return `API limit reached for ${provider}, will resume in ${resumeInHours} hours`;
}

function processArticles(rawArticles, postedUrls) {
  const recent = filterRecentArticles(rawArticles);
  const unique = dedupeArticles(recent, postedUrls)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, MAX_ARTICLES);

  return unique;
}

module.exports = {
  processArticles,
  formatSlackMessage,
  formatRateLimitMessage,
  filterRecentArticles,
  dedupeArticles,
};
