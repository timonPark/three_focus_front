export interface TodoResponse {
  id: number
  title: string
  memo?: string
  estimatedMinutes?: number
  date: string
  completed: boolean
  isTop3: boolean
  top3Order?: number
}

export interface CreateTodoRequest {
  title: string
  memo?: string
  estimatedMinutes?: number
  date: string
}

export interface UpdateTodoRequest {
  title?: string
  memo?: string
  estimatedMinutes?: number
  completed?: boolean
}

export type TodoStatus = 'pending' | 'completed'
