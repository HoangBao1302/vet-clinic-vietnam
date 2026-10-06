import Link from "next/link";

/**
 * Sitewide risk notice rendered directly under the footer.
 * English wording is fixed so payment reviewers always see the same text.
 */
export default function RiskDisclaimer() {
  return (
    <section
      id="risk-disclaimer"
      aria-label="Risk Disclaimer"
      className="bg-amber-50 border-t border-amber-200 text-gray-800"
    >
      <div className="container-custom py-6 pb-24">
        <h2 className="text-sm font-bold uppercase tracking-wide text-amber-950 mb-3">
          Risk Disclaimer
        </h2>
        <p className="text-sm leading-relaxed text-gray-800">
          Trading financial instruments, including foreign exchange (Forex), involves substantial risk of loss and is not suitable for every investor. The software, Expert Advisors (EAs), utility tools, and indicators provided on thebenchmarktrader.com are designed solely for informational, educational, and analytical assistance purposes. They do not constitute financial, investment, or trading advice.
        </p>
        <p className="text-sm leading-relaxed text-gray-800 mt-3">
          Past performance of any trading system, utility tool, or methodology is not necessarily indicative of future results. Users assume full responsibility for any trading decisions and execution within their live or demo trading accounts. Thebenchmarktrader.com and its operators shall not be held liable for any financial losses, damages, or margin calls resulting from the use or misuse of our software.
        </p>
        <p className="text-sm mt-4 flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/terms-of-service" className="font-semibold text-amber-950 underline underline-offset-2 hover:text-amber-800">
            Terms of Service
          </Link>
          <Link href="/refund-policy" className="font-semibold text-amber-950 underline underline-offset-2 hover:text-amber-800">
            Refund Policy
          </Link>
        </p>
      </div>
    </section>
  );
}
