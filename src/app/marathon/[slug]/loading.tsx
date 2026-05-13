export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse">
      {/* 뒤로가기 */}
      <div className="h-4 w-20 bg-gray-200 rounded mb-8" />

      {/* 타이틀 */}
      <div className="h-8 w-3/4 bg-gray-200 rounded mb-4" />

      {/* 배지들 */}
      <div className="flex gap-2 mb-8">
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
      </div>

      {/* 정보 카드 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl p-4">
            <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-5 w-32 bg-gray-300 rounded" />
          </div>
        ))}
      </div>

      {/* 소개 */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-4 w-4/6 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
