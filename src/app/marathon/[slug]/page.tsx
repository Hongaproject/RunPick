import { getMarathonBySlug, getMarathons } from "@/api/marathons";
import MarathonDetail from "@/components/detail/MarathonDetail";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

// 정적 경로 생성 (SSG)
export async function generateStaticParams() {
  const marathons = await getMarathons();
  return marathons.map((m) => ({ slug: m.raceDetailUrl }));
}

// SEO 메타데이터
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const marathon = await getMarathonBySlug(slug);
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
  const { slug } = await params;
  const marathon = await getMarathonBySlug(slug);

  if (!marathon) notFound();

  return <MarathonDetail marathon={marathon} />;
}
