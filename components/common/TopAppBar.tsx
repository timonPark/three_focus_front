'use client'

import { Bell, Settings, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'

export default function TopAppBar() {
  const user = useAuthStore((s) => s.user)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center px-container-padding">
      <Link href="/home" className="text-lg font-semibold tracking-tight text-primary">
        ThreeFocus
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">
          <Bell size={20} />
        </button>
        <button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">
          <Settings size={20} />
        </button>
        <button className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
          <UserCircle size={28} />
        </button>
      </div>
    </header>
  )
}
