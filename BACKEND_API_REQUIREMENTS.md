# 백엔드 API 보완 요청서

프론트엔드 코드와 백엔드 Swagger(`http://localhost:8080/swagger-ui`)를 대조하여 작성했습니다.

---

## ✅ 반영 완료 (4차 업데이트 기준)

| 항목 | 내용 |
|------|------|
| `GET /api/users/me` | `UserResponse` 반환 추가 |
| `TodoResponse` | `completed`, `isTop3`, `top3Order`, `memo`, `estimatedMinutes` 추가 |
| `UpdateTodoRequest` | `completed`, `memo`, `estimatedMinutes` 추가 |
| `CreateTodoRequest` | `memo`, `estimatedMinutes` 추가 |
| `Top3Response` | `order` 필드명 통일 |
| `ScheduleResponse` (PUT) | `date`, `endTime` 추가 |
| `AssignScheduleRequest` | `date`, `endTime` 추가 |
| `POST /api/shares` | `ShareResponse` 반환 추가 (`shareToken` 포함) |
| `GET /api/shares/:token` | 공개 엔드포인트 (인증 불필요) + `schedules`, `top3Data` 필드 추가 |
| `POST /api/auth/sign-up` | `TokenResponse` 반환 (`accessToken`, `refreshToken`, `isProfileComplete`) |
| `GET /api/schedules` | `DailyScheduleItemResponse`에 `endTime` 포함 |

---

## 🚨 미해결 버그 — GET /api/shares/:token 응답 누락 (2026-05-04 확인)

### 증상

공유 링크(`/share/{token}`)를 새 브라우저에서 열었을 때:
- 핵심 3가지(Top3) 카드 미노출
- 타임라인 블록 빈칸 (격자 구조만 표시, 제목 없음)

### 원인

`GET /api/shares/:token` 응답에서 **`todos` 배열이 null 또는 누락**되어 있습니다.  
`top3Data` 배열도 누락되었을 가능성이 높습니다.

프론트엔드는 `todos`의 `title`을 사용해 Top3 카드 제목과 타임라인 블록 제목을 렌더링합니다.  
`todos`가 없으면 제목을 표시할 수 없어 화면이 빈칸이 됩니다.

### 백엔드 수정 요청

`GET /api/shares/:token` 응답에 아래 필드를 **반드시 포함**해 주세요:

| 필드 | 타입 | 필수 여부 | 설명 |
|------|------|-----------|------|
| `todos` | `TodoResponse[]` | **필수** | 해당 날짜의 전체 할 일 목록. `null` 또는 필드 누락 불가 |
| `top3Data` | `Top3Response[]` | **필수** | Top3로 지정된 항목 목록. `null` 또는 필드 누락 불가 |
| `schedules` | `ScheduleResponse[]` | 선택 | 타임라인 데이터. 없으면 카드형 뷰로 폴백 |

> `includeDetails`, `includeStatus` 옵션은 카드 뷰의 메모/완료 여부 표시 제어용입니다.  
> 이 옵션과 **무관하게** `todos`와 `top3Data`는 항상 응답에 포함되어야 합니다.

### 확인 방법

`GET /api/shares/{token}` 응답 JSON에서 아래를 확인해 주세요:

```json
{
  "todos": [ { "id": 1, "title": "보고서 작성", ... } ],   ← null이면 안 됨
  "top3Data": [ { "id": 1, "todoId": 1, "order": 1, ... } ], ← null이면 안 됨
  "schedules": [ ... ]
}
```

---

## ✅ 공유 기능 연동 스펙 (2026-05-04 백엔드·프론트 모두 반영 완료)

### `POST /api/shares` — 공유 생성

**Request**

```json
{
  "date": "2026-05-04",
  "includeDetails": false,
  "includeStatus": true,
  "isPrivate": false
}
```

**Response** (`ShareResponse`)

```json
{
  "shareToken": "abc123xyz",
  "shareUrl": "https://api.example.com/api/shares/abc123xyz",
  "expiresAt": "2026-05-11T10:00:00",
  "date": "2026-05-04",
  "includeDetails": false,
  "includeStatus": true,
  "isPrivate": false,
  "todos": [...],
  "schedules": [...],
  "top3Data": [...]
}
```

