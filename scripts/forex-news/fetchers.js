const { NEWS_API_QUERY, MAX_ARTICLES } = require('./config');
const { canCall, recordCall } = require('./api-usage');

async function fetchNewsApi() {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return { articles: [], error: 'NEWS_API_KEY not configured' };
  }

  if (!canCall('newsApi')) {
    return { articles: [], rateLimited: true, provider: 'NewsAPI' };
  }

  const params = new URLSearchParams({
    q: NEWS_API_QUERY,
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: String(MAX_ARTICLES),
    apiKey,
  });

  const url = `https://newsapi.org/v2/everything?${params.toString()}`;

  try {
    const response = await fetch(url);
    recordCall('newsApi');

    if (response.status === 429) {
      return { articles: [], rateLimited: true, provider: 'NewsAPI' };
    }

    const data = await response.json();

    if (data.status === 'error') {
      const isRateLimit =
        data.code === 'rateLimited' ||
        /limit/i.test(data.message || '');
      return {
        articles: [],
        error: data.message,
        rateLimited: isRateLimit,
        provider: 'NewsAPI',
      };
    }

    const articles = (data.articles || []).map((article) => ({
      title: article.title,
      source: article.source?.name || 'Unknown',
      url: article.url,
      publishedAt: article.publishedAt,
      provider: 'NewsAPI',
    }));

    return { articles };
  } catch (error) {
    return { articles: [], error: error.message };
  }
}

async function fetchAlphaVantage() {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    return { articles: [], skipped: true };
  }

  if (!canCall('alphaVantage')) {
    return { articles: [], rateLimited: true, provider: 'Alpha Vantage' };
  }

  const params = new URLSearchParams({
    function: 'NEWS_SENTIMENT',
    topics: 'forex',
    limit: String(MAX_ARTICLES),
    apikey: apiKey,
  });

  const url = `https://www.alphavantage.co/query?${params.toString()}`;

  try {
    const response = await fetch(url);
    recordCall('alphaVantage');

    const data = await response.json();

    if (data.Note || data.Information) {
      const message = data.Note || data.Information;
      const isRateLimit = /limit|frequency|premium/i.test(message);
      return {
        articles: [],
        error: message,
        rateLimited: isRateLimit,
        provider: 'Alpha Vantage',
      };
    }

    const feed = data.feed || [];
    const articles = feed.map((item) => ({
      title: item.title,
      source: item.source || 'Unknown',
      url: item.url,
      publishedAt: item.time_published
        ? parseAlphaVantageDate(item.time_published)
        : null,
      provider: 'Alpha Vantage',
    }));

    return { articles };
  } catch (error) {
    return { articles: [], error: error.message };
  }
}

function parseAlphaVantageDate(raw) {
  // Format: 20240913T120000
  if (!raw || raw.length < 15) return null;
  const iso = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}T${raw.slice(9, 11)}:${raw.slice(11, 13)}:${raw.slice(13, 15)}Z`;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function fetchAllArticles() {
  const newsApiResult = await fetchNewsApi();
  const alphaResult = await fetchAlphaVantage();

  const rateLimited =
    newsApiResult.rateLimited || alphaResult.rateLimited
      ? {
          provider:
            newsApiResult.provider || alphaResult.provider || 'API',
        }
      : null;

  const articles = [
    ...(newsApiResult.articles || []),
    ...(alphaResult.articles || []),
  ];

  const errors = [newsApiResult.error, alphaResult.error].filter(Boolean);

  return { articles, rateLimited, errors };
}

module.exports = {
  fetchAllArticles,
  fetchNewsApi,
  fetchAlphaVantage,
};
