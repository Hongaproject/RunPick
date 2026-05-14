"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MarathonProvider } from "@/context/MarathonContext";
import { useState } from "react";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5분 캐시
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MarathonProvider>{children}</MarathonProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
