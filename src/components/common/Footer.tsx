// src/components/common/Footer.tsx
import { Flag } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      {/* 헤더와 동일한 가로폭 및 패딩 설정 (핵심!) 
        max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 왼쪽: 브랜드 로고 + 저작권 (헤더 로고 위치와 라인 일치) */}
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

          {/* 오른쪽: (선택사항) SNS나 이용약관 등을 넣을 공간 */}
          {/* <div className="text-sm text-gray-400">Designed for Runners</div> */}
        </div>
      </div>
    </footer>
  );
}
