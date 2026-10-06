export interface TradingAccount {
  id: string;
  platform: string;
  accountName: string;
  accountNumber: string;
  broker: string;
  verified: boolean;
  stats: {
    gain: string;
    drawdown: string;
    winRate: string;
    profitFactor: string;
    tradingDays: string;
  };
  links: {
    profile?: string;
    copyTrade?: string;
    youtube?: string;
  };
  description: string;
  description_en: string;
  highlights: string[];
  highlights_en: string[];
  badge?: string;
  badge_en?: string;
  active: boolean;
  order: number;
}

export const tradingAccounts: TradingAccount[] = [
  {
    id: "mql5-account-1",
    platform: "MT4",
    accountName: "ThebenchmarkTrader Live #1",
    accountNumber: "9029831",
    broker: "Tickmill",
    verified: true,
    badge: "Verified trên MQL5.com",
    badge_en: "Verified on MQL5.com",
    active: true,
    order: 1,
    stats: {
      gain: "+10560%",
      drawdown: "28.5%",
      winRate: "77%",
      profitFactor: "1.65",
      tradingDays: "280 tuần",
    },
    links: {
      profile: "https://www.mql5.com/en/signals/2327790",
    },
    description:
      "Tài khoản giao dịch thực tế đầu tiên chạy phần mềm EA ThebenchmarkTrader trên nền tảng MetaTrader 4 (broker: Tickmill). Kết quả được xác minh độc lập trên MQL5.com.",
    description_en:
      "First live trading account running EA ThebenchmarkTrader software on MetaTrader 4 (broker: Tickmill). Results independently verified on MQL5.com.",
    highlights: [
      "✅ Verified trên MQL5.com (độc lập, không tự khai)",
      "📊 280 tuần giao dịch thực tế",
      "🛡️ Drawdown tối đa 28.5%",
      "⚙️ Risk setting: 1.5% mỗi lệnh",
      "🎯 Cặp tiền: EURUSD M5, AUDUSD M5, GBPUSD M5, AUDCAD M5",
    ],
    highlights_en: [
      "✅ Verified on MQL5.com (independent, not self-reported)",
      "📊 280 weeks of live trading",
      "🛡️ Maximum drawdown 28.5%",
      "⚙️ Risk setting: 1.5% per trade",
      "🎯 Pairs: EURUSD M5, AUDUSD M5, GBPUSD M5, AUDCAD M5",
    ],
  },
  {
    id: "tickmill-social-1",
    platform: "Tickmill",
    accountName: "FX2 Leo2026",
    accountNumber: "Tickmill_3104741",
    broker: "Tickmill",
    verified: true,
    badge: "Verified trên MQL5.com",
    badge_en: "Verified on MQL5.com",
    active: true,
    order: 2,
    stats: {
      gain: "+92%",
      drawdown: "8%",
      winRate: "79.8%",
      profitFactor: "2.14",
      tradingDays: "392 ngày",
    },
    links: {
      profile: "https://www.mql5.com/en/signals/2387965",
    },
    description:
      "Tài khoản giao dịch thực tế thứ hai, chạy phần mềm EA ThebenchmarkTrader trên Tickmill. Kết quả verified độc lập trên MQL5.com.",
    description_en:
      "Second live trading account running EA ThebenchmarkTrader software on Tickmill. Results independently verified on MQL5.com.",
    highlights: [
      "✅ Verified trên MQL5.com (độc lập)",
      "📊 392 ngày giao dịch thực tế",
      "🛡️ Drawdown tối đa 8%",
      "⚙️ Win rate 79.8%, Profit Factor 2.14",
      "🎯 Multi-pair trading",
    ],
    highlights_en: [
      "✅ Verified on MQL5.com (independent)",
      "📊 392 days of live trading",
      "🛡️ Maximum drawdown 8%",
      "⚙️ Win rate 79.8%, Profit Factor 2.14",
      "🎯 Multi-pair trading",
    ],
  },
  {
    id: "myfxbook-account-1",
    platform: "MT4",
    accountName: "FX1 Leo2026",
    accountNumber: "Tickmill_live8",
    broker: "Tickmill",
    verified: true,
    badge: "Verified trên MQL5.com",
    badge_en: "Verified on MQL5.com",
    active: true,
    order: 3,
    stats: {
      gain: "+172%",
      drawdown: "13.6%",
      winRate: "72.4%",
      profitFactor: "1.82",
      tradingDays: "406 ngày",
    },
    links: {
      profile: "https://www.mql5.com/en/signals/2387963",
    },
    description:
      "Tài khoản giao dịch thực tế thứ ba, chạy phần mềm EA ThebenchmarkTrader trên MetaTrader 4 (broker: Tickmill). 406 ngày giao dịch liên tục, verified trên MQL5.com.",
    description_en:
      "Third live trading account running EA ThebenchmarkTrader software on MetaTrader 4 (broker: Tickmill). 406 consecutive days of trading, verified on MQL5.com.",
    highlights: [
      "✅ Verified trên MQL5.com (độc lập)",
      "📊 406 ngày giao dịch thực tế",
      "🎯 Multi-pair trading",
      "📈 Equity curve đầy đủ trên MQL5.com",
    ],
    highlights_en: [
      "✅ Verified on MQL5.com (independent)",
      "📊 406 days of live trading",
      "🎯 Multi-pair trading",
      "📈 Full equity curve on MQL5.com",
    ],
  },
  {
    id: "mql5-account-2",
    platform: "MT4",
    accountName: "FX Flare CR2",
    accountNumber: "ThinkMarkets-Live 4",
    broker: "ThinkMarkets",
    verified: true,
    badge: "Verified trên MQL5.com",
    badge_en: "Verified on MQL5.com",
    active: true,
    order: 4,
    stats: {
      gain: "+158%",
      drawdown: "14.5%",
      winRate: "79%",
      profitFactor: "2.23",
      tradingDays: "462 ngày",
    },
    links: {
      profile: "https://www.mql5.com/en/signals/2364376",
    },
    description:
      "Tài khoản giao dịch thực tế thứ tư, chạy phần mềm EA ThebenchmarkTrader trên MetaTrader 4 (broker: ThinkMarkets). Cấu hình risk thấp hơn, verified trên MQL5.com.",
    description_en:
      "Fourth live trading account running EA ThebenchmarkTrader software on MetaTrader 4 (broker: ThinkMarkets). Lower risk configuration, verified on MQL5.com.",
    highlights: [
      "✅ Verified trên MQL5.com (độc lập)",
      "📊 462 ngày giao dịch thực tế",
      "⚙️ Risk setting: 1% mỗi lệnh",
      "🎯 Cặp tiền: AUDCAD, USDCAD, AUDUSD, NZDCAD, GBPUSD, EURGBP",
    ],
    highlights_en: [
      "✅ Verified on MQL5.com (independent)",
      "📊 462 days of live trading",
      "⚙️ Risk setting: 1% per trade",
      "🎯 Pairs: AUDCAD, USDCAD, AUDUSD, NZDCAD, GBPUSD, EURGBP",
    ],
  },
  {
    id: "puprime-social-1",
    platform: "Tickmill",
    accountName: "FX3 Leo2026",
    accountNumber: "Tickmill-Live 4",
    broker: "Tickmill",
    verified: true,
    badge: "Verified trên MQL5.com",
    badge_en: "Verified on MQL5.com",
    active: true,
    order: 5,
    stats: {
      gain: "+75%",
      drawdown: "25.3%",
      winRate: "77.3%",
      profitFactor: "1.35",
      tradingDays: "126 ngày",
    },
    links: {
      profile: "https://www.mql5.com/en/signals/2387969",
    },
    description:
      "Tài khoản giao dịch thực tế thứ năm, chạy phần mềm EA ThebenchmarkTrader trên Tickmill. 126 ngày giao dịch thực tế, verified trên MQL5.com.",
    description_en:
      "Fifth live trading account running EA ThebenchmarkTrader software on Tickmill. 126 days of live trading, verified on MQL5.com.",
    highlights: [
      "✅ Verified trên MQL5.com (độc lập)",
      "📊 126 ngày giao dịch thực tế",
      "🛡️ Drawdown tối đa 25.3%",
      "⚙️ Win rate 77.3%, Profit Factor 1.35",
    ],
    highlights_en: [
      "✅ Verified on MQL5.com (independent)",
      "📊 126 days of live trading",
      "🛡️ Maximum drawdown 25.3%",
      "⚙️ Win rate 77.3%, Profit Factor 1.35",
    ],
  },
];

const verifiedCopyById = new Map(tradingAccounts.map((account) => [account.id, account]));

/** Public pages use this copy so older stored wording is not shown. */
export function withVerifiedAccountCopy<T extends { id: string }>(accounts: T[]): T[] {
  return accounts.map((account) => {
    const copy = verifiedCopyById.get(account.id);
    if (!copy) return account;
    const current = account as T & { stats?: TradingAccount["stats"] };
    return {
      ...account,
      platform: copy.platform,
      broker: copy.broker,
      description: copy.description,
      description_en: copy.description_en,
      highlights: copy.highlights,
      highlights_en: copy.highlights_en,
      badge: copy.badge,
      badge_en: copy.badge_en,
      links: { profile: copy.links.profile },
      stats: {
        ...current.stats,
        tradingDays: copy.stats.tradingDays,
      },
    };
  });
}
