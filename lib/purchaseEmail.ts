import type { EmailLocale } from "@/lib/customerLocale";

export type PurchasePaymentMethod = "paypal" | "crypto" | "stripe" | "bank";

export type PurchaseEmailInput = {
  locale: EmailLocale;
  orderId: string;
  productName: string;
  amountLabel: string;
  paymentMethod: PurchasePaymentMethod;
  downloadsUrl: string;
  directDownloadUrl?: string;
  isMt5: boolean;
};

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paymentLabel(method: PurchasePaymentMethod, locale: EmailLocale) {
  if (method === "crypto") return "Crypto (USDT TRC20)";
  if (method === "paypal") return "PayPal";
  if (method === "stripe") return "Stripe";
  return locale === "vi" ? "Chuyển khoản ngân hàng" : "Bank transfer";
}

function legalReceipt(orderId: string, productName: string) {
  const order = esc(orderId);
  const product = esc(productName);
  return `
    <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #d1d5db;">
      <p style="margin: 0 0 12px; font-size: 13px; font-weight: bold; letter-spacing: 0.04em; color: #111827;">[OFFICIAL TRANSACTION RECEIPT &amp; LEGAL AGREEMENT]</p>
      <p style="margin: 0 0 12px; font-size: 13px; line-height: 1.6; color: #1f2937;">Dear Customer,</p>
      <p style="margin: 0 0 12px; font-size: 13px; line-height: 1.6; color: #1f2937;">Thank you for your payment. This email serves as your official transaction receipt and proof of digital delivery for Order #${order}.</p>
      <p style="margin: 0 0 12px; font-size: 13px; line-height: 1.6; color: #1f2937;">By initiating the download of this software utility (${product}), you explicitly acknowledge and agree to our Risk Disclaimer, Terms of Service, and our strict No-Refund Policy for digital goods.</p>
      <p style="margin: 0 0 8px; font-size: 13px; line-height: 1.6; color: #1f2937;">As stated under our website's footer (<a href="https://thebenchmarktrader.com" style="color: #1d4ed8;">https://thebenchmarktrader.com</a>):</p>
      <ul style="margin: 0 0 12px; padding-left: 18px; font-size: 13px; line-height: 1.6; color: #1f2937;">
        <li>All sales of non-tangible digital products are final.</li>
        <li>This analytical tool does not constitute financial advice.</li>
      </ul>
      <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #1f2937;">If you did not authorize this transaction or experience any technical deployment issues, please contact our support team immediately at <a href="mailto:support@thebenchmarktrader.com" style="color: #1d4ed8;">support@thebenchmarktrader.com</a> instead of filing an unauthorized claim. We will resolve your issue within 24 hours.</p>
    </div>
  `;
}

function installSteps(isMt5: boolean, locale: EmailLocale) {
  if (locale === "en") {
    return isMt5
      ? `<ol style="color: #1e3a8a; margin: 10px 0; padding-left: 20px;">
          <li>Unzip the file (if it is a .zip)</li>
          <li>Copy the .ex5 file into MT5/MQL5/Experts or Indicators</li>
          <li>Restart MetaTrader 5</li>
          <li>Drag the product onto a chart and configure it</li>
        </ol>
        <p style="color: #059669; font-weight: bold;">MT5 version — for MetaTrader 5</p>`
      : `<ol style="color: #1e3a8a; margin: 10px 0; padding-left: 20px;">
          <li>Unzip the file (if it is a .zip)</li>
          <li>Copy the .ex4 file into MT4/MQL4/Experts or Indicators</li>
          <li>Restart MetaTrader 4</li>
          <li>Drag the product onto a chart and configure it</li>
        </ol>
        <p style="color: #059669; font-weight: bold;">MT4 version — for MetaTrader 4</p>`;
  }

  return isMt5
    ? `<ol style="color: #1e3a8a; margin: 10px 0; padding-left: 20px;">
        <li>Giải nén file (nếu là .zip)</li>
        <li>Copy file .ex5 vào thư mục MT5/MQL5/Experts hoặc Indicators</li>
        <li>Restart MetaTrader 5</li>
        <li>Kéo sản phẩm lên chart và cấu hình</li>
      </ol>
      <p style="color: #059669; font-weight: bold;">Phiên bản MT5 - Dành cho MetaTrader 5</p>`
    : `<ol style="color: #1e3a8a; margin: 10px 0; padding-left: 20px;">
        <li>Giải nén file (nếu là .zip)</li>
        <li>Copy file .ex4 vào thư mục MT4/MQL4/Experts hoặc Indicators</li>
        <li>Restart MetaTrader 4</li>
        <li>Kéo sản phẩm lên chart và cấu hình</li>
      </ol>
      <p style="color: #059669; font-weight: bold;">Phiên bản MT4 - Dành cho MetaTrader 4</p>`;
}

