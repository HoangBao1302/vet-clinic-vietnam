import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, AlertTriangle } from "lucide-react";

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
            <p className="text-blue-100 mt-2">
              Terms and conditions for using Thebenchmarktrader LLC products and services
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container-custom max-w-4xl">
            <article className="bg-white rounded-lg shadow-lg p-8">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                <div className="flex items-start">
                  <AlertTriangle className="text-yellow-600 mt-1 mr-3" size={20} />
                  <div>
                    <h3 className="text-yellow-800 font-semibold">Important Notice</h3>
                    <p className="text-yellow-700 text-sm mt-1">
                      Using an Expert Advisor and other automated trading tools involves high risk. Please read these terms carefully. The same terms are available in Vietnamese at{" "}
                      <Link href="/terms" className="underline font-semibold">
                        /terms
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Definitions</h2>
              <div className="mb-6 space-y-3 text-gray-700">
                <p>
                  <strong>&quot;EA&quot;</strong> - Expert Advisor, automated trading software designed for MetaTrader 4/5.
                </p>
                <p>
                  <strong>&quot;Services&quot;</strong> - Includes EA, indicators, and market analysis tools.
                </p>
                <p>
                  <strong>&quot;User&quot;</strong> - Any person or organization using our services.
                </p>
                <p>
                  <strong>&quot;Company&quot;</strong> - Thebenchmarktrader LLC, 117 S Lexington St Ste 100, Harrisonville, MO 64701.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-6">
                Welcome to thebenchmarktrader.com. By accessing or purchasing from our website, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the services.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Nature of Services &amp; Trading Risk</h2>
              <p className="text-gray-700 mb-4">
                Thebenchmarktrader.com operates as a software and computer utility store. We provide digital product licenses, analytical tools, expert advisor (EA) plugins, and automated data-logging scripts. Our products are automated software utilities designed to execute tasks based on user-defined parameters; they are not financial management or investment services.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="text-red-800 font-semibold mb-2">High-Risk Warning</h3>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Forex and crypto trading is high risk and can result in total loss of capital.</li>
                  <li>• The EA does not guarantee profit and may cause losses.</li>
                  <li>• Past performance does not guarantee future results.</li>
                  <li>• Only invest money you can afford to lose.</li>
                </ul>
              </div>
              <p className="text-gray-700 mb-6">
                You understand and accept that trading financial markets is high risk. We are not responsible for any financial loss.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. License and Intellectual Property</h2>
              <p className="text-gray-700 mb-3">
                Upon successful purchase, you are granted a non-exclusive, non-transferable license to use the software for personal or specified business use on your trading platform. All EAs, indicators, source code, and materials are owned by Thebenchmarktrader LLC.
              </p>
              <p className="text-gray-700 mb-6">
                You agree not to reverse-engineer, redistribute, resell, or lease our software to third parties. Any unauthorized distribution will result in immediate termination of your license without a refund and may result in legal action.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Use of Services</h2>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">5.1 Permissions</h3>
              <ul className="text-gray-700 mb-4 space-y-1">
                <li>• Use the EA for personal trading</li>
                <li>• Receive technical support within the service scope</li>
                <li>• Join the community for product updates and technical discussion</li>
                <li>• Receive EA updates when available</li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">5.2 Restrictions</h3>
              <ul className="text-gray-700 mb-6 space-y-1">
                <li>• Do not share your account with others</li>
                <li>• Do not distribute the EA to third parties</li>
                <li>• Do not use it for unauthorized commercial purposes</li>
                <li>• Do not reverse engineer or decompile</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Payment and Refunds</h2>
              <p className="text-gray-700 mb-3">
                All payments are made before services are delivered. We accept PayPal, card, bank transfer, and other methods shown at checkout.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Refund policy:</strong> All sales of digital software licenses are final (all sales final) because of the digital nature of the products. See the{" "}
                <Link href="/refund-policy" className="text-blue-700 underline">
                  Refund Policy
                </Link>{" "}
                for details. A refund is considered only if a verified technical defect in our software cannot be fixed, under the technical defect process on that page.
              </p>
              <p className="text-gray-700 mb-6">
                No refunds for trading losses, incorrect user setup, broker issues, or VPS/connectivity problems.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Technical Support</h2>
              <p className="text-gray-700 mb-3">
                We provide support by email, Telegram, and Discord. Response time: 24-48 hours on business days.
              </p>
              <p className="text-gray-700 mb-3">
                Support includes EA installation, technical issues, and usage guidance.
              </p>
              <p className="text-gray-700 mb-6">
                We do not provide investment advice, personal market analysis, or profit guarantees.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Termination</h2>
              <p className="text-gray-700 mb-3">We may terminate service if you violate these terms.</p>
              <p className="text-gray-700 mb-3">You may end the service at any time by contacting us.</p>
              <p className="text-gray-700 mb-6">
                After termination, you must stop using the EA and remove it from your systems.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Disclaimer and Limitation of Liability</h2>
              <p className="text-gray-700 mb-3">
                The services are provided &quot;as is&quot; without warranties of any kind. You acknowledge that you are using our software utilities at your own risk. You are solely responsible for setting parameters, managing risk lot sizes, and ensuring stable server/VPS connectivity.
              </p>
              <p className="text-gray-700 mb-6">
                In no event shall thebenchmarktrader.com, Thebenchmarktrader LLC, or its owners be liable for any direct, indirect, incidental, or consequential financial losses arising out of the use or inability to use our software products.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Governing Law</h2>
              <p className="text-gray-700 mb-3">
                These terms are governed by the laws of the State of Missouri, United States, without regard to conflict-of-law rules.
              </p>
              <p className="text-gray-700 mb-6">
                Disputes will be resolved in courts of competent jurisdiction in Missouri, USA.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Trademarks</h2>
              <p className="text-gray-700 mb-6">
                MetaTrader, MT4, MT5, MQL4, and MQL5 are trademarks of MetaQuotes Ltd. ThebenchmarkTrader is an independent software product and is not affiliated with, sponsored by, or endorsed by MetaQuotes Ltd. Platform names are mentioned solely to describe product compatibility.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Contact</h2>
              <div className="mb-6 space-y-3 text-gray-700">
                <p><strong>Company:</strong> Thebenchmarktrader LLC</p>
                <p><strong>Address:</strong> 117 S Lexington St Ste 100, Harrisonville, MO 64701</p>
                <p><strong>Email:</strong> support@thebenchmarktrader.com</p>
                <p><strong>Hotline:</strong> +1925 582 0779</p>
                <p><strong>Telegram:</strong> @thebenchmarktrader</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
                <p className="text-blue-800 text-sm">
                  <strong>Last updated:</strong> October 8, 2026
                </p>
                <p className="text-blue-700 text-sm mt-1">
                  Thebenchmarktrader LLC may update these terms at any time. Continued use after an update means you accept the new terms.
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
