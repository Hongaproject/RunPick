import { getMarathonById } from "@/api/marathons";
import MarathonDetail from "@/components/detail/MarathonDetail";
import { notFound } from "next/navigation";

// 동적 렌더링 강제 (SSG 비활성화)
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

// SEO 메타데이터
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const marathon = await getMarathonById(id);
  if (!marathon) return { title: "대회를 찾을 수 없습니다" };

  return {
    title: `${marathon.raceName} | RunPick`,
    description: `${marathon.place} | ${marathon.raceDate} | ${marathon.raceTypeList}`,
    openGraph: {
      title: marathon.raceName,
      description: `${marathon.place}에서 열리는 ${marathon.raceTypeList} 마라톤 대회`,
    },
  };
}

export default async function MarathonDetailPage({ params }: Props) {
  const { id } = await params;
  const marathon = await getMarathonById(id);

  if (!marathon) notFound();

  return <MarathonDetail marathon={marathon} />;
}
