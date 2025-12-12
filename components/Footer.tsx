"use client";

import { useState, useEffect } from "react";
import { Facebook, Instagram, Twitter, Phone, Mail, MessageCircle, Youtube } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Newsletter from "./Newsletter";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function Footer() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLocale();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (typeof window !== "undefined") {
      // Nếu không ở trang chủ, navigate về trang chủ trước
      if (pathname !== "/") {
        router.push(`/#${sectionId}`);
        return;
      }
      
      // Nếu đã ở trang chủ, scroll trực tiếp
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold text-white mb-4">
              {t('hero.title')}
            </div>
            <p className="text-gray-300 mb-6">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/Thebenchmarktrader" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors" 
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com/thebenchmarktrader/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors" 
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://x.com/TheBenchmarkEA" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors" 
                aria-label="X (Twitter)"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://www.youtube.com/@ThebenchmarkTraderEA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors" 
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="https://t.me/thebenchmarktrader" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors" 
                aria-label="Telegram Channel"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => isClient && scrollToSection("home")}
                  className="text-gray-300 hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => isClient && scrollToSection("features")}
                  className="text-gray-300 hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  {t('nav.features')}
                </button>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.pricing')}
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.downloads')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.aboutEA')}
                </Link>
              </li>
              <li>
                <Link href="/live-results" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.liveResults')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.partners')}
                </Link>
              </li>
              <li>
                <button
                  onClick={() => isClient && scrollToSection("contact")}
                  className="text-gray-300 hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a 
                  href="https://www.youtube.com/@ThebenchmarkTraderEA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  <Youtube size={16} />
                  <span>{t('footer.links.youtubeChannel')}</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.youtube.com/@ThebenchmarkTraderEA/playlists" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t('footer.links.videoBacktest')}
                </a>
              </li>
              <li>
                <a 
                  href="https://www.youtube.com/@ThebenchmarkTraderEA/playlists" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t('footer.links.installGuide')}
                </a>
              </li>
              <li>{t('footer.links.demo')}</li>
              <li>{t('footer.links.docs')}</li>
              <li>{t('footer.links.faq')}</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t('footer.contactInfo')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300">{t('common.phone')}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300">{t('common.email')}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300">@thebenchmarktrader</span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-sm">
                  {t('footer.supportTime')}
                </p>
                <p className="text-gray-400 text-sm">
                  {t('footer.telegramSupport')}
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <Newsletter variant="footer" />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
                {t('footer.links.privacy')}
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                {t('footer.links.terms')}
              </Link>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                {t('footer.riskWarning')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 