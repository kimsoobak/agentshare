const axios = require('axios');
const wallet = require('./wallet');

const REGISTRY_URL = process.env.REGISTRY_URL || 'https://agentshare.kr/api';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || '';

let registeredAgentId = null;

// Supabase REST API 헬퍼
function supabase(table) {
  const base = `${SUPABASE_URL}/rest/v1/${table}`;
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };
  return {
    insert: (data) => axios.post(base, data, { headers }),
    update: (data, match) =>
      axios.patch(`${base}?${match}`, data, { headers }),
    upsert: (data) =>
      axios.post(base, data, {
        headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=representation' },
      }),
  };
}

async function registerAgent({ name, type, walletAddress }) {
  if (!SUPABASE_KEY) {
    console.warn('[registry] SUPABASE_KEY 미설정, 레지스트리 건너뜀');
    return;
  }

  try {
    const res = await supabase('agents').upsert({
      wallet_address: walletAddress,
      name,
      type,
      status: 'online',
      last_seen: new Date().toISOString(),
    });

    if (res.data && res.data[0]) {
      registeredAgentId = res.data[0].id;
      console.log('[registry] 에이전트 등록 완료:', registeredAgentId);
    }
  } catch (err) {
    console.warn('[registry] 에이전트 등록 실패:', err.message);
  }
}

async function deregisterAgent() {
  if (!SUPABASE_KEY || !registeredAgentId) return;

  try {
    await supabase('agents').update(
      { status: 'offline', last_seen: new Date().toISOString() },
      `id=eq.${registeredAgentId}`
    );
    console.log('[registry] 에이전트 오프라인 처리');
  } catch (err) {
    console.warn('[registry] 오프라인 처리 실패:', err.message);
  }
}

async function recordRequest({ solEarned }) {
  if (!SUPABASE_KEY || !registeredAgentId) return;

  try {
    // total_requests, sol_earned RPC 증가 (Supabase DB 함수 필요 시 별도 구현)
    await supabase('agent_stats').upsert({
      agent_id: registeredAgentId,
      wallet_address: wallet.getPublicKey(),
      sol_earned: solEarned,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[registry] 요청 기록 실패:', err.message);
  }
}

async function getAgentList() {
  if (!SUPABASE_KEY) return [];
  try {
    const res = await axios.get(
      `${SUPABASE_URL}/rest/v1/agents?status=eq.online&select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    return res.data || [];
  } catch (err) {
    console.warn('[registry] 에이전트 목록 조회 실패:', err.message);
    return [];
  }
}

module.exports = { registerAgent, deregisterAgent, recordRequest, getAgentList };
