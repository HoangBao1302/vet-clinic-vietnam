import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find the order
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    
    // Expected prices and product names
    const expectedPrices: Record<string, number> = {
      'ea-pro-source-mt4': 14900000,
      'ea-pro-source-mt5': 14900000,
      'ea-full-mt4': 7900000,
      'ea-full-mt5': 7900000,
      'indicator-pro-mt4': 1990000,
      'indicator-pro-mt5': 1990000,
    };
    
    const productNames: Record<string, string> = {
      'ea-pro-source-mt4': 'EA ThebenchmarkTrader Pro + Source Code (MT4)',
      'ea-pro-source-mt5': 'EA ThebenchmarkTrader Pro + Source Code (MT5)',
      'ea-full-mt4': 'EA ThebenchmarkTrader Full Version (MT4)',
      'ea-full-mt5': 'EA ThebenchmarkTrader Full Version (MT5)',
      'indicator-pro-mt4': 'Multi-Indicator Pro Pack (MT4)',
      'indicator-pro-mt5': 'Multi-Indicator Pro Pack (MT5)',
    };
    
    // Auto-detect correct product based on amount
    const actualPrice = order.amount / 100;
    let detectedProductId = order.productId;
    let needsFix = false;
    
    // Check if current productId is valid
    const expectedPrice = expectedPrices[order.productId];
    if (!expectedPrice || Math.abs(actualPrice - expectedPrice) > 1000) {
      // Try to detect correct product from amount
      needsFix = true;
      
      // Strategy 1: Try to match with expected prices (with large tolerance for corrupted amounts)
      let found = false;
      for (const [pid, price] of Object.entries(expectedPrices)) {
        if (Math.abs(actualPrice - price) < 100000) { // 100K tolerance
          detectedProductId = pid;
          found = true;
          break;
        }
      }
      
      // Strategy 2: If amount is very small (< 1M), it's likely corrupted
      // Default to ea-pro-source-mt4 (most common product)
      if (!found && actualPrice < 1000000) {
        console.warn(`⚠️ Amount too small (${actualPrice}đ), defaulting to ea-pro-source-mt4`);
        detectedProductId = 'ea-pro-source-mt4';
      }
      
      // Strategy 3: Check customer email for hints
      if (!found && actualPrice < 1000000) {
        const email = order.customerEmail?.toLowerCase() || '';
        // Most orders are Pro+Source, so default to that
        detectedProductId = 'ea-pro-source-mt4';
        console.log(`📧 Using default product for ${email}: ${detectedProductId}`);
      }
    }
    
    if (!needsFix) {
      return NextResponse.json({
        success: true,
        message: "Order is already correct",
        order: {
          orderId: order.orderId,
          productId: order.productId,
          amount: order.amount,
        }
      });
    }
    
    // Apply fix
    const correctAmount = expectedPrices[detectedProductId] * 100;
    const correctProductName = productNames[detectedProductId];
    
    console.log(`🔧 Fixing order ${orderId}:`, {
      oldProductId: order.productId,
      newProductId: detectedProductId,
      oldAmount: `${actualPrice.toLocaleString('vi-VN')}đ`,
      newAmount: `${(correctAmount / 100).toLocaleString('vi-VN')}đ`,
      customerEmail: order.customerEmail
    });
    
    await Order.updateOne(
      { orderId },
      {
        $set: {
          productId: detectedProductId,
          productName: correctProductName,
          amount: correctAmount,
        }
      }
    );
    
    console.log(`✅ Order ${orderId} fixed:`, {
      oldProductId: order.productId,
      newProductId: detectedProductId,
      oldAmount: order.amount,
      newAmount: correctAmount,
    });
    
    return NextResponse.json({
      success: true,
      message: "Order fixed successfully",
      changes: {
        productId: {
          old: order.productId,
          new: detectedProductId,
        },
        productName: {
          old: order.productName,
          new: correctProductName,
        },
        amount: {
          old: order.amount,
          new: correctAmount,
        }
      }
    });
  } catch (error: any) {
    console.error("Error fixing order:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

