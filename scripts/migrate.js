const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// .env.local 파싱
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  const content = fs.readFileSync(envPath, 'utf-8')
  const env = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    env[key] = value
  }
  return env
}

async function main() {
  const env = loadEnv()
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
    process.exit(1)
  }

  console.log('Connecting to Supabase:', supabaseUrl)
  const supabase = createClient(supabaseUrl, supabaseKey)

  // SQL 파일 읽기
  const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260323000001_add_agent_fields.sql')
  const sql = fs.readFileSync(sqlPath, 'utf-8')
  console.log('Running migration:\n', sql)

  const { error } = await supabase.rpc('exec_sql', { query: sql }).single()

  if (error) {
    // exec_sql RPC가 없는 경우 — Supabase anon key로는 DDL 실행 불가
    // 대신 각 컬럼을 개별적으로 추가 시도 (REST API 우회 불가)
    console.warn('exec_sql RPC not available (expected with anon key).')
    console.log('\n===== MANUAL MIGRATION REQUIRED =====')
    console.log('Supabase Dashboard > SQL Editor 에서 아래 SQL을 실행하세요:\n')
    console.log(sql)
    console.log('======================================')
    console.log('\nOr run via Supabase CLI:')
    console.log('  supabase db push')
    process.exit(0)
  }

  console.log('Migration completed successfully!')
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
