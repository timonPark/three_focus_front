'use client'

import { CheckSquare, Crosshair, BarChart2, Share2, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { clearAuthCookie } from '@/lib/actions/auth'

const NAV_ITEMS = [
  { href: '/home', label: '할 일', icon: CheckSquare },
  { href: '/top3', label: '집중', icon: Crosshair },
  { href: '/visualization', label: '타임라인', icon: BarChart2 },
  { href: '/share', label: '공유', icon: Share2 },
]

export default function SideNav() {
  const pathname = usePathname()
  const router = useRouter()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const handleLogout = async () => {
    clearAuth()
    await clearAuthCookie()
    router.push('/login')
  }

  return (
    <nav className="hidden lg:flex flex-col fixed top-16 left-0 bottom-0 w-64 bg-surface-container-lowest border-r border-outline-variant z-30">
      <ul className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <Icon size={20} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="p-3 border-t border-outline-variant">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          <LogOut size={20} />
          로그아웃
        </button>
      </div>
    </nav>
  )
}
