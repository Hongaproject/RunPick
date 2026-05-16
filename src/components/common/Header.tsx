"use client";
import { useAuth } from "@/context/AuthContext";
import {
  Flag,
  Menu,
  X,
  Home,
  MessageSquare,
  Heart,
  User,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // RouterContext 대체
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // currentPage 대체
  const { user } = useAuth();

  // 로그인/회원가입 페이지에서는 Header를 렌더링하지 않음
  if (pathname === "/login" || pathname === "/signup") return null;

  const menuItems = [
    { label: "대회목록", icon: Home, href: "/" },
    { label: "커뮤니티", icon: MessageSquare, href: "/community" },
    { label: "즐겨찾기", icon: Heart, href: "/favorites" },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* 로고 */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
              <Flag className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">RunPick</h1>
              <p className="text-blue-100 text-sm mt-0.5 hidden sm:block">
                전국 마라톤 대회 정보 플랫폼
              </p>
            </div>
          </Link>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}

            {user ? (
              <Link
                href="/mypage"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  pathname === "/mypage"
                    ? "bg-white/20 text-white"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                <User className="w-5 h-5" />
                {user.name}
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg font-bold hover:bg-white/30 transition-all"
              >
                <LogIn className="w-5 h-5" />
                로그인
              </Link>
            )}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="메뉴"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}

              {user ? (
                <Link
                  href="/mypage"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    pathname === "/mypage"
                      ? "bg-white/20 text-white"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <User className="w-5 h-5" />
                  마이페이지
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 bg-white/20 px-4 py-3 rounded-lg font-bold hover:bg-white/30 transition-all"
                >
                  <LogIn className="w-5 h-5" />
                  로그인
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
