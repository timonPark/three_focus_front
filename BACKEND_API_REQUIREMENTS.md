# 백엔드 API 보완 요청서

프론트엔드 코드와 백엔드 Swagger(`http://localhost:8080/swagger-ui`)를 대조하여 작성했습니다.

---

## ✅ 반영 완료 (2차 업데이트 기준)

| 항목 | 내용 |
|------|------|
| `GET /api/users/me` | `UserResponse` 반환 추가 |
| `TodoResponse` | `completed`, `isTop3`, `top3Order`, `memo`, `estimatedMinutes` 추가 |
| `UpdateTodoRequest` | `completed`, `memo`, `estimatedMinutes` 추가 |
| `CreateTodoRequest` | `memo`, `estimatedMinutes` 추가 |
| `Top3Response` | `order` 필드명 통일 |
| `ScheduleResponse` (PUT) | `date`, `endTime` 추가 |
| `AssignScheduleRequest` | `date`, `endTime` 추가 |

---

## 🔴 아직 미반영 (추가 작업 필요)

### 1. `POST /api/auth/sign-up` — 응답 바디 없음

회원가입 후 자동 로그인이 불가능합니다. 현재 프론트는 가입 성공 시 `/login`으로 리다이렉트하는 방식으로 우회 중입니다.

**요청**: 아래 형식으로 `TokenResponse` 반환

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "isProfileComplete": true
}
```

---

### 2. `POST /api/shares` — 응답 바디 없음

공유 링크 생성 후 프론트에서 `shareToken`을 받아야 사용자에게 링크를 보여줄 수 있습니다.

**요청**: 아래 형식으로 `ShareResponse` 반환

```json
{
  "id": 1,
  "shareToken": "abc123xyz",
  "date": "2026-05-03",
  "createdAt": "2026-05-03T10:00:00"
}
```

---

### 3. `GET /api/schedules` — `DailyScheduleItemResponse`에 `endTime` 누락

타임라인 UI에서 스케줄 블록의 **높이와 종료 시간 표시**에 `endTime`이 필요합니다.
현재 프론트는 `endTime`이 없으면 `startTime + estimatedMinutes(기본 60분)`으로 임시 계산하는 방식으로 우회 중입니다.

**요청**: 응답에 `endTime` 추가

```json
[
  {
    "orderIndex": 1,
    "todoId": 3,
    "title": "보고서 작성",
    "isCompleted": false,
    "startTime": "09:00",
    "endTime": "10:30"
  }
]
```

---

## 참고: 현재 프론트 우회 방식

| 항목 | 우회 방법 |
|------|----------|
| `sign-up` 응답 없음 | 가입 후 `/login`으로 리다이렉트 (자동 로그인 없음) |
| `shares` 응답 없음 | 공유 페이지 미구현 상태 유지 |
| `endTime` 누락 | `startTime + estimatedMinutes` 로 폴백 계산 |
| `TokenResponse`에 `user` 없음 | accessToken JWT payload + Google 프로필로 구성 (구글 로그인만 해당) |
