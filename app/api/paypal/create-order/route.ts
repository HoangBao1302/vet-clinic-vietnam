import { NextRequest, NextResponse } from "next/server";
import {
  getPayPalAccessToken,
  getPayPalApiBase,
  getPayPalSiteUrl,
  isPayPalConfigured,
  isPayPalLive,
  sanitizePayPalPhone,
} from "@/lib/paypal";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { detectCustomerCountry } from "@/lib/customerLocale";
import { getPayPalProductName } from "@/lib/paypalProducts";

export async function POST(request: NextRequest) {
  try {
    const { productId, productName, amount, customerInfo, affiliateCode, customerCountry } = await request.json();

    if (!productId || !productName || !amount || !customerInfo) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!isPayPalConfigured()) {
      console.error("PayPal not configured on server:", {
        hasClientId: !!process.env.PAYPAL_CLIENT_ID,
        hasClientSecret: !!process.env.PAYPAL_CLIENT_SECRET,
        mode: isPayPalLive() ? "live" : "sandbox",
      });
      return NextResponse.json(
        { success: false, error: "PayPal payment is temporarily unavailable. Please contact support." },
        { status: 503 }
      );
    }

    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      console.error("Failed to get PayPal access token - check live credentials and PAYPAL_MODE");
      return NextResponse.json(
        { success: false, error: "PayPal authentication failed. Please check your PayPal configuration." },
        { status: 500 }
      );
    }

    const customIdData = [
      productId,
      affiliateCode || "",
      customerInfo.email,
      customerInfo.name,
      customerInfo.phone || "",
      customerInfo.broker || "",
      customerInfo.accountId || "",
      customerInfo.server || "",
    ].join("|").slice(0, 127);

    const siteUrl = getPayPalSiteUrl();
    const phone = sanitizePayPalPhone(customerInfo.phone);
    const invoiceName = getPayPalProductName(productId).slice(0, 127);

    const orderData: Record<string, unknown> = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: productId,
          amount: {
            currency_code: "USD",
            value: Number(amount).toFixed(2),
          },
          description: invoiceName,
          custom_id: customIdData,
        },
      ],
      application_context: {
        brand_name: "ThebenchmarkTrader",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${siteUrl}/downloads/success?payment_method=paypal&email=${encodeURIComponent(customerInfo.email)}&name=${encodeURIComponent(customerInfo.name)}&phone=${encodeURIComponent(customerInfo.phone || "")}&productId=${encodeURIComponent(productId)}`,
        cancel_url: `${siteUrl}/downloads?cancelled=true`,
      },
      payer: {
        name: {
          given_name: String(customerInfo.name || "Customer").slice(0, 140),
        },
        email_address: customerInfo.email,
        ...(phone
          ? {
              phone: {
                phone_type: "MOBILE",
                phone_number: {
                  national_number: phone,
                },
              },
            }
          : {}),
      },
    };

    const response = await fetch(`${getPayPalApiBase()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "PayPal-Request-Id": `${productId}-${Date.now()}`,
      },
      body: JSON.stringify(orderData),
    });

    const order = await response.json();

    if (!response.ok) {
      console.error("PayPal order creation failed:", {
        status: response.status,
        statusText: response.statusText,
        order,
        mode: isPayPalLive() ? "live" : "sandbox",
        baseUrl: getPayPalApiBase(),
      });

      let errorMessage = "PayPal payment is temporarily unavailable. Please contact support.";

      if (response.status === 400) {
        if (order.message?.includes("business validation")) {
          errorMessage = "PayPal không chấp nhận email này. Vui lòng dùng email cá nhân.";
        } else if (order.message?.includes("semantically incorrect")) {
          errorMessage = "Thông tin thanh toán không hợp lệ. Vui lòng kiểm tra lại.";
        } else {
          errorMessage = "Thông tin thanh toán không đúng. Vui lòng thử lại hoặc liên hệ hỗ trợ.";
        }
      } else if (response.status === 401) {
        errorMessage = "PayPal credentials không hợp lệ. Kiểm tra Client ID/Secret Live trên Vercel.";
      } else if (response.status === 403) {
        errorMessage = "PayPal không cho phép thanh toán này. Vui lòng liên hệ hỗ trợ.";
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 500 }
      );
    }

    try {
      await connectDB();
      const country = customerCountry === undefined
        ? (await detectCustomerCountry(request)) || ""
        : String(customerCountry || "").trim().toUpperCase();
      await Order.findOneAndUpdate(
        { orderId: order.id },
        {
          ...(country ? { $set: { customerCountry: country } } : {}),
          $setOnInsert: {
            orderId: order.id,
            productId,
            productName: invoiceName,
            status: "pending",
            customerEmail: customerInfo.email,
            customerName: customerInfo.name || "Customer",
            customerPhone: customerInfo.phone || "",
            amount: Math.round(Number(amount) * 100),
            paymentMethod: "paypal",
            createdAt: new Date(),
            emailSent: false,
            broker: customerInfo.broker || "",
            accountId: customerInfo.accountId || "",
            server: customerInfo.server || "",
          },
        },
        { upsert: true }
      );
    } catch (saveError) {
      console.error("Failed to save pending PayPal order:", saveError);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      approvalUrl: order.links.find((link: { rel: string; href: string }) => link.rel === "approve")?.href,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "PayPal error";
    console.error("PayPal order creation error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
