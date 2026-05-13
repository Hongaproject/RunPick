import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import { Providers } from "@/app/providers";

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
        <Providers>
          {/* ✨ 핵심 1: h-screen과 overflow-hidden으로 화면을 꽉 채우고 브라우저 스크롤을 막습니다. */}
          <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
            {/* 상단 헤더 */}
            <Header />

            {/* ✨ 핵심 2: 남은 공간을 다 차지하는 컨테이너 (여기도 스크롤 막음) */}
            <main className="flex-1 overflow-hidden">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
