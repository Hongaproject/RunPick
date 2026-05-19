"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMarathons } from "@/app/api/marathons";
import { MarathonRace } from "@/types/marathon";
import { MarathonCard } from "@/components/home/MarathonCard";
import { Footer } from "@/components/common/Footer";

export default function FavoritesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [marathons, setMarathons] = useState<MarathonRace[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    getMarathons()
      .then(setMarathons)
      .finally(() => setIsFetching(false));
  }, [user]);

  if (isLoading || !user) return null;

  const favoriteMarathons = marathons.filter((m) =>
    user.favorites.includes(m.id),
  );

  return (
    <div className="flex h-full bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-pink-500 to-red-500 p-3 rounded-xl">
                  <Heart className="w-7 h-7 text-white" fill="white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-gray-900">
                    즐겨찾기
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {favoriteMarathons.length}개의 대회가 저장되어 있습니다
                  </p>
                </div>
              </div>
              <div className="text-xs text-red-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-1 shrink-0">
                🗓️ 매년 1월 1일에 즐겨찾기가 초기화됩니다
              </div>
            </div>
          </div>
        </div>

        {/* 즐겨찾기 리스트 */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {isFetching ? (
              <div className="text-center py-20 text-gray-400">
                불러오는 중...
              </div>
            ) : favoriteMarathons.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <Heart className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  즐겨찾기한 대회가 없습니다
                </h3>
                <p className="text-gray-600 mb-6">
                  관심 있는 마라톤 대회를 즐겨찾기에 추가해보세요!
                </p>
                <Link
                  href="/"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  대회 둘러보기
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteMarathons.map((marathon) => (
                  <MarathonCard key={marathon.id} marathon={marathon} />
                ))}
              </div>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
