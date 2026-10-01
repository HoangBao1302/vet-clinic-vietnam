import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import AffiliateTracker from "@/components/AffiliateTracker";
import { AuthProvider } from "@/lib/authContext";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ThebenchmarkTrader.com'),
  title: "ThebenchmarkTrader Analytics Software — Algorithmic Trading Toolkit for MetaTrader",
  description: "Phần mềm phân tích thuật toán và bộ công cụ thống kê biểu đồ cho MetaTrader. Historical simulation, quản trị rủi ro toán học, tối ưu danh mục.",
  keywords: "ThebenchmarkTrader Analytics Software, Algorithmic Trading Toolkit, MetaTrader, MT4®, MT5®, chart statistics, historical simulation",
  authors: [{ name: "ThebenchmarkTrader Analytics Software" }],
  icons: {
    icon: [
      { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { url: '/favicon.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/favicon.svg', sizes: '16x16', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/favicon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.svg'
  },
  openGraph: {
    title: "ThebenchmarkTrader Analytics Software — Algorithmic Trading Toolkit for MetaTrader",
    description: "Phần mềm phân tích thuật toán và bộ công cụ thống kê biểu đồ cho MetaTrader. Historical simulation, quản trị rủi ro toán học, tối ưu danh mục.",
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "ThebenchmarkTrader Analytics Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ThebenchmarkTrader Analytics Software — Algorithmic Trading Toolkit for MetaTrader",
    description: "Phần mềm phân tích thuật toán và bộ công cụ thống kê biểu đồ cho MetaTrader. Historical simulation, quản trị rủi ro toán học, tối ưu danh mục.",
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
        <LocaleProvider>
          <AuthProvider>
            {children}
            <ChatWidget />
            <AffiliateTracker />
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
} 