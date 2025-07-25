"use client";

import { useState, useEffect } from "react";
import { Facebook, Instagram, Twitter, Phone, MapPin, Mail } from "lucide-react";

export default function Footer() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (typeof window !== "undefined") {
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
              Phòng Khám Thú Y PawCare
            </div>
            <p className="text-gray-300 mb-6">
              Cung cấp dịch vụ thú y tận tâm cho những người bạn thân yêu của bạn tại TP. Hồ Chí Minh. 
              Điều trị chuyên nghiệp, cơ sở vật chất hiện đại và đội ngũ nhân viên chu đáo.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
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
                  onClick={() => isClient && scrollToSection("services")}
                  className="text-gray-300 hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  Dịch Vụ
                </button>
              </li>
              <li>
                <button
                  onClick={() => isClient && scrollToSection("about")}
                  className="text-gray-300 hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  Về Chúng Tôi
                </button>
              </li>
              <li>
                <button
                  onClick={() => isClient && scrollToSection("testimonials")}
                  className="text-gray-300 hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  Đánh Giá
                </button>
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

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Dịch Vụ Của Chúng Tôi</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Khám Tổng Quát</li>
              <li>Tiêm Phòng</li>
              <li>Cấp Cứu</li>
              <li>Phẫu Thuật</li>
              <li>Chăm Sóc Răng Miệng</li>
              <li>Chăm Sóc & Làm Đẹp</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Thông Tin Liên Hệ</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-300 mt-0.5" />
                <div className="text-gray-300">
                  <p>74 Lê Trọng Tấn</p>
                  <p>Phường Tây Thạnh</p>
                  <p>TP. Hồ Chí Minh</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300">+84765452515</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300">info@pawcareclinic.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} Phòng Khám Thú Y PawCare. Bảo lưu mọi quyền.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Chính Sách Bảo Mật
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Điều Khoản Dịch Vụ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 