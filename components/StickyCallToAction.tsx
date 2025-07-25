"use client";

import { useState, useEffect } from "react";
import { Phone } from "lucide-react";

export default function StickyCallToAction() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCall = () => {
    if (typeof window !== "undefined") {
      window.location.href = "tel:+84765452515";
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary-600 text-white p-4 shadow-lg z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium text-center md:text-left">
              Gọi để đặt lịch hẹn
            </p>
          </div>
          <button
            onClick={() => isClient && handleCall()}
            className="flex items-center space-x-2 bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            suppressHydrationWarning
          >
            <Phone size={18} />
            <span>+84765452515</span>
          </button>
        </div>
      </div>
    </div>
  );
} 