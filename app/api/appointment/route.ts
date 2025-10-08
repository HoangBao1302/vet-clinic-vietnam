import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, message } = body;

    // Basic validation
    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: "Họ tên, số điện thoại và email là bắt buộc" },
        { status: 400 }
      );
    }

    // Send email using Nodemailer
    const emailResult = await sendEmail({
      to: process.env.SMTP_FROM || 'support@ThebenchmarkTrader.com',
      subject: `Yêu cầu đặt lịch hẹn mới từ ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
            Yêu Cầu Đặt Lịch Hẹn Mới
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Thông Tin Khách Hàng</h3>
            <p><strong>Tên:</strong> ${name}</p>
            <p><strong>Điện thoại:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          
          ${message ? `
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #1e40af; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Lời Nhắn</h3>
            <p style="line-height: 1.6;">${message}</p>
          </div>
          ` : ''}
          
          <div style="background-color: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #dc2626; margin: 0; font-weight: bold;">
              ⚠️ Vui lòng liên hệ khách hàng trong vòng 24 giờ để xác nhận lịch hẹn.
            </p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Email này được gửi từ biểu mẫu đặt lịch hẹn trên website EA Forex ThebenchmarkTrader.
            </p>
          </div>
        </div>
      `,
    });

    if (!emailResult.success) {
      console.error("Email send error:", emailResult.error);
      return NextResponse.json(
        { error: "Không thể gửi email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Yêu cầu đặt lịch hẹn đã được gửi thành công" },
      { status: 200 }
    );

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống nội bộ" },
      { status: 500 }
    );
  }
} 