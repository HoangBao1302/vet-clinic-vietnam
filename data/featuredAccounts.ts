export interface FeaturedAccount {
  id: string;
  name: string;
  platform: string;
  broker: string;
  gain: string;
  drawdown: string;
  days: string;
  link: string;
  copyable: boolean;
  active: boolean;
  order: number;
}

export const featuredAccounts: FeaturedAccount[] = [
  {
    id: "featured-1",
    name: "ThebenchmarkTrader Live #1",
    platform: "MQL5",
    broker: "Tickmill",
    gain: "+4359%",
    drawdown: "28.5%",
    days: "1638",
    link: "https://www.mql5.com/en/signals/2327790",
    copyable: false,
    active: true,
    order: 1
  },
  {
    id: "featured-2",
    name: "EA ThebenchmarkTrader Pro",
    platform: "Myfxbook",
    broker: "Tickmill",
    gain: "+60.78%",
    drawdown: "8.55%",
    days: "160",
    link: "https://www.myfxbook.com/portfolio/yen-pham-thi-thuan/11670921",
    copyable: false,
    active: true,
    order: 2
  },
  {
    id: "featured-3",
    name: "ThebenchmarkTrader Strategy",
    platform: "Tickmill Social",
    broker: "Tickmill",
    gain: "+60.75%",
    drawdown: "8.53%",
    days: "161",
    link: "https://stats.tmsocial.net/widgets/ratings/4117?widgetKey=social_platform_ratings&lang=en&preview=P3U9OGQ2OThlJmE9ODU1NSZwPTQxMTcmdz0x",
    copyable: true,
    active: true,
    order: 3
  }
];

