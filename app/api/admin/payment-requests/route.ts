import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PaymentRequest from '@/lib/models/PaymentRequest';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

    // Get all payment requests with user info
    const paymentRequests = await PaymentRequest.find()
      .populate('userId', 'username email')
      .populate('processedBy', 'username')
      .sort({ createdAt: -1 })
      .lean();

    // Transform data to match frontend expectations
    const transformedRequests = paymentRequests.map((pr: any) => ({
      ...pr,
      user: pr.userId,
      userId: pr.userId?._id
    }));

    return NextResponse.json({
      paymentRequests: transformedRequests
    });

  } catch (error: any) {
    console.error('Error fetching payment requests:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
