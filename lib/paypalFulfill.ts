import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { sendEmail } from "@/lib/email";
import { formatUsd } from "@/config/productPrices";
import { getPayPalDownloadUrl, getPayPalProductName } from "@/lib/paypalProducts";
import { getPayPalSiteUrl } from "@/lib/paypal";
import { emailLocaleFromCountry } from "@/lib/customerLocale";
import { buildPurchaseEmail } from "@/lib/purchaseEmail";

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
  paymentMethod?: "paypal" | "crypto";
  cryptoPaymentId?: string;
  customerCountry?: string;
  paypalCaptureId?: string;
};

export async function fulfillPaidPayPalOrder(input: FulfillInput) {
  const productName = getPayPalProductName(input.productId);
  const amountCents = Math.round(Number(input.amountUsd) * 100);

  await connectDB();

  const prior = await Order.findOne({ orderId: input.orderId }).select("customerCountry");
  const customerCountry = input.customerCountry || prior?.customerCountry || "";

  const current = await Order.findOneAndUpdate(
    { orderId: input.orderId },
    {
      $set: {
        productId: input.productId,
        productName,
        status: "paid",
        ...(input.customerEmail ? { customerEmail: input.customerEmail } : {}),
        ...(input.customerName ? { customerName: input.customerName } : {}),
        ...(input.customerPhone ? { customerPhone: input.customerPhone } : {}),
        amount: amountCents,
        paymentMethod: input.paymentMethod || "paypal",
        paidAt: new Date(),
        broker: input.broker || "",
        accountId: input.accountId || "",
        server: input.server || "",
        ...(input.cryptoPaymentId ? { cryptoPaymentId: input.cryptoPaymentId } : {}),
        ...(customerCountry ? { customerCountry } : {}),
        ...(input.paypalCaptureId ? { paypalCaptureId: input.paypalCaptureId } : {}),
      },
      $setOnInsert: {
        orderId: input.orderId,
        createdAt: new Date(),
        emailSent: false,
        ...(!input.customerEmail ? { customerEmail: "unknown@thebenchmarktrader.com" } : {}),
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
  const receipt = buildPurchaseEmail({
    locale: emailLocaleFromCountry(customerCountry),
    orderId: input.orderId,
    productName,
    amountLabel: formatUsd(input.amountUsd),
    paymentMethod: input.paymentMethod === "crypto" ? "crypto" : "paypal",
    downloadsUrl: downloadsPage,
    directDownloadUrl: downloadPath ? `${siteUrl}${downloadPath}` : undefined,
    isMt5,
  });

  const emailResult = await sendEmail({
    to: input.customerEmail,
    subject: receipt.subject,
    html: receipt.html,
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
