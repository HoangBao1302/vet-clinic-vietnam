"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import { ExternalLink, TrendingUp, Shield, Users, BarChart3, Youtube, Copy, CheckCircle, AlertCircle } from "lucide-react";
import { tradingAccounts } from "@/data/tradingAccounts";
import type { TradingAccount } from "@/data/tradingAccounts";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function LiveResultsPage() {
  const { t } = useLocale();
  // Filter only active trading accounts
  const activeAccounts = tradingAccounts.filter(a => a.active).sort((a, b) => a.order - b.order);

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
                <span>{t('liveResults.hero.badge')}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t('liveResults.hero.title')}
              </h1>
              <p className="text-xl text-green-100 leading-relaxed mb-8">
                {t('liveResults.hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-green-200">{t('liveResults.hero.totalProfit')}</div>
                  <div className="text-2xl font-bold">{t('liveResults.hero.totalProfitValue')}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-green-200">{t('liveResults.hero.verifiedAccounts')}</div>
                  <div className="text-2xl font-bold">{activeAccounts.length}+</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-green-200">{t('liveResults.hero.followersLabel')}</div>
                  <div className="text-2xl font-bold">{t('liveResults.hero.followersValue')}</div>
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
                <h3 className="font-semibold text-gray-800 mb-1">{t('liveResults.whyTrust.verified')}</h3>
                <p className="text-sm text-gray-600">{t('liveResults.whyTrust.verifiedDesc')}</p>
              </div>
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">{t('liveResults.whyTrust.realtime')}</h3>
                <p className="text-sm text-gray-600">{t('liveResults.whyTrust.realtimeDesc')}</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">{t('liveResults.whyTrust.liveData')}</h3>
                <p className="text-sm text-gray-600">{t('liveResults.whyTrust.liveDataDesc')}</p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">{t('liveResults.whyTrust.copyTrading')}</h3>
                <p className="text-sm text-gray-600">{t('liveResults.whyTrust.copyTradingDesc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trading Accounts Grid */}
        <section className="py-20">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t('liveResults.accounts.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('liveResults.accounts.subtitle')}
              </p>
            </div>

            <div className="space-y-8 max-w-6xl mx-auto">
              {activeAccounts.map((account, index) => (
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
                              {t('liveResults.accounts.verified')}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="flex items-center gap-1">
                            <strong>{t('liveResults.accounts.platform')}</strong> {account.platform}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <strong>{t('liveResults.accounts.broker')}</strong> {account.broker}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <strong>{t('liveResults.accounts.account')}</strong> {account.accountNumber}
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
                        <div className="text-sm text-gray-600 mb-1">{t('liveResults.accounts.gain')}</div>
                        <div className="text-2xl font-bold text-green-600">{account.stats.gain}</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">{t('liveResults.accounts.drawdown')}</div>
                        <div className="text-2xl font-bold text-red-600">{account.stats.drawdown}</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">{t('liveResults.accounts.winRate')}</div>
                        <div className="text-2xl font-bold text-blue-600">{account.stats.winRate}</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">{t('liveResults.accounts.profitFactor')}</div>
                        <div className="text-2xl font-bold text-purple-600">{account.stats.profitFactor}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">{t('liveResults.accounts.days')}</div>
                        <div className="text-xl font-bold text-gray-700">{account.stats.tradingDays}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {account.description}
                    </p>

                    {/* Highlights */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">{t('liveResults.accounts.highlights')}</h4>
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
                          <span>{t('liveResults.accounts.viewProfile')}</span>
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
                          <span>{t('liveResults.accounts.copyNow')}</span>
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
                          <span>{t('liveResults.accounts.videoGuide')}</span>
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
                  {t('liveResults.copyGuide.title')}
                </h2>
                <p className="text-lg text-gray-600">
                  {t('liveResults.copyGuide.subtitle')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {t('liveResults.copyGuide.mql5Title')}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {t('liveResults.copyGuide.mql5Desc')}
                  </p>
                  <a
                    href="https://www.youtube.com/watch?v=MQL5_COPY_GUIDE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                  >
                    <Youtube size={18} />
                    <span>{t('liveResults.copyGuide.mql5Link')}</span>
                  </a>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-green-500 transition-colors">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {t('liveResults.copyGuide.myfxbookTitle')}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {t('liveResults.copyGuide.myfxbookDesc')}
                  </p>
                  <a
                    href="https://www.youtube.com/watch?v=MYFXBOOK_COPY_GUIDE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                  >
                    <Youtube size={18} />
                    <span>{t('liveResults.copyGuide.myfxbookLink')}</span>
                  </a>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-orange-500 transition-colors">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {t('liveResults.copyGuide.tickmillTitle')}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {t('liveResults.copyGuide.tickmillDesc')}
                  </p>
                  <a
                    href="https://www.youtube.com/watch?v=TICKMILL_COPY_TUTORIAL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                  >
                    <Youtube size={18} />
                    <span>{t('liveResults.copyGuide.tickmillLink')}</span>
                  </a>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-purple-500 transition-colors">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {t('liveResults.copyGuide.puprimeTitle')}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {t('liveResults.copyGuide.puprimeDesc')}
                  </p>
                  <a
                    href="https://www.youtube.com/watch?v=PUPRIME_COPY_TUTORIAL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                  >
                    <Youtube size={18} />
                    <span>{t('liveResults.copyGuide.puprimeLink')}</span>
                  </a>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <p className="text-gray-700 mb-4">
                  <strong>{t('liveResults.copyGuide.compareTitle')}</strong> {t('liveResults.copyGuide.compareDesc')}
                </p>
                <a
                  href="https://www.youtube.com/watch?v=COPY_VS_EA_VIDEO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Youtube size={20} />
                  <span>{t('liveResults.copyGuide.compareLink')}</span>
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
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('liveResults.disclaimer.title')}</h3>
                <div className="text-gray-700 space-y-2 text-sm">
                  <p>
                    <strong>{t('liveResults.disclaimer.past')}</strong> {t('liveResults.disclaimer.pastDesc')}
                  </p>
                  <p>
                    <strong>{t('liveResults.disclaimer.copyRisk')}</strong> {t('liveResults.disclaimer.copyRiskDesc')}
                  </p>
                  <p>
                    <strong>{t('liveResults.disclaimer.fees')}</strong> {t('liveResults.disclaimer.feesDesc')}
                  </p>
                  <p>
                    <strong>{t('liveResults.disclaimer.recommendation')}</strong> {t('liveResults.disclaimer.recommendationDesc')}
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
              {t('liveResults.cta.title')}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t('liveResults.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                {t('liveResults.cta.viewPricing')}
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
              >
                {t('liveResults.cta.contactCopy')}
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

