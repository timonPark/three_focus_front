'use client'

import { CheckSquare, Crosshair, BarChart2, Share2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/home', label: '할 일', icon: CheckSquare },
  { href: '/top3', label: '집중', icon: Crosshair },
  { href: '/visualization', label: '타임라인', icon: BarChart2 },
  { href: '/share', label: '공유', icon: Share2 },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-20 bg-surface-container-lowest border-t border-outline-variant">
      <ul className="flex h-full">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center justify-center h-full gap-1 text-xs font-medium transition-colors ${
                  active ? 'text-secondary' : 'text-on-surface-variant'
                }`}
              >
                <Icon size={22} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
