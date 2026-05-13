import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  sortBy: "latest" | "deadline";
  onSortChange: (sort: "latest" | "deadline") => void;
  totalCount: number;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  onFilterClick,
  sortBy,
  onSortChange,
  totalCount,
}: SearchBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        {/* 검색 바와 버튼들 */}
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

          {/* 모바일 필터 버튼 */}
          <button
            onClick={onFilterClick}
            className="lg:hidden px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          {/* 정렬 드롭다운 */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) =>
                onSortChange(e.target.value as "latest" | "deadline")
              }
              className="appearance-none pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base font-medium cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <option value="latest">최신순</option>
              <option value="deadline">마감임박순</option>
            </select>
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 검색 결과 수 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span className="font-bold text-blue-600">{totalCount}</span>개의
            대회
          </p>
        </div>
      </div>
    </div>
  );
}
