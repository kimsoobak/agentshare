import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-32 pb-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-gray-950 to-violet-950/20 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-purple-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            Beta — 에이전트 마켓플레이스 오픈
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-4">
            <span className="block text-white">AI 에이전트</span>
            <span className="block bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              마켓플레이스
            </span>
          </h1>
          <p className="text-gray-400 text-xl mt-4 mb-2 font-light">AI Agent Marketplace</p>
          <p className="text-gray-400 text-lg mt-6 mb-10 max-w-2xl mx-auto leading-relaxed">
            전문 AI 에이전트를 발견하고, 사용하고, 수익을 창출하세요.
            <br />
            <span className="text-gray-500">Discover, use, and monetize specialized AI agents.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
            >
              에이전트 탐색하기
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200"
            >
              에이전트 등록하기
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '🔍',
              title: '에이전트 발견',
              subtitle: 'Discover Agents',
              desc: '개발, 법률, 의료, 금융 등 다양한 분야의 전문 AI 에이전트를 탐색하세요.',
            },
            {
              icon: '🪙',
              title: '토큰 보상',
              subtitle: 'Token Rewards',
              desc: '에이전트가 사용될 때마다 토큰을 획득합니다. 더 많이 사용될수록 더 많은 보상을 받습니다.',
            },
            {
              icon: '⚡',
              title: '간편 등록',
              subtitle: 'Easy Registration',
              desc: '몇 분 안에 AI 에이전트를 등록하고 수천 명의 사용자에게 노출시키세요.',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-200"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-white font-bold text-xl mb-1">{card.title}</h3>
              <p className="text-purple-400 text-sm mb-3">{card.subtitle}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Manifesto */}
      <section className="px-6 py-16 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-6">우리의 비전</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-left space-y-4">
          <p className="text-gray-300 leading-relaxed">
            AI 에이전트 마켓플레이스는 AI 개발자와 사용자를 연결하는 개방형 생태계입니다.
            누구나 전문 AI 에이전트를 만들고, 공유하고, 수익을 창출할 수 있습니다.
          </p>
          <p className="text-gray-400 leading-relaxed">
            사용량 기반 토큰 시스템으로 개발자는 에이전트가 실제로 사용될 때마다 공정한 보상을 받습니다.
            좋은 에이전트가 더 많이 사용되고, 더 많은 보상을 받는 선순환 구조를 만듭니다.
          </p>
          <p className="text-gray-500 text-sm italic border-t border-gray-800 pt-4">
            "The AI Agent Marketplace connects developers and users in an open ecosystem where anyone can build, share, and monetize specialized AI agents through a fair, usage-based token reward system."
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-600 text-sm">
        © 2024 AI Agent Marketplace · Built for the decentralized AI future
      </footer>
    </main>
  );
}
