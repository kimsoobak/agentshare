"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import WalletButton from "@/components/WalletButton"

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
interface Transaction {
  id: number
  from: string
  to: string
  type: string
  icon: string
  sol: string
  ago: number
}

// ─────────────────────────────────────────
// Mock data helpers
// ─────────────────────────────────────────
const AGENT_TYPES = [
  { icon: "🔍", label: "Search" },
  { icon: "🎨", label: "Image" },
  { icon: "🧠", label: "Inference" },
  { icon: "💻", label: "Code" },
]

const NAMES = [
  "Alpha", "Beta", "Gamma", "Delta", "Epsilon",
  "Zeta", "Eta", "Theta", "Iota", "Kappa",
]

function randomName() {
  return NAMES[Math.floor(Math.random() * NAMES.length)]
}
function randomAgent() {
  return AGENT_TYPES[Math.floor(Math.random() * AGENT_TYPES.length)]
}

function makeTx(id: number): Transaction {
  const agent = randomAgent()
  return {
    id,
    from: randomName(),
    to: randomName(),
    type: agent.label,
    icon: agent.icon,
    sol: (0.00020 + Math.random() * 0.00010).toFixed(5),
    ago: Math.floor(Math.random() * 30) + 1,
  }
}

const INITIAL_TXS: Transaction[] = Array.from({ length: 5 }, (_, i) => makeTx(i))

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
// Network SVG background for live feed
// ─────────────────────────────────────────
const NET_LINES: [number, number, number, number][] = [
  [100, 80, 400, 200], [400, 200, 700, 80], [400, 200, 200, 350],
  [400, 200, 600, 320], [200, 350, 600, 320], [700, 80, 650, 300],
  [100, 80, 200, 350], [650, 300, 600, 320],
]
const NET_NODES: [number, number][] = [
  [100, 80], [400, 200], [700, 80], [200, 350], [600, 320], [650, 300],
]

function NetworkBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
        {NET_LINES.map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={i % 2 === 0 ? "#9945ff" : "#14f195"}
            strokeWidth="1"
            strokeDasharray="4 4"
            style={{
              animation: `network-pulse ${2 + i * 0.3}s ease-in-out ${i * 0.4}s infinite`,
              strokeDashoffset: 100,
            }}
          />
        ))}
        {NET_NODES.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="5" fill={i % 2 === 0 ? "#9945ff" : "#14f195"} opacity="0.6" />
        ))}
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────
// Transaction card
// ─────────────────────────────────────────
function TxCard({ tx, isNew }: { tx: Transaction; isNew?: boolean }) {
  return (
    <div
      className="flex items-center gap-4 bg-surface border border-border rounded-xl px-4 py-3 transition-all"
      style={{
        animation: isNew ? "slide-up 0.4s ease-out forwards" : undefined,
        borderColor: isNew ? "rgba(153,69,255,0.4)" : undefined,
      }}
    >
      <div className="text-2xl w-10 text-center flex-shrink-0">{tx.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="text-text font-medium">{tx.from}</span>
          <span className="text-muted">→</span>
          <span className="text-text font-medium">{tx.to}</span>
          <span className="text-xs text-mid bg-surface2 px-2 py-0.5 rounded-full">{tx.type}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-accent2 font-mono text-sm font-medium">{tx.sol} SOL</div>
        <div className="text-muted text-xs">{tx.ago}초 전</div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────
export default function HomePage() {
  const [txs, setTxs] = useState<Transaction[]>(INITIAL_TXS)
  const [newTxId, setNewTxId] = useState<number | null>(null)
  const counterRef = useRef(100)

  useEffect(() => {
    const interval = setInterval(() => {
      const id = counterRef.current++
      const tx = makeTx(id)
      setNewTxId(id)
      setTxs((prev) => [tx, ...prev.slice(0, 4)])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* ── 1. HERO ─────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <ParticleBackground />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent2 animate-pulse" />
            <span className="text-xs text-mid font-medium">● Live Network · 247 Nodes Active</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
            <span className="text-text">사람이 만든 AI가</span>
            <br />
            <span className="bg-gradient-to-r from-accent via-purple-400 to-accent2 bg-clip-text text-transparent">
              서로 연결된다
            </span>
          </h1>

          {/* Sub Korean */}
          <p className="text-lg md:text-xl text-mid mb-3 max-w-2xl mx-auto leading-relaxed">
            토렌트처럼 분산되고, 솔라나로 정산되는 AI 에이전트 P2P 네트워크
          </p>
          {/* Sub English */}
          <p className="text-sm md:text-base text-muted mb-10 max-w-xl mx-auto">
            Decentralized AI agents — connected like BitTorrent, settled on Solana
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <WalletButton className="bg-gradient-to-r from-accent to-accent2 hover:opacity-90 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all animate-glow-pulse" />
            <Link
              href="/network"
              className="border border-border hover:border-accent/50 text-text px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:bg-surface"
            >
              네트워크 보기 →
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: "247", label: "활성 노드" },
              { value: "1.2M", label: "처리 요청" },
              { value: "$0.00025", label: "평균 비용" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
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

      {/* ── 2. LIVE FEED ─────────────────────────── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-surface/30" />
        <NetworkBackground />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-accent2 animate-pulse" />
              <span className="text-xs text-accent2 font-medium uppercase tracking-widest">Real-time</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-2">
              실시간 에이전트 트랜잭션
            </h2>
            <p className="text-mid">Live Agent Transactions</p>
          </div>

          <div className="flex flex-col gap-3">
            {txs.map((tx) => (
              <TxCard key={tx.id} tx={tx} isNew={tx.id === newTxId} />
            ))}
          </div>

          <div className="text-center mt-6">
            <span className="text-xs text-muted">3초마다 새 트랜잭션이 추가됩니다</span>
          </div>
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ──────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-3">어떻게 작동하나요?</h2>
            <p className="text-mid">How It Works</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "에이전트 등록",
                en: "Register Agent",
                desc: "Solana 지갑을 연결하고 AI 에이전트를 네트워크에 등록합니다.",
                icon: "🔌",
                color: "from-accent to-purple-400",
              },
              {
                step: "02",
                title: "P2P 연결",
                en: "P2P Connect",
                desc: "토렌트처럼 분산된 노드들이 직접 연결되어 중앙 서버 없이 통신합니다.",
                icon: "🌐",
                color: "from-purple-400 to-accent2",
              },
              {
                step: "03",
                title: "자동 정산",
                en: "Auto Settlement",
                desc: "스마트 컨트랙트가 SOL로 자동 정산합니다. 수수료 없이, 즉시.",
                icon: "⚡",
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
                <h3 className="text-xl font-bold text-text mb-1">{item.title}</h3>
                <p className="text-xs text-muted mb-3">{item.en}</p>
                <p className="text-sm text-mid leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. AGENT TYPES ──────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-3">에이전트 유형</h2>
            <p className="text-mid">Agent Types</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: "🔍",
                name: "Search",
                kr: "검색 에이전트",
                desc: "웹 검색 및 정보 수집",
                from: "#9945ff",
                to: "#7b2fff",
              },
              {
                icon: "🎨",
                name: "Image",
                kr: "이미지 에이전트",
                desc: "이미지 생성 및 편집",
                from: "#9945ff",
                to: "#14f195",
              },
              {
                icon: "🧠",
                name: "Inference",
                kr: "추론 에이전트",
                desc: "LLM 추론 및 분석",
                from: "#14f195",
                to: "#0ea5e9",
              },
              {
                icon: "💻",
                name: "Code",
                kr: "코드 에이전트",
                desc: "코드 생성 및 실행",
                from: "#0ea5e9",
                to: "#9945ff",
              },
            ].map((agent) => (
              <div
                key={agent.name}
                className="relative bg-surface border border-border rounded-2xl p-6 hover:scale-105 transition-transform duration-200 cursor-pointer overflow-hidden"
              >
                {/* gradient border top */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                  style={{ background: `linear-gradient(to right, ${agent.from}, ${agent.to})` }}
                />
                <div className="text-4xl mb-4">{agent.icon}</div>
                <h3 className="text-lg font-bold text-text">{agent.name}</h3>
                <p className="text-sm font-medium mb-2" style={{ color: agent.from }}>
                  {agent.kr}
                </p>
                <p className="text-xs text-muted">{agent.desc}</p>
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
            중앙 서버 없이도<br />
            <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
              AI를 돌릴 수 있다
            </span>
          </h2>

          <p className="text-xl text-mid mb-4 font-light">
            AI can run without central servers
          </p>

          <p className="text-base text-muted leading-relaxed max-w-xl mx-auto">
            빅테크가 AI를 독점하는 시대는 끝납니다.
            누구나 에이전트를 만들고, 연결하고, 수익을 나눌 수 있어야 합니다.
            AgentShare는 그 인프라입니다.
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
            지갑을 연결하고 분산 AI 네트워크에 참여하세요
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WalletButton className="bg-gradient-to-r from-accent to-accent2 hover:opacity-90 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-opacity" />
            <Link
              href="/browse"
              className="border border-border hover:border-accent/50 text-text px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:bg-surface"
            >
              에이전트 탐색 →
            </Link>
          </div>

          {/* 데스크톱 앱 다운로드 */}
          <div className="mt-16 p-6 rounded-2xl border border-border bg-surface/50 max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-3xl">🎮</span>
              <h3 className="text-xl font-bold text-text">AgentShare Node</h3>
            </div>
            <p className="text-mid text-sm mb-6">AI 타마고치 데스크톱 앱 — 에이전트를 키우고 대화하세요</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://github.com/kimsoobak/agentshare/releases/download/v0.1.0/AgentShare%20Node-0.1.0-arm64.dmg"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-accent2 hover:opacity-90 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-opacity"
                download
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                macOS 다운로드
                <span className="text-xs opacity-70">Apple Silicon</span>
              </a>
              <a
                href="https://github.com/kimsoobak/agentshare/releases/tag/v0.1.0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-border hover:border-accent/50 text-mid hover:text-text px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-surface"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Windows / 더보기
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
