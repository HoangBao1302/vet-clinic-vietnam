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

// Merge all blog posts including premium
export const allBlogPosts: BlogPost[] = [
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
  // ============================================
  // THÊM BÀI PREMIUM CHẤT LƯỢNG CAO
  // ============================================
  ,
  // Premium Market Analysis
  {
    id: "forex-outlook-2025-exclusive",
    title: "Forex Outlook 2025: Dự báo độc quyền từ team phân tích",
    excerpt: "Phân tích chuyên sâu xu hướng thị trường Forex 2025, dự báo cặp tiền chính và chiến lược giao dịch hiệu quả. Nội dung độc quyền chỉ dành cho thành viên premium.",
    author: "Team ThebenchmarkTrader",
    date: "2024-12-30",
    readTime: "15 phút đọc",
    category: "news",
    image: "/vet-images/1.png",
    featured: true,
    tags: ["Forex 2025", "Market Outlook", "Exclusive Analysis"],
    isPremium: true,
    previewContent: "Thị trường Forex 2025 sẽ chứng kiến những thay đổi lớn với sự dịch chuyển chính sách tiền tệ của các ngân hàng trung ương lớn. Dự báo EUR/USD sẽ test vùng 1.1500-1.1600 trong Q1 2025...",
    content: `
      <h2>Dự báo tổng quan thị trường Forex 2025</h2>
      <p>Năm 2025 được dự báo sẽ là một năm đầy biến động với nhiều sự kiện quan trọng tác động đến thị trường Forex:</p>
      
      <h3>1. Chính sách tiền tệ của FED</h3>
      <p>FED dự kiến sẽ bắt đầu cắt giảm lãi suất từ Q2 2025, điều này sẽ tạo áp lực giảm giá cho USD. Các cặp tiền chính như EUR/USD, GBP/USD sẽ được hưởng lợi.</p>
      
      <h3>2. ECB và chính sách nới lỏng</h3>
      <p>ECB có thể sẽ duy trì lãi suất cao lâu hơn FED, tạo cơ hội cho EUR tăng giá. Mục tiêu EUR/USD trong Q2-Q3 2025: 1.1500-1.1600.</p>
      
      <h3>3. Bank of England và Brexit aftermath</h3>
      <p>BoE sẽ thận trọng trong việc cắt giảm lãi suất. GBP/USD có thể test lại vùng 1.3500-1.3700.</p>
      
      <h2>Chiến lược giao dịch 2025</h2>
      <p><strong>Q1 2025:</strong> Tập trung vào EUR/USD, target 1.1500</p>
      <p><strong>Q2 2025:</strong> Theo dõi cắt giảm lãi suất FED, trade USD pairs</p>
      <p><strong>Q3 2025:</strong> Cơ hội với commodity currencies (AUD, CAD)</p>
      
      <h2>Rủi ro cần lưu ý</h2>
      <ul>
        <li>Bất ổn địa chính trị có thể tăng cao</li>
        <li>Lạm phát có thể tăng trở lại</li>
        <li>Thị trường crypto có thể tác động đến Forex</li>
      </ul>
    `
  },
  
  // Premium Trading Strategy
  {
    id: "advanced-scalping-techniques",
    title: "Kỹ thuật Scalping nâng cao: Tối ưu hóa lợi nhuận trong 1-5 phút",
    excerpt: "Hướng dẫn chi tiết các kỹ thuật scalping chuyên nghiệp, setup entry/exit, quản lý rủi ro và tâm lý giao dịch. Chỉ dành cho trader có kinh nghiệm.",
    author: "Master Trader",
    date: "2024-12-28",
    readTime: "20 phút đọc",
    category: "education",
    image: "/vet-images/2.png",
    tags: ["Scalping", "Advanced Trading", "Risk Management"],
    isPremium: true,
    previewContent: "Scalping là một trong những chiến lược giao dịch khó nhất nhưng cũng mang lại lợi nhuận cao nhất nếu được thực hiện đúng cách. Bài viết này sẽ tiết lộ những bí quyết scalping từ các trader chuyên nghiệp...",
    content: `
      <h2>Những nguyên tắc cơ bản của Scalping</h2>
      <p>Scalping yêu cầu trader phải có:</p>
      <ul>
        <li>Kết nối internet ổn định, độ trễ thấp</li>
        <li>Broker có spread thấp (dưới 1 pip)</li>
        <li>Kỷ luật cao và khả năng ra quyết định nhanh</li>
        <li>Vốn đủ lớn để chịu được biến động</li>
      </ul>
      
      <h2>Setup Scalping hiệu quả</h2>
      <h3>1. Timeframe lý tưởng</h3>
      <p>Sử dụng M1, M5 kết hợp với H1 để xác định trend chính.</p>
      
      <h3>2. Indicators quan trọng</h3>
      <ul>
        <li>EMA 9, 21 cho trend ngắn hạn</li>
        <li>RSI để tránh overbought/oversold</li>
        <li>Volume để xác nhận momentum</li>
        <li>Support/Resistance levels</li>
      </ul>
      
      <h2>Entry Rules</h2>
      <p><strong>Long Entry:</strong></p>
      <ul>
        <li>Price break above EMA 9</li>
        <li>RSI > 50 và đang tăng</li>
        <li>Volume tăng đột biến</li>
        <li>Không có resistance gần</li>
      </ul>
      
      <p><strong>Short Entry:</strong></p>
      <ul>
        <li>Price break below EMA 9</li>
        <li>RSI < 50 và đang giảm</li>
        <li>Volume tăng đột biến</li>
        <li>Không có support gần</li>
      </ul>
      
      <h2>Exit Strategy</h2>
      <p>Take profit: 3-8 pips tùy volatility</p>
      <p>Stop loss: 2-5 pips, không bao giờ để quá 10 pips</p>
      
      <h2>Quản lý tâm lý</h2>
      <p>Scalping đòi hỏi trader phải kiểm soát cảm xúc tuyệt đối. Không revenge trading, không FOMO.</p>
    `
  },
  
  // Premium EA Content
  {
    id: "ea-backtest-optimization-secrets",
    title: "Bí mật tối ưu hóa EA: Từ Backtest đến Live Trading thành công",
    excerpt: "Phân tích chi tiết quy trình backtest, forward test và deployment EA. Cách tránh overfitting, tối ưu parameters và đạt hiệu suất ổn định trong thực tế.",
    author: "EA Development Team",
    date: "2024-12-25",
    readTime: "18 phút đọc",
    category: "ea-leopard",
    image: "/vet-images/3.png",
    tags: ["EA Optimization", "Backtest", "Live Trading"],
    isPremium: true,
    previewContent: "Nhiều trader gặp thất bại khi chuyển từ backtest sang live trading. Nguyên nhân chính là do overfitting và không hiểu rõ quy trình optimization. Bài viết này sẽ tiết lộ những bí mật từ team phát triển EA chuyên nghiệp...",
    content: `
      <h2>Quy trình Backtest chuyên nghiệp</h2>
      
      <h3>1. Data Quality</h3>
      <ul>
        <li>Sử dụng tick data thay vì OHLC</li>
        <li>Spread và commission realistic</li>
        <li>Slippage 0.5-1 pip tùy broker</li>
        <li>Kiểm tra data gaps và errors</li>
      </ul>
      
      <h3>2. Walk Forward Analysis</h3>
      <p>Chia data thành nhiều period để test:</p>
      <ul>
        <li>Optimization period: 70% data</li>
        <li>Validation period: 30% data</li>
        <li>Rolling optimization mỗi 3-6 tháng</li>
      </ul>
      
      <h2>Tối ưu hóa Parameters</h2>
      
      <h3>1. Tránh Overfitting</h3>
      <ul>
        <li>Giới hạn số parameters tối ưu</li>
        <li>Sử dụng genetic algorithm</li>
        <li>Test trên multiple timeframes</li>
        <li>Out-of-sample testing bắt buộc</li>
      </ul>
      
      <h3>2. Robust Parameters</h3>
      <p>Parameters tốt phải:</p>
      <ul>
        <li>Stable qua nhiều market conditions</li>
        <li>Không quá sensitive với small changes</li>
        <li>Logic rõ ràng và có ý nghĩa</li>
      </ul>
      
      <h2>Forward Testing</h2>
      <p>Trước khi deploy live:</p>
      <ul>
        <li>Demo account ít nhất 3 tháng</li>
        <li>Monitor performance metrics</li>
        <li>So sánh với backtest results</li>
        <li>Adjust parameters nếu cần</li>
      </ul>
      
      <h2>Live Deployment</h2>
      <h3>1. Risk Management</h3>
      <ul>
        <li>Start với 0.01 lot size</li>
        <li>Monitor drawdown liên tục</li>
        <li>Stop trading nếu drawdown > 10%</li>
        <li>Backup strategy luôn sẵn sàng</li>
      </ul>
      
      <h3>2. Performance Monitoring</h3>
      <ul>
        <li>Daily performance review</li>
        <li>Weekly parameter check</li>
        <li>Monthly optimization update</li>
        <li>Quarterly strategy review</li>
      </ul>
      
      <h2>Common Mistakes</h2>
      <ul>
        <li>Over-optimization trên limited data</li>
        <li>Ignore market regime changes</li>
        <li>Không có proper risk management</li>
        <li>Emotional trading khi EA gặp drawdown</li>
      </ul>
    `
  },
  
  // Premium Market Psychology
  {
    id: "market-psychology-masterclass",
    title: "Tâm lý thị trường: Nghệ thuật đọc tâm trí đám đông",
    excerpt: "Phân tích sâu về tâm lý trader, sentiment indicators và cách lợi dụng crowd psychology để giao dịch hiệu quả. Nội dung độc quyền từ trading psychologist.",
    author: "Dr. Trading Psychology",
    date: "2024-12-22",
    readTime: "16 phút đọc",
    category: "education",
    image: "/vet-images/4.png",
    tags: ["Psychology", "Sentiment", "Market Behavior"],
    isPremium: true,
    previewContent: "Thị trường Forex không chỉ là số liệu và phân tích kỹ thuật. 80% thành công trong trading đến từ hiểu biết về tâm lý thị trường và khả năng kiểm soát cảm xúc cá nhân...",
    content: `
      <h2>Tâm lý học thị trường cơ bản</h2>
      
      <p>Thị trường được điều khiển bởi hai cảm xúc chính: <strong>Fear</strong> và <strong>Greed</strong>. Hiểu được chu kỳ này sẽ giúp bạn giao dịch hiệu quả hơn.</p>
      
      <h3>Chu kỳ tâm lý thị trường:</h3>
      <ol>
        <li><strong>Optimism:</strong> Thị trường bắt đầu tăng, trader tự tin</li>
        <li><strong>Excitement:</strong> Momentum tăng, FOMO xuất hiện</li>
        <li><strong>Thrill:</strong> Đỉnh cao, mọi người đều bullish</li>
        <li><strong>Euphoria:</strong> "Easy money" mentality</li>
        <li><strong>Anxiety:</strong> Bắt đầu có dấu hiệu đảo chiều</li>
        <li><strong>Denial:</strong> "Chỉ là pullback bình thường"</li>
        <li><strong>Fear:</strong> Hoảng sợ, bán tháo</li>
        <li><strong>Desperation:</strong> Capitulation, bán tất cả</li>
        <li><strong>Panic:</strong> Đáy thị trường</li>
        <li><strong>Capitulation:</strong> Mất niềm tin hoàn toàn</li>
      </ol>
      
      <h2>Sentiment Indicators</h2>
      
      <h3>1. COT Report (Commitment of Traders)</h3>
      <p>Phân tích vị thế của các nhóm trader:</p>
      <ul>
        <li><strong>Commercial:</strong> Hedgers, thường đúng ở extremes</li>
        <li><strong>Non-commercial:</strong> Large speculators</li>
        <li><strong>Small speculators:</strong> Retail traders, thường sai</li>
      </ul>
      
      <h3>2. Put/Call Ratio</h3>
      <p>Khi ratio cao (>1.0): Thị trường quá bearish, có thể reversal</p>
      <p>Khi ratio thấp (<0.8): Thị trường quá bullish, cần thận trọng</p>
      
      <h3>3. VIX (Fear Index)</h3>
      <p>VIX cao (>30): Fear extreme, cơ hội mua</p>
      <p>VIX thấp (<15): Complacency, cần thận trọng</p>
      
      <h2>Contrarian Trading</h2>
      
      <p>Nguyên tắc: <strong>"Be fearful when others are greedy, and greedy when others are fearful"</strong></p>
      
      <h3>Signals để Contrarian:</h3>
      <ul>
        <li>Media headlines quá bullish/bearish</li>
        <li>Social media sentiment extreme</li>
        <li>Volume spike với price rejection</li>
        <li>Institutional flow ngược với retail</li>
      </ul>
      
      <h2>Kiểm soát tâm lý cá nhân</h2>
      
      <h3>1. Trading Journal</h3>
      <p>Ghi lại:</p>
      <ul>
        <li>Emotional state trước khi trade</li>
        <li>Reasoning behind each trade</li>
        <li>Performance vs emotions correlation</li>
      </ul>
      
      <h3>2. Mindfulness trong Trading</h3>
      <ul>
        <li>Meditation trước khi trade</li>
        <li>Breathing exercises khi stress</li>
        <li>Regular breaks để reset</li>
      </ul>
      
      <h2>Case Studies</h2>
      
      <h3>Case 1: 2008 Financial Crisis</h3>
      <p>Khi tất cả đều panic sell, smart money bắt đầu accumulate. Sentiment extreme tạo ra opportunity lớn nhất.</p>
      
      <h3>Case 2: 2020 COVID Crash</h3>
      <p>Fear index VIX lên đỉnh 82, retail panic sell, institutions mua vào mạnh. Recovery nhanh chóng sau đó.</p>
    `
  },
  
  // Premium Risk Management
  {
    id: "advanced-risk-management",
    title: "Quản lý rủi ro nâng cao: Bảo vệ vốn trong mọi tình huống",
    excerpt: "Hệ thống quản lý rủi ro toàn diện cho trader chuyên nghiệp. Portfolio management, correlation analysis và stress testing. Chỉ dành cho trader có kinh nghiệm.",
    author: "Risk Management Expert",
    date: "2024-12-20",
    readTime: "22 phút đọc",
    category: "education",
    image: "/vet-images/5.png",
    tags: ["Risk Management", "Portfolio", "Correlation"],
    isPremium: true,
    previewContent: "Quản lý rủi ro là kỹ năng quan trọng nhất trong trading. 90% trader thất bại vì không có hệ thống quản lý rủi ro đúng đắn. Bài viết này sẽ tiết lộ hệ thống quản lý rủi ro của các hedge fund hàng đầu...",
    content: `
      <h2>Nguyên tắc cơ bản của Risk Management</h2>
      
      <h3>1. Rule of 2%</h3>
      <p>Không bao giờ risk quá 2% account balance cho một trade duy nhất.</p>
      <p><strong>Ví dụ:</strong> Account $10,000 → Max risk per trade = $200</p>
      
      <h3>2. Maximum Daily Loss</h3>
      <p>Giới hạn tổn thất trong một ngày không quá 6% account.</p>
      <p>Nếu đạt giới hạn → Stop trading, nghỉ ngơi.</p>
      
      <h3>3. Maximum Weekly Loss</h3>
      <p>Không để account giảm quá 15% trong một tuần.</p>
      <p>Nếu vượt → Review toàn bộ strategy.</p>
      
      <h2>Position Sizing</h2>
      
      <h3>Kelly Criterion</h3>
      <p>Công thức tính position size tối ưu:</p>
      <p><strong>f = (bp - q) / b</strong></p>
      <p>Trong đó:</p>
      <ul>
        <li>f = fraction of capital to bet</li>
        <li>b = odds received (profit/loss ratio)</li>
        <li>p = probability of winning</li>
        <li>q = probability of losing (1-p)</li>
      </ul>
      
      <h3>Fixed Fractional</h3>
      <p>Position size = (Account Balance × Risk %) / Stop Loss Distance</p>
      
      <h2>Portfolio Risk Management</h2>
      
      <h3>1. Correlation Analysis</h3>
      <ul>
        <li>Không trade nhiều cặp tiền tương quan cao</li>
        <li>EUR/USD và GBP/USD correlation ~0.8</li>
        <li>USD/JPY và USD/CHF correlation ~0.7</li>
        <li>Diversify across different currency pairs</li>
      </ul>
      
      <h3>2. Sector Diversification</h3>
      <ul>
        <li>Major pairs: 40% portfolio</li>
        <li>Minor pairs: 30% portfolio</li>
        <li>Exotic pairs: 20% portfolio</li>
        <li>Commodity currencies: 10% portfolio</li>
      </ul>
      
      <h2>Advanced Risk Metrics</h2>
      
      <h3>1. Value at Risk (VaR)</h3>
      <p>VaR 95% = Có 95% khả năng loss không quá X% trong 1 ngày</p>
      <p><strong>Calculation:</strong> VaR = Z × σ × √t</p>
      
      <h3>2. Maximum Drawdown (MDD)</h3>
      <p>MDD = Peak - Trough / Peak × 100%</p>
      <p>Acceptable MDD: < 20% cho retail trader</p>
      
      <h3>3. Sharpe Ratio</h3>
      <p>Sharpe = (Return - Risk-free rate) / Standard deviation</p>
      <p>Good Sharpe: > 1.0, Excellent: > 2.0</p>
      
      <h2>Stress Testing</h2>
      
      <h3>1. Historical Stress Test</h3>
      <ul>
        <li>Test strategy qua 2008 crisis</li>
        <li>Test qua Brexit event</li>
        <li>Test qua COVID crash</li>
        <li>Identify worst-case scenarios</li>
      </ul>
      
      <h3>2. Monte Carlo Simulation</h3>
      <p>Run 10,000 simulations với random market conditions để test robustness.</p>
      
      <h2>Risk Management Tools</h2>
      
      <h3>1. Stop Loss Strategies</h3>
      <ul>
        <li><strong>Fixed Stop:</strong> Cố định pip distance</li>
        <li><strong>ATR Stop:</strong> Dựa trên Average True Range</li>
        <li><strong>Trailing Stop:</strong> Theo dõi price movement</li>
        <li><strong>Time Stop:</strong> Close trade sau X time</li>
      </ul>
      
      <h3>2. Hedging Strategies</h3>
      <ul>
        <li>Currency hedging với options</li>
        <li>Portfolio hedging với inverse correlation</li>
        <li>Volatility hedging với VIX products</li>
      </ul>
      
      <h2>Psychological Risk Management</h2>
      
      <h3>1. Emotional Triggers</h3>
      <ul>
        <li>Revenge trading sau loss</li>
        <li>FOMO khi miss opportunity</li>
        <li>Overconfidence sau winning streak</li>
        <li>Paralysis sau losing streak</li>
      </ul>
      
      <h3>2. Mitigation Strategies</h3>
      <ul>
        <li>Trading journal để track emotions</li>
        <li>Regular breaks để reset</li>
        <li>Meditation và mindfulness</li>
        <li>Professional counseling nếu cần</li>
      </ul>
    `
  }
];

// Export main blogPosts array (backward compatibility)
export const blogPosts = allBlogPosts;
