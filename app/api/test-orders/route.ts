import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    
    if (action === "save") {
      // Manually save a test order
      const order = {
        orderId: "9L009352AH601417",
        productId: "ea-full",
        productName: "EA ThebenchmarkTrader Full Version",
        status: "paid",
        customerEmail: "hoangkim.helen@gmail.com",
        customerName: "Hoang Kim",
        customerPhone: "0900000000",
        amount: 7900000,
        createdAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        paymentMethod: "paypal",
      };
      
      const ordersPath = path.join(process.cwd(), "data", "orders.json");
      
      try {
        let orders = [];
        if (fs.existsSync(ordersPath)) {
          const data = fs.readFileSync(ordersPath, "utf8");
          orders = JSON.parse(data);
        }
        
        // Check if order already exists
        const existingOrder = orders.find((o: any) => o.orderId === order.orderId);
        if (existingOrder) {
          return NextResponse.json({
            success: true,
            message: "Order already exists",
            order: existingOrder,
            allOrders: orders
          });
        }
        
        orders.push(order);
        fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
        
        return NextResponse.json({
          success: true,
          message: "Order saved successfully",
          order: order,
          allOrders: orders
        });
      } catch (fileError) {
        return NextResponse.json(
          { success: false, error: `File error: ${fileError}` },
          { status: 500 }
        );
      }
    }
    
    // Default: return all orders
    const ordersPath = path.join(process.cwd(), "data", "orders.json");
    
    if (!fs.existsSync(ordersPath)) {
      return NextResponse.json({
        success: true,
        orders: [],
        message: "Orders file not found"
      });
    }
    
    const data = fs.readFileSync(ordersPath, "utf8");
    const orders = JSON.parse(data);
    
    return NextResponse.json({
      success: true,
      orders: orders,
      totalOrders: orders.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
