#!/usr/bin/env node
'use strict';

const assert = require('assert');
const {
  isForexRelevant,
  isRecentArticle,
  dedupeArticles,
  formatSlackMessage,
  newsApiFromParam,
  ARTICLE_MAX_AGE_MS,
} = require('./index');

const now = Date.parse('2026-09-15T08:47:00.000Z');

assert.strictEqual(
  isForexRelevant({ title: 'EUR/USD rises as ECB holds rates', url: 'https://fxstreet.com/eurusd' }),
  true,
);

assert.strictEqual(
  isForexRelevant({ title: 'RadNet hires new CEO for digital health division', url: 'https://radiologybusiness.com/ceo' }),
  false,
);

assert.strictEqual(
  isForexRelevant({ title: 'PayPal stock is down', url: 'https://stl.news/paypal-stock' }),
  false,
);

assert.strictEqual(
  isRecentArticle({ publishedAt: '2026-09-15T07:00:00.000Z' }, now),
  true,
);

assert.strictEqual(
  isRecentArticle({ publishedAt: '2026-09-15T05:00:00.000Z' }, now),
  false,
);

const deduped = dedupeArticles([
  { title: 'Gold hits record high', url: 'https://example.com/gold' },
  { title: 'Gold hits record high', url: 'https://example.com/gold' },
  { title: 'Gold hits record high', url: 'https://example.com/gold-2' },
]);
assert.strictEqual(deduped.length, 2);

const fromParam = newsApiFromParam(2);
assert.match(fromParam, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);

const message = formatSlackMessage([
  {
    title: 'USD/JPY climbs on BOJ outlook',
    source: 'ForexLive',
    url: 'https://forexlive.com/usdjpy',
  },
], new Date('2026-09-15T08:47:00.000Z'));

assert.match(message, /^📰 Forex News Update - /);
assert.match(message, /USD\/JPY climbs on BOJ outlook/);
assert.match(message, /Source: ForexLive/);
assert.match(message, /Link → https:\/\/forexlive.com\/usdjpy/);

console.log('forex-news filter tests passed');
console.log(JSON.stringify({
  articleMaxAgeHours: ARTICLE_MAX_AGE_MS / (60 * 60 * 1000),
  newsApiFromParam: fromParam,
}));
