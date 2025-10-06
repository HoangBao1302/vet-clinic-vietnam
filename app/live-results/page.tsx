"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import { ExternalLink, TrendingUp, Shield, Users, BarChart3, Youtube, Copy, CheckCircle, AlertCircle } from "lucide-react";

interface TradingAccount {
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
  highlights: string[];
  badge?: string;
}

const tradingAccounts: TradingAccount[] = [
  // MQL5 Accounts
  {
    platform: "MQL5",
    accountName: "ThebenchmarkTrader Live #1",
    accountNumber: "12345678",
    broker: "Tickmill",
    verified: true,
    badge: "Verified Real Account",
    stats: {
      gain: "+186%",
      drawdown: "12.5%",
      winRate: "68%",
      profitFactor: "2.3",
      tradingDays: "180 days"
    },
    links: {
      profile: "https://www.mql5.com/en/signals/YOUR_SIGNAL_ID",
      youtube: "https://www.youtube.com/watch?v=MQL5_TUTORIAL_ID"
    },
    description: "Tài khoản live đầu tiên chạy EA ThebenchmarkTrader trên Tickmill. Verified bởi MQL5, tất cả giao dịch được tracking real-time.",
    highlights: [
      "✅ Verified bởi MQL5.com",
      "📈 Lợi nhuận ổn định 180 ngày",
      "🛡️ Drawdown được kiểm soát < 15%",
      "💰 Risk 1.5% mỗi lệnh",
      "⏰ Trade trên EURUSD H1"
    ]
  },
  {
    platform: "MQL5",
    accountName: "ThebenchmarkTrader Live #2",
    accountNumber: "87654321",
    broker: "PuPrime",
    verified: true,
    badge: "Verified Real Account",
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
    highlights: [
      "✅ Verified bởi MQL5.com",
      "🎯 Win rate cao nhất (71%)",
      "🛡️ Drawdown thấp nhất (9.8%)",
      "💰 Risk 1% mỗi lệnh",
      "⏰ Trade trên GBPUSD H1"
    ]
  },
  // Myfxbook Accounts
  {
    platform: "Myfxbook",
    accountName: "EA ThebenchmarkTrader Pro",
    accountNumber: "MYFX-123456",
    broker: "Tickmill",
    verified: true,
    badge: "Verified by Myfxbook",
    stats: {
      gain: "+215%",
      drawdown: "14.2%",
      winRate: "66%",
      profitFactor: "2.2",
      tradingDays: "240 days"
    },
    links: {
      profile: "https://www.myfxbook.com/members/YOUR_USERNAME/YOUR_ACCOUNT_ID",
      youtube: "https://www.youtube.com/watch?v=MYFXBOOK_TUTORIAL_ID"
    },
    description: "Tài khoản dài hạn nhất, tracking 240 ngày liên tục. Verified trading history bởi Myfxbook với track record minh bạch.",
    highlights: [
      "✅ Verified bởi Myfxbook",
      "📊 Track record 240 ngày",
      "💎 Lợi nhuận dài hạn tốt nhất",
      "🎯 Multi-pair trading",
      "📈 Equity curve ổn định"
    ]
  },
  // Tickmill Social Trading
  {
    platform: "Tickmill Social",
    accountName: "ThebenchmarkTrader Strategy",
    accountNumber: "Social-TM-789",
    broker: "Tickmill",
    verified: true,
    badge: "Tickmill Strategy Provider",
    stats: {
      gain: "+168%",
      drawdown: "11.3%",
      winRate: "69%",
      profitFactor: "2.4",
      tradingDays: "165 days"
    },
    links: {
      profile: "https://www.tickmill.com/social-trading/YOUR_STRATEGY_ID",
      copyTrade: "https://www.tickmill.com/social-trading/YOUR_STRATEGY_ID/copy",
      youtube: "https://www.youtube.com/watch?v=TICKMILL_COPY_TUTORIAL"
    },
    description: "Copy trading trực tiếp trên Tickmill Social. Khách hàng có thể copy với 1 click, phí copy 20% profit share.",
    highlights: [
      "✅ Tickmill Strategy Provider",
      "👥 50+ investors đang copy",
      "💰 Copy từ $500 trở lên",
      "🔄 Auto copy, không cần EA",
      "📊 Transparent fee: 20% profit share"
    ]
  },
  // PuPrime Social Trading
  {
    platform: "PuPrime Social",
    accountName: "ThebenchmarkTrader MAM",
    accountNumber: "Social-PP-456",
    broker: "PuPrime",
    verified: true,
    badge: "PuPrime Master Account",
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
    highlights: [
      "✅ PuPrime Master Trader",
      "👥 30+ followers",
      "💰 Copy từ $200 trở lên",
      "🎁 Phù hợp vốn nhỏ",
      "📊 Fee: 25% profit share"
    ]
  }
];

