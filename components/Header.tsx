"use client";

import { useState, useEffect } from "react";
import { Facebook, Instagram, Twitter, Menu, X, Phone, MapPin } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (typeof window !== "undefined") {
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
                <span>+84765452515</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin size={14} />
                <span className="hidden sm:inline">74 Lê Trọng Tấn, Phường Tây Thạnh, TP. Hồ Chí Minh</span>
                <span className="sm:hidden">TP. Hồ Chí Minh</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <a href="#" className="hover:text-accent-100 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="hover:text-accent-100 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="hover:text-accent-100 transition-colors">
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
          <div className="text-2xl font-bold text-primary-600">
            Phòng Khám Thú Y PawCare
          </div>

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
              onClick={() => isClient && scrollToSection("services")}
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              suppressHydrationWarning
            >
              Dịch Vụ
            </button>
            <button
              onClick={() => isClient && scrollToSection("about")}
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              suppressHydrationWarning
            >
              Về Chúng Tôi
            </button>
            <button
              onClick={() => isClient && scrollToSection("testimonials")}
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              suppressHydrationWarning
            >
              Đánh Giá
            </button>
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
                onClick={() => scrollToSection("services")}
                className="text-left text-gray-700 hover:text-primary-600 transition-colors font-medium"
                suppressHydrationWarning
              >
                Dịch Vụ
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-left text-gray-700 hover:text-primary-600 transition-colors font-medium"
                suppressHydrationWarning
              >
                Về Chúng Tôi
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-left text-gray-700 hover:text-primary-600 transition-colors font-medium"
                suppressHydrationWarning
              >
                Đánh Giá
              </button>
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