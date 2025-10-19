import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import PaymentRequest from '@/lib/models/PaymentRequest';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug Commission API called');
    
    // Verify admin access
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get current user to check if admin
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all affiliate users
    const affiliateUsers = await User.find({ 
      affiliateCode: { $exists: true, $ne: null },
      affiliateStatus: 'approved'
    }).select('email affiliateCode totalCommissionEarned totalCommissionPaid');

    console.log(`📊 Found ${affiliateUsers.length} approved affiliate users`);

    const results = [];

    for (const user of affiliateUsers) {
      console.log(`👤 Processing user: ${user.email}`);

      // Calculate actual paid amount from PaymentRequest
      const paidRequests = await PaymentRequest.find({
        userId: user._id,
        status: 'paid'
      });

      const actualPaid = paidRequests.reduce((sum, request) => sum + request.amount, 0);
      const storedPaid = user.totalCommissionPaid || 0;
      const storedEarned = user.totalCommissionEarned || 0;

      const userResult = {
        email: user.email,
        affiliateCode: user.affiliateCode,
        storedEarned,
        storedPaid,
        actualPaid,
        discrepancy: Math.abs(storedPaid - actualPaid),
        paymentRequestsCount: paidRequests.length,
        paymentRequests: paidRequests.map(req => ({
          amount: req.amount,
          method: req.paymentMethod,
          date: req.createdAt,
          status: req.status
        }))
      };

      results.push(userResult);

      console.log(`   Stored Paid: ${storedPaid.toLocaleString('vi-VN')}đ`);
      console.log(`   Actual Paid: ${actualPaid.toLocaleString('vi-VN')}đ`);
      console.log(`   Discrepancy: ${userResult.discrepancy.toLocaleString('vi-VN')}đ`);
    }

    return NextResponse.json({
      success: true,
      totalUsers: results.length,
      users: results,
      summary: {
        usersWithDiscrepancy: results.filter(r => r.discrepancy > 0).length,
        totalDiscrepancy: results.reduce((sum, r) => sum + r.discrepancy, 0)
      }
    });

  } catch (error: any) {
    console.error('Error in debug commission API:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
