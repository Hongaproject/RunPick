import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { name, email, category, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "필수 항목을 입력해주세요." },
      { status: 400 },
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const categoryLabel: Record<string, string> = {
    general: "일반 문의",
    bug: "버그 신고",
    feature: "기능 제안",
    other: "기타",
  };

  try {
    await transporter.sendMail({
      from: `"RunPick 문의" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_RECEIVER,
      replyTo: email,
      subject: `[RunPick 문의] ${categoryLabel[category] ?? "기타"} - ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
            RunPick 문의가 접수되었습니다
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; background: #f9fafb; font-weight: bold; width: 120px; border: 1px solid #e5e7eb;">이름</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background: #f9fafb; font-weight: bold; border: 1px solid #e5e7eb;">이메일</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background: #f9fafb; font-weight: bold; border: 1px solid #e5e7eb;">문의 유형</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${categoryLabel[category] ?? "기타"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background: #f9fafb; font-weight: bold; border: 1px solid #e5e7eb;">문의 내용</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
          <p style="color: #6b7280; font-size: 12px;">
            * 이 메일은 RunPick 문의하기를 통해 자동 발송되었습니다.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("메일 전송 오류:", error);
    return NextResponse.json(
      { error: "메일 전송에 실패했습니다." },
      { status: 500 },
    );
  }
}
