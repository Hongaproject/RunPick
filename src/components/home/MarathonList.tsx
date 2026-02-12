import { useState, useMemo } from "react";
import {
  Marathon,
  MarathonDistance,
  MarathonStatus,
  RegistrationStatus,
} from "@/types/marathon";
import { FilterBar } from "./FilterBar";
import MarathonCard from "./MarathonCard";

interface MarathonListProps {
  marathons: Marathon[];
  onSelectMarathon: (marathon: Marathon) => void;
}

export function MarathonList({
  marathons,
  onSelectMarathon,
}: MarathonListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("전체");
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
  const [showFilters, setShowFilters] = useState(false);

  const filteredMarathons = useMemo(() => {
    return marathons.filter((marathon) => {
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

      // 지역 필터
      if (selectedRegion !== "전체" && marathon.region !== selectedRegion) {
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
  }, [
    marathons,
    searchQuery,
    selectedRegion,
    selectedMonth,
    selectedStatus,
    selectedRegistration,
    selectedDistance,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedRegistration={selectedRegistration}
        onRegistrationChange={setSelectedRegistration}
        selectedDistance={selectedDistance}
        onDistanceChange={setSelectedDistance}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            마라톤 대회 {filteredMarathons.length}개
          </h2>
          <p className="text-gray-600 mt-1">참가하고 싶은 대회를 찾아보세요!</p>
        </div>

        {filteredMarathons.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
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
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600">다른 검색어나 필터를 시도해보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarathons.map((marathon) => (
              <MarathonCard
                key={marathon.id}
                marathon={marathon}
                onClick={() => onSelectMarathon(marathon)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
