import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { sendEmail } from "@/lib/email";
import { emailLocaleFromCountry } from "@/lib/customerLocale";
import { buildPurchaseEmail } from "@/lib/purchaseEmail";

export async function POST(request: NextRequest) {
  try {
    const { orderId, action, adminName, rejectionReason } = await request.json();

    // Validate input
    if (!orderId || !action || !adminName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find order
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Update order based on action
    if (action === 'approve') {
      order.status = 'paid';
      order.transferProofApproved = true;
      order.approvedBy = adminName;
      order.approvedAt = new Date();
      
      const locale = emailLocaleFromCountry(order.customerCountry);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://thebenchmarktrader.com";
      const amountValue = order.amount / 100;
      const receipt = buildPurchaseEmail({
        locale,
        orderId: order.orderId,
        productName: order.productName,
        amountLabel: locale === "vi"
          ? `${amountValue.toLocaleString("vi-VN")}đ`
          : `${amountValue.toLocaleString("en-US")} VND`,
        paymentMethod: "bank",
        downloadsUrl: `${siteUrl}/downloads?order=${encodeURIComponent(order.orderId)}&productId=${encodeURIComponent(order.productId || "")}`,
        isMt5: String(order.productId || "").toLowerCase().includes("mt5"),
      });

      await sendEmail({
        to: order.customerEmail,
        subject: receipt.subject,
        html: receipt.html,
      });

    } else if (action === 'reject') {
      order.status = 'rejected';
      order.transferProofApproved = false;
      order.rejectionReason = rejectionReason || 'Transfer proof not clear or incorrect';
      order.approvedBy = adminName;
      order.approvedAt = new Date();

      // Send rejection email
      const rejectionEmailSubject = `⚠️ Thanh toán cần xác minh lại - ${order.productName}`;
      const rejectionEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">⚠️ Cần xác minh</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; color: #1f2937;">Xin chào <strong>${order.customerName}</strong>,</p>
            
            <p style="font-size: 16px; color: #1f2937;">
              Chúng tôi đã xem xét đơn hàng của bạn (Mã: <strong>${order.orderId}</strong>) nhưng cần bạn cung cấp thêm thông tin.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #1f2937;"><strong>Lý do:</strong></p>
              <p style="margin: 10px 0 0 0; color: #1f2937;">${order.rejectionReason}</p>
            </div>
            
            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">📧 Liên hệ hỗ trợ:</h3>
              <p style="color: #1e293b; margin: 5px 0;">
                📧 Email: support@thebenchmarktrader.com
              </p>
              <p style="color: #1e293b; margin: 5px 0;">
                📱 Telegram Group: t.me/+0ETUdIuYUzdhZWQ1
              </p>
              <p style="color: #1e293b; margin: 5px 0;">
                📞 Hotline: +1925 582 0779
              </p>
            </div>
            
            <p style="color: #1f2937;">Chúng tôi sẽ hỗ trợ bạn nhanh nhất có thể!</p>
          </div>
          
          <div style="background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
            <p style="margin: 5px 0;">ThebenchmarkTrader - Forex EA Professional</p>
          </div>
        </div>
      `;

      await sendEmail({
        to: order.customerEmail,
        subject: rejectionEmailSubject,
        html: rejectionEmailHtml
      });
    }

    await order.save();

    console.log(`✅ Bank transfer order ${action}d:`, orderId);

    return NextResponse.json({
      success: true,
      message: `Order ${action}d successfully`
    });

  } catch (error: any) {
    console.error("Bank transfer approval error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

