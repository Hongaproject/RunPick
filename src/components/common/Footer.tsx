import { Flag, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
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

          {/* 오른쪽: 문의하기 링크 */}
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
