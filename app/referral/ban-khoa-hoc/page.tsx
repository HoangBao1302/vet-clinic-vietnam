"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import { GraduationCap, DollarSign, CheckCircle, BookOpen, Video, FileText, Gift, ArrowRight, Star, Trophy } from "lucide-react";
import Link from "next/link";

export default function BanKhoaHocPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-900 via-red-800 to-purple-700 text-white py-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Trophy size={16} />
                <span>Sản phẩm giá trị cao</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Bán Khóa Học - <span className="text-yellow-400">25%</span> Hoa Hồng
              </h1>
              <p className="text-xl text-orange-100 leading-relaxed mb-8">
                Affiliate cho khóa học Forex Trading Strategy, EA Setup & Optimization. 
                Giá cao ($197-$997), hoa hồng hấp dẫn $49-$249 mỗi đơn!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-orange-200">Hoa hồng</div>
                  <div className="text-3xl font-bold">25%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-orange-200">Cookie</div>
                  <div className="text-2xl font-bold">60 ngày</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-orange-200">Giá khóa học</div>
                  <div className="text-2xl font-bold">$197-997</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Courses Available */}
        <section className="py-20">
          <div className="container-custom max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <GraduationCap className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Các Khóa Học Có Sẵn
              </h2>
              <p className="text-lg text-gray-600">
                Promote các khóa học chất lượng cao với conversion rate tốt
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
                  <BookOpen className="w-10 h-10 mb-3" />
                  <h3 className="text-2xl font-bold mb-2">Forex Foundation</h3>
                  <div className="text-3xl font-bold mb-1">$197</div>
                  <div className="text-sm opacity-90">Your commission: <strong>$49</strong></div>
                </div>
                <div className="p-6">
                  <ul className="space-y-2 text-sm text-gray-700 mb-6">
                    <li>✓ Forex basics đến advanced</li>
                    <li>✓ Technical & fundamental analysis</li>
                    <li>✓ Risk management strategies</li>
                    <li>✓ 30+ video lessons</li>
                    <li>✓ Lifetime access</li>
                  </ul>
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                    <strong>Best for:</strong> Người mới bắt đầu forex
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-orange-500">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white">
                  <Video className="w-10 h-10 mb-3" />
                  <h3 className="text-2xl font-bold mb-2">EA Mastery Course</h3>
                  <div className="text-3xl font-bold mb-1">$497</div>
                  <div className="text-sm opacity-90">Your commission: <strong>$124</strong></div>
                  <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                    BEST SELLER
                  </span>
                </div>
                <div className="p-6">
                  <ul className="space-y-2 text-sm text-gray-700 mb-6">
                    <li>✓ Setup & optimize EA ThebenchmarkTrader</li>
                    <li>✓ Advanced parameter tuning</li>
                    <li>✓ Portfolio management</li>
                    <li>✓ Live trading sessions</li>
                    <li>✓ 60+ videos + private group</li>
                  </ul>
                  <div className="text-xs text-gray-500 bg-orange-50 p-3 rounded">
                    <strong>Best for:</strong> User đã mua EA, muốn tối ưu
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 text-white">
                  <FileText className="w-10 h-10 mb-3" />
                  <h3 className="text-2xl font-bold mb-2">Pro Trader Bundle</h3>
                  <div className="text-3xl font-bold mb-1">$997</div>
                  <div className="text-sm opacity-90">Your commission: <strong>$249</strong></div>
                </div>
                <div className="p-6">
                  <ul className="space-y-2 text-sm text-gray-700 mb-6">
                    <li>✓ All courses above</li>
                    <li>✓ 1-on-1 mentorship (3 sessions)</li>
                    <li>✓ Custom EA settings for your style</li>
                    <li>✓ Priority support lifetime</li>
                    <li>✓ Quarterly strategy updates</li>
                  </ul>
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                    <strong>Best for:</strong> Serious traders muốn all-in
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 text-center">
              <p className="text-gray-700 text-lg">
                <strong>💰 Average earning:</strong> Top affiliates kiếm <strong className="text-orange-600">$800-3,000</strong> / tháng
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Conversion rate: 3-5% (cao hơn nhiều so với bán EA vì khóa học có trial & money-back guarantee)
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
          <div className="container-custom max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Quyền Lợi Affiliate
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <DollarSign className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Commission Cao $49-$249
                </h3>
                <p className="text-gray-600 mb-4">
                  25% của giá khóa học. Với khóa Pro Bundle ($997), 
                  chỉ cần 4 sales/tháng là đã kiếm gần $1,000!
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
                  <div className="flex justify-between mb-2">
                    <span>Foundation (5 sales):</span>
                    <strong className="text-green-600">$245</strong>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>EA Mastery (3 sales):</span>
                    <strong className="text-green-600">$372</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Pro Bundle (2 sales):</span>
                    <strong className="text-green-600">$498</strong>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <Gift className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Tặng Trial Khóa Học
                </h3>
                <p className="text-gray-600 mb-4">
                  Affiliate được FREE access toàn bộ khóa học để test và review trước khi bán. 
                  Bạn cần hiểu sản phẩm mới bán tốt!
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Full access tất cả courses</li>
                  <li>✓ Join private community</li>
                  <li>✓ Certificate sau khi hoàn thành</li>
                  <li>✓ Dùng làm credential khi promote</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <Video className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Marketing Funnel Có Sẵn
                </h3>
                <p className="text-gray-600 mb-4">
                  Landing pages, email sequences, webinar scripts đã được optimize conversion. 
                  Bạn chỉ việc copy & paste!
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ High-converting landing pages</li>
                  <li>✓ Email sequences (7-day nurture)</li>
                  <li>✓ Webinar presentation slides</li>
                  <li>✓ Social media post templates</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <CheckCircle className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Cookie 60 Ngày & Payout 2x/tháng
                </h3>
                <p className="text-gray-600 mb-4">
                  Cookie 60 ngày đủ dài cho decision cycle của khóa học. 
                  Chi trả 2 lần/tháng (ngày 1 và 15).
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Cookie tracking 60 ngày</li>
                  <li>✓ Payout 2 lần/tháng</li>
                  <li>✓ Min payout: $100</li>
                  <li>✓ Bank transfer / PayPal</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How to Promote */}
        <section className="py-20">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Cách Promote Hiệu Quả
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-800 mb-3">📺 Youtube Review</h3>
                <p className="text-gray-600 text-sm">
                  Làm video review khóa học sau khi học xong. Share takeaways và đặt affiliate link 
                  trong description. Conversion rate cao nhất!
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-800 mb-3">✍️ Blog Post</h3>
                <p className="text-gray-600 text-sm">
                  Viết bài "Top 5 khóa học Forex tốt nhất" hoặc case study về journey học forex của bạn. 
                  SEO-friendly, traffic lâu dài.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-800 mb-3">📧 Email List</h3>
                <p className="text-gray-600 text-sm">
                  Nếu có email list về forex/trading, promote qua email campaign. 
                  Dùng email templates có sẵn, customize lại cho phù hợp.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-800 mb-3">👥 Community/Group</h3>
                <p className="text-gray-600 text-sm">
                  Share trong Facebook groups, Telegram channels, Discord servers về forex. 
                  Provide value trước, promote sau.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Story */}
        <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="container-custom max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 text-lg mb-6 italic">
                "Tôi promote khóa EA Mastery cho audience Youtube của mình. 
                Làm 1 video review chi tiết sau khi học xong khóa, 
                tháng đó có 12 sales = $1,488 commission. Tháng sau organic traffic từ Youtube 
                vẫn convert thêm 5-7 sales nữa. Best decision ever!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  AN
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-lg">Anh Nguyễn</div>
                  <div className="text-gray-600">Youtube Creator - Forex Channel 50K subs</div>
                  <div className="text-orange-600 font-semibold">Kiếm $1,488 tháng đầu tiên</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bắt Đầu Kiếm $49-$249 Mỗi Sale
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Đăng ký ngay, được tặng FREE access tất cả khóa học và nhận tracking link trong 24h
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/referral/apply"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
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

