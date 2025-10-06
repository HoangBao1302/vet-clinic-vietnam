"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import { Award, TrendingUp, DollarSign, Shield, ArrowRightLeft, Headphones, AlertCircle } from "lucide-react";

interface PartnerInfo {
  name: string;
  logo?: string;
  website: string;
  spread: string[];
  license: string[];
  deposit: string[];
  support: string[];
  notes: string[];
  rating: number;
}

const partners: PartnerInfo[] = [
  {
    name: "Tickmill",
    website: "https://tickmill.com",
    rating: 4.5,
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
    name: "ThinkMarkets",
    website: "https://thinkmarkets.com",
    rating: 4.3,
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
    name: "PuPrime",
    website: "https://puprime.com",
    rating: 4.1,
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

export default function PartnersPage() {
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white py-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-2 bg-blue-700/50 rounded-full text-sm font-medium mb-6">
                Broker Partners
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Đối Tác Broker Uy Tín
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Danh sách các broker được khuyến nghị để sử dụng EA Forex ThebenchmarkTrader. 
                Mỗi broker đều được đánh giá kỹ về spread, giấy phép, và hỗ trợ khách hàng.
              </p>
            </div>
          </div>
        </section>

        {/* Partners Grid */}
        <section className="py-20">
          <div className="container-custom">
            <div className="space-y-12">
              {partners.map((partner, index) => (
                <div 
                  key={partner.name}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  {/* Partner Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-3xl font-bold mb-2">{partner.name}</h2>
                        <a 
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-100 hover:text-white transition-colors text-sm"
                        >
                          {partner.website} →
                        </a>
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <Award className="w-5 h-5" />
                        <span className="font-semibold">{partner.rating}/5.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Partner Details - Desktop */}
                  <div className="hidden lg:grid lg:grid-cols-5 gap-6 p-6">
                    {/* Spread & Fees */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold mb-4">
                        <TrendingUp className="w-5 h-5" />
                        <h3>Spread & Phí</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {partner.spread.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* License */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold mb-4">
                        <Shield className="w-5 h-5" />
                        <h3>Giấy Phép</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {partner.license.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Deposit/Withdrawal */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold mb-4">
                        <ArrowRightLeft className="w-5 h-5" />
                        <h3>Nạp & Rút</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {partner.deposit.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold mb-4">
                        <Headphones className="w-5 h-5" />
                        <h3>Hỗ Trợ</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {partner.support.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Notes */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold mb-4">
                        <AlertCircle className="w-5 h-5" />
                        <h3>Lưu Ý</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {partner.notes.map((item, i) => (
                          <li key={i} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Partner Details - Mobile */}
                  <div className="lg:hidden p-6 space-y-6">
                    {/* Spread & Fees */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        <TrendingUp className="w-5 h-5" />
                        <h3>Spread & Phí Giao Dịch</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700 pl-7">
                        {partner.spread.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <hr className="border-gray-200" />

                    {/* License */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        <Shield className="w-5 h-5" />
                        <h3>Giấy Phép</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700 pl-7">
                        {partner.license.map((item, i) => (
                          <li key={i}>✓ {item}</li>
                        ))}
                      </ul>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Deposit/Withdrawal */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        <ArrowRightLeft className="w-5 h-5" />
                        <h3>Nạp và Rút Tiền</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700 pl-7">
                        {partner.deposit.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Support */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        <Headphones className="w-5 h-5" />
                        <h3>Liên Hệ và Hỗ Trợ</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700 pl-7">
                        {partner.support.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Notes */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        <AlertCircle className="w-5 h-5" />
                        <h3>Một Số Lưu Ý</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700 pl-2">
                        {partner.notes.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="bg-gray-50 p-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                      >
                        Mở Tài Khoản với {partner.name}
                      </a>
                      <a
                        href="#contact"
                        className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                      >
                        Tư Vấn Broker Phù Hợp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="bg-yellow-50 border-y border-yellow-200 py-12">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">Lưu Ý Quan Trọng</h3>
                  <div className="text-gray-700 space-y-2 text-sm">
                    <p>
                      <strong>1. Đánh giá độc lập:</strong> Thông tin trên đây là đánh giá độc lập dựa trên nghiên cứu 
                      và kinh nghiệm thực tế. Chúng tôi không nhận hoa hồng từ các broker này (hoặc có thể nhận - 
                      vui lòng kiểm tra điều khoản cụ thể).
                    </p>
                    <p>
                      <strong>2. Tự nghiên cứu:</strong> Bạn nên tự mình nghiên cứu và kiểm chứng thông tin broker 
                      trước khi quyết định mở tài khoản. Thông tin có thể thay đổi theo thời gian.
                    </p>
                    <p>
                      <strong>3. Rủi ro giao dịch:</strong> Forex và CFD trading có rủi ro cao. Chỉ giao dịch với 
                      số tiền bạn có thể chấp nhận mất. EA không đảm bảo lợi nhuận.
                    </p>
                    <p>
                      <strong>4. Phù hợp broker:</strong> EA ThebenchmarkTrader hoạt động tốt trên broker có spread thấp, 
                      execution nhanh, và không hạn chế scalping/EA. Kiểm tra demo trước khi chạy live.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Câu Hỏi Thường Gặp</h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2">EA hoạt động trên broker nào?</h3>
                  <p className="text-gray-700">
                    EA ThebenchmarkTrader hoạt động trên hầu hết các broker hỗ trợ MT4/MT5. Tuy nhiên, hiệu suất tốt nhất 
                    trên các broker có spread thấp, execution nhanh (ECN/STP), và không hạn chế chiến lược EA.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2">Tôi có nhận được hoa hồng nếu đăng ký qua link?</h3>
                  <p className="text-gray-700">
                    Chúng tôi có thể có chương trình IB/affiliate với một số broker. Tuy nhiên, điều này không ảnh hưởng 
                    đến spread hay điều kiện giao dịch của bạn. Bạn luôn có thể đăng ký trực tiếp nếu muốn.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2">Broker nào phù hợp nhất với EA này?</h3>
                  <p className="text-gray-700">
                    Nếu ưu tiên regulation mạnh: Tickmill (FCA) hoặc ThinkMarkets (FCA/ASIC). 
                    Nếu vốn nhỏ hoặc mới bắt đầu: PuPrime ($50 minimum). 
                    Nếu scalping nhiều: Tickmill (spread 0.0, execution tốt).
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2">Có cần VPS không?</h3>
                  <p className="text-gray-700">
                    Nên có VPS để EA chạy 24/7 ổn định. ThinkMarkets và một số broker khác cung cấp VPS miễn phí 
                    với điều kiện deposit/volume nhất định. Bạn cũng có thể thuê VPS riêng.
                  </p>
                </div>
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

