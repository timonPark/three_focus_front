'use client'

import { use } from 'react'
import { useGetShare } from '@/hooks/useShare'
import ShareCard from '@/components/feature/share/ShareCard'

interface Props {
  params: Promise<{ token: string }>
}

export default function PublicSharePage({ params }: Props) {
  const { token } = use(params)
  const { data, isLoading, isError } = useGetShare(token)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-on-surface mb-2">공유 링크를 찾을 수 없습니다</p>
          <p className="text-sm text-on-surface-variant">링크가 만료되었거나 잘못된 링크입니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4">
      <ShareCard
        todos={data.todos}
        date={data.date}
        includeDetails={data.includeDetails}
        includeStatus={data.includeStatus}
      />
      <p className="mt-6 text-xs text-on-surface-variant">
        ThreeFocus로 나만의 집중 과업을 관리해보세요.
      </p>
    </div>
  )
}
