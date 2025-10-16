import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { orderId, productId, productName, amount, customerInfo, paymentMethod } = await request.json();
    
    console.log("Saving order:", { orderId, productId, productName, amount, customerInfo, paymentMethod });
    
    // Create order record
    const order = {
      orderId: orderId,
      productId: productId,
      productName: productName,
      status: "paid",
      customerEmail: customerInfo?.email,
      customerName: customerInfo?.name,
      customerPhone: customerInfo?.phone,
      amount: amount,
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      paymentMethod: paymentMethod || "paypal",
    };
    
    // Save to JSON file (simple storage for now)
    const ordersPath = path.join(process.cwd(), "data", "orders.json");
    
    try {
      // Read existing orders
      let orders = [];
      if (fs.existsSync(ordersPath)) {
        const data = fs.readFileSync(ordersPath, "utf8");
        orders = JSON.parse(data);
      }
      
      // Add new order
      orders.push(order);
      
      // Write back to file
      fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
      
      console.log("Order saved successfully:", orderId);
      
      return NextResponse.json({
        success: true,
        orderId: orderId,
        message: "Order saved successfully"
      });
    } catch (fileError) {
      console.error("Error saving order to file:", fileError);
      return NextResponse.json(
        { success: false, error: "Failed to save order" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Save order error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
