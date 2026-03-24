'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, type Agent } from '@/lib/supabase'

const CATEGORIES = ['전체', '개발', '법률', '의료', '금융', '설계', '기타']

const AGENT_TYPES = [
  { value: '', label: '전체', icon: '✦' },
  { value: 'search', label: 'Search', icon: '🔍' },
  { value: 'image', label: 'Image', icon: '🎨' },
  { value: 'inference', label: 'Inference', icon: '🧠' },
  { value: 'code', label: 'Code', icon: '💻' },
]

const TYPE_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  search: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  image: { color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
  inference: { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  code: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
}

const TYPE_ICONS: Record<string, string> = {
  search: '🔍',
  image: '🎨',
  inference: '🧠',
  code: '💻',
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 bg-surface2 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-surface2 rounded w-2/3" />
          <div className="h-3 bg-surface2 rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-surface2 rounded" />
        <div className="h-3 bg-surface2 rounded w-4/5" />
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-14 bg-surface2 rounded-full" />
        <div className="h-5 w-14 bg-surface2 rounded-full" />
      </div>
      <div className="h-10 bg-surface2 rounded-xl mt-auto" />
    </div>
  )
}

export default function BrowsePage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('전체')
  const [agentType, setAgentType] = useState('')

  useEffect(() => {
    async function loadAgents() {
      setLoading(true)
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setAgents(data as Agent[])
      }
      setLoading(false)
    }
    loadAgents()
  }, [])

  const filtered = agents.filter((a) => {
    const matchCat = category === '전체' || a.category === category
    const matchType = !agentType || a.agent_type === agentType
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      (a.tags || []).some((t) => t.toLowerCase().includes(q))
    return matchCat && matchType && matchSearch
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-text">에이전트 탐색</h1>
        <p className="text-muted mt-1 text-sm">Browse Agents — 텔레그램으로 바로 대화하세요</p>
      </div>

      {/* 검색 */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">🔍</span>
        <input
          type="text"
          placeholder="에이전트 검색 / Search agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card text-text placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
        />
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 flex-wrap mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              category === cat
                ? 'bg-accent text-white border-accent'
                : 'bg-card border-border text-mid hover:border-accent/50 hover:text-accent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 에이전트 타입 필터 */}
      <div className="flex gap-2 flex-wrap mb-10">
        {AGENT_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setAgentType(t.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              agentType === t.value
                ? 'bg-accent2/20 text-accent2 border-accent2/50'
                : 'bg-card border-border text-mid hover:border-accent2/30 hover:text-accent2'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* 결과 수 */}
      {!loading && (
        <p className="text-muted text-sm mb-6">
          {filtered.length}개의 에이전트 · {filtered.length} agents found
        </p>
      )}

      {/* 로딩 스켈레톤 */}
      {loading && (
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* 데이터 없음 */}
      {!loading && agents.length === 0 && (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🤖</p>
          <p className="text-lg font-medium text-text mb-2">아직 등록된 에이전트가 없습니다</p>
          <p className="text-muted text-sm mb-8">첫 번째로 배포해보세요!</p>
          <Link
            href="/register"
            className="inline-block bg-gradient-to-r from-accent to-accent2 hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition-opacity"
          >
            에이전트 등록하기 →
          </Link>
        </div>
      )}

      {/* 필터 결과 없음 */}
      {!loading && agents.length > 0 && filtered.length === 0 && (
        <div className="text-center py-20 text-muted">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-medium">검색 결과가 없습니다</p>
          <p className="text-sm mt-1">No agents found matching your search</p>
        </div>
      )}

      {/* 에이전트 카드 그리드 */}
      {!loading && filtered.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((agent) => {
            const typeKey = agent.agent_type || ''
            const style = TYPE_STYLES[typeKey] || {
              color: 'text-mid',
              bg: 'bg-surface2',
              border: 'border-border',
            }
            const icon = TYPE_ICONS[typeKey] || '🤖'
            const tgUsername = agent.telegram_username?.replace(/^@/, '')
            const tgUrl = tgUsername ? `https://t.me/${tgUsername}` : null

            return (
              <div
                key={agent.id}
                className={`bg-card border ${style.border} rounded-2xl p-6 hover:shadow-lg hover:shadow-accent/5 transition-all flex flex-col`}
              >
                {/* 헤더 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <h3 className="font-bold text-lg text-text leading-tight">{agent.name}</h3>
                        {agent.is_active && (
                          <div className="flex items-center gap-1 text-green-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-xs font-medium">Online</span>
                          </div>
                        )}
                      </div>
                      {agent.agent_type && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.color}`}>
                          {icon} {agent.agent_type}
                        </span>
                      )}
                    </div>
                  </div>
                  {agent.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface2 border border-border text-mid flex-shrink-0">
                      {agent.category}
                    </span>
                  )}
                </div>

                {/* 설명 (2줄 truncate) */}
                <p className="text-mid text-sm leading-relaxed mb-4 line-clamp-2">
                  {agent.description}
                </p>

                {/* 태그 */}
                {agent.tags && agent.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {agent.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="bg-bg border border-border text-muted text-xs px-2 py-0.5 rounded-full font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 푸터 */}
                <div className="mt-auto pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="text-muted mb-0.5">사용횟수</p>
                      <p className="font-medium text-text">
                        {agent.total_requests ?? 0} req
                      </p>
                    </div>
                    {agent.telegram_username && (
                      <div className="text-right">
                        <p className="text-muted mb-0.5">텔레그램</p>
                        <p className="font-mono text-accent2 text-xs">
                          @{agent.telegram_username.replace(/^@/, '')}
                        </p>
                      </div>
                    )}
                  </div>

                  {tgUrl ? (
                    <a
                      href={tgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-accent to-accent2 hover:opacity-90 text-white text-sm px-4 py-2.5 rounded-xl transition-opacity font-medium"
                    >
                      <span>💬</span>
                      텔레그램으로 대화
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full text-center bg-surface2 border border-border text-muted text-sm px-4 py-2.5 rounded-xl font-medium cursor-not-allowed"
                    >
                      🔜 준비 중
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
