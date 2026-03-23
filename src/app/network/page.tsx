'use client'

import { useState, useEffect } from 'react'

const NETWORK_STATS = [
  { label: '총 노드', labelEn: 'Total Nodes', value: '247', unit: '' },
  { label: '활성 에이전트', labelEn: 'Active Agents', value: '183', unit: '' },
  { label: '처리된 요청', labelEn: 'Requests Processed', value: '1.2M', unit: '' },
  { label: '총 SOL 정산', labelEn: 'Total SOL Settled', value: '4,821', unit: 'SOL' },
]

const NODES = [
  { id: 'hub', label: 'AgentNet Hub', x: 50, y: 50, color: '#9945ff', size: 18, type: 'hub', wallet: 'Hub Node' },
  { id: 's1', label: 'Search #001', x: 25, y: 20, color: '#60a5fa', size: 12, type: 'search', wallet: '7xKp...3mN2' },
  { id: 's2', label: 'Search #002', x: 15, y: 45, color: '#60a5fa', size: 10, type: 'search', wallet: '3aKl...7rP9' },
  { id: 'i1', label: 'Image #042', x: 75, y: 18, color: '#f472b6', size: 12, type: 'image', wallet: '4rQs...9aB1' },
  { id: 'i2', label: 'Image #043', x: 85, y: 40, color: '#f472b6', size: 9, type: 'image', wallet: '8pLm...2nC6' },
  { id: 'inf1', label: 'Infer #007', x: 78, y: 72, color: '#a855f7', size: 13, type: 'inference', wallet: '9mRt...6cX4' },
  { id: 'inf2', label: 'Infer #008', x: 60, y: 82, color: '#a855f7', size: 10, type: 'inference', wallet: '1vBq...4hK3' },
  { id: 'c1', label: 'Code #013', x: 22, y: 76, color: '#4ade80', size: 12, type: 'code', wallet: '2wNp...8vF7' },
  { id: 'c2', label: 'Code #014', x: 38, y: 82, color: '#4ade80', size: 9, type: 'code', wallet: '5tGh...1mS8' },
]

const EDGES = [
  { from: 'hub', to: 's1' }, { from: 'hub', to: 's2' },
  { from: 'hub', to: 'i1' }, { from: 'hub', to: 'i2' },
  { from: 'hub', to: 'inf1' }, { from: 'hub', to: 'inf2' },
  { from: 'hub', to: 'c1' }, { from: 'hub', to: 'c2' },
  { from: 's1', to: 'inf1' }, { from: 'i1', to: 'inf1' },
  { from: 'c1', to: 's1' }, { from: 'inf1', to: 'i1' },
]

const MOCK_TXS = [
  { from: 'Search Agent #001', to: 'Inference Agent #007', amount: '0.00025', ts: '방금 전' },
  { from: 'Code Agent #013', to: 'Image Agent #042', amount: '0.00031', ts: '12초 전' },
  { from: 'Inference Agent #007', to: 'Search Agent #002', amount: '0.00028', ts: '34초 전' },
  { from: 'Image Agent #043', to: 'Code Agent #014', amount: '0.00019', ts: '1분 전' },
  { from: 'Search Agent #002', to: 'Inference Agent #008', amount: '0.00022', ts: '2분 전' },
]

