import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { todoService } from '@/services/todoService'
import type { CreateTodoRequest, UpdateTodoRequest } from '@/types/todo'
import { toDateString } from '@/lib/utils'

export function useTodos(date: string = toDateString()) {
  return useQuery({
    queryKey: ['todos', date],
    queryFn: () => todoService.getTodos(date),
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTodoRequest) => todoService.createTodo(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todos', variables.date] })
    },
  })
}

export function useUpdateTodo(date: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTodoRequest }) =>
      todoService.updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', date] })
    },
  })
}

export function useDeleteTodo(date: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => todoService.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', date] })
    },
  })
}
