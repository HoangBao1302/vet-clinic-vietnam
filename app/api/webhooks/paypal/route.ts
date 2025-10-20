import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AffiliateClick from "@/lib/models/AffiliateClick";
import User from "@/lib/models/User";
import Order from "@/lib/models/Order";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("PayPal webhook received:", body);
    
    // Check if this is a payment completion event
    if (body.event_type === "CHECKOUT.ORDER.APPROVED" || body.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const orderId = body.resource?.id || body.resource?.supplementary_data?.related_ids?.order_id;
      const payerEmail = body.resource?.payer?.email_address || body.resource?.payer?.email;
      const payerName = body.resource?.payer?.name;
      
      // Get amount - may vary depending on event type
      const amount = body.resource?.amount?.value 
        ? parseFloat(body.resource.amount.value) * 24000 * 100 // USD to VND cents
        : body.resource?.purchase_units?.[0]?.amount?.value 
        ? parseFloat(body.resource.purchase_units[0].amount.value) * 24000 * 100
        : 0;
      
      // Get custom_id which contains productId and affiliateCode
      const customId = body.resource?.purchase_units?.[0]?.custom_id || 
                       body.resource?.custom_id || '';
      
      const [productId, affiliateCode] = customId.split('|');
      
      if (orderId) {
        console.log("PayPal order approved:", {
          orderId,
          payerEmail,
          payerName: `${payerName?.given_name || ''} ${payerName?.surname || ''}`.trim(),
          amount,
          productId,
          affiliateCode,
          eventType: body.event_type
        });
        
        // Create order record
        const orderData = {
          orderId: orderId,
          productId: productId || 'unknown',
          productName: 'Unknown Product', // Will be updated below
          status: "paid",
          customerEmail: payerEmail,
          customerName: `${payerName?.given_name || ''} ${payerName?.surname || ''}`.trim(),
          customerPhone: '', // PayPal doesn't provide phone
          amount: amount,
          paymentMethod: "paypal",
          createdAt: new Date(),
          paidAt: new Date(),
        };

        // Get product name
        const productNames: Record<string, string> = {
          'ea-full': 'EA ThebenchmarkTrader Full Version',
          'ea-pro-source': 'EA ThebenchmarkTrader Pro + Source Code',
          'indicator-pro': 'Multi-Indicator Pro Pack',
          'course': 'Khóa học Forex Trading',
          'social-copy': 'Copy Social Trading',
        };
        orderData.productName = productNames[productId] || 'Unknown Product';
        
        // Save order to database
        try {
          await connectDB();
          const order = new Order(orderData);
          await order.save();
          console.log("✅ PayPal order saved to MongoDB:", orderData);
        } catch (dbError) {
          console.error("❌ Failed to save PayPal order to MongoDB:", dbError);
          // Continue processing even if DB save fails
        }
        
        // Handle affiliate conversion
        if (affiliateCode && affiliateCode !== '') {
          try {
            await connectDB();
            
            // Find the affiliate user
            const affiliate = await User.findOne({ 
              affiliateCode, 
              affiliateStatus: 'approved' 
            });

            if (affiliate) {
              // Calculate commission
              const commissionRates: Record<string, number> = {
                'ea-full': affiliate.isPaid ? 0.35 : 0.30,
                'ea-pro-source': affiliate.isPaid ? 0.35 : 0.30,
                'indicator-pro': affiliate.isPaid ? 0.35 : 0.30,
                'course': 0.25,
                'social-copy': 0.10,
              };

              const commissionRate = commissionRates[productId] || 0.30;
              const commissionAmount = Math.round(amount * commissionRate);

              // Get product name
              const productNames: Record<string, string> = {
                'ea-full': 'EA ThebenchmarkTrader Full Version',
                'ea-pro-source': 'EA Pro + Source Code',
                'indicator-pro': 'Multi-Indicator Pro Pack',
                'course': 'Khóa học Forex Trading',
                'social-copy': 'Copy Social Trading',
              };

              // Update affiliate click record (most recent click that hasn't been converted yet)
              const updatedClick = await AffiliateClick.findOneAndUpdate(
                { 
                  affiliateCode,
                  status: 'clicked' // Only update clicks that haven't been converted
                },
                {
                  $set: {
                    convertedAt: new Date(),
                    orderId: orderId,
                    commissionAmount,
                    productId: productId,
                    productName: productNames[productId] || productId,
                    customerEmail: payerEmail,
                    customerName: `${payerName?.given_name || ''} ${payerName?.surname || ''}`.trim(),
                    status: 'converted',
                  },
                },
                { sort: { clickedAt: -1 }, new: true } // Update the most recent unconverted click
              );

              if (updatedClick) {
                // Update user's total commission earned
                affiliate.totalCommissionEarned = (affiliate.totalCommissionEarned || 0) + commissionAmount;
                await affiliate.save();

                console.log(`✅ PayPal Affiliate conversion tracked:`, {
                  affiliateCode,
                  clickId: updatedClick._id,
                  orderId: orderId,
                  commission: commissionAmount,
                  totalEarned: affiliate.totalCommissionEarned,
                  productId,
                  productName: productNames[productId]
                });
              } else {
                console.warn(`⚠️ No unconverted click found for PayPal affiliate code: ${affiliateCode}`);
              }
            } else {
              console.warn(`⚠️ Affiliate not found or not approved: ${affiliateCode}`);
            }
          } catch (affiliateError) {
            console.error('PayPal Affiliate conversion tracking error:', affiliateError);
          }
        }
        
        // Send email notification
        if (payerEmail) {
          try {
            const { sendEmail } = await import("@/lib/email");
            
            // Get product name for email
            const productNames: Record<string, string> = {
              'ea-full': 'EA ThebenchmarkTrader Full Version',
              'ea-pro-source': 'EA Pro + Source Code',
              'indicator-pro': 'Multi-Indicator Pro Pack',
              'course': 'Khóa học Forex Trading',
              'social-copy': 'Copy Social Trading',
            };
            const productName = productNames[productId] || 'EA ThebenchmarkTrader';
            
            await sendEmail({
              to: payerEmail,
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
                      <p><strong>Sản phẩm:</strong> ${productName}</p>
                      <p><strong>Phương thức:</strong> PayPal</p>
                      ${amount > 0 ? `<p><strong>Số tiền:</strong> ${(amount / 100).toLocaleString('vi-VN')}đ</p>` : ''}
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ThebenchmarkTrader.com'}/downloads?order=${orderId}&productId=${productId}" 
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
            
            console.log("Email sent successfully to:", payerEmail);
          } catch (emailError) {
            console.error("Error sending email:", emailError);
          }
        }
        
        return NextResponse.json({ success: true, message: "Order processed" });
      }
    }
    
    return NextResponse.json({ success: true, message: "Webhook received" });
  } catch (error: any) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
