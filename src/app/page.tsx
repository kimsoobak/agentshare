"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase, type Agent } from "@/lib/supabase"

// ─────────────────────────────────────────
// Particle background
// ─────────────────────────────────────────
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: ((i * 137.5) % 100),
  y: ((i * 73.1) % 100),
  size: (i % 3) + 1,
  delay: (i % 6),
  duration: (i % 4) + 4,
}))

function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ animation: "grid-glow 4s ease-in-out infinite" }}
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(153,69,255,0.15)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Radial glows */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(153,69,255,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 30% at 70% 60%, rgba(20,241,149,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0 ? "#9945ff" : p.id % 3 === 1 ? "#14f195" : "#fff",
            opacity: 0.4,
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────
// Mock agents (fallback)
// ─────────────────────────────────────────
const MOCK_AGENTS: Agent[] = [
  {
    id: "mock-1",
    created_at: new Date().toISOString(),
    name: "법률 상담 에이전트",
    description: "계약서 검토, 분쟁 해결, 법적 조언을 제공하는 AI 에이전트입니다. 복잡한 법률 문제를 쉽게 풀어드립니다.",
    category: "법률",
    creator: "법무팀",
    contact: "",
    tags: ["법률", "계약", "상담"],
    telegram_username: "legal_agent_bot",
    agent_type: "inference",
    total_requests: 128,
    sol_earned: 0,
    is_active: true,
  },
  {
    id: "mock-2",
    created_at: new Date().toISOString(),
    name: "코드 리뷰 에이전트",
    description: "PR 코드 리뷰, 버그 찾기, 최적화 제안을 자동화하는 개발자 전용 에이전트입니다.",
    category: "개발",
    creator: "개발팀",
    contact: "",
    tags: ["코드", "개발", "리뷰"],
    telegram_username: "codereview_agent_bot",
    agent_type: "code",
    total_requests: 342,
    sol_earned: 0,
    is_active: true,
  },
  {
    id: "mock-3",
    created_at: new Date().toISOString(),
    name: "시장 분석 에이전트",
    description: "실시간 웹 검색으로 시장 트렌드, 경쟁사 분석, 인사이트를 리포트로 제공합니다.",
    category: "금융",
    creator: "분석팀",
    contact: "",
    tags: ["분석", "시장", "리서치"],
    telegram_username: undefined,
    agent_type: "search",
    total_requests: 56,
    sol_earned: 0,
    is_active: false,
  },
]

const TYPE_ICONS: Record<string, string> = {
  search: "🔍",
  image: "🎨",
  inference: "🧠",
  code: "💻",
}

// ─────────────────────────────────────────
// Agent preview card
// ─────────────────────────────────────────
function AgentCard({ agent }: { agent: Agent }) {
  const icon = TYPE_ICONS[agent.agent_type || ""] || "🤖"
  const tgUrl = agent.telegram_username
    ? `https://t.me/${agent.telegram_username.replace(/^@/, "")}`
    : null

  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col hover:border-accent/30 transition-all hover:shadow-lg hover:shadow-accent/5">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-text leading-tight">{agent.name}</h3>
            {agent.is_active && (
              <div className="flex items-center gap-1 text-green-400">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-medium">Online</span>
              </div>
            )}
          </div>
          {agent.category && (
            <span className="text-xs text-muted">{agent.category}</span>
          )}
        </div>
      </div>

      <p className="text-mid text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
        {agent.description}
      </p>

      {agent.tags && agent.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {agent.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-bg border border-border text-muted text-xs px-2 py-0.5 rounded-full font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-border">
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
}

// ─────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────
export default function HomePage() {
  const [previewAgents, setPreviewAgents] = useState<Agent[]>([])

  useEffect(() => {
    async function loadAgents() {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3)

      if (!error && data && data.length > 0) {
        setPreviewAgents(data as Agent[])
      } else {
        setPreviewAgents(MOCK_AGENTS)
      }
    }
    loadAgents()
  }, [])

  return (
    <>
      {/* ── 1. HERO ─────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <ParticleBackground />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent2 animate-pulse" />
            <span className="text-xs text-mid font-medium">OpenClaw AI 에이전트 공유 플랫폼</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
            <span className="text-text">AI 에이전트를</span>
            <br />
            <span className="bg-gradient-to-r from-accent via-purple-400 to-accent2 bg-clip-text text-transparent">
              함께 씁니다
            </span>
          </h1>

          {/* Sub */}
          <p className="text-lg md:text-xl text-mid mb-10 max-w-2xl mx-auto leading-relaxed">
            비싼 AI 비용, 혼자 낼 필요 없어요.
            <br className="hidden sm:block" />
            좋은 에이전트를 발견하고 텔레그램으로 바로 대화하세요.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/browse"
              className="bg-gradient-to-r from-accent to-accent2 hover:opacity-90 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all shadow-lg shadow-accent/20"
            >
              에이전트 탐색하기 →
            </Link>
            <Link
              href="/register"
              className="border border-border hover:border-accent/50 text-text px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:bg-surface"
            >
              내 에이전트 등록하기
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: "무료", label: "지금 바로" },
              { value: "텔레그램", label: "앱 없이 바로" },
              { value: "데이터 주권", label: "내 서버에서" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-black bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-xs text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-40">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-accent" />
        </div>
      </section>

      {/* ── 2. FEATURES ──────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-3">왜 AgentShare인가요?</h2>
            <p className="text-mid text-sm">Why AgentShare</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "💬",
                title: "텔레그램으로 바로 대화",
                desc: "앱 설치 없이 텔레그램으로 즉시 연결됩니다. 이미 쓰고 있는 앱으로 AI와 대화하세요.",
                color: "from-accent to-purple-400",
              },
              {
                icon: "🔒",
                title: "데이터 주권",
                desc: "빅테크 클라우드가 아닌 운영자 서버에서 처리됩니다. 내 데이터는 내가 통제합니다.",
                color: "from-purple-400 to-accent2",
              },
              {
                icon: "🆓",
                title: "지금은 무료",
                desc: "비용 부담 없이 좋은 AI를 경험하세요. 나중에 크레딧 충전 방식으로 전환될 예정입니다.",
                color: "from-accent2 to-teal-400",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="relative bg-surface border border-border rounded-2xl p-6 hover:border-accent/30 transition-all group"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-text mb-3">{item.title}</h3>
                <p className="text-sm text-mid leading-relaxed">{item.desc}</p>
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. AGENT PREVIEW ─────────────────────── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-surface/30" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-accent2 animate-pulse" />
              <span className="text-xs text-accent2 font-medium uppercase tracking-widest">Latest Agents</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-2">
              최근 등록된 에이전트
            </h2>
            <p className="text-mid text-sm">텔레그램으로 바로 대화해보세요</p>
          </div>

          {previewAgents.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {previewAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted">
              <p className="text-4xl mb-4">🤖</p>
              <p>에이전트를 불러오는 중...</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/browse"
              className="inline-block border border-border hover:border-accent/50 text-text px-8 py-3 rounded-xl font-semibold transition-all hover:bg-surface"
            >
              모든 에이전트 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ──────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-3">어떻게 사용하나요?</h2>
            <p className="text-mid text-sm">How It Works</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "에이전트 탐색",
                desc: "AgentShare에서 필요한 AI 에이전트를 찾아보세요. 다양한 분야의 전문 에이전트들이 기다립니다.",
                icon: "🔍",
                color: "from-accent to-purple-400",
              },
              {
                step: "02",
                title: "텔레그램 연결",
                desc: "'텔레그램으로 대화' 버튼 하나면 바로 연결됩니다. 별도 앱 설치 없이 즉시 시작하세요.",
                icon: "💬",
                color: "from-purple-400 to-accent2",
              },
              {
                step: "03",
                title: "AI와 대화",
                desc: "텔레그램 채팅창에서 AI 에이전트와 자연스럽게 대화하세요. 운영자 서버에서 안전하게 처리됩니다.",
                icon: "🤖",
                color: "from-accent2 to-teal-400",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative bg-surface border border-border rounded-2xl p-6 hover:border-accent/30 transition-all group"
              >
                <div
                  className={`text-4xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-4 opacity-30 group-hover:opacity-60 transition-opacity`}
                >
                  {item.step}
                </div>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-text mb-3">{item.title}</h3>
                <p className="text-sm text-mid leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. MANIFESTO ────────────────────────── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(153,69,255,0.1) 0%, rgba(20,241,149,0.05) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "rgba(153,69,255,0.15)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "rgba(20,241,149,0.1)", filter: "blur(80px)" }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-block border border-accent/30 rounded-full px-4 py-1.5 mb-8">
            <span className="text-xs text-accent font-medium uppercase tracking-widest">Manifesto</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-text leading-tight mb-6">
            AI는 혼자 쓰기엔<br />
            <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
              너무 비쌉니다
            </span>
          </h2>

          <p className="text-base text-muted leading-relaxed max-w-xl mx-auto">
            좋은 에이전트를 만들었다면 혼자 쓰지 마세요.
            AgentShare에 공유하고, 더 많은 사람들이 좋은 AI를 경험할 수 있게 해주세요.
            데이터는 빅테크가 아닌 운영자의 서버에 남습니다.
          </p>
        </div>
      </section>

      {/* ── 6. FINAL CTA ────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            지금 시작하세요
          </h2>
          <p className="text-mid mb-10">
            무료로 에이전트를 탐색하거나, 내 에이전트를 공유해보세요
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/browse"
              className="bg-gradient-to-r from-accent to-accent2 hover:opacity-90 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-opacity shadow-lg shadow-accent/20"
            >
              에이전트 탐색하기 →
            </Link>
            <Link
              href="/register"
              className="border border-border hover:border-accent/50 text-text px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:bg-surface"
            >
              내 에이전트 등록 →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
