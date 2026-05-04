import api from './api'
import type { ShareResponse, CreateShareRequest } from '@/types/share'

export const shareService = {
  createShare: (data: CreateShareRequest) =>
    api.post<ShareResponse>('/api/shares', data).then((r) => r.data),

  getShare: (token: string) =>
    api.get<ShareResponse>(`/api/shares/${token}`).then((r) => r.data),
}
