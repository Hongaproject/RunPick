"use client";

import { Marathon } from "@/types/marathon";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface MarathonContextType {
  selectedMarathon: Marathon | null;
  setSelectedMarathon: (marathon: Marathon | null) => void;
}

const MarathonContext = createContext<MarathonContextType | undefined>(
  undefined,
);

export function MarathonProvider({ children }: { children: ReactNode }) {
  const [selectedMarathon, setSelectedMarathon] = useState<Marathon | null>(
    null,
  );

  return (
    <MarathonContext.Provider value={{ selectedMarathon, setSelectedMarathon }}>
      {children}
    </MarathonContext.Provider>
  );
}

export function useMarathon() {
  const context = useContext(MarathonContext);
  if (context === undefined) {
    throw new Error("useMarathon must be used within MarathonProvider");
  }
  return context;
}
