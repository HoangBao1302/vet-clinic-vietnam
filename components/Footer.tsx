"use client";

import { useState, useEffect } from "react";
import { Facebook, Instagram, Twitter, Phone, Mail, MessageCircle, Youtube } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Footer() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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
              EA Forex ThebenchmarkTrader
            </div>
            <p className="text-gray-300 mb-6">
              Expert Advisor đa chiến lược với quản trị rủi ro khoa học. 
              Tự động hóa giao dịch Forex hiệu quả và minh bạch.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/YOUR_PAGE_NAME" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors" 
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com/YOUR_INSTAGRAM_NAME" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors" 
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://twitter.com/YOUR_TWITTER_NAME" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors" 
                aria-label="Twitter"
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
                href="https://t.me/ThebenchmarkTraderSupport" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors" 
                aria-label="Telegram"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => isClient && scrollToSection("home")}
                  className="text-gray-300 hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  Trang Chủ
                </button>
              </li>
              <li>
                <button
                  onClick={() => isClient && scrollToSection("features")}
                  className="text-gray-300 hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  Tính Năng
                </button>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                  Bảng Giá
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="text-gray-300 hover:text-white transition-colors">
                  Downloads
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  Về EA
                </Link>
              </li>
              <li>
                <Link href="/live-results" className="text-gray-300 hover:text-white transition-colors">
                  Kết Quả Thực Tế
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-gray-300 hover:text-white transition-colors">
                  Đối Tác
                </Link>
              </li>
              <li>
                <button
                  onClick={() => isClient && scrollToSection("contact")}
                  className="text-gray-300 hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  Liên Hệ
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Tài Nguyên</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a 
                  href="https://www.youtube.com/@ThebenchmarkTraderEA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  <Youtube size={16} />
                  <span>Kênh YouTube</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.youtube.com/@ThebenchmarkTraderEA/playlists" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Video Backtest
                </a>
              </li>
              <li>
                <a 
                  href="https://www.youtube.com/@ThebenchmarkTraderEA/playlists" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Hướng dẫn cài đặt
                </a>
              </li>
              <li>Demo miễn phí</li>
              <li>Tài liệu hướng dẫn</li>
              <li>FAQ & Support</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Thông Tin Liên Hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300">+84 901 234 567</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300">support@thebenchmarktrader.com</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300">@ThebenchmarkTraderSupport</span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-sm">
                  Giờ hỗ trợ: T2-T6 (9:00-18:00)
                </p>
                <p className="text-gray-400 text-sm">
                  Telegram 24/7 cho khẩn cấp
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} EA Forex ThebenchmarkTrader. Bảo lưu mọi quyền.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Chính Sách Bảo Mật
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Điều Khoản Dịch Vụ
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Cảnh Báo Rủi Ro
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 