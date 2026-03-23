'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
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
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()

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
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !publicKey) {
      setError('Phantom 지갑을 먼저 연결해주세요.')
      return
    }
    if (!agentType) {
      setError('에이전트 타입을 선택해주세요.')
      return
    }

    setLoading(true)
    setError(null)

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
        wallet_address: publicKey.toString(),
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

  // 지갑 미연결 상태
  if (!connected || !publicKey) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-card border border-border rounded-2xl p-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">👻</span>
            </div>
            <h2 className="text-2xl font-bold text-text mb-2">지갑 연결 필요</h2>
            <p className="text-mid text-sm mb-1">Wallet Connection Required</p>
            <p className="text-muted text-sm leading-relaxed mb-8 mt-4">
              에이전트를 배포하려면 Phantom 지갑을 먼저 연결해주세요.
              <span className="block mt-1 text-muted">
                Connect your Phantom wallet to deploy an agent.
              </span>
            </p>
            <button
              onClick={() => setVisible(true)}
              className="w-full bg-gradient-to-r from-accent to-accent2 hover:opacity-90 text-white py-3 rounded-xl font-semibold transition-opacity"
            >
              Phantom 지갑 연결하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  const walletAddr = publicKey.toString()
  const walletShort = `${walletAddr.slice(0, 6)}...${walletAddr.slice(-6)}`

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-1.5 bg-surface2 border border-border px-3 py-1 rounded-full mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-accent2 animate-pulse" />
          <span className="text-xs text-mid font-medium">Powered by Solana</span>
        </div>
        <h1 className="text-3xl font-bold text-text">에이전트 배포하기</h1>
        <p className="text-muted mt-1 text-sm">Deploy Your Agent — AgentShare P2P 네트워크에 등록하세요</p>
      </div>

      {/* 지갑 연결 상태 표시 */}
      <div className="flex items-center gap-3 bg-surface2 border border-accent/20 rounded-xl px-4 py-3 mb-8">
        <div className="w-2 h-2 rounded-full bg-accent2 animate-pulse flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-xs text-mid">연결된 지갑 · Connected Wallet</p>
          <p className="text-sm font-mono text-accent2 truncate">{walletShort}</p>
        </div>
        <span className="ml-auto text-xs text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full flex-shrink-0">
          ✓ Connected
        </span>
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
            placeholder="예: Search Agent #001"
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

        {/* 태그 */}
        <div>
          <label className="block text-sm font-medium text-mid mb-1">
            태그 <span className="text-muted font-normal">· Tags (comma separated)</span>
          </label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Tavily, 실시간검색, RAG"
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

        {/* 지갑 주소 (읽기 전용) */}
        <div>
          <label className="block text-sm font-medium text-mid mb-1">
            지갑 주소 <span className="text-muted font-normal">· Wallet Address</span>
            <span className="text-accent2 ml-1 text-xs">(자동 입력)</span>
          </label>
          <div className="w-full px-4 py-3 rounded-xl border border-accent/20 bg-surface2 text-accent2 font-mono text-sm break-all select-all">
            {walletAddr}
          </div>
          <p className="text-xs text-muted mt-1">연결된 Phantom 지갑 주소가 자동으로 저장됩니다</p>
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
            {loading ? '배포 중...' : '에이전트 배포하기 · Launch Agent'}
          </button>
        </div>
      </form>
    </div>
  )
}
