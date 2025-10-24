import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import License from "@/lib/models/License";

export async function GET(req: NextRequest) {
  if (req.headers.get("x-api-key") !== process.env.LICENSE_API_KEY) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const accountNumber = searchParams.get("accountNumber");
  const mode = searchParams.get("mode") || "REAL";
  const version = searchParams.get("version") || "1.0.0";

  if (!productId || !accountNumber) {
    return NextResponse.json({ ok: false, error: "MISSING_PARAMS" }, { status: 400 });
  }

  await dbConnect();
  const now = new Date();
  const accNum = Number(accountNumber);

  // Tìm license active + còn hạn cho productId, có chứa accountNum (single hoặc list)
  const lic = await License.findOne({
    productId,
    isActive: true,
    startAt: { $lte: now },
    expireAt: { $gte: now },
    $or: [
      { accountNumber: accNum },
      { accountNumbers: { $in: [accNum] } }
    ]
  });

  if (!lic) {
    return NextResponse.json({ 
      ok: false, 
      result: "DENY|NOT_FOUND_OR_EXPIRED",
      message: "License not found or expired"
    });
  }

  const modeUpper = String(mode).toUpperCase();
  if (lic.mode !== "BOTH" && lic.mode !== modeUpper) {
    return NextResponse.json({ 
      ok: false, 
      result: "DENY|MODE_MISMATCH",
      message: `Mode mismatch. License mode: ${lic.mode}, requested mode: ${modeUpper}`
    });
  }

  // Log usage
  lic.usage = {
    lastSeenAt: now,
    lastIP: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "",
    lastVersion: version || lic.usage?.lastVersion,
    heartbeats: (lic.usage?.heartbeats || 0) + 1
  };
  await lic.save();

  const expiryEpoch = Math.floor(new Date(lic.expireAt).getTime() / 1000);
  const matchedAccount = lic.accountNumbers?.includes(accNum) ? accNum : (lic.accountNumber ?? accNum);
  const result = `OK|${matchedAccount}|${lic.mode}|${expiryEpoch}|${lic.plan}|${lic.note || ""}`;

  return NextResponse.json({
    ok: true,
    result,
    license: {
      productId: lic.productId,
      accountNumber: lic.accountNumber,
      accountNumbers: lic.accountNumbers,
      mode: lic.mode,
      plan: lic.plan,
      expireAt: lic.expireAt,
      isActive: lic.isActive,
      note: lic.note,
      usage: lic.usage
    }
  });
}
