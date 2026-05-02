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

- [ ] `types/auth.ts`
  - `interface SignUpRequest` — name, email, password, phone?, birthDate?, gender?
  - `interface LoginRequest` — email, password
  - `interface AuthResponse` — accessToken, refreshToken, user, isProfileComplete?
  - `interface RefreshRequest` — refreshToken
  - `interface GoogleLoginRequest` — idToken
  - `interface CompleteProfileRequest` — phone, gender, birthday, 약관 동의
  - `type Gender = 'male' | 'female' | 'other'`
- [ ] `services/authService.ts` — signUp(), login(), refresh(), googleLogin(), completeProfile()
- [ ] `stores/authStore.ts` — Zustand: user, accessToken, 로그아웃
- [ ] `components/common/PasswordInput.tsx` — 보이기/숨기기 토글
- [ ] `components/feature/GenderRadioGroup.tsx` — peer-checked 스타일
- [ ] `components/feature/TermsAgreement.tsx` — 전체동의 + 개별 체크박스 + 약관 모달
- [ ] `app/(auth)/login/page.tsx`
  - [ ] 이메일/비밀번호 폼 (React Hook Form + Zod)
  - [ ] Google OAuth 버튼 (NextAuth)
- [ ] `app/(auth)/signup/page.tsx`
  - [ ] 전체 폼 (이름, 이메일, 비밀번호, 전화번호, 생년월일, 성별)
  - [ ] 약관 동의 섹션
  - [ ] 소셜 가입 시 추가정보 입력 플로우

---

### Phase 3 — 할 일 (`/home`)

**타입:** 서버 응답 → `interface`, 상태값 → `type`

- [ ] `types/todo.ts`
  - `interface TodoResponse` — id, title, memo?, estimatedMinutes?, date, completed, isTop3, top3Order?
  - `interface CreateTodoRequest` — title, memo?, estimatedMinutes?, date
  - `interface UpdateTodoRequest` — title?, memo?, estimatedMinutes?, completed?
  - `type TodoStatus = 'pending' | 'completed'`
- [ ] `services/todoService.ts` — getTodos(date), createTodo(), updateTodo(), deleteTodo()
- [ ] `hooks/useTodos.ts` — useQuery + useMutation 래핑
- [ ] `components/feature/TodoItem.tsx` — 체크박스, 제목, 시간, edit/delete (hover 노출)
- [ ] `components/feature/TodoList.tsx` — 진행중/완료 섹션 분리
- [ ] `components/feature/QuickAddInput.tsx` — 인라인 빠른 추가 (Enter로 생성)
- [ ] `app/(main)/home/page.tsx`
  - [ ] 오늘 날짜 할 일 목록 조회
  - [ ] "핵심 3가지 선택" 프롬프트 박스 (/top3 이동 버튼)

---

### Phase 4 — 핵심 3가지 선택 (`/top3`)

- [ ] `types/top3.ts`
  - `interface Top3Response` — id, todoId, date, order
  - `interface SetTop3Request` — todoIds: number[]
- [ ] `services/top3Service.ts` — getTop3(date), setTop3()
- [ ] `hooks/useTop3.ts`
- [ ] `components/feature/Top3Card.tsx` — 선택/미선택 상태, border-secondary, 별 아이콘
- [ ] `components/feature/Top3Grid.tsx` — bento grid (grid-cols-3)
- [ ] `components/feature/Top3ProgressBar.tsx` — "2/3 선택됨" sticky 진행상황
- [ ] `app/(main)/top3/page.tsx`
  - [ ] 선택된 todoId 배열 Zustand 관리
  - [ ] 3개 선택 시 "시간 배치" 버튼 활성화 → /schedule 이동

---

### Phase 5 — 시간 배치 (`/schedule`)

**추가 설치 필요:** `@dnd-kit/core`, `@dnd-kit/sortable`

- [ ] `types/schedule.ts`
  - `interface ScheduleResponse` — id, todoId, date, startTime, endTime
  - `interface UpsertScheduleRequest` — todoId, date, startTime, endTime
- [ ] `services/scheduleService.ts` — getSchedules(date), upsertSchedule(), deleteSchedule()
- [ ] `hooks/useSchedule.ts`
- [ ] `components/feature/DraggableTodoCard.tsx` — 좌측 패널 드래그 소스 (cursor-grab)
- [ ] `components/feature/TimelineGrid.tsx` — 우측 시간대 그리드 (h-[64px]/시간)
- [ ] `components/feature/TimelineSlot.tsx` — 드롭 타겟 슬롯
- [ ] `components/feature/ScheduledBlock.tsx` — 배치된 과업 블록 (border-l-4 border-secondary)
- [ ] `components/feature/CurrentTimeIndicator.tsx` — 빨간 현재 시간 선
- [ ] `app/(main)/schedule/page.tsx`
  - [ ] 좌측: 핵심 3가지 드래그 카드 + 미배치 배지
  - [ ] 우측: 드롭 가능한 타임라인
  - [ ] 초기화 / 하루 일정 확정 버튼

---

### Phase 6 — 일간 타임라인 (`/visualization`)

읽기 전용 뷰 (schedule + top3 데이터 합성)

- [ ] `components/feature/Top3Summary.tsx` — 좌측: 완료/진행중/예정 상태 카드 (펄스 애니메이션)
- [ ] `components/feature/DailyStats.tsx` — 달성률 % 박스
- [ ] `components/feature/TimelineView.tsx` — 우측: 완료(bg-secondary-fixed) / 진행중(border-secondary) / 예정 색상 구분
- [ ] `components/feature/DatePicker.tsx` — 좌/우 화살표 날짜 네비게이션
- [ ] `app/(main)/visualization/page.tsx`

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
