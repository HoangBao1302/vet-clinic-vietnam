import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get all orders
    const allOrders = await Order.find({}).sort({ createdAt: -1 }).limit(100);
    
    // Calculate stats
    const total = allOrders.length;
    const paid = allOrders.filter(o => o.status === 'paid').length;
    const pending = allOrders.filter(o => o.status === 'pending').length;
    
    // Calculate total revenue
    const totalRevenue = allOrders
      .filter(o => o.status === 'paid')
      .reduce((sum, o) => sum + (o.amount || 0), 0);
    
    // Group by product
    const byProduct: Record<string, number> = {};
    allOrders.forEach(order => {
      byProduct[order.productId] = (byProduct[order.productId] || 0) + 1;
    });
    
    // Group by payment method
    const byPaymentMethod: Record<string, number> = {};
    allOrders.forEach(order => {
      byPaymentMethod[order.paymentMethod] = (byPaymentMethod[order.paymentMethod] || 0) + 1;
    });
    
    // Find invalid orders (productId or amount mismatch)
    const expectedPrices: Record<string, number> = {
      'ea-pro-source-mt4': 14900000,
      'ea-pro-source-mt5': 14900000,
      'ea-full-mt4': 7900000,
      'ea-full-mt5': 7900000,
      'indicator-pro-mt4': 1990000,
      'indicator-pro-mt5': 1990000,
    };
    
    const invalidOrders = allOrders.filter(order => {
      const expectedPrice = expectedPrices[order.productId];
      if (!expectedPrice) return false; // Unknown product, skip
      
      const actualPrice = order.amount / 100;
      const priceMismatch = Math.abs(actualPrice - expectedPrice) > 1000; // 1K tolerance
      
      return priceMismatch;
    });
    
    return NextResponse.json({
      total,
      paid,
      pending,
      totalRevenue,
      byProduct,
      byPaymentMethod,
      recentOrders: allOrders,
      invalidOrders: invalidOrders.map(o => ({
        _id: o._id,
        orderId: o.orderId,
        productId: o.productId,
        amount: o.amount,
        expectedAmount: expectedPrices[o.productId] * 100,
        customerEmail: o.customerEmail,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching order stats:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

