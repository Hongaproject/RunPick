import { Search, SlidersHorizontal } from "lucide-react";
import {
  MarathonDistance,
  MarathonStatus,
  RegistrationStatus,
} from "@/types/marathon";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  selectedStatus: MarathonStatus | "all";
  onStatusChange: (status: MarathonStatus | "all") => void;
  selectedRegistration: RegistrationStatus | "all";
  onRegistrationChange: (status: RegistrationStatus | "all") => void;
  selectedDistance: MarathonDistance | "all";
  onDistanceChange: (distance: MarathonDistance | "all") => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const regions = [
  "전체",
  "서울",
  "부산",
  "인천",
  "대구",
  "광주",
  "대전",
  "울산",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

const months = [
  { value: "all", label: "전체" },
  { value: "1", label: "1월" },
  { value: "2", label: "2월" },
  { value: "3", label: "3월" },
  { value: "4", label: "4월" },
  { value: "5", label: "5월" },
  { value: "6", label: "6월" },
  { value: "7", label: "7월" },
  { value: "8", label: "8월" },
  { value: "9", label: "9월" },
  { value: "10", label: "10월" },
  { value: "11", label: "11월" },
  { value: "12", label: "12월" },
];

const statuses = [
  { value: "all", label: "전체" },
  { value: "upcoming", label: "시작 전" },
  { value: "ongoing", label: "진행 중" },
  { value: "ended", label: "종료" },
];

const registrationStatuses = [
  { value: "all", label: "전체" },
  { value: "before", label: "접수 전" },
  { value: "open", label: "접수 중" },
  { value: "closed", label: "접수 마감" },
];

const distances = [
  { value: "all", label: "전체" },
  { value: "5K", label: "5K" },
  { value: "10K", label: "10K" },
  { value: "Half", label: "하프" },
  { value: "Full", label: "풀코스" },
  { value: "Ultra", label: "울트라" },
];

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  selectedMonth,
  onMonthChange,
  selectedStatus,
  onStatusChange,
  selectedRegistration,
  onRegistrationChange,
  selectedDistance,
  onDistanceChange,
  showFilters,
  onToggleFilters,
}: FilterBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* 검색 바 */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="대회명, 지역으로 검색..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
            />
          </div>
          <button
            onClick={onToggleFilters}
            className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              showFilters
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden sm:inline">필터</span>
          </button>
        </div>

        {/* 필터 옵션 */}
        {showFilters && (
          <div className="space-y-4 pb-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* 지역 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                지역
              </label>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => onRegionChange(region)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedRegion === region
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* 월별 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                월별
              </label>
              <div className="flex flex-wrap gap-2">
                {months.map((month) => (
                  <button
                    key={month.value}
                    onClick={() => onMonthChange(month.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedMonth === month.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {month.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 대회 상태 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대회 상태
              </label>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => onStatusChange(status.value as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedStatus === status.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 접수 상태 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                접수 상태
              </label>
              <div className="flex flex-wrap gap-2">
                {registrationStatuses.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => onRegistrationChange(status.value as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedRegistration === status.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 거리별 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                거리
              </label>
              <div className="flex flex-wrap gap-2">
                {distances.map((distance) => (
                  <button
                    key={distance.value}
                    onClick={() => onDistanceChange(distance.value as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedDistance === distance.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {distance.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
