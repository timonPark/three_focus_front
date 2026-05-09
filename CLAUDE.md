@AGENTS.md

# ThreeFocus Frontend

Next.js 16 App Router 기반 생산성 앱. 할 일 관리 → Top3 선택 → 시간 배치 → 시각화 → 공유의 워크플로우.

## 기술 스택

| 역할 | 라이브러리 |
|------|-----------|
| 프레임워크 | Next.js 16.2.4 (App Router) |
| 언어 | TypeScript 5 |
| 스타일 | Tailwind CSS v4 (`@theme` 블록 — v3 문법 사용 금지) |
| 서버 상태 | TanStack Query v5 |
| HTTP | Axios (`services/api.ts` 인스턴스 사용) |
| 전역 UI 상태 | Zustand v5 |
| 폼 | React Hook Form + Zod v4 |
| DnD | @dnd-kit/core |
| 패키지 매니저 | pnpm |

## 폴더 구조

```
app/
  (auth)/          # 로그인·회원가입 (인증 불필요)
  (main)/          # 메인 기능 (인증 필요)
    home/          # 할 일 목록
    top3/          # 핵심 3가지 선택
    schedule/      # 시간 배치 (DnD)
    visualization/ # 일간 타임라인 (읽기 전용)
    share/         # 공유 설정
  share/[token]/   # 공개 공유 페이지 (인증 불필요)
  google-callback/ # Google OAuth 콜백

components/
  common/          # TopAppBar, SideNav, BottomNav, Button, Input, Modal 등
  feature/         # 기능별 컴포넌트 (todo/, top3/, schedule/, share/, visualization/)

hooks/             # TanStack Query 훅 (useQuery / useMutation 래퍼)
services/          # API 호출 객체 (fooService = { getFoos, createFoo, ... })
stores/            # Zustand 스토어 (authStore, todoStore)
types/             # TypeScript 타입 (DTO → interface, 그 외 → type)
lib/
  utils.ts         # toDateString, parseTimeString, formatMinutes 등 유틸
  providers.tsx    # QueryClientProvider 래핑
  actions/auth.ts  # Server Actions (httpOnly 쿠키 조작)
proxy.ts           # 인증 미들웨어 (middleware.ts 대체)
```

## 라우팅 & 인증

- 인증 게이트: `proxy.ts` — `token` 쿠키 유무로 접근 제어
- 공개 경로: `/login`, `/signup`, `/google-callback`, `/share/*`, `/api/auth/*`
- 로그인 상태에서 `/login`, `/signup` 접근 → `/home` 리다이렉트

## 핵심 컨벤션

### TypeScript 타입
- 서버 ↔ 클라이언트 DTO → `interface` (예: `TodoResponse`, `CreateTodoRequest`)
- 그 외 전부 → `type` (컴포넌트 props, 유니온, Zustand 스토어 등)
- 자세한 규칙: **three-focus-types** 스킬 참조

### API 호출
```ts
// 인증 필요
import api from './api'
api.get<FooResponse[]>('/api/foos', { params: { date } }).then((r) => r.data)

// 인증 불필요 (공유 페이지 등)
import { publicApi } from './api'
publicApi.get<ShareResponse>(`/api/shares/${token}`).then((r) => r.data)
```
- 401 응답 시 자동 refresh 후 재시도, 실패 시 `/login` 리다이렉트 (인터셉터 내장)
- raw `axios` 직접 import 금지

### TanStack Query 훅
```ts
// queryKey는 [도메인, 파라미터] 배열
queryKey: ['todos', date]

// mutation 성공 후 반드시 invalidate
onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos', date] })
```

### Zustand 스토어
- 서버 데이터는 Zustand에 넣지 않음 (TanStack Query가 source of truth)
- localStorage 유지 필요 시 `persist` 미들웨어 사용
- React 밖에서 읽을 때: `useAuthStore.getState().accessToken`

### 컴포넌트
- 클라이언트 컴포넌트는 파일 첫 줄에 `'use client'`
- Props 타입은 `type` (interface 아님)
- 파일명: PascalCase (`TodoItem.tsx`)
- 훅 파일명: camelCase (`useTodos.ts`)

### Tailwind CSS v4
- 디자인 토큰은 `app/globals.css`의 `@theme` 블록에 정의
- 커스텀 색상 예: `text-primary`, `bg-secondary`, `border-outline-variant`
- `tailwind.config.js` 없음 — 설정 파일 생성 금지
- 스타일 참조: **three-focus-design** 스킬

## 개발 명령

```bash
pnpm dev      # 개발 서버 (http://localhost:3000)
pnpm build    # 프로덕션 빌드
pnpm lint     # ESLint 검사
```

환경변수: `.env.local`에 `NEXT_PUBLIC_API_URL=http://localhost:8080`

## 스킬 사용 가이드

| 상황 | 스킬 |
|------|------|
| 새 기능 모듈 추가 | `/three-focus-feature` |
| 타입 정의 (`interface` vs `type`) | `/three-focus-types` |
| 컴포넌트 스타일링, 디자인 토큰 | `/three-focus-design` |
| 상태 관리 (Zustand / TanStack Query) | `/three-focus-store` |

## 주의사항

- **Next.js 버전**: 16.x는 트레이닝 데이터와 API가 다를 수 있음. `node_modules/next/dist/docs/` 확인 후 작성
- **Tailwind v4**: `@apply`, `theme()`, `tailwind.config.js` 등 v3 문법 사용 불가
- **middleware.ts 없음**: 인증 미들웨어는 `proxy.ts`가 담당 (`export function proxy`)
- **pnpm only**: `npm` / `yarn` 명령 사용 금지
