import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/authCookie";

export async function POST() {
  const response = NextResponse.json({ success: true });
  return clearAuthCookie(response);
}
