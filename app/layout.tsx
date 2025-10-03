import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "EA Forex LeopardSmart — Giao dịch tự động tối ưu rủi ro",
  description: "EA Forex đa chiến lược (trend + range), quản trị rủi ro, báo cáo minh bạch. Dùng thử demo hoặc mua bản đầy đủ.",
  keywords: "EA Forex, robot forex, expert advisor, MT4, MT5, copy trading",
  authors: [{ name: "EA Forex LeopardSmart" }],
  openGraph: {
    title: "EA Forex LeopardSmart — Giao dịch tự động tối ưu rủi ro",
    description: "EA Forex đa chiến lược (trend + range), quản trị rủi ro, báo cáo minh bạch. Dùng thử demo hoặc mua bản đầy đủ.",
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "EA Forex LeopardSmart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EA Forex LeopardSmart — Giao dịch tự động tối ưu rủi ro",
    description: "EA Forex đa chiến lược (trend + range), quản trị rủi ro, báo cáo minh bạch. Dùng thử demo hoặc mua bản đầy đủ.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
} 