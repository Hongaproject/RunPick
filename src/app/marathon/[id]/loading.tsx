export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
      {/* 헤더 */}
      <div className="h-8 w-20 bg-gray-200 rounded mb-8" />

      {/* 배너 */}
      <div className="h-48 w-full bg-gray-200 rounded-3xl mb-8" />

      {/* 본문 그리드 */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-100 rounded-2xl p-8 space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="grid sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl p-8 space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="grid sm:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-64 bg-gray-200 rounded-2xl" />
          <div className="h-32 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
