import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { sendEmail } from "@/lib/email";

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
      
      // Send approval email
      const approvalEmailSubject = `✅ Thanh toán đã được xác nhận - ${order.productName}`;
      const approvalEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">✅ Thanh toán thành công!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; color: #1f2937;">Xin chào <strong>${order.customerName}</strong>,</p>
            
            <p style="font-size: 16px; color: #1f2937;">Chúng tôi xác nhận đã nhận được thanh toán của bạn. Đơn hàng đã được kích hoạt!</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <p style="margin: 0; color: #1f2937;"><strong>Mã đơn hàng:</strong> ${order.orderId}</p>
              <p style="margin: 0; color: #1f2937;"><strong>Sản phẩm:</strong> ${order.productName}</p>
              <p style="margin: 0; color: #1f2937;"><strong>Số tiền:</strong> ${(order.amount / 100).toLocaleString('vi-VN')}đ</p>
              <p style="margin: 0; color: #1f2937;"><strong>Phương thức:</strong> Chuyển khoản ngân hàng</p>
            </div>
            
            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">📥 Tải sản phẩm ngay:</h3>
              <p style="color: #1e293b;">
                Sử dụng mã đơn hàng trên để tải xuống tại trang Downloads.
              </p>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://thebenchmarktrader.com'}/downloads" 
                 style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
                Tải xuống ngay →
              </a>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e;">
                <strong>💡 Lưu ý:</strong> Quý khách có thể sử dụng mã đơn hàng này để tải lại sản phẩm bất cứ lúc nào trong tương lai.
              </p>
            </div>
          </div>
          
          <div style="background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
            <p style="margin: 5px 0;">Cảm ơn bạn đã tin tưởng ThebenchmarkTrader</p>
            <p style="margin: 5px 0;">Hỗ trợ: support@thebenchmarktrader.com | Telegram: t.me/+0ETUdIuYUzdhZWQ1</p>
          </div>
        </div>
      `;

      await sendEmail({
        to: order.customerEmail,
        subject: approvalEmailSubject,
        html: approvalEmailHtml
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
                📞 Hotline: +84 765 452 515
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

