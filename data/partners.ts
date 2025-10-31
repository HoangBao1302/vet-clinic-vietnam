export interface PartnerInfo {
  id: string;
  name: string;
  logo?: string;
  website: string;
  spread: string[];
  license: string[];
  deposit: string[];
  support: string[];
  notes: string[];
  rating: number;
  active: boolean;
  order: number;
}

export const partners: PartnerInfo[] = [
  {
    id: "tickmill",
    name: "Tickmill",
    website: "https://tickmill.com",
    rating: 4.5,
    active: true,
    order: 1,
    spread: [
      "Spread từ 0.0 pips (tài khoản Pro)",
      "Commission: $2/lot (một chiều)",
      "Tài khoản Classic: Spread từ 1.6 pips",
      "Không có commission ẩn",
      "Execution nhanh < 30ms"
    ],
    license: [
      "FCA (UK) - Cơ quan quản lý hàng đầu",
      "CySEC (Cyprus)",
      "FSA (Seychelles)",
      "FSCA (South Africa)",
      "Bảo vệ số dư âm"
    ],
    deposit: [
      "Nạp tối thiểu: $100",
      "Hỗ trợ: Bank Wire, Card, Skrill, Neteller",
      "Nạp/rút nhanh 24h",
      "Không phí nạp/rút với e-wallet",
      "Hỗ trợ VND qua các cổng thanh toán"
    ],
    support: [
      "Live Chat 24/5",
      "Email support đa ngôn ngữ",
      "Quản lý tài khoản riêng (VIP)",
      "Telegram support group",
      "Tài liệu hướng dẫn chi tiết"
    ],
    notes: [
      "⭐ Phù hợp với scalper & EA",
      "⚠️ Yêu cầu KYC đầy đủ",
      "✅ Slippage thấp, execution tốt",
      "💡 Demo không giới hạn thời gian",
      "🎁 Chương trình cashback/rebate"
    ]
  },
  {
    id: "thinkmarkets",
    name: "ThinkMarkets",
    website: "https://thinkmarkets.com",
    rating: 4.3,
    active: true,
    order: 2,
    spread: [
      "Spread từ 0.0 pips (ThinkZero)",
      "Commission: $3.5/lot (round turn)",
      "Tài khoản Standard: Spread từ 1.2 pips",
      "Hơn 4000+ instruments",
      "MetaTrader 4 & 5"
    ],
    license: [
      "FCA (UK)",
      "ASIC (Australia)",
      "FSCA (South Africa)",
      "Tier-1 regulation",
      "Quỹ bồi thường nhà đầu tư"
    ],
    deposit: [
      "Nạp tối thiểu: $250",
      "Hỗ trợ: Bank, Card, PayPal, Skrill",
      "Xử lý rút tiền trong 1-3 ngày",
      "Không phí rút cho e-wallet",
      "Hỗ trợ crypto deposit"
    ],
    support: [
      "Support 24/5 đa kênh",
      "Account Manager cho tài khoản lớn",
      "Webinar & education miễn phí",
      "Trading Central integration",
      "Community forum"
    ],
    notes: [
      "⭐ Platform công nghệ cao",
      "⚠️ Minimum deposit cao hơn",
      "✅ Copy trading & Social trading",
      "💡 VPS miễn phí (điều kiện)",
      "🎓 Tài nguyên giáo dục phong phú"
    ]
  },
  {
    id: "puprime",
    name: "PuPrime",
    website: "https://puprime.com",
    rating: 4.1,
    active: true,
    order: 3,
    spread: [
      "Spread từ 0.0 pips (ECN)",
      "Commission: $3/lot (one way)",
      "Tài khoản Standard: Spread từ 1.5 pips",
      "Leverage lên đến 1:500",
      "Slippage protection"
    ],
    license: [
      "FSA (Seychelles)",
      "VFSC (Vanuatu)",
      "Regulation đang mở rộng",
      "Segregated accounts",
      "Third-party insurance"
    ],
    deposit: [
      "Nạp tối thiểu: $50",
      "Hỗ trợ: Bank, Card, USDT, Perfect Money",
      "Instant deposit với crypto",
      "Rút trong 24h (e-wallet)",
      "Phí rút: $0 - $10 tùy phương thức"
    ],
    support: [
      "24/7 Live Chat & Email",
      "Đa ngôn ngữ (bao gồm Tiếng Việt)",
      "IB support riêng",
      "FAQ & Video tutorials",
      "Dedicated account officer"
    ],
    notes: [
      "⭐ Entry barrier thấp ($50)",
      "⚠️ Regulation ít uy tín hơn FCA/ASIC",
      "✅ Hỗ trợ crypto deposit",
      "💡 Phù hợp trader mới/vốn nhỏ",
      "🎁 Bonus & promotion thường xuyên"
    ]
  }
];

