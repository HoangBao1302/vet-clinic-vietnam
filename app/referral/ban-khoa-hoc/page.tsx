"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import AuthProtected from "@/components/AuthProtected";
import { GraduationCap, DollarSign, CheckCircle, BookOpen, Video, FileText, Gift, ArrowRight, Star, Trophy } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function BanKhoaHocPage() {
  const { t, locale } = useLocale();
  
  return (
    <AuthProtected>
      <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-900 via-red-800 to-purple-700 text-white py-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Trophy size={16} />
                <span>{t('affiliatePages.banKhoaHoc.hero.badge')}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t('affiliatePages.banKhoaHoc.hero.title').split('25%')[0]}<span className="text-yellow-400">25%</span>{t('affiliatePages.banKhoaHoc.hero.title').split('25%')[1] || ' Hoa Hồng'}
              </h1>
              <p className="text-xl text-orange-100 leading-relaxed mb-8">
                {t('affiliatePages.banKhoaHoc.hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-orange-200">{t('affiliatePages.banKhoaHoc.hero.stats.commission')}</div>
                  <div className="text-3xl font-bold">25%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-orange-200">{t('affiliatePages.banKhoaHoc.hero.stats.cookie')}</div>
                  <div className="text-2xl font-bold">60 ngày</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-orange-200">{t('affiliatePages.banKhoaHoc.hero.stats.courses')}</div>
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
                {t('affiliatePages.banKhoaHoc.courses.title')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('affiliatePages.banKhoaHoc.courses.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {Array.isArray(t('affiliatePages.banKhoaHoc.courses.items')) &&
                t('affiliatePages.banKhoaHoc.courses.items').map((course: any, idx: number) => (
                  <div 
                    key={idx} 
                    className={`bg-white rounded-xl shadow-lg overflow-hidden ${idx === 1 ? 'border-2 border-orange-500' : ''}`}
                  >
                    <div className={`bg-gradient-to-br ${idx === 0 ? 'from-blue-500 to-purple-600' : idx === 1 ? 'from-orange-500 to-red-600' : 'from-purple-600 to-pink-600'} p-6 text-white`}>
                      {idx === 0 && <BookOpen className="w-10 h-10 mb-3" />}
                      {idx === 1 && <Video className="w-10 h-10 mb-3" />}
                      {idx === 2 && <FileText className="w-10 h-10 mb-3" />}
                      <h3 className="text-2xl font-bold mb-2">{course.name}</h3>
                      <div className="text-3xl font-bold mb-1">{course.price}</div>
                      <div className="text-sm opacity-90">
                        {locale === 'vi' ? 'Hoa hồng của bạn' : 'Your commission'}: <strong>{course.commission}</strong>
                      </div>
                      {course.badge && (
                        <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                          {course.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <ul className="space-y-2 text-sm text-gray-700 mb-6">
                        {Array.isArray(course.features) && course.features.map((feature: string, fIdx: number) => (
                          <li key={fIdx}>✓ {feature}</li>
                        ))}
                      </ul>
                      <div className={`text-xs text-gray-500 ${idx === 1 ? 'bg-orange-50' : 'bg-gray-50'} p-3 rounded`}>
                        <strong>Best for:</strong> {locale === 'vi' 
                          ? idx === 0 ? 'Người mới bắt đầu forex' : idx === 1 ? 'User đã mua EA, muốn tối ưu' : 'Serious traders muốn all-in'
                          : idx === 0 ? 'Forex beginners' : idx === 1 ? 'EA users wanting optimization' : 'Serious traders going all-in'
                        }
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>

            <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 text-center">
              <p className="text-gray-700 text-lg">
                <strong>💰 {locale === 'vi' ? 'Average earning' : 'Average earning'}:</strong> {locale === 'vi' ? 'Top affiliates kiếm' : 'Top affiliates earn'} <strong className="text-orange-600">$800-3,000</strong> / {locale === 'vi' ? 'tháng' : 'month'}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                {locale === 'vi'
                  ? 'Conversion rate: 3-5% (cao hơn nhiều so với bán EA vì khóa học có trial & money-back guarantee)'
                  : 'Conversion rate: 3-5% (much higher than EA sales because courses have trial & money-back guarantee)'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
          <div className="container-custom max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t('affiliatePages.banKhoaHoc.benefits.title')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {Array.isArray(t('affiliatePages.banKhoaHoc.benefits.items')) &&
                t('affiliatePages.banKhoaHoc.benefits.items').map((benefit: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-xl shadow-lg p-6">
                    {idx === 0 && <DollarSign className="w-12 h-12 text-green-600 mb-4" />}
                    {idx === 1 && <Gift className="w-12 h-12 text-orange-600 mb-4" />}
                    {idx === 2 && <Video className="w-12 h-12 text-blue-600 mb-4" />}
                    {idx === 3 && <CheckCircle className="w-12 h-12 text-purple-600 mb-4" />}
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {benefit.description}
                    </p>
                    {idx === 0 ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
                        {Array.isArray(benefit.points) && benefit.points.map((point: string, pIdx: number) => (
                          <div key={pIdx} className={`flex justify-between ${pIdx < benefit.points.length - 1 ? 'mb-2' : ''}`}>
                            <span>{point.split(':')[0]}:</span>
                            <strong className="text-green-600">{point.split(':')[1]}</strong>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-2 text-sm text-gray-700">
                        {Array.isArray(benefit.points) && benefit.points.map((point: string, pIdx: number) => (
                          <li key={pIdx}>✓ {point}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              }
            </div>
          </div>
        </section>

        {/* How to Promote */}
        <section className="py-20">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {locale === 'vi' ? 'Cách Promote Hiệu Quả' : 'Effective Promotion Methods'}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-800 mb-3">📺 Youtube Review</h3>
                <p className="text-gray-600 text-sm">
                  {locale === 'vi'
                    ? 'Làm video review khóa học sau khi học xong. Share takeaways và đặt affiliate link trong description. Conversion rate cao nhất!'
                    : 'Make course review videos after completing them. Share takeaways and put affiliate link in description. Highest conversion rate!'
                  }
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-800 mb-3">✍️ Blog Post</h3>
                <p className="text-gray-600 text-sm">
                  {locale === 'vi'
                    ? 'Viết bài "Top 5 khóa học Forex tốt nhất" hoặc case study về journey học forex của bạn. SEO-friendly, traffic lâu dài.'
                    : 'Write "Top 5 Best Forex Courses" or case study about your forex learning journey. SEO-friendly, long-term traffic.'
                  }
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-800 mb-3">📧 Email List</h3>
                <p className="text-gray-600 text-sm">
                  {locale === 'vi'
                    ? 'Nếu có email list về forex/trading, promote qua email campaign. Dùng email templates có sẵn, customize lại cho phù hợp.'
                    : 'If you have forex/trading email list, promote via email campaign. Use ready-made email templates, customize as needed.'
                  }
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-800 mb-3">👥 Community/Group</h3>
                <p className="text-gray-600 text-sm">
                  {locale === 'vi'
                    ? 'Share trong Facebook groups, Telegram channels, Discord servers về forex. Provide value trước, promote sau.'
                    : 'Share in Facebook groups, Telegram channels, Discord servers about forex. Provide value first, promote later.'
                  }
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
                {locale === 'vi'
                  ? '"Tôi promote khóa EA Mastery cho audience Youtube của mình. Làm 1 video review chi tiết sau khi học xong khóa, tháng đó có 12 sales = $1,488 commission. Tháng sau organic traffic từ Youtube vẫn convert thêm 5-7 sales nữa. Best decision ever!"'
                  : '"I promoted EA Mastery course to my Youtube audience. Made 1 detailed review video after completing the course, that month had 12 sales = $1,488 commission. Next month organic traffic from Youtube still converted 5-7 more sales. Best decision ever!"'
                }
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  AN
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-lg">Anh Nguyễn</div>
                  <div className="text-gray-600">Youtube Creator - Forex Channel 50K subs</div>
                  <div className="text-orange-600 font-semibold">
                    {locale === 'vi' ? 'Kiếm $1,488 tháng đầu tiên' : 'Earned $1,488 first month'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('affiliatePages.banKhoaHoc.cta.title')}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t('affiliatePages.banKhoaHoc.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/referral/apply"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                {t('affiliatePages.banKhoaHoc.cta.registerButton')}
                <ArrowRight size={20} className="ml-2" />
              </a>
              <Link
                href="/referral"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
              >
                {t('affiliatePages.banKhoaHoc.cta.viewOthersButton')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyCallToAction />
      </div>
    </AuthProtected>
  );
}

