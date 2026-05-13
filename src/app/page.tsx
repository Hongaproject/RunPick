"use client";

import { MarathonList } from "@/components/home/MarathonList";
import { useMarathons } from "@/hooks/useMarathons";

export default function Home() {
  const { data: marathons, isLoading, isError } = useMarathons();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-400 text-sm">대회 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-gray-50">
        <p className="text-red-400 text-sm">
          데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      <MarathonList marathons={marathons ?? []} />
    </div>
  );
}
