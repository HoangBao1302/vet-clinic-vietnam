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
    platform: "MQL4",
    accountName: "ThebenchmarkTrader Live #1",
    accountNumber: "9029831",
    broker: "Tickmill",
    verified: true,
    badge: "Verified Real Account",
    badge_en: "Verified Real Account",
    active: true,
    order: 1,
    stats: {
      gain: "+4359%",
      drawdown: "28.5%",
      winRate: "76.8%",
      profitFactor: "2.3",
      tradingDays: "593 days"
    },
    links: {
      profile: "https://www.mql5.com/en/signals/2327790",
      youtube: "https://www.youtube.com/@ThebenchmarkTraderEA"
    },
    description: "Tài khoản live đầu tiên chạy EA ThebenchmarkTrader trên Tickmill. Verified bởi MQL5, tất cả giao dịch được tracking real-time.",
    description_en: "First live account running EA ThebenchmarkTrader on Tickmill. Verified by MQL5, all trades tracked in real-time.",
    highlights: [
      "✅ Verified bởi MQL5.com",
      "📈 Lợi nhuận ổn định 593 ngày",
      "🛡️ Drawdown được kiểm soát < 30%",
      "💰 Risk 1.5% mỗi lệnh",
      "⏰ Trade trên EURUSD M5, AUDUSD M5"
    ],
    highlights_en: [
      "✅ Verified by MQL5.com",
      "📈 Stable profit for 593 days",
      "🛡️ Drawdown controlled < 30%",
      "💰 Risk 1.5% per trade",
      "⏰ Trading on EURUSD M5, AUDUSD M5"
    ]
  },
  {
    id: "mql5-account-2",
    platform: "MQL5",
    accountName: "ThebenchmarkTrader Live #2",
    accountNumber: "87654321",
    broker: "PuPrime",
    verified: true,
    badge: "Verified Real Account",
    badge_en: "Verified Real Account",
    active: true,
    order: 2,
    stats: {
      gain: "+142%",
      drawdown: "9.8%",
      winRate: "71%",
      profitFactor: "2.5",
      tradingDays: "150 days"
    },
    links: {
      profile: "https://www.mql5.com/en/signals/YOUR_SIGNAL_ID_2",
      youtube: "https://www.youtube.com/watch?v=MQL5_TUTORIAL_ID"
    },
    description: "Tài khoản thứ 2 với risk thấp hơn, phù hợp cho trader bảo thủ. Verified bởi MQL5.",
    description_en: "Second account with lower risk, suitable for conservative traders. Verified by MQL5.",
    highlights: [
      "✅ Verified bởi MQL5.com",
      "🎯 Win rate cao nhất (71%)",
      "🛡️ Drawdown thấp nhất (9.8%)",
      "💰 Risk 1% mỗi lệnh",
      "⏰ Trade trên GBPUSD H1"
    ],
    highlights_en: [
      "✅ Verified by MQL5.com",
      "🎯 Highest win rate (71%)",
      "🛡️ Lowest drawdown (9.8%)",
      "💰 Risk 1% per trade",
      "⏰ Trading on GBPUSD H1"
    ]
  },
  {
    id: "myfxbook-account-1",
    platform: "Myfxbook",
    accountName: "EA ThebenchmarkTrader Pro",
    accountNumber: "MYFX-123456",
    broker: "Tickmill",
    verified: true,
    badge: "Verified by Myfxbook",
    badge_en: "Verified by Myfxbook",
    active: true,
    order: 3,
    stats: {
      gain: "+215%",
      drawdown: "14.2%",
      winRate: "66%",
      profitFactor: "2.2",
      tradingDays: "240 days"
    },
    links: {
      profile: "https://www.myfxbook.com/portfolio/yen-pham-thi-thuan/11670921",
      youtube: "https://www.youtube.com/watch?v=MYFXBOOK_TUTORIAL_ID"
    },
    description: "Tài khoản dài hạn nhất, tracking 240 ngày liên tục. Verified trading history bởi Myfxbook với track record minh bạch.",
    description_en: "Longest running account, tracked continuously for 240 days. Verified trading history by Myfxbook with transparent track record.",
    highlights: [
      "✅ Verified bởi Myfxbook",
      "📊 Track record 240 ngày",
      "💎 Lợi nhuận dài hạn tốt nhất",
      "🎯 Multi-pair trading",
      "📈 Equity curve ổn định"
    ],
    highlights_en: [
      "✅ Verified by Myfxbook",
      "📊 240-day track record",
      "💎 Best long-term profit",
      "🎯 Multi-pair trading",
      "📈 Stable equity curve"
    ]
  },
  {
    id: "tickmill-social-1",
    platform: "Tickmill Social",
    accountName: "ThebenchmarkTrader Strategy",
    accountNumber: "Social-TM-789",
    broker: "Tickmill",
    verified: true,
    badge: "Tickmill Strategy Provider",
    badge_en: "Tickmill Strategy Provider",
    active: true,
    order: 4,
    stats: {
      gain: "+168%",
      drawdown: "11.3%",
      winRate: "69%",
      profitFactor: "2.4",
      tradingDays: "165 days"
    },
    links: {
      profile: "https://stats.tmsocial.net/widgets/ratings/4117?widgetKey=social_platform_ratings&lang=en&preview=P3U9NTQ2ZTFiJmE9ODU1NSZwPTQxMTcmdz0x&zarsrc=30&utm_source=zalo&utm_medium=zalo&utm_campaign=zalo",
      copyTrade: "https://stats.tmsocial.net/widgets/ratings/4117?widgetKey=social_platform_ratings&lang=en&preview=P3U9NTQ2ZTFiJmE9ODU1NSZwPTQxMTcmdz0x&zarsrc=30&utm_source=zalo&utm_medium=zalo&utm_campaign=zalo",
      youtube: "https://www.youtube.com/watch?v=TICKMILL_COPY_TUTORIAL"
    },
    description: "Copy trading trực tiếp trên Tickmill Social. Khách hàng có thể copy với 1 click, phí copy 20% profit share.",
    description_en: "Direct copy trading on Tickmill Social. Clients can copy with 1 click, copy fee 20% profit share.",
    highlights: [
      "✅ Tickmill Strategy Provider",
      "👥 50+ investors đang copy",
      "💰 Copy từ $500 trở lên",
      "🔄 Auto copy, không cần EA",
      "📊 Transparent fee: 20% profit share"
    ],
    highlights_en: [
      "✅ Tickmill Strategy Provider",
      "👥 50+ investors copying",
      "💰 Copy from $500 and up",
      "🔄 Auto copy, no EA needed",
      "📊 Transparent fee: 20% profit share"
    ]
  },
  {
    id: "puprime-social-1",
    platform: "PuPrime Social",
    accountName: "ThebenchmarkTrader MAM",
    accountNumber: "Social-PP-456",
    broker: "PuPrime",
    verified: true,
    badge: "PuPrime Master Account",
    badge_en: "PuPrime Master Account",
    active: true,
    order: 5,
    stats: {
      gain: "+134%",
      drawdown: "10.5%",
      winRate: "70%",
      profitFactor: "2.3",
      tradingDays: "120 days"
    },
    links: {
      profile: "https://puprime.com/social-trading/YOUR_MASTER_ID",
      copyTrade: "https://puprime.com/social-trading/YOUR_MASTER_ID/copy",
      youtube: "https://www.youtube.com/watch?v=PUPRIME_COPY_TUTORIAL"
    },
    description: "Master account trên PuPrime Social Trading. Entry barrier thấp, phù hợp trader mới với vốn nhỏ ($200+).",
    description_en: "Master account on PuPrime Social Trading. Low entry barrier, suitable for new traders with small capital ($200+).",
    highlights: [
      "✅ PuPrime Master Trader",
      "👥 30+ followers",
      "💰 Copy từ $200 trở lên",
      "🎁 Phù hợp vốn nhỏ",
      "📊 Fee: 25% profit share"
    ],
    highlights_en: [
      "✅ PuPrime Master Trader",
      "👥 30+ followers",
      "💰 Copy from $200 and up",
      "🎁 Suitable for small capital",
      "📊 Fee: 25% profit share"
    ]
  }
];

