import api from './api'
import type { Top3Response, SetTop3Request } from '@/types/top3'

export const top3Service = {
  getTop3: (date: string) =>
    api.get<Top3Response[]>('/api/top3', { params: { date } }).then((r) => r.data),

  setTop3: (data: SetTop3Request) =>
    api.post<Top3Response[]>('/api/top3', data).then((r) => r.data),
}
