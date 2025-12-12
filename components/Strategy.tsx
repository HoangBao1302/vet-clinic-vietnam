"use client";

import Image from "next/image";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function Strategy() {
  const { t } = useLocale();
  
  return (
    <section id="strategy" className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="relative">
            <Image
              src="/vet-images/2.png"
              alt="Trading strategy analysis"
              width={600}
              height={400}
              className="rounded-xl shadow-lg"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
          </div>

          {/* Right Column - Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              {t("strategy.title")}
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              {t("strategy.description")}
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-3">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{t("strategy.entryTitle")}</h3>
                  <p className="text-gray-600">{t("strategy.entryDesc")}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{t("strategy.moneyTitle")}</h3>
                  <p className="text-gray-600">{t("strategy.moneyDesc")}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{t("strategy.emergencyTitle")}</h3>
                  <p className="text-gray-600">{t("strategy.emergencyDesc")}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-yellow-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1">{t("strategy.warningTitle")}</h3>
                  <p className="text-yellow-700 text-sm">
                    {t("strategy.warningDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

