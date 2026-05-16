import { Calendar, MapPin, Tag, Heart } from "lucide-react";
import { MarathonRace } from "@/types/marathon";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface MarathonCardProps {
  marathon: MarathonRace;
}

export function MarathonCard({ marathon }: MarathonCardProps) {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const router = useRouter();

  const today = new Date();
  const registrationEnd = new Date(marathon.applicationEndDate);
  const raceDate = new Date(marathon.raceDate);

  const isOpen = today <= registrationEnd;
  const daysLeft = Math.ceil(
    (registrationEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  const getDday = () => {
    const diff = Math.ceil(
      (raceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff < 0) return "종료";
    if (diff === 0) return "D-Day";
    return `D-${diff}`;
  };

  const dday = getDday();
  const raceTypes = marathon.raceTypeList
    .split(/[,\/]/)
    .map((t) => t.trim())
    .filter(Boolean);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    toggleFavorite(marathon.id);
  };

  return (
    <Link href={`/marathon/${marathon.id}`}>
      <div className="relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
        <div className="p-5">
          {/* 상태 배지 + D-day */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex gap-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  isOpen
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {isOpen ? "접수 중" : "접수 마감"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                {marathon.regionCategory}
              </span>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-full flex-shrink-0">
              <span className="text-sm font-bold text-gray-900">{dday}</span>
            </div>
          </div>

          {/* 마감 임박 배너 */}
          {isOpen && daysLeft <= 7 && (
            <div className="mb-4">
              <div className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                접수 마감 {daysLeft === 0 ? "오늘" : `${daysLeft}일 남음`}
              </div>
            </div>
          )}

          {/* 대회명 */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
            {marathon.raceName}
          </h3>

          {/* 날짜 / 장소 / 종목 + 즐겨찾기 */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 flex-shrink-0 text-blue-600" />
              <span className="text-sm font-medium">
                {raceDate.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span className="text-sm line-clamp-1">{marathon.place}</span>
            </div>

            {/* 종목 태그 + 즐겨찾기 버튼 같은 줄 */}
            <div className="flex items-center justify-between gap-2 text-gray-600">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Tag className="w-4 h-4 flex-shrink-0 text-purple-600" />
                <div className="flex flex-wrap gap-1.5">
                  {raceTypes.map((type) => (
                    <span
                      key={type}
                      className="text-xs px-2.5 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-medium rounded-full border border-blue-200"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* 즐겨찾기 버튼 */}
              <button
                onClick={handleFavoriteClick}
                className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    user && isFavorite(marathon.id)
                      ? "text-red-500 fill-red-500"
                      : "text-gray-400 hover:text-red-400"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
