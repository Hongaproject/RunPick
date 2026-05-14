"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-6xl">⚠️</p>
      <h1 className="text-2xl font-bold text-gray-800">문제가 발생했어요</h1>
      <p className="text-gray-500 text-sm max-w-sm">
        대회 정보를 불러오는 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.
      </p>
      <div className="flex gap-3 mt-2">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          다시 시도
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          홈으로
        </button>
      </div>
    </div>
  );
}
