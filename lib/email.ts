import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'baotong130277@gmail.com', // Use original Gmail account for auth
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  // Optimize for faster delivery
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 20000, // 20 seconds
  rateLimit: 5, // max 5 emails per rateDelta
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000, // 30 seconds
  socketTimeout: 60000, // 60 seconds
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    // Debug logging
    console.log('📧 Attempting to send email...');
    console.log('📧 SMTP_USER:', process.env.SMTP_USER);
    console.log('📧 SMTP_HOST:', process.env.SMTP_HOST);
    console.log('📧 SMTP_PORT:', process.env.SMTP_PORT);
    console.log('📧 To:', to);
    console.log('📧 From:', process.env.SMTP_FROM || 'support@ThebenchmarkTrader.com');
    
    const startTime = Date.now();
    
    const info = await transporter.sendMail({
      from: `"EA Forex ThebenchmarkTrader" <${process.env.SMTP_FROM || 'support@ThebenchmarkTrader.com'}>`,
      to,
      subject,
      html,
      // Add priority for faster delivery
      priority: 'high',
      // Add headers for better deliverability
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    });

    const deliveryTime = Date.now() - startTime;
    console.log(`✅ Email sent successfully in ${deliveryTime}ms:`, info.messageId);
    return { success: true, messageId: info.messageId, deliveryTime };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    console.error('❌ SMTP_USER:', process.env.SMTP_USER);
    console.error('❌ SMTP_PASS length:', process.env.SMTP_PASS?.length);
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
          <p>&copy; 2024 EA Forex ThebenchmarkTrader. All rights reserved.</p>
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
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Chào Mừng Đến Với EA Forex ThebenchmarkTrader!</h1>
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
          <center>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ThebenchmarkTrader.com'}/profile" class="button">Xem Tài Khoản Của Bạn</a>
          </center>
          <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi!</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 EA Forex ThebenchmarkTrader. All rights reserved.</p>
          <p>Email này được gửi từ hệ thống tự động. Vui lòng không reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Email verification template
export function getEmailVerificationEmail(verifyUrl: string, username: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Xác Thực Email Của Bạn</h1>
        </div>
        <div class="content">
          <p>Xin chào <strong>${username}</strong>,</p>
          <p>Cảm ơn bạn đã đăng ký tài khoản!</p>
          
          <div class="warning">
            <p><strong>⚠️ Vui lòng xác thực email để:</strong></p>
            <ul style="margin: 10px 0;">
              <li>Download EA Demo miễn phí</li>
              <li>Truy cập đầy đủ tính năng</li>
              <li>Nhận thông báo quan trọng</li>
            </ul>
          </div>

          <p>Click vào nút bên dưới để xác thực email của bạn:</p>
          <center>
            <a href="${verifyUrl}" class="button">Xác Thực Email Ngay</a>
          </center>
          
          <p><small>Hoặc copy link sau vào trình duyệt:<br>${verifyUrl}</small></p>
          
          <p><strong>⏰ Link này sẽ hết hạn sau 24 giờ.</strong></p>
          
          <p>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 EA Forex ThebenchmarkTrader. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Affiliate approval email
export function getAffiliateApprovalEmail(username: string, affiliateCode: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .code-box { background: #fff; border: 2px dashed #10b981; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; }
        .code { font-size: 24px; font-weight: bold; color: #10b981; font-family: monospace; }
        .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎊 Chúc Mừng! Affiliate Application Đã Được Duyệt!</h1>
        </div>
        <div class="content">
          <p>Xin chào <strong>${username}</strong>,</p>
          <p>Chúng tôi rất vui mừng thông báo rằng đơn đăng ký Affiliate của bạn đã được <strong>PHÊ DUYỆT</strong>!</p>
          
          <div class="code-box">
            <p style="margin: 0 0 10px 0; color: #666;">Mã Affiliate của bạn:</p>
            <div class="code">${affiliateCode}</div>
          </div>

          <h3>💰 Hoa Hồng Của Bạn:</h3>
          <ul>
            <li><strong>30%</strong> - Bán EA</li>
            <li><strong>25%</strong> - Bán Khóa Học</li>
            <li><strong>10%</strong> - Copy Social (recurring)</li>
          </ul>

          <h3>🚀 Bắt Đầu Kiếm Tiền:</h3>
          <ol>
            <li>Chia sẻ link affiliate của bạn</li>
            <li>Khi có người mua qua link của bạn</li>
            <li>Bạn nhận hoa hồng tự động</li>
          </ol>

          <center>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ThebenchmarkTrader.com'}/profile" class="button">Xem Dashboard</a>
          </center>

          <p><strong>Lưu ý:</strong> Hoa hồng sẽ được thanh toán vào cuối mỗi tháng qua chuyển khoản ngân hàng.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 EA Forex ThebenchmarkTrader. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Affiliate rejection email
export function getAffiliateRejectionEmail(username: string, reason?: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thông Báo Về Affiliate Application</h1>
        </div>
        <div class="content">
          <p>Xin chào <strong>${username}</strong>,</p>
          <p>Cảm ơn bạn đã quan tâm đến chương trình Affiliate của chúng tôi.</p>
          <p>Rất tiếc, đơn đăng ký của bạn chưa được chấp nhận lúc này.</p>
          
          ${reason ? `<p><strong>Lý do:</strong> ${reason}</p>` : ''}

          <p>Bạn có thể:</p>
          <ul>
            <li>Tích lũy thêm kinh nghiệm trong lĩnh vực Forex</li>
            <li>Xây dựng audience/community lớn hơn</li>
            <li>Đăng ký lại sau 3 tháng</li>
          </ul>

          <center>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ThebenchmarkTrader.com'}/referral" class="button">Tìm Hiểu Thêm</a>
          </center>

          <p>Nếu có thắc mắc, vui lòng liên hệ support@thebenchmarktrader.com</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 EA Forex ThebenchmarkTrader. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Membership upgrade email
export function getMembershipUpgradeEmail(username: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .feature { background: #fff; padding: 15px; margin: 10px 0; border-left: 4px solid #f59e0b; }
        .button { display: inline-block; padding: 12px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>👑 Chào Mừng Paid Member!</h1>
        </div>
        <div class="content">
          <p>Xin chào <strong>${username}</strong>,</p>
          <p>Chúc mừng! Tài khoản của bạn đã được nâng cấp lên <strong>Paid Member</strong>!</p>
          
          <h3>🎁 Quyền Lợi Của Bạn:</h3>
          
          <div class="feature">
            <strong>📥 Unlimited Downloads</strong>
            <p>Download không giới hạn EA Demo và Indicators</p>
          </div>

          <div class="feature">
            <strong>📰 Unlimited Premium Posts</strong>
            <p>Đọc tất cả bài phân tích Premium không giới hạn</p>
          </div>

          <div class="feature">
            <strong>🎓 Exclusive Content</strong>
            <p>Truy cập khóa học và tài liệu độc quyền</p>
          </div>

          <div class="feature">
            <strong>💬 Priority Support</strong>
            <p>Hỗ trợ ưu tiên 24/7</p>
          </div>

          <center>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ThebenchmarkTrader.com'}/profile" class="button">Khám Phá Ngay</a>
          </center>

          <p>Cảm ơn bạn đã tin tưởng EA Forex ThebenchmarkTrader!</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 EA Forex ThebenchmarkTrader. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

