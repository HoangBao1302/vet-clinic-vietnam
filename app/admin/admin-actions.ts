"use server";

import { dbConnect } from "@/lib/mongodb";
import License from "@/lib/models/License";

function parseAccounts(input: string): number[] {
  if (!input) return [];
  return input
    .split(/[,\s]+/)
    .map(s => Number(s.trim()))
    .filter(Number.isFinite);
}

export async function listRecentLicenses() {
  await dbConnect();
  const data = await License.find().sort({ updatedAt: -1 }).limit(50).lean();
  return JSON.parse(JSON.stringify(data));
}

export async function searchLicenses(productId: string, accountNumber?: number) {
  await dbConnect();
  const q: any = {};
  if (productId) q.productId = productId;
  if (accountNumber) {
    q.$or = [{ accountNumber: Number(accountNumber) }, { accountNumbers: { $in: [Number(accountNumber)] } }];
  }
  const data = await License.find(q).sort({ updatedAt: -1 }).limit(200).lean();
  return JSON.parse(JSON.stringify(data));
}

export async function createDemo(productId: string, accountNumber: number, note = "") {
  await dbConnect();
  const now = new Date();
  const expireAt = new Date(now.getTime() + 60 * 86400 * 1000);
  const lic = await License.create({
    productId,
    accountNumber: Number(accountNumber),
    accountNumbers: [Number(accountNumber)],
    mode: "BOTH",
    plan: "DEMO",
    maxAccounts: 1,
    startAt: now,
    expireAt,
    isActive: true,
    note,
    createdBy: "admin_page"
  });
  return JSON.parse(JSON.stringify(lic));
}

export async function createLicenseMulti(params: {
  productId: string;
  accountsCSV: string;
  plan?: string;
  mode?: string;
  days?: number;
  maxAccounts?: number;
  note?: string;
}) {
  await dbConnect();
  const list = parseAccounts(params.accountsCSV);
  if (!params.productId || list.length === 0) throw new Error("MISSING_PARAMS");

  const now = new Date();
  const duration = Number.isFinite(params.days)
    ? Number(params.days)
    : (String(params.plan || "DEMO").toUpperCase() === "DEMO" ? 60 : 30);

  const expireAt = new Date(now.getTime() + duration * 86400 * 1000);
  const lic = await License.create({
    productId: params.productId,
    accountNumber: list.length === 1 ? list[0] : undefined,
    accountNumbers: list,
    mode: (params.mode || "BOTH").toUpperCase(),
    plan: (params.plan || "DEMO").toUpperCase(),
    maxAccounts: Number.isFinite(params.maxAccounts) ? Number(params.maxAccounts) : list.length,
    startAt: now,
    expireAt,
    isActive: true,
    note: params.note || "",
    createdBy: "admin_page"
  });

  return JSON.parse(JSON.stringify(lic));
}

export async function revokeLicense(productId: string, accountNumber: number, note = "") {
  await dbConnect();
  const lic = await License.findOne({
    productId,
    $or: [{ accountNumber: Number(accountNumber) }, { accountNumbers: { $in: [Number(accountNumber)] } }]
  });
  if (!lic) throw new Error("NOT_FOUND");
  lic.isActive = false;
  if (note) lic.note = note;
  await lic.save();
  return true;
}

export async function extendLicense(productId: string, accountNumber: number, days: number, note = "") {
  await dbConnect();
  const lic = await License.findOne({
    productId,
    $or: [{ accountNumber: Number(accountNumber) }, { accountNumbers: { $in: [Number(accountNumber)] } }]
  });
  if (!lic) throw new Error("NOT_FOUND");
  const base = lic.expireAt && new Date(lic.expireAt) > new Date() ? new Date(lic.expireAt) : new Date();
  lic.expireAt = new Date(base.getTime() + Number(days) * 86400 * 1000);
  if (note) lic.note = note;
  await lic.save();
  return JSON.parse(JSON.stringify(lic));
}
