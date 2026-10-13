import { NextRequest, NextResponse } from "next/server";
import { verifyToken, type JWTPayload } from "@/lib/auth";

export function getRequestToken(request: NextRequest): string | null {
  const cookieToken = request.cookies.get("token")?.value;
  if (cookieToken) return cookieToken;

  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    const bearer = header.slice(7).trim();
    if (bearer) return bearer;
  }
  return null;
}

export function requireUser(request: NextRequest):
  | { authorized: true; user: JWTPayload }
  | { authorized: false; response: NextResponse } {
  const token = getRequestToken(request);
  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }),
    };
  }

  const user = verifyToken(token);
  if (!user) {
    return {
      authorized: false,
      response: NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 }),
    };
  }

  return { authorized: true, user };
}

export function requireAdmin(request: NextRequest):
  | { authorized: true; user: JWTPayload }
  | { authorized: false; response: NextResponse } {
  const auth = requireUser(request);
  if (!auth.authorized) return auth;

  if (auth.user.role !== "admin") {
    return {
      authorized: false,
      response: NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 }),
    };
  }

  return auth;
}

export function requireAdminOrStaff(request: NextRequest):
  | { authorized: true; user: JWTPayload }
  | { authorized: false; response: NextResponse } {
  const auth = requireUser(request);
  if (!auth.authorized) return auth;

  if (auth.user.role !== "admin" && auth.user.role !== "staff") {
    return {
      authorized: false,
      response: NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 }),
    };
  }

  return auth;
}

/** Returns an error response when the caller is not an admin; otherwise null. */
export function verifyAdminAccess(request: NextRequest): NextResponse | null {
  const auth = requireAdmin(request);
  if (!auth.authorized) return auth.response;
  return null;
}
