import { useQuery } from "@tanstack/react-query";
import { getMarathons, getMarathonBySlug, getMarathonsByRegion } from "@/api/marathons";

// 전체 마라톤 목록
export function useMarathons() {
  return useQuery({
    queryKey: ["marathons"],
    queryFn: getMarathons,
  });
}

// 특정 마라톤 상세
export function useMarathonDetail(slug: string) {
  return useQuery({
    queryKey: ["marathon", slug],
    queryFn: () => getMarathonBySlug(slug),
    enabled: !!slug,
  });
}

// 지역별 마라톤
export function useMarathonsByRegion(region: string) {
  return useQuery({
    queryKey: ["marathons", region],
    queryFn: () => getMarathonsByRegion(region),
    enabled: !!region,
  });
}
