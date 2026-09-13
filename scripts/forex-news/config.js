const path = require('path');

const STATE_FILE = path.join(
  process.env.FOREX_NEWS_STATE_DIR || '/cursor/stores/automation',
  'forex-news-state.json'
);

const NEWS_API_LIMIT = 100;
const ALPHA_VANTAGE_LIMIT = 25;

const NEWS_API_QUERY = 'forex OR currency OR EUR/USD OR gold trading';
const MAX_ARTICLES = 5;
const MAX_ARTICLE_AGE_MS = 2 * 60 * 60 * 1000;

module.exports = {
  STATE_FILE,
  NEWS_API_LIMIT,
  ALPHA_VANTAGE_LIMIT,
  NEWS_API_QUERY,
  MAX_ARTICLES,
  MAX_ARTICLE_AGE_MS,
};
