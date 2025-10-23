import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const db = await connectDB();
    
    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Database không khả dụng' },
        { status: 503 }
      );
    }

    // Get token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Không có token xác thực' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { message: 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    const {
      fullName,
      phone,
      company,
      website,
      experience,
      audience,
      promochannel,
      reason,
    } = await request.json();

    // Get user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { message: 'User không tồn tại' },
        { status: 404 }
      );
    }

    // Check if already applied
    if (user.affiliateStatus && user.affiliateStatus !== 'none' && user.affiliateStatus !== 'rejected') {
      return NextResponse.json(
        { message: 'Bạn đã đăng ký affiliate rồi' },
        { status: 400 }
      );
    }

    // Generate unique affiliate code
    const affiliateCode = `AFF-${user.username.toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // Update user
    user.affiliateStatus = 'pending';
    user.affiliateCode = affiliateCode;
    
    // Store application data (you might want to create a separate AffiliateApplication model)
    // For now, we'll just update the user status
    
    await user.save();

    // Send confirmation email to user
    try {
      const { sendEmail } = await import("@/lib/email");
      
      await sendEmail({
        to: user.email,
        subject: "✅ Đăng ký Affiliate thành công - EA ThebenchmarkTrader",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px;">✅ Đăng Ký Thành Công!</h1>
            </div>
            
            <div style="padding: 40px 20px; background: #f8f9fa;">
              <h2 style="color: #333;">Cảm ơn bạn đã đăng ký Affiliate!</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Mã đơn đăng ký:</strong> ${affiliateCode}</p>
                <p><strong>Trạng thái:</strong> Đang chờ duyệt</p>
                <p><strong>Thời gian:</strong> ${new Date().toLocaleString("vi-VN")}</p>
              </div>
              
              <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">📋 Bước tiếp theo:</h3>
                <ol style="color: #1e3a8a; margin: 10px 0; padding-left: 20px;">
                  <li>Kiểm tra email để nhận thông báo</li>
                  <li>Chuẩn bị tài liệu (nếu cần)</li>
                  <li>Chờ admin liên hệ trong vòng 1-2 ngày làm việc</li>
                </ol>
              </div>
              
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">💰 Hoa hồng của bạn:</h3>
                <ul style="color: #1e3a8a; margin: 10px 0; padding-left: 20px;">
                  <li><strong>30%</strong> - Bán EA</li>
                  <li><strong>25%</strong> - Bán Khóa Học</li>
                  <li><strong>10%</strong> - Copy Social (recurring)</li>
                </ul>
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
    } catch (emailError) {
      console.error("Error sending affiliate confirmation email:", emailError);
      // Don't fail the application if email fails
    }

    // TODO: Send email notification to admin about new affiliate application

    return NextResponse.json({
      message: 'Đăng ký thành công',
      affiliateStatus: 'pending',
      affiliateCode,
    });
  } catch (error: any) {
    console.error('Affiliate apply error:', error);
    return NextResponse.json(
      { message: 'Lỗi server', error: error.message },
      { status: 500 }
    );
  }
}

