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

## Feature Development Workflow

기능 하나를 개발할 때 아래 순서로 작업합니다.

```
1. 브랜치 생성
   └── main에서 feature 브랜치 분기
       예) feature/login, feature/todo-list

2. 타입 정의 (types/)
   └── API 요청/응답, 도메인 모델 등 TypeScript 타입 작성

3. API 서비스 작성 (services/)
   └── 해당 기능에 필요한 API 호출 함수 작성

4. 상태 관리 (stores/ 또는 React Query)
   ├── 서버 데이터 → React Query (useQuery, useMutation)
   └── 전역 클라이언트 상태 → Zustand store 작성

5. 커스텀 훅 작성 (hooks/)
   └── 상태·API 호출·비즈니스 로직을 컴포넌트에서 분리

6. 컴포넌트 개발 (components/)
   ├── common/ : 재사용 가능한 공통 UI 컴포넌트
   └── feature/ : 해당 기능 전용 컴포넌트

7. 페이지 연결 (app/)
   └── 컴포넌트를 조합하여 페이지 완성

8. 로컬 확인
   └── pnpm dev로 실행 후 기능 동작 확인

9. PR 생성 → 코드 리뷰 → main 머지
```

### 브랜치 네이밍 규칙

| 유형 | 형식 | 예시 |
|---|---|---|
| 기능 개발 | `feature/기능명` | `feature/login` |
| 버그 수정 | `fix/버그명` | `fix/token-refresh` |
| UI 수정 | `design/화면명` | `design/home-layout` |
| 리팩토링 | `refactor/대상` | `refactor/auth-store` |

### 커밋 메시지 규칙

| 유형 | 설명 |
|---|---|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `design` | UI/스타일 변경 |
| `refactor` | 기능 변경 없는 코드 개선 |
| `docs` | 문서 수정 |
| `chore` | 설정, 패키지 변경 |

```bash
# 예시
git commit -m "feat: 로그인 페이지 구현"
git commit -m "fix: 토큰 만료 시 리디렉션 오류 수정"
```

---

## Scripts

| 명령어 | 설명 |
|---|---|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 |
| `pnpm lint` | ESLint 검사 |
