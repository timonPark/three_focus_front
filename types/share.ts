import type { TodoResponse } from './todo'

export interface ShareResponse {
  shareToken: string
  shareUrl: string
  expiresAt: string
  date: string
  todos: TodoResponse[]
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
