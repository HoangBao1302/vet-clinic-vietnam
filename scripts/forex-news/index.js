#!/usr/bin/env node

require('dotenv').config();

const { fetchAllArticles } = require('./fetchers');
const {
  getRateLimitStatus,
  getPostedUrls,
  recordPostedUrls,
} = require('./api-usage');
const {
  processArticles,
  formatSlackMessage,
  formatRateLimitMessage,
} = require('./format');

async function runForexNewsUpdate() {
  const preCheck = getRateLimitStatus();
  if (preCheck.limited) {
    return {
      action: 'rate_limited',
      message: formatRateLimitMessage(
        preCheck.provider,
        preCheck.resumeInHours
      ),
      articles: [],
    };
  }

  const { articles: rawArticles, rateLimited, errors } =
    await fetchAllArticles();

  if (rateLimited) {
    const status = getRateLimitStatus();
    if (status.limited) {
      return {
        action: 'rate_limited',
        message: formatRateLimitMessage(
          status.provider,
          status.resumeInHours
        ),
        articles: [],
      };
    }
  }

  const postedUrls = getPostedUrls();
  const articles = processArticles(rawArticles, postedUrls);

  if (articles.length === 0) {
    return {
      action: 'skip',
      message: null,
      articles: [],
      errors,
      debug: {
        fetched: rawArticles.length,
        reason:
          rawArticles.length === 0
            ? 'no_articles_from_api'
            : 'no_recent_or_new_articles',
      },
    };
  }

  const message = formatSlackMessage(articles);
  recordPostedUrls(articles.map((a) => a.url));

  return {
    action: 'post',
    message,
    articles,
    errors,
  };
}

async function main() {
  try {
    const result = await runForexNewsUpdate();
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(
      JSON.stringify({
        action: 'error',
        message: error.message,
      })
    );
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runForexNewsUpdate };
