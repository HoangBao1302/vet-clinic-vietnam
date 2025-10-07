import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import { AuthProvider } from "@/lib/authContext";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app'),
  title: "EA Forex ThebenchmarkTrader — Giao dịch tự động tối ưu rủi ro",
  description: "EA Forex đa chiến lược (trend + range), quản trị rủi ro, báo cáo minh bạch. Dùng thử demo hoặc mua bản đầy đủ.",
  keywords: "EA Forex, robot forex, expert advisor, MT4, MT5, copy trading",
  authors: [{ name: "EA Forex ThebenchmarkTrader" }],
  icons: {
    icon: [
      { url: '/64.svg', sizes: '64x64', type: 'image/svg+xml' },
      { url: '/128.svg', sizes: '128x128', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/512-512.svg', sizes: '512x512', type: 'image/svg+xml' }
    ],
  },
  openGraph: {
    title: "EA Forex ThebenchmarkTrader — Giao dịch tự động tối ưu rủi ro",
    description: "EA Forex đa chiến lược (trend + range), quản trị rủi ro, báo cáo minh bạch. Dùng thử demo hoặc mua bản đầy đủ.",
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "EA Forex ThebenchmarkTrader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EA Forex ThebenchmarkTrader — Giao dịch tự động tối ưu rủi ro",
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
        <AuthProvider>
          {children}
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
} 