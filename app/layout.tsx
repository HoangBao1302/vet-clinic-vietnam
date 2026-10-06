import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import AffiliateTracker from "@/components/AffiliateTracker";
import { AuthProvider } from "@/lib/authContext";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ThebenchmarkTrader.com'),
  title: "ThebenchmarkTrader - Trading Data Analysis & Computational Software Tools",
  description: "Multi-strategy analytical software with scientific risk management. Efficient and transparent trading data automation.",
  keywords: "trading data analysis, computational software, analytical tools, MetaTrader 4, MetaTrader 5, indicators",
  authors: [{ name: "ThebenchmarkTrader" }],
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
    title: "ThebenchmarkTrader - Trading Data Analysis & Computational Software Tools",
    description: "Multi-strategy analytical software with scientific risk management. Efficient and transparent trading data automation.",
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "ThebenchmarkTrader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ThebenchmarkTrader - Trading Data Analysis & Computational Software Tools",
    description: "Multi-strategy analytical software with scientific risk management. Efficient and transparent trading data automation.",
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