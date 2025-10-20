import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AffiliateClick from "@/lib/models/AffiliateClick";
import User from "@/lib/models/User";
import Order from "@/lib/models/Order";

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

      // Save order to MongoDB
      const orderData = {
        orderId: session.id,
        productId: session.metadata?.productId || 'unknown',
        productName: session.metadata?.productName || 'Unknown Product',
        status: "paid",
        customerEmail: session.customer_email,
        customerName: session.metadata?.customerName || 'Unknown Customer',
        customerPhone: session.metadata?.customerPhone || '',
        amount: session.amount_total,
        paymentMethod: "stripe",
        createdAt: new Date(),
        paidAt: new Date(),
      };

      // Save order to database
      try {
        await connectDB();
        const order = new Order(orderData);
        await order.save();
        console.log("✅ Stripe order saved to MongoDB:", orderData);
      } catch (dbError) {
        console.error("❌ Failed to save Stripe order to MongoDB:", dbError);
        // Continue processing even if DB save fails
      }

      // Connect to database for affiliate tracking
      await connectDB();

      // Handle affiliate conversion
      const affiliateCode = session.metadata?.affiliateCode;
      console.log('🔍 Stripe Webhook - Processing affiliate conversion:', {
        orderId: session.id,
        affiliateCode,
        customerEmail: session.customer_email,
        productId: session.metadata?.productId,
        amount: session.amount_total
      });

      if (affiliateCode) {
        try {
          // Find the affiliate user
          const affiliate = await User.findOne({ 
            affiliateCode, 
            affiliateStatus: 'approved' 
          });

          if (affiliate) {
            console.log('✅ Affiliate found:', {
              email: affiliate.email,
              affiliateCode: affiliate.affiliateCode,
              isPaid: affiliate.isPaid
            });

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

            console.log('💰 Commission calculation:', {
              productId: session.metadata?.productId,
              commissionRate,
              amount: session.amount_total,
              commissionAmount
            });

            // Update affiliate click record (most recent click that hasn't been converted yet)
            const updatedClick = await AffiliateClick.findOneAndUpdate(
              { 
                affiliateCode,
                status: 'clicked' // Only update clicks that haven't been converted
              },
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
              { sort: { clickedAt: -1 }, new: true } // Update the most recent unconverted click
            );

            if (updatedClick) {
              // Update user's total commission earned
              affiliate.totalCommissionEarned = (affiliate.totalCommissionEarned || 0) + commissionAmount;
              await affiliate.save();

              console.log(`✅ Affiliate conversion tracked successfully:`, {
                affiliateCode,
                clickId: updatedClick._id,
                orderId: session.id,
                commission: commissionAmount,
                totalEarned: affiliate.totalCommissionEarned,
                productId: session.metadata?.productId,
                productName: session.metadata?.productName
              });
            } else {
              console.warn(`⚠️ No unconverted click found for affiliate code: ${affiliateCode}`);
              console.log('🔍 Available clicks for this affiliate:', await AffiliateClick.find({ affiliateCode }).select('status clickedAt'));
            }
          } else {
            console.warn(`⚠️ Affiliate not found or not approved: ${affiliateCode}`);
          }
        } catch (affiliateError) {
          console.error('❌ Affiliate conversion tracking error:', affiliateError);
        }
      } else {
        console.log('ℹ️ No affiliate code in payment metadata');
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

