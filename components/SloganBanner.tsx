"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

export default function SloganBanner() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="relative py-12 md:py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950">
      <div className="container-custom">
        <div className="text-center">
          {/* Slogan SVG */}
          <div className="relative h-20 md:h-24 lg:h-28 mb-8">
            <Image
              src="/Slogan_1920_300.svg"
              alt="EA Forex ThebenchmarkTrader Slogan"
              fill
              style={{ objectFit: "contain" }}
              className="drop-shadow-lg"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px"
              quality={95}
              priority={false}
            />
          </div>

          {/* Call to Action */}
          <div className="space-y-6">
            <p className="text-white text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              Bắt đầu hành trình giao dịch tự động với EA Forex chuyên nghiệp
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/downloads"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button 
                onClick={() => isClient && document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-all duration-300"
                suppressHydrationWarning
              >
                Tìm Hiểu Thêm
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-white/80 text-sm">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Miễn phí Demo
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Hỗ trợ 24/7
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Cài đặt dễ dàng
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
