//  마라톤 대회 정보 인터페이스
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
