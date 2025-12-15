"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import AuthProtected from "@/components/AuthProtected";
import { TrendingUp, DollarSign, CheckCircle, Clock, Users, BarChart3, Gift, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function BanEAPage() {
  const { t } = useLocale();
  
  return (
    <AuthProtected>
      <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-purple-800 to-blue-700 text-white py-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <TrendingUp size={16} />
                <span>{t('affiliatePages.banEA.hero.badge')}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t('affiliatePages.banEA.hero.title').split('30%')[0]}<span className="text-yellow-400">30%</span>{t('affiliatePages.banEA.hero.title').split('30%')[1] || ' Hoa Hồng'}
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                {t('affiliatePages.banEA.hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-blue-200">{t('affiliatePages.banEA.hero.stats.commission')}</div>
                  <div className="text-3xl font-bold">30%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-blue-200">{t('affiliatePages.banEA.hero.stats.cookie')}</div>
                  <div className="text-2xl font-bold">90 ngày</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-blue-200">{t('affiliatePages.banEA.hero.stats.price')}</div>
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
                  {t('affiliatePages.banEA.calculator.title')}
                </h2>
                <p className="text-lg text-gray-600">
                  {t('affiliatePages.banEA.calculator.subtitle')}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <div className="text-sm text-gray-600 mb-2">EA Demo ($299)</div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">$90</div>
                  <div className="text-xs text-gray-500">{t('affiliatePages.banEA.calculator.perOrder')}</div>
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="text-sm text-gray-700">{t('affiliatePages.banEA.calculator.sales10')} <strong className="text-blue-600">$900</strong></div>
                    <div className="text-sm text-gray-700">{t('affiliatePages.banEA.calculator.sales50')} <strong className="text-blue-600">$4,500</strong></div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6 text-center border-2 border-green-500">
                  <div className="text-sm text-gray-600 mb-2">EA Standard ($499)</div>
                  <div className="text-4xl font-bold text-green-600 mb-2">$150</div>
                  <div className="text-xs text-gray-500">{t('affiliatePages.banEA.calculator.perOrder')}</div>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="text-sm text-gray-700">{t('affiliatePages.banEA.calculator.sales10')} <strong className="text-green-600">$1,500</strong></div>
                    <div className="text-sm text-gray-700">{t('affiliatePages.banEA.calculator.sales50')} <strong className="text-green-600">$7,500</strong></div>
                  </div>
                  <div className="mt-3">
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">{t('affiliatePages.banEA.calculator.bestSeller')}</span>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-6 text-center">
                  <div className="text-sm text-gray-600 mb-2">EA Pro ($899)</div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">$270</div>
                  <div className="text-xs text-gray-500">{t('affiliatePages.banEA.calculator.perOrder')}</div>
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <div className="text-sm text-gray-700">{t('affiliatePages.banEA.calculator.sales10')} <strong className="text-purple-600">$2,700</strong></div>
                    <div className="text-sm text-gray-700">{t('affiliatePages.banEA.calculator.sales50')} <strong className="text-purple-600">$13,500</strong></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <p className="text-gray-700 text-lg">
                  <strong>💰 {t('affiliatePages.banEA.calculator.average')}</strong> {t('affiliatePages.banEA.calculator.averageEarning')}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  {t('affiliatePages.banEA.calculator.topPerformers')}
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
                {t('affiliatePages.banEA.benefits.title')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {t('affiliatePages.banEA.benefits.highCommission.title')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('affiliatePages.banEA.benefits.highCommission.description')}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {Array.isArray(t('affiliatePages.banEA.benefits.highCommission.points')) && 
                    (t('affiliatePages.banEA.benefits.highCommission.points') as string[]).map((point, i) => (
                      <li key={i}>✓ {point}</li>
                    ))
                  }
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <Clock className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {t('affiliatePages.banEA.benefits.cookie.title')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('affiliatePages.banEA.benefits.cookie.description')}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {Array.isArray(t('affiliatePages.banEA.benefits.cookie.points')) && 
                    (t('affiliatePages.banEA.benefits.cookie.points') as string[]).map((point, i) => (
                      <li key={i}>✓ {point}</li>
                    ))
                  }
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <BarChart3 className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {t('affiliatePages.banEA.benefits.dashboard.title')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('affiliatePages.banEA.benefits.dashboard.description')}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {Array.isArray(t('affiliatePages.banEA.benefits.dashboard.points')) && 
                    (t('affiliatePages.banEA.benefits.dashboard.points') as string[]).map((point, i) => (
                      <li key={i}>✓ {point}</li>
                    ))
                  }
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <Gift className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {t('affiliatePages.banEA.benefits.materials.title')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('affiliatePages.banEA.benefits.materials.description')}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {Array.isArray(t('affiliatePages.banEA.benefits.materials.points')) && 
                    (t('affiliatePages.banEA.benefits.materials.points') as string[]).map((point, i) => (
                      <li key={i}>✓ {point}</li>
                    ))
                  }
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
                {t('affiliatePages.banEA.howItWorks.title')}
              </h2>
            </div>

            <div className="space-y-6">
              {Array.isArray(t('affiliatePages.banEA.howItWorks.steps')) && 
                (t('affiliatePages.banEA.howItWorks.steps') as any[]).map((step, index) => {
                  const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600'];
                  return (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6 flex items-start gap-6">
                      <div className={`flex-shrink-0 w-12 h-12 ${colors[index]} text-white rounded-full flex items-center justify-center text-xl font-bold`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t('affiliatePages.banEA.successStories.title')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {Array.isArray(t('affiliatePages.banEA.successStories.stories')) && 
                (t('affiliatePages.banEA.successStories.stories') as any[]).map((story, index) => {
                  const colors = ['bg-blue-600', 'bg-purple-600'];
                  const initials = story.name.split(' ').map((n: string) => n[0]).join('');
                  return (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex items-center gap-1 text-yellow-500 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-4 italic">
                        "{story.quote}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${colors[index]} rounded-full flex items-center justify-center text-white font-bold`}>
                          {initials}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{story.name}</div>
                          <div className="text-sm text-gray-600">{story.role}</div>
                          <div className="text-xs text-green-600 font-semibold">{story.earning}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('affiliatePages.banEA.cta.title')}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t('affiliatePages.banEA.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/referral/apply"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                {t('affiliatePages.banEA.cta.registerButton')}
                <ArrowRight size={20} className="ml-2" />
              </a>
              <Link
                href="/referral"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
              >
                {t('affiliatePages.banEA.cta.viewOthersButton')}
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

