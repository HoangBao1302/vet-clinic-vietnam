export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  readTime: string;
  category: "news" | "education" | "ea-leopard";
  image: string;
  featured?: boolean;
  tags?: string[];
  isPremium?: boolean;
  previewContent?: string;
}

export const blogPosts: BlogPost[] = [
  // ============================================
  // CATEGORY 1: TIN TỨC (NEWS)
  // ============================================
  {
    id: "nfp-thang-12-2024-phan-tich",
    title: "Non-Farm Payroll tháng 12/2024: Thị trường việc làm vượt kỳ vọng",
    excerpt: "Số liệu NFP tháng 12 tăng 256K việc làm, vượt dự báo 160K. Phân tích tác động đến USD và thị trường Forex, cùng chiến lược giao dịch sau NFP.",
    author: "Nguyễn Văn A - Market Analyst",
    date: "2024-12-08",
    readTime: "7 phút đọc",
    category: "news",
    image: "/vet-images/1.png",
    featured: true,
    tags: ["NFP", "USD", "Employment", "Market Analysis"],
    isPremium: true,
    previewContent: "Số liệu Non-Farm Payroll (NFP) tháng 12/2024 vừa được công bố với mức tăng 256,000 việc làm, vượt xa dự báo của thị trường ở mức 160,000. Đây là dấu hiệu tích cực cho thấy thị trường lao động Mỹ vẫn duy trì đà tăng trưởng mạnh mẽ..."
  },
  {
    id: "fed-giu-nguyen-lai-suat-thang-12",
    title: "FED giữ nguyên lãi suất 5.50%, báo hiệu gì cho 2025?",
    excerpt: "Quyết định lãi suất mới nhất từ FED và phát biểu của Chủ tịch Powell. Phân tích kỹ thuật EURUSD, GBPUSD sau quyết định lãi suất.",
    author: "Trần Thị B - Economic Analyst",
    date: "2024-12-14",
    readTime: "9 phút đọc",
    category: "news",
    image: "/vet-images/2.png",
    tags: ["FED", "Interest Rate", "FOMC", "Monetary Policy"]
  },
  {
    id: "cpi-my-thang-11-giam-nhe",
    title: "CPI Mỹ tháng 11 giảm nhẹ xuống 3.1%: Tín hiệu tích cực cho lạm phát",
    excerpt: "Chỉ số giá tiêu dùng CPI giảm từ 3.2% xuống 3.1%, thấp hơn dự báo. Core CPI vẫn ở mức 4.0%. Phân tích tác động đến chính sách tiền tệ.",
    author: "Lê Văn C - Senior Analyst",
    date: "2024-12-12",
    readTime: "6 phút đọc",
    category: "news",
    image: "/vet-images/3.png",
    tags: ["CPI", "Inflation", "USD", "Economic Data"]
  },
  {
    id: "adp-thang-12-tang-manh",
    title: "ADP Employment tháng 12 tăng 164K: Khu vực tư nhân phục hồi mạnh",
    excerpt: "Báo cáo việc làm ADP cho thấy khu vực tư nhân tăng 164K việc làm, vượt dự báo 115K. Phân tích trước thềm công bố NFP chính thức.",
    author: "Phạm Thị D - Employment Specialist",
    date: "2024-12-06",
    readTime: "5 phút đọc",
    category: "news",
    image: "/vet-images/4.png",
    tags: ["ADP", "Employment", "Economic Indicator"]
  },
  {
    id: "pce-thang-11-on-dinh",
    title: "PCE Index tháng 11 ổn định 3.0%: FED yên tâm hơn về lạm phát",
    excerpt: "Chỉ số PCE - thước đo lạm phát ưa thích của FED - duy trì ở 3.0%. Core PCE giảm nhẹ xuống 3.5%. Phân tích triển vọng chính sách tiền tệ.",
    author: "Hoàng Văn E - Macro Economist",
    date: "2024-12-22",
    readTime: "8 phút đọc",
    category: "news",
    image: "/vet-images/5.png",
    tags: ["PCE", "Inflation", "FED", "Monetary Policy"]
  },
  {
    id: "gdp-my-q4-tang-3-1-percent",
    title: "GDP Mỹ Q4 tăng 3.1%: Kinh tế vẫn bền vững bất chấp lãi suất cao",
    excerpt: "Tăng trưởng GDP quý 4 đạt 3.1%, vượt kỳ vọng 2.6%. Tiêu dùng cá nhân và đầu tư doanh nghiệp là động lực chính. Tác động đến USD và Forex.",
    author: "Vũ Thị F - GDP Analyst",
    date: "2024-12-28",
    readTime: "10 phút đọc",
    category: "news",
    image: "/vet-images/6.png",
    tags: ["GDP", "Economic Growth", "USD", "Macro"]
  },

  // ============================================
  // CATEGORY 2: ĐÀO TẠO & PHÂN TÍCH
  // ============================================
  {
    id: "co-ban-ve-support-resistance",
    title: "Cơ bản về Support & Resistance: Nền tảng phân tích kỹ thuật",
    excerpt: "Hướng dẫn chi tiết về khái niệm, cách xác định và giao dịch dựa trên vùng hỗ trợ và kháng cự. Bài học cơ bản cho trader mới bắt đầu.",
    author: "Nguyễn Minh G - Trading Coach",
    date: "2024-12-05",
    readTime: "12 phút đọc",
    category: "education",
    image: "/vet-images/1.png",
    tags: ["Technical Analysis", "Support", "Resistance", "Beginner"]
  },
  {
    id: "quan-tri-von-trading",
    title: "Quản trị vốn trong Trading: 2% Rule và Position Sizing",
    excerpt: "Hệ thống quản trị vốn chuyên nghiệp: Quy tắc 2%, cách tính position size, diversification và money management cho trader mọi cấp độ.",
    author: "Trần Quốc H - Risk Manager",
    date: "2024-11-28",
    readTime: "15 phút đọc",
    category: "education",
    image: "/vet-images/2.png",
    tags: ["Money Management", "Risk Management", "Position Sizing"]
  },
  {
    id: "ma-cross-strategy-nang-cao",
    title: "Chiến lược MA Cross nâng cao: Kết hợp 3 Moving Averages",
    excerpt: "Phân tích chuyên sâu về chiến lược giao dịch với 3 MA (20-50-200). Entry rules, exit rules, money management và backtest results chi tiết.",
    author: "Lê Hoàng I - Strategy Developer",
    date: "2024-12-18",
    readTime: "18 phút đọc",
    category: "education",
    image: "/vet-images/3.png",
    tags: ["Strategy", "Moving Average", "Advanced", "Backtest"]
  },
  {
    id: "phan-tich-price-action",
    title: "Price Action Trading: Đọc biểu đồ không cần indicators",
    excerpt: "Khóa học Price Action đầy đủ: candlestick patterns, chart patterns, trend analysis và cách giao dịch chỉ dựa vào price movements.",
    author: "Phạm Văn K - Price Action Expert",
    date: "2024-12-10",
    readTime: "20 phút đọc",
    category: "education",
    image: "/vet-images/4.png",
    tags: ["Price Action", "Candlestick", "Chart Patterns"]
  },
  {
    id: "fibonacci-retracement-guide",
    title: "Fibonacci Retracement: Công cụ dự đoán điểm vào lệnh chính xác",
    excerpt: "Hướng dẫn sử dụng Fibonacci levels (38.2%, 50%, 61.8%) để xác định entry, stop loss và take profit. Kết hợp với trend và support/resistance.",
    author: "Hoàng Thị L - Technical Analyst",
    date: "2024-11-25",
    readTime: "14 phút đọc",
    category: "education",
    image: "/vet-images/5.png",
    tags: ["Fibonacci", "Technical Analysis", "Entry Points"]
  },
  {
    id: "tam-ly-trader-thanh-cong",
    title: "Tâm lý Trader: Vượt qua Fear và Greed để thành công",
    excerpt: "Phân tích tâm lý giao dịch: fear of missing out (FOMO), revenge trading, overtrading và cách xây dựng mental discipline vững chắc.",
    author: "Vũ Minh M - Trading Psychology",
    date: "2024-12-20",
    readTime: "16 phút đọc",
    category: "education",
    image: "/vet-images/6.png",
    tags: ["Psychology", "Trading Mindset", "Discipline"]
  },

  // ============================================
  // CATEGORY 3: EA LEOPARDSMART (CHUYÊN SÂU)
  // ============================================
  {
    id: "cach-doc-profit-factor-drawdown",
    title: "Cách đọc Profit Factor & Drawdown của EA ThebenchmarkTrader",
    excerpt: "Hướng dẫn chi tiết cách phân tích và đánh giá hiệu suất EA thông qua các chỉ số quan trọng như Profit Factor, Maximum Drawdown và Win Rate.",
    author: "EA ThebenchmarkTrader Team",
    date: "2024-12-15",
    readTime: "8 phút đọc",
    category: "ea-leopard",
    image: "/vet-images/4.png",
    tags: ["EA Analysis", "Profit Factor", "Drawdown", "Performance"]
  },
  {
    id: "toi-uu-tham-so-ea-leopard",
    title: "Tối ưu tham số EA ThebenchmarkTrader cho từng loại tài khoản",
    excerpt: "Hướng dẫn chi tiết cách điều chỉnh Risk%, Lot Size, Max Positions và các tham số khác của EA cho phù hợp với quy mô tài khoản từ $500 đến $50,000.",
    author: "EA ThebenchmarkTrader Team",
    date: "2024-11-28",
    readTime: "12 phút đọc",
    category: "ea-leopard",
    image: "/vet-images/2.png",
    tags: ["EA Settings", "Optimization", "Risk Management"]
  },
  {
    id: "ea-leopard-vs-manual-trading",
    title: "EA ThebenchmarkTrader vs Manual Trading: So sánh chi tiết",
    excerpt: "Phân tích ưu và nhược điểm của EA automation so với manual trading. Khi nào nên dùng EA, khi nào nên trade manually? Case studies thực tế.",
    author: "EA ThebenchmarkTrader Team",
    date: "2024-12-11",
    readTime: "10 phút đọc",
    category: "ea-leopard",
    image: "/vet-images/1.png",
    tags: ["EA vs Manual", "Comparison", "Trading Style"]
  },
  {
    id: "cai-dat-ea-leopard-vps",
    title: "Cài đặt EA ThebenchmarkTrader trên VPS: Hướng dẫn từ A-Z",
    excerpt: "Step-by-step guide chi tiết: chọn VPS, setup MT4/MT5, install EA, configure settings, monitoring và troubleshooting. Kèm video demo.",
    author: "EA ThebenchmarkTrader Team",
    date: "2024-12-24",
    readTime: "15 phút đọc",
    category: "ea-leopard",
    image: "/vet-images/3.png",
    tags: ["Installation", "VPS", "Setup Guide", "Tutorial"]
  },
  {
    id: "ea-leopard-multi-pair-strategy",
    title: "Chiến lược Multi-Pair với EA ThebenchmarkTrader: Tối ưu đa cặp tiền",
    excerpt: "Cách chạy EA trên nhiều cặp tiền (EURUSD, GBPUSD, USDJPY) để diversify risk. Correlation analysis, capital allocation và expected returns.",
    author: "EA ThebenchmarkTrader Team",
    date: "2024-12-02",
    readTime: "14 phút đọc",
    category: "ea-leopard",
    image: "/vet-images/5.png",
    tags: ["Multi-Pair", "Diversification", "Strategy", "Advanced"]
  },
  {
    id: "ea-leopard-update-v2-features",
    title: "EA ThebenchmarkTrader v2.0: Những tính năng mới và cải tiến",
    excerpt: "Changelog chi tiết phiên bản 2.0: AI-enhanced entry logic, adaptive trailing stop, news filter auto, multi-timeframe analysis và performance improvements.",
    author: "EA ThebenchmarkTrader Team",
    date: "2024-12-30",
    readTime: "11 phút đọc",
    category: "ea-leopard",
    image: "/vet-images/6.png",
    tags: ["Update", "New Features", "Version 2.0", "Changelog"]
  },
];

export const categories = [
  {
    id: "all",
    name: "Tất cả",
    description: "Tất cả bài viết",
    icon: "📚"
  },
  {
    id: "news",
    name: "Tin Tức",
    description: "Phân tích dữ liệu kinh tế: NFP, CPI, FED, ADP, PCE, GDP...",
    icon: "📰"
  },
  {
    id: "education",
    name: "Đào Tạo & Phân Tích",
    description: "Kiến thức cơ bản đến nâng cao, phân tích chuyên gia",
    icon: "🎓"
  },
  {
    id: "ea-leopard",
    name: "EA ThebenchmarkTrader",
    description: "Bài viết chuyên sâu về EA ThebenchmarkTrader",
    icon: "🤖"
  }
];

