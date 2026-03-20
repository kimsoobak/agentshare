'use client';

import { useState } from 'react';
import Link from 'next/link';
import { agents } from '@/lib/mock-data';

const CATEGORIES = ['전체', '개발', '법률', '의료', '금융', '설계', '기타'] as const;

export default function BrowsePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('전체');

  const filtered = agents.filter((agent) => {
    const matchesCategory = category === '전체' || agent.category === category;
    const matchesSearch =
      search === '' ||
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.description.toLowerCase().includes(search.toLowerCase()) ||
      agent.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            ← 홈으로
          </Link>
          <h1 className="text-4xl font-bold text-white mt-4 mb-2">에이전트 탐색</h1>
          <p className="text-gray-400">전문 AI 에이전트를 발견하고 바로 사용하세요.</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <input
            type="text"
            placeholder="에이전트 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                category === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700 hover:text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-gray-500 text-sm mb-6">{filtered.length}개의 에이전트</p>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((agent) => (
            <div
              key={agent.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-purple-500/30 transition-all duration-200 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-bold text-lg">{agent.name}</h3>
                <span className="bg-purple-500/10 text-purple-400 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-500/20">
                  {agent.category}
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                {agent.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {agent.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="bg-gray-800 text-gray-500 text-xs px-2 py-0.5 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm mb-4 border-t border-gray-800 pt-4">
                <div className="flex items-center gap-1.5 text-yellow-400">
                  <span>🪙</span>
                  <span className="font-semibold">{agent.tokens.toLocaleString()}</span>
                  <span className="text-gray-600 text-xs">토큰</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <span>📊</span>
                  <span>{agent.usageCount.toLocaleString()}</span>
                  <span className="text-gray-600 text-xs">사용</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 ml-auto">
                  <span className="text-yellow-400">★</span>
                  <span>{agent.rating}</span>
                </div>
              </div>

              <Link
                href={`/agents/${agent.id}`}
                className="w-full text-center px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-medium rounded-xl border border-purple-500/30 hover:border-purple-500 transition-all duration-200 text-sm"
              >
                사용하기
              </Link>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
}
