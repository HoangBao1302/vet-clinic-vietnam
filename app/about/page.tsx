"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import Image from "next/image";
import { TrendingUp, Shield, Brain, AlertTriangle, Clock, Target, BarChart3, Settings, Youtube, PlayCircle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function AboutPage() {
  const { t } = useLocale();
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  {t('about.hero.title')}
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  {t('about.hero.subtitle')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                    <TrendingUp size={20} className="text-blue-600" />
                    <span className="font-medium">{t('about.hero.badge1')}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                    <Shield size={20} className="text-green-600" />
                    <span className="font-medium">{t('about.hero.badge2')}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                    <BarChart3 size={20} className="text-purple-600" />
                    <span className="font-medium">{t('about.hero.badge3')}</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/vet-images/3.png"
                  alt="Trading strategy analysis"
                  width={600}
                  height={400}
                  className="rounded-xl shadow-lg"
                  quality={85}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Strategy Details */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t('about.strategy.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('about.strategy.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t('about.strategy.trendFollowing.title')}</h3>
                    <p className="text-gray-600">
                      {t('about.strategy.trendFollowing.desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t('about.strategy.rangeTrading.title')}</h3>
                    <p className="text-gray-600">
                      {t('about.strategy.rangeTrading.desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t('about.strategy.marketCondition.title')}</h3>
                    <p className="text-gray-600">
                      {t('about.strategy.marketCondition.desc')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t('about.strategy.riskManagement.title')}</h3>
                    <p className="text-gray-600">
                      {t('about.strategy.riskManagement.desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t('about.strategy.timeNews.title')}</h3>
                    <p className="text-gray-600">
                      {t('about.strategy.timeNews.desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <Settings className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t('about.strategy.adaptive.title')}</h3>
                    <p className="text-gray-600">
                      {t('about.strategy.adaptive.desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Backtest & Recommendations */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  {t('about.backtest.title')}
                </h2>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3">{t('about.backtest.dataTitle')}</h3>
                    <p className="text-gray-600">
                      {t('about.backtest.dataDesc')}
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3">{t('about.backtest.spreadTitle')}</h3>
                    <p className="text-gray-600">
                      {t('about.backtest.spreadDesc')}
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3">{t('about.backtest.slippageTitle')}</h3>
                    <p className="text-gray-600">
                      {t('about.backtest.slippageDesc')}
                    </p>
                  </div>
                </div>

                {/* YouTube Video Section */}
                <div className="mt-8 bg-gradient-to-r from-red-50 to-blue-50 p-8 rounded-xl border border-red-200">
                  <div className="text-center mb-6">
                    <Youtube className="inline-block text-red-600 mb-4" size={48} />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {t('about.backtest.videoTitle')}
                    </h3>
                    <p className="text-gray-600">
                      {t('about.backtest.videoDesc')}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="https://www.youtube.com/@ThebenchmarkTraderEA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      <Youtube size={20} />
                      <span>{t('about.backtest.watchVideo')}</span>
                    </a>
                    <a
                      href="https://www.youtube.com/@ThebenchmarkTraderEA/playlists"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                      <PlayCircle size={20} />
                      <span>{t('about.backtest.moreVideos')}</span>
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  {t('about.recommendations.title')}
                </h2>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3">{t('about.recommendations.currencyTitle')}</h3>
                    <p className="text-gray-600 mb-2">
                      <strong>{t('about.recommendations.currencyOptimal')}</strong> {t('about.recommendations.currencyOptimalList')}
                    </p>
                    <p className="text-gray-600">
                      <strong>{t('about.recommendations.currencySuitable')}</strong> {t('about.recommendations.currencySuitableList')}
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3">{t('about.recommendations.timeframeTitle')}</h3>
                    <p className="text-gray-600">
                      {t('about.recommendations.timeframeDesc')}
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3">{t('about.recommendations.capitalTitle')}</h3>
                    <p className="text-gray-600">
                      {t('about.recommendations.capitalDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Warning */}
        <section className="py-20 bg-red-50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start space-x-4 mb-8">
                <AlertTriangle className="text-red-600 mt-1 flex-shrink-0" size={32} />
                <div>
                  <h2 className="text-3xl font-bold text-red-800 mb-4">
                    {t('about.riskWarning.title')}
                  </h2>
                  <p className="text-lg text-red-700 mb-6">
                    {t('about.riskWarning.subtitle')}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-3">{t('about.riskWarning.financialTitle')}</h3>
                  <ul className="text-red-700 space-y-2 text-sm">
                    <li>• {t('about.riskWarning.financial1')}</li>
                    <li>• {t('about.riskWarning.financial2')}</li>
                    <li>• {t('about.riskWarning.financial3')}</li>
                    <li>• {t('about.riskWarning.financial4')}</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-3">{t('about.riskWarning.safetyTitle')}</h3>
                  <ul className="text-red-700 space-y-2 text-sm">
                    <li>• {t('about.riskWarning.safety1')}</li>
                    <li>• {t('about.riskWarning.safety2')}</li>
                    <li>• {t('about.riskWarning.safety3')}</li>
                    <li>• {t('about.riskWarning.safety4')}</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-white rounded-lg border border-red-200">
                <p className="text-red-700 text-sm">
                  <strong>{t('about.riskWarning.disclaimerTitle')}</strong> 
                  {' '}{t('about.riskWarning.disclaimer')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specs */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t('about.technical.title')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('about.technical.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">{t('about.technical.platformTitle')}</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• {t('about.technical.platform1')}</li>
                  <li>• {t('about.technical.platform2')}</li>
                  <li>• {t('about.technical.platform3')}</li>
                  <li>• {t('about.technical.platform4')}</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">{t('about.technical.brokerTitle')}</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• {t('about.technical.broker1')}</li>
                  <li>• {t('about.technical.broker2')}</li>
                  <li>• {t('about.technical.broker3')}</li>
                  <li>• {t('about.technical.broker4')}</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">{t('about.technical.parametersTitle')}</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• {t('about.technical.parameters1')}</li>
                  <li>• {t('about.technical.parameters2')}</li>
                  <li>• {t('about.technical.parameters3')}</li>
                  <li>• {t('about.technical.parameters4')}</li>
                </ul>
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
