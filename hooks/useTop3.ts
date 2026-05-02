import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { top3Service } from '@/services/top3Service'
import type { SetTop3Request } from '@/types/top3'
import { toDateString } from '@/lib/utils'

export function useTop3(date: string = toDateString()) {
  return useQuery({
    queryKey: ['top3', date],
    queryFn: () => top3Service.getTop3(date),
  })
}

export function useSetTop3() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SetTop3Request) => top3Service.setTop3(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['top3'] })
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}
