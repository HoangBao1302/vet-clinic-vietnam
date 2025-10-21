import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateClick from '@/lib/models/AffiliateClick';
import User from '@/lib/models/User';

// Real-time correlation system for click-to-order matching
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { 
      orderId, 
      customerEmail, 
      customerName, 
      productId, 
      amount, 
      paidAt, 
      ipAddress,
      sessionId,
      paymentMethod 
    } = await request.json();

    if (!orderId || !customerEmail || !productId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('🔍 Real-time Correlation Analysis:', {
      orderId,
      customerEmail,
      customerName,
      productId,
      amount,
      paidAt,
      ipAddress,
      sessionId,
      paymentMethod
    });

    // Multi-layered correlation approach
    const correlationResults = await performMultiLayerCorrelation({
      orderId,
      customerEmail,
      customerName,
      productId,
      amount,
      paidAt,
      ipAddress,
      sessionId,
      paymentMethod
    });

    if (correlationResults.success) {
      const { affiliateCode, clickId, commissionAmount, correlationMethod } = correlationResults;
      
      // Update affiliate click record
      const updatedClick = await AffiliateClick.findByIdAndUpdate(
        clickId,
        {
          $set: {
            status: 'converted',
            convertedAt: paidAt ? new Date(paidAt) : new Date(),
            orderId: orderId,
            customerEmail: customerEmail,
            customerName: customerName,
            commissionAmount: commissionAmount,
            correlationMethod: correlationMethod,
            correlationData: {
              orderId,
              customerEmail,
              customerName,
              productId,
              amount,
              paidAt,
              ipAddress,
              sessionId,
              paymentMethod,
              correlatedAt: new Date()
            }
          }
        },
        { new: true }
      );

      if (updatedClick) {
        // Update affiliate's total commission
        const affiliate = await User.findOne({ 
          affiliateCode, 
          affiliateStatus: 'approved' 
        });

        if (affiliate) {
          affiliate.totalCommissionEarned = (affiliate.totalCommissionEarned || 0) + commissionAmount;
          await affiliate.save();

          console.log(`✅ Real-time correlation successful:`, {
            affiliateCode,
            clickId: updatedClick._id,
            orderId,
            commissionAmount,
            totalEarned: affiliate.totalCommissionEarned,
            correlationMethod
          });

          return NextResponse.json({
            success: true,
            message: 'Real-time correlation completed successfully',
            data: {
              affiliateCode,
              affiliateName: affiliate.username,
              clickId: updatedClick._id,
              orderId,
              commissionAmount,
              totalCommissionEarned: affiliate.totalCommissionEarned,
              correlationMethod
            }
          });
        }
      }
    }

    // If no correlation found, log for manual review
    console.log('⚠️ No correlation found, logging for manual review:', {
      orderId,
      customerEmail,
      productId,
      amount,
      paidAt
    });

    return NextResponse.json({
      success: false,
      error: 'No correlation found',
      requiresManualReview: true,
      data: {
        orderId,
        customerEmail,
        productId,
        amount,
        paidAt
      }
    });

  } catch (error: any) {
    console.error('Real-time Correlation Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Multi-layer correlation algorithm
async function performMultiLayerCorrelation(params: any) {
  const { orderId, customerEmail, customerName, productId, amount, paidAt, ipAddress, sessionId } = params;
  
  console.log('🔍 Performing multi-layer correlation...');

  // Layer 1: Session-based correlation (highest priority)
  if (sessionId) {
    const sessionClick = await AffiliateClick.findOne({
      sessionId: sessionId,
      status: 'clicked',
      productId: productId
    }).sort({ clickedAt: -1 });

    if (sessionClick) {
      console.log('✅ Layer 1: Session correlation found');
      return {
        success: true,
        affiliateCode: sessionClick.affiliateCode,
        clickId: sessionClick._id,
        commissionAmount: calculateCommission(amount, productId),
        correlationMethod: 'session'
      };
    }
  }

  // Layer 2: Email-based correlation
  if (customerEmail) {
    const emailClick = await AffiliateClick.findOne({
      customerEmail: customerEmail,
      status: 'clicked',
      productId: productId,
      clickedAt: { 
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
      }
    }).sort({ clickedAt: -1 });

    if (emailClick) {
      console.log('✅ Layer 2: Email correlation found');
      return {
        success: true,
        affiliateCode: emailClick.affiliateCode,
        clickId: emailClick._id,
        commissionAmount: calculateCommission(amount, productId),
        correlationMethod: 'email'
      };
    }
  }

  // Layer 3: IP + Time + Product correlation
  if (ipAddress) {
    const orderTime = new Date(paidAt);
    const timeWindow = 2 * 60 * 60 * 1000; // 2 hours window

    const ipClick = await AffiliateClick.findOne({
      ipAddress: ipAddress,
      productId: productId,
      status: 'clicked',
      clickedAt: { 
        $gte: new Date(orderTime.getTime() - timeWindow),
        $lte: orderTime
      }
    }).sort({ clickedAt: -1 });

    if (ipClick) {
      console.log('✅ Layer 3: IP + Time + Product correlation found');
      return {
        success: true,
        affiliateCode: ipClick.affiliateCode,
        clickId: ipClick._id,
        commissionAmount: calculateCommission(amount, productId),
        correlationMethod: 'ip_time_product'
      };
    }
  }

  // Layer 4: Device fingerprinting correlation
  const fingerprintClick = await findFingerprintCorrelation(params);
  if (fingerprintClick) {
    console.log('✅ Layer 4: Device fingerprinting correlation found');
    return fingerprintClick;
  }

  // Layer 5: Name-based correlation (last resort)
  if (customerName) {
    const nameClick = await AffiliateClick.findOne({
      customerName: customerName,
      status: 'clicked',
      productId: productId,
      clickedAt: { 
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    }).sort({ clickedAt: -1 });

    if (nameClick) {
      console.log('✅ Layer 5: Name correlation found');
      return {
        success: true,
        affiliateCode: nameClick.affiliateCode,
        clickId: nameClick._id,
        commissionAmount: calculateCommission(amount, productId),
        correlationMethod: 'name'
      };
    }
  }

  console.log('❌ No correlation found in any layer');
  return { success: false };
}

// Device fingerprinting correlation
async function findFingerprintCorrelation(params: any) {
  // This would implement device fingerprinting logic
  // For now, return null as it requires more complex implementation
  return null;
}

// Calculate commission based on product and affiliate status
function calculateCommission(amount: number, productId: string): number {
  const commissionRates: Record<string, number> = {
    'ea-full': 0.30,
    'ea-pro-source': 0.30,
    'indicator-pro': 0.30,
    'course': 0.25,
    'social-copy': 0.10,
  };

  const commissionRate = commissionRates[productId] || 0.30;
  return Math.round(amount * commissionRate);
}
