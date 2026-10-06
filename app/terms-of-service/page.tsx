import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Thebenchmarktrader",
  description:
    "Terms of Service for thebenchmarktrader.com. Digital software utilities, Expert Advisor licenses, and analytical tools.",
  robots: { index: true, follow: true },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        <section className="py-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container-custom">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <FileText size={40} />
              Terms of Service
            </h1>
            <p className="text-blue-100 mt-2">thebenchmarktrader.com</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container-custom max-w-4xl">
            <article className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-gray-700 mb-8 leading-relaxed">
                Welcome to thebenchmarktrader.com. By accessing or purchasing from our website, you agree to comply with and be bound by the following Terms of Service.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Nature of Services</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Thebenchmarktrader.com operates as a software and computer utility store. We provide digital product licenses, analytical tools, expert advisor (EA) plugins, and automated data-logging scripts. Our products are automated software utilities designed to execute tasks based on user-defined parameters; they are not financial management or investment services.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. License and Intellectual Property</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Upon successful purchase, you are granted a non-exclusive, non-transferable license to use the software for personal or specified business use on your trading platform. You agree not to reverse-engineer, redistribute, resell, or lease our software to third parties. Any unauthorized distribution will result in immediate termination of your license without a refund.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. User Responsibility &amp; Risk Acknowledgment</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                You acknowledge that you are using our software utilities at your own risk. You are solely responsible for setting up the parameters, managing your risk lot sizes, and ensuring stable server/VPS connectivity. We do not guarantee profits or specific financial outcomes.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Limitation of Liability</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                In no event shall thebenchmarktrader.com or its owners be liable for any direct, indirect, incidental, or consequential financial losses arising out of the use or inability to use our software products.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws applicable to digital commerce and intellectual property.
              </p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
