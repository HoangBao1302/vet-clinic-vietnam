import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const affiliateCode = searchParams.get('affiliateCode');
    
    if (!affiliateCode) {
      return NextResponse.json(
        { success: false, error: 'Affiliate code is required' },
        { status: 400 }
      );
    }

    const AffiliateClick = require('@/lib/models/AffiliateClick').default;
    
    // Get all clicks for this affiliate
    const clicks = await AffiliateClick.find({ affiliateCode }).sort({ clickedAt: -1 });
    
    // Get commission stats
    const commissionStats = await AffiliateClick.aggregate([
      { $match: { affiliateCode } },
      {
        $group: {
          _id: null,
          totalEarned: { $sum: '$commissionAmount' },
          totalPaid: { 
            $sum: { 
              $cond: [
                { $eq: ['$status', 'paid'] }, 
                '$commissionAmount', 
                0
              ] 
            } 
          },
          count: { $sum: 1 }
        }
      }
    ]);
    
    return NextResponse.json({
      success: true,
      affiliateCode,
      totalClicks: clicks.length,
      clicks: clicks.map((click: any) => ({
        id: click._id,
        clickedAt: click.clickedAt,
        status: click.status,
        commissionAmount: click.commissionAmount,
        productName: click.productName,
        customerEmail: click.customerEmail
      })),
      commissionStats: commissionStats[0] || { totalEarned: 0, totalPaid: 0, count: 0 }
    });

  } catch (error: any) {
    console.error('Debug affiliate data error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
