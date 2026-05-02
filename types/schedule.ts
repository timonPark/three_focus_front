export interface ScheduleResponse {
  id: number
  todoId: number
  date: string
  startTime: string
  endTime: string
}

export interface UpsertScheduleRequest {
  todoId: number
  date: string
  startTime: string
  endTime: string
}
