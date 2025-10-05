// Test SMTP Connection
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'baotong130277@gmail.com',
    pass: 'qrygefdqixvjjxrw', // Your App Password
  },
});

async function testEmail() {
  try {
    console.log('🔄 Testing SMTP connection...');
    
    const info = await transporter.sendMail({
      from: '"EA Forex LeopardSmart" <baotong130277@gmail.com>',
      to: 'truong.c0t04405@gmail.com', // Email from screenshot
      subject: 'Test Email from LeopardSmart',
      html: '<h1>✅ Email hoạt động rồi!</h1><p>Nếu bạn nhận được email này, SMTP đã được cấu hình đúng.</p>',
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

testEmail();
