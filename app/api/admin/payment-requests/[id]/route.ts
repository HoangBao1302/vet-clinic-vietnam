import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PaymentRequest from '@/lib/models/PaymentRequest';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';

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
