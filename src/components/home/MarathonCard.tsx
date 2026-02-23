import { Calendar, MapPin, Tag } from "lucide-react";
import { Marathon } from "../../types/marathon";

interface MarathonCardProps {
  marathon: Marathon;
  onClick: () => void;
}

const statusLabels = {
  upcoming: "시작 전",
  ongoing: "진행 중",
  ended: "종료",
};

const registrationLabels = {
  before: "접수 전",
  open: "접수 중",
  closed: "접수 마감",
};

const statusColors = {
  upcoming: "bg-blue-50 text-blue-700 border-blue-200",
  ongoing: "bg-green-50 text-green-700 border-green-200",
  ended: "bg-gray-50 text-gray-600 border-gray-200",
};

const registrationColors = {
  before: "bg-yellow-50 text-yellow-700 border-yellow-200",
  open: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-red-50 text-red-700 border-red-200",
};

export function MarathonCard({ marathon, onClick }: MarathonCardProps) {
  // D-day 계산
  const getDday = () => {
    const today = new Date("2026-02-07");
    const eventDate = new Date(marathon.date);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "종료";
    if (diffDays === 0) return "D-Day";
    return `D-${diffDays}`;
  };

  // 접수 마감까지 남은 날짜
  const getRegistrationDaysLeft = () => {
    const today = new Date("2026-02-07");
    const endDate = new Date(marathon.registrationEnd);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return null;
    if (diffDays === 0) return "오늘 마감";
    if (diffDays <= 7) return `${diffDays}일 남음`;
    return null;
  };

  const dday = getDday();
  const registrationDaysLeft = getRegistrationDaysLeft();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-56 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* 상단 배지 */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${statusColors[marathon.status]}`}
          >
            {statusLabels[marathon.status]}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${registrationColors[marathon.registrationStatus]}`}
          >
            {registrationLabels[marathon.registrationStatus]}
          </span>
        </div>

        {/* D-day 표시 */}
        <div className="absolute top-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-sm font-bold text-gray-900">{dday}</span>
          </div>
        </div>

        {/* 접수 마감 임박 알림 */}
        {registrationDaysLeft && marathon.registrationStatus === "open" && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 animate-pulse">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              접수 마감 {registrationDaysLeft}
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
          {marathon.name}
        </h3>

        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 flex-shrink-0 text-blue-600" />
            <span className="text-sm font-medium">
              {new Date(marathon.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "short",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span className="text-sm line-clamp-1">
              {marathon.location} <span className="text-gray-400">·</span>{" "}
              {marathon.region}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Tag className="w-4 h-4 flex-shrink-0 text-purple-600" />
            <div className="flex flex-wrap gap-1.5">
              {marathon.distances.map((distance) => (
                <span
                  key={distance}
                  className="text-xs px-2.5 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-medium rounded-full border border-blue-200"
                >
                  {distance}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
