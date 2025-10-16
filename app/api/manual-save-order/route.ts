import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { orderId, productId, productName, amount, customerInfo, paymentMethod } = await request.json();
    
    console.log("Manual save order:", { orderId, productId, productName, amount, customerInfo, paymentMethod });
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }
    
    // Create order record
    const order = {
      orderId: orderId,
      productId: productId || "ea-full",
      productName: productName || "EA ThebenchmarkTrader Full Version",
      status: "paid",
      customerEmail: customerInfo?.email || "hoangkim.helen@gmail.com",
      customerName: customerInfo?.name || "Hoang Kim",
      customerPhone: customerInfo?.phone || "0900000000",
      amount: amount || 7900000,
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      paymentMethod: paymentMethod || "paypal",
    };
    
    // Save to JSON file
    const ordersPath = path.join(process.cwd(), "data", "orders.json");
    
    try {
      // Read existing orders
      let orders = [];
      if (fs.existsSync(ordersPath)) {
        const data = fs.readFileSync(ordersPath, "utf8");
        orders = JSON.parse(data);
      }
      
      // Check if order already exists
      const existingOrder = orders.find((o: any) => o.orderId === orderId);
      if (existingOrder) {
        return NextResponse.json({
          success: true,
          orderId: orderId,
          message: "Order already exists",
          order: existingOrder
        });
      }
      
      // Add new order
      orders.push(order);
      
      // Write back to file
      fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
      
      console.log("Order saved successfully:", orderId);
      
      return NextResponse.json({
        success: true,
        orderId: orderId,
        message: "Order saved successfully",
        order: order
      });
    } catch (fileError) {
      console.error("Error saving order to file:", fileError);
      return NextResponse.json(
        { success: false, error: "Failed to save order" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Manual save order error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