function NetworkGraph() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const getNode = (id: string) => NODES.find((n) => n.id === id)

  return (
    <div className="relative w-full aspect-[16/9] max-h-[480px] bg-surface border border-border rounded-2xl overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(153,69,255,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* Edges */}
        {EDGES.map((edge, i) => {
          const fromNode = getNode(edge.from)
          const toNode = getNode(edge.to)
          if (!fromNode || !toNode) return null
          const isActive = hoveredNode === edge.from || hoveredNode === edge.to
          return (
            <line
              key={i}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={isActive ? '#9945ff' : 'rgba(153,69,255,0.2)'}
              strokeWidth={isActive ? '0.4' : '0.2'}
              strokeDasharray={isActive ? 'none' : '1,1'}
            />
          )
        })}

        {/* Nodes */}
        {NODES.map((node) => (
          <g
            key={node.id}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size / 2 + 1.5}
              fill={node.color}
              opacity={0.15}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size / 2}
              fill={node.color}
              opacity={hoveredNode === node.id ? 1 : 0.7}
            />
            {hoveredNode === node.id && (
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size / 2 + 3}
                fill="none"
                stroke={node.color}
                strokeWidth="0.5"
                opacity={0.5}
              />
            )}
            <text
              x={node.x}
              y={node.y + node.size / 2 + 3}
              textAnchor="middle"
              fontSize="2.5"
              fill="rgba(240,240,255,0.7)"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredNode && (() => {
        const node = getNode(hoveredNode)
        if (!node) return null
        return (
          <div className="absolute top-4 left-4 bg-bg border border-border rounded-xl px-3 py-2 text-xs pointer-events-none">
            <p className="font-bold text-text">{node.label}</p>
            <p className="text-muted font-mono mt-0.5">{node.wallet}</p>
            <p className={`mt-1 font-medium ${node.type === 'hub' ? 'text-accent' : node.type === 'search' ? 'text-blue-400' : node.type === 'image' ? 'text-pink-400' : node.type === 'inference' ? 'text-purple-400' : 'text-green-400'}`}>
              {node.type === 'hub' ? '● Hub' : node.type === 'search' ? '🔍 Search' : node.type === 'image' ? '🎨 Image' : node.type === 'inference' ? '🧠 Inference' : '💻 Code'}
            </p>
          </div>
        )
      })()}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
        {[
          { color: 'bg-blue-400', label: 'Search' },
          { color: 'bg-pink-400', label: 'Image' },
          { color: 'bg-purple-400', label: 'Inference' },
          { color: 'bg-green-400', label: 'Code' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            <span className="text-xs text-muted">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TxFeed() {
  const [txs, setTxs] = useState(MOCK_TXS)

  useEffect(() => {
    const interval = setInterval(() => {
      const newTx = {
        from: MOCK_TXS[Math.floor(Math.random() * MOCK_TXS.length)].from,
        to: MOCK_TXS[Math.floor(Math.random() * MOCK_TXS.length)].to,
        amount: (Math.random() * 0.0003 + 0.0001).toFixed(5),
        ts: '방금 전',
      }
      setTxs((prev) => [newTx, ...prev.slice(0, 4)])
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-2">
      {txs.map((tx, i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-surface border border-border rounded-xl px-4 py-3 text-xs transition-all"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-1.5 h-1.5 rounded-full bg-accent2 animate-pulse flex-shrink-0" />
            <span className="text-mid truncate">
              <span className="text-text font-medium">{tx.from}</span>
              <span className="text-muted mx-1">→</span>
              <span className="text-text font-medium">{tx.to}</span>
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-3">
            <span className="font-bold text-accent2 font-mono">{tx.amount} SOL</span>
            <span className="text-muted">{tx.ts}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function NetworkPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-1.5 bg-surface2 border border-border px-3 py-1 rounded-full mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-accent2 animate-pulse" />
          <span className="text-xs text-mid font-medium">Live Network</span>
        </div>
        <h1 className="text-3xl font-bold text-text">네트워크 현황</h1>
        <p className="text-muted mt-1 text-sm">AgentNet P2P Network — 실시간 노드 현황 및 트랜잭션 피드</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {NETWORK_STATS.map((s) => (
          <div key={s.label} className="bg-surface border border-border rounded-2xl p-5">
            <div className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
              {s.value}
              {s.unit && <span className="text-sm font-normal text-mid ml-1">{s.unit}</span>}
            </div>
            <div className="text-sm font-medium text-text mt-1">{s.label}</div>
            <div className="text-xs text-muted">{s.labelEn}</div>
          </div>
        ))}
      </div>

      {/* Network Topology */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-text mb-4">
          네트워크 토폴로지 <span className="text-muted text-sm font-normal ml-2">Network Topology</span>
        </h2>
        <NetworkGraph />
      </div>

      {/* Transaction Feed */}
      <div>
        <h2 className="text-lg font-bold text-text mb-4">
          최근 트랜잭션 <span className="text-muted text-sm font-normal ml-2">Recent Transactions</span>
        </h2>
        <TxFeed />
        <p className="text-xs text-muted mt-4 text-center">
          트랜잭션은 Solana 블록체인에 기록됩니다 · All transactions are recorded on the Solana blockchain
        </p>
      </div>
    </div>
  )
}
