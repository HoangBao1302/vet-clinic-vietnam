import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import License from "@/lib/models/License";

export async function POST(req: NextRequest) {
  // API key từ header hoặc body
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  const body = await req.json();
  const { productId, accountNumber, mode, version = "", key } = body;
  
  const headerKey = req.headers.get("x-api-key");
  const bodyKey = key;
  const validKey = process.env.LICENSE_API_KEY;
  
  // Check API key from header OR body
  if (bodyKey !== validKey && headerKey !== validKey) {
    return new NextResponse("FORBIDDEN", { status: 403 });
  }

  if (!productId || !accountNumber || !mode) {
    return new NextResponse("ERR|MISSING_PARAMS", { status: 400 });
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

  if (!lic) return new NextResponse("DENY|NOT_FOUND_OR_EXPIRED", { status: 200 });

  const modeUpper = String(mode).toUpperCase();
  if (lic.mode !== "BOTH" && lic.mode !== modeUpper) {
    return new NextResponse("DENY|MODE_MISMATCH", { status: 200 });
  }

  // Log usage
  lic.usage = {
    lastSeenAt: now,
    lastIP: String(ip),
    lastVersion: version || lic.usage?.lastVersion,
    heartbeats: (lic.usage?.heartbeats || 0) + 1
  };
  await lic.save();

  const expiryEpoch = Math.floor(new Date(lic.expireAt).getTime() / 1000);
  const matchedAccount = lic.accountNumbers?.includes(accNum) ? accNum : (lic.accountNumber ?? accNum);
  const payloadText = `OK|${matchedAccount}|${lic.mode}|${expiryEpoch}|${lic.plan}|${lic.note || ""}`;

  return new NextResponse(payloadText, {
    status: 200,
    headers: { "Content-Type": "text/plain" }
  });
}
