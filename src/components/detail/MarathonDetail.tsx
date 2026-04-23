import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Tag,
  ExternalLink,
  Share2,
  Clock,
  Award,
  Info,
  CheckCircle2,
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
  const participationRate = Math.round(
    (marathon.currentParticipants / marathon.maxParticipants) * 100,
  );

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
      // Fallback: 클립보드에 복사
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold flex-1">대회 상세 정보</h1>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 메인 이미지 */}
        <div className="relative h-64 sm:h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColors[marathon.status]}`}
            >
              {statusLabels[marathon.status]}
            </span>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium border ${registrationColors[marathon.registrationStatus]}`}
            >
              {registrationLabels[marathon.registrationStatus]}
            </span>
          </div>
        </div>

        {/* 대회명 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {marathon.name}
          </h2>
          <p className="text-lg text-gray-600">{marathon.description}</p>
        </div>

        {/* 기본 정보 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" />
            기본 정보
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <div className="font-medium text-gray-900 mb-1">대회 일시</div>
                <div className="text-gray-600">
                  {new Date(marathon.date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <div className="font-medium text-gray-900 mb-1">장소</div>
                <div className="text-gray-600">{marathon.location}</div>
                <div className="text-sm text-gray-500">{marathon.region}</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <div className="font-medium text-gray-900 mb-1">접수 기간</div>
                <div className="text-gray-600">
                  {new Date(marathon.registrationStart).toLocaleDateString(
                    "ko-KR",
                  )}{" "}
                  ~{" "}
                  {new Date(marathon.registrationEnd).toLocaleDateString(
                    "ko-KR",
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-2">참가 인원</div>
                <div className="text-gray-600 mb-3">
                  {marathon.currentParticipants.toLocaleString()} /{" "}
                  {marathon.maxParticipants.toLocaleString()}명 (
                  {participationRate}%)
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${participationRate}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Award className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <div className="font-medium text-gray-900 mb-1">주최</div>
                <div className="text-gray-600">{marathon.organizer}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 종목 및 참가비 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Tag className="w-6 h-6 text-blue-600" />
            종목 및 참가비
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {marathon.distances.map((distance) => (
              <div
                key={distance}
                className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 transition-colors"
              >
                <div className="text-lg font-bold text-gray-900 mb-2">
                  {distance}
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {marathon.entryFee[distance]?.toLocaleString()}원
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 코스 정보 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">코스 정보</h3>
          <p className="text-gray-600">{marathon.course}</p>
        </div>

        {/* 혜택 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            참가 혜택
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {marathon.benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={marathon.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl font-bold text-center hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            공식 홈페이지 방문
            <ExternalLink className="w-5 h-5" />
          </a>
          <button
            onClick={handleShare}
            className="sm:w-auto bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            공유하기
          </button>
        </div>
      </div>
    </div>
  );
}
