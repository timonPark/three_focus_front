import api from './api'
import type { DailyScheduleItemResponse, ScheduleResponse, UpsertScheduleRequest } from '@/types/schedule'

export const scheduleService = {
  getSchedules: (date: string) =>
    api.get<DailyScheduleItemResponse[]>('/api/schedules', { params: { date } }).then((r) => r.data),

  upsertSchedule: (data: UpsertScheduleRequest) =>
    api.put<ScheduleResponse>('/api/schedules', data).then((r) => r.data),

  deleteSchedule: (todoId: number) =>
    api.delete(`/api/schedules/${todoId}`).then((r) => r.data),
}
