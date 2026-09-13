const fs = require('fs');
const path = require('path');
const { STATE_FILE, NEWS_API_LIMIT, ALPHA_VANTAGE_LIMIT } = require('./config');

const DEFAULT_STATE = {
  newsApi: { date: null, count: 0 },
  alphaVantage: { date: null, count: 0 },
  postedUrls: [],
};

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

function loadState() {
  try {
    if (!fs.existsSync(STATE_FILE)) {
      return { ...DEFAULT_STATE, postedUrls: [] };
    }

    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      postedUrls: Array.isArray(parsed.postedUrls) ? parsed.postedUrls : [],
    };
  } catch {
    return { ...DEFAULT_STATE, postedUrls: [] };
  }
}

function saveState(state) {
  const dir = path.dirname(STATE_FILE);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function resetIfNewDay(usage) {
  const today = todayUtc();
  if (usage.date !== today) {
    return { date: today, count: 0 };
  }
  return usage;
}

function getUsage() {
  const state = loadState();
  return {
    newsApi: resetIfNewDay(state.newsApi),
    alphaVantage: resetIfNewDay(state.alphaVantage),
    postedUrls: state.postedUrls,
  };
}

function canCall(provider) {
  const usage = getUsage();
  const limit = provider === 'newsApi' ? NEWS_API_LIMIT : ALPHA_VANTAGE_LIMIT;
  const current = usage[provider];
  return current.count < limit;
}

function recordCall(provider) {
  const state = loadState();
  const usage = resetIfNewDay(state[provider]);
  usage.count += 1;
  state[provider] = usage;
  saveState(state);
  return usage;
}

function hoursUntilReset() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCHours(24, 0, 0, 0);
  const ms = tomorrow.getTime() - now.getTime();
  return Math.max(1, Math.ceil(ms / (60 * 60 * 1000)));
}

function getRateLimitStatus() {
  const usage = getUsage();

  if (usage.newsApi.count >= NEWS_API_LIMIT) {
    return {
      limited: true,
      provider: 'NewsAPI',
      resumeInHours: hoursUntilReset(),
    };
  }

  if (usage.alphaVantage.count >= ALPHA_VANTAGE_LIMIT) {
    return {
      limited: true,
      provider: 'Alpha Vantage',
      resumeInHours: hoursUntilReset(),
    };
  }

  return { limited: false };
}

function recordPostedUrls(urls) {
  const state = loadState();
  const merged = [...new Set([...state.postedUrls, ...urls])];
  state.postedUrls = merged.slice(-500);
  saveState(state);
}

function getPostedUrls() {
  return new Set(getUsage().postedUrls);
}

module.exports = {
  canCall,
  recordCall,
  getRateLimitStatus,
  recordPostedUrls,
  getPostedUrls,
  getUsage,
};
