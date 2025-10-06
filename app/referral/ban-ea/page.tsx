"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import { TrendingUp, DollarSign, CheckCircle, Clock, Users, BarChart3, Gift, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function BanEAPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-purple-800 to-blue-700 text-white py-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <TrendingUp size={16} />
                <span>Commission cao nhất</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Affiliate Bán EA - <span className="text-yellow-400">30%</span> Hoa Hồng
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                Kiếm hoa hồng cao nhất với chương trình bán EA ThebenchmarkTrader. 
                Phù hợp cho trader có community, kênh Youtube, hoặc blog.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-blue-200">Hoa hồng</div>
                  <div className="text-3xl font-bold">30%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-blue-200">Cookie duration</div>
                  <div className="text-2xl font-bold">90 ngày</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-blue-200">Giá EA</div>
                  <div className="text-2xl font-bold">$299-$899</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commission Calculator */}
        <section className="py-20">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-8">
                <DollarSign className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Ước Tính Thu Nhập
                </h2>
                <p className="text-lg text-gray-600">
                  Tính toán nhanh hoa hồng bạn có thể kiếm được
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <div className="text-sm text-gray-600 mb-2">EA Demo ($299)</div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">$90</div>
                  <div className="text-xs text-gray-500">/ đơn hàng</div>
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="text-sm text-gray-700">10 sales = <strong className="text-blue-600">$900</strong></div>
                    <div className="text-sm text-gray-700">50 sales = <strong className="text-blue-600">$4,500</strong></div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6 text-center border-2 border-green-500">
                  <div className="text-sm text-gray-600 mb-2">EA Standard ($499)</div>
                  <div className="text-4xl font-bold text-green-600 mb-2">$150</div>
                  <div className="text-xs text-gray-500">/ đơn hàng</div>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="text-sm text-gray-700">10 sales = <strong className="text-green-600">$1,500</strong></div>
                    <div className="text-sm text-gray-700">50 sales = <strong className="text-green-600">$7,500</strong></div>
                  </div>
                  <div className="mt-3">
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">Best seller</span>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-6 text-center">
                  <div className="text-sm text-gray-600 mb-2">EA Pro ($899)</div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">$270</div>
                  <div className="text-xs text-gray-500">/ đơn hàng</div>
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <div className="text-sm text-gray-700">10 sales = <strong className="text-purple-600">$2,700</strong></div>
                    <div className="text-sm text-gray-700">50 sales = <strong className="text-purple-600">$13,500</strong></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <p className="text-gray-700 text-lg">
                  <strong>💰 Average affiliate:</strong> Kiếm <strong className="text-green-600">$500-$2,000</strong> / tháng
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Top performers: $5,000+ / tháng với traffic chất lượng cao
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container-custom max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Quyền Lợi Affiliate
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Hoa Hồng 30% Cực Cao
                </h3>
                <p className="text-gray-600 mb-4">
                  Cao hơn hẳn so với các chương trình affiliate EA khác (thường 10-20%). 
                  Bạn xứng đáng được hưởng nhiều hơn cho nỗ lực của mình.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ $90 - $270 mỗi đơn hàng</li>
                  <li>✓ Không giới hạn số đơn</li>
                  <li>✓ Commission lifetime (không expire)</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <Clock className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Cookie 90 Ngày
                </h3>
                <p className="text-gray-600 mb-4">
                  Cookie tracking 90 ngày đảm bảo bạn vẫn được hoa hồng ngay cả khi 
                  khách hàng mua sau 3 tháng kể từ lần click đầu tiên.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Cookie 90 ngày (dài nhất thị trường)</li>
                  <li>✓ Last-click attribution</li>
                  <li>✓ Không lo mất commission</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <BarChart3 className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Dashboard Real-Time
                </h3>
                <p className="text-gray-600 mb-4">
                  Tracking minh bạch 24/7 về clicks, conversions, và earnings. 
                  Export report CSV bất cứ lúc nào.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Track clicks, conversions, revenue</li>
                  <li>✓ View by date, campaign, source</li>
                  <li>✓ Export CSV reports</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <Gift className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Marketing Materials Miễn Phí
                </h3>
                <p className="text-gray-600 mb-4">
                  Banner ads, landing pages, email templates, video demos - 
                  tất cả đã được chuẩn bị sẵn để bạn chỉ việc copy & paste.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ 20+ banner designs (nhiều sizes)</li>
                  <li>✓ Landing page templates</li>
                  <li>✓ Email swipes & scripts</li>
                  <li>✓ Video demos & tutorials</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Cách Thức Hoạt Động
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Đăng Ký & Được Duyệt</h3>
                  <p className="text-gray-600">
                    Điền form đăng ký affiliate. Chúng tôi review và approve trong vòng 24h. 
                    Yêu cầu: có website/blog/channel/group với audience quan tâm forex.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Nhận Tracking Link & Materials</h3>
                  <p className="text-gray-600">
                    Sau khi được approve, bạn nhận unique tracking link, access to dashboard, 
                    và download đầy đủ marketing materials (banners, landing pages, emails).
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Promote EA ThebenchmarkTrader</h3>
                  <p className="text-gray-600">
                    Share tracking link qua blog posts, Youtube videos, Facebook groups, email newsletters, etc. 
                    Sử dụng materials có sẵn hoặc tự sáng tạo content riêng.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Track & Earn Commission</h3>
                  <p className="text-gray-600">
                    Mỗi lần có khách hàng mua EA qua link của bạn, bạn nhận 30% hoa hồng. 
                    Track real-time trên dashboard. Chi trả hàng tuần qua bank transfer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Câu Chuyện Thành Công
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-1 text-yellow-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Tháng đầu tiên kiếm được $3,200 từ 21 sales. Tôi có kênh Youtube 50K subs về forex, 
                  chỉ cần làm 1 video review EA và link affiliate trong description. 
                  Cookie 90 ngày rất ưu việt!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    AN
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Anh Nguyễn</div>
                    <div className="text-sm text-gray-600">Youtube Creator - 50K subs</div>
                    <div className="text-xs text-green-600 font-semibold">Kiếm $3,200 / tháng</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-1 text-yellow-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Tôi viết blog về forex trading. Sau khi publish bài review EA ThebenchmarkTrader, 
                  mỗi tháng có 10-15 sales organic từ SEO. Thu nhập thụ động mà không cần làm gì thêm. 
                  Recommend!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    HT
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Hương Trần</div>
                    <div className="text-sm text-gray-600">Forex Blogger</div>
                    <div className="text-xs text-green-600 font-semibold">Kiếm $1,800 / tháng</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sẵn Sàng Kiếm 30% Commission?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Đăng ký ngay để nhận tracking link và bắt đầu kiếm tiền trong vòng 24h
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
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

