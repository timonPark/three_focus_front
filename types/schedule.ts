export interface DailyScheduleItemResponse {
  orderIndex: number
  todoId: number
  title: string
  isCompleted: boolean
  startTime?: string
  endTime?: string
}

export interface ScheduleResponse {
  id: number
  todoId: number
  date: string
  startTime: string
  endTime?: string
}

export interface UpsertScheduleRequest {
  todoId: number
  date: string
  startTime: string
  endTime: string
}
