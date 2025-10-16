import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function POST(request: NextRequest) {
  try {
    const { orderId, productId, productName, amount, customerInfo, paymentMethod } = await request.json();
    
    console.log("Saving order:", { orderId, productId, productName, amount, customerInfo, paymentMethod });
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Check if order already exists
    const existingOrder = await Order.findOne({ orderId });
    if (existingOrder) {
      console.log("Order already exists:", orderId);
      return NextResponse.json({
        success: true,
        orderId: orderId,
        message: "Order already exists",
        order: existingOrder
      });
    }
    
    // Create new order
    const order = new Order({
      orderId: orderId,
      productId: productId || "ea-full",
      productName: productName || "EA ThebenchmarkTrader Full Version",
      status: "paid",
      customerEmail: customerInfo?.email || "hoangkim.helen@gmail.com",
      customerName: customerInfo?.name || "Hoang Kim",
      customerPhone: customerInfo?.phone || "0900000000",
      amount: amount || 7900000,
      paymentMethod: paymentMethod || "paypal",
    });
    
    // Save to MongoDB
    const savedOrder = await order.save();
    
    console.log("Order saved successfully:", orderId);
    
    return NextResponse.json({
      success: true,
      orderId: orderId,
      message: "Order saved successfully",
      order: savedOrder
    });
  } catch (error: any) {
    console.error("Save order error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
