'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (mode === 'login') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) {
        setError(err.message)
      } else {
        router.push('/')
      }
    } else {
      const { error: err } = await supabase.auth.signUp({ email, password })
      if (err) {
        setError(err.message)
      } else {
        setMessage('가입 완료! 이메일 확인 후 로그인해주세요.')
      }
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-text">
          {mode === 'login' ? '로그인' : '회원가입'}
        </h1>
        <p className="text-muted text-sm mt-1">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-mid mb-1">이메일 · Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="email@example.com"
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-text placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-mid mb-1">비밀번호 · Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-text placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            ⚠️ {error}
          </div>
        )}
        {message && (
          <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">
            ✅ {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent-dark disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          {loading ? '처리 중...' : mode === 'login' ? '로그인' : '가입하기'}
        </button>
      </form>

      <div className="text-center mt-6 text-sm text-muted">
        {mode === 'login' ? (
          <>계정이 없으신가요?{' '}
            <button onClick={() => setMode('signup')} className="text-accent underline underline-offset-4">회원가입</button>
          </>
        ) : (
          <>이미 계정이 있으신가요?{' '}
            <button onClick={() => setMode('login')} className="text-accent underline underline-offset-4">로그인</button>
          </>
        )}
      </div>
    </div>
  )
}
