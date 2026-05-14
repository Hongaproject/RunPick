"use client";

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
  Phone,
  Mail,
  Globe,
  Users,
} from "lucide-react";
import { MarathonRace } from "@/types/marathon";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const KakaoMap = dynamic(() => import("./KakaoMap"), { ssr: false });

interface MarathonDetailProps {
  marathon: MarathonRace;
}

export default function MarathonDetail({ marathon }: MarathonDetailProps) {
  const router = useRouter();

  const registrationEnd = new Date(marathon.applicationEndDate);
  const registrationStart = new Date(marathon.applicationStartDate);
  const eventDate = new Date(marathon.raceDate);
  const today = new Date();

  const isOpen = today <= registrationEnd && today >= registrationStart;
  const isBefore = today < registrationStart;
  const isClosed = today > registrationEnd;

  const getDday = () => {
    const diffDays = Math.ceil(
      (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays < 0) return { text: "종료", color: "text-gray-600" };
    if (diffDays === 0) return { text: "D-Day", color: "text-red-600" };
    if (diffDays <= 7) return { text: `D-${diffDays}`, color: "text-red-600" };
    return { text: `D-${diffDays}`, color: "text-blue-600" };
  };

  const dday = getDday();

  const handleShare = async () => {
    const shareData = {
      title: marathon.raceName,
      text: `${marathon.raceName} - ${marathon.place}에서 ${eventDate.toLocaleDateString("ko-KR")}에 개최됩니다!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
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
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold flex-1 truncate">
              대회 상세 정보
            </h1>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 배너 */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl overflow-hidden mb-8 shadow-xl p-8 sm:p-10">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex gap-3 flex-wrap">
              <span className="px-4 py-2 rounded-full text-sm font-bold border-2 backdrop-blur-md bg-white/20 text-white border-white/30">
                {marathon.regionCategory}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold border-2 backdrop-blur-md ${
                  isOpen
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : isBefore
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {isOpen ? "접수 중" : isBefore ? "접수 전" : "접수 마감"}
              </span>
            </div>
            <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-lg flex-shrink-0">
              <span className={`text-2xl font-black ${dday.color}`}>
                대회 시작 {dday.text}
              </span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {marathon.raceName}
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* 왼쪽 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 핵심 정보 */}
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
                      {eventDate.toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {marathon.raceStart ||
                        eventDate.toLocaleDateString("ko-KR", {
                          weekday: "long",
                        })}{" "}
                      출발
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
                      {marathon.place || "-"}
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
                      {registrationStart.toLocaleDateString("ko-KR", {
                        month: "short",
                        day: "numeric",
                      })}
                      {" ~ "}
                      {registrationEnd.toLocaleDateString("ko-KR", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 종목 및 참가비 */}
            {marathon.fares && Object.keys(marathon.fares).length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Tag className="w-7 h-7 text-blue-600" />
                  종목 및 참가비
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(marathon.fares).map(([course, fee]) => (
                    <div
                      key={course}
                      className="group relative overflow-hidden border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full -mr-8 -mt-8" />
                      <div className="relative">
                        <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-bold mb-3">
                          {course}
                        </div>
                        <div className="text-2xl font-black text-gray-900 mb-1">
                          {fee}
                        </div>
                        <div className="text-sm text-gray-500">참가비</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 카카오맵 */}
            {marathon.place && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-7 h-7 text-blue-600" />
                  대회 위치
                </h3>
                <KakaoMap placeName={marathon.place} />
              </div>
            )}

            {/* 공식 채널 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Globe className="w-7 h-7 text-blue-600" />
                공식 채널
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {marathon.phone && (
                  <a
                    href={`tel:${marathon.phone}`}
                    className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group"
                  >
                    <Phone className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mb-2" />
                    <span className="text-sm font-bold text-gray-700">
                      전화문의
                    </span>
                  </a>
                )}
                {marathon.email && (
                  <a
                    href={`mailto:${marathon.email}`}
                    className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group"
                  >
                    <Mail className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mb-2" />
                    <span className="text-sm font-bold text-gray-700">
                      이메일
                    </span>
                  </a>
                )}
                {marathon.homepageUrl && (
                  <a
                    href={marathon.homepageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group"
                  >
                    <Globe className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mb-2" />
                    <span className="text-sm font-bold text-gray-700">
                      홈페이지
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽 사이드바 - 전체를 sticky로 */}
          <div className="space-y-6 sticky top-24 self-start">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-4">참가 신청</h3>
              <div className="space-y-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  {isClosed ? (
                    <div className="text-xl font-black text-center py-2">
                      접수가 마감되었습니다
                    </div>
                  ) : (
                    <>
                      <div className="text-sm text-white/80 mb-1">
                        {isBefore ? "접수 시작까지" : "접수 마감까지"}
                      </div>
                      <div className="text-2xl font-black">
                        {(() => {
                          const targetDate = isBefore
                            ? registrationStart
                            : registrationEnd;
                          const diffDays = Math.ceil(
                            (targetDate.getTime() - today.getTime()) /
                              (1000 * 60 * 60 * 24),
                          );
                          return diffDays > 0
                            ? `${diffDays}일 남음`
                            : "오늘 마감";
                        })()}
                      </div>
                    </>
                  )}
                </div>
                <a
                  href={marathon.homepageUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-4 px-6 rounded-xl font-bold text-center transition-colors shadow-lg flex items-center justify-center gap-2 ${
                    !isOpen || !marathon.homepageUrl
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white text-blue-600 hover:bg-blue-50 cursor-pointer"
                  }`}
                >
                  {isOpen ? "공식 홈페이지에서 신청" : "신청 기간이 아닙니다"}
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

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-orange-600" />
                주최/주관 정보
              </h3>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">주최기관</div>
                  <div className="font-bold text-gray-900 text-md break-all">
                    {marathon.host || "-"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                주의사항
              </h4>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex gap-2">
                  <span className="text-amber-600">•</span>
                  <span>
                    상세 일정 및 요강은 공식 홈페이지를 꼭 확인하세요.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600">•</span>
                  <span>참가 신청 및 결제는 공식 채널에서만 가능합니다.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
