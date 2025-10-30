import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Find all orders with legacy product IDs (missing -mt4/-mt5)
    const legacyOrders = await Order.find({
      productId: { 
        $in: ['ea-full', 'ea-pro-source', 'indicator-pro']
      }
    });

    if (legacyOrders.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No legacy orders to fix",
        fixed: 0,
        total: 0
      });
    }

    // Mapping for legacy products (default to MT4)
    const productMapping: Record<string, { newId: string; newName: string; expectedAmount: number }> = {
      'ea-full': {
        newId: 'ea-full-mt4',
        newName: 'EA ThebenchmarkTrader Full Version (MT4)',
        expectedAmount: 790000000
      },
      'ea-pro-source': {
        newId: 'ea-pro-source-mt4',
        newName: 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
        expectedAmount: 1490000000
      },
      'indicator-pro': {
        newId: 'indicator-pro-mt4',
        newName: 'Multi-Indicator Pro Pack (MT4)',
        expectedAmount: 199000000
      }
    };

    let fixedCount = 0;
    const fixedOrders = [];

    for (const order of legacyOrders) {
      const mapping = productMapping[order.productId];
      
      if (!mapping) {
        console.warn(`⚠️ No mapping for ${order.productId}, skipping...`);
        continue;
      }

      console.log(`🔧 Fixing legacy order: ${order.orderId}`, {
        oldProductId: order.productId,
        newProductId: mapping.newId,
        oldAmount: order.amount,
        newAmount: mapping.expectedAmount,
        customerEmail: order.customerEmail
      });

      await Order.updateOne(
        { orderId: order.orderId },
        {
          $set: {
            productId: mapping.newId,
            productName: mapping.newName,
            amount: mapping.expectedAmount
          }
        }
      );

      fixedCount++;
      fixedOrders.push({
        orderId: order.orderId,
        customerEmail: order.customerEmail,
        oldProductId: order.productId,
        newProductId: mapping.newId
      });
    }

    console.log(`✅ Fixed ${fixedCount} legacy orders`);

    return NextResponse.json({
      success: true,
      message: `Fixed ${fixedCount} legacy orders`,
      fixed: fixedCount,
      total: legacyOrders.length,
      orders: fixedOrders
    });
  } catch (error: any) {
    console.error("Error fixing legacy orders:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

