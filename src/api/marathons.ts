import { supabase } from "@/lib/supabase";
import { MarathonRace } from "@/types/marathon";

// 전체 마라톤 목록 조회
export async function getMarathons(): Promise<MarathonRace[]> {
  const { data, error } = await supabase
    .from("marathons")
    .select("*")
    .order("race_date", { ascending: true });

  if (error) throw new Error(error.message);

  return data.map(mapToMarathonRace);
}

// ID 기반 상세 조회 (URL safe)
export async function getMarathonById(
  id: string,
): Promise<MarathonRace | null> {
  const { data, error } = await supabase
    .from("marathons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;

  return mapToMarathonRace(data);
}

// 지역별 필터 조회
export async function getMarathonsByRegion(
  region: string,
): Promise<MarathonRace[]> {
  const { data, error } = await supabase
    .from("marathons")
    .select("*")
    .eq("region_category", region)
    .order("race_date", { ascending: true });

  if (error) throw new Error(error.message);

  return data.map(mapToMarathonRace);
}

// DB 컬럼명(snake_case) → 타입(camelCase) 변환
function mapToMarathonRace(row: Record<string, unknown>): MarathonRace {
  return {
    id: row.id as string,
    raceName: row.race_name as string,
    raceDate: row.race_date as string,
    raceStart: row.race_start as string,
    region: row.region as string,
    place: row.place as string,
    raceTypeList: row.race_type_list as string,
    applicationStartDate: row.application_start_date as string,
    applicationEndDate: row.application_end_date as string,
    host: row.host as string,
    phone: row.phone as string,
    email: row.email as string,
    homepageUrl: row.homepage_url as string,
    raceDetailUrl: row.race_detail_url as string,
    regionCategory: row.region_category as string,
    fares: row.fares as Record<string, string> | undefined,
  };
}
