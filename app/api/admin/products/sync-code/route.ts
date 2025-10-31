import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Helper function to verify admin access
async function verifyAdminAccess(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { authorized: false, user: null };
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    await dbConnect();
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "admin") {
      return { authorized: false, user: null };
    }

    return { authorized: true, user };
  } catch (error) {
    return { authorized: false, user: null };
  }
}

// GET: Generate sync code snippets
export async function GET(request: NextRequest) {
  try {
    const { authorized } = await verifyAdminAccess(request);
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const products = await Product.find({ status: "active" })
      .sort({ platform: 1, category: 1 })
      .lean();

    // Generate expectedPrices
    const expectedPrices: Record<string, number> = {};
    products.forEach((product) => {
      expectedPrices[product.id] = product.price;
    });

    // Generate productNames
    const productNames: Record<string, string> = {};
    products.forEach((product) => {
      productNames[product.id] = product.name;
    });

    // Generate commissionRates code
    const commissionRatesCode = products
      .map(
        (p) =>
          `  "${p.id}": affiliate.isPaid ? ${p.commissionRates?.paidAffiliate || 0.35} : ${p.commissionRates?.freeAffiliate || 0.30}`
      )
      .join(",\n");

    // Generate full code snippet
    const fullCodeSnippet = `
// Copy this to: app/pricing/page.tsx
const expectedPrices: Record<string, number> = ${JSON.stringify(expectedPrices, null, 2)};

// Copy this to: app/api/webhooks/paypal/route.ts & stripe/route.ts
const productNames: Record<string, string> = ${JSON.stringify(productNames, null, 2)};

// Copy this to: app/api/webhooks/paypal/route.ts & stripe/route.ts (commissionRates)
const commissionRates: Record<string, number> = {
${commissionRatesCode}
};
`;

    return NextResponse.json({
      success: true,
      code: fullCodeSnippet,
      expectedPrices,
      productNames,
      commissionRates: products.map((p) => ({
        id: p.id,
        paid: p.commissionRates?.paidAffiliate || 0.35,
        free: p.commissionRates?.freeAffiliate || 0.30,
      })),
    });
  } catch (error: any) {
    console.error("Error generating sync code:", error);
    return NextResponse.json(
      { error: "Failed to generate sync code", message: error.message },
      { status: 500 }
    );
  }
}

