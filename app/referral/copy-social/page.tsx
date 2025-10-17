"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import { Users, DollarSign, CheckCircle, Infinity, TrendingUp, Clock, Gift, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function CopySocialPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-900 via-blue-800 to-teal-700 text-white py-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Infinity size={16} />
                <span>Thu nhập thụ động lâu dài</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Copy Social Trading - <span className="text-green-400">10%</span> Hoa Hồng
              </h1>
              <p className="text-xl text-green-100 leading-relaxed mb-8">
                Giới thiệu khách hàng copy trading. Thu nhập thụ động recurring hàng tháng. 
                Cookie lifetime - khách hàng mãi mãi là của bạn!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-green-200">Hoa hồng</div>
                  <div className="text-3xl font-bold">10%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-green-200">Cookie</div>
                  <div className="text-2xl font-bold">Lifetime</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-green-200">Payout</div>
                  <div className="text-2xl font-bold">Monthly</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why This Program */}
        <section className="py-20">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-8">
                <Users className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Tại Sao Chọn Copy Social?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Infinity className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Thu Nhập Thụ Động Recurring</h3>
                      <p className="text-gray-600 text-sm">
                        Khác với bán EA (1 lần), copy trading tạo thu nhập hàng tháng. 
                        Khách copy 1 năm = bạn hưởng hoa hồng 12 tháng!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Cookie Lifetime</h3>
                      <p className="text-gray-600 text-sm">
                        Một khi khách hàng click vào link của bạn, họ mãi mãi là của bạn. 
                        Không lo cookie expire hay mất commission.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Dễ Bán Hơn</h3>
                      <p className="text-gray-600 text-sm">
                        Copy trading dễ hơn mua EA. Khách không cần technical setup, 
                        chỉ 1 click copy. Conversion rate cao hơn!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Ví dụ thu nhập:</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">1 khách copy với $5,000</div>
                      <div className="text-sm text-gray-600 mb-2">Profit share: 20% → Master nhận $200/tháng</div>
                      <div className="text-2xl font-bold text-green-600">Bạn nhận: $20/tháng</div>
                      <div className="text-xs text-gray-500 mt-1">(10% của $200 profit share)</div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">10 khách copy, trung bình $3,000/khách</div>
                      <div className="text-2xl font-bold text-green-600">Bạn nhận: ~$120/tháng</div>
                      <div className="text-xs text-gray-500 mt-1">Thu nhập thụ động mỗi tháng</div>
                    </div>

                    <div className="bg-green-600 text-white rounded-lg p-4">
                      <div className="text-sm mb-1">50 followers sau 6 tháng</div>
                      <div className="text-3xl font-bold">$500-800/tháng</div>
                      <div className="text-xs mt-1">Passive income, không cần làm gì thêm!</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platforms */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
          <div className="container-custom max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Các Nền Tảng Copy Trading
              </h2>
              <p className="text-lg text-gray-600">
                Bạn kiếm hoa hồng khi giới thiệu khách copy trên các platform này
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    MQ
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">MQL5 Signals</h3>
                    <div className="text-sm text-gray-600">Copy trên MT4/MT5</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li>✓ Copy tự động trên MetaTrader</li>
                  <li>✓ Hàng triệu user trên MQL5</li>
                  <li>✓ Verified performance</li>
                  <li>✓ Subscription $30-100/tháng</li>
                </ul>
                <Link
                  href="/live-results"
                  className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Xem tài khoản MQL5
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                    MF
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Myfxbook AutoTrade</h3>
                    <div className="text-sm text-gray-600">AutoTrade với nhiều broker</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li>✓ AutoTrade system</li>
                  <li>✓ Nhiều broker hỗ trợ</li>
                  <li>✓ Track record minh bạch</li>
                  <li>✓ Setup 1 lần, sync forever</li>
                </ul>
                <Link
                  href="/live-results"
                  className="text-green-600 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Xem tài khoản Myfxbook
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                    TM
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Tickmill Social</h3>
                    <div className="text-sm text-gray-600">Copy native trên Tickmill</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li>✓ 1-click copy, dễ nhất</li>
                  <li>✓ Không cần EA hoặc setup</li>
                  <li>✓ 50+ investors đang copy</li>
                  <li>✓ Profit share 20%</li>
                </ul>
                <Link
                  href="/live-results"
                  className="text-orange-600 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Xem Tickmill Social
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    PP
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">PuPrime Social</h3>
                    <div className="text-sm text-gray-600">Copy với vốn thấp</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li>✓ Minimum $200 để copy</li>
                  <li>✓ Phù hợp trader mới</li>
                  <li>✓ 30+ followers</li>
                  <li>✓ Profit share 25%</li>
                </ul>
                <Link
                  href="/live-results"
                  className="text-purple-600 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Xem PuPrime Social
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Quyền Lợi Affiliate
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Infinity className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">Lifetime Cookie</h3>
                <p className="text-gray-600 text-sm">
                  Khách hàng mãi mãi là của bạn. Không expire, không mất commission.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <DollarSign className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">Monthly Payout</h3>
                <p className="text-gray-600 text-sm">
                  Chi trả hàng tháng. Min payout $50. Bank transfer hoặc PayPal.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Gift className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">Marketing Support</h3>
                <p className="text-gray-600 text-sm">
                  Banners, landing pages, video tutorials để promote copy trading.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Story */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container-custom max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 text-lg mb-6 italic">
                "Copy Social là chương trình yêu thích của tôi. Tháng đầu kiếm $180, 
                tháng 6 đã $650/tháng và vẫn tăng. Passive income thực sự, 
                không cần làm gì sau khi refer xong. Highly recommend cho ai muốn thu nhập dài hạn!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  ML
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-lg">Minh Lê</div>
                  <div className="text-gray-600">Trading Community - 2,000 members</div>
                  <div className="text-green-600 font-semibold">$650/tháng passive income</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bắt Đầu Thu Nhập Thụ Động
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Đăng ký ngay để nhận lifetime tracking link và bắt đầu tạo thu nhập hàng tháng
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/referral/apply"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Đăng Ký Affiliate Ngay
                <ArrowRight size={20} className="ml-2" />
              </a>
              <Link
                href="/referral"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
              >
                Xem Các Chương Trình Khác
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyCallToAction />
    </div>
  );
}

