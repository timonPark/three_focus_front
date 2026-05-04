import { useMutation, useQuery } from '@tanstack/react-query'
import { shareService } from '@/services/shareService'
import type { CreateShareRequest } from '@/types/share'

export function useGetShare(token: string) {
  return useQuery({
    queryKey: ['share', token],
    queryFn: () => shareService.getShare(token),
    enabled: !!token,
  })
}

export function useCreateShare() {
  return useMutation({
    mutationFn: (data: CreateShareRequest) => shareService.createShare(data),
  })
}
