// 1. 아까 파이썬으로 뽑아낸 원본 JSON 파일을 임포트합니다.
// (경로는 질문자님의 실제 파일 위치에 맞게 수정하세요)
import rawData from "../../public/marathon_data.json";
import {
  Marathon,
  MarathonStatus,
  RegistrationStatus,
  MarathonDistance,
} from "@/types/marathon";

// --- 상태 계산 함수 (테스트용 타임머신 유지) ---
const calculateStatus = (date: string): MarathonStatus => {
  const eventDate = new Date(date);
  const today = new Date(); // 실서비스 배포 시 new Date() 로 변경
  const diffDays = Math.floor(
    (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays > 0) return "upcoming";
  if (diffDays === 0) return "ongoing";
  return "ended";
};

const calculateRegistrationStatus = (
  start: string,
  end: string,
): RegistrationStatus => {
  const today = new Date(); // 실서비스 배포 시 new Date() 로 변경
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (today < startDate) return "before";
  if (today > endDate) return "closed";
  return "open";
};

// --- 거리(종목) 텍스트를 사이드바 필터에 맞게 변환해 주는 함수 ---
const parseDistances = (raceTypeList: string): MarathonDistance[] => {
  const distances: MarathonDistance[] = [];
  const lowerTypes = raceTypeList.toLowerCase();

  // 원본 텍스트에 특정 단어가 있으면 필터용 규격 단어로 매핑
  if (lowerTypes.includes("5km") || lowerTypes.includes("5k"))
    distances.push("5K");
  if (lowerTypes.includes("10km") || lowerTypes.includes("10k"))
    distances.push("10K");
  if (lowerTypes.includes("하프") || lowerTypes.includes("half"))
    distances.push("Half");
  if (lowerTypes.includes("풀") || lowerTypes.includes("full"))
    distances.push("Full");
  if (
    lowerTypes.includes("울트라") ||
    lowerTypes.includes("100km") ||
    lowerTypes.includes("50km")
  )
    distances.push("Ultra");

  return distances;
};

// --- ✨ 마법의 변환기: JSON 데이터를 Marathon 타입으로 자동 매핑 ---
export const mockMarathons: Marathon[] = rawData.map((data, index) => {
  return {
    id: `${data.raceDetailUrl}-${index}`,
    name: data.raceName,
    location: data.place,
    region: data.region,
    date: data.raceDate,
    registrationStart: data.applicationStartDate,
    registrationEnd: data.applicationEndDate,
    distances: parseDistances(data.raceTypeList),

    // 원본 데이터에 없는 정보들은 화면이 깨지지 않게 기본값(더미 데이터)으로 채웁니다.
    maxParticipants: 5000,
    currentParticipants: Math.floor(Math.random() * 3000) + 1000, // 1000~4000명 랜덤
    entryFee: {}, // 요금 정보는 일단 비워둠
    image: "", // 이미지가 없으므로 비워둠
    benefits: ["완주 메달", "모바일 기록증"], // 기본 혜택
    course: data.place, // 코스 정보 대신 장소 입력

    // 원본 데이터를 그대로 넣는 곳
    description: data.intro || "상세 정보가 없습니다.",
    website: data.homepageUrl,
    organizer: data.host,

    // 상태 자동 계산
    status: calculateStatus(data.raceDate),
    registrationStatus: calculateRegistrationStatus(
      data.applicationStartDate,
      data.applicationEndDate,
    ),
  };
});