function supportBlock(locale: EmailLocale) {
  if (locale === "en") {
    return `<h3>Need help?</h3>
      <ul style="list-style: none; padding: 0;">
        <li>📧 Email: support@thebenchmarktrader.com</li>
        <li>📱 Telegram: t.me/+0ETUdIuYUzdhZWQ1</li>
        <li>📞 Hotline: +1925 582 0779</li>
      </ul>`;
  }
  return `<h3>Cần hỗ trợ?</h3>
    <ul style="list-style: none; padding: 0;">
      <li>📧 Email: support@thebenchmarktrader.com</li>
      <li>📱 Telegram: t.me/+0ETUdIuYUzdhZWQ1</li>
      <li>📞 Hotline: +1925 582 0779</li>
    </ul>`;
}

export function buildPurchaseEmail(input: PurchaseEmailInput) {
  const locale = input.locale;
  const orderId = esc(input.orderId);
  const productName = esc(input.productName);
  const amount = esc(input.amountLabel);
  const method = esc(paymentLabel(input.paymentMethod, locale));
  const downloadsUrl = esc(input.downloadsUrl);
  const direct = input.directDownloadUrl ? esc(input.directDownloadUrl) : "";
  const year = new Date().getFullYear();

  const copy = locale === "en"
    ? {
        subject: "✅ Payment confirmed - Download ThebenchmarkTrader software",
        title: "🎉 Payment successful!",
        thanks: "Thank you for your purchase!",
        order: "Order ID",
        product: "Product",
        pay: "Method",
        sum: "Amount",
        hint: "Use the <strong>order ID</strong> above on the Downloads page to get your file, or click the button below.",
        button: "Download now",
        guide: "📋 Installation guide",
        directLabel: "Direct link (login required)",
      }
    : {
        subject: "✅ Thanh toán thành công - Download EA ThebenchmarkTrader",
        title: "🎉 Thanh toán thành công!",
        thanks: "Cảm ơn bạn đã mua hàng!",
        order: "Mã đơn hàng",
        product: "Sản phẩm",
        pay: "Phương thức",
        sum: "Số tiền",
        hint: "Dùng <strong>mã đơn hàng</strong> ở trên tại trang Downloads để tải file. Hoặc bấm nút bên dưới.",
        button: "Tải xuống ngay",
        guide: "📋 Hướng dẫn cài đặt",
        directLabel: "Link trực tiếp (cần đăng nhập)",
      };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 32px;">${copy.title}</h1>
      </div>
      <div style="padding: 40px 20px; background: #f8f9fa;">
        <h2 style="color: #333;">${copy.thanks}</h2>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>${copy.order}:</strong> ${orderId}</p>
          <p><strong>${copy.product}:</strong> ${productName}</p>
          <p><strong>${copy.pay}:</strong> ${method}</p>
          <p><strong>${copy.sum}:</strong> ${amount}</p>
        </div>
        <p style="color: #374151;">${copy.hint}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${downloadsUrl}" style="display: inline-block; padding: 15px 40px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
            ${copy.button}
          </a>
        </div>
        ${direct ? `<p style="font-size: 13px; color: #6b7280;">${copy.directLabel}: <a href="${direct}">${direct}</a></p>` : ""}
        <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">${copy.guide}</h3>
          ${installSteps(input.isMt5, locale)}
        </div>
        ${supportBlock(locale)}
        ${legalReceipt(input.orderId, input.productName)}
      </div>
      <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
        <p>EA Forex ThebenchmarkTrader<br>© ${year} All rights reserved</p>
      </div>
    </div>
  `;

  return { subject: copy.subject, html };
}
