import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { orderId, customerEmail, customerName, productName, amount, paymentMethod, customerCountry } = await request.json();
    
    console.log("Sending order email:", { orderId, customerEmail, customerName, productName, amount, paymentMethod });
    
    if (!customerEmail) {
      return NextResponse.json(
        { success: false, error: "Customer email is required" },
        { status: 400 }
      );
    }
    
    try {
      const { sendEmail } = await import("@/lib/email");
      const { emailLocaleFromCountry } = await import("@/lib/customerLocale");
      const { buildPurchaseEmail } = await import("@/lib/purchaseEmail");
      const locale = emailLocaleFromCountry(customerCountry);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thebenchmarktrader.com";
      const method = paymentMethod === "paypal" ? "paypal" : paymentMethod === "crypto" ? "crypto" : "stripe";
      const amountValue = Number(amount) / 100;
      const receipt = buildPurchaseEmail({
        locale,
        orderId: String(orderId || ""),
        productName: String(productName || "ThebenchmarkTrader software"),
        amountLabel: locale === "vi"
          ? `${amountValue.toLocaleString("vi-VN")}đ`
          : `$${amountValue.toFixed(2)}`,
        paymentMethod: method,
        downloadsUrl: `${siteUrl}/downloads?order=${encodeURIComponent(String(orderId || ""))}`,
        isMt5: String(productName || "").toLowerCase().includes("mt5"),
      });

      await sendEmail({
        to: customerEmail,
        subject: receipt.subject,
        html: receipt.html,
      });
      
      console.log("Email sent successfully to:", customerEmail);
      
      return NextResponse.json({
        success: true,
        message: "Email sent successfully"
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Send email error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
