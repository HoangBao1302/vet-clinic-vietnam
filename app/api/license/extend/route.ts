import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import License from "@/lib/models/License";

export async function POST(req: NextRequest) {
  if (req.headers.get("x-api-key") !== process.env.LICENSE_API_KEY) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const { productId, accountNumber, days = 30, note = "" } = await req.json();
  if (!productId || !accountNumber)
    return NextResponse.json({ ok: false, error: "MISSING_PARAMS" }, { status: 400 });

  await dbConnect();
  const accNum = Number(accountNumber);

  const lic = await License.findOne({
    productId,
    $or: [{ accountNumber: accNum }, { accountNumbers: { $in: [accNum] } }]
  });

  if (!lic) return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });

  const base = lic.expireAt && new Date(lic.expireAt) > new Date() ? new Date(lic.expireAt) : new Date();
  lic.expireAt = new Date(base.getTime() + Number(days) * 86400 * 1000);
  if (note) lic.note = note;
  await lic.save();

  return NextResponse.json({ ok: true, expireAt: lic.expireAt });
}
