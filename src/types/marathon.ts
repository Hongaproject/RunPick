//  마라톤 대회 정보 인터페이스
export type MarathonStatus = "upcoming" | "ongoing" | "ended";
export type RegistrationStatus = "before" | "open" | "closed";
export type MarathonDistance = "5K" | "10K" | "Half" | "Full" | "Ultra";

export interface Marathon {
  id: string;
  name: string;
  location: string;
  region: string;
  date: string;
  registrationStart: string;
  registrationEnd: string;
  distances: MarathonDistance[];
  maxParticipants: number;
  currentParticipants: number;
  entryFee: {
    [key in MarathonDistance]?: number;
  };
  image: string;
  description: string;
  website: string;
  organizer: string;
  course: string;
  benefits: string[];
  status: MarathonStatus;
  registrationStatus: RegistrationStatus;
}

export interface MarathonRace {
  raceName: string;
  raceDate: string;
  raceStart: string;
  region: string;
  place: string;
  raceTypeList: string;
  applicationStartDate: string;
  applicationEndDate: string;
  host: string;
  phone: string;
  email: string;
  homepageUrl: string;
  raceDetailUrl: string;
  regionCategory: string;
  fares?: {
    [courseName: string]: string;
  };
}
