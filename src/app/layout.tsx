import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import BottomTabBar from '@/components/BottomTabBar'
import WalletContextProvider from '@/components/WalletContextProvider'

export const metadata: Metadata = {
  title: 'AgentShare — Decentralized AI Agent Network',
  description: 'P2P AI agent network powered by Solana. Deploy, connect, and earn with decentralized AI agents.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-bg text-text font-sans antialiased">
        <WalletContextProvider>
          <Nav />
          <main className="pb-16 md:pb-0">{children}</main>
          <BottomTabBar />
          <footer className="border-t border-border mt-20 py-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent to-accent2 flex items-center justify-center">
                <span className="text-white text-xs font-black">A</span>
              </div>
              <span className="font-bold text-text text-sm">
                Agent<span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">Share</span>
              </span>
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-3">
              <div className="flex items-center gap-1 bg-surface2 border border-border px-3 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-accent2 animate-pulse" />
                <span className="text-xs text-mid font-medium">Powered by Solana</span>
              </div>
            </div>
            <p className="text-muted text-xs">© 2026 AgentShare · Decentralized AI Agent Network</p>
            <p className="text-muted text-xs mt-1">P2P · Solana · No Middlemen</p>
          </footer>
        </WalletContextProvider>
      </body>
    </html>
  )
}
