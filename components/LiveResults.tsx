"use client";

import { ExternalLink, TrendingUp, CheckCircle, Youtube } from "lucide-react";
import Link from "next/link";
import { featuredAccounts } from "@/data/featuredAccounts";
import type { FeaturedAccount } from "@/data/featuredAccounts";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function LiveResults() {
  const { t } = useLocale();
  
  // Filter only active featured accounts and sort by order
  const activeFeaturedAccounts = featuredAccounts
    .filter(a => a.active)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3); // Only show top 3

  return (
    <section id="live-results" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
            <CheckCircle size={16} />
            <span>{t("liveResults.badge")}</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {t("liveResults.title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t("liveResults.subtitle")}
          </p>
        </div>

        {/* Featured Accounts Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {activeFeaturedAccounts.map((account, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{account.name}</h3>
                    <div className="text-sm opacity-90">
                      {account.platform} • {account.broker}
                    </div>
                  </div>
                  {account.copyable && (
                    <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
                      {t("liveResults.copyable")} ✓
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={14} />
                  <span>{t("liveResults.verified")}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{account.gain}</div>
                    <div className="text-xs text-gray-600">{t("liveResults.gain")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{account.drawdown}</div>
                    <div className="text-xs text-gray-600">{t("liveResults.drawdown")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700">{account.days}</div>
                    <div className="text-xs text-gray-600">{t("liveResults.days")}</div>
                  </div>
                </div>

                {/* Action Button */}
                <a
                  href={account.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink size={18} />
                  <span>{t("liveResults.viewAccount")}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info & CTA */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <Link
              href="/live-results"
              className="inline-block text-center px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg"
            >
              {t("liveResults.seeAllAccounts")} →
            </Link>
            <p className="text-sm text-center text-gray-500 mt-4">
              ⚠️ {t("liveResults.disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
