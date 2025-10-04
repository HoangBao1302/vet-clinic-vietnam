import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';

// Middleware to check admin role
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

// GET all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    const authCheck = checkAdmin(request);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const isActive = searchParams.get('isActive');

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) {
      query.role = role;
    }

    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const users = await User.find(query)
      .select('-password -resetPasswordToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi', error: error.message },
      { status: 500 }
    );
  }
}

// CREATE new user (Admin only)
export async function POST(request: NextRequest) {
  try {
    const authCheck = checkAdmin(request);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: 403 }
      );
    }

    await connectDB();

    const { username, email, password, role } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email hoặc username đã tồn tại' },
        { status: 400 }
      );
    }

    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Tạo user thành công',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi', error: error.message },
      { status: 500 }
    );
  }
}

