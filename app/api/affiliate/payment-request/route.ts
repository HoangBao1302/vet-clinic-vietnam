import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PaymentRequest from '@/lib/models/PaymentRequest';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Get user
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if user is approved affiliate
    if (user.affiliateStatus !== 'approved') {
      return NextResponse.json({ 
        message: 'Only approved affiliates can request payments' 
      }, { status: 403 });
    }

    const body = await request.json();
    const { amount, paymentMethod, bankInfo, paypalEmail } = body;

    // Validate amount
    if (!amount || amount < 500000) {
      return NextResponse.json({ 
        message: 'Minimum withdrawal amount is 500,000 VND' 
      }, { status: 400 });
    }

    // Validate payment method specific fields
    if (paymentMethod === 'bank_transfer') {
      if (!bankInfo?.accountNumber || !bankInfo?.bankName || !bankInfo?.accountHolderName) {
        return NextResponse.json({ 
          message: 'Bank transfer requires account number, bank name, and account holder name' 
        }, { status: 400 });
      }
    } else if (paymentMethod === 'paypal') {
      if (!paypalEmail) {
        return NextResponse.json({ 
          message: 'PayPal email is required' 
        }, { status: 400 });
      }
    } else {
      return NextResponse.json({ 
        message: 'Invalid payment method' 
      }, { status: 400 });
    }

    // Check if user has pending payment request
    const existingRequest = await PaymentRequest.findOne({
      userId: user._id,
      status: 'pending'
    });

    if (existingRequest) {
      return NextResponse.json({ 
        message: 'You already have a pending payment request' 
      }, { status: 400 });
    }

    // Create payment request
    const paymentRequest = new PaymentRequest({
      userId: user._id,
      affiliateCode: user.affiliateCode,
      amount,
      paymentMethod,
      bankInfo: paymentMethod === 'bank_transfer' ? bankInfo : undefined,
      paypalEmail: paymentMethod === 'paypal' ? paypalEmail : undefined,
      status: 'pending'
    });

    await paymentRequest.save();

    return NextResponse.json({
      message: 'Payment request submitted successfully',
      requestId: paymentRequest._id
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating payment request:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Get user
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if user is approved affiliate
    if (user.affiliateStatus !== 'approved') {
      return NextResponse.json({ 
        message: 'Only approved affiliates can view payment requests' 
      }, { status: 403 });
    }

    // Get user's payment requests
    const paymentRequests = await PaymentRequest.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .select('-bankInfo.accountNumber'); // Don't return sensitive bank info

    return NextResponse.json({
      paymentRequests
    });

  } catch (error: any) {
    console.error('Error fetching payment requests:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
