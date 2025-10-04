"use client";

import { useState, useEffect } from "react";
import { Facebook, Instagram, Twitter, Menu, X, Phone, Mail, ChevronDown, LogIn, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.referral-dropdown')) {
        setIsReferralOpen(false);
      }
      if (!target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };

    if (isReferralOpen || isUserMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isReferralOpen, isUserMenuOpen]);

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
          <nav className="hidden lg:flex items-center space-x-6 text-sm">
            <button
              onClick={() => isClient && scrollToSection("home")}
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium whitespace-nowrap"
              suppressHydrationWarning
            >
              Trang Chủ
            </button>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium whitespace-nowrap"
            >
              Bảng Giá
            </Link>
            <Link
              href="/downloads"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium whitespace-nowrap"
            >
              Downloads
            </Link>
            <Link
              href="/live-results"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium whitespace-nowrap"
            >
              Kết Quả Live
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium whitespace-nowrap"
            >
              Blog
            </Link>
            
            {/* Referral Dropdown */}
            <div 
              className="relative group referral-dropdown"
            >
              <button
                onClick={() => isClient && setIsReferralOpen(!isReferralOpen)}
                onMouseEnter={() => isClient && setIsReferralOpen(true)}
                className="flex items-center gap-1 text-gray-700 hover:text-primary-600 transition-colors font-medium whitespace-nowrap"
                suppressHydrationWarning
              >
                Affiliate
                <ChevronDown size={14} className={`transition-transform duration-200 ${isReferralOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isClient && isReferralOpen && (
                <>
                  {/* Invisible bridge to prevent gap */}
                  <div className="absolute top-full left-0 w-60 h-2" />
                  
                  <div 
                    className="absolute top-full left-0 mt-2 w-60 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-[100] animate-fadeIn"
                    onMouseLeave={() => isClient && setIsReferralOpen(false)}
                  >
                    <Link
                      href="/referral"
                      onClick={() => setIsReferralOpen(false)}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-primary-600 transition-colors"
                    >
                      <div className="font-semibold text-sm">📊 Tổng Quan</div>
                      <div className="text-xs text-gray-500 mt-0.5">Về chương trình affiliate</div>
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <Link
                      href="/referral/ban-ea"
                      onClick={() => setIsReferralOpen(false)}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-primary-600 transition-colors"
                    >
                      <div className="font-semibold text-sm">💰 Bán EA <span className="text-blue-600 font-bold">30%</span></div>
                      <div className="text-xs text-gray-500 mt-0.5">Hoa hồng cao nhất</div>
                    </Link>
                    <Link
                      href="/referral/copy-social"
                      onClick={() => setIsReferralOpen(false)}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-primary-600 transition-colors"
                    >
                      <div className="font-semibold text-sm">👥 Copy Social <span className="text-green-600 font-bold">10%</span></div>
                      <div className="text-xs text-gray-500 mt-0.5">Thu nhập thụ động</div>
                    </Link>
                    <Link
                      href="/referral/ban-khoa-hoc"
                      onClick={() => setIsReferralOpen(false)}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-primary-600 transition-colors"
                    >
                      <div className="font-semibold text-sm">🎓 Khóa Học <span className="text-orange-600 font-bold">25%</span></div>
                      <div className="text-xs text-gray-500 mt-0.5">Giá trị cao</div>
                    </Link>
                  </div>
                </>
              )}
            </div>
            
            <button
              onClick={() => isClient && scrollToSection("contact")}
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium whitespace-nowrap"
              suppressHydrationWarning
            >
              Liên Hệ
            </button>

            {/* User Menu / Login */}
            {isAuthenticated && user ? (
              <div className="relative user-menu">
                <button
                  onClick={() => isClient && setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                  suppressHydrationWarning
                >
                  <User size={16} />
                  <span className="font-medium">{user.username}</span>
                  <ChevronDown size={14} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isClient && isUserMenuOpen && (
                  <div 
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-[100] animate-fadeIn"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-200">
                      <div className="text-sm font-semibold text-gray-800">{user.username}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                      {user.role === 'admin' && (
                        <div className="mt-1">
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                            Admin
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                      >
                        <User size={16} />
                        <span className="text-sm">Admin Dashboard</span>
                      </Link>
                    )}
                    
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <User size={16} />
                      <span className="text-sm">Tài Khoản</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                        router.push('/');
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut size={16} />
                      <span className="text-sm">Đăng Xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors whitespace-nowrap"
              >
                <LogIn size={16} />
                <span>Đăng Nhập</span>
              </Link>
            )}
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
              
              {/* Mobile Referral Section */}
              <div className="border-t border-gray-200 pt-4">
                <div className="font-semibold text-gray-800 mb-2">Tiếp Thị Liên Kết</div>
                <div className="pl-4 space-y-3">
                  <Link
                    href="/referral"
                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tổng Quan
                  </Link>
                  <Link
                    href="/referral/ban-ea"
                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Bán EA <span className="text-blue-600 font-semibold">30%</span>
                  </Link>
                  <Link
                    href="/referral/copy-social"
                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Copy Social <span className="text-green-600 font-semibold">10%</span>
                  </Link>
                  <Link
                    href="/referral/ban-khoa-hoc"
                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Bán Khóa Học <span className="text-orange-600 font-semibold">25%</span>
                  </Link>
                </div>
              </div>
              
              <button
                onClick={() => scrollToSection("contact")}
                className="text-left text-gray-700 hover:text-primary-600 transition-colors font-medium"
                suppressHydrationWarning
              >
                Liên Hệ
              </button>

              {/* Mobile Login/User Menu */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    <div className="px-4 py-3 bg-primary-50 rounded-lg">
                      <div className="font-semibold text-gray-800">{user.username}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                      {user.role === 'admin' && (
                        <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                          Admin
                        </span>
                      )}
                    </div>
                    
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
                      >
                        <User size={18} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    
                    <Link
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                    >
                      <User size={18} />
                      <span>Tài Khoản</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                        router.push('/');
                      }}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-medium"
                    >
                      <LogOut size={18} />
                      <span>Đăng Xuất</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    <LogIn size={18} />
                    <span>Đăng Nhập</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 