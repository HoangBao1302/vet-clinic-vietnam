import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("PayPal webhook received:", body);
    
    // Check if this is a payment completion event
    if (body.event_type === "CHECKOUT.ORDER.APPROVED") {
      const orderId = body.resource?.id;
      const payerEmail = body.resource?.payer?.email_address;
      const payerName = body.resource?.payer?.name;
      
      if (orderId) {
        console.log("PayPal order approved:", {
          orderId,
          payerEmail,
          payerName: `${payerName?.given_name || ''} ${payerName?.surname || ''}`.trim()
        });
        
        // Create order record
        const order = {
          orderId: orderId,
          status: "paid",
          customerEmail: payerEmail,
          customerName: `${payerName?.given_name || ''} ${payerName?.surname || ''}`.trim(),
          amount: 0, // Will be updated when captured
          createdAt: new Date().toISOString(),
          paidAt: new Date().toISOString(),
          paymentMethod: "paypal",
        };
        
        console.log("Order created:", order);
        
        // Send email notification
        if (payerEmail) {
          try {
            const { sendEmail } = await import("@/lib/email");
            
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
                      <p><strong>Sản phẩm:</strong> EA ThebenchmarkTrader Full Version</p>
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
