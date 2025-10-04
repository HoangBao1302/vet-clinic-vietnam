import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';

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

    const { username, email, role, isActive, password } = await request.json();
    
    const { id } = await params;
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy user' },
        { status: 404 }
      );
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (password) user.password = password; // Will be hashed by pre-save hook

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Cập nhật user thành công',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
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

