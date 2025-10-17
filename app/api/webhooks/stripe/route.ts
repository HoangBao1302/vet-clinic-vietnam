import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AffiliateClick from "@/lib/models/AffiliateClick";
import User from "@/lib/models/User";

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.log("Stripe not configured, skipping webhook processing");
      return NextResponse.json({ received: true, message: "Stripe not configured" });
    }

    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Verify webhook signature
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia" as any,
    });

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      // Log the successful payment
      console.log("Payment successful:", session.id);

      // For now, just log the order details
      // In production, you would save to database or external service
      const order = {
        orderId: session.id,
        productId: session.metadata?.productId,
        status: "paid",
        customerEmail: session.customer_email,
        customerName: session.metadata?.customerName,
        customerPhone: session.metadata?.customerPhone,
        amount: session.amount_total,
        createdAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
      };

      console.log("Order details:", order);

      // Connect to database for affiliate tracking
      await connectDB();

      // Handle affiliate conversion
      const affiliateCode = session.metadata?.affiliateCode;
      if (affiliateCode) {
        try {
          // Find the affiliate user
          const affiliate = await User.findOne({ 
            affiliateCode, 
            affiliateStatus: 'approved' 
          });

          if (affiliate) {
            // Calculate commission
            const commissionRates = {
              'ea-full': affiliate.isPaid ? 0.35 : 0.30,
              'ea-pro-source': affiliate.isPaid ? 0.35 : 0.30,
              'indicator-pro': affiliate.isPaid ? 0.35 : 0.30,
              'course': 0.25,
              'social-copy': 0.10,
            };

            const commissionRate = commissionRates[session.metadata?.productId as keyof typeof commissionRates] || 0.30;
            const commissionAmount = Math.round(session.amount_total * commissionRate);

            // Update affiliate click record
            await AffiliateClick.updateOne(
              { affiliateCode },
              {
                $set: {
                  convertedAt: new Date(),
                  orderId: session.id,
                  commissionAmount,
                  productId: session.metadata?.productId,
                  productName: session.metadata?.productName || 'Unknown Product',
                  customerEmail: session.customer_email,
                  customerName: session.metadata?.customerName,
                  status: 'converted',
                },
              },
              { sort: { clickedAt: -1 } } // Update the most recent click
            );

            console.log(`Affiliate conversion tracked: ${affiliateCode}, Commission: ${commissionAmount}đ`);
          }
        } catch (affiliateError) {
          console.error('Affiliate conversion tracking error:', affiliateError);
        }
      }

      // Send email notification using Nodemailer
      if (session.customer_email) {
        try {
          const { sendEmail } = await import("@/lib/email");
          
          await sendEmail({
            to: session.customer_email,
            subject: "✅ Thanh toán thành công - Download EA ThebenchmarkTrader",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 32px;">🎉 Thanh toán thành công!</h1>
                </div>
                
                <div style="padding: 40px 20px; background: #f8f9fa;">
                  <h2 style="color: #333;">Cảm ơn bạn đã mua hàng!</h2>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Mã đơn hàng:</strong> ${session.id}</p>
                    <p><strong>Sản phẩm:</strong> ${session.metadata?.productName || "EA ThebenchmarkTrader"}</p>
                    <p><strong>Số tiền:</strong> ${(session.amount_total / 100).toLocaleString("vi-VN")}đ</p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ThebenchmarkTrader.com'}/downloads?order=${session.id}" 
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
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

