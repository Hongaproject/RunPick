import { X, RotateCcw } from "lucide-react";
import {
  Marathon,
  MarathonDistance,
  MarathonStatus,
  RegistrationStatus,
} from "../../types/marathon";

interface FilterSidebarProps {
  marathons: Marathon[];
  selectedRegions: string[];
  onRegionChange: (regions: string[]) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  selectedStatus: MarathonStatus | "all";
  onStatusChange: (status: MarathonStatus | "all") => void;
  selectedRegistration: RegistrationStatus | "all";
  onRegistrationChange: (status: RegistrationStatus | "all") => void;
  selectedDistance: MarathonDistance | "all";
  onDistanceChange: (distance: MarathonDistance | "all") => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onReset: () => void;
}

const regionGroups = [
  { value: "서울", label: "서울" },
  {
    value: "광역시",
    label: "광역시",
    cities: ["부산", "인천", "대구", "광주", "대전", "울산"],
  },
  { value: "경기", label: "경기" },
  { value: "충청", label: "충청", cities: ["충북", "충남"] },
  { value: "경상", label: "경상", cities: ["경북", "경남"] },
  { value: "전라", label: "전라", cities: ["전북", "전남"] },
  { value: "강원", label: "강원" },
  { value: "제주", label: "제주" },
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

// 1. statuses 배열 수정
const statuses: { value: MarathonStatus | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "upcoming", label: "시작 전" },
  { value: "ongoing", label: "진행 중" },
  { value: "ended", label: "종료" },
];

// 2. registrationStatuses 배열 수정
const registrationStatuses: {
  value: RegistrationStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "전체" },
  { value: "before", label: "접수 전" },
  { value: "open", label: "접수 중" },
  { value: "closed", label: "접수 마감" },
];

// 3. distances 배열 수정
const distances: { value: MarathonDistance | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "5K", label: "5K" },
  { value: "10K", label: "10K" },
  { value: "Half", label: "하프" },
  { value: "Full", label: "풀코스" },
  { value: "Ultra", label: "울트라" },
];

export function FilterSidebar({
  marathons,
  selectedRegions,
  onRegionChange,
  selectedMonth,
  onMonthChange,
  selectedStatus,
  onStatusChange,
  selectedRegistration,
  onRegistrationChange,
  selectedDistance,
  onDistanceChange,
  isMobileOpen = false,
  onMobileClose,
  onReset,
}: FilterSidebarProps) {
  // 지역별 대회 수 계산
  const getRegionCount = (regionValue: string, cities?: string[]) => {
    if (!marathons || marathons.length === 0) return 0;

    if (cities) {
      // 광역시, 충청, 경상, 전라 등
      return marathons.filter((m) => cities.includes(m.region)).length;
    }
    return marathons.filter((m) => m.region === regionValue).length;
  };

  // 체크박스 토글
  const handleRegionToggle = (regionValue: string, cities?: string[]) => {
    if (cities) {
      // 그룹 지역 (광역시, 충청 등)
      const allSelected = cities.every((city) =>
        selectedRegions.includes(city),
      );
      if (allSelected) {
        // 모두 선택되어 있으면 모두 해제
        onRegionChange(selectedRegions.filter((r) => !cities.includes(r)));
      } else {
        // 하나라도 선택 안되어 있으면 모두 선택
        const newRegions = [...selectedRegions];
        cities.forEach((city) => {
          if (!newRegions.includes(city)) {
            newRegions.push(city);
          }
        });
        onRegionChange(newRegions);
      }
    } else {
      // 단일 지역
      if (selectedRegions.includes(regionValue)) {
        onRegionChange(selectedRegions.filter((r) => r !== regionValue));
      } else {
        onRegionChange([...selectedRegions, regionValue]);
      }
    }
  };

  // 체크박스 상태 확인
  const isRegionChecked = (regionValue: string, cities?: string[]) => {
    if (cities) {
      return cities.some((city) => selectedRegions.includes(city));
    }
    return selectedRegions.includes(regionValue);
  };

  const sidebarContent = (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">필터</h2>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            초기화
          </button>
        </div>

        {/* 모바일 닫기 버튼 */}
        {isMobileOpen && (
          <button
            onClick={onMobileClose}
            className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
            닫기
          </button>
        )}

        {/* 지역 필터 - 체크박스 */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">지역</h3>
          <div className="space-y-2">
            {regionGroups.map((region) => {
              const count = getRegionCount(region.value, region.cities);
              const isChecked = isRegionChecked(region.value, region.cities);

              return (
                <label
                  key={region.value}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer group transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() =>
                      handleRegionToggle(region.value, region.cities)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {region.label}
                  </span>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 월별 필터 */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">개최 월</h3>
          <div className="grid grid-cols-3 gap-2">
            {months.map((month) => (
              <button
                key={month.value}
                onClick={() => onMonthChange(month.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMonth === month.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {month.label}
              </button>
            ))}
          </div>
        </div>

        {/* 대회 상태 */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">대회 상태</h3>
          <div className="space-y-2">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => onStatusChange(status.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === status.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* 접수 상태 */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">접수 상태</h3>
          <div className="space-y-2">
            {registrationStatuses.map((status) => (
              <button
                key={status.value}
                onClick={() => onRegistrationChange(status.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedRegistration === status.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* 거리별 */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">거리</h3>
          <div className="space-y-2">
            {distances.map((distance) => (
              <button
                key={distance.value}
                onClick={() => onDistanceChange(distance.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDistance === distance.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {distance.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 데스크톱 사이드바 */}
      <aside className="hidden lg:block w-80 bg-white border-r border-gray-200 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* 모바일 오버레이 */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onMobileClose}
          />
          <aside className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 lg:hidden shadow-xl">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
