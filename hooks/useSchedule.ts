import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { scheduleService } from '@/services/schedule'
import type { UpsertScheduleRequest } from '@/types/schedule'
import { toDateString } from '@/lib/utils'

export function useSchedules(date: string = toDateString()) {
  return useQuery({
    queryKey: ['schedules', date],
    queryFn: () => scheduleService.getSchedules(date),
  })
}

export function useUpsertSchedule(date: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpsertScheduleRequest) => scheduleService.upsertSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules', date] })
    },
  })
}

export function useDeleteSchedule(date: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (todoId: number) => scheduleService.deleteSchedule(todoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules', date] })
    },
  })
}
