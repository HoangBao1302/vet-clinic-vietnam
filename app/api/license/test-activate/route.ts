import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import License from "@/lib/models/License";

const DEFAULT_DEMO_DAYS = 60;

function parseAccounts(input: any): number[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(n => Number(n)).filter(Number.isFinite);
  if (typeof input === "string") {
    return input
      .split(/[,\s]+/)
      .map(s => Number(s.trim()))
      .filter(Number.isFinite);
  }
  return [];
}

export async function POST(req: NextRequest) {
  if (req.headers.get("x-api-key") !== process.env.LICENSE_API_KEY) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const body = await req.json();
  const {
    productId,
    accountNumber,         // single (tương thích ngược)
    accountNumbers,        // list (mảng hoặc CSV)
    mode = "BOTH",
    plan = "DEMO",
    days,
    maxAccounts,
    note = "",
    createdBy = "admin_test"
  } = body;

  if (!productId || (!accountNumber && !accountNumbers)) {
    return NextResponse.json({ ok: false, error: "MISSING_PARAMS" }, { status: 400 });
  }

  const list = parseAccounts(accountNumbers);
  if (!list.length && accountNumber) list.push(Number(accountNumber));
  const uniqueNumbers = Array.from(new Set(list));

  await dbConnect();

  const now = new Date();
  const durationDays =
    Number.isFinite(days) ? Number(days) :
    (String(plan).toUpperCase() === "DEMO" ? DEFAULT_DEMO_DAYS : 30);

  const expireAt = new Date(now.getTime() + durationDays * 86400 * 1000);

  const lic = await License.create({
    productId,
    accountNumber: uniqueNumbers.length === 1 ? uniqueNumbers[0] : undefined, // giữ tương thích
    accountNumbers: uniqueNumbers,                                            // lưu luôn list
    mode: String(mode).toUpperCase(),
    plan: String(plan).toUpperCase(),
    maxAccounts: Number.isFinite(maxAccounts) ? Number(maxAccounts) : uniqueNumbers.length,
    startAt: now,
    expireAt,
    isActive: true,
    note,
    createdBy
  });

  return NextResponse.json({
    ok: true,
    message: "License activated successfully",
    license: {
      licenseId: String(lic._id),
      productId: lic.productId,
      accounts: lic.accountNumbers?.length ? lic.accountNumbers : [lic.accountNumber],
      maxAccounts: lic.maxAccounts,
      mode: lic.mode,
      plan: lic.plan,
      startAt: lic.startAt,
      expireAt: lic.expireAt,
      isActive: lic.isActive,
      note: lic.note,
      createdBy: lic.createdBy
    }
  });
}
