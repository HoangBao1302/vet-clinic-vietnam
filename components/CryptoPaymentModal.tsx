"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Loader2, X } from "lucide-react";

type CryptoPaymentModalProps = {
  orderId: string;
  productId: string;
  payAddress: string;
  payAmount: string | number;
  payCurrency?: string;
  onClose: () => void;
};

function cryptoLabel(payCurrency?: string) {
  const code = (payCurrency || "usdttrc20").toLowerCase();
  if (code === "trx") return { title: "Thanh toán TRX (Tron)", ticker: "TRX", network: "Chỉ chuyển đúng mạng Tron (TRX)" };
  return { title: "Thanh toán USDT (TRC20)", ticker: "USDT", network: "Chỉ chuyển đúng mạng Tron TRC20" };
}

export default function CryptoPaymentModal({
  orderId,
  productId,
  payAddress,
  payAmount,
  payCurrency,
  onClose,
}: CryptoPaymentModalProps) {
  const [copied, setCopied] = useState<"address" | "amount" | "">("");
  const [status, setStatus] = useState("waiting");

  const copy = async (value: string, field: "address" | "amount") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(field);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setCopied("");
    }
  };

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const response = await fetch(`/api/crypto/status?orderId=${encodeURIComponent(orderId)}`);
        const data = await response.json();
        if (cancelled) return;
        if (data.status) setStatus(data.status);
        if (data.paid) {
          window.location.href = `/downloads/success?payment_method=crypto&order=${encodeURIComponent(orderId)}&productId=${encodeURIComponent(productId)}`;
        }
      } catch {
        // Keep waiting; webhook or the next poll can still complete the order.
      }
    };

    void poll();
    const timer = window.setInterval(poll, 10000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [orderId, productId]);

  const amountText = String(payAmount);
  const coin = cryptoLabel(payCurrency);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payAddress)}`;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
            ₮
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{coin.title}</h3>
            <p className="text-xs text-gray-500">{coin.network}</p>
          </div>
        </div>

        <div className="mb-4 flex justify-center">
          <img src={qrSrc} alt={`${coin.ticker} QR`} width={220} height={220} className="rounded-lg border" />
        </div>

        <label className="mb-1 block text-xs font-semibold text-gray-600">Địa chỉ ví</label>
        <div className="mb-4 flex items-center gap-2">
          <code className="flex-1 break-all rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-800">
            {payAddress}
          </code>
          <button
            type="button"
            onClick={() => copy(payAddress, "address")}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white"
          >
            {copied === "address" ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <label className="mb-1 block text-xs font-semibold text-gray-600">Số {coin.ticker} cần chuyển (đã gồm phí mạng)</label>
        <div className="mb-4 flex items-center gap-2">
          <code className="flex-1 rounded-lg bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">
            {amountText} {coin.ticker}
          </code>
          <button
            type="button"
            onClick={() => copy(amountText, "amount")}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white"
          >
            {copied === "amount" ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <p className="mb-5 text-xs text-amber-800">
          Quét QR chỉ chứa địa chỉ ví. Chuyển đúng số trên (gói + phí NOWPayments) mạng TRC20.
        </p>

        <div className="flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-3 text-sm text-blue-800">
          <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />
          <p className="animate-pulse">
            Đang chờ mạng lưới Blockchain xác thực giao dịch... Vui lòng không đóng trình duyệt
            {status && status !== "waiting" ? ` (${status})` : ""} [NowPayments]
          </p>
        </div>
      </div>
    </div>
  );
}
