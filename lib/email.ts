import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"EA Forex LeopardSmart" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error };
  }
}

// Email templates
export function getResetPasswordEmail(resetUrl: string, username: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Reset Mật Khẩu</h1>
        </div>
        <div class="content">
          <p>Xin chào <strong>${username}</strong>,</p>
          <p>Chúng tôi nhận được yêu cầu reset mật khẩu cho tài khoản của bạn.</p>
          <p>Click vào nút bên dưới để tạo mật khẩu mới:</p>
          <center>
            <a href="${resetUrl}" class="button">Reset Mật Khẩu</a>
          </center>
          <p><small>Hoặc copy link sau vào trình duyệt:<br>${resetUrl}</small></p>
          <p><strong>⏰ Link này sẽ hết hạn sau 1 giờ.</strong></p>
          <p>Nếu bạn không yêu cầu reset mật khẩu, vui lòng bỏ qua email này.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 EA Forex LeopardSmart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getWelcomeEmail(username: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Chào Mừng Đến Với EA Forex LeopardSmart!</h1>
        </div>
        <div class="content">
          <p>Xin chào <strong>${username}</strong>,</p>
          <p>Cảm ơn bạn đã đăng ký tài khoản với chúng tôi!</p>
          <p>Tài khoản của bạn đã được tạo thành công. Bạn có thể đăng nhập và bắt đầu sử dụng các dịch vụ của chúng tôi.</p>
          <h3>🎯 Bạn có thể làm gì tiếp theo?</h3>
          <ul>
            <li>✅ Xem các gói EA và bảng giá</li>
            <li>✅ Tham gia chương trình Affiliate</li>
            <li>✅ Xem kết quả giao dịch thực tế</li>
            <li>✅ Download EA Demo miễn phí</li>
          </ul>
          <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi!</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 EA Forex LeopardSmart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

