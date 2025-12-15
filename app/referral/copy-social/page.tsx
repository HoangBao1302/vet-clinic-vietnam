"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import AuthProtected from "@/components/AuthProtected";
import { Users, DollarSign, CheckCircle, Infinity, TrendingUp, Clock, Gift, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function CopySocialPage() {
  const { t, locale } = useLocale();
  
  return (
    <AuthProtected>
      <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-900 via-blue-800 to-teal-700 text-white py-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Infinity size={16} />
                <span>{t('affiliatePages.copySocial.hero.badge')}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t('affiliatePages.copySocial.hero.title').split('10%')[0]}<span className="text-green-400">10%</span>{t('affiliatePages.copySocial.hero.title').split('10%')[1] || ' Hoa Hồng'}
              </h1>
              <p className="text-xl text-green-100 leading-relaxed mb-8">
                {t('affiliatePages.copySocial.hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-green-200">{t('affiliatePages.copySocial.hero.stats.commission')}</div>
                  <div className="text-3xl font-bold">10%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-green-200">{t('affiliatePages.copySocial.hero.stats.cookie')}</div>
                  <div className="text-2xl font-bold">Lifetime</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-green-200">{t('affiliatePages.copySocial.hero.stats.payout')}</div>
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
                  {t('affiliatePages.copySocial.whyThis.title')}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {Array.isArray(t('affiliatePages.copySocial.whyThis.reasons')) && 
                    t('affiliatePages.copySocial.whyThis.reasons').map((reason: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 ${idx === 0 ? 'bg-green-100' : idx === 1 ? 'bg-blue-100' : 'bg-purple-100'} rounded-full flex items-center justify-center`}>
                          {idx === 0 && <Infinity className="w-5 h-5 text-green-600" />}
                          {idx === 1 && <Clock className="w-5 h-5 text-blue-600" />}
                          {idx === 2 && <TrendingUp className="w-5 h-5 text-purple-600" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 mb-1">{reason.title}</h3>
                          <p className="text-gray-600 text-sm">{reason.description}</p>
                        </div>
                      </div>
                    ))
                  }
                </div>

                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {t('affiliatePages.copySocial.whyThis.example.title')}
                  </h3>
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
                {t('affiliatePages.copySocial.platforms.title')}
              </h2>
              <p className="text-lg text-gray-600">
                {locale === 'vi' 
                  ? 'Bạn kiếm hoa hồng khi giới thiệu khách copy trên các platform này'
                  : 'Earn commissions by referring customers to copy on these platforms'
                }
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
                    <div className="text-sm text-gray-600">
                      {locale === 'vi' ? 'Copy trên MT4/MT5' : 'Copy on MT4/MT5'}
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li>✓ {locale === 'vi' ? 'Copy tự động trên MetaTrader' : 'Auto copy on MetaTrader'}</li>
                  <li>✓ {locale === 'vi' ? 'Hàng triệu user trên MQL5' : 'Millions of users on MQL5'}</li>
                  <li>✓ Verified performance</li>
                  <li>✓ {locale === 'vi' ? 'Subscription $30-100/tháng' : 'Subscription $30-100/month'}</li>
                </ul>
                <Link
                  href="/live-results"
                  className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  {locale === 'vi' ? 'Xem tài khoản MQL5' : 'View MQL5 account'}
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
                    <div className="text-sm text-gray-600">
                      {locale === 'vi' ? 'AutoTrade với nhiều broker' : 'AutoTrade with multiple brokers'}
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li>✓ AutoTrade system</li>
                  <li>✓ {locale === 'vi' ? 'Nhiều broker hỗ trợ' : 'Multiple brokers supported'}</li>
                  <li>✓ {locale === 'vi' ? 'Track record minh bạch' : 'Transparent track record'}</li>
                  <li>✓ {locale === 'vi' ? 'Setup 1 lần, sync forever' : 'Setup once, sync forever'}</li>
                </ul>
                <Link
                  href="/live-results"
                  className="text-green-600 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  {locale === 'vi' ? 'Xem tài khoản Myfxbook' : 'View Myfxbook account'}
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
                    <div className="text-sm text-gray-600">
                      {locale === 'vi' ? 'Copy native trên Tickmill' : 'Native copy on Tickmill'}
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li>✓ {locale === 'vi' ? '1-click copy, dễ nhất' : '1-click copy, easiest'}</li>
                  <li>✓ {locale === 'vi' ? 'Không cần EA hoặc setup' : 'No EA or setup needed'}</li>
                  <li>✓ {locale === 'vi' ? '50+ investors đang copy' : '50+ investors copying'}</li>
                  <li>✓ Profit share 20%</li>
                </ul>
                <Link
                  href="/live-results"
                  className="text-orange-600 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  {locale === 'vi' ? 'Xem Tickmill Social' : 'View Tickmill Social'}
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
                    <div className="text-sm text-gray-600">
                      {locale === 'vi' ? 'Copy với vốn thấp' : 'Copy with low capital'}
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li>✓ {locale === 'vi' ? 'Minimum $200 để copy' : 'Minimum $200 to copy'}</li>
                  <li>✓ {locale === 'vi' ? 'Phù hợp trader mới' : 'Suitable for new traders'}</li>
                  <li>✓ 30+ followers</li>
                  <li>✓ Profit share 25%</li>
                </ul>
                <Link
                  href="/live-results"
                  className="text-purple-600 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  {locale === 'vi' ? 'Xem PuPrime Social' : 'View PuPrime Social'}
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
                {locale === 'vi' ? 'Quyền Lợi Affiliate' : 'Affiliate Benefits'}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Infinity className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">Lifetime Cookie</h3>
                <p className="text-gray-600 text-sm">
                  {locale === 'vi' 
                    ? 'Khách hàng mãi mãi là của bạn. Không expire, không mất commission.'
                    : 'Customers are yours forever. No expiry, no lost commissions.'
                  }
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <DollarSign className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">Monthly Payout</h3>
                <p className="text-gray-600 text-sm">
                  {locale === 'vi'
                    ? 'Chi trả hàng tháng. Min payout $50. Bank transfer hoặc PayPal.'
                    : 'Monthly payout. Min $50. Bank transfer or PayPal.'
                  }
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Gift className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">Marketing Support</h3>
                <p className="text-gray-600 text-sm">
                  {locale === 'vi'
                    ? 'Banners, landing pages, video tutorials để promote copy trading.'
                    : 'Banners, landing pages, video tutorials to promote copy trading.'
                  }
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
                {locale === 'vi'
                  ? '"Copy Social là chương trình yêu thích của tôi. Tháng đầu kiếm $180, tháng 6 đã $650/tháng và vẫn tăng. Passive income thực sự, không cần làm gì sau khi refer xong. Highly recommend cho ai muốn thu nhập dài hạn!"'
                  : '"Copy Social is my favorite program. First month earned $180, by month 6 already $650/month and still growing. True passive income, no work needed after referring. Highly recommend for anyone wanting long-term income!"'
                }
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  ML
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-lg">Minh Lê</div>
                  <div className="text-gray-600">
                    {locale === 'vi' ? 'Trading Community - 2,000 members' : 'Trading Community - 2,000 members'}
                  </div>
                  <div className="text-green-600 font-semibold">
                    {locale === 'vi' ? '$650/tháng passive income' : '$650/month passive income'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('affiliatePages.copySocial.cta.title')}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t('affiliatePages.copySocial.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/referral/apply"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                {t('affiliatePages.copySocial.cta.registerButton')}
                <ArrowRight size={20} className="ml-2" />
              </a>
              <Link
                href="/referral"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
              >
                {t('affiliatePages.copySocial.cta.viewOthersButton')}
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

