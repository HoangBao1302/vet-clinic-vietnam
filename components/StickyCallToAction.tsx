"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function StickyCallToAction() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary-600 text-white p-4 shadow-lg z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium text-center md:text-left">
              Sẵn sàng bắt đầu giao dịch tự động?
            </p>
          </div>
          <Link
            href="/pricing#full"
            className="flex items-center space-x-2 bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            <ShoppingCart size={18} />
            <span>Mua EA ngay</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 