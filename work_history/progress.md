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

## 진행 예정 작업

### 공통 기반 작업

- [ ] 환경변수 설정 (.env.local)
- [ ] Axios 인스턴스 및 인터셉터 설정 (services/api.ts)
- [ ] React Query Provider 설정
- [ ] 공통 컴포넌트 개발 (components/common/)
  - [ ] Button
  - [ ] Input
  - [ ] Checkbox
  - [ ] Modal

---

### 화면별 작업

#### 1. 로그인 화면 (`/login`)
- [ ] 타입 정의 (types/auth.ts)
- [ ] API 서비스 작성 (services/auth.ts)
- [ ] Zustand 인증 스토어 작성 (stores/authStore.ts)
- [ ] 로그인 폼 UI 구현
- [ ] 일반 로그인 (이메일 + 비밀번호) 연동
- [ ] 구글 소셜 로그인 연동 (NextAuth.js)

#### 2. 회원가입 화면 (`/signup`)
- [ ] 회원가입 폼 UI 구현
  - [ ] 이메일, 비밀번호, 이름, 휴대폰 번호, 성별, 생년월일 입력
- [ ] Zod 유효성 검사 스키마 작성
- [ ] 약관 동의 UI 구현
  - [ ] 전체 동의 버튼
  - [ ] 서비스 이용약관 (필수)
  - [ ] 개인정보 처리방침 (필수)
  - [ ] 마케팅 정보 수신 동의 (선택)
  - [ ] 약관 전문 보기 모달
- [ ] 소셜 로그인 신규 가입 플로우 구현
  - [ ] 약관 동의 화면
  - [ ] 추가 정보 입력 화면 (휴대폰 번호, 성별, 생년월일)

#### 3. 홈 화면 (`/home`)
- [ ] 타입 정의 (types/todo.ts)
- [ ] API 서비스 작성 (services/todo.ts)
- [ ] 오늘 할 일 목록 조회 (React Query)
- [ ] 할 일 추가 기능
- [ ] 할 일 수정 기능
- [ ] 할 일 삭제 기능

#### 4. Top3 선택 화면 (`/top3`)
- [ ] 등록된 할 일 목록에서 3개 선택 UI
- [ ] 선택 상태 Zustand로 관리
- [ ] 선택 완료 후 시간 배치 화면으로 이동

#### 5. 시간 배치 화면 (`/schedule`)
- [ ] 타입 정의 (types/schedule.ts)
- [ ] API 서비스 작성 (services/schedule.ts)
- [ ] 24시간 타임라인 UI 구현
- [ ] 할 일별 시간 배치 기능
- [ ] 배치 데이터 저장 연동

#### 6. 일정 시각화 화면 (`/visualization`)
- [ ] 날짜 선택 UI
- [ ] 24시간 타임라인 시각화
- [ ] 날짜별 일정 조회 연동

#### 7. 일정 공유 화면 (`/share`)
- [ ] 링크 공유 기능
- [ ] 이미지 공유 기능

---

## 참고

- 브랜치 네이밍: `feature/기능명` (예: `feature/login`)
- 커밋 규칙: `feat`, `fix`, `design`, `refactor`, `docs`, `chore`
- 작업 완료 시 이 파일의 체크박스를 업데이트할 것
