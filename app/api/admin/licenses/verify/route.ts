import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import License from "@/lib/models/License";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // Log raw body for debugging
    const rawBody = await req.text();
    console.log("📥 Raw request body:", rawBody);
    console.log("📥 Body length:", rawBody.length);
    console.log("📥 Body bytes:", Buffer.from(rawBody).toString('hex'));
    
    // Clean up potential issues
    const cleanBody = rawBody.trim().replace(/\0/g, ''); // Remove null chars
    console.log("🧹 Cleaned body:", cleanBody);
    
    let body;
    try {
      body = JSON.parse(cleanBody);
    } catch (parseError: any) {
      console.error("❌ JSON parse error:", parseError.message);
      console.error("❌ Failed at position:", parseError.message.match(/\d+/)?.[0]);
      
      // Try to show problematic area
      const pos = parseInt(parseError.message.match(/\d+/)?.[0] || "0");
      const start = Math.max(0, pos - 20);
      const end = Math.min(cleanBody.length, pos + 20);
      console.error("❌ Context:", cleanBody.substring(start, end));
      
      return NextResponse.json(
        { ok: false, error: "INVALID_JSON", message: parseError.message, rawLength: rawBody.length },
        { status: 400 }
      );
    }
    
    const { key, productId, accountNumber, mode } = body;
    
    console.log("🔍 Verify request:", { productId, accountNumber, mode, hasKey: !!key });
    
    // ===== API KEY AUTHENTICATION (from body OR header) =====
    const headerKey = req.headers.get("x-api-key");
    const bodyKey = key;
    const validKey = process.env.LICENSE_API_KEY;
    
    if (bodyKey !== validKey && headerKey !== validKey) {
      console.log("❌ FORBIDDEN - Invalid API key");
      return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
    }
    
    // ===== VALIDATE INPUT =====
    if (!productId || !accountNumber) {
      return NextResponse.json(
        { ok: false, error: "MISSING_PARAMS: productId and accountNumber required" },
        { status: 400 }
      );
    }

    // ===== FIND LICENSE =====
    const license = await License.findOne({
      productId: productId,
      $or: [
        { accountNumber: Number(accountNumber) },
        { accountNumbers: Number(accountNumber) }
      ],
      isActive: true
    });

    if (!license) {
      console.log("❌ License not found:", { productId, accountNumber });
      return NextResponse.json(
        { ok: false, error: "LICENSE_NOT_FOUND" },
        { status: 404 }
      );
    }

    console.log("✓ License found:", {
      id: license._id,
      productId: license.productId,
      accounts: license.accountNumbers || [license.accountNumber],
      plan: license.plan,
      mode: license.mode
    });

    // ===== CHECK EXPIRY =====
    const now = new Date();
    if (license.expireAt && new Date(license.expireAt) < now) {
      console.log("❌ License expired:", license.expireAt);
      return NextResponse.json(
        { ok: false, error: "LICENSE_EXPIRED", expireAt: license.expireAt },
        { status: 403 }
      );
    }

    // ===== CHECK MODE =====
    const requestMode = String(mode || "REAL").toUpperCase();
    const licenseMode = String(license.mode || "BOTH").toUpperCase();
    
    if (licenseMode !== "BOTH" && licenseMode !== requestMode) {
      console.log("❌ Mode mismatch:", { licenseMode, requestMode });
      return NextResponse.json(
        { ok: false, error: `LICENSE_MODE_MISMATCH: License only valid for ${licenseMode}` },
        { status: 403 }
      );
    }

    // ===== SUCCESS RESPONSE =====
    const expireEpoch = license.expireAt 
      ? Math.floor(new Date(license.expireAt).getTime() / 1000) 
      : 0;

    console.log("✅ License verified successfully");
    
    return NextResponse.json({
      ok: true,
      license: {
        productId: license.productId,
        accountNumber: Number(accountNumber),
        accounts: license.accountNumbers?.length 
          ? license.accountNumbers 
          : [license.accountNumber],
        mode: license.mode,
        plan: license.plan,
        maxAccounts: license.maxAccounts || 1,
        startAt: license.startAt,
        expireAt: license.expireAt,
        expEpoch: expireEpoch,
        isActive: license.isActive,
        note: license.note || ""
      }
    });

  } catch (error: any) {
    console.error("❌ Verify error:", error);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR", message: error.message },
      { status: 500 }
    );
  }
}
