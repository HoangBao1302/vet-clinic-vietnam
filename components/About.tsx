"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Award, Clock, Heart, Users } from "lucide-react";

export default function About() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="relative">
            <div className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/vet-images/judy-beth-morris-5Bi6MWlWMbw-unsplash.jpg"
                alt="Bác sĩ thú y với thú cưng"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Về Phòng Khám PawCare
            </h2>
            <p className="text-lg text-gray-600 mb-6">
                             Trong hơn 15 năm, Phòng Khám PawCare đã là lựa chọn đáng tin cậy của các chủ thú cưng tại TP. Hồ Chí Minh. 
               Cơ sở vật chất hiện đại và đội ngũ có kinh nghiệm của chúng tôi cung cấp dịch vụ thú y toàn diện với 
               lòng tận tâm và tính chuyên nghiệp.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Chúng tôi tin rằng mỗi thú cưng đều xứng đáng nhận được sự chăm sóc tốt nhất có thể. Trang thiết bị hiện đại, 
              các thủ thuật y tế tiên tiến và cách tiếp cận chu đáo của chúng tôi đảm bảo những người bạn thân yêu của bạn 
              nhận được sự điều trị vượt quá mong đợi của bạn.
            </p>

            {/* Stats/Features */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">5000+</div>
                  <div className="text-sm text-gray-600">Thú Cưng Hạnh Phúc</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Award className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">15+</div>
                  <div className="text-sm text-gray-600">Năm Kinh Nghiệm</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">24/7</div>
                  <div className="text-sm text-gray-600">Cấp Cứu</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Heart className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">100%</div>
                  <div className="text-sm text-gray-600">Tận Tâm & Yêu Thương</div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => isClient && document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-primary"
              suppressHydrationWarning
            >
              Gặp Gỡ Đội Ngũ
            </button>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Đội Ngũ Chuyên Gia
            </h3>
            <p className="text-lg text-gray-600">
              Gặp gỡ những chuyên gia tận tâm làm nên sự đặc biệt của PawCare
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-4 overflow-hidden rounded-full">
                <Image
                  src="/reviews/brooke-cagle--uHVRvDr7pg-unsplash.jpg"
                  alt="BS. Sarah Johnson"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-full"
                  sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">BS. Sarah Johnson</h4>
              <p className="text-primary-600 font-medium mb-2">Bác Sĩ Thú Y Trưởng</p>
              <p className="text-gray-600">
                Hơn 15 năm kinh nghiệm trong y học và phẫu thuật động vật nhỏ
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-4 overflow-hidden rounded-full">
                <Image
                  src="/reviews/jason-goodman-fznQW-kn5VU-unsplash.jpg"
                  alt="BS. Michael Chen"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-full"
                  sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">BS. Michael Chen</h4>
              <p className="text-primary-600 font-medium mb-2">Chuyên Gia Cấp Cứu</p>
              <p className="text-gray-600">
                Chuyên gia trong chăm sóc cấp cứu và quản lý bệnh nhân nguy kịch
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-4 overflow-hidden rounded-full">
                <Image
                  src="/reviews/jonas-leupe-E0NDAvDCPa0-unsplash.jpg"
                  alt="BS. Emily Rodriguez"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-full"
                  sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">BS. Emily Rodriguez</h4>
              <p className="text-primary-600 font-medium mb-2">Chuyên Gia Phẫu Thuật</p>
              <p className="text-gray-600">
                Bác sĩ phẫu thuật được chứng nhận với chuyên môn trong các thủ thuật phức tạp
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 