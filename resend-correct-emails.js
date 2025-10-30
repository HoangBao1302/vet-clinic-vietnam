// Resend correct emails to kiettong and haitong
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Get product download URL
function getDownloadUrl(productId) {
  const urls = {
    'ea-pro-source-mt4': 'https://thebenchmarktrader.com/downloads/ea-pro-source-mt4',
    'ea-full-mt4': 'https://thebenchmarktrader.com/downloads/ea-full-mt4',
    'ea-full-mt5': 'https://thebenchmarktrader.com/downloads/ea-full-mt5',
    'ea-pro-source-mt5': 'https://thebenchmarktrader.com/downloads/ea-pro-source-mt5',
    'indicator-pro-mt4': 'https://thebenchmarktrader.com/downloads/indicator-pro-mt4',
    'indicator-pro-mt5': 'https://thebenchmarktrader.com/downloads/indicator-pro-mt5',
  };
  return urls[productId] || 'https://thebenchmarktrader.com/downloads';
}

// Email template
function getEmailTemplate(customerName, productName, productId, orderId, amountVND, amountUSD) {
  const downloadUrl = getDownloadUrl(productId);
  const isMT5 = productId.includes('mt5');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0; }
    .success { background: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Xác nhận thanh toán thành công</h1>
    </div>
    
    <div class="content">
      <p>Xin chào <strong>${customerName}</strong>,</p>
      
      <div class="success">
        <h3>🎉 Cảm ơn bạn đã mua hàng!</h3>
        <p>Đơn hàng của bạn đã được xử lý thành công.</p>
      </div>
      
      <h3>📦 Thông tin đơn hàng:</h3>
      <p><strong>Sản phẩm:</strong> ${productName}</p>
      <p><strong>Mã đơn hàng:</strong> ${orderId}</p>
      <p><strong>Số tiền:</strong> ${amountVND.toLocaleString('vi-VN')}₫ (≈ $${amountUSD.toFixed(2)} USD)</p>
      <p><strong>Phương thức:</strong> PayPal</p>
      
      <div class="highlight">
        <h3>📥 DOWNLOAD SẢN PHẨM:</h3>
        <p><strong>Link download:</strong></p>
        <a href="${downloadUrl}" class="button">⬇️ DOWNLOAD NGAY</a>
        <p style="margin-top: 15px;"><small>Hoặc copy link: <code>${downloadUrl}</code></small></p>
      </div>
      
      <h3>📚 Hướng dẫn cài đặt ${isMT5 ? 'MT5' : 'MT4'}:</h3>
      <ol>
        <li>Tải file về máy tính</li>
        <li>Mở thư mục <strong>${isMT5 ? 'MQL5' : 'MQL4'}</strong> trong MetaTrader ${isMT5 ? '5' : '4'}</li>
        <li>Copy file vào thư mục tương ứng:
          <ul>
            <li>EA: <code>${isMT5 ? 'MQL5/Experts/' : 'MQL4/Experts/'}</code></li>
            <li>Indicator: <code>${isMT5 ? 'MQL5/Indicators/' : 'MQL4/Indicators/'}</code></li>
          </ul>
        </li>
        <li>Khởi động lại MetaTrader ${isMT5 ? '5' : '4'}</li>
        <li>Kéo thả EA/Indicator vào biểu đồ</li>
      </ol>
      
      ${productId.includes('source') ? `
      <div class="highlight">
        <h3>💻 Source Code:</h3>
        <p>Bạn đã mua gói bao gồm source code. File source (.mq${isMT5 ? '5' : '4'}) sẽ có trong thư mục download.</p>
        <p><strong>Lưu ý:</strong> Bạn có thể chỉnh sửa và biên dịch lại source code theo nhu cầu.</p>
      </div>
      ` : ''}
      
      <h3>📞 Hỗ trợ:</h3>
      <p>Nếu gặp vấn đề trong quá trình cài đặt hoặc sử dụng, vui lòng liên hệ:</p>
      <ul>
        <li>Email: support@thebenchmarktrader.com</li>
        <li>Telegram: @TheBenchmarkTrader</li>
      </ul>
      
      <div class="success">
        <p><strong>🎁 Chúc bạn giao dịch thành công!</strong></p>
      </div>
    </div>
    
    <div class="footer">
      <p>© 2024 TheBenchmarkTrader. All rights reserved.</p>
      <p>Email này được gửi tự động, vui lòng không reply.</p>
    </div>
  </div>
</body>
</html>
  `;
}

async function sendEmails() {
  console.log('📧 Starting email resend process...\n');

  // Kiettong order
  const kietOrder = {
    customerName: 'Kiet Tong',
    customerEmail: 'kietdangtong0812@gmail.com',
    productId: 'ea-pro-source-mt4',
    productName: 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
    orderId: '96K95691P40465515',
    amountVND: 14900000,
    amountUSD: 620.83,
  };

  // Haitong order
  const haiOrder = {
    customerName: 'Hai Tong',
    customerEmail: 'haidangtong2612@gmail.com',
    productId: 'ea-full-mt4',
    productName: 'EA ThebenchmarkTrader Full Version (MT4)',
    orderId: '0P865189JG6525712',
    amountVND: 7900000,
    amountUSD: 329.17,
  };

  // Send to Kiettong
  console.log('════════════════════════════════════════════════════════════════════════════════');
  console.log('📧 Sending email to KIETTONG...');
  console.log('════════════════════════════════════════════════════════════════════════════════\n');
  
  try {
    const kietEmailHtml = getEmailTemplate(
      kietOrder.customerName,
      kietOrder.productName,
      kietOrder.productId,
      kietOrder.orderId,
      kietOrder.amountVND,
      kietOrder.amountUSD
    );

    const kietMailOptions = {
      from: `"TheBenchmarkTrader" <${process.env.SMTP_USER}>`,
      to: kietOrder.customerEmail,
      subject: `✅ Xác nhận đơn hàng #${kietOrder.orderId} - ${kietOrder.productName}`,
      html: kietEmailHtml,
    };

    await transporter.sendMail(kietMailOptions);
    console.log('✅ Email sent to kiettong successfully!');
    console.log(`   To: ${kietOrder.customerEmail}`);
    console.log(`   Product: ${kietOrder.productName}`);
    console.log(`   Amount: ${kietOrder.amountVND.toLocaleString('vi-VN')}đ\n`);
  } catch (error) {
    console.error('❌ Failed to send email to kiettong:', error.message);
  }

  // Send to Haitong
  console.log('════════════════════════════════════════════════════════════════════════════════');
  console.log('📧 Sending email to HAITONG...');
  console.log('════════════════════════════════════════════════════════════════════════════════\n');
  
  try {
    const haiEmailHtml = getEmailTemplate(
      haiOrder.customerName,
      haiOrder.productName,
      haiOrder.productId,
      haiOrder.orderId,
      haiOrder.amountVND,
      haiOrder.amountUSD
    );

    const haiMailOptions = {
      from: `"TheBenchmarkTrader" <${process.env.SMTP_USER}>`,
      to: haiOrder.customerEmail,
      subject: `✅ Xác nhận đơn hàng #${haiOrder.orderId} - ${haiOrder.productName}`,
      html: haiEmailHtml,
    };

    await transporter.sendMail(haiMailOptions);
    console.log('✅ Email sent to haitong successfully!');
    console.log(`   To: ${haiOrder.customerEmail}`);
    console.log(`   Product: ${haiOrder.productName}`);
    console.log(`   Amount: ${haiOrder.amountVND.toLocaleString('vi-VN')}đ\n`);
  } catch (error) {
    console.error('❌ Failed to send email to haitong:', error.message);
  }

  console.log('════════════════════════════════════════════════════════════════════════════════');
  console.log('✅ ALL EMAILS SENT!');
  console.log('════════════════════════════════════════════════════════════════════════════════\n');

  console.log('📋 Summary:');
  console.log(`   - Kiettong: ${kietOrder.productName} - ${kietOrder.amountVND.toLocaleString('vi-VN')}đ`);
  console.log(`   - Haitong: ${haiOrder.productName} - ${haiOrder.amountVND.toLocaleString('vi-VN')}đ\n`);
}

sendEmails();

