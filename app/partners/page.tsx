"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import { Award, TrendingUp, DollarSign, Shield, ArrowRightLeft, Headphones, AlertCircle } from "lucide-react";
import type { PartnerInfo } from "@/data/partners";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function PartnersPage() {
  const { t, locale } = useLocale();
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null);
  const [activePartners, setActivePartners] = useState<PartnerInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners');
      if (response.ok) {
        const data = await response.json();
        setActivePartners(data.partners || []);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper to get localized partner field
  const getLocalizedField = (partner: PartnerInfo, field: 'spread' | 'license' | 'deposit' | 'support' | 'notes'): string[] => {
    const englishField = `${field}_en` as keyof PartnerInfo;
    return locale === 'en' && partner[englishField] 
      ? (partner[englishField] as string[])
      : partner[field];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-12 text-center">
            <p>Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white py-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-2 bg-blue-700/50 rounded-full text-sm font-medium mb-6">
                {t('partners.hero.badge')}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t('partners.hero.title')}
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                {t('partners.hero.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Partners Grid */}
        <section className="py-20">
          <div className="container-custom">
            <div className="space-y-12">
              {activePartners.map((partner, index) => (
                <div 
                  key={partner.name}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  {/* Partner Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-3xl font-bold mb-2">{partner.name}</h2>
                        <a 
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-100 hover:text-white transition-colors text-sm"
                        >
                          {partner.website} →
                        </a>
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <Award className="w-5 h-5" />
                        <span className="font-semibold">{partner.rating}/5.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Partner Details - Desktop */}
                  <div className="hidden lg:grid lg:grid-cols-5 gap-6 p-6">
                    {/* Spread & Fees */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold mb-4">
                        <TrendingUp className="w-5 h-5" />
                        <h3>{t('partners.sections.spread')}</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {getLocalizedField(partner, 'spread').map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* License */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold mb-4">
                        <Shield className="w-5 h-5" />
                        <h3>{t('partners.sections.license')}</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {getLocalizedField(partner, 'license').map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Deposit/Withdrawal */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold mb-4">
                        <ArrowRightLeft className="w-5 h-5" />
                        <h3>{t('partners.sections.deposit')}</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {getLocalizedField(partner, 'deposit').map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold mb-4">
                        <Headphones className="w-5 h-5" />
                        <h3>{t('partners.sections.support')}</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {getLocalizedField(partner, 'support').map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Notes */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold mb-4">
                        <AlertCircle className="w-5 h-5" />
                        <h3>{t('partners.sections.notes')}</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {getLocalizedField(partner, 'notes').map((item, i) => (
                          <li key={i} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Partner Details - Mobile */}
                  <div className="lg:hidden p-6 space-y-6">
                    {/* Spread & Fees */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        <TrendingUp className="w-5 h-5" />
                        <h3>{t('partners.sections.spreadFull')}</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700 pl-7">
                        {getLocalizedField(partner, 'spread').map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <hr className="border-gray-200" />

                    {/* License */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        <Shield className="w-5 h-5" />
                        <h3>{t('partners.sections.license')}</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700 pl-7">
                        {getLocalizedField(partner, 'license').map((item, i) => (
                          <li key={i}>✓ {item}</li>
                        ))}
                      </ul>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Deposit/Withdrawal */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        <ArrowRightLeft className="w-5 h-5" />
                        <h3>{t('partners.sections.depositFull')}</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700 pl-7">
                        {getLocalizedField(partner, 'deposit').map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Support */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        <Headphones className="w-5 h-5" />
                        <h3>{t('partners.sections.supportFull')}</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700 pl-7">
                        {getLocalizedField(partner, 'support').map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Notes */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        <AlertCircle className="w-5 h-5" />
                        <h3>{t('partners.sections.notesFull')}</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700 pl-2">
                        {getLocalizedField(partner, 'notes').map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="bg-gray-50 p-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                      >
                        {t('partners.cta.openAccount', { name: partner.name })}
                      </a>
                      <a
                        href="#contact"
                        className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                      >
                        {t('partners.cta.consultBroker')}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="bg-yellow-50 border-y border-yellow-200 py-12">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">{t('partners.disclaimer.title')}</h3>
                  <div className="text-gray-700 space-y-2 text-sm">
                    <p>
                      <strong>1. {t('partners.disclaimer.point1.title')}</strong> {t('partners.disclaimer.point1.content')}
                    </p>
                    <p>
                      <strong>2. {t('partners.disclaimer.point2.title')}</strong> {t('partners.disclaimer.point2.content')}
                    </p>
                    <p>
                      <strong>3. {t('partners.disclaimer.point3.title')}</strong> {t('partners.disclaimer.point3.content')}
                    </p>
                    <p>
                      <strong>4. {t('partners.disclaimer.point4.title')}</strong> {t('partners.disclaimer.point4.content')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">{t('partners.faq.title')}</h2>
              
              <div className="space-y-6">
                {Array.isArray(t('partners.faq.items')) && t('partners.faq.items').map((faq: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
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

