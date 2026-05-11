import {
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  ExternalLink,
  Share2,
  Clock,
  Award,
  Info,
  AlertCircle,
} from "lucide-react";
import { Marathon } from "../../types/marathon";

interface MarathonDetailProps {
  marathon: Marathon;
  onBack: () => void;
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

export function MarathonDetail({ marathon, onBack }: MarathonDetailProps) {
  // D-day 계산
  const getDday = () => {
    const today = new Date();
    const eventDate = new Date(marathon.date);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "종료", color: "text-gray-600" };
    if (diffDays === 0) return { text: "D-Day", color: "text-red-600" };
    if (diffDays <= 7) return { text: `D-${diffDays}`, color: "text-red-600" };
    return { text: `D-${diffDays}`, color: "text-blue-600" };
  };

  const dday = getDday();

  const handleShare = async () => {
    const shareData = {
      title: marathon.name,
      text: `${marathon.name} - ${marathon.location}에서 ${new Date(marathon.date).toLocaleDateString("ko-KR")}에 개최됩니다!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("공유 취소됨");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다!");
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* 고정 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              aria-label="뒤로 가기"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold flex-1 truncate">
              대회 상세 정보
            </h1>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              aria-label="공유하기"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 대회 헤더 섹션 */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl overflow-hidden mb-8 shadow-xl p-8 sm:p-10">
          {/* 배지 및 D-day */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex gap-3 flex-wrap">
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold border-2 backdrop-blur-md ${statusColors[marathon.status]}`}
              >
                {statusLabels[marathon.status]}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold border-2 backdrop-blur-md ${registrationColors[marathon.registrationStatus]}`}
              >
                {registrationLabels[marathon.registrationStatus]}
              </span>
            </div>
            <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-lg flex-shrink-0">
              <span className={`text-2xl font-black ${dday.color}`}>
                대회 시작 {dday.text}
              </span>
            </div>
          </div>

          {/* 대회명 */}
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            {marathon.name}
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 왼쪽: 주요 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 핵심 정보 카드 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Info className="w-7 h-7 text-blue-600" />
                핵심 정보
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                  <div className="bg-blue-600 p-3 rounded-xl">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-blue-900 mb-1">
                      대회 일시
                    </div>
                    <div className="font-bold text-gray-900">
                      {new Date(marathon.date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {new Date(marathon.date).toLocaleDateString("ko-KR", {
                        weekday: "long",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl border border-red-200">
                  <div className="bg-red-600 p-3 rounded-xl">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-red-900 mb-1">
                      장소
                    </div>
                    <div className="font-bold text-gray-900">
                      {marathon.location}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {marathon.region}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200 sm:col-span-2">
                  <div className="bg-green-600 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-green-900 mb-1">
                      접수 기간
                    </div>
                    <div className="font-bold text-gray-900 text-sm">
                      {new Date(marathon.registrationStart).toLocaleDateString(
                        "ko-KR",
                        { month: "short", day: "numeric" },
                      )}
                      {" ~ "}
                      {new Date(marathon.registrationEnd).toLocaleDateString(
                        "ko-KR",
                        { month: "short", day: "numeric" },
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 종목 및 참가비 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Tag className="w-7 h-7 text-blue-600" />
                종목 및 참가비
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {marathon.distances.map((distance) => (
                  <div
                    key={distance}
                    className="group relative overflow-hidden border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full -mr-8 -mt-8" />
                    <div className="relative">
                      <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-bold mb-3">
                        {distance}
                      </div>
                      <div className="text-3xl font-black text-gray-900 mb-1">
                        {marathon.entryFee[distance]?.toLocaleString()}
                        <span className="text-lg text-gray-600 ml-1">원</span>
                      </div>
                      <div className="text-sm text-gray-500">참가비</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 사이드바 */}
          <div className="space-y-6">
            {/* 신청 CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl sticky top-24">
              <h3 className="text-xl font-bold mb-4">참가 신청</h3>
              <div className="space-y-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  {marathon.registrationStatus === "closed" ? (
                    // 접수 마감 상태일 때
                    <div className="text-xl font-black text-center py-2">
                      접수가 마감되었습니다
                    </div>
                  ) : (
                    // 접수 중이거나 접수 전일 때
                    <>
                      <div className="text-sm text-white/80 mb-1">
                        {marathon.registrationStatus === "before"
                          ? "접수 시작까지"
                          : "접수 마감까지"}
                      </div>
                      <div className="text-2xl font-black">
                        {(() => {
                          const today = new Date(); // 하드코딩된 "2026-02-07" 대신 현재 날짜 사용
                          const targetDate =
                            marathon.registrationStatus === "before"
                              ? new Date(marathon.registrationStart)
                              : new Date(marathon.registrationEnd);

                          const diffTime =
                            targetDate.getTime() - today.getTime();
                          const diffDays = Math.ceil(
                            diffTime / (1000 * 60 * 60 * 24),
                          );

                          return diffDays > 0
                            ? `${diffDays}일 남음`
                            : "오늘 마감";
                        })()}
                      </div>
                    </>
                  )}
                </div>

                {/* 버튼 섹션 - 마감 시 스타일 변경 (선택 사항) */}
                <a
                  href={marathon.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-4 px-6 rounded-xl font-bold text-center transition-colors shadow-lg flex items-center justify-center gap-2 ${
                    marathon.registrationStatus === "closed"
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed" // 마감 시 회색 처리
                      : "bg-white text-blue-600 hover:bg-blue-50 cursor-pointer"
                  }`}
                >
                  {marathon.registrationStatus === "closed"
                    ? "신청이 종료되었습니다"
                    : "공식 홈페이지에서 신청"}
                  <ExternalLink className="w-5 h-5" />
                </a>

                <button
                  onClick={handleShare}
                  className="w-full bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-5 h-5" />
                  친구에게 공유하기
                </button>
              </div>
            </div>

            {/* 주최자 정보 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-orange-600" />
                주최자 정보
              </h3>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">주최</div>
                  <div className="font-bold text-gray-900 text-lg">
                    {marathon.organizer}
                  </div>
                </div>
              </div>
            </div>

            {/* 안내 사항 */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                안내사항
              </h4>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex gap-2">
                  <span className="text-amber-600">•</span>
                  <span>참가 신청은 공식 홈페이지에서 진행됩니다</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600">•</span>
                  <span>참가비는 환불 정책에 따라 처리됩니다</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600">•</span>
                  <span>기상 악화 시 일정이 변경될 수 있습니다</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
