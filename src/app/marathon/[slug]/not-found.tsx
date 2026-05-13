import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-6xl">🏃</p>
      <h1 className="text-2xl font-bold text-gray-800">대회를 찾을 수 없어요</h1>
      <p className="text-gray-500">삭제되었거나 잘못된 주소예요.</p>
      <Link
        href="/"
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
