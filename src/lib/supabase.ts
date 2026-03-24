import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Agent = {
  id: string
  created_at: string
  name: string
  description: string
  category: string
  creator: string
  contact: string
  tags: string[]
  wallet_address?: string | null    // optional (레거시 호환)
  telegram_username?: string | null // 텔레그램 봇 username (@bot_name)
  agent_type: string | null         // search | image | inference | code
  total_requests: number            // 총 사용 횟수 (기본 0)
  sol_earned: number                // 총 SOL 수익 (기본 0)
  is_active: boolean                // 활성 상태
}
