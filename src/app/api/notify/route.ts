import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

// 서비스 키로 RLS 우회 (서버에서만 사용)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// GitHub Actions에서 Authorization 헤더로 보안 처리
function isAuthorized(req: NextRequest): boolean {
  const token = req.headers.get("authorization");
  return token === `Bearer ${process.env.NOTIFY_SECRET}`;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();

  // 접수 마감 3일 전 계산
  const registrationDeadline = new Date(today);
  registrationDeadline.setDate(today.getDate() + 3);

  // 대회 시작 7일 전 계산
  const raceStartSoon = new Date(today);
  raceStartSoon.setDate(today.getDate() + 7);

  const format = (d: Date) => d.toISOString().split("T")[0];

  // 접수 마감 3일 전 대회 즐겨찾기한 유저 조회
  const { data: registrationAlerts } = await supabase
    .from("user_favorites")
    .select(`
      user_id,
      marathon_id,
      marathons!inner (
        race_name,
        application_end_date,
        homepage_url,
        place
      )
    `)
    .eq("marathons.application_end_date", format(registrationDeadline));

  // 대회 시작 7일 전 즐겨찾기한 유저 조회
  const { data: raceAlerts } = await supabase
    .from("user_favorites")
    .select(`
      user_id,
      marathon_id,
      marathons!inner (
        race_name,
        race_date,
        homepage_url,
        place
      )
    `)
    .eq("marathons.race_date", format(raceStartSoon));

  // 유저 이메일 조회용 맵
  const userIds = [
    ...new Set([
      ...(registrationAlerts ?? []).map((r) => r.user_id),
      ...(raceAlerts ?? []).map((r) => r.user_id),
    ]),
  ];

  if (userIds.length === 0) {
    return NextResponse.json({ message: "발송할 알림 없음", sent: 0 });
  }

  // auth.users에서 이메일 조회 (service key 필요)
  const { data: users } = await supabase.auth.admin.listUsers();
  const emailMap = new Map<string, string>();
  users?.users.forEach((u) => {
    if (u.email) emailMap.set(u.id, u.email);
  });

  let sentCount = 0;

  // 접수 마감 알림 발송
  for (const alert of registrationAlerts ?? []) {
    const email = emailMap.get(alert.user_id);
    if (!email) continue;

    const marathon = alert.marathons as unknown as {
      race_name: string;
      application_end_date: string;
      homepage_url: string;
      place: string;
    };

    await transporter.sendMail({
      from: `"RunPick 알림" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `[RunPick] ⏰ 접수 마감 3일 전 - ${marathon.race_name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; font-size: 24px; margin: 0;">🏃 RunPick</h1>
          </div>
          <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb;">
            <h2 style="color: #1f2937; font-size: 20px;">접수 마감이 3일 남았습니다!</h2>
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #92400e; margin: 0 0 8px 0;">${marathon.race_name}</h3>
              <p style="color: #78350f; margin: 4px 0;">📍 ${marathon.place}</p>
              <p style="color: #78350f; margin: 4px 0;">📅 접수 마감일: ${marathon.application_end_date}</p>
            </div>
            <a href="${marathon.homepage_url}" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              지금 신청하기 →
            </a>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
              이 메일은 RunPick에서 즐겨찾기한 대회의 알림입니다.
            </p>
          </div>
        </div>
      `,
    });
    sentCount++;
  }

  // 대회 시작 알림 발송
  for (const alert of raceAlerts ?? []) {
    const email = emailMap.get(alert.user_id);
    if (!email) continue;

    const marathon = alert.marathons as unknown as {
      race_name: string;
      race_date: string;
      homepage_url: string;
      place: string;
    };

    await transporter.sendMail({
      from: `"RunPick 알림" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `[RunPick] 🏁 대회 시작 7일 전 - ${marathon.race_name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; font-size: 24px; margin: 0;">🏃 RunPick</h1>
          </div>
          <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb;">
            <h2 style="color: #1f2937; font-size: 20px;">대회가 7일 후 시작됩니다!</h2>
            <div style="background: #dbeafe; border: 1px solid #3b82f6; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #1e3a8a; margin: 0 0 8px 0;">${marathon.race_name}</h3>
              <p style="color: #1e40af; margin: 4px 0;">📍 ${marathon.place}</p>
              <p style="color: #1e40af; margin: 4px 0;">🏁 대회일: ${marathon.race_date}</p>
            </div>
            <a href="${marathon.homepage_url}" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              대회 정보 확인하기 →
            </a>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
              이 메일은 RunPick에서 즐겨찾기한 대회의 알림입니다.
            </p>
          </div>
        </div>
      `,
    });
    sentCount++;
  }

  return NextResponse.json({ message: "알림 발송 완료", sent: sentCount });
}
