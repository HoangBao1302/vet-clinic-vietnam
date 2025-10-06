"use client";

import Image from "next/image";
import { Star, TrendingUp, Shield, Target, Youtube, PlayCircle } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    label: "Profit Factor",
    value: "2.4",
    description: "Tỷ lệ lợi nhuận/lỗ",
    color: "text-green-600"
  },
  {
    icon: Shield,
    label: "Max Drawdown",
    value: "8.5%",
    description: "Mức sụt giảm tối đa",
    color: "text-blue-600"
  },
  {
    icon: Target,
    label: "Win Rate",
    value: "68%",
    description: "Tỷ lệ lệnh thắng",
    color: "text-purple-600"
  },
  {
    icon: TrendingUp,
    label: "Risk:Reward",
    value: "1:2.1",
    description: "Tỷ lệ rủi ro/lợi nhuận",
    color: "text-orange-600"
  }
];

const testimonials = [
  {
    name: "Anh Minh",
    role: "Trader 3 năm kinh nghiệm",
    image: "/reviews/jonas-leupe-8pCtwj37VB4-unsplash.jpg",
    rating: 5,
    comment: "EA ThebenchmarkTrader đã giúp tôi ổn định lợi nhuận hàng tháng. Quản trị rủi ro rất tốt, tôi yên tâm để EA chạy cả đêm."
  },
  {
    name: "Chị Lan",
    role: "Nhà đầu tư cá nhân",
    image: "/reviews/brooke-cagle--uHVRvDr7pg-unsplash.jpg",
    rating: 5,
    comment: "Tôi là người mới, EA này rất dễ sử dụng. Báo cáo hàng ngày giúp tôi hiểu rõ hiệu suất giao dịch."
  },
  {
    name: "Anh Đức",
    role: "Quản lý quỹ",
    image: "/reviews/jason-goodman-fznQW-kn5VU-unsplash.jpg",
    rating: 5,
    comment: "Code minh bạch, logic rõ ràng. Tôi đã customize cho phù hợp với chiến lược quỹ và kết quả rất khả quan."
  }
];

export default function Proof() {
  return (
    <section id="proof" className="py-20 bg-gray-50">
      <div className="container-custom">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Hiệu suất được chứng minh
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Kết quả backtest trên dữ liệu thực tế EURUSD H1 từ 2020-2024
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex justify-center mb-4">
                    <IconComponent size={32} className={stat.color} />
                  </div>
                  <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="font-semibold text-gray-800 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Phản hồi từ khách hàng
          </h3>
          <p className="text-lg text-gray-600">
            Hơn 500+ trader đang sử dụng EA ThebenchmarkTrader
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-600 italic">
                "{testimonial.comment}"
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-6 py-3 rounded-lg mb-6">
            <span className="font-medium">
              📊 Tất cả số liệu đều có thể xác thực qua file backtest chi tiết
            </span>
          </div>
          
          {/* YouTube Video Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://www.youtube.com/@ThebenchmarkTraderEA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Youtube size={20} />
              <span>Xem Video Backtest</span>
            </a>
            <a
              href="https://www.youtube.com/@ThebenchmarkTraderEA/playlists"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <PlayCircle size={20} />
              <span>Video Hướng Dẫn Khác</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


