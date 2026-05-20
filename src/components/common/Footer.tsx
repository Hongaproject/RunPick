"use client";

import { Flag, Mail, Eye } from "lucide-react";
import Link from "next/link";
import { usePageViews } from "@/hooks/usePageViews";

export function Footer() {
  const { total, today, yesterday } = usePageViews();

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 왼쪽: 브랜드 */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Flag className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-bold text-gray-900 text-lg">RunPick</span>
              <span className="text-sm text-gray-500 hidden sm:block">|</span>
              <p className="text-sm text-gray-500">
                Copyright © 2026 RunPick. All rights reserved.
              </p>
            </div>
          </div>

          {/* 가운데: 방문자 수 */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Eye className="w-3.5 h-3.5" />
            <span>
              Total{" "}
              <span className="font-semibold text-gray-600">
                {total.toLocaleString()}
              </span>
            </span>
            <span className="text-gray-300">|</span>
            <span>
              Today{" "}
              <span className="font-semibold text-gray-600">
                {today.toLocaleString()}
              </span>
            </span>
            <span className="text-gray-300">|</span>
            <span>
              Yesterday{" "}
              <span className="font-semibold text-gray-600">
                {yesterday.toLocaleString()}
              </span>
            </span>
          </div>

          {/* 오른쪽: 문의하기 */}
          <Link
            href="/contact"
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors group"
          >
            <Mail className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
            문의하기
          </Link>
        </div>
      </div>
    </footer>
  );
}
