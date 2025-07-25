import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phòng Khám Thú Y PawCare - Chăm Sóc Thú Cưng Chuyên Nghiệp tại TP. Hồ Chí Minh",
  description: "Phòng khám thú y đáng tin cậy tại TP. Hồ Chí Minh cung cấp dịch vụ chăm sóc thú cưng toàn diện. Đặt lịch hẹn ngay hôm nay để nhận dịch vụ thú y chuyên nghiệp.",
  keywords: "phòng khám thú y, chăm sóc thú cưng, TP. Hồ Chí Minh, bệnh viện động vật, dịch vụ thú y",
  authors: [{ name: "Phòng Khám Thú Y PawCare" }],
  openGraph: {
    title: "Phòng Khám Thú Y PawCare - Chăm Sóc Thú Cưng Chuyên Nghiệp",
    description: "Phòng khám thú y đáng tin cậy tại TP. Hồ Chí Minh cung cấp dịch vụ chăm sóc thú cưng toàn diện.",
    type: "website",
    locale: "vi_VN",
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
      <body className="antialiased">{children}</body>
    </html>
  );
} 