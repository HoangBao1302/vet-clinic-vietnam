"use client";

import { useState, useEffect } from "react";
import { Facebook, Instagram, Twitter, Menu, X, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle hash navigation when landing on homepage
  useEffect(() => {
    if (pathname === "/" && typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        // Đợi component render xong rồi mới scroll
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }
  }, [pathname]);

  const scrollToSection = (sectionId: string) => {
    if (typeof window !== "undefined") {
      // Nếu không ở trang chủ, navigate về trang chủ trước
      if (pathname !== "/") {
        router.push(`/#${sectionId}`);
        setIsMenuOpen(false);
        return;
      }
      
      // Nếu đã ở trang chủ, scroll trực tiếp
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary-600 text-white py-2">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm space-y-1 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Phone size={14} />
                <span>+84 901 234 567</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail size={14} />
                <span className="hidden sm:inline">support@leopardsmart.com</span>
                <span className="sm:hidden">Support</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <a 
                href="https://www.facebook.com/YOUR_PAGE_NAME" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-100 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="https://www.instagram.com/YOUR_INSTAGRAM_NAME" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-100 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="https://twitter.com/YOUR_TWITTER_NAME" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-100 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
            EA Forex LeopardSmart
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => isClient && scrollToSection("home")}
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              suppressHydrationWarning
            >
              Trang Chủ
            </button>
            <button
              onClick={() => isClient && scrollToSection("features")}
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              suppressHydrationWarning
            >
              Tính Năng
            </button>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Bảng Giá
            </Link>
            <Link
              href="/downloads"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Downloads
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Về EA
            </Link>
            <Link
              href="/live-results"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Kết Quả Thực Tế
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Blog
            </Link>
            <Link
              href="/partners"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Đối Tác
            </Link>
            <button
              onClick={() => isClient && scrollToSection("contact")}
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              suppressHydrationWarning
            >
              Liên Hệ
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => isClient && setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary-600"
            suppressHydrationWarning
          >
            {isClient && isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isClient && isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("home")}
                className="text-left text-gray-700 hover:text-primary-600 transition-colors font-medium"
                suppressHydrationWarning
              >
                Trang Chủ
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-left text-gray-700 hover:text-primary-600 transition-colors font-medium"
                suppressHydrationWarning
              >
                Tính Năng
              </button>
              <Link
                href="/pricing"
                className="text-left text-gray-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Bảng Giá
              </Link>
              <Link
                href="/downloads"
                className="text-left text-gray-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Downloads
              </Link>
              <Link
                href="/about"
                className="text-left text-gray-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Về EA
              </Link>
              <Link
                href="/live-results"
                className="text-left text-gray-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Kết Quả Thực Tế
              </Link>
              <Link
                href="/blog"
                className="text-left text-gray-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/partners"
                className="text-left text-gray-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Đối Tác
              </Link>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-left text-gray-700 hover:text-primary-600 transition-colors font-medium"
                suppressHydrationWarning
              >
                Liên Hệ
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 