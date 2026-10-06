"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import { ExternalLink, Shield, BarChart3, CheckCircle, AlertCircle } from "lucide-react";
import { withVerifiedAccountCopy, type TradingAccount } from "@/data/tradingAccounts";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { withMetaQuotesMark } from "@/lib/trademarks";

export default function LiveResultsClient({ initialAccounts }: { initialAccounts: TradingAccount[] }) {
  const { t, locale } = useLocale();
  const [activeAccounts, setActiveAccounts] = useState<TradingAccount[]>(initialAccounts);

  useEffect(() => {
    const refreshAccounts = async () => {
      try {
        const response = await fetch('/api/trading-accounts');
        if (response.ok) {
          const data = await response.json();
          if (data.accounts?.length) {
            setActiveAccounts(withVerifiedAccountCopy(data.accounts));
          }
        }
      } catch (error) {
        console.error('Error fetching trading accounts:', error);
      }
    };

    refreshAccounts();
  }, []);

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
                <span>{t('liveResultsPage.hero.badge')}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t('liveResultsPage.hero.title')}
              </h1>
              <p className="text-xl text-green-100 leading-relaxed mb-2">
                {t('liveResultsPage.hero.subtitle')}
              </p>
              <p className="text-green-200/80 text-xs mt-2 mb-8">
                {t('liveResultsPage.hero.metaquotes')}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-green-200">{t('liveResultsPage.hero.totalProfit')}</div>
                  <div className="text-2xl font-bold">{t('liveResultsPage.hero.totalProfitValue')}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-green-200">{t('liveResultsPage.hero.verifiedAccounts')}</div>
                  <div className="text-2xl font-bold">{activeAccounts.length}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="text-sm text-green-200">{t('liveResultsPage.hero.tradingDaysLabel')}</div>
                  <div className="text-2xl font-bold">{t('liveResultsPage.hero.tradingDaysValue')}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Trust Section */}
        <section className="py-12 bg-blue-50 border-y border-blue-200">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="text-center">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">{t('liveResultsPage.whyTrust.verified')}</h3>
                <p className="text-sm text-gray-600">{t('liveResultsPage.whyTrust.verifiedDesc')}</p>
              </div>
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">{t('liveResultsPage.whyTrust.realtime')}</h3>
                <p className="text-sm text-gray-600">{t('liveResultsPage.whyTrust.realtimeDesc')}</p>
              </div>
              <div className="text-center">
                <ExternalLink className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">{t('liveResultsPage.whyTrust.liveData')}</h3>
                <p className="text-sm text-gray-600">{t('liveResultsPage.whyTrust.liveDataDesc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trading Accounts Grid */}
        <section className="py-20">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t('liveResultsPage.accounts.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('liveResultsPage.accounts.subtitle')}
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
                              {t('liveResultsPage.accounts.verified')}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="flex items-center gap-1">
                            <strong>{t('liveResultsPage.accounts.platform')}</strong> {withMetaQuotesMark(account.platform)}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <strong>{t('liveResultsPage.accounts.broker')}</strong> {account.broker}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <strong>{t('liveResultsPage.accounts.account')}</strong> {account.accountNumber}
                          </span>
                        </div>
                      </div>
                      {account.badge && (
                        <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                          {locale === 'en' ? account.badge_en : account.badge}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">{t('liveResultsPage.accounts.gain')}</div>
                        <div className="text-2xl font-bold text-green-600">{account.stats.gain}</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">{t('liveResultsPage.accounts.drawdown')}</div>
                        <div className="text-2xl font-bold text-red-600">{account.stats.drawdown}</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">{t('liveResultsPage.accounts.winRate')}</div>
                        <div className="text-2xl font-bold text-blue-600">{account.stats.winRate}</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">{t('liveResultsPage.accounts.profitFactor')}</div>
                        <div className="text-2xl font-bold text-purple-600">{account.stats.profitFactor}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">{t('liveResultsPage.accounts.days')}</div>
                        <div className="text-xl font-bold text-gray-700">{account.stats.tradingDays}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {withMetaQuotesMark(locale === 'en' ? account.description_en : account.description)}
                    </p>

                    {/* Highlights */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">{t('liveResultsPage.accounts.highlights')}</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {(locale === 'en' ? account.highlights_en : account.highlights)?.map((highlight, i) => (
                          <div key={i} className="text-sm text-gray-700">
                            {withMetaQuotesMark(highlight)}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {account.links?.profile && (
                        <a
                          href={account.links.profile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          <ExternalLink size={18} />
                          <span>{t('liveResultsPage.accounts.viewProfile')}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-4">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <p className="text-xs text-gray-500">
                <strong>{t('liveResultsPage.disclaimer.brokerTitle')}</strong>{" "}
                {t('liveResultsPage.disclaimer.broker')}
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section id="risk-warning" className="py-12 bg-yellow-50 border-y border-yellow-200">
          <div className="container-custom max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('liveResultsPage.disclaimer.title')}</h3>
                <div className="text-gray-700 space-y-2 text-sm">
                  <p>
                    <strong>{t('liveResultsPage.disclaimer.past')}</strong> {t('liveResultsPage.disclaimer.pastDesc')}
                  </p>
                  <p>
                    <strong>{t('liveResultsPage.disclaimer.forexRisk')}</strong> {t('liveResultsPage.disclaimer.forexRiskDesc')}
                  </p>
                  <p>
                    <strong>{t('liveResultsPage.disclaimer.software')}</strong> {t('liveResultsPage.disclaimer.softwareDesc')}
                  </p>
                  <p>
                    <strong>{t('liveResultsPage.disclaimer.recommendation')}</strong> {t('liveResultsPage.disclaimer.recommendationDesc')}
                  </p>
                  {locale === "en" && (
                    <p>
                      <strong>Operator:</strong> Thebenchmarktrader LLC, 117 S Lexington St Ste 100, Harrisonville, MO 64701
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('liveResultsPage.cta.title')}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t('liveResultsPage.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                {t('liveResultsPage.cta.viewPricing')}
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

