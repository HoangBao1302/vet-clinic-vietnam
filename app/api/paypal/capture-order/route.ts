import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { orderId, productId, productName, amount, customerInfo } = await request.json();

    // Validate input
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing order ID" },
        { status: 400 }
      );
    }

    // Check if PayPal is configured
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { success: false, error: "PayPal not configured" },
        { status: 503 }
      );
    }

    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Failed to get PayPal access token" },
        { status: 500 }
      );
    }

    // Capture the PayPal order
    const response = await fetch(
      `https://api-m.${process.env.PAYPAL_MODE === 'live' ? '' : 'sandbox.'}paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "PayPal-Request-Id": `capture-${orderId}-${Date.now()}`,
        },
        body: JSON.stringify({}),
      }
    );

    const captureData = await response.json();

    if (!response.ok) {
      console.error("PayPal capture failed:", captureData);
      return NextResponse.json(
        { success: false, error: `PayPal capture error: ${captureData.message || "Unknown error"}` },
        { status: 500 }
      );
    }

    // Check if payment was successful
    if (captureData.status === "COMPLETED") {
      // Log the successful payment
      console.log("PayPal payment successful:", orderId);

      // Create order record
      const order = {
        orderId: orderId,
        productId: productId || captureData.purchase_units[0]?.reference_id,
        status: "paid",
        customerEmail: customerInfo?.email || captureData.payer?.email_address,
        customerName: customerInfo?.name || `${captureData.payer?.name?.given_name || ''} ${captureData.payer?.name?.surname || ''}`.trim(),
        customerPhone: customerInfo?.phone || captureData.payer?.phone?.phone_number?.national_number,
        amount: parseFloat(captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value || "0") * 100, // Convert to cents
        createdAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        paymentMethod: "paypal",
      };

      console.log("Order details:", order);

      // Send email notification using Nodemailer
      const customerEmail = order.customerEmail;
      if (customerEmail) {
        try {
          const { sendEmail } = await import("@/lib/email");
          
          await sendEmail({
            to: customerEmail,
            subject: "✅ Thanh toán thành công - Download EA ThebenchmarkTrader",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 32px;">🎉 Thanh toán thành công!</h1>
                </div>
                
                <div style="padding: 40px 20px; background: #f8f9fa;">
                  <h2 style="color: #333;">Cảm ơn bạn đã mua hàng!</h2>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Mã đơn hàng:</strong> ${orderId}</p>
                    <p><strong>Sản phẩm:</strong> ${productName || "EA ThebenchmarkTrader"}</p>
                    <p><strong>Số tiền:</strong> ${(order.amount / 100).toLocaleString("vi-VN")}đ</p>
                    <p><strong>Phương thức:</strong> PayPal</p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ThebenchmarkTrader.com'}/downloads?order=${orderId}" 
                       style="display: inline-block; padding: 15px 40px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
                      Tải xuống ngay
                    </a>
                  </div>
                  
                  <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #1e40af; margin-top: 0;">📋 Hướng dẫn cài đặt:</h3>
                    <ol style="color: #1e3a8a; margin: 10px 0; padding-left: 20px;">
                      <li>Giải nén file (nếu là .zip)</li>
                      <li>Copy file .ex4 vào thư mục MT4/MQL4/Experts</li>
                      <li>Restart MetaTrader</li>
                      <li>Drag EA lên chart và configure</li>
                    </ol>
                  </div>
                  
                  <h3>Cần hỗ trợ?</h3>
                  <ul style="list-style: none; padding: 0;">
                    <li>📧 Email: support@thebenchmarktrader.com</li>
                    <li>📱 Telegram Group: t.me/+0ETUdIuYUzdhZWQ1</li>
                    <li>📞 Hotline: +84 765 452 515</li>
                  </ul>
                </div>
                
                <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
                  <p>EA Forex ThebenchmarkTrader<br>© 2025 All rights reserved</p>
                </div>
              </div>
            `,
          });
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          // Continue even if email fails
        }
      }

      return NextResponse.json({
        success: true,
        orderId: orderId,
        status: "completed",
        message: "Payment captured successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Payment not completed" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("PayPal capture error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function getPayPalAccessToken(): Promise<string | null> {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch(
      `https://api-m.${process.env.PAYPAL_MODE === 'live' ? '' : 'sandbox.'}paypal.com/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("PayPal auth failed:", data);
      return null;
    }

    return data.access_token;
  } catch (error) {
    console.error("PayPal access token error:", error);
    return null;
  }
}
