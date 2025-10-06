"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import { Gift, TrendingUp, Users, GraduationCap, DollarSign, CheckCircle, Star, ChevronRight, Copy as CopyIcon, Handshake } from "lucide-react";
import Link from "next/link";

interface AffiliateProgram {
  id: string;
  title: string;
  slug: string;
  commission: string;
  icon: any;
  color: string;
  description: string;
  benefits: string[];
  payoutMethod: string;
  minPayout: string;
  cookieDuration: string;
}

const affiliatePrograms: AffiliateProgram[] = [
  {
    id: "ea-sales",
    title: "Bán EA",
    slug: "ban-ea",
    commission: "30%",
    icon: TrendingUp,
    color: "from-blue-600 to-purple-600",
    description: "Kiếm hoa hồng cao nhất với chương trình bán EA ThebenchmarkTrader. Phù hợp cho trader có community hoặc kênh youtube/blog.",
    benefits: [
      "Hoa hồng 30% cho mỗi đơn hàng thành công",
      "Tracking link riêng với cookie 90 ngày",
      "Dashboard theo dõi real-time",
      "Marketing materials & banner ads miễn phí",
      "Được ưu tiên support kỹ thuật",
      "Chi trả hàng tuần qua bank transfer"
    ],
    payoutMethod: "Bank Transfer / PayPal / Crypto",
    minPayout: "$100",
    cookieDuration: "90 ngày"
  },
  {
    id: "copy-social",
    title: "Copy Social Trading",
    slug: "copy-social",
    commission: "10%",
    icon: Users,
    color: "from-green-600 to-blue-600",
    description: "Giới thiệu khách hàng copy trading trên MQL5, Myfxbook, Tickmill Social hoặc PuPrime Social. Thu nhập thụ động lâu dài.",
    benefits: [
      "Hoa hồng 10% từ profit share hàng tháng",
      "Thu nhập thụ động recurring (khách copy = bạn vẫn hưởng hoa hồng)",
      "Cookie lifetime (khách hàng mãi mãi là của bạn)",
      "Không cần bán hàng, chỉ giới thiệu",
      "Dashboard tracking số followers & earnings",
      "Chi trả hàng tháng"
    ],
    payoutMethod: "Bank Transfer / PayPal",
    minPayout: "$50",
    cookieDuration: "Lifetime"
  },
  {
    id: "courses",
    title: "Bán Khóa Học",
    slug: "ban-khoa-hoc",
    commission: "25%",
    icon: GraduationCap,
    color: "from-orange-600 to-red-600",
    description: "Affiliate cho khóa học Forex Trading Strategy, EA Setup & Optimization. Sản phẩm giá trị cao, hoa hồng hấp dẫn.",
    benefits: [
      "Hoa hồng 25% cho mỗi khóa học bán được",
      "Khóa học từ $197 - $997 (hoa hồng $49 - $249)",
      "Tặng trial khóa học để bạn test trước khi bán",
      "Marketing funnel & email templates có sẵn",
      "Cookie 60 ngày",
      "Chi trả 2 lần/tháng"
    ],
    payoutMethod: "Bank Transfer / PayPal",
    minPayout: "$100",
    cookieDuration: "60 ngày"
  }
];

