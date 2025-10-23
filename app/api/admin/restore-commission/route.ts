import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const db = await connectDB();
    
    if (!db) {
      return NextResponse.json({
        success: true,
        message: 'Database not available - returning empty data',
        data: []
      });
    }
    
    // Commission data to restore
    const commissionData = [
      {
        email: 'hoangkim@gmail.com',
        affiliateCode: 'AFF-HOANGKIM-BD295D',
        totalCommissionEarned: 5000000, // 5M VND
        totalCommissionPaid: 2000000    // 2M VND
      },
      {
        email: 'thuanyen@gmail.com', 
        affiliateCode: 'AFF-THUANYEN-FA7F52',
        totalCommissionEarned: 3000000, // 3M VND
        totalCommissionPaid: 1000000    // 1M VND
      },
      {
        email: 'kietdangtong@gmail.com',
        affiliateCode: 'AFF-KIETDANGTONG-ABC123',
        totalCommissionEarned: 8000000, // 8M VND
        totalCommissionPaid: 3000000     // 3M VND
      }
    ];
    
    const results = [];
    
    for (const data of commissionData) {
      const user = await User.findOne({ email: data.email });
      
      if (user) {
        const oldEarned = user.totalCommissionEarned || 0;
        const oldPaid = user.totalCommissionPaid || 0;
        
        user.totalCommissionEarned = data.totalCommissionEarned;
        user.totalCommissionPaid = data.totalCommissionPaid;
        await user.save();
        
        results.push({
          email: data.email,
          affiliateCode: data.affiliateCode,
          updated: true,
          oldEarned,
          oldPaid,
          newEarned: data.totalCommissionEarned,
          newPaid: data.totalCommissionPaid
        });
        
        console.log(`✅ Updated ${data.email}: ${oldEarned} → ${data.totalCommissionEarned}đ earned, ${oldPaid} → ${data.totalCommissionPaid}đ paid`);
      } else {
        results.push({
          email: data.email,
          affiliateCode: data.affiliateCode,
          updated: false,
          error: 'User not found'
        });
        
        console.log(`❌ User not found: ${data.email}`);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Commission data restored successfully',
      results
    });
    
  } catch (error: any) {
    console.error('Restore commission data error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
