import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

// Temporary endpoint to promote first user to admin
// TODO: Remove this after creating first admin
export async function POST(request: NextRequest) {
  try {
    const { email, secretKey } = await request.json();

    // Simple security check
    if (secretKey !== 'PROMOTE_ADMIN_2024') {
      return NextResponse.json(
        { success: false, message: 'Invalid secret key' },
        { status: 403 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role === 'admin') {
      return NextResponse.json(
        { success: true, message: 'User is already an admin' }
      );
    }

    user.role = 'admin';
    await user.save();

    return NextResponse.json({
      success: true,
      message: `${user.username} has been promoted to admin!`,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Promote admin error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
