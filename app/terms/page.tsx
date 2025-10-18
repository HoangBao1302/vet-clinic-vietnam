"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, XCircle, FileText, Shield, AlertTriangle } from "lucide-react";

export default function TermsOfService() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleAccept = () => {
    if (agreed) {
      router.push("/register");
    }
  };

  const handleDecline = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container-custom">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <FileText size={40} />
              Điều Khoản Sử Dụng
            </h1>
            <p className="text-blue-100 mt-2">
              Các điều khoản và điều kiện sử dụng dịch vụ EA ThebenchmarkTrader
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container-custom max-w-4xl">
            <div className="bg-white rounded-lg shadow-lg p-8">
              
              {/* Important Notice */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                <div className="flex items-start">
                  <AlertTriangle className="text-yellow-600 mt-1 mr-3" size={20} />
                  <div>
                    <h3 className="text-yellow-800 font-semibold">Thông Báo Quan Trọng</h3>
                    <p className="text-yellow-700 text-sm mt-1">
                      Việc sử dụng EA (Expert Advisor) và các công cụ giao dịch tự động có rủi ro cao. 
                      Vui lòng đọc kỹ các điều khoản trước khi đồng ý.
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms Content */}
              <div className="prose max-w-none">
                
                <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Định Nghĩa</h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    <strong>"EA"</strong> - Expert Advisor, phần mềm giao dịch tự động được thiết kế cho MetaTrader 4/5.
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>"Dịch vụ"</strong> - Bao gồm EA, indicators, signals, và các công cụ phân tích thị trường.
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>"Người dùng"</strong> - Cá nhân hoặc tổ chức sử dụng dịch vụ của chúng tôi.
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>"Thị trường tài chính"</strong> - Forex, Crypto, Stocks, Commodities và các thị trường khác.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Chấp Nhận Điều Khoản</h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản này. 
                    Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Rủi Ro Giao Dịch</h2>
                <div className="mb-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h3 className="text-red-800 font-semibold mb-2">⚠️ Cảnh Báo Rủi Ro Cao</h3>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• Giao dịch forex và crypto có rủi ro cao, có thể dẫn đến mất toàn bộ vốn đầu tư</li>
                      <li>• EA không đảm bảo lợi nhuận và có thể gây thua lỗ</li>
                      <li>• Quá khứ không đảm bảo kết quả tương lai</li>
                      <li>• Chỉ đầu tư số tiền bạn có thể chấp nhận mất</li>
                    </ul>
                  </div>
                  <p className="text-gray-700 mb-3">
                    Bạn hiểu và chấp nhận rằng giao dịch trên thị trường tài chính có rủi ro cao. 
                    Chúng tôi không chịu trách nhiệm cho bất kỳ tổn thất tài chính nào.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Quyền Sở Hữu Trí Tuệ</h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Tất cả EA, indicators, source code, và tài liệu thuộc sở hữu của ThebenchmarkTrader. 
                    Bạn được cấp quyền sử dụng cá nhân, không được phân phối, sao chép hoặc reverse engineer.
                  </p>
                  <p className="text-gray-700 mb-3">
                    Việc vi phạm bản quyền sẽ dẫn đến chấm dứt dịch vụ và có thể bị truy cứu pháp lý.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Sử Dụng Dịch Vụ</h2>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">5.1 Quyền Hạn</h3>
                  <ul className="text-gray-700 mb-4 space-y-1">
                    <li>• Sử dụng EA cho giao dịch cá nhân</li>
                    <li>• Nhận hỗ trợ kỹ thuật trong phạm vi dịch vụ</li>
                    <li>• Tham gia cộng đồng và nhận signals</li>
                    <li>• Cập nhật EA khi có phiên bản mới</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">5.2 Hạn Chế</h3>
                  <ul className="text-gray-700 mb-4 space-y-1">
                    <li>• Không được chia sẻ tài khoản với người khác</li>
                    <li>• Không được phân phối EA cho bên thứ ba</li>
                    <li>• Không được sử dụng cho mục đích thương mại không được phép</li>
                    <li>• Không được reverse engineer hoặc decompile</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Thanh Toán và Hoàn Tiền</h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Tất cả thanh toán được thực hiện trước khi cung cấp dịch vụ. 
                    Chúng tôi chấp nhận thanh toán qua Stripe, PayPal, và chuyển khoản ngân hàng.
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>Chính sách hoàn tiền:</strong> Hoàn tiền trong vòng 7 ngày nếu EA không hoạt động do lỗi kỹ thuật từ phía chúng tôi.
                  </p>
                  <p className="text-gray-700 mb-3">
                    Không hoàn tiền trong trường hợp thua lỗ do giao dịch hoặc lỗi từ phía người dùng.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Hỗ Trợ Kỹ Thuật</h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Chúng tôi cung cấp hỗ trợ kỹ thuật qua email, Telegram và Discord. 
                    Thời gian phản hồi: 24-48 giờ trong ngày làm việc.
                  </p>
                  <p className="text-gray-700 mb-3">
                    Hỗ trợ bao gồm: cài đặt EA, giải quyết lỗi kỹ thuật, hướng dẫn sử dụng.
                  </p>
                  <p className="text-gray-700 mb-3">
                    Không hỗ trợ: tư vấn đầu tư, phân tích thị trường cá nhân, đảm bảo lợi nhuận.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Chấm Dứt Dịch Vụ</h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Chúng tôi có quyền chấm dứt dịch vụ nếu bạn vi phạm điều khoản này.
                  </p>
                  <p className="text-gray-700 mb-3">
                    Bạn có thể chấm dứt dịch vụ bất kỳ lúc nào bằng cách liên hệ với chúng tôi.
                  </p>
                  <p className="text-gray-700 mb-3">
                    Sau khi chấm dứt, bạn không được sử dụng EA và phải xóa khỏi hệ thống.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Miễn Trừ Trách Nhiệm</h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Dịch vụ được cung cấp "như hiện tại" mà không có bảo đảm nào.
                  </p>
                  <p className="text-gray-700 mb-3">
                    Chúng tôi không chịu trách nhiệm cho bất kỳ tổn thất tài chính nào do sử dụng EA.
                  </p>
                  <p className="text-gray-700 mb-3">
                    Người dùng tự chịu trách nhiệm cho tất cả quyết định giao dịch.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Luật Áp Dụng</h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Điều khoản này được điều chỉnh bởi luật Việt Nam.
                  </p>
                  <p className="text-gray-700 mb-3">
                    Mọi tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Liên Hệ</h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    <strong>Email:</strong> support@thebenchmarktrader.com
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>Hotline:</strong> +84 765 452 515
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>Telegram:</strong> @thebenchmarktrader
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
                  <p className="text-blue-800 text-sm">
                    <strong>Cập nhật lần cuối:</strong> {new Date().toLocaleDateString('vi-VN')}
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    Chúng tôi có quyền cập nhật điều khoản này bất kỳ lúc nào. 
                    Việc tiếp tục sử dụng dịch vụ sau khi cập nhật được coi là chấp nhận điều khoản mới.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleDecline}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    <XCircle size={20} />
                    Từ Chối
                  </button>
                  
                  <button
                    onClick={handleAccept}
                    disabled={!agreed}
                    className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg transition-colors font-semibold ${
                      agreed 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle size={20} />
                    Đồng Ý và Tiếp Tục
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <label className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    Tôi đã đọc và đồng ý với các điều khoản sử dụng
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
