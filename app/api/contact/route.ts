import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

// --- Rate limit rất nhẹ trong memory (reset khi server restart)
const BUCKET = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000; // 1 phút
const LIMIT_PER_WINDOW = 8;

function ratelimit(ip: string) {
  const now = Date.now();
  const rec = BUCKET.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    BUCKET.set(ip, { count: 1, ts: now });
    return true;
  }
  if (rec.count >= LIMIT_PER_WINDOW) return false;
  rec.count++;
  return true;
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(request: NextRequest) {
  try {
    // Honeypot chống bot: nếu có tham số ?hp=1 thì bỏ qua (coi như thành công)
    const hp = request.nextUrl.searchParams.get("hp");
    if (hp) return NextResponse.json({ ok: true }, { status: 200 });

    const ip =
      (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      request.headers.get("cf-connecting-ip") ||
      "unknown";

    if (!ratelimit(ip)) {
      return NextResponse.json(
        { ok: false, error: "Bạn gửi quá nhanh, thử lại sau 1 phút." },
        { status: 429 }
      );
    }

    // Đọc body an toàn
    const body = await request.json().catch(() => ({} as any));
    let { name, email, topic, message } = body as {
      name?: string;
      email?: string;
      topic?: string;
      message?: string;
    };

    // Validate cơ bản
    if (!name || !email || !topic) {
      return NextResponse.json(
        { ok: false, error: "Vui lòng điền đầy đủ thông tin bắt buộc." },
        { status: 400 }
      );
    }
    name = name.trim();
    email = email.trim();
    topic = topic.trim();
    message = (message ?? "").toString();

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { ok: false, error: "Tên chưa hợp lệ (2–100 ký tự)." },
        { status: 400 }
      );
    }
    if (!isEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Email không hợp lệ." },
        { status: 400 }
      );
    }
    if (message.length > 5000) {
      return NextResponse.json(
        { ok: false, error: "Tin nhắn quá dài (tối đa 5000 ký tự)." },
        { status: 400 }
      );
    }

    // Chuẩn hoá topic
    const topicMap: Record<string, string> = {
      demo: "Tải Demo miễn phí",
      purchase: "Mua EA đầy đủ",
      support: "Hỗ trợ kỹ thuật",
      custom: "Tùy chỉnh EA",
    };
    const topicText = topicMap[topic] || topic;

    // Email HTML (đã escape)
    const subject = `[EA ThebenchmarkTrader] ${topicText} - ${escapeHtml(name)}`;
    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;line-height:1.6">
        <h2 style="color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:8px;margin:0 0 12px">
          Yêu cầu mới từ website EA ThebenchmarkTrader
        </h2>
        <p><b>IP:</b> ${escapeHtml(ip)}</p>
        <div style="background:#f8fafc;padding:16px;border-radius:8px;margin:16px 0">
          <p><b>Họ tên:</b> ${escapeHtml(name)}</p>
          <p><b>Email:</b> ${escapeHtml(email)}</p>
          <p><b>Nhu cầu:</b> ${escapeHtml(topicText)}</p>
        </div>
        ${
          message
            ? `<div style="background:#fff;padding:16px;border-left:4px solid #1e40af;margin:16px 0">
                <p><b>Tin nhắn:</b></p>
                <pre style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</pre>
              </div>`
            : ""
        }
        <div style="margin-top:16px;padding-top:12px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px">
          <p>Email này được gửi từ form liên hệ trên website EA ThebenchmarkTrader</p>
          <p>Thời gian: ${escapeHtml(new Date().toLocaleString("vi-VN"))}</p>
        </div>
      </div>
    `;

    // Send email using Nodemailer (same as auth system)
    const emailResult = await sendEmail({
      to: process.env.SMTP_FROM || 'support@ThebenchmarkTrader.com',
      subject,
      html,
    });

    if (!emailResult.success) {
      console.error("Email send error:", emailResult.error);
      return NextResponse.json(
        { ok: false, error: "Gửi email thất bại. Vui lòng thử lại sau." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { ok: false, error: "Đã xảy ra lỗi máy chủ." },
      { status: 500 }
    );
  }
}

// (Tuỳ) Cho phép preflight CORS nếu cần gửi từ domain khác
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}


