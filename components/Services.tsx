"use client";

import { useState, useEffect } from "react";
import { Heart, Stethoscope, Scissors, Shield, Syringe, Users } from "lucide-react";

const services = [
  {
    icon: <Stethoscope className="w-8 h-8" />,
    title: "Khám Tổng Quát",
    description: "Khám sức khỏe toàn diện để giữ thú cưng khỏe mạnh và phát hiện sớm các vấn đề.",
    price: "Từ ₫300,000",
  },
  {
    icon: <Syringe className="w-8 h-8" />,
    title: "Tiêm Phòng",
    description: "Chương trình tiêm phòng đầy đủ để bảo vệ thú cưng khỏi các bệnh thường gặp.",
    price: "Từ ₫200,000",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Cấp Cứu",
    description: "Dịch vụ cấp cứu 24/7 cho các tình huống y tế khẩn cấp và tai nạn.",
    price: "Từ ₫500,000",
  },
  {
    icon: <Scissors className="w-8 h-8" />,
    title: "Phẫu Thuật",
    description: "Các thủ thuật phẫu thuật tiên tiến được thực hiện bởi bác sĩ thú y giàu kinh nghiệm.",
    price: "Từ ₫1,000,000",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Chăm Sóc Răng Miệng",
    description: "Vệ sinh răng miệng chuyên nghiệp và duy trì sức khỏe răng miệng cho thú cưng.",
    price: "Từ ₫400,000",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Chăm Sóc & Làm Đẹp",
    description: "Dịch vụ chăm sóc và làm đẹp chuyên nghiệp để giữ thú cưng sạch sẽ và thoải mái.",
    price: "Từ ₫250,000",
  },
];

export default function Services() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Dịch Vụ Của Chúng Tôi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cung cấp dịch vụ thú y toàn diện với trang thiết bị hiện đại và đội ngũ chuyên gia giàu kinh nghiệm
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-primary-600 mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {service.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-primary-600">
                  {service.price}
                </span>
                <button className="text-primary-600 hover:text-primary-500 font-medium">
                  Tìm Hiểu Thêm
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => isClient && document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-primary"
            suppressHydrationWarning
          >
            Đặt Lịch Hẹn
          </button>
        </div>
      </div>
    </section>
  );
} 