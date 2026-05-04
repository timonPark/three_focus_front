'use client'

import { useState, useRef } from 'react'
import { Link2, ImageDown, Check, Loader2 } from 'lucide-react'
import { toPng } from 'html-to-image'

interface Props {
  shareUrl: string | null
  cardRef: React.RefObject<HTMLDivElement | null>
  onCreateShare: () => void
  isCreating: boolean
}

export default function ShareActions({ shareUrl, cardRef, onCreateShare, isCreating }: Props) {
  const [copied, setCopied] = useState(false)
  const [savingImage, setSavingImage] = useState(false)

  const handleCopyLink = async () => {
    if (!shareUrl) {
      onCreateShare()
      return
    }
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveImage = async () => {
    if (!cardRef.current) return
    setSavingImage(true)
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = 'three-focus.png'
      link.href = dataUrl
      link.click()
    } finally {
      setSavingImage(false)
    }
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleCopyLink}
        disabled={isCreating}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-secondary text-on-secondary font-semibold text-sm hover:bg-secondary/90 transition-colors disabled:opacity-60"
      >
        {isCreating ? (
          <Loader2 size={16} className="animate-spin" />
        ) : copied ? (
          <Check size={16} />
        ) : (
          <Link2 size={16} />
        )}
        {isCreating ? '링크 생성 중...' : copied ? '복사됨!' : shareUrl ? '링크 복사' : '링크 생성 & 복사'}
      </button>

      <button
        onClick={handleSaveImage}
        disabled={savingImage}
        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container transition-colors disabled:opacity-60"
      >
        {savingImage ? <Loader2 size={16} className="animate-spin" /> : <ImageDown size={16} />}
        {savingImage ? '저장 중...' : '이미지 저장'}
      </button>
    </div>
  )
}
