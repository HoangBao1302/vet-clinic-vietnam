"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, XCircle, Users, DollarSign, TrendingUp, AlertTriangle, Shield } from "lucide-react";

export default function AffiliateTerms() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleAccept = () => {
    if (agreed) {
      router.push("/referral/apply");
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
        <section className="py-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="container-custom">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Users size={40} />
              Điều Khoản Chương Trình Affiliate
            </h1>
            <p className="text-purple-100 mt-2">
              Các điều khoản và điều kiện tham gia chương trình affiliate của ThebenchmarkTrader
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
                      Chương trình affiliate có các quy định nghiêm ngặt về marketing và tuân thủ pháp luật. 
                      Vui lòng đọc kỹ trước khi tham gia.
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms Content */}
              <div className="prose max-w-none">
                
                <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Định Nghĩa</h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    <strong>"Affiliate"</strong> - Người tham gia chương trình affiliate của chúng tôi.
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>"Commission"</strong> - Phần trăm hoa hồng được trả cho affiliate khi có conversion.
                  </p>
                    <p className="text-gray-700 mb-3">
                    <strong>"Conversion"</strong> - Khách hàng hoàn thành mua hàng thông qua link affiliate.
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>"Tracking Link"</strong> - Link chứa mã affiliate để theo dõi conversion.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Điều Kiện Tham Gia</h2>
                <div className="mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Yêu Cầu Cơ Bản</h3>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Từ 18 tuổi trở lên</li>
                      <li>• Có tài khoản ngân hàng hoặc PayPal hợp lệ</li>
                      <li>• Hiểu biết cơ bản về forex và trading</li>
                      <li>• Có kinh nghiệm marketing hoặc bán hàng</li>
                      <li>• Tuân thủ pháp luật Việt Nam</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Ưu Tiên</h3>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Có audience trong lĩnh vực forex/trading</li>
                      <li>• Kinh nghiệm với EA và indicators</li>
                      <li>• Có website/blog hoặc social media có tương tác</li>
                      <li>• Đã từng tham gia chương trình affiliate khác</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Tỷ Lệ Hoa Hồng</h2>
                <div className="mb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <DollarSign className="text-green-600" size={20} />
                        Thành Viên Trả Phí
                      </h3>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• EA Full Version: <span className="font-bold text-green-600">35%</span></li>
                        <li>• EA Pro + Source: <span className="font-bold text-green-600">35%</span></li>
                        <li>• Indicators Pack: <span className="font-bold text-green-600">35%</span></li>
                        <li>• Khóa học: <span className="font-bold text-green-600">25%</span></li>
                        <li>• Copy Social: <span className="font-bold text-green-600">10%</span> (recurring)</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Users className="text-blue-600" size={20} />
                        Thành Viên Miễn Phí
                      </h3>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• EA Full Version: <span className="font-bold text-blue-600">30%</span></li>
                        <li>• EA Pro + Source: <span className="font-bold text-blue-600">30%</span></li>
                        <li>• Indicators Pack: <span className="font-bold text-blue-600">30%</span></li>
                        <li>• Khóa học: <span className="font-bold text-blue-600">25%</span></li>
                        <li>• Copy Social: <span className="font-bold text-blue-600">10%</span> (recurring)</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Lưu ý:</strong> Tỷ lệ hoa hồng có thể thay đổi theo từng thời kỳ. 
                      Thay đổi sẽ được thông báo trước 30 ngày.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Quy Trình Thanh Toán</h2>
                <div className="mb-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Tracking Conversion</h3>
                        <p className="text-gray-600 text-sm">Hệ thống tự động track conversion qua link affiliate</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Tính Toán Commission</h3>
                        <p className="text-gray-600 text-sm">Commission được tính tự động theo tỷ lệ đã thỏa thuận</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Thanh Toán</h3>
                        <p className="text-gray-600 text-sm">Thanh toán vào cuối mỗi tháng, tối thiểu 500,000đ</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Phương Thức Thanh Toán</h3>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Chuyển khoản ngân hàng Việt Nam</li>
                      <li>• PayPal (cho affiliate quốc tế)</li>
                      <li>• USDT (cho affiliate crypto)</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Quy Định Marketing</h2>
                <div className="mb-6">
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold text-green-800 mb-2">✅ Được Phép</h3>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Chia sẻ link affiliate trên social media</li>
                      <li>• Viết review và đánh giá sản phẩm</li>
                      <li>• Tạo content về forex và trading</li>
                      <li>• Sử dụng hình ảnh và video từ chúng tôi</li>
                      <li>• Tham gia các group và community</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-800 mb-2">❌ Không Được Phép</h3>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• Spam hoặc gửi email không được yêu cầu</li>
                      <li>• Đăng ký fake account để tự mua</li>
                      <li>• Sử dụng từ khóa thương hiệu trong quảng cáo</li>
                      <li>• Tạo website giả mạo chúng tôi</li>
                      <li>• Sử dụng bot hoặc tool tự động</li>
                      <li>• Vi phạm quy định của các platform</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Tuân Thủ Pháp Luật</h2>
                <div className="mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-blue-800 font-semibold mb-2">📋 Yêu Cầu Tuân Thủ</h3>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Tuân thủ Luật Quảng cáo Việt Nam</li>
                      <li>• Không vi phạm quyền sở hữu trí tuệ</li>
                      <li>• Không lừa đảo hoặc gian lận</li>
                      <li>• Bảo vệ thông tin khách hàng</li>
                      <li>• Không sử dụng thông tin sai sự thật</li>
                      <li>• Tuân thủ quy định của từng platform</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Hỗ Trợ Affiliate</h2>
                <div className="mb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">Marketing Materials</h3>
                      <ul className="text-purple-700 text-sm space-y-1">
                        <li>• Banner và hình ảnh quảng cáo</li>
                        <li>• Video demo sản phẩm</li>
                        <li>• Template email marketing</li>
                        <li>• Content và bài viết</li>
                        <li>• Case study và testimonials</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Hỗ Trợ Kỹ Thuật</h3>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• Hướng dẫn sử dụng dashboard</li>
                        <li>• Giải đáp thắc mắc về sản phẩm</li>
                        <li>• Training về marketing</li>
                        <li>• Hỗ trợ tạo content</li>
                        <li>• Tư vấn chiến lược</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Chấm Dứt Hợp Đồng</h2>
                <div className="mb-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h3 className="text-red-800 font-semibold mb-2">Lý Do Chấm Dứt</h3>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• Vi phạm điều khoản affiliate</li>
                      <li>• Spam hoặc hành vi không phù hợp</li>
                      <li>• Tạo fake conversion</li>
                      <li>• Vi phạm pháp luật</li>
                      <li>• Không hoạt động trong 6 tháng</li>
                    </ul>
                  </div>
                  
                  <p className="text-gray-700 mb-3">
                    Khi chấm dứt hợp đồng, affiliate sẽ không được thanh toán commission chưa chi trả 
                    và phải ngừng sử dụng tất cả marketing materials.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Giới Hạn Trách Nhiệm</h2>
                <div className="mb-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-yellow-800 font-semibold mb-2">⚠️ Cảnh Báo</h3>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Chúng tôi không đảm bảo doanh thu cho affiliate</li>
                      <li>• Commission có thể thay đổi theo thời gian</li>
                      <li>• Không chịu trách nhiệm cho tổn thất của affiliate</li>
                      <li>• Có quyền từ chối thanh toán nếu có gian lận</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Liên Hệ</h2>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Để tham gia chương trình affiliate hoặc có thắc mắc:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-2">
                      <strong>Email:</strong> affiliate@thebenchmarktrader.com
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

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-8">
                  <p className="text-purple-800 text-sm">
                    <strong>Cập nhật lần cuối:</strong> {new Date().toLocaleDateString('vi-VN')}
                  </p>
                  <p className="text-purple-700 text-sm mt-1">
                    Chúng tôi có quyền cập nhật điều khoản này bất kỳ lúc nào. 
                    Việc tiếp tục tham gia chương trình sau khi cập nhật được coi là chấp nhận điều khoản mới.
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
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle size={20} />
                    Đồng Ý và Đăng Ký Affiliate
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <label className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    Tôi đã đọc và đồng ý với điều khoản chương trình affiliate
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
