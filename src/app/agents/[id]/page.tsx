'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase, type Agent } from '@/lib/supabase'

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

export default function AgentDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)

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
  const tgUsername = agent.telegram_username?.replace(/^@/, '')
  const tgUrl = tgUsername ? `https://t.me/${tgUsername}` : null

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
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-white/5 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-text">{agent.total_requests ?? 0}</p>
            <p className="text-xs text-muted mt-1">총 사용횟수</p>
          </div>
          <div className="text-center">
            {tgUsername ? (
              <>
                <p className="text-sm font-mono text-accent2">@{tgUsername}</p>
                <p className="text-xs text-muted mt-1">텔레그램 봇</p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted">—</p>
                <p className="text-xs text-muted mt-1">텔레그램 봇</p>
              </>
            )}
          </div>
        </div>

        {/* 제작자 */}
        {(agent.creator || agent.contact) && (
          <div className="mb-6 p-3 bg-bg/50 rounded-xl border border-border">
            <p className="text-xs text-muted mb-1">제작자 정보</p>
            <div className="flex items-center gap-2 flex-wrap">
              {agent.creator && (
                <span className="text-sm text-mid">{agent.creator}</span>
              )}
              {agent.contact && (
                <span className="text-xs font-mono text-muted">{agent.contact}</span>
              )}
            </div>
          </div>
        )}

        {/* 텔레그램 대화 버튼 */}
        {tgUrl ? (
          <a
            href={tgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-accent to-accent2 hover:opacity-90 text-white py-3 rounded-xl font-semibold transition-opacity"
          >
            <span>💬</span>
            텔레그램으로 대화하기
          </a>
        ) : (
          <button
            disabled
            className="w-full text-center py-3 rounded-xl border border-border text-muted text-sm cursor-not-allowed bg-surface2"
          >
            🔜 텔레그램 봇 준비 중
          </button>
        )}
      </div>

      {/* 에이전트 소개 박스 */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-text mb-4">에이전트 정보</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-xs text-muted">플랫폼</span>
            <span className="text-sm text-mid">OpenClaw</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-xs text-muted">연결 방식</span>
            <span className="text-sm text-mid">텔레그램</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-xs text-muted">데이터 저장</span>
            <span className="text-sm text-mid">운영자 서버 (데이터 주권)</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-muted">이용 요금</span>
            <span className="text-sm font-semibold text-accent2">🆓 무료</span>
          </div>
        </div>
      </div>
    </div>
  )
}
