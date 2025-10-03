import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const ORDERS_FILE = join(process.cwd(), "data", "orders.json");

interface Order {
  orderId: string;
  productId: string;
  status: "pending" | "paid" | "completed";
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  amount?: number;
  createdAt: string;
  paidAt?: string;
}

function getOrders(): Order[] {
  if (!existsSync(ORDERS_FILE)) {
    return [];
  }
  try {
    const data = readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading orders file:", error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { orderId, productId } = await request.json();

    if (!orderId || !productId) {
      return NextResponse.json({
        verified: false,
        error: "Thiếu thông tin đơn hàng",
      });
    }

    const orders = getOrders();
    const order = orders.find(
      (o) => o.orderId.toLowerCase() === orderId.toLowerCase() && o.productId === productId
    );

    if (!order) {
      return NextResponse.json({
        verified: false,
        error: "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã.",
      });
    }

    if (order.status !== "paid") {
      return NextResponse.json({
        verified: false,
        error: "Đơn hàng chưa được thanh toán hoặc đang chờ xử lý",
      });
    }

    // Generate download URL
    // For free downloads, use direct path
    // For paid, could use signed/temporary URLs for extra security
    const downloadUrl = `/downloads/files/${productId}.ex4`;

    return NextResponse.json({
      verified: true,
      downloadUrl,
      orderInfo: {
        orderId: order.orderId,
        productId: order.productId,
        paidAt: order.paidAt,
        customerEmail: order.customerEmail,
      },
    });
  } catch (error: any) {
    console.error("Order verification error:", error);
    return NextResponse.json(
      { verified: false, error: "Lỗi xác thực đơn hàng. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}

