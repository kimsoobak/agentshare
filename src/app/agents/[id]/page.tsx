'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { supabase, type Agent } from '@/lib/supabase'
import { sendPayment, AGENT_USE_FEE } from '@/lib/solana'

const TYPE_STYLES: Record<string, { color: string; bg: string; border: string; gradient: string }> = {
  search: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    gradient: 'from-blue-600/20 to-blue-400/5',
  },
  image: {
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    gradient: 'from-pink-600/20 to-pink-400/5',
  },
  inference: {
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    gradient: 'from-purple-600/20 to-purple-400/5',
  },
  code: {
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    gradient: 'from-green-600/20 to-green-400/5',
  },
}

const TYPE_ICONS: Record<string, string> = {
  search: '🔍',
  image: '🎨',
  inference: '🧠',
  code: '💻',
}

const MOCK_HISTORY = [
  { time: '3분 전', amount: '0.001 SOL', sig: '5xHk...9pQr' },
  { time: '17분 전', amount: '0.001 SOL', sig: '2mJd...4wLz' },
  { time: '42분 전', amount: '0.001 SOL', sig: '8bNf...1cVy' },
]

function shortAddr(addr: string | null): string {
  if (!addr) return '—'
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`
}

export default function AgentDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const { publicKey, signTransaction, connected } = useWallet()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [txSig, setTxSig] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    async function loadAgent() {
      setLoading(true)
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single()
      if (!error && data) {
        setAgent(data as Agent)
      }
      setLoading(false)
    }
    loadAgent()
  }, [id])

  const isOwner =
    connected &&
    publicKey &&
    agent?.wallet_address &&
    publicKey.toBase58() === agent.wallet_address

  async function handleUse() {
    if (!connected || !publicKey || !signTransaction) {
      setError('지갑을 먼저 연결해주세요')
      return
    }
    if (!agent?.wallet_address) {
      setError('이 에이전트는 지갑 주소가 등록되지 않았습니다')
      return
    }

    setPaying(true)
    setError(null)
    setTxSig(null)

    try {
      const sig = await sendPayment(publicKey, agent.wallet_address, AGENT_USE_FEE, signTransaction)
      setTxSig(sig)

      // Supabase 업데이트
      await supabase
        .from('agents')
        .update({
          total_requests: (agent.total_requests ?? 0) + 1,
          sol_earned: (agent.sol_earned ?? 0) + AGENT_USE_FEE,
        })
        .eq('id', agent.id)

      setAgent((prev) =>
        prev
          ? {
              ...prev,
              total_requests: (prev.total_requests ?? 0) + 1,
              sol_earned: (prev.sol_earned ?? 0) + AGENT_USE_FEE,
            }
          : prev
      )
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '결제 실패')
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface2 rounded w-1/2" />
          <div className="h-48 bg-surface2 rounded-2xl" />
          <div className="h-24 bg-surface2 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-5xl mb-4">🤖</p>
        <p className="text-xl font-bold text-text mb-2">에이전트를 찾을 수 없습니다</p>
        <Link href="/browse" className="text-accent hover:underline text-sm">
          ← 에이전트 목록으로
        </Link>
      </div>
    )
  }

  const typeKey = agent.agent_type || ''
  const style = TYPE_STYLES[typeKey] || {
    color: 'text-mid',
    bg: 'bg-surface2',
    border: 'border-border',
    gradient: 'from-surface2 to-bg',
  }
  const icon = TYPE_ICONS[typeKey] || '🤖'

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* 뒤로가기 */}
      <Link href="/browse" className="inline-flex items-center gap-2 text-muted text-sm hover:text-accent mb-8 transition-colors">
        ← 에이전트 목록으로
      </Link>

      {/* 메인 카드 */}
      <div className={`bg-gradient-to-br ${style.gradient} border ${style.border} rounded-2xl p-8 mb-6`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{icon}</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-text">{agent.name}</h1>
                {isOwner && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 font-medium">
                    내 에이전트
                  </span>
                )}
                {agent.is_active && (
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                    Online
                  </span>
                )}
              </div>
              {agent.agent_type && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.color} mt-1 inline-block`}>
                  {icon} {agent.agent_type}
                </span>
              )}
            </div>
          </div>
          {agent.category && (
            <span className="text-xs px-2 py-1 rounded-full bg-surface2 border border-border text-mid flex-shrink-0">
              {agent.category}
            </span>
          )}
        </div>

        <p className="text-mid leading-relaxed mb-6">{agent.description}</p>

        {/* 태그 */}
        {agent.tags && agent.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {agent.tags.map((tag) => (
              <span
                key={tag}
                className="bg-bg border border-border text-muted text-xs px-2 py-0.5 rounded-full font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 스탯 */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-white/5 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-text">{agent.total_requests ?? 0}</p>
            <p className="text-xs text-muted mt-1">총 사용횟수</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent2">{(agent.sol_earned ?? 0).toFixed(3)}</p>
            <p className="text-xs text-muted mt-1">SOL 수익</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-mono text-mid">{shortAddr(agent.wallet_address)}</p>
            <p className="text-xs text-muted mt-1">지갑 주소</p>
          </div>
        </div>

        {/* 지갑 주소 풀 링크 */}
        {agent.wallet_address && (
          <div className="mb-6 p-3 bg-bg/50 rounded-xl border border-border">
            <p className="text-xs text-muted mb-1">에이전트 지갑 · Wallet Address</p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-mid break-all">{agent.wallet_address}</span>
              <a
                href={`https://explorer.solana.com/address/${agent.wallet_address}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-xs text-accent hover:underline"
              >
                Explorer ↗
              </a>
            </div>
          </div>
        )}

        {/* 사용하기 버튼 */}
        {connected ? (
          <button
            onClick={handleUse}
            disabled={paying}
            className="w-full bg-gradient-to-r from-accent to-accent2 hover:opacity-90 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-opacity flex items-center justify-center gap-2"
          >
            {paying ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                결제 중...
              </>
            ) : (
              `에이전트 사용하기 — ${AGENT_USE_FEE} SOL`
            )}
          </button>
        ) : (
          <div className="w-full text-center py-3 rounded-xl border border-border text-muted text-sm">
            지갑을 먼저 연결해주세요
          </div>
        )}

        {/* 에러 */}
        {error && (
          <p className="mt-3 text-xs text-red-400 text-center">{error}</p>
        )}

        {/* 트랜잭션 성공 */}
        {txSig && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
            <p className="text-xs text-green-400 font-medium mb-1">결제 성공!</p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-green-300 break-all">{txSig}</span>
              <a
                href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-xs text-accent hover:underline"
              >
                Explorer ↗
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 사용 기록 */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-text mb-4">최근 사용 기록</h2>
        <div className="space-y-3">
          {MOCK_HISTORY.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent2 flex-shrink-0" />
                <span className="text-sm text-mid">{item.time}</span>
              </div>
              <div className="flex items-center gap-3 text-right">
                <span className="text-sm font-medium text-accent2">{item.amount}</span>
                <span className="font-mono text-xs text-muted">{item.sig}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
