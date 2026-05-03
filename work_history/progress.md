# ThreeFocus Frontend 진행 상황

## 완료된 작업

### 프로젝트 초기 설정 (2026-05-01)

- [x] Next.js 프로젝트 생성 (App Router, TypeScript, Tailwind CSS)
- [x] 패키지 매니저 pnpm 전환
- [x] Node.js v22 설정 (.nvmrc)
- [x] 라이브러리 설치
  - Zustand (전역 상태관리)
  - TanStack Query / Axios (서버 통신)
  - React Hook Form + Zod (폼 관리)
  - NextAuth.js (소셜 로그인)
- [x] TRD 작성
- [x] 폴더 구조 세팅 (app, components, hooks, stores, services, types, lib)
- [x] 라우팅 구조 설정 ((auth), (main) 그룹)
- [x] middleware.ts 인증 접근 제어 구현
- [x] Next.js 기본 보일러플레이트 정리
- [x] GitHub 레포지토리 등록 및 push
- [x] README.md 작성 (기술 스택, 폴더 구조, 개발 워크플로우)

---

### 구현 플랜 수립 (2026-05-02)

- [x] HTML 디자인 시안 7개 분석 (kr 버전 기준)
- [x] 서버 API 명세서 분석 (three_focus_server README.md)
- [x] 디자인 시스템 분석 (DESIGN.md — 컬러/타이포/스페이싱 토큰)
- [x] HTML↔API↔Next.js 경로 매핑 완료
- [x] Phase별 구현 순서 및 컴포넌트 목록 확정
- [x] TypeScript 타입 전략 확정 (DTO → interface, 나머지 → type)

#### HTML → Next.js 경로 매핑

| HTML 파일 | Next.js 경로 | 연동 API |
|---|---|---|
| `login.html` | `/login` | POST `/api/auth/login` |
| `signup.html` | `/signup` | POST `/api/auth/sign-up` |
| `today_focus.html` | `/home` | GET/POST/PUT/DELETE `/api/todos` |
| `3_threefocus.html` | `/top3` | GET `/api/todos`, POST/GET `/api/top3` |
| `time_allocation.html` | `/schedule` | PUT/GET/DELETE `/api/schedules` |
| `daily_timeline.html` | `/visualization` | GET `/api/schedules`, GET `/api/top3` |
| `share_your_fucus.html` | `/share` | POST/GET `/api/shares` |

---

## 진행 예정 작업

### Phase 0 — 디자인 토큰 / 기반 설정

