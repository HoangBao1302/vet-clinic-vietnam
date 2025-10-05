import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';
import { sendEmail, getAffiliateApprovalEmail, getAffiliateRejectionEmail, getMembershipUpgradeEmail } from '@/lib/email';

function checkAdmin(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1];
  
  if (!token) {
    return { authorized: false, message: 'Không có token' };
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    return { authorized: false, message: 'Token không hợp lệ' };
  }

  if (decoded.role !== 'admin') {
    return { authorized: false, message: 'Không có quyền truy cập' };
  }

  return { authorized: true, userId: decoded.userId };
}

// GET single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = checkAdmin(request);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: 403 }
      );
    }

    await connectDB();
    
    const { id } = await params;
    const user = await User.findById(id).select('-password -resetPasswordToken');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy user' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi', error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = checkAdmin(request);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: 403 }
      );
    }

    await connectDB();

    const { username, email, role, isActive, password, affiliateStatus, isPaid, membershipTier } = await request.json();
    
    const { id } = await params;
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy user' },
        { status: 404 }
      );
    }

    // Track changes for email notifications
    const oldAffiliateStatus = user.affiliateStatus;
    const oldIsPaid = user.isPaid;

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (password) user.password = password; // Will be hashed by pre-save hook
    if (affiliateStatus) user.affiliateStatus = affiliateStatus;
    if (isPaid !== undefined) user.isPaid = isPaid;
    if (membershipTier) user.membershipTier = membershipTier;

    // Generate affiliate code if approved
    if (affiliateStatus === 'approved' && !user.affiliateCode) {
      user.affiliateCode = `AFF${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    }

    await user.save();

    // Send email notifications
    try {
      // Affiliate approved
      if (affiliateStatus === 'approved' && oldAffiliateStatus !== 'approved') {
        await sendEmail({
          to: user.email,
          subject: '🎊 Chúc mừng! Affiliate Application đã được duyệt!',
          html: getAffiliateApprovalEmail(user.username, user.affiliateCode!),
        });
      }

      // Affiliate rejected
      if (affiliateStatus === 'rejected' && oldAffiliateStatus !== 'rejected') {
        await sendEmail({
          to: user.email,
          subject: 'Thông báo về Affiliate Application',
          html: getAffiliateRejectionEmail(user.username),
        });
      }

      // Membership upgraded
      if (isPaid && !oldIsPaid) {
        await sendEmail({
          to: user.email,
          subject: '👑 Chào mừng Paid Member!',
          html: getMembershipUpgradeEmail(user.username),
        });
      }
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Don't fail the update if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Cập nhật user thành công',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        affiliateStatus: user.affiliateStatus,
        affiliateCode: user.affiliateCode,
        isPaid: user.isPaid,
        membershipTier: user.membershipTier,
      },
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = checkAdmin(request);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: 403 }
      );
    }

    await connectDB();
    
    const { id } = await params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy user' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Xóa user thành công',
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi', error: error.message },
      { status: 500 }
    );
  }
}

