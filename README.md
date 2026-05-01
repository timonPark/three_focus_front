# ThreeFocus Frontend

오늘 가장 중요한 3가지에 집중하는 생산성 앱의 웹 프론트엔드 프로젝트입니다.

---

## Tech Stack

| 항목 | 기술 |
|---|---|
| 런타임 | Node.js v22 |
| 패키지 매니저 | pnpm |
| 프레임워크 | Next.js (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| 상태관리 | Zustand |
| 서버 통신 | Axios + TanStack Query (React Query) |
| 폼 관리 | React Hook Form + Zod |
| 소셜 로그인 | NextAuth.js |

---

## Project Structure

```
three_focus_front/
├── app/                         # Next.js App Router 페이지
│   ├── (auth)/                  # 인증 관련 페이지 그룹 (미들웨어 제외)
│   │   ├── login/               # 로그인 화면
│   │   └── signup/              # 회원가입 화면
│   ├── (main)/                  # 로그인 후 페이지 그룹
│   │   ├── home/                # 홈 (오늘 할 일)
│   │   ├── top3/                # 중요한 3가지 선택
│   │   ├── schedule/            # 시간 배치
│   │   ├── visualization/       # 일정 시각화
│   │   └── share/               # 일정 공유
│   ├── layout.tsx               # 루트 레이아웃
│   ├── page.tsx                 # 루트 → /home 리디렉션
│   └── globals.css              # 전역 스타일
├── components/
│   ├── common/                  # 버튼, 인풋, 모달 등 공통 컴포넌트
│   └── feature/                 # TodoItem, TimeSlot 등 기능별 컴포넌트
├── hooks/                       # 커스텀 훅
├── stores/                      # Zustand 전역 상태
├── services/                    # API 호출 함수
├── types/                       # TypeScript 타입 정의
├── lib/                         # 유틸리티, 상수
├── middleware.ts                 # 인증 접근 제어
├── .nvmrc                       # Node.js 버전 고정 (v22)
└── TRD                          # 기술 요구사항 문서
```

---

## Getting Started

### 요구사항

- Node.js v22 ([nvm](https://github.com/nvm-sh/nvm) 사용 권장)
- pnpm

### 설치 및 실행

```bash
# Node.js 버전 설정
nvm use

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

개발 서버는 [http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

### 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 값을 입력합니다.

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## Scripts

| 명령어 | 설명 |
|---|---|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 |
| `pnpm lint` | ESLint 검사 |
