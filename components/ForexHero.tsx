"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function ForexHero() {
  const [isClient, setIsClient] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom w-full py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="text-white space-y-8">
            <div className="animate-fade-in">
              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                {t('hero.subtitle')}
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 animate-slide-up">
              <span className="px-4 py-2 bg-blue-700/50 backdrop-blur-sm rounded-full text-sm font-medium border border-blue-400/30">
                ✅ {t('hero.badges.mt4mt5')}
              </span>
              <span className="px-4 py-2 bg-blue-700/50 backdrop-blur-sm rounded-full text-sm font-medium border border-blue-400/30">
                🛡️ {t('hero.badges.riskControl')}
              </span>
              <span className="px-4 py-2 bg-blue-700/50 backdrop-blur-sm rounded-full text-sm font-medium border border-blue-400/30">
                📊 {t('hero.badges.backtestFriendly')}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
              <button 
                onClick={() => isClient && (window.location.href = '/pricing#demo')}
                className="px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                suppressHydrationWarning
              >
                {t('common.tryDemo')}
              </button>
              <button 
                onClick={() => isClient && (window.location.href = '/pricing#full')}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-blue-400"
                suppressHydrationWarning
              >
                {t('common.buyNow')}
              </button>
            </div>
          </div>

          {/* Right Column - Performance Stats Card */}
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 animate-slide-up">
            <h2 className="text-2xl font-bold text-white mb-6">{t('hero.performanceTitle')}</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-blue-200 text-sm font-medium">{t('hero.stats.profitFactor')}</div>
                <div className="text-3xl font-bold text-white">2.4</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-blue-200 text-sm font-medium">{t('hero.stats.drawdown')}</div>
                <div className="text-3xl font-bold text-white">8.5%</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-blue-200 text-sm font-medium">{t('hero.stats.winRate')}</div>
                <div className="text-3xl font-bold text-white">68%</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-blue-200 text-sm font-medium">{t('hero.stats.riskReward')}</div>
                <div className="text-3xl font-bold text-white">1:2.1</div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-blue-100 text-sm leading-relaxed">
                <span className="font-semibold">⚠️ {t('hero.disclaimer')}</span> {t('hero.disclaimerText')}
              </p>
            </div>

            <div className="mt-6">
              <button 
                onClick={() => isClient && document.getElementById("proof")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full px-6 py-3 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
                suppressHydrationWarning
              >
                Xem Chi Tiết Backtest
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={() => isClient && document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            className="text-white/60 hover:text-white transition-colors"
            suppressHydrationWarning
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}


