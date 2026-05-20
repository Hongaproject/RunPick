"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
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

const PAGE_SIZE = 12;

interface MarathonListProps {
  marathons: MarathonRace[];
}

export function MarathonList({ marathons }: MarathonListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "upcoming" | "ongoing" | "ended"
  >("upcoming");
  const [selectedRegistration, setSelectedRegistration] = useState<
    "all" | "before" | "open" | "closed"
  >("all");
  const [selectedDistance, setSelectedDistance] = useState<
    "all" | "5K" | "10K" | "Half" | "Full" | "Ultra"
  >("all");
  const [sortBy, setSortBy] = useState<"latest" | "deadline">("latest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // 💡 [추가] 필터 변경 감지를 위한 이전 필터 상태 저장
  const [prevFilters, setPrevFilters] = useState({
    searchQuery,
    selectedRegions,
    selectedMonth,
    selectedStatus,
    selectedRegistration,
    selectedDistance,
    sortBy,
  });

  const loaderRef = useRef<HTMLDivElement>(null);

  const handleRegistrationChange = (
    status: "all" | "before" | "open" | "closed",
  ) => {
    setSelectedRegistration(status);
  };

  const filteredAndSortedMarathons = useMemo(() => {
    const filtered = marathons.filter((marathon) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !marathon.raceName.toLowerCase().includes(query) &&
          !marathon.place.toLowerCase().includes(query) &&
          !marathon.region.toLowerCase().includes(query)
        )
          return false;
      }
      if (
        selectedRegions.length > 0 &&
        !selectedRegions.includes(marathon.regionCategory)
      )
        return false;
      if (selectedMonth !== "all") {
        const marathonMonth = new Date(marathon.raceDate).getMonth() + 1;
        if (marathonMonth.toString() !== selectedMonth) return false;
      }
      if (selectedStatus !== "all") {
        const status = getMarathonStatus(marathon.raceDate);
        if (status !== selectedStatus) return false;
      }
      if (selectedRegistration !== "all") {
        const regStatus = getRegistrationStatus(
          marathon.applicationStartDate,
          marathon.applicationEndDate,
        );
        if (regStatus !== selectedRegistration) return false;
      }
      if (selectedDistance !== "all") {
        const distanceList = getDistances(marathon.raceTypeList);
        if (!distanceList.includes(selectedDistance)) return false;
      }
      return true;
    });

    if (sortBy === "latest") {
      filtered.sort(
        (a, b) =>
          new Date(a.raceDate).getTime() - new Date(b.raceDate).getTime(),
      );
    } else {
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

  // 💡 [대체] Effect 없이 렌더링 도중 필터 변경 감지 및 visibleCount 초기화
  if (
    prevFilters.searchQuery !== searchQuery ||
    prevFilters.selectedMonth !== selectedMonth ||
    prevFilters.selectedStatus !== selectedStatus ||
    prevFilters.selectedRegistration !== selectedRegistration ||
    prevFilters.selectedDistance !== selectedDistance ||
    prevFilters.sortBy !== sortBy ||
    JSON.stringify(prevFilters.selectedRegions) !==
      JSON.stringify(selectedRegions)
  ) {
    setPrevFilters({
      searchQuery,
      selectedRegions,
      selectedMonth,
      selectedStatus,
      selectedRegistration,
      selectedDistance,
      sortBy,
    });
    setVisibleCount(PAGE_SIZE);
  }

  // IntersectionObserver - 스크롤 감지
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setVisibleCount((prev) =>
          Math.min(prev + PAGE_SIZE, filteredAndSortedMarathons.length),
        );
      }
    },
    [filteredAndSortedMarathons.length],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const visibleMarathons = filteredAndSortedMarathons.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedMarathons.length;

  const handleReset = () => {
    setSearchQuery("");
    setSelectedRegions([]);
    setSelectedMonth("all");
    setSelectedStatus("upcoming");
    setSelectedRegistration("all");
    setSelectedDistance("all");
  };

  return (
    <div className="flex h-full bg-gray-50">
      <FilterSidebar
        marathons={marathons.filter(
          (m) => getMarathonStatus(m.raceDate) !== "ended",
        )}
        selectedRegions={selectedRegions}
        onRegionChange={setSelectedRegions}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedRegistration={selectedRegistration}
        onRegistrationChange={handleRegistrationChange}
        selectedDistance={selectedDistance}
        onDistanceChange={setSelectedDistance}
        isMobileOpen={isMobileFilterOpen}
        onMobileClose={() => setIsMobileFilterOpen(false)}
        onReset={handleReset}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={() => setIsMobileFilterOpen(true)}
          sortBy={sortBy}
          onSortChange={setSortBy}
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
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {visibleMarathons.map((marathon) => (
                    <MarathonCard
                      key={marathon.raceDetailUrl}
                      marathon={marathon}
                    />
                  ))}
                </div>

                {/* 무한 스크롤 감지 영역 */}
                {hasMore && (
                  <div ref={loaderRef} className="flex justify-center py-8">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      더 불러오는 중...
                    </div>
                  </div>
                )}

                {!hasMore && filteredAndSortedMarathons.length > PAGE_SIZE && (
                  <p className="text-center text-sm text-gray-400 py-4">
                    총 {filteredAndSortedMarathons.length}개의 대회를 모두
                    불러왔습니다
                  </p>
                )}
              </>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
