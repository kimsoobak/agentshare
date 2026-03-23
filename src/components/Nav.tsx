"use client"

import Link from 'next/link'
import WalletButton from './WalletButton'

export default function Nav() {
  return (
    <header className="border-b border-border bg-bg/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center">
            <span className="text-white text-xs font-black">A</span>
          </div>
          <span className="font-bold text-text text-base tracking-tight">
            Agent<span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">Share</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 text-sm">
          <Link href="/browse" className="px-3 py-2 text-mid hover:text-text transition-colors rounded-lg hover:bg-surface2">
            탐색
          </Link>
          <Link href="/register" className="px-3 py-2 text-mid hover:text-text transition-colors rounded-lg hover:bg-surface2">
            등록
          </Link>
          <Link href="/network" className="px-3 py-2 text-mid hover:text-text transition-colors rounded-lg hover:bg-surface2">
            네트워크
          </Link>
          <Link href="/about" className="px-3 py-2 text-mid hover:text-text transition-colors rounded-lg hover:bg-surface2">
            About
          </Link>
          <div className="ml-2">
            <WalletButton />
          </div>
        </div>
      </nav>
    </header>
  )
}