export default function ReferralPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-900 via-blue-800 to-green-700 text-white py-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Gift size={16} />
                <span>Kiếm Thu Nhập Thụ Động</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Chương Trình Tiếp Thị Liên Kết
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                Kiếm tiền bằng cách giới thiệu EA, Copy Trading, và Khóa Học Forex. 
                Hoa hồng cao, tracking minh bạch, chi trả đúng hạn.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-blue-200">Hoa hồng cao nhất</div>
                  <div className="text-2xl font-bold">30%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-blue-200">Cookie tối đa</div>
                  <div className="text-2xl font-bold">Lifetime</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-blue-200">Đối tác</div>
                  <div className="text-2xl font-bold">200+</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-12 bg-blue-50 border-y border-blue-200">
          <div className="container-custom">
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="text-center">
                <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">Hoa Hồng Cao</h3>
                <p className="text-sm text-gray-600">10-30% mỗi đơn hàng, cao nhất thị trường</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">Minh Bạch</h3>
                <p className="text-sm text-gray-600">Dashboard tracking real-time mọi click & sale</p>
              </div>
              <div className="text-center">
                <Handshake className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">Hỗ Trợ Tốt</h3>
                <p className="text-sm text-gray-600">Dedicated manager, materials, training</p>
              </div>
              <div className="text-center">
                <Star className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">Chi Trả Đúng Hạn</h3>
                <p className="text-sm text-gray-600">Không delay, không lý do từ chối</p>
              </div>
            </div>
          </div>
        </section>

        {/* Affiliate Programs */}
        <section className="py-20">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                3 Chương Trình Affiliate
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Chọn chương trình phù hợp với audience của bạn. Bạn có thể tham gia cả 3 cùng lúc!
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
              {affiliatePrograms.map((program, index) => {
                const IconComponent = program.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1"
                  >
                    {/* Card Header */}
                    <div className={`bg-gradient-to-r ${program.color} p-6 text-white`}>
                      <IconComponent className="w-12 h-12 mb-3" />
                      <h3 className="text-2xl font-bold mb-2">{program.title}</h3>
                      <div className="text-3xl font-bold">{program.commission}</div>
                      <div className="text-sm opacity-90">Hoa hồng</div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {program.description}
                      </p>

                      {/* Benefits */}
                      <div className="space-y-3 mb-6">
                        {program.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      {/* Details */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cookie:</span>
                          <span className="font-semibold text-gray-800">{program.cookieDuration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Min Payout:</span>
                          <span className="font-semibold text-gray-800">{program.minPayout}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phương thức:</span>
                          <span className="font-semibold text-gray-800 text-xs">{program.payoutMethod}</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Link
                        href={`/referral/${program.slug}`}
                        className="block text-center px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                      >
                        Tìm Hiểu Thêm
                        <ChevronRight size={18} className="inline ml-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Cách Thức Hoạt Động
              </h2>
              <p className="text-lg text-gray-600">
                Chỉ 4 bước đơn giản để bắt đầu kiếm tiền
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Đăng Ký</h3>
                <p className="text-gray-600 text-sm">
                  Điền form đăng ký, được duyệt trong 24h
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Nhận Link</h3>
                <p className="text-gray-600 text-sm">
                  Nhận affiliate link, banner, materials
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Chia Sẻ</h3>
                <p className="text-gray-600 text-sm">
                  Share link trên blog, youtube, social
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Kiếm Tiền</h3>
                <p className="text-gray-600 text-sm">
                  Nhận hoa hồng mỗi khi có sale
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Đối Tác Nói Gì Về Chúng Tôi
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-1 text-yellow-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Kiếm được $3,200 trong tháng đầu tiên. Dashboard tracking rất chi tiết, chi trả đúng hạn!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    AN
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Anh Nguyễn</div>
                    <div className="text-sm text-gray-600">Youtube 50K subs</div>
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
                  "Copy Social program tuyệt vời! Thu nhập thụ động mỗi tháng mà không cần làm gì thêm."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    ML
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Minh Lê</div>
                    <div className="text-sm text-gray-600">Trading Community</div>
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
                  "Marketing materials chuyên nghiệp. Support team nhiệt tình. Highly recommend!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    HT
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Hương Trần</div>
                    <div className="text-sm text-gray-600">Forex Blogger</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sẵn Sàng Bắt Đầu Kiếm Tiền?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Đăng ký ngay hôm nay và nhận tracking link trong vòng 24h. 
              Miễn phí, không rủi ro, không yêu cầu đầu tư.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                <Gift size={20} className="mr-2" />
                Đăng Ký Affiliate Ngay
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
              >
                Hoặc Liên Hệ Tư Vấn
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Câu Hỏi Thường Gặp
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Tôi có cần website/blog để tham gia không?
                </h3>
                <p className="text-gray-600">
                  Không bắt buộc! Bạn có thể share link qua Facebook, Telegram, Youtube comments, 
                  hoặc bất kỳ kênh nào bạn có audience quan tâm đến forex trading.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Khi nào tôi nhận được tiền?
                </h3>
                <p className="text-gray-600">
                  Bán EA & Khóa học: Chi trả hàng tuần/2 tuần 1 lần. Copy Social: Chi trả hàng tháng. 
                  Minimum payout $50-$100 tùy chương trình.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Tôi có thể tham gia cả 3 chương trình?
                </h3>
                <p className="text-gray-600">
                  Có! Bạn có thể promote cả EA, Copy Trading, và Khóa Học cùng lúc. 
                  Mỗi chương trình có tracking link riêng.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Làm sao để tracking được sale của mình?
                </h3>
                <p className="text-gray-600">
                  Sau khi được duyệt, bạn sẽ có quyền truy cập vào Affiliate Dashboard với tracking 
                  real-time về clicks, conversions, earnings. Update 24/7.
                </p>
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

