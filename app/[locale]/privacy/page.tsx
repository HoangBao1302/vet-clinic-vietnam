"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, XCircle, Shield, Lock, Eye, Database, Server } from "lucide-react";

export default function PrivacyPolicy() {
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
        <section className="py-8 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container-custom">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Shield size={40} />
              Chính Sách Bảo Mật
            </h1>
            <p className="text-green-100 mt-2">
              Cam kết bảo vệ thông tin cá nhân và dữ liệu của bạn
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container-custom max-w-4xl">
            <div className="bg-white rounded-lg shadow-lg p-8">
              
              {/* Security Notice */}
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
                <div className="flex items-start">
                  <Lock className="text-green-600 mt-1 mr-3" size={20} />
                  <div>
                    <h3 className="text-green-800 font-semibold">Bảo Mật Tuyệt Đối</h3>
                    <p className="text-green-700 text-sm mt-1">
                      Chúng tôi sử dụng mã hóa SSL 256-bit và các công nghệ bảo mật tiên tiến nhất 
                      để bảo vệ thông tin của bạn.
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy Content */}
              <div className="prose max-w-none">
                
                <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Thông Tin Chúng Tôi Thu Thập</h2>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">1.1 Thông Tin Cá Nhân</h3>
                  <ul className="text-gray-700 mb-4 space-y-1">
                    <li>• Họ tên và địa chỉ email</li>
                    <li>• Số điện thoại liên lạc</li>
                    <li>• Thông tin thanh toán (được mã hóa)</li>
                    <li>• Địa chỉ IP và thông tin trình duyệt</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">1.2 Thông Tin Giao Dịch</h3>
                  <ul className="text-gray-700 mb-4 space-y-1">
                    <li>• Lịch sử mua hàng và thanh toán</li>
                    <li>• Thông tin sử dụng EA và indicators</li>
                    <li>• Dữ liệu hiệu suất giao dịch (nếu bạn chia sẻ)</li>
                    <li>• Logs truy cập và hoạt động trên website</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Mục Đích Sử Dụng Thông Tin</h2>
                <div className="mb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Dịch Vụ Chính</h3>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Cung cấp EA và indicators</li>
                        <li>• Hỗ trợ kỹ thuật</li>
                        <li>• Xử lý thanh toán</li>
                        <li>• Gửi thông báo quan trọng</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Cải Thiện Dịch Vụ</h3>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• Phân tích hiệu suất</li>
                        <li>• Phát triển tính năng mới</li>
                        <li>• Tối ưu hóa EA</li>
                        <li>• Nghiên cứu thị trường</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Bảo Mật Dữ Liệu</h2>
                <div className="mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Database size={20} />
                      Công Nghệ Bảo Mật
                    </h3>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Mã hóa SSL/TLS 256-bit cho tất cả kết nối</li>
                      <li>• Mã hóa AES-256 cho dữ liệu lưu trữ</li>
                      <li>• Hash mật khẩu với bcrypt và salt</li>
                      <li>• Token JWT với thời gian hết hạn ngắn</li>
                      <li>• Firewall và DDoS protection</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Server size={20} />
                      Bảo Mật Hạ Tầng
                    </h3>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Server đặt tại các trung tâm dữ liệu uy tín</li>
                      <li>• Backup tự động hàng ngày</li>
                      <li>• Monitoring 24/7</li>
                      <li>• Access control nghiêm ngặt</li>
                      <li>• Audit logs đầy đủ</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Chia Sẻ Thông Tin</h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    <strong>Chúng tôi KHÔNG bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba</strong> 
                    trừ các trường hợp sau:
                  </p>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h3 className="text-yellow-800 font-semibold mb-2">Trường Hợp Ngoại Lệ</h3>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Có yêu cầu từ cơ quan pháp luật</li>
                      <li>• Để bảo vệ quyền lợi hợp pháp của chúng tôi</li>
                      <li>• Với nhà cung cấp dịch vụ thanh toán (Stripe, PayPal)</li>
                      <li>• Khi bạn đồng ý rõ ràng</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Cookie và Tracking</h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Chúng tôi sử dụng cookie để cải thiện trải nghiệm người dùng và phân tích website:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Cookie Cần Thiết</h3>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Duy trì đăng nhập</li>
                        <li>• Lưu cài đặt cá nhân</li>
                        <li>• Bảo mật phiên làm việc</li>
                        <li>• Chức năng cơ bản</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Cookie Phân Tích</h3>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• Google Analytics</li>
                        <li>• Thống kê truy cập</li>
                        <li>• Hiệu suất website</li>
                        <li>• Tối ưu hóa UX</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Quyền Của Bạn</h2>
                <div className="mb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Eye className="text-blue-600 mt-1" size={16} />
                        <div>
                          <h3 className="font-semibold text-gray-800">Quyền Truy Cập</h3>
                          <p className="text-gray-600 text-sm">Xem thông tin cá nhân của bạn</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="text-green-600 mt-1" size={16} />
                        <div>
                          <h3 className="font-semibold text-gray-800">Quyền Chỉnh Sửa</h3>
                          <p className="text-gray-600 text-sm">Cập nhật thông tin không chính xác</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <XCircle className="text-red-600 mt-1" size={16} />
                        <div>
                          <h3 className="font-semibold text-gray-800">Quyền Xóa</h3>
                          <p className="text-gray-600 text-sm">Yêu cầu xóa tài khoản và dữ liệu</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Shield className="text-purple-600 mt-1" size={16} />
                        <div>
                          <h3 className="font-semibold text-gray-800">Quyền Bảo Mật</h3>
                          <p className="text-gray-600 text-sm">Bảo vệ dữ liệu cá nhân</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Lưu Trữ Dữ Liệu</h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Chúng tôi lưu trữ dữ liệu của bạn trong thời gian cần thiết:
                  </p>
                  <ul className="text-gray-700 mb-4 space-y-1">
                    <li>• <strong>Thông tin tài khoản:</strong> Cho đến khi bạn xóa tài khoản</li>
                    <li>• <strong>Dữ liệu giao dịch:</strong> 7 năm (theo quy định pháp luật)</li>
                    <li>• <strong>Logs hệ thống:</strong> 1 năm</li>
                    <li>• <strong>Dữ liệu phân tích:</strong> 2 năm</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Bảo Vệ Trẻ Em</h2>
                <div className="mb-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-red-800 font-semibold mb-2">⚠️ Cảnh Báo</h3>
                    <p className="text-red-700 text-sm">
                      Dịch vụ của chúng tôi dành cho người từ 18 tuổi trở lên. 
                      Chúng tôi không thu thập thông tin từ trẻ em dưới 18 tuổi.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Cập Nhật Chính Sách</h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Chúng tôi có thể cập nhật chính sách bảo mật này. 
                    Thay đổi quan trọng sẽ được thông báo qua email hoặc trên website.
                  </p>
                  <p className="text-gray-700 mb-3">
                    Việc tiếp tục sử dụng dịch vụ sau khi cập nhật được coi là chấp nhận chính sách mới.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Liên Hệ</h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Nếu bạn có câu hỏi về chính sách bảo mật hoặc muốn thực hiện quyền của mình:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-2">
                      <strong>Email:</strong> privacy@thebenchmarktrader.com
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Hotline:</strong> +84 765 452 515
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Telegram:</strong> @thebenchmarktrader
                    </p>
                    <p className="text-gray-700">
                      <strong>Thời gian phản hồi:</strong> 24-48 giờ
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-8">
                  <p className="text-green-800 text-sm">
                    <strong>Cập nhật lần cuối:</strong> {new Date().toLocaleDateString('vi-VN')}
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    Chúng tôi cam kết bảo vệ quyền riêng tư của bạn và tuân thủ các quy định pháp luật về bảo vệ dữ liệu cá nhân.
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
                    Tôi đã đọc và đồng ý với chính sách bảo mật
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
