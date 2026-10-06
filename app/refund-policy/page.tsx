import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Ban } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund Policy for Digital Goods | Thebenchmarktrader",
  description:
    "Refund policy for digital software utilities and Expert Advisor licenses sold on thebenchmarktrader.com. All sales are final once the file is downloaded or the license key is issued.",
  robots: { index: true, follow: true },
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        <section className="py-8 bg-gradient-to-r from-slate-700 to-slate-900 text-white">
          <div className="container-custom">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Ban size={40} />
              Refund Policy for Digital Goods
            </h1>
            <p className="text-slate-200 mt-2">thebenchmarktrader.com</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container-custom max-w-4xl">
            <article className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-gray-700 mb-8 leading-relaxed">
                At thebenchmarktrader.com, we specialize in non-tangible, irrevocable digital software utilities and Expert Advisor (EA) licenses. Due to the digital nature of our products, all sales are final. Once the software file has been downloaded or the license key has been issued, we cannot issue a refund, exchange, or cancellation.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. No Refund Policy</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Because digital products cannot be physically returned or verified as deleted, we strictly enforce a &quot;No Refunds / All Sales Are Final&quot; policy. Please carefully read the product descriptions, system requirements, and compatibility notes before making a purchase.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Exception: Technical Defect Policy</h2>
              <p className="text-gray-700 mb-3 leading-relaxed">
                We want to ensure our software works as intended. If you experience a verified technical error or bug that prevents the software from operating:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2 leading-relaxed">
                <li>
                  You must contact our support team at{" "}
                  <a href="mailto:support@thebenchmarktrader.com" className="text-blue-700 underline">
                    support@thebenchmarktrader.com
                  </a>{" "}
                  within 7 days of purchase.
                </li>
                <li>
                  You must provide clear logs, screenshots, or error messages demonstrating that the software fails to function due to a bug in our code, rather than incorrect user setup, faulty broker feeds, or lack of VPS stability.
                </li>
                <li>
                  If our technical team confirms the software itself is defective and we are unable to provide a working fix or update within 7 business days, a refund will be evaluated and processed at our sole discretion.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Disputes and Chargebacks</h2>
              <p className="text-gray-700 leading-relaxed">
                By purchasing our digital products, you agree that you will not open frivolous disputes or chargebacks with your payment provider (such as PayPal or credit card issuers). If a dispute is filed claiming &quot;unauthorized access&quot; or &quot;product not received,&quot; we will submit comprehensive delivery evidence to the payment provider, including your purchase timestamps, download logs, IP addresses, and email confirmation history.
              </p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
