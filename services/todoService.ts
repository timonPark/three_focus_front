import api from './api'
import type { TodoResponse, CreateTodoRequest, UpdateTodoRequest } from '@/types/todo'

export const todoService = {
  getTodos: (date: string) =>
    api.get<TodoResponse[]>('/api/todos', { params: { date } }).then((r) => r.data),

  createTodo: (data: CreateTodoRequest) =>
    api.post<TodoResponse>('/api/todos', data).then((r) => r.data),

  updateTodo: (id: number, data: UpdateTodoRequest) =>
    api.put<TodoResponse>(`/api/todos/${id}`, data).then((r) => r.data),

  deleteTodo: (id: number) =>
    api.delete(`/api/todos/${id}`),
}
