"use client";

import { MarathonDetail } from "@/components/detail/MarathonDetail";
import { MarathonList } from "@/components/home/MarathonList";
import { mockMarathons } from "@/data/mockMarathons";
import { useMarathon } from "@/context/MarathonContext";

export default function Home() {
  const { selectedMarathon, setSelectedMarathon } = useMarathon();

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedMarathon ? (
        <MarathonDetail
          marathon={selectedMarathon}
          onBack={() => setSelectedMarathon(null)}
        />
      ) : (
        <MarathonList
          marathons={mockMarathons}
          onSelectMarathon={setSelectedMarathon}
        />
      )}
    </div>
  );
}
