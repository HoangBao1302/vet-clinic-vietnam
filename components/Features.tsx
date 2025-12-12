"use client";

import { TrendingUp, Shield, Brain, Target, Clock, FileText } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function Features() {
  const { t } = useLocale();
  
  const features = [
    {
      icon: TrendingUp,
      titleKey: "features.multiStrategyTitle",
      descKey: "features.multiStrategyDesc",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Shield,
      titleKey: "features.moneyManagementTitle",
      descKey: "features.moneyManagementDesc",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Brain,
      titleKey: "features.smartMarketTitle",
      descKey: "features.smartMarketDesc",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: Target,
      titleKey: "features.flexibleTPTitle",
      descKey: "features.flexibleTPDesc",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      icon: Clock,
      titleKey: "features.spreadLimitTitle",
      descKey: "features.spreadLimitDesc",
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      icon: FileText,
      titleKey: "features.reportLogTitle",
      descKey: "features.reportLogDesc",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    }
  ];
  
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
                  {t(feature.titleKey)}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium">
              {t('features.customizableNote')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
