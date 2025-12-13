"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import { Check, Download, ShoppingCart, Star, ChevronDown, ChevronUp, Send, Youtube, PlayCircle, Video, AlertCircle } from "lucide-react";
import HoneypotField from "@/components/HoneypotField";
import { useLocale } from "@/contexts/LocaleContext";

export default function PricingPage() {
  const { t } = useLocale();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Generate pricing plans from translations
  const pricingPlans = [
    {
      id: "demo",
      name: t('pricing.plans.demo.name'),
      price: t('pricing.plans.demo.price'),
      period: t('pricing.plans.demo.period'),
      description: t('pricing.plans.demo.description'),
      features: t('pricing.plans.demo.features') as unknown as string[],
      limitations: t('pricing.plans.demo.limitations') as unknown as string[],
      cta: t('pricing.plans.demo.cta'),
      popular: false,
      color: "border-gray-200"
    },
    {
      id: "full",
      name: t('pricing.plans.full.name'),
      price: t('pricing.plans.full.price'),
      period: t('pricing.plans.full.period'),
      description: t('pricing.plans.full.description'),
      features: t('pricing.plans.full.features') as unknown as string[],
      limitations: t('pricing.plans.full.limitations') as unknown as string[],
      cta: t('pricing.plans.full.cta'),
      popular: true,
      color: "border-blue-500"
    },
    {
      id: "pro",
      name: t('pricing.plans.pro.name'),
      price: t('pricing.plans.pro.price'),
      period: t('pricing.plans.pro.period'),
      description: t('pricing.plans.pro.description'),
      features: t('pricing.plans.pro.features') as unknown as string[],
      limitations: t('pricing.plans.pro.limitations') as unknown as string[],
      cta: t('pricing.plans.pro.cta'),
      popular: false,
      color: "border-purple-500"
    }
  ];

  // Generate FAQs from translations
  const faqQuestions = t('pricing.faq.questions') as unknown as Array<{ q: string; a: string; }>;
  const faqs = faqQuestions.map((item) => ({
    question: item.q,
    answer: item.a
  }));
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "demo",
    message: "",
    broker: "",
    accountId: "",
    server: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Client-side email validation
  const isValidEmail = (email: string): boolean => {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254 && !email.includes('..');
  };

  // Fix hydration mismatch by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate email in real-time
    if (name === 'email') {
      if (value && !isValidEmail(value.trim())) {
        setEmailError(t('pricing.contactForm.emailInvalid'));
      } else {
        setEmailError('');
      }
    }
  };

  const handlePlanClick = (planId: string) => {
    // Reset submit message khi click button mới
    setSubmitMessage("");
    
    // Mapping plan ID to form topic
    const topicMap: { [key: string]: string } = {
      'demo': 'demo',
      'full': 'purchase', 
      'pro': 'custom'
    };
    
    const topic = topicMap[planId];
    if (topic) {
      // Set form data trước
      setFormData(prev => ({ 
        ...prev, 
        topic,
        message: planId === 'demo' 
          ? t('pricing.contactForm.demoMessage')
          : planId === 'full'
          ? t('pricing.contactForm.fullMessage')
          : t('pricing.contactForm.proMessage')
      }));
      
      // Scroll xuống form sau một chút để user thấy được update
      setTimeout(() => {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
          contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    if (honeypot && honeypot.trim() !== '') {
      console.warn('Bot detected via honeypot');
      return; // Silent fail
    }
    
    // Email validation
    const trimmedEmail = formData.email.trim();
    if (!isValidEmail(trimmedEmail)) {
      setEmailError(t('pricing.contactForm.emailInvalidDetail'));
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage("");
    setEmailError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          honeypot: honeypot,
        }),
      });

      const result = await response.json();

      if (result.ok) {
        setSubmitMessage(t('pricing.contactForm.successMessage'));
        setFormData({ name: "", email: "", topic: "demo", message: "", broker: "", accountId: "", server: "" });
        setHoneypot("");
      } else {
        const errorMsg = result.error || t('pricing.contactForm.errorMessage');
        setSubmitMessage(errorMsg);
        // If email validation error, highlight email field
        if (errorMsg.toLowerCase().includes('email')) {
          setEmailError(errorMsg);
        }
      }
    } catch {
      setSubmitMessage(t('pricing.contactForm.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              {t('pricing.hero.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {t('pricing.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan) => (
                <div 
                  key={plan.id}
                  id={plan.id}
                  className={`relative bg-white border-2 ${plan.color} rounded-2xl p-8 shadow-lg ${
                    plan.popular ? 'transform scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                        <Star size={16} className="fill-current" />
                        <span>{t('pricing.popular')}</span>
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-gray-800 mb-2">{plan.price}</div>
                    <div className="text-gray-600 mb-4">{plan.period}</div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <h4 className="font-semibold text-gray-800">{t('pricing.features')}:</h4>
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check size={16} className="text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </div>
                    ))}

                    {plan.limitations.length > 0 && (
                      <>
                        <h4 className="font-semibold text-gray-800 mt-6">{t('pricing.limitations')}:</h4>
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-4 h-4 mt-1 flex-shrink-0 border border-gray-300 rounded-full"></div>
                            <span className="text-gray-500 text-sm">{limitation}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {isClient ? (
                    <button 
                      onClick={() => handlePlanClick(plan.id)}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                        plan.popular 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {plan.id === 'demo' && <Download size={18} className="inline mr-2" />}
                      {plan.id === 'full' && <ShoppingCart size={18} className="inline mr-2" />}
                      {plan.id === 'pro' && <Send size={18} className="inline mr-2" />}
                      {plan.cta}
                    </button>
                  ) : (
                    <div 
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                        plan.popular 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {plan.id === 'demo' && <Download size={18} className="inline mr-2" />}
                      {plan.id === 'full' && <ShoppingCart size={18} className="inline mr-2" />}
                      {plan.id === 'pro' && <Send size={18} className="inline mr-2" />}
                      {plan.cta}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Installation Video Section */}
        <section className="py-20 bg-gradient-to-br from-red-50 to-blue-50">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                  <Video className="text-red-600" size={48} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {t('pricing.guide.title')}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t('pricing.guide.subtitle')}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{t('pricing.guide.step1Number')}</div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('pricing.guide.step1')}</h3>
                  <p className="text-sm text-gray-600">
                    {t('pricing.guide.step1Desc')}
                  </p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{t('pricing.guide.step2Number')}</div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('pricing.guide.step2')}</h3>
                  <p className="text-sm text-gray-600">
                    {t('pricing.guide.step2Desc')}
                  </p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{t('pricing.guide.step3Number')}</div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('pricing.guide.step3')}</h3>
                  <p className="text-sm text-gray-600">
                    {t('pricing.guide.step3Desc')}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    try {
                      // Primary URL - use the specific video link from remote
                      const url = 'https://www.youtube.com/watch?v=Ld_k8T_UQPc&list=PLeTOW6sILCDjZAV7VKoILaxKe6-OOnjNp';
                      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
                      
                      // Fallback if popup blocked
                      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                        window.location.href = url;
                      }
                    } catch (error) {
                      console.error('Error opening YouTube:', error);
                      // Fallback to direct navigation
                      window.location.href = 'https://www.youtube.com/watch?v=Ld_k8T_UQPc&list=PLeTOW6sILCDjZAV7VKoILaxKe6-OOnjNp';
                    }
                  }}
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  <Youtube size={24} />
                  <span>{t('pricing.guide.watchVideo')}</span>
                </button>
                <button
                  onClick={() => {
                    try {
                      // Primary URL
                      const url = 'https://www.youtube.com/@ThebenchmarkTraderEA/playlists';
                      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
                      
                      // Fallback if popup blocked
                      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                        window.location.href = url;
                      }
                    } catch (error) {
                      console.error('Error opening YouTube playlists:', error);
                      // Fallback to direct navigation
                      window.location.href = 'https://www.youtube.com/@ThebenchmarkTraderEA/playlists';
                    }
                  }}
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  <PlayCircle size={24} />
                  <span>{t('pricing.guide.allVideos')}</span>
                </button>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 text-center">
                  <strong>{t('pricing.guide.tip')}</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t('pricing.faq.title')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('pricing.faq.subtitle')}
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                  >
                    <span className="font-semibold text-gray-800">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-500" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact-form" className="py-20 bg-white">
          <div className="container-custom max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t('pricing.contactForm.title')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('pricing.contactForm.subtitle')}
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pricing.contactForm.name')} {t('pricing.contactForm.required')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('pricing.contactForm.namePlaceholder')}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pricing.contactForm.email')} {t('pricing.contactForm.required')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      emailError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('pricing.contactForm.emailPlaceholder')}
                  />
                  {emailError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {emailError}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pricing.contactForm.package')} {t('pricing.contactForm.required')}
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    required
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="demo">{t('pricing.contactForm.packageDemo')}</option>
                    <option value="purchase">{t('pricing.contactForm.packageFull')}</option>
                    <option value="custom">{t('pricing.contactForm.packagePro')}</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pricing.contactForm.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('pricing.contactForm.messagePlaceholder')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="broker" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pricing.contactForm.broker')}
                    </label>
                    <input
                      type="text"
                      id="broker"
                      name="broker"
                      value={formData.broker}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t('pricing.contactForm.brokerPlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pricing.contactForm.accountId')}
                    </label>
                    <input
                      type="text"
                      id="accountId"
                      name="accountId"
                      value={formData.accountId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t('pricing.contactForm.accountIdPlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="server" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pricing.contactForm.server')}
                    </label>
                    <input
                      type="text"
                      id="server"
                      name="server"
                      value={formData.server}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t('pricing.contactForm.serverPlaceholder')}
                    />
                  </div>
                </div>

                {/* Honeypot Field - Hidden from users, visible to bots */}
                <HoneypotField 
                  value={honeypot}
                  onChange={setHoneypot}
                  name="website"
                />
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Send size={18} />
                  <span>{isSubmitting ? t('pricing.contactForm.submitting') : t('pricing.contactForm.submit')}</span>
                </button>
              </form>
              
              {submitMessage && (
                <div className={`mt-4 p-4 rounded-lg text-sm ${
                  submitMessage.includes(t('pricing.contactForm.successMessage').substring(0, 10)) 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  {submitMessage}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyCallToAction />
    </div>
  );
}

