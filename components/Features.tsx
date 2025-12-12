"use client";

import { TrendingUp, Shield, Brain, Target, Clock, FileText } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";

const features = [
  {
    icon: TrendingUp,
    title: "Đa chiến lược",
    description: "Kết hợp chiến lược trend-following và range-trading thông minh, tự động chuyển đổi theo điều kiện thị trường.",
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    icon: Shield,
    title: "Quản trị vốn",
    description: "Hệ thống quản lý rủi ro tiên tiến với stop loss động, position sizing và money management tự động.",
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    icon: Brain,
    title: "Điều kiện thị trường thông minh",
    description: "Phân tích volatility, spread, và news events để tránh giao dịch trong điều kiện bất lợi.",
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    icon: Target,
    title: "Đóng rổ/TP linh hoạt",
    description: "Tự động đóng toàn bộ rổ lệnh khi đạt profit target hoặc trailing stop theo xu hướng.",
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    icon: Clock,
    title: "Giới hạn spread & time",
    description: "Chỉ giao dịch khi spread thấp và trong khung giờ thanh khoản cao, tránh slippage không mong muốn.",
    color: "text-red-600",
    bgColor: "bg-red-100"
  },
  {
    icon: FileText,
    title: "Báo cáo nhật ký",
    description: "Ghi lại chi tiết mọi giao dịch, phân tích hiệu suất và cung cấp báo cáo minh bạch hàng ngày.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100"
  }
];

export default function Features() {
  const { t } = useLocale();
  
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {t('features.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-6`}>
                  <IconComponent size={24} className={feature.color} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium">
              💡 Tất cả tính năng đều có thể tùy chỉnh theo nhu cầu giao dịch của bạn
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}


