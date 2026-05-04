import type { TodoResponse } from './todo'
import type { ScheduleResponse } from './schedule'
import type { Top3Response } from './top3'

export interface ShareResponse {
  shareToken: string
  shareUrl: string
  expiresAt: string
  date: string
  todos: TodoResponse[]
  schedules?: ScheduleResponse[]
  top3Data?: Top3Response[]
  includeDetails: boolean
  includeStatus: boolean
  isPrivate: boolean
}

export interface CreateShareRequest {
  date: string
  includeDetails: boolean
  includeStatus: boolean
  isPrivate: boolean
}
