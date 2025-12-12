"use client";

import { useState } from "react";
import { Phone, Mail, Clock, MessageCircle, Send, AlertCircle } from "lucide-react";
import HoneypotField from "@/components/HoneypotField";
import { useLocale } from "@/lib/i18n/LocaleContext";

// Client-side email validation (simplified version)
function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254 && !email.includes('..');
}

export default function ForexContact() {
  const { t } = useLocale();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "demo", // demo, purchase, support, custom
    message: "",
    broker: "",
    accountId: "",
    server: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate email in real-time
    if (name === 'email') {
      if (value && !isValidEmail(value.trim())) {
        setEmailError(t('contact.invalidEmail'));
      } else {
        setEmailError('');
      }
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
      setEmailError(t('contact.invalidEmailDetail'));
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
        setSubmitMessage(t('contact.successMessage'));
        setFormData({ name: "", email: "", topic: "demo", message: "", broker: "", accountId: "", server: "" });
        setHoneypot("");
      } else {
        const errorMsg = result.error || t('contact.errorMessage');
        setSubmitMessage(errorMsg);
        // If email validation error, highlight email field
        if (errorMsg.toLowerCase().includes('email')) {
          setEmailError(errorMsg);
        }
      }
    } catch {
      setSubmitMessage(t('contact.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('contact.formTitle')}</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('contact.namePlaceholder')}
                    suppressHydrationWarning={true}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.email')} *
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
                    placeholder={t('contact.emailPlaceholder')}
                    suppressHydrationWarning={true}
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
                    {t('contact.topic')} *
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    required
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    suppressHydrationWarning={true}
                  >
                    <option value="demo">{t('contact.topicDemo')}</option>
                    <option value="purchase">{t('contact.topicPurchase')}</option>
                    <option value="support">{t('contact.topicSupport')}</option>
                    <option value="custom">{t('contact.topicCustom')}</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.message')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder={t('contact.messagePlaceholder')}
                    suppressHydrationWarning={true}
                  />
                </div>

                {/* Trading Account Info (Optional) */}
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-600 mb-4">
                    {t('contact.optional')}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="broker" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.broker')}
                      </label>
                      <input
                        type="text"
                        id="broker"
                        name="broker"
                        value={formData.broker}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={t('contact.brokerPlaceholder')}
                        suppressHydrationWarning={true}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 mb-2">
                          {t('contact.accountId')}
                        </label>
                        <input
                          type="text"
                          id="accountId"
                          name="accountId"
                          value={formData.accountId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder={t('contact.accountIdPlaceholder')}
                          suppressHydrationWarning={true}
                        />
                      </div>

                      <div>
                        <label htmlFor="server" className="block text-sm font-medium text-gray-700 mb-2">
                          {t('contact.server')}
                        </label>
                        <input
                          type="text"
                          id="server"
                          name="server"
                          value={formData.server}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder={t('contact.serverPlaceholder')}
                          suppressHydrationWarning={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Honeypot Field */}
                <HoneypotField value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-semibold text-white transition-colors ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  suppressHydrationWarning={true}
                >
                  <Send size={18} />
                  <span>{isSubmitting ? t('contact.sending') : t('contact.submit')}</span>
                </button>

                {/* Submit Message */}
                {submitMessage && (
                  <div className={`p-4 rounded-lg ${
                    submitMessage.includes(t('contact.successMessage').substring(0, 10))
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="order-1 lg:order-2">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('contact.contactInfoTitle')}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Phone className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{t('contact.phone')}</h4>
                      <p className="text-gray-600">{t('common.phone')}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{t('contact.emailAddress')}</h4>
                      <p className="text-gray-600">{t('common.email')}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{t('contact.workingHours')}</h4>
                      <p className="text-gray-600">{t('contact.workingHoursValue')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Contact Us */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                <h4 className="font-bold text-gray-800 mb-4">{t('contact.whyContactTitle')}</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="text-blue-600 flex-shrink-0 mt-1" size={18} />
                    <div>
                      <p className="font-semibold text-gray-800">{t('contact.response24h')}</p>
                      <p className="text-sm text-gray-600">{t('contact.response24hDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                    <div>
                      <p className="font-semibold text-gray-800">{t('contact.techSupport')}</p>
                      <p className="text-sm text-gray-600">{t('contact.techSupportDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="text-purple-600 flex-shrink-0 mt-1" size={18} />
                    <div>
                      <p className="font-semibold text-gray-800">{t('contact.freeConsult')}</p>
                      <p className="text-sm text-gray-600">{t('contact.freeConsultDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
