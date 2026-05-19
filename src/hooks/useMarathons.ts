import { useQuery } from "@tanstack/react-query";
import {
  getMarathons,
  getMarathonById,
  getMarathonsByRegion,
} from "@/app/api/marathons";

// 전체 마라톤 목록
export function useMarathons() {
  return useQuery({
    queryKey: ["marathons"],
    queryFn: getMarathons,
  });
}

// 특정 마라톤 상세
export function useMarathonDetail(id: string) {
  return useQuery({
    queryKey: ["marathon", id],
    queryFn: () => getMarathonById(id),
    enabled: !!id,
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