- [x] `app/globals.css` — Tailwind v4 `@theme` 블록으로 디자인 토큰 추가
  - [x] colors: primary(#000), secondary(#006b5f), surface/on-surface 계열, error 등
  - [x] fontFamily: Inter (`--font-sans: var(--font-inter), ...`)
  - [x] spacing: timeline-slot(64px), container-padding(24px), gutter(16px) 등
  - [x] borderRadius: sm(0.25rem), md(0.75rem), lg(1rem), xl(1.5rem)
- [x] `app/layout.tsx` — `next/font/google`으로 Inter 폰트 적용, body에 `bg-background text-on-surface`
- [x] 환경변수 설정 (`.env.local`) — `NEXT_PUBLIC_API_URL=http://localhost:8080` 추가
- [x] Axios 인스턴스 및 인터셉터 설정 (`services/api.ts`)
  - [x] baseURL, Authorization 헤더 자동 주입
  - [x] 401 시 refresh 토큰으로 재발급 인터셉터 (실패 시 `/login` 리다이렉트)
- [x] React Query Provider 설정 (`lib/providers.tsx`, root layout에 래핑)

---

### Phase 1 — 공통 레이아웃 컴포넌트

- [x] `components/common/TopAppBar.tsx` — 로고 + 알림/설정/프로필 아이콘
- [x] `components/common/SideNav.tsx` — 데스크톱 좌측 네비 (lg:w-64)
  - 메뉴: 할 일(home), 집중(top3), 타임라인(visualization), 공유(share)
- [x] `components/common/BottomNav.tsx` — 모바일 탭바 (lg:hidden, h-20)
- [x] `app/(main)/layout.tsx` — TopAppBar + SideNav + BottomNav 조합
- [x] 공통 UI 컴포넌트
  - [x] `Button.tsx` — variant(primary/secondary/ghost/danger), size(sm/md/lg), loading 스피너
  - [x] `Input.tsx` — label, error 메시지, focus 시 border-secondary
  - [x] `Checkbox.tsx` — accent-secondary
  - [x] `Modal.tsx` — ESC 닫기, 오버레이 클릭 닫기

---

### Phase 2 — 인증

**타입:** DTO → `interface`, UI 상태 → `type`

- [x] `types/auth.ts` — LoginRequest, SignUpRequest, GoogleLoginRequest, CompleteProfileRequest, AuthResponse, RefreshRequest (interface), Gender/User (type)
- [x] `types/next-auth.d.ts` — Session/JWT 타입 확장 (accessToken, backendUser 등)
- [x] `services/authService.ts` — login, signUp, refresh, googleLogin, completeProfile
- [x] `lib/actions/auth.ts` — Server Actions: setAuthCookie, clearAuthCookie (httpOnly 쿠키)
- [x] `app/api/auth/[...nextauth]/route.ts` — Google OAuth, JWT 콜백에서 백엔드 토큰 교환
- [x] `lib/providers.tsx` — SessionProvider 추가
- [x] `components/common/PasswordInput.tsx` — 보이기/숨기기 토글 (Eye/EyeOff)
- [x] `components/feature/auth/GenderRadioGroup.tsx` — peer-checked 스타일 라디오
- [x] `components/feature/auth/TermsAgreement.tsx` — 전체동의 + 개별 체크박스 (useFormContext)
- [x] `app/(auth)/layout.tsx` — 인증 페이지 공통 레이아웃 (중앙 정렬)
- [x] `app/(auth)/login/page.tsx` — 이메일/비밀번호 폼 + Google OAuth 버튼
- [x] `app/(auth)/signup/page.tsx` — 전체 폼 + 약관 동의 섹션 (React Hook Form + Zod v4)
- [x] `app/google-callback/page.tsx` — Google 토큰 교환 후 쿠키 설정 + 리다이렉트
- [x] `middleware.ts` → `proxy.ts` 마이그레이션 (deprecated 해소), PUBLIC_PATHS에 /google-callback, /share 추가
- [x] 소셜 가입 추가정보 입력 플로우 (`/complete-profile`) — isProfileComplete: false 시 phone/birthday/gender/약관 입력
- [x] Google OAuth JWT 콜백에서 백엔드 user 미반환 시 JWT payload + Google 프로필로 user 구성
- [x] 로그인 페이지 `google-auth-failed` 에러 파라미터 처리 (에러 배너 표시)

---

### Phase 3 — 할 일 (`/home`)

**타입:** 서버 응답 → `interface`, 상태값 → `type`

- [x] `types/todo.ts` — TodoResponse, CreateTodoRequest, UpdateTodoRequest (interface), TodoStatus (type)
- [x] `services/todoService.ts` — getTodos, createTodo, updateTodo, deleteTodo
- [x] `hooks/useTodos.ts` — useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo
- [x] `lib/utils.ts` — toDateString, formatMinutes 유틸
- [x] `stores/todoStore.ts` — quickAddValue UI 상태
- [x] `components/feature/todo/TodoItem.tsx` — 체크박스, top3 배지, 인라인 편집, edit/delete hover
- [x] `components/feature/todo/TodoList.tsx` — 진행중/완료 섹션 분리
- [x] `components/feature/todo/QuickAddInput.tsx` — Enter로 할 일 추가 (한국어 IME isComposing 처리)
- [x] `app/(main)/home/page.tsx` — 오늘 날짜 CRUD + 핵심 3가지 프롬프트 박스

---

### Phase 4 — 핵심 3가지 선택 (`/top3`)

- [x] `types/top3.ts`
  - `interface Top3Response` — id, todoId, date, order
  - `interface SetTop3Request` — todoIds: number[], date: string
- [x] `services/top3Service.ts` — getTop3(date), setTop3()
- [x] `hooks/useTop3.ts`
- [x] `components/feature/top3/Top3Card.tsx` — 선택/미선택 상태, border-secondary, 별 아이콘, order 배지
- [x] `components/feature/top3/Top3ProgressBar.tsx` — "N/3 선택됨" sticky 진행상황, 시간 배치 버튼
- [x] `app/(main)/top3/page.tsx`
  - [x] 기존 top3 데이터로 selectedIds 초기화 (useEffect)
  - [x] 최대 3개 선택 제한 handleToggle
  - [x] 3개 선택 시 "시간 배치" 버튼 활성화 → setTop3.mutateAsync → /schedule 이동
  - [x] 반응형 bento grid (grid-cols-1/2/3)

---

### Phase 5 — 시간 배치 (`/schedule`)

- [x] `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` 설치
- [x] `types/schedule.ts`
  - `interface ScheduleResponse` — id, todoId, date, startTime, endTime
  - `interface UpsertScheduleRequest` — todoId, date, startTime, endTime
- [x] `services/schedule.ts` — getSchedules(date), upsertSchedule(), deleteSchedule()
- [x] `hooks/useSchedule.ts` — useSchedules, useUpsertSchedule, useDeleteSchedule
- [x] `lib/utils.ts` — addMinutesToTime, formatTimeRange 유틸 추가
- [x] `components/feature/schedule/DraggableTaskCard.tsx` — useDraggable, cursor-grab, 시간/미배치 배지
- [x] `components/feature/schedule/TimelineSlot.tsx` — useDroppable, 드롭 강조(isOver)
- [x] `components/feature/schedule/ScheduledBlock.tsx` — border-l-4 border-secondary, 제거 버튼
- [x] `components/feature/schedule/CurrentTimeIndicator.tsx` — 빨간 현재 시간 선 (1분 갱신)
- [x] `components/feature/schedule/TimelineGrid.tsx` — 05:00~22:00 슬롯, 600px 스크롤
- [x] `app/(main)/schedule/page.tsx`
  - [x] DndContext onDragEnd → upsertSchedule (startTime=슬롯시각, endTime=+estimatedMinutes)
  - [x] 좌측: 핵심 3가지 DraggableTaskCard + 빈 상태 처리
  - [x] 우측: TimelineGrid (droppable 슬롯, ScheduledBlock)
  - [x] 초기화(전체 삭제) / 하루 일정 확정(→ /visualization) 버튼

---

### Phase 6 — 일간 타임라인 (`/visualization`)

읽기 전용 뷰 (schedule + top3 데이터 합성)

- [x] `lib/utils.ts` — formatDateLabel 유틸 추가
- [x] `components/feature/schedule/CurrentTimeIndicator.tsx` — offsetClass prop 추가 (재사용성)
- [x] `components/feature/visualization/Top3SummaryCard.tsx` — completed/active/pending 3상태 카드
- [x] `components/feature/visualization/StatsBox.tsx` — 달성률 % (bg-primary-container 다크 박스)
- [x] `components/feature/visualization/VisualizationBlock.tsx` — 상태별 색상 블록 (read-only)
- [x] `components/feature/visualization/VisualizationTimeline.tsx` — 05:00~22:00 읽기 전용 타임라인
- [x] `app/(main)/visualization/page.tsx`
  - [x] 날짜 좌우 네비게이션 (ChevronLeft/Right)
  - [x] 좌측: Top3SummaryCard × 3 + StatsBox(달성률)
  - [x] 우측: VisualizationTimeline (상태별 블록, 오늘일 때만 현재시간 표시)
  - [x] 공유 버튼 → /share

---

### Phase 7 — 일정 공유 (`/share`)

- [ ] `types/share.ts`
  - `interface ShareResponse` — shareToken, shareUrl, expiresAt, todos: TodoResponse[]
  - `interface CreateShareRequest` — includeDetails, includeStatus, isPrivate
- [ ] `services/shareService.ts` — createShare(), getShare(token)
- [ ] `components/feature/ShareCard.tsx` — 공유 미리보기 카드 (이미지 저장 대상)
- [ ] `components/feature/ShareOptions.tsx` — 체크박스 3개 (과업 상세/완료상태/비공개)
- [ ] `components/feature/ShareActions.tsx` — 링크 복사, 이미지 저장 버튼
- [ ] `app/(main)/share/page.tsx`
- [ ] `app/share/[token]/page.tsx` — 인증 불필요 (middleware.ts 예외 추가)

---

## 참고

- 브랜치 네이밍: `feature/기능명` (예: `feature/login`)
- 커밋 규칙: `feat`, `fix`, `design`, `refactor`, `docs`, `chore`
- 작업 완료 시 이 파일의 체크박스를 업데이트할 것
