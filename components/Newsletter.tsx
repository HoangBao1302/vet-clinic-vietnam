"use client";

import { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { Mail, Send, CheckCircle, Star, TrendingUp, Users } from "lucide-react";

interface NewsletterProps {
  variant?: 'hero' | 'sidebar' | 'footer';
}

export default function Newsletter({ variant = 'hero' }: NewsletterProps) {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLocale();
  const [email, setEmail] = useState(user?.email || "");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
        setMessage(t('newsletter.successToast'));
      } else {
        setMessage(data.message || t('newsletter.errorMessage'));
      }
    } catch (error) {
      setMessage(t('newsletter.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'hero') {
    return (
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Mail className="w-8 h-8 text-yellow-300" />
              <h2 className="text-3xl md:text-4xl font-bold">
                {t('newsletter.heroTitle')}
              </h2>
              <Star className="w-8 h-8 text-yellow-300" />
            </div>
            
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {t('newsletter.heroDescription')}
            </p>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <TrendingUp className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('newsletter.benefits.marketAnalysis')}</h3>
                <p className="text-blue-100 text-sm">
                  {t('newsletter.benefits.marketAnalysisDesc')}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Star className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('newsletter.benefits.tradingSignals')}</h3>
                <p className="text-blue-100 text-sm">
                  {t('newsletter.benefits.tradingSignalsDesc')}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Users className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('newsletter.benefits.communityAccess')}</h3>
                <p className="text-blue-100 text-sm">
                  {t('newsletter.benefits.communityAccessDesc')}
                </p>
              </div>
            </div>

            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('newsletter.emailPlaceholder')}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        {t('newsletter.subscribe')}
                      </>
                    )}
                  </button>
                </div>
                {message && (
                  <p className={`mt-3 text-sm ${message.includes('thành công') || message.includes('successful') ? 'text-green-300' : 'text-red-300'}`}>
                    {message}
                  </p>
                )}
              </form>
            ) : (
              <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-6 max-w-md mx-auto">
                <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-300 mb-2">
                  {t('newsletter.successTitle')}
                </h3>
                <p className="text-green-100">
                  {t('newsletter.successMessage', { email })}
                </p>
              </div>
            )}

            <p className="text-blue-200 text-sm mt-6">
              {t('newsletter.disclaimer')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">{t('newsletter.premium')}</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          {t('newsletter.sidebarDescription')}
        </p>

        {!isSubscribed ? (
          <form onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletter.emailPlaceholderShort')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={14} />
                  {t('newsletter.subscribe')}
                </>
              )}
            </button>
            {message && (
              <p className={`mt-2 text-xs ${message.includes('thành công') || message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </form>
        ) : (
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-green-600 font-medium">
              {t('newsletter.successShort')}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center justify-center gap-2">
          <Mail size={20} />
          {t('newsletter.premium')}
        </h3>
        <p className="text-blue-200 text-sm mb-4">
          {t('newsletter.footerDescription')}
        </p>
        
        {!isSubscribed ? (
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletter.emailPlaceholderShort')}
              className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </form>
        ) : (
          <div className="text-green-300 text-sm">
            <CheckCircle className="w-5 h-5 inline mr-1" />
            {t('newsletter.successShort')}
          </div>
        )}
        
        {message && (
          <p className={`mt-2 text-xs ${message.includes('thành công') || message.includes('successful') ? 'text-green-300' : 'text-red-300'}`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  return null;
}
