"use client";

import Image from "next/image";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function Strategy() {
  return (
    <section id="strategy" className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="relative">
            <Image
              src="/vet-images/2.png"
              alt="Trading strategy analysis"
              width={600}
              height={400}
              className="rounded-xl shadow-lg"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
          </div>

          {/* Right Column - Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Triết lý giao dịch minh bạch
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              EA LeopardSmart được xây dựng trên nguyên tắc minh bạch tuyệt đối. 
              Mọi điều kiện vào lệnh, ra lệnh và quản trị rủi ro đều được công khai, 
              không có "hộp đen" bí ẩn.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-3">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Điều kiện vào lệnh rõ ràng</h3>
                  <p className="text-gray-600">Sử dụng các chỉ báo kỹ thuật phổ biến như MA, RSI, Bollinger Bands với tham số được tối ưu qua backtest.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Quản trị vốn khoa học</h3>
                  <p className="text-gray-600">Risk per trade cố định 1-2%, position sizing theo volatility, stop loss luôn được đặt trước khi vào lệnh.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Stop khẩn cấp tự động</h3>
                  <p className="text-gray-600">Hệ thống tự động dừng giao dịch khi drawdown vượt ngưỡng cho phép hoặc phát hiện bất thường.</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-yellow-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1">Lưu ý quan trọng</h3>
                  <p className="text-yellow-700 text-sm">
                    Giao dịch Forex có rủi ro cao. Kết quả trong quá khứ không đảm bảo kết quả tương lai. 
                    Hãy chỉ đầu tư số tiền bạn có thể chấp nhận mất.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

