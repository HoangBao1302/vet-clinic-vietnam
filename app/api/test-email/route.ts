import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message } = await request.json();

    if (!to) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    console.log("🧪 Testing email system...");
    console.log("📧 SMTP_USER:", process.env.SMTP_USER);
    console.log("📧 SMTP_HOST:", process.env.SMTP_HOST);
    console.log("📧 SMTP_PORT:", process.env.SMTP_PORT);
    console.log("📧 SMTP_PASS length:", process.env.SMTP_PASS?.length);
    console.log("📧 SMTP_FROM:", process.env.SMTP_FROM);

    const result = await sendEmail({
      to,
      subject: subject || "🧪 Test Email từ EA ThebenchmarkTrader",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px;">🧪 Test Email</h1>
          </div>
          
          <div style="padding: 40px 20px; background: #f8f9fa;">
            <h2 style="color: #333;">Email System Test</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Thời gian:</strong> ${new Date().toLocaleString("vi-VN")}</p>
              <p><strong>Email đến:</strong> ${to}</p>
              <p><strong>Trạng thái:</strong> ✅ Email được gửi thành công!</p>
            </div>
            
            ${message ? `
            <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">Tin nhắn:</h3>
              <p style="color: #1e3a8a;">${message}</p>
            </div>
            ` : ''}
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">📋 Thông tin hệ thống:</h3>
              <ul style="color: #1e3a8a; margin: 10px 0; padding-left: 20px;">
                <li>SMTP Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}</li>
                <li>SMTP Port: ${process.env.SMTP_PORT || '587'}</li>
                <li>SMTP User: ${process.env.SMTP_USER || 'baotong130277@gmail.com'}</li>
                <li>SMTP From: ${process.env.SMTP_FROM || 'support@ThebenchmarkTrader.com'}</li>
              </ul>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
            <p>EA Forex ThebenchmarkTrader<br>© 2025 All rights reserved</p>
          </div>
        </div>
      `,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
        messageId: result.messageId,
        debug: {
          smtpUser: process.env.SMTP_USER,
          smtpHost: process.env.SMTP_HOST,
          smtpPort: process.env.SMTP_PORT,
          smtpPassLength: process.env.SMTP_PASS?.length,
          smtpFrom: process.env.SMTP_FROM,
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "Failed to send email",
        details: result.error,
        debug: {
          smtpUser: process.env.SMTP_USER,
          smtpHost: process.env.SMTP_HOST,
          smtpPort: process.env.SMTP_PORT,
          smtpPassLength: process.env.SMTP_PASS?.length,
          smtpFrom: process.env.SMTP_FROM,
        }
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Test email error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      debug: {
        smtpUser: process.env.SMTP_USER,
        smtpHost: process.env.SMTP_HOST,
        smtpPort: process.env.SMTP_PORT,
        smtpPassLength: process.env.SMTP_PASS?.length,
        smtpFrom: process.env.SMTP_FROM,
      }
    }, { status: 500 });
  }
}
