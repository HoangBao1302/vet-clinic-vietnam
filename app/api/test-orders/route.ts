import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    
    if (action === "save") {
      // Manually save a test order
      const order = new Order({
        orderId: "9L009352AH601417",
        productId: "ea-full",
        productName: "EA ThebenchmarkTrader Full Version",
        status: "paid",
        customerEmail: "test@example.com",
        customerName: "Test User",
        customerPhone: "0900000000",
        amount: 7900000,
        paymentMethod: "paypal",
      });
      
      try {
        await connectDB();
        
        // Check if order already exists
        const existingOrder = await Order.findOne({ orderId: order.orderId });
        if (existingOrder) {
          return NextResponse.json({
            success: true,
            message: "Order already exists",
            order: existingOrder,
            allOrders: await Order.find({})
          });
        }
        
        const savedOrder = await order.save();
        
        return NextResponse.json({
          success: true,
          message: "Order saved successfully",
          order: savedOrder,
          allOrders: await Order.find({})
        });
      } catch (fileError) {
        return NextResponse.json(
          { success: false, error: `Database error: ${fileError}` },
          { status: 500 }
        );
      }
    }
    
    // Default: return all orders
    try {
      await connectDB();
      const orders = await Order.find({});
      
      return NextResponse.json({
        success: true,
        orders: orders,
        totalOrders: orders.length
      });
    } catch (dbError) {
      return NextResponse.json(
        { success: false, error: `Database error: ${dbError}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
