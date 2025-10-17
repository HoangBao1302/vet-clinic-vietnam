import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PaymentRequest from '@/lib/models/PaymentRequest';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Calculate total paid from all paid payment requests
    const paidRequests = await PaymentRequest.find({
      userId: userId,
      status: 'paid'
    });

    const totalPaid = paidRequests.reduce((sum, req) => sum + req.amount, 0);

    console.log('Reset commission for user:', {
      userId,
      username: user.username,
      oldPaid: user.totalCommissionPaid,
      newPaid: totalPaid,
      paidRequestsCount: paidRequests.length,
      requests: paidRequests.map(r => ({ amount: r.amount, createdAt: r.createdAt }))
    });

    // Update user
    user.totalCommissionPaid = totalPaid;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Commission reset successfully',
      data: {
        userId: user._id,
        username: user.username,
        oldPaid: user.totalCommissionPaid,
        newPaid: totalPaid,
        paidRequestsCount: paidRequests.length,
        paidRequests: paidRequests.map(r => ({
          id: r._id,
          amount: r.amount,
          paymentMethod: r.paymentMethod,
          processedAt: r.processedAt
        }))
      }
    });

  } catch (error: any) {
    console.error('Error resetting commission:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
