'use client';

import { useState } from 'react';
import Link from 'next/link';

const CATEGORIES = ['개발', '법률', '의료', '금융', '설계', '기타'] as const;

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: '개발',
    description: '',
    endpointUrl: '',
    apiKey: '',
    tags: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-3">등록 완료!</h2>
          <p className="text-gray-400 mb-2">
            <span className="text-purple-400 font-semibold">{form.name}</span> 에이전트가 성공적으로 등록되었습니다.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            검토 후 24시간 이내에 마켓플레이스에 게시됩니다.
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-left mb-8">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">카테고리</span>
              <span className="text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20 text-xs">{form.category}</span>
            </div>
            {form.tags && (
              <div className="flex justify-between items-center text-sm mt-3">
                <span className="text-gray-500">태그</span>
                <span className="text-gray-300">{form.tags}</span>
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-gray-800">
              <p className="text-gray-500 text-xs mb-1">초기 토큰</p>
              <p className="text-yellow-400 font-semibold">🪙 0 tokens (사용량에 따라 증가)</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/browse"
              className="flex-1 text-center px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all duration-200"
            >
              마켓플레이스 보기
            </Link>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', category: '개발', description: '', endpointUrl: '', apiKey: '', tags: '' }); }}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl border border-gray-700 transition-all duration-200"
            >
              다른 에이전트 등록
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            ← 홈으로
          </Link>
          <h1 className="text-4xl font-bold text-white mt-4 mb-2">에이전트 등록</h1>
          <p className="text-gray-400">AI 에이전트를 등록하고 토큰 보상을 받으세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                에이전트 이름 <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="예: 코드리뷰봇"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">카테고리</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">설명</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="에이전트가 어떤 일을 하는지 설명해주세요..."
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
              />
            </div>

            {/* Endpoint URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">엔드포인트 URL</label>
              <input
                type="url"
                value={form.endpointUrl}
                onChange={(e) => setForm({ ...form, endpointUrl: e.target.value })}
                placeholder="https://api.youragent.com/v1"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>

            {/* API Key */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                API 키 <span className="text-gray-600 text-xs">(선택사항)</span>
              </label>
              <input
                type="password"
                value={form.apiKey}
                onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                태그 <span className="text-gray-600 text-xs">(쉼표로 구분)</span>
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="코드리뷰, GitHub, CI/CD"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Token info */}
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🪙</span>
              <div>
                <p className="text-purple-300 font-medium mb-1">토큰 보상 안내</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  에이전트가 사용될 때마다 1 토큰이 적립됩니다. 적립된 토큰은 플랫폼 크레딧으로 교환하거나 다른 에이전트 이용에 활용할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 text-lg"
          >
            에이전트 등록하기
          </button>
        </form>
      </div>
    </main>
  );
}
