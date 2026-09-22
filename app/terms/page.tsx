"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, XCircle, FileText, AlertTriangle } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function TermsOfService() {
  const router = useRouter();
  const { locale } = useLocale();
  const isEn = locale === "en";
  const [agreed, setAgreed] = useState(false);

  const handleAccept = () => {
    if (agreed) router.push("/register");
  };

  const handleDecline = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        <section className="py-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container-custom">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <FileText size={40} />
              {isEn ? "Terms of Service" : "Điều Khoản Sử Dụng"}
            </h1>
            <p className="text-blue-100 mt-2">
              {isEn
                ? "Terms and conditions for using Thebenchmarktrader LLC products and services"
                : "Các điều khoản và điều kiện sử dụng dịch vụ EA ThebenchmarkTrader"}
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container-custom max-w-4xl">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                <div className="flex items-start">
                  <AlertTriangle className="text-yellow-600 mt-1 mr-3" size={20} />
                  <div>
                    <h3 className="text-yellow-800 font-semibold">
                      {isEn ? "Important Notice" : "Thông Báo Quan Trọng"}
                    </h3>
                    <p className="text-yellow-700 text-sm mt-1">
                      {isEn
                        ? "Using an Expert Advisor and other automated trading tools involves high risk. Please read these terms carefully before agreeing."
                        : "Việc sử dụng EA (Expert Advisor) và các công cụ giao dịch tự động có rủi ro cao. Vui lòng đọc kỹ các điều khoản trước khi đồng ý."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {isEn ? "1. Definitions" : "1. Định Nghĩa"}
                </h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    <strong>&quot;EA&quot;</strong>{" "}
                    {isEn
                      ? "- Expert Advisor, automated trading software designed for MetaTrader 4/5."
                      : "- Expert Advisor, phần mềm giao dịch tự động được thiết kế cho MetaTrader 4/5."}
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>{isEn ? '"Services"' : '"Dịch vụ"'}</strong>{" "}
                    {isEn
                      ? "- Includes EA, indicators, signals, and market analysis tools."
                      : "- Bao gồm EA, indicators, signals, và các công cụ phân tích thị trường."}
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>{isEn ? '"User"' : '"Người dùng"'}</strong>{" "}
                    {isEn
                      ? "- Any person or organization using our services."
                      : "- Cá nhân hoặc tổ chức sử dụng dịch vụ của chúng tôi."}
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>{isEn ? '"Company"' : '"Công ty"'}</strong>{" "}
                    - Thebenchmarktrader LLC, 177 S Lexington St Ste 100, Harrisonville, MO 64701.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {isEn ? "2. Acceptance of Terms" : "2. Chấp Nhận Điều Khoản"}
                </h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    {isEn
                      ? "By using our services, you agree to be bound by these terms. If you do not agree, please do not use the services."
                      : "Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ."}
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {isEn ? "3. Trading Risk" : "3. Rủi Ro Giao Dịch"}
                </h2>
                <div className="mb-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h3 className="text-red-800 font-semibold mb-2">
                      {isEn ? "High-Risk Warning" : "Cảnh Báo Rủi Ro Cao"}
                    </h3>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• {isEn ? "Forex and crypto trading is high risk and can result in total loss of capital." : "Giao dịch forex và crypto có rủi ro cao, có thể dẫn đến mất toàn bộ vốn đầu tư"}</li>
                      <li>• {isEn ? "The EA does not guarantee profit and may cause losses." : "EA không đảm bảo lợi nhuận và có thể gây thua lỗ"}</li>
                      <li>• {isEn ? "Past performance does not guarantee future results." : "Quá khứ không đảm bảo kết quả tương lai"}</li>
                      <li>• {isEn ? "Only invest money you can afford to lose." : "Chỉ đầu tư số tiền bạn có thể chấp nhận mất"}</li>
                    </ul>
                  </div>
                  <p className="text-gray-700 mb-3">
                    {isEn
                      ? "You understand and accept that trading financial markets is high risk. We are not responsible for any financial loss."
                      : "Bạn hiểu và chấp nhận rằng giao dịch trên thị trường tài chính có rủi ro cao. Chúng tôi không chịu trách nhiệm cho bất kỳ tổn thất tài chính nào."}
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {isEn ? "4. Intellectual Property" : "4. Quyền Sở Hữu Trí Tuệ"}
                </h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    {isEn
                      ? "All EAs, indicators, source code, and materials are owned by Thebenchmarktrader LLC. You receive a personal-use license and may not distribute, copy, or reverse engineer the software."
                      : "Tất cả EA, indicators, source code, và tài liệu thuộc sở hữu của Thebenchmarktrader LLC. Bạn được cấp quyền sử dụng cá nhân, không được phân phối, sao chép hoặc reverse engineer."}
                  </p>
                  <p className="text-gray-700 mb-3">
                    {isEn
                      ? "Copyright violations may result in service termination and legal action."
                      : "Việc vi phạm bản quyền sẽ dẫn đến chấm dứt dịch vụ và có thể bị truy cứu pháp lý."}
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {isEn ? "5. Use of Services" : "5. Sử Dụng Dịch Vụ"}
                </h2>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {isEn ? "5.1 Permissions" : "5.1 Quyền Hạn"}
                  </h3>
                  <ul className="text-gray-700 mb-4 space-y-1">
                    <li>• {isEn ? "Use the EA for personal trading" : "Sử dụng EA cho giao dịch cá nhân"}</li>
                    <li>• {isEn ? "Receive technical support within the service scope" : "Nhận hỗ trợ kỹ thuật trong phạm vi dịch vụ"}</li>
                    <li>• {isEn ? "Join the community and receive signals" : "Tham gia cộng đồng và nhận signals"}</li>
                    <li>• {isEn ? "Receive EA updates when available" : "Cập nhật EA khi có phiên bản mới"}</li>
                  </ul>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {isEn ? "5.2 Restrictions" : "5.2 Hạn Chế"}
                  </h3>
                  <ul className="text-gray-700 mb-4 space-y-1">
                    <li>• {isEn ? "Do not share your account with others" : "Không được chia sẻ tài khoản với người khác"}</li>
                    <li>• {isEn ? "Do not distribute the EA to third parties" : "Không được phân phối EA cho bên thứ ba"}</li>
                    <li>• {isEn ? "Do not use it for unauthorized commercial purposes" : "Không được sử dụng cho mục đích thương mại không được phép"}</li>
                    <li>• {isEn ? "Do not reverse engineer or decompile" : "Không được reverse engineer hoặc decompile"}</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {isEn ? "6. Payment and Refunds" : "6. Thanh Toán và Hoàn Tiền"}
                </h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    {isEn
                      ? "All payments are made before services are delivered. We accept Stripe, PayPal, and bank transfer."
                      : "Tất cả thanh toán được thực hiện trước khi cung cấp dịch vụ. Chúng tôi chấp nhận thanh toán qua Stripe, PayPal, và chuyển khoản ngân hàng."}
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>{isEn ? "Refund policy:" : "Chính sách hoàn tiền:"}</strong>{" "}
                    {isEn
                      ? "Refunds within 7 days if the EA does not work due to a technical fault on our side."
                      : "Hoàn tiền trong vòng 7 ngày nếu EA không hoạt động do lỗi kỹ thuật từ phía chúng tôi."}
                  </p>
                  <p className="text-gray-700 mb-3">
                    {isEn
                      ? "No refunds for trading losses or user-side errors."
                      : "Không hoàn tiền trong trường hợp thua lỗ do giao dịch hoặc lỗi từ phía người dùng."}
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {isEn ? "7. Technical Support" : "7. Hỗ Trợ Kỹ Thuật"}
                </h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    {isEn
                      ? "We provide support by email, Telegram, and Discord. Response time: 24-48 hours on business days."
                      : "Chúng tôi cung cấp hỗ trợ kỹ thuật qua email, Telegram và Discord. Thời gian phản hồi: 24-48 giờ trong ngày làm việc."}
                  </p>
                  <p className="text-gray-700 mb-3">
                    {isEn
                      ? "Support includes EA installation, technical issues, and usage guidance."
                      : "Hỗ trợ bao gồm: cài đặt EA, giải quyết lỗi kỹ thuật, hướng dẫn sử dụng."}
                  </p>
                  <p className="text-gray-700 mb-3">
                    {isEn
                      ? "We do not provide investment advice, personal market analysis, or profit guarantees."
                      : "Không hỗ trợ: tư vấn đầu tư, phân tích thị trường cá nhân, đảm bảo lợi nhuận."}
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {isEn ? "8. Termination" : "8. Chấm Dứt Dịch Vụ"}
                </h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    {isEn
                      ? "We may terminate service if you violate these terms."
                      : "Chúng tôi có quyền chấm dứt dịch vụ nếu bạn vi phạm điều khoản này."}
                  </p>
                  <p className="text-gray-700 mb-3">
                    {isEn
                      ? "You may end the service at any time by contacting us."
                      : "Bạn có thể chấm dứt dịch vụ bất kỳ lúc nào bằng cách liên hệ với chúng tôi."}
                  </p>
                  <p className="text-gray-700 mb-3">
                    {isEn
                      ? "After termination, you must stop using the EA and remove it from your systems."
                      : "Sau khi chấm dứt, bạn không được sử dụng EA và phải xóa khỏi hệ thống."}
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {isEn ? "9. Disclaimer" : "9. Miễn Trừ Trách Nhiệm"}
                </h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    {isEn
                      ? 'The services are provided "as is" without warranties of any kind.'
                      : 'Dịch vụ được cung cấp "như hiện tại" mà không có bảo đảm nào.'}
                  </p>
                  <p className="text-gray-700 mb-3">
                    {isEn
                      ? "We are not liable for any financial loss from using the EA."
                      : "Chúng tôi không chịu trách nhiệm cho bất kỳ tổn thất tài chính nào do sử dụng EA."}
                  </p>
                  <p className="text-gray-700 mb-3">
                    {isEn
                      ? "Users are solely responsible for all trading decisions."
                      : "Người dùng tự chịu trách nhiệm cho tất cả quyết định giao dịch."}
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {isEn ? "10. Governing Law" : "10. Luật Áp Dụng"}
                </h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    {isEn
                      ? "These terms are governed by the laws of the State of Missouri, United States, without regard to conflict-of-law rules."
                      : "Điều khoản này được điều chỉnh bởi luật tiểu bang Missouri, Hoa Kỳ."}
                  </p>
                  <p className="text-gray-700 mb-3">
                    {isEn
                      ? "Disputes will be resolved in courts of competent jurisdiction in Missouri, USA."
                      : "Mọi tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền tại Missouri, Hoa Kỳ."}
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {isEn ? "11. Contact" : "11. Liên Hệ"}
                </h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3"><strong>{isEn ? "Company:" : "Công ty:"}</strong> Thebenchmarktrader LLC</p>
                  <p className="text-gray-700 mb-3"><strong>{isEn ? "Address:" : "Địa chỉ:"}</strong> 177 S Lexington St Ste 100, Harrisonville, MO 64701</p>
                  <p className="text-gray-700 mb-3"><strong>Email:</strong> support@thebenchmarktrader.com</p>
                  <p className="text-gray-700 mb-3"><strong>Hotline:</strong> +1925 582 0779</p>
                  <p className="text-gray-700 mb-3"><strong>Telegram:</strong> @thebenchmarktrader</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
                  <p className="text-blue-800 text-sm">
                    <strong>{isEn ? "Last updated:" : "Cập nhật lần cuối:"}</strong>{" "}
                    {new Date().toLocaleDateString(isEn ? "en-US" : "vi-VN")}
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    {isEn
                      ? "Thebenchmarktrader LLC may update these terms at any time. Continued use after an update means you accept the new terms."
                      : "Chúng tôi có quyền cập nhật điều khoản này bất kỳ lúc nào. Việc tiếp tục sử dụng dịch vụ sau khi cập nhật được coi là chấp nhận điều khoản mới."}
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleDecline}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    <XCircle size={20} />
                    {isEn ? "Decline" : "Từ Chối"}
                  </button>
                  <button
                    onClick={handleAccept}
                    disabled={!agreed}
                    className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg transition-colors font-semibold ${
                      agreed
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <CheckCircle size={20} />
                    {isEn ? "Agree and Continue" : "Đồng Ý và Tiếp Tục"}
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
                    {isEn
                      ? "I have read and agree to these terms of service"
                      : "Tôi đã đọc và đồng ý với các điều khoản sử dụng"}
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
