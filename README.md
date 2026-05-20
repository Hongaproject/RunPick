# 🏃 RunPick — 전국 마라톤 대회 정보 플랫폼

> 전국의 마라톤 대회 정보를 한눈에 확인하고, 즐겨찾기와 커뮤니티 기능으로 러너들과 함께하세요.

## 🔗 **배포 주소**: https://runpick.vercel.app

---

## 📌 프로젝트 개요

RunPick은 흩어져 있는 전국 마라톤 대회 정보를 한 곳에서 확인할 수 있는 플랫폼입니다.
지역, 거리, 접수 상태 등 다양한 필터로 원하는 대회를 빠르게 찾고, 관심 대회를 즐겨찾기로 저장하며 커뮤니티에서 러너들과 정보를 나눌 수 있습니다.

---

## ✨ 주요 기능

| 기능       | 설명                                                             |
| ---------- | ---------------------------------------------------------------- |
| 대회 목록  | 전국 마라톤 대회 정보 조회, 지역/거리/상태별 필터링, 무한 스크롤 |
| 즐겨찾기   | 관심 대회 저장, Supabase DB 연동으로 새로고침 후에도 유지        |
| 회원 인증  | 이메일/구글/GitHub 로그인, Supabase Auth 기반                    |
| 커뮤니티   | 게시글 작성·수정·삭제, 댓글 작성·수정·삭제, 좋아요               |
| 대회 상세  | 카카오맵 연동 장소 표시, 대회 상세 정보                          |
| 마이페이지 | 프로필 관리, 즐겨찾기·좋아요한 글·작성 글 확인                   |

---

## 🛠️ 기술 스택

### Frontend

- **Next.js 16** — App Router, Server/Client Components
- **React 19** — UI 컴포넌트 및 Hooks 기반 상태 관리
- **TypeScript 5** — 타입 안전성 확보, 런타임 오류 사전 방지
- **Tailwind CSS 4** — 유틸리티 기반 스타일링
- **TanStack Query (React Query)** — 서버 상태 관리 및 캐싱
- **Lucide React** — 아이콘
- **Context API** - 전역 인증 상태(AuthContext), 선택된 마라톤 상태(MarathonContext)

### Backend & Infrastructure

- **Supabase** — PostgreSQL DB, 인증, Row Level Security
- **Vercel** — 배포 및 호스팅
- **Nodemailer** — 이메일 문의 기능

---

## 📁 프로젝트 구조

```
src/
├── api/                  # Supabase API 함수
│   ├── community.ts      # 커뮤니티 CRUD
│   └── marathons.ts      # 마라톤 데이터
├── app/                  # Next.js App Router
│   ├── (auth)/           # 인증 페이지 (Header 없음)
│   │   ├── login/
│   │   └── signup/
│   ├── community/        # 커뮤니티
│   │   ├── [id]/
│   │   │   └── edit/
│   │   └── write/
│   ├── favorites/        # 즐겨찾기
│   ├── liked-posts/      # 좋아요한 글
│   ├── marathon/[id]/    # 대회 상세
│   └── mypage/           # 마이페이지
│       └── edit/
├── components/
│   ├── common/           # Header, Footer
│   ├── detail/           # 대회 상세 컴포넌트
│   └── home/             # 메인 페이지 컴포넌트
├── context/
│   ├── AuthContext.tsx   # 인증 전역 상태
│   └── MarathonContext.tsx
├── hooks/
│   └── useMarathons.ts
├── lib/
│   └── supabase.ts       # Supabase 클라이언트
└── types/
    ├── community.ts
    └── marathon.ts
```
