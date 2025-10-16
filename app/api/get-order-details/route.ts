import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing order ID" },
        { status: 400 }
      );
    }
    
    // Read orders from file
    const ordersPath = path.join(process.cwd(), "data", "orders.json");
    
    if (!fs.existsSync(ordersPath)) {
      return NextResponse.json({
        success: false,
        error: "Orders file not found",
        orders: []
      });
    }
    
    const data = fs.readFileSync(ordersPath, "utf8");
    const orders = JSON.parse(data);
    
    // Find the specific order
    const order = orders.find((o: any) => o.orderId === orderId);
    
    return NextResponse.json({
      success: true,
      order: order || null,
      allOrders: orders,
      totalOrders: orders.length
    });
  } catch (error: any) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
