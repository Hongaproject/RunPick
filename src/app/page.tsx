"use client";

import { MarathonList } from "@/components/home/MarathonList";
import { mockMarathons } from "@/data/mockMarathons";
import { Marathon } from "@/types/marathon";
import { useState } from "react";

export default function Home() {
  const [selectedMarathon, setSelectedMarathon] = useState<Marathon | null>(
    null,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <MarathonList
        marathons={mockMarathons}
        onSelectMarathon={setSelectedMarathon}
      />
    </div>
  );
}