> 프론트는 `shareUrl` 대신 `shareToken`으로 프론트엔드 URL(`/share/:token`)을 직접 구성합니다.

---

### `GET /api/shares/:token` — 공유 조회 (인증 불필요)

- **인증 헤더 없이 호출됩니다.** `Authorization` 없어도 200을 반환해야 합니다.
- `isPrivate: true`인 경우의 접근 제어는 백엔드에서 처리해 주세요.

**Response** (`ShareResponse`) — 전체 구조

```json
{
  "shareToken": "abc123xyz",
  "shareUrl": "https://api.example.com/api/shares/abc123xyz",
  "expiresAt": "2026-05-11T10:00:00",
  "date": "2026-05-04",
  "includeDetails": false,
  "includeStatus": true,
  "isPrivate": false,
  "todos": [
    {
      "id": 1,
      "title": "보고서 작성",
      "memo": "3페이지 분량",
      "estimatedMinutes": 90,
      "date": "2026-05-04",
      "completed": false,
      "isTop3": true,
      "top3Order": 1
    }
  ],
  "schedules": [
    {
      "id": 1,
      "todoId": 1,
      "date": "2026-05-04",
      "startTime": "09:00",
      "endTime": "10:30"
    }
  ],
  "top3Data": [
    {
      "id": 1,
      "todoId": 1,
      "date": "2026-05-04",
      "order": 1
    }
  ]
}
```

**필드별 주의사항**

| 필드 | 타입 | 비고 |
|------|------|------|
| `schedules[].startTime` | `string` | `"HH:MM"` 형식 필수 (타임라인 슬롯 매칭에 사용) |
| `schedules[].endTime` | `string \| null` | 없으면 프론트가 `startTime + 60분`으로 폴백 계산 |
| `top3Data[].order` | `number` | `1`, `2`, `3` 정수값 (Top3 카드 순서 결정) |
| `top3Data` | 필드명 | 반드시 `top3Data` 키명 사용 (`top3`, `top3List` 등 불가) |
| `schedules` | 선택 필드 | 비어있거나 누락 시 타임라인 대신 카드형 뷰로 폴백 |

**프론트 렌더링 분기**

```
schedules.length > 0  →  타임라인 뷰 (Top3 요약카드 + 시간별 블록)
schedules 없음/비어있음  →  ShareCard 뷰 (할 일 목록 카드)
```

---

## 📝 프론트엔드 코드 변경 이력

### 4차 업데이트 (2026-05-04)

| 파일 | 변경 내용 |
|------|----------|
| `services/authService.ts` | `signUp()` 반환 타입 `void` → `AuthResponse` |
| `app/(auth)/signup/page.tsx` | 가입 성공 후 토큰 저장(`setAuth`) + `/home` 자동 로그인으로 변경 (`isProfileComplete: false`이면 `/complete-profile` 이동) |
| `services/shareService.ts` | `getShare()` 를 인증 없는 `publicApi` 인스턴스로 변경 |
| `services/api.ts` | `publicApi` 인스턴스 추가 (인증 인터셉터 없음) |
| `types/share.ts` | `ShareResponse`에 `schedules?`, `top3Data?` 필드 추가 |
| `app/(main)/share/page.tsx` | 복사 URL을 `shareToken` 기반 프론트엔드 URL로 고정 |
| `app/share/[token]/page.tsx` | `schedules` 있으면 타임라인 뷰, 없으면 ShareCard 뷰로 분기 |

---

## 참고: 과거 프론트 우회 방식 (현재 모두 해소됨)

| 항목 | 우회 방법 (과거) | 현재 상태 |
|------|----------|----------|
| `sign-up` 응답 없음 | 가입 후 `/login`으로 리다이렉트 | ✅ `TokenResponse` 반환 + 프론트 자동 로그인 처리 |
| `schedules[].endTime` 누락 | `startTime + estimatedMinutes` 로 폴백 계산 | ✅ `endTime` 포함으로 해소 |
| `TokenResponse`에 `user` 없음 | accessToken JWT payload + Google 프로필로 구성 (구글 로그인만 해당) | 미해소 (필요 시 별도 요청) |
