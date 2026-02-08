import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/common/Footer";
import Header from "@/components/common/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RunPick - 전국 마라톤 대회 정보 플랫폼",
  description: "전국 마라톤 대회 정보를 한눈에 확인하세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          {/* 1. 헤더 (고정) */}
          <Header />

          {/* 2. 메인 콘텐츠 (남은 공간 다 차지하기: flex-grow) */}
          <main className="flex-grow bg-gray-50">{children}</main>

          {/* 3. 푸터 (바닥) */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
