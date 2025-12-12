"use client";

import Image from "next/image";
import { Star, TrendingUp, Shield, Target, Youtube, PlayCircle } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function Proof() {
  const { t } = useLocale();
  
  const stats = [
    {
      icon: TrendingUp,
      labelKey: "proof.profitFactor",
      value: "2.4",
      descKey: "proof.profitFactorDesc",
      color: "text-green-600"
    },
    {
      icon: Shield,
      labelKey: "proof.maxDrawdown",
      value: "8.5%",
      descKey: "proof.maxDrawdownDesc",
      color: "text-blue-600"
    },
    {
      icon: Target,
      labelKey: "proof.winRate",
      value: "68%",
      descKey: "proof.winRateDesc",
      color: "text-purple-600"
    },
    {
      icon: TrendingUp,
      labelKey: "proof.riskReward",
      value: "1:2.1",
      descKey: "proof.riskRewardDesc",
      color: "text-orange-600"
    }
  ];

  const testimonials = [
    {
      nameKey: "proof.testimonial1.name",
      roleKey: "proof.testimonial1.role",
      commentKey: "proof.testimonial1.comment",
      image: "/reviews/jonas-leupe-8pCtwj37VB4-unsplash.jpg",
      rating: 5
    },
    {
      nameKey: "proof.testimonial2.name",
      roleKey: "proof.testimonial2.role",
      commentKey: "proof.testimonial2.comment",
      image: "/reviews/brooke-cagle--uHVRvDr7pg-unsplash.jpg",
      rating: 5
    },
    {
      nameKey: "proof.testimonial3.name",
      roleKey: "proof.testimonial3.role",
      commentKey: "proof.testimonial3.comment",
      image: "/reviews/jason-goodman-fznQW-kn5VU-unsplash.jpg",
      rating: 5
    }
  ];

  return (
    <section id="proof" className="py-20 bg-gray-50">
      <div className="container-custom">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {t("proof.title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            {t("proof.subtitle")}
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
                    {t(stat.labelKey)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t(stat.descKey)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            {t("proof.testimonialsTitle")}
          </h3>
          <p className="text-lg text-gray-600">
            {t("proof.testimonialsSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Image
                  src={testimonial.image}
                  alt={t(testimonial.nameKey)}
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">{t(testimonial.nameKey)}</h4>
                  <p className="text-sm text-gray-600">{t(testimonial.roleKey)}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-600 italic">
                "{t(testimonial.commentKey)}"
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          {/* YouTube Video Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://www.youtube.com/@ThebenchmarkTraderEA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Youtube size={20} />
              <span>{t("proof.watchBacktest")}</span>
            </a>
            <a
              href="https://www.youtube.com/@ThebenchmarkTraderEA/playlists"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <PlayCircle size={20} />
              <span>{t("proof.moreVideos")}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


