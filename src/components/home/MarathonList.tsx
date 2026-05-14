"use client";

import { useState, useMemo } from "react";
import { MarathonRace } from "@/types/marathon";
import {
  FilterSidebar,
  getMarathonStatus,
  getRegistrationStatus,
  getDistances,
} from "./FilterSidebar";
import { MarathonCard } from "./MarathonCard";
import { SearchBar } from "./SearchBar";
import { Footer } from "../common/Footer";

interface MarathonListProps {
  marathons: MarathonRace[];
}

export function MarathonList({ marathons }: MarathonListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  // 기본값: "upcoming" → 종료된 경기는 기본적으로 안 보임
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "upcoming" | "ongoing" | "ended"
  >("upcoming");
  const [selectedRegistration, setSelectedRegistration] = useState<
    "all" | "before" | "open" | "closed"
  >("all");
  // 타입 명시 핸들러
  const handleRegistrationChange = (
    status: "all" | "before" | "open" | "closed",
  ) => {
    setSelectedRegistration(status);
  };
  const [selectedDistance, setSelectedDistance] = useState<
    "all" | "5K" | "10K" | "Half" | "Full" | "Ultra"
  >("all");
  const [sortBy, setSortBy] = useState<"latest" | "deadline">("latest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredAndSortedMarathons = useMemo(() => {
    const filtered = marathons.filter((marathon) => {
      // 검색어 필터
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !marathon.raceName.toLowerCase().includes(query) &&
          !marathon.place.toLowerCase().includes(query) &&
          !marathon.region.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // 지역 필터 (광역시 그룹 처리)
      if (
        selectedRegions.length > 0 &&
        !selectedRegions.includes(marathon.regionCategory)
      ) {
        return false;
      }

      // 월별 필터
      if (selectedMonth !== "all") {
        const marathonMonth = new Date(marathon.raceDate).getMonth() + 1;
        if (marathonMonth.toString() !== selectedMonth) return false;
      }

      // 대회 상태 필터 (날짜 기반 계산)
      if (selectedStatus !== "all") {
        const status = getMarathonStatus(marathon.raceDate);
        if (status !== selectedStatus) return false;
      }

      // 접수 상태 필터 (날짜 기반 계산)
      if (selectedRegistration !== "all") {
        const regStatus = getRegistrationStatus(
          marathon.applicationStartDate,
          marathon.applicationEndDate,
        );
        if (regStatus !== selectedRegistration) return false;
      }

      // 거리 필터 (raceTypeList 기반 계산)
      if (selectedDistance !== "all") {
        const distanceList = getDistances(marathon.raceTypeList);
        if (!distanceList.includes(selectedDistance)) return false;
      }

      return true;
    });

    // 정렬
    if (sortBy === "latest") {
      filtered.sort(
        (a, b) =>
          new Date(a.raceDate).getTime() - new Date(b.raceDate).getTime(),
      );
    } else if (sortBy === "deadline") {
      filtered.sort(
        (a, b) =>
          new Date(a.applicationEndDate).getTime() -
          new Date(b.applicationEndDate).getTime(),
      );
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

  const handleReset = () => {
    setSearchQuery("");
    setSelectedRegions([]);
    setSelectedMonth("all");
    setSelectedStatus("upcoming"); // 초기화해도 종료 경기는 기본 제외
    setSelectedRegistration("all" as "all" | "before" | "open" | "closed");
    setSelectedDistance("all");
  };

  return (
    <div className="flex h-full bg-gray-50">
      <FilterSidebar
        marathons={marathons.filter(
          (m) => getMarathonStatus(m.raceDate) !== "ended",
        )}
        selectedRegions={selectedRegions}
        onRegionChange={(regions) => setSelectedRegions(regions)}
        selectedMonth={selectedMonth}
        onMonthChange={(month) => setSelectedMonth(month)}
        selectedStatus={selectedStatus}
        onStatusChange={(status) => setSelectedStatus(status)}
        selectedRegistration={selectedRegistration}
        onRegistrationChange={handleRegistrationChange}
        selectedDistance={selectedDistance}
        onDistanceChange={(distance) => setSelectedDistance(distance)}
        isMobileOpen={isMobileFilterOpen}
        onMobileClose={() => setIsMobileFilterOpen(false)}
        onReset={handleReset}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={(query) => setSearchQuery(query)}
          onFilterClick={() => setIsMobileFilterOpen(true)}
          sortBy={sortBy}
          onSortChange={(sort) => setSortBy(sort)}
          totalCount={filteredAndSortedMarathons.length}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {filteredAndSortedMarathons.map((marathon) => (
                  <MarathonCard
                    key={marathon.raceDetailUrl}
                    marathon={marathon}
                  />
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
