"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  {
    href: '/',
    label: '홈',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
          fill={active ? 'url(#grad)' : 'none'}
          stroke={active ? 'none' : 'currentColor'}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {active && (
          <defs>
            <linearGradient id="grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9945FF" />
              <stop offset="1" stopColor="#14F195" />
            </linearGradient>
          </defs>
        )}
      </svg>
    ),
  },
  {
    href: '/browse',
    label: '탐색',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle
          cx="11"
          cy="11"
          r="7.5"
          stroke={active ? 'url(#grad2)' : 'currentColor'}
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M16.5 16.5L21 21"
          stroke={active ? 'url(#grad2)' : 'currentColor'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {active && (
          <defs>
            <linearGradient id="grad2" x1="3.5" y1="3.5" x2="21" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9945FF" />
              <stop offset="1" stopColor="#14F195" />
            </linearGradient>
          </defs>
        )}
      </svg>
    ),
  },
  {
    href: '/register',
    label: '등록',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9.5"
          fill={active ? 'url(#grad3)' : 'none'}
          stroke={active ? 'none' : 'currentColor'}
          strokeWidth="1.8"
        />
        <path
          d="M12 7.5V16.5M7.5 12H16.5"
          stroke={active ? 'white' : 'currentColor'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {active && (
          <defs>
            <linearGradient id="grad3" x1="2.5" y1="2.5" x2="21.5" y2="21.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9945FF" />
              <stop offset="1" stopColor="#14F195" />
            </linearGradient>
          </defs>
        )}
      </svg>
    ),
  },
  {
    href: '/network',
    label: '네트워크',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="5" r="2.5" fill={active ? 'url(#grad4)' : 'none'} stroke={active ? 'none' : 'currentColor'} strokeWidth="1.8" />
        <circle cx="5" cy="19" r="2.5" fill={active ? 'url(#grad4)' : 'none'} stroke={active ? 'none' : 'currentColor'} strokeWidth="1.8" />
        <circle cx="19" cy="19" r="2.5" fill={active ? 'url(#grad4)' : 'none'} stroke={active ? 'none' : 'currentColor'} strokeWidth="1.8" />
        <path
          d="M12 7.5L5 16.5M12 7.5L19 16.5M5 19H19"
          stroke={active ? '#9945FF' : 'currentColor'}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {active && (
          <defs>
            <linearGradient id="grad4" x1="2.5" y1="2.5" x2="21.5" y2="21.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9945FF" />
              <stop offset="1" stopColor="#14F195" />
            </linearGradient>
          </defs>
        )}
      </svg>
    ),
  },
  {
    href: '/about',
    label: 'About',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="8"
          r="3.5"
          fill={active ? 'url(#grad5)' : 'none'}
          stroke={active ? 'none' : 'currentColor'}
          strokeWidth="1.8"
        />
        <path
          d="M4 20C4 16.134 7.582 13 12 13C16.418 13 20 16.134 20 20"
          stroke={active ? 'url(#grad5)' : 'currentColor'}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        {active && (
          <defs>
            <linearGradient id="grad5" x1="4" y1="4.5" x2="20" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9945FF" />
              <stop offset="1" stopColor="#14F195" />
            </linearGradient>
          </defs>
        )}
      </svg>
    ),
  },
]

export default function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* blur backdrop */}
      <div className="absolute inset-0 bg-[#050510]/80 backdrop-blur-xl border-t border-white/[0.06]" />

      <div className="relative flex items-center justify-around px-2 pb-safe pt-2 h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 min-w-[56px]"
            >
              <div
                className={`transition-all duration-200 ${
                  isActive ? 'scale-110' : 'scale-100 opacity-50'
                }`}
              >
                {tab.icon(isActive)}
              </div>
              <span
                className={`text-[10px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent'
                    : 'text-muted'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
