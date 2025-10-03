"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import Image from "next/image";
import { TrendingUp, Shield, Brain, AlertTriangle, Clock, Target, BarChart3, Settings, Youtube, PlayCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  Về EA Forex LeopardSmart
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Expert Advisor được thiết kế với triết lý minh bạch, quản trị rủi ro khoa học 
                  và hiệu suất được chứng minh qua backtest dài hạn.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                    <TrendingUp size={20} className="text-blue-600" />
                    <span className="font-medium">Đa chiến lược</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                    <Shield size={20} className="text-green-600" />
                    <span className="font-medium">Quản trị rủi ro</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                    <BarChart3 size={20} className="text-purple-600" />
                    <span className="font-medium">Minh bạch</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/vet-images/3.png"
                  alt="Trading strategy analysis"
                  width={600}
                  height={400}
                  className="rounded-xl shadow-lg"
                  quality={85}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Strategy Details */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Chiến lược giao dịch chi tiết
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                EA LeopardSmart sử dụng kết hợp nhiều chiến lược được tối ưu hóa 
                để thích ứng với mọi điều kiện thị trường
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Trend Following</h3>
                    <p className="text-gray-600">
                      Sử dụng Moving Average (20, 50, 200), MACD và ADX để xác định xu hướng mạnh. 
                      Vào lệnh theo hướng trend với stop loss dưới/trên support/resistance gần nhất.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Range Trading</h3>
                    <p className="text-gray-600">
                      Khi thị trường sideway, EA sử dụng Bollinger Bands và RSI để giao dịch 
                      trong khoảng. Mua ở support, bán ở resistance với RR tối thiểu 1:1.5.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Market Condition Filter</h3>
                    <p className="text-gray-600">
                      Phân tích volatility (ATR), spread hiện tại và thời gian giao dịch. 
                      Tự động tạm dừng khi điều kiện bất lợi (spread cao, volatility thấp).
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Risk Management</h3>
                    <p className="text-gray-600">
                      Risk cố định 1-2% mỗi lệnh, position sizing theo volatility. 
                      Stop loss luôn được đặt trước, trailing stop khi lợi nhuận &gt; 1.5R.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Time & News Filter</h3>
                    <p className="text-gray-600">
                      Chỉ giao dịch trong khung giờ thanh khoản cao (London + NY session). 
                      Tự động đóng lệnh trước news quan trọng (NFP, FOMC, CPI).
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <Settings className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Adaptive Parameters</h3>
                    <p className="text-gray-600">
                      Tham số EA tự điều chỉnh theo volatility thị trường. 
                      Stop loss và take profit được tính toán động dựa trên ATR.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Backtest & Recommendations */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Lưu ý về Backtest
                </h2>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3">Dữ liệu sử dụng</h3>
                    <p className="text-gray-600">
                      Backtest trên dữ liệu tick thực tế từ Dukascopy, 
                      EURUSD H1 từ 01/2020 đến 12/2024 (5 năm).
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3">Spread & Commission</h3>
                    <p className="text-gray-600">
                      Tính toán với spread trung bình 1.2 pips và commission $7/lot, 
                      phản ánh điều kiện giao dịch thực tế.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3">Slippage</h3>
                    <p className="text-gray-600">
                      Mô phỏng slippage trung bình 0.5 pips, đặc biệt trong 
                      khung giờ thanh khoản thấp và khi có news.
                    </p>
                  </div>
                </div>

                {/* YouTube Video Section */}
                <div className="mt-8 bg-gradient-to-r from-red-50 to-blue-50 p-8 rounded-xl border border-red-200">
                  <div className="text-center mb-6">
                    <Youtube className="inline-block text-red-600 mb-4" size={48} />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Xem Video Backtest Chi Tiết
                    </h3>
                    <p className="text-gray-600">
                      Xem toàn bộ quá trình backtest và phân tích kết quả chi tiết trên YouTube
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="https://www.youtube.com/@LeopardSmartEA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      <Youtube size={20} />
                      <span>Xem Video Backtest</span>
                    </a>
                    <a
                      href="https://www.youtube.com/@LeopardSmartEA/playlists"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                      <PlayCircle size={20} />
                      <span>Xem Thêm Video</span>
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Khuyến nghị sử dụng
                </h2>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3">Cặp tiền tệ</h3>
                    <p className="text-gray-600 mb-2">
                      <strong>Tối ưu:</strong> EURUSD, GBPUSD, USDJPY
                    </p>
                    <p className="text-gray-600">
                      <strong>Phù hợp:</strong> AUDUSD, USDCAD, NZDUSD
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3">Timeframe</h3>
                    <p className="text-gray-600">
                      H1 (khuyến nghị chính), M30 và H4 cũng cho kết quả tốt. 
                      Không khuyến nghị dưới M15.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3">Vốn tối thiểu</h3>
                    <p className="text-gray-600">
                      $1000 cho micro lot (0.01), $10,000 cho mini lot (0.1). 
                      Risk 1-2% mỗi lệnh.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Warning */}
        <section className="py-20 bg-red-50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start space-x-4 mb-8">
                <AlertTriangle className="text-red-600 mt-1 flex-shrink-0" size={32} />
                <div>
                  <h2 className="text-3xl font-bold text-red-800 mb-4">
                    Cảnh báo rủi ro quan trọng
                  </h2>
                  <p className="text-lg text-red-700 mb-6">
                    Giao dịch Forex và CFD có rủi ro cao và có thể không phù hợp với tất cả nhà đầu tư.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-3">Rủi ro tài chính</h3>
                  <ul className="text-red-700 space-y-2 text-sm">
                    <li>• Bạn có thể mất toàn bộ số vốn đầu tư</li>
                    <li>• Kết quả trong quá khứ không đảm bảo kết quả tương lai</li>
                    <li>• Đòn bẩy có thể làm tăng cả lợi nhuận và tổn thất</li>
                    <li>• Thị trường có thể biến động bất thường</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-3">Khuyến nghị an toàn</h3>
                  <ul className="text-red-700 space-y-2 text-sm">
                    <li>• Chỉ đầu tư số tiền bạn có thể chấp nhận mất</li>
                    <li>• Luôn test trên demo trước khi chạy live</li>
                    <li>• Theo dõi EA thường xuyên, đặc biệt tuần đầu</li>
                    <li>• Tham khảo ý kiến chuyên gia tài chính</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-white rounded-lg border border-red-200">
                <p className="text-red-700 text-sm">
                  <strong>Tuyên bố miễn trừ trách nhiệm:</strong> 
                  EA LeopardSmart là công cụ hỗ trợ giao dịch, không phải lời khuyên đầu tư. 
                  Chúng tôi không chịu trách nhiệm về tổn thất phát sinh từ việc sử dụng EA. 
                  Hãy luôn thận trọng và quản lý rủi ro hợp lý.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specs */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Thông số kỹ thuật
              </h2>
              <p className="text-lg text-gray-600">
                Chi tiết kỹ thuật và yêu cầu hệ thống
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Nền tảng hỗ trợ</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• MetaTrader 4 (build 1355+)</li>
                  <li>• MetaTrader 5 (build 3200+)</li>
                  <li>• Windows VPS khuyến nghị</li>
                  <li>• Kết nối internet ổn định</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Yêu cầu broker</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Spread thấp (&lt; 2 pips EURUSD)</li>
                  <li>• Execution nhanh (&lt; 100ms)</li>
                  <li>• Cho phép EA/Expert Advisor</li>
                  <li>• Không cấm scalping</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Tham số chính</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Risk per trade: 1-2%</li>
                  <li>• Max open positions: 3</li>
                  <li>• Min R:R ratio: 1:1.5</li>
                  <li>• Max spread: 3 pips</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyCallToAction />
    </div>
  );
}
