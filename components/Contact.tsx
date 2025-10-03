"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Topic = "demo" | "purchase" | "support" | "custom";

type Props = {
  /** Mặc định chọn topic nào khi render (có thể bị override bởi query ?topic=...) */
  defaultTopic?: Topic;
  /** Dạng compact (nhỏ gọn) cho Pricing page */
  compact?: boolean;
  /** id của anchor để scroll (#contact) */
  anchorId?: string;
};

export default function ContactForm({
  defaultTopic = "demo",
  compact = false,
  anchorId = "contact",
}: Props) {
  const searchParamsTopic = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const t = new URLSearchParams(window.location.search).get("topic");
    return (["demo", "purchase", "support", "custom"] as Topic[]).includes(
      t as Topic
    )
      ? (t as Topic)
      : undefined;
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<Topic>(searchParamsTopic || defaultTopic);
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(""); // honeypot, luôn để trống
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok?: boolean; error?: string } | null>(
    null
  );

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    // nếu URL có ?topic=..., override prop defaultTopic
    if (searchParamsTopic) setTopic(searchParamsTopic);
  }, [searchParamsTopic]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    // validate nhẹ
    if (!name || name.trim().length < 2) {
      setResult({ ok: false, error: "Vui lòng nhập họ tên (≥ 2 ký tự)." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setResult({ ok: false, error: "Email không hợp lệ." });
      return;
    }

    setSubmitting(true);
    try {
      const qs = hp ? `?hp=${encodeURIComponent(hp)}` : "";
      const res = await fetch(`/api/contact${qs}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setResult({
          ok: false,
          error: data?.error || "Gửi thất bại, vui lòng thử lại.",
        });
      } else {
        setResult({ ok: true });
        formRef.current?.reset();
        setName("");
        setEmail("");
        setTopic(defaultTopic);
        setMessage("");
      }
    } catch (err) {
      setResult({ ok: false, error: "Lỗi mạng, vui lòng thử lại." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id={anchorId} className="scroll-mt-24">
      <div className={compact ? "max-w-2xl mx-auto" : "max-w-3xl mx-auto"}>
        {!compact && (
          <header className="mb-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold">
              Liên hệ & Nhận Demo
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Điền thông tin bên dưới—chúng tôi sẽ liên hệ sớm nhất.
            </p>
          </header>
        )}

        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="bg-white/70 backdrop-blur rounded-2xl border border-gray-200 p-5 md:p-6 space-y-4"
        >
          {/* Honeypot (ẩn) */}
          <input
            type="text"
            name="hp"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium">Họ tên *</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Nguyễn Văn A"
                aria-label="Họ tên"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Email *</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="you@example.com"
                aria-label="Email"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium">Nhu cầu *</span>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value as Topic)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Nhu cầu"
            >
              <option value="demo">Tải Demo miễn phí</option>
              <option value="purchase">Mua EA đầy đủ</option>
              <option value="support">Hỗ trợ kỹ thuật</option>
              <option value="custom">Tùy chỉnh EA</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium">Tin nhắn</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={compact ? 4 : 6}
              maxLength={5000}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Mô tả ngắn nhu cầu của bạn…"
              aria-label="Tin nhắn"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tối đa 5000 ký tự. Thông tin của bạn được bảo mật.
            </p>
          </label>

          {result?.error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {result.error}
            </div>
          )}
          {result?.ok && (
            <div
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700"
            >
              Đã gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              aria-label="Gửi liên hệ"
            >
              {submitting ? "Đang gửi…" : "Gửi liên hệ"}
            </button>

            <p className="text-xs text-gray-500">
              Bằng cách gửi, bạn đồng ý với điều khoản & chính sách bảo mật.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
