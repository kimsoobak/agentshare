const axios = require('axios');
const registry = require('./registry');
const network = require('./network');

let running = false;
let currentConfig = null;
let totalRequests = 0;
let totalSol = 0;
let recentTxs = [];

const SOL_PER_REQUEST = 0.001; // 요청당 0.001 SOL (임시 고정가)

async function start(config) {
  if (running) throw new Error('이미 실행 중입니다.');
  currentConfig = config;
  running = true;
  console.log(`[agent] 시작: ${config.name} (${config.type})`);

  await registry.registerAgent({
    name: config.name,
    type: config.type,
    walletAddress: require('./wallet').getPublicKey(),
  });
}

async function stop() {
  if (!running) return;
  running = false;
  currentConfig = null;
  console.log('[agent] 중지');

  await registry.deregisterAgent().catch(() => {});
}

async function handleRequest(payload, ws) {
  if (!running || !currentConfig) return;

  const { requestId, query, type } = payload;
  console.log(`[agent] 요청 처리: ${requestId} (${type})`);

  let result;
  try {
    result = await dispatch(type || currentConfig.type, query, currentConfig.apiKey);
  } catch (err) {
    result = { error: err.message };
  }

  // 응답 전송
  network.sendAgentResponse(ws, requestId, result);

  // 수익 집계
  totalRequests++;
  totalSol += SOL_PER_REQUEST;

  const tx = {
    type: (type || currentConfig.type).toUpperCase(),
    agent: currentConfig.name,
    sol: SOL_PER_REQUEST,
    time: new Date().toLocaleTimeString('ko-KR'),
  };
  recentTxs.unshift(tx);
  if (recentTxs.length > 5) recentTxs.pop();

  // 레지스트리 업데이트 (비동기, 실패해도 무시)
  registry.recordRequest({ solEarned: SOL_PER_REQUEST }).catch(() => {});
}

async function dispatch(type, query, apiKey) {
  switch (type) {
    case 'search':
      return callTavily(query, apiKey);
    case 'inference':
      return callOpenAI(query, apiKey);
    case 'image':
      return callDallE(query, apiKey);
    case 'code':
      return callClaude(query, apiKey);
    default:
      throw new Error(`지원하지 않는 타입: ${type}`);
  }
}

async function callTavily(query, apiKey) {
  const res = await axios.post(
    'https://api.tavily.com/search',
    { api_key: apiKey, query, search_depth: 'basic', max_results: 5 },
    { timeout: 15000 }
  );
  return { results: res.data.results };
}

async function callOpenAI(query, apiKey) {
  const res = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: query }],
      max_tokens: 1024,
    },
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 30000,
    }
  );
  return { content: res.data.choices[0].message.content };
}

async function callDallE(query, apiKey) {
  const res = await axios.post(
    'https://api.openai.com/v1/images/generations',
    { model: 'dall-e-3', prompt: query, n: 1, size: '1024x1024' },
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 60000,
    }
  );
  return { url: res.data.data[0].url };
}

async function callClaude(query, apiKey) {
  const res = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: query }],
    },
    {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      timeout: 30000,
    }
  );
  return { content: res.data.content[0].text };
}

function getEarnings() {
  return { totalRequests, totalSol, recentTxs };
}

function isRunning() {
  return running;
}

module.exports = { start, stop, handleRequest, getEarnings, isRunning };
