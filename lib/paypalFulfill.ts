import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { sendEmail } from "@/lib/email";
import { formatUsd } from "@/config/productPrices";
import { getPayPalDownloadUrl, getPayPalProductName } from "@/lib/paypalProducts";
import { getPayPalSiteUrl } from "@/lib/paypal";

type FulfillInput = {
  orderId: string;
  productId: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  amountUsd: number;
  broker?: string;
  accountId?: string;
  server?: string;
  skipEmail?: boolean;
};

export async function fulfillPaidPayPalOrder(input: FulfillInput) {
  const productName = getPayPalProductName(input.productId);
  const amountCents = Math.round(Number(input.amountUsd) * 100);

  await connectDB();

  const current = await Order.findOneAndUpdate(
    { orderId: input.orderId },
    {
      $set: {
        productId: input.productId,
        productName,
        status: "paid",
        customerEmail: input.customerEmail,
        customerName: input.customerName || "Customer",
        customerPhone: input.customerPhone || "",
        amount: amountCents,
        paymentMethod: "paypal",
        paidAt: new Date(),
        broker: input.broker || "",
        accountId: input.accountId || "",
        server: input.server || "",
      },
      $setOnInsert: {
        orderId: input.orderId,
        createdAt: new Date(),
        emailSent: false,
      },
    },
    { upsert: true, new: true }
  );
  if (current?.emailSent || input.skipEmail) {
    if (input.skipEmail && !current?.emailSent) {
      await Order.updateOne({ orderId: input.orderId }, { $set: { emailSent: true } });
    }
    return { saved: true, emailed: false, productName, productId: input.productId };
  }

  const siteUrl = getPayPalSiteUrl();
  const downloadPath = getPayPalDownloadUrl(input.productId);
  const downloadsPage = `${siteUrl}/downloads?order=${encodeURIComponent(input.orderId)}&productId=${encodeURIComponent(input.productId)}`;
  const isMt5 = input.productId.toLowerCase().includes("mt5");

  const emailResult = await sendEmail({
    to: input.customerEmail,
    subject: "✅ Thanh toán thành công - Download EA ThebenchmarkTrader",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px;">🎉 Thanh toán thành công!</h1>
        </div>
        <div style="padding: 40px 20px; background: #f8f9fa;">
          <h2 style="color: #333;">Cảm ơn bạn đã mua hàng!</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Mã đơn hàng:</strong> ${input.orderId}</p>
            <p><strong>Sản phẩm:</strong> ${productName}</p>
            <p><strong>Phương thức:</strong> PayPal</p>
            <p><strong>Số tiền:</strong> ${formatUsd(input.amountUsd)}</p>
          </div>
          <p style="color: #374151;">Dùng <strong>mã đơn hàng</strong> ở trên tại trang Downloads để tải file. Hoặc bấm nút bên dưới.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadsPage}"
               style="display: inline-block; padding: 15px 40px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
              Tải xuống ngay
            </a>
          </div>
          ${downloadPath ? `<p style="font-size: 13px; color: #6b7280;">Link trực tiếp (cần đăng nhập): <a href="${siteUrl}${downloadPath}">${siteUrl}${downloadPath}</a></p>` : ""}
          <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">📋 Hướng dẫn cài đặt:</h3>
            ${isMt5 ? `
              <ol style="color: #1e3a8a; margin: 10px 0; padding-left: 20px;">
                <li>Giải nén file (nếu là .zip)</li>
                <li>Copy file .ex5 vào thư mục MT5/MQL5/Experts hoặc Indicators</li>
                <li>Restart MetaTrader 5</li>
                <li>Kéo sản phẩm lên chart và cấu hình</li>
              </ol>
              <p style="color: #059669; font-weight: bold;">Phiên bản MT5 - Dành cho MetaTrader 5</p>
            ` : `
              <ol style="color: #1e3a8a; margin: 10px 0; padding-left: 20px;">
                <li>Giải nén file (nếu là .zip)</li>
                <li>Copy file .ex4 vào thư mục MT4/MQL4/Experts hoặc Indicators</li>
                <li>Restart MetaTrader 4</li>
                <li>Kéo sản phẩm lên chart và cấu hình</li>
              </ol>
              <p style="color: #059669; font-weight: bold;">Phiên bản MT4 - Dành cho MetaTrader 4</p>
            `}
          </div>
          <h3>Cần hỗ trợ?</h3>
          <ul style="list-style: none; padding: 0;">
            <li>📧 Email: support@thebenchmarktrader.com</li>
            <li>📱 Telegram: t.me/+0ETUdIuYUzdhZWQ1</li>
            <li>📞 Hotline: +1925 582 0779</li>
          </ul>
        </div>
      </div>
    `,
  });

  if (emailResult.success) {
    await Order.updateOne({ orderId: input.orderId }, { $set: { emailSent: true } });
    return { saved: true, emailed: true, productName, productId: input.productId };
  }

  console.error("PayPal order saved but email failed:", emailResult.error);
  return { saved: true, emailed: false, productName, productId: input.productId };
}

export function parsePayPalCustomId(customId?: string) {
  const parts = (customId || "").split("|");
  return {
    productId: parts[0] || "",
    affiliateCode: parts[1] || "",
    email: parts[2] || "",
    name: parts[3] || "",
    phone: parts[4] || "",
    broker: parts[5] || "",
    accountId: parts[6] || "",
    server: parts[7] || "",
  };
}
