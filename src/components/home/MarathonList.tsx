import { useState, useMemo } from "react";
import {
  Marathon,
  MarathonDistance,
  MarathonStatus,
  RegistrationStatus,
} from "../../types/marathon";
import { FilterSidebar } from "./FilterSidebar";
import MarathonCard from "./MarathonCard";
interface MarathonList {
  marathons: Marathon[];
  onSelectMarathon: (marathon: Marathon) => void;
}

export function MarathonList({ marathons, onSelectMarathon }: MarathonList) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<MarathonStatus | "all">(
    "all",
  );
  const [selectedRegistration, setSelectedRegistration] = useState<
    RegistrationStatus | "all"
  >("all");
  const [selectedDistance, setSelectedDistance] = useState<
    MarathonDistance | "all"
  >("all");
  const [sortBy, setSortBy] = useState<"latest" | "deadline">("latest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredAndSortedMarathons = useMemo(() => {
    const filtered = marathons.filter((marathon) => {
      // 검색어 필터
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !marathon.name.toLowerCase().includes(query) &&
          !marathon.location.toLowerCase().includes(query) &&
          !marathon.region.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // 지역 필터 (체크박스 - 다중 선택)
      if (
        selectedRegions.length > 0 &&
        !selectedRegions.includes(marathon.region)
      ) {
        return false;
      }

      // 월별 필터
      if (selectedMonth !== "all") {
        const marathonMonth = new Date(marathon.date).getMonth() + 1;
        if (marathonMonth.toString() !== selectedMonth) {
          return false;
        }
      }

      // 대회 상태 필터
      if (selectedStatus !== "all" && marathon.status !== selectedStatus) {
        return false;
      }

      // 접수 상태 필터
      if (
        selectedRegistration !== "all" &&
        marathon.registrationStatus !== selectedRegistration
      ) {
        return false;
      }

      // 거리 필터
      if (
        selectedDistance !== "all" &&
        !marathon.distances.includes(selectedDistance)
      ) {
        return false;
      }

      return true;
    });

    // 정렬
    if (sortBy === "latest") {
      filtered.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    } else if (sortBy === "deadline") {
      // 접수 마감일이 가까운 순 (접수 중인 것만 우선)
      filtered.sort((a, b) => {
        const aOpen = a.registrationStatus === "open";
        const bOpen = b.registrationStatus === "open";

        if (aOpen && !bOpen) return -1;
        if (!aOpen && bOpen) return 1;

        return (
          new Date(a.registrationEnd).getTime() -
          new Date(b.registrationEnd).getTime()
        );
      });
    }

    return filtered;
  }, [
    marathons,
    searchQuery,
    selectedRegions,
    selectedMonth,
    selectedStatus,
    selectedRegistration,
    selectedDistance,
    sortBy,
  ]);

  // 필터 변경시 첫 페이지로
  const handleFilterChange = (callback: () => void) => {
    callback();
  };

  // 필터 초기화
  const handleReset = () => {
    setSearchQuery("");
    setSelectedRegions([]);
    setSelectedMonth("all");
    setSelectedStatus("all");
    setSelectedRegistration("all");
    setSelectedDistance("all");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 필터 사이드바 */}
      <FilterSidebar
        marathons={marathons}
        selectedRegions={selectedRegions}
        onRegionChange={(regions) =>
          handleFilterChange(() => setSelectedRegions(regions))
        }
        selectedMonth={selectedMonth}
        onMonthChange={(month) =>
          handleFilterChange(() => setSelectedMonth(month))
        }
        selectedStatus={selectedStatus}
        onStatusChange={(status) =>
          handleFilterChange(() => setSelectedStatus(status))
        }
        selectedRegistration={selectedRegistration}
        onRegistrationChange={(status) =>
          handleFilterChange(() => setSelectedRegistration(status))
        }
        selectedDistance={selectedDistance}
        onDistanceChange={(distance) =>
          handleFilterChange(() => setSelectedDistance(distance))
        }
        isMobileOpen={isMobileFilterOpen}
        onMobileClose={() => setIsMobileFilterOpen(false)}
        onReset={handleReset}
      />

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {filteredAndSortedMarathons.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-gray-600 mb-6">
                다른 검색어나 필터를 시도해보세요.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                필터 초기화
              </button>
            </div>
          ) : (
            <>
              {/* 대회 카드 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {filteredAndSortedMarathons.map((marathon) => (
                  <MarathonCard
                    key={marathon.id}
                    marathon={marathon}
                    onClick={() => onSelectMarathon(marathon)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