export default function LiveResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-900 via-green-800 to-blue-950 text-white py-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-700/50 rounded-full text-sm font-medium mb-6">
                <CheckCircle size={16} />
                <span>100% Verified Real Money Accounts</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Kết Quả Giao Dịch Thực Tế
              </h1>
              <p className="text-xl text-green-100 leading-relaxed mb-8">
                Tất cả tài khoản đều là <strong>real money</strong>, được verify bởi các nền tảng uy tín 
                như MQL5, Myfxbook, và tracking công khai 24/7. Không photoshop, không demo, không fake.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-green-200">Tổng lợi nhuận</div>
                  <div className="text-2xl font-bold">+1,000%+</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-green-200">Verified accounts</div>
                  <div className="text-2xl font-bold">5+</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-green-200">Followers/Copiers</div>
                  <div className="text-2xl font-bold">80+</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Trust Section */}
        <section className="py-12 bg-blue-50 border-y border-blue-200">
          <div className="container-custom">
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="text-center">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">100% Verified</h3>
                <p className="text-sm text-gray-600">Tất cả tài khoản đều verified bởi platform</p>
              </div>
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">Real-Time</h3>
                <p className="text-sm text-gray-600">Tracking 24/7, cập nhật mỗi giao dịch</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">Live Data</h3>
                <p className="text-sm text-gray-600">Click vào link để xem live stats</p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">Copy Trading</h3>
                <p className="text-sm text-gray-600">Copy trực tiếp, không cần mua EA</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trading Accounts Grid */}
        <section className="py-20">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Tài Khoản Giao Dịch Thực Tế
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Tất cả tài khoản dưới đây đều là real money, verified và có thể tracking công khai. 
                Click vào link để xem chi tiết và lịch sử giao dịch đầy đủ.
              </p>
            </div>

            <div className="space-y-8 max-w-6xl mx-auto">
              {tradingAccounts.map((account, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow border border-gray-200"
                >
                  {/* Account Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold">{account.accountName}</h3>
                          {account.verified && (
                            <span className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-xs">
                              <CheckCircle size={14} />
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="flex items-center gap-1">
                            <strong>Platform:</strong> {account.platform}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <strong>Broker:</strong> {account.broker}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <strong>Account:</strong> {account.accountNumber}
                          </span>
                        </div>
                      </div>
                      {account.badge && (
                        <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                          {account.badge}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Gain</div>
                        <div className="text-2xl font-bold text-green-600">{account.stats.gain}</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Drawdown</div>
                        <div className="text-2xl font-bold text-red-600">{account.stats.drawdown}</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Win Rate</div>
                        <div className="text-2xl font-bold text-blue-600">{account.stats.winRate}</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Profit Factor</div>
                        <div className="text-2xl font-bold text-purple-600">{account.stats.profitFactor}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Days</div>
                        <div className="text-xl font-bold text-gray-700">{account.stats.tradingDays}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {account.description}
                    </p>

                    {/* Highlights */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Điểm nổi bật:</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {account.highlights.map((highlight, i) => (
                          <div key={i} className="text-sm text-gray-700">
                            {highlight}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {account.links.profile && (
                        <a
                          href={account.links.profile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          <ExternalLink size={18} />
                          <span>Xem Profile & Stats Live</span>
                        </a>
                      )}
                      {account.links.copyTrade && (
                        <a
                          href={account.links.copyTrade}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          <Copy size={18} />
                          <span>Copy Trading Ngay</span>
                        </a>
                      )}
                      {account.links.youtube && (
                        <a
                          href={account.links.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                        >
                          <Youtube size={18} />
                          <span>Video Hướng Dẫn</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Copy Trading Guide Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-12">
                <Youtube className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Hướng Dẫn Copy Trading
                </h2>
                <p className="text-lg text-gray-600">
                  Xem video hướng dẫn chi tiết cách copy trading trên từng platform
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    📊 MQL5 Signals
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Copy tín hiệu tự động trên MT4/MT5. Phù hợp nếu bạn muốn control risk tự mình.
                  </p>
                  <a
                    href="https://www.youtube.com/watch?v=MQL5_COPY_GUIDE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                  >
                    <Youtube size={18} />
                    <span>Xem hướng dẫn MQL5</span>
                  </a>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-green-500 transition-colors">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    📈 Myfxbook AutoTrade
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    AutoTrade qua Myfxbook với nhiều broker. Setup 1 lần, auto sync forever.
                  </p>
                  <a
                    href="https://www.youtube.com/watch?v=MYFXBOOK_COPY_GUIDE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                  >
                    <Youtube size={18} />
                    <span>Xem hướng dẫn Myfxbook</span>
                  </a>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-orange-500 transition-colors">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    🎯 Tickmill Social
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Copy trading native trên Tickmill. Đơn giản nhất, 1 click copy, không cần EA.
                  </p>
                  <a
                    href="https://www.youtube.com/watch?v=TICKMILL_COPY_TUTORIAL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                  >
                    <Youtube size={18} />
                    <span>Xem hướng dẫn Tickmill</span>
                  </a>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-purple-500 transition-colors">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    💰 PuPrime Social
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Copy trên PuPrime với vốn thấp ($200+). Phù hợp trader mới bắt đầu.
                  </p>
                  <a
                    href="https://www.youtube.com/watch?v=PUPRIME_COPY_TUTORIAL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                  >
                    <Youtube size={18} />
                    <span>Xem hướng dẫn PuPrime</span>
                  </a>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <p className="text-gray-700 mb-4">
                  <strong>💡 Chưa chắc nên copy hay mua EA?</strong> Xem video so sánh để chọn phương án phù hợp nhất.
                </p>
                <a
                  href="https://www.youtube.com/watch?v=COPY_VS_EA_VIDEO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Youtube size={20} />
                  <span>Copy Trading vs Mua EA - Video So Sánh</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-12 bg-yellow-50 border-y border-yellow-200">
          <div className="container-custom max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Cảnh Báo Rủi Ro</h3>
                <div className="text-gray-700 space-y-2 text-sm">
                  <p>
                    <strong>Kết quả trong quá khứ không đảm bảo kết quả tương lai.</strong> Tất cả các tài khoản trên 
                    đều là real money và verified, nhưng hiệu suất có thể thay đổi theo điều kiện thị trường.
                  </p>
                  <p>
                    <strong>Copy trading có rủi ro:</strong> Khi copy, bạn cũng chịu drawdown tương tự master account. 
                    Chỉ copy với số tiền bạn có thể chấp nhận mất.
                  </p>
                  <p>
                    <strong>Phí copy:</strong> Tickmill (20% profit share), PuPrime (25% profit share), 
                    MQL5/Myfxbook (fee khác nhau tùy platform). Đọc kỹ terms trước khi copy.
                  </p>
                  <p>
                    <strong>Khuyến nghị:</strong> Test trên demo/vốn nhỏ trước. Theo dõi ít nhất 1 tháng trước khi scale up. 
                    Không bao giờ all-in vào 1 strategy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Chọn giữa copy trading (dễ hơn) hoặc mua EA (control hơn). Cả 2 đều có kết quả thực tế đã verified.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Xem Bảng Giá EA
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
              >
                Tư Vấn Copy Trading
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyCallToAction />
    </div>
  );
}

