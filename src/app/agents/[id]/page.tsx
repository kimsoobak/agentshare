import Link from 'next/link';
import { notFound } from 'next/navigation';
import { agents } from '@/lib/mock-data';

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return agents.map((a) => ({ id: a.id }));
}

export default function AgentDetailPage({ params }: Props) {
  const agent = agents.find((a) => a.id === params.id);
  if (!agent) notFound();

  const maxCount = Math.max(...agent.usageHistory.map((h) => h.count));

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Back */}
        <Link href="/browse" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
          ← 에이전트 목록으로
        </Link>

        {/* Header */}
        <div className="mt-8 mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-white">{agent.name}</h1>
              <span className="bg-purple-500/10 text-purple-400 text-sm font-medium px-3 py-1 rounded-full border border-purple-500/20">
                {agent.category}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="text-yellow-400">{'★'.repeat(Math.round(agent.rating))}</span>
              <span>{agent.rating}</span>
              <span className="text-gray-600">·</span>
              <span>등록일 {agent.createdAt}</span>
            </div>
          </div>
          <a
            href="#use"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 whitespace-nowrap text-sm"
          >
            이 에이전트 사용하기
          </a>
        </div>

        {/* Description */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-gray-300 font-semibold mb-3">설명</h2>
          <p className="text-gray-400 leading-relaxed">{agent.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {agent.tags.map((tag) => (
              <span key={tag} className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Token Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: '총 발행 토큰', value: `🪙 ${agent.tokens.toLocaleString()}`, sub: 'tokens', color: 'text-yellow-400' },
            { label: '총 사용 횟수', value: `📊 ${agent.usageCount.toLocaleString()}`, sub: 'times', color: 'text-blue-400' },
            { label: '토큰 가격', value: '💱 1 use', sub: '= 1 token', color: 'text-green-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
              <p className="text-gray-500 text-xs mb-2">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-600 text-xs mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Usage History Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-gray-300 font-semibold mb-6">사용량 히스토리</h2>
          <div className="flex items-end gap-3 h-40">
            {agent.usageHistory.map((item) => {
              const heightPct = (item.count / maxCount) * 100;
              return (
                <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-gray-500 text-xs">{item.count}</span>
                  <div className="w-full flex items-end" style={{ height: '100px' }}>
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-violet-400 rounded-t-md transition-all duration-500"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-gray-600 text-xs">{item.date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Endpoint */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-gray-300 font-semibold mb-3">엔드포인트</h2>
          <code className="text-purple-400 text-sm bg-gray-800 px-3 py-2 rounded-lg block overflow-x-auto">
            {agent.endpointUrl}
          </code>
        </div>

        {/* CTA */}
        <div id="use" className="bg-gradient-to-r from-purple-900/40 to-violet-900/30 border border-purple-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">이 에이전트 사용하기</h2>
          <p className="text-gray-400 mb-6">
            {agent.name}을(를) 지금 바로 사용해보세요. 사용할 때마다 개발자는 토큰 보상을 받습니다.
          </p>
          <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25">
            지금 시작하기 →
          </button>
        </div>
      </div>
    </main>
  );
}
