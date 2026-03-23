"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"

export default function WalletButton({ className }: { className?: string }) {
  const { connected, publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()

  const isPhantomInstalled =
    typeof window !== "undefined" &&
    (window as Window & { solana?: { isPhantom?: boolean } }).solana?.isPhantom

  if (!isPhantomInstalled && typeof window !== "undefined") {
    return (
      <a
        href="https://phantom.app"
        target="_blank"
        rel="noopener noreferrer"
        className={
          className ||
          "bg-gradient-to-r from-accent to-accent2 hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-opacity"
        }
      >
        Phantom 설치하기
      </a>
    )
  }

  if (connected && publicKey) {
    const addr = publicKey.toBase58()
    const short = `${addr.slice(0, 4)}...${addr.slice(-4)}`
    return (
      <button
        onClick={() => disconnect()}
        className={
          className ||
          "bg-surface2 border border-accent/40 hover:border-accent text-text px-4 py-2 rounded-lg text-sm font-medium transition-all font-mono"
        }
      >
        {short}
      </button>
    )
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className={
        className ||
        "bg-gradient-to-r from-accent to-accent2 hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-opacity"
      }
    >
      지갑 연결하기
    </button>
  )
}
