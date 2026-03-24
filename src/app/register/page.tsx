'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const AGENT_TYPES = [
  { value: 'search', label: 'Search', icon: '🔍' },
  { value: 'image', label: 'Image', icon: '🎨' },
  { value: 'inference', label: 'Inference', icon: '🧠' },
  { value: 'code', label: 'Code', icon: '💻' },
]

const CATEGORIES = ['개발', '법률', '의료', '금융', '설계', '기타']

export default function RegisterPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [agentType, setAgentType] = useState<string>('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    creator: '',
    contact: '',
    tags: '',
    telegram_username: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agentType) {
      setError('에이전트 타입을 선택해주세요.')
      return
    }

    setLoading(true)
    setError(null)

    // telegram_username 정규화: @ 제거
    const tgUsername = form.telegram_username
      ? form.telegram_username.replace(/^@/, '').trim() || null
      : null

    const { error: err } = await supabase.from('agents').insert([
      {
        name: form.name,
        description: form.description,
        category: form.category,
        creator: form.creator,
        contact: form.contact,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        telegram_username: tgUsername,
        agent_type: agentType,
        is_active: true,
      },
    ])

    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      router.push('/browse')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-1.5 bg-surface2 border border-border px-3 py-1 rounded-full mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-accent2 animate-pulse" />
          <span className="text-xs text-mid font-medium">Powered by OpenClaw</span>
        </div>
        <h1 className="text-3xl font-bold text-text">에이전트 등록하기</h1>
        <p className="text-muted mt-1 text-sm">내 AI 에이전트를 AgentShare에 공유하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 에이전트 이름 */}
        <div>
          <label className="block text-sm font-medium text-mid mb-1">
            에이전트 이름 <span className="text-muted font-normal">· Agent Name</span>
            <span className="text-accent ml-1">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="예: 법률 상담 에이전트"
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-text placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
          />
        </div>

        {/* 설명 */}
        <div>
          <label className="block text-sm font-medium text-mid mb-1">
            설명 <span className="text-muted font-normal">· Description</span>
            <span className="text-accent ml-1">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="에이전트의 능력(capability)과 특화 분야를 설명해 주세요."
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-text placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors resize-none"
          />
        </div>

        {/* 에이전트 타입 */}
        <div>
          <label className="block text-sm font-medium text-mid mb-2">
            에이전트 타입 <span className="text-muted font-normal">· Agent Type</span>
            <span className="text-accent ml-1">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {AGENT_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setAgentType(t.value)}
                className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition-all ${
                  agentType === t.value
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border bg-card text-mid hover:border-accent/50 hover:text-accent'
                }`}
              >
                <span className="text-2xl">{t.icon}</span>
                <span className="text-xs font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-medium text-mid mb-1">
            카테고리 <span className="text-muted font-normal">· Category</span>
            <span className="text-accent ml-1">*</span>
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
          >
            <option value="">카테고리 선택 / Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* 텔레그램 봇 username */}
        <div>
          <label className="block text-sm font-medium text-mid mb-1">
            텔레그램 봇 <span className="text-muted font-normal">· Telegram Bot Username</span>
            <span className="text-muted ml-1 text-xs">(선택)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">@</span>
            <input
              name="telegram_username"
              value={form.telegram_username}
              onChange={handleChange}
              placeholder="your_bot_username"
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-card text-text placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors font-mono"
            />
          </div>
          <p className="text-xs text-muted mt-1">
            텔레그램 봇 username을 입력하면 사용자가 바로 연결할 수 있어요.
          </p>
        </div>

        {/* 태그 */}
        <div>
          <label className="block text-sm font-medium text-mid mb-1">
            태그 <span className="text-muted font-normal">· Tags (comma separated)</span>
          </label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="법률, 계약, 상담"
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-text placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
          />
          <p className="text-xs text-muted mt-1">쉼표로 구분 · Separate with commas</p>
        </div>

        {/* 제작자 */}
        <div>
          <label className="block text-sm font-medium text-mid mb-1">
            제작자 <span className="text-muted font-normal">· Creator Name</span>
          </label>
          <input
            name="creator"
            value={form.creator}
            onChange={handleChange}
            placeholder="예: 김개발 / Kim Developer"
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-text placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
          />
        </div>

        {/* 연락처 */}
        <div>
          <label className="block text-sm font-medium text-mid mb-1">
            연락처 <span className="text-muted font-normal">· Contact</span>
          </label>
          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="@telegram_handle 또는 email@example.com"
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-text placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
          />
        </div>

        {/* 안내 박스 */}
        <div className="flex items-start gap-3 bg-surface2 border border-accent2/20 rounded-xl px-4 py-3">
          <span className="text-accent2 text-lg flex-shrink-0">💡</span>
          <div>
            <p className="text-xs text-mid font-medium mb-1">OpenClaw 에이전트란?</p>
            <p className="text-xs text-muted leading-relaxed">
              개인이 운영하는 OpenClaw AI 에이전트를 등록하세요. 데이터는 운영자 서버에 보관되어 빅테크 클라우드에 종속되지 않습니다.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent to-accent2 hover:opacity-90 disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-lg transition-opacity shadow-lg shadow-accent/20"
          >
            {loading ? '등록 중...' : '에이전트 등록하기 →'}
          </button>
        </div>
      </form>
    </div>
  )
}
