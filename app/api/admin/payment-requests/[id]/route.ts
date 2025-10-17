import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PaymentRequest from '@/lib/models/PaymentRequest';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const adminUser = await User.findById(decoded.userId).select('-password');
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, adminNotes, rejectionReason } = body;

    // Validate status
    if (!['pending', 'approved', 'rejected', 'paid'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    // Find payment request
    const paymentRequest = await PaymentRequest.findById(id);
    if (!paymentRequest) {
      return NextResponse.json({ message: 'Payment request not found' }, { status: 404 });
    }

    console.log('Processing payment request:', {
      requestId: id,
      currentStatus: paymentRequest.status,
      newStatus: status,
      amount: paymentRequest.amount
    });

    // Update payment request
    const updateData: any = {
      status,
      processedAt: new Date(),
      processedBy: adminUser._id,
    };

    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedRequest = await PaymentRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('userId', 'username email');

    // If status is 'paid', update user's commission and send email
    console.log('Checking if should process payment:', {
      newStatus: status,
      oldStatus: paymentRequest.status,
      shouldProcess: status === 'paid' && paymentRequest.status !== 'paid'
    });

    if (status === 'paid' && paymentRequest.status !== 'paid') {
      const affiliateUser = await User.findById(paymentRequest.userId);
      
      if (affiliateUser) {
        console.log('Processing payment for affiliate:', {
          userId: affiliateUser._id,
          username: affiliateUser.username,
          currentPaid: affiliateUser.totalCommissionPaid || 0,
          amountToAdd: paymentRequest.amount,
          newTotal: (affiliateUser.totalCommissionPaid || 0) + paymentRequest.amount
        });

        // Update user's total commission paid
        affiliateUser.totalCommissionPaid = (affiliateUser.totalCommissionPaid || 0) + paymentRequest.amount;
        await affiliateUser.save();

        console.log('User commission updated successfully');

        // Send email notification
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #16a34a 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .amount { font-size: 32px; font-weight: bold; color: #16a34a; text-align: center; margin: 20px 0; }
              .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a; }
              .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
              .button { display: inline-block; background: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Chúc Mừng!</h1>
                <p>Bạn Đã Nhận Thanh Toán Hoa Hồng</p>
              </div>
              <div class="content">
                <p>Xin chào <strong>${affiliateUser.username}</strong>,</p>
                
                <p>Chúng tôi vui mừng thông báo rằng yêu cầu thanh toán hoa hồng của bạn đã được xử lý thành công!</p>
                
                <div class="amount">
                  ${paymentRequest.amount.toLocaleString('vi-VN')} VNĐ
                </div>
                
                <div class="info-box">
                  <h3>📋 Thông Tin Thanh Toán</h3>
                  <p><strong>Mã Affiliate:</strong> ${affiliateUser.affiliateCode}</p>
                  <p><strong>Số tiền:</strong> ${paymentRequest.amount.toLocaleString('vi-VN')} VNĐ</p>
                  <p><strong>Phương thức:</strong> ${paymentRequest.paymentMethod === 'bank_transfer' ? 'Chuyển khoản ngân hàng' : 'PayPal'}</p>
                  ${paymentRequest.paymentMethod === 'bank_transfer' && paymentRequest.bankInfo ? `
                    <p><strong>Ngân hàng:</strong> ${paymentRequest.bankInfo.bankName}</p>
                    <p><strong>Chủ tài khoản:</strong> ${paymentRequest.bankInfo.accountHolderName}</p>
                  ` : ''}
                  ${paymentRequest.paymentMethod === 'paypal' && paymentRequest.paypalEmail ? `
                    <p><strong>PayPal Email:</strong> ${paymentRequest.paypalEmail}</p>
                  ` : ''}
                  <p><strong>Ngày xử lý:</strong> ${new Date().toLocaleDateString('vi-VN')}</p>
                </div>
                
                <div class="info-box">
                  <h3>💰 Thống Kê Hoa Hồng</h3>
                  <p><strong>Tổng hoa hồng đã kiếm:</strong> ${(affiliateUser.totalCommissionEarned || 0).toLocaleString('vi-VN')} VNĐ</p>
                  <p><strong>Tổng đã thanh toán:</strong> ${(affiliateUser.totalCommissionPaid || 0).toLocaleString('vi-VN')} VNĐ</p>
                  <p><strong>Còn lại chưa rút:</strong> ${((affiliateUser.totalCommissionEarned || 0) - (affiliateUser.totalCommissionPaid || 0)).toLocaleString('vi-VN')} VNĐ</p>
                </div>
                
                <p style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL}/affiliate/dashboard" class="button">
                    Xem Dashboard
                  </a>
                </p>
                
                <p>Cảm ơn bạn đã là đối tác affiliate của chúng tôi! Chúng tôi đánh giá cao sự cống hiến của bạn.</p>
                
                <p>Tiếp tục phát triển và kiếm thêm nhiều hoa hồng nhé! 🚀</p>
              </div>
              <div class="footer">
                <p>EA Forex ThebenchmarkTrader</p>
                <p>Email: support@thebenchmarktrader.com | Phone: +84 765 452 515</p>
                <p>&copy; 2024 EA Forex ThebenchmarkTrader. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;

        try {
          console.log('Sending payment notification email to:', affiliateUser.email);
          await sendEmail({
            to: affiliateUser.email,
            subject: '🎉 Chúc Mừng! Bạn Đã Nhận Thanh Toán Hoa Hồng',
            html: emailHtml,
          });
          console.log('Email sent successfully');
        } catch (emailError) {
          console.error('Failed to send payment notification email:', emailError);
          // Don't fail the request if email fails
        }
      } else {
        console.error('Affiliate user not found for payment request');
      }
    }

    return NextResponse.json({
      message: 'Payment request updated successfully',
      paymentRequest: updatedRequest
    });

  } catch (error: any) {
    console.error('Error updating payment request:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
