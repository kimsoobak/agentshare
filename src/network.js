const WebSocket = require('ws');
const wallet = require('./wallet');

const LOCAL_PORT = 8547;
const BOOTSTRAP_URL = 'wss://network.agentshare.kr';
const RECONNECT_DELAY = 10000; // 10초
const PING_INTERVAL = 30000;   // 30초

let wss = null;           // 로컬 WebSocket 서버
let bootstrapWs = null;   // 부트스트랩 노드 연결
let peers = new Map();    // peerId → ws
let connected = false;
let pingTimer = null;
let bootstrapTimer = null;

// 메시지 타입
const MSG = {
  HELLO: 'HELLO',
  PEERS: 'PEERS',
  AGENT_REQUEST: 'AGENT_REQUEST',
  AGENT_RESPONSE: 'AGENT_RESPONSE',
  PAYMENT: 'PAYMENT',
  PING: 'PING',
  PONG: 'PONG',
};

function send(ws, type, payload = {}) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, payload, from: wallet.getPublicKey() }));
  }
}

function broadcast(type, payload = {}, excludeWs = null) {
  peers.forEach((ws) => {
    if (ws !== excludeWs) send(ws, type, payload);
  });
}

function handleMessage(ws, raw) {
  let msg;
  try {
    msg = JSON.parse(raw);
  } catch {
    return;
  }

  const { type, payload, from } = msg;

  switch (type) {
    case MSG.HELLO: {
      // 새 피어 등록
      if (from && !peers.has(from)) {
        peers.set(from, ws);
        ws.peerId = from;
        console.log(`[network] 피어 연결: ${from.slice(0, 8)}...`);
        // 내 피어 목록 공유
        const peerList = Array.from(peers.keys()).filter(k => k !== from);
        send(ws, MSG.PEERS, { peers: peerList });
      }
      break;
    }
    case MSG.PEERS: {
      // TODO: 피어 목록을 받아 추가 연결 시도
      console.log(`[network] 피어 목록 수신: ${(payload.peers || []).length}개`);
      break;
    }
    case MSG.AGENT_REQUEST: {
      const agentManager = require('./agent');
      agentManager.handleRequest(payload, ws).catch(err =>
        console.error('[network] 에이전트 요청 처리 실패:', err)
      );
      break;
    }
    case MSG.AGENT_RESPONSE: {
      console.log('[network] 에이전트 응답 수신:', payload.requestId);
      break;
    }
    case MSG.PAYMENT: {
      console.log('[network] 결제 이벤트:', payload);
      break;
    }
    case MSG.PING:
      send(ws, MSG.PONG);
      break;
    case MSG.PONG:
      break;
    default:
      break;
  }
}

function startLocalServer(port) {
  if (port === undefined) port = LOCAL_PORT;
  wss = new WebSocket.Server({ port });

  wss.on('listening', () => {
    console.log(`[network] 로컬 WebSocket 서버 시작 (포트 ${port})`);
  });

  wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`[network] 새 연결: ${ip}`);

    ws.on('message', (data) => handleMessage(ws, data));

    ws.on('close', () => {
      if (ws.peerId) {
        peers.delete(ws.peerId);
        console.log(`[network] 피어 연결 해제: ${ws.peerId.slice(0, 8)}...`);
      }
    });

    ws.on('error', (err) => {
      console.warn('[network] 피어 소켓 오류:', err.message);
    });

    // 새 연결에게 HELLO 전송
    send(ws, MSG.HELLO);
  });

  wss.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && port < LOCAL_PORT + 3) {
      console.warn(`[network] 포트 ${port} 사용 중. ${port + 1} 시도...`);
      wss.close();
      startLocalServer(port + 1);
    } else {
      console.error('[network] 서버 오류:', err.message);
    }
  });
}

function connectBootstrap() {
  if (bootstrapWs && bootstrapWs.readyState === WebSocket.OPEN) return;

  console.log('[network] 부트스트랩 노드 연결 시도...');

  try {
    bootstrapWs = new WebSocket(BOOTSTRAP_URL);

    bootstrapWs.on('open', () => {
      connected = true;
      console.log('[network] 부트스트랩 노드 연결 성공');
      send(bootstrapWs, MSG.HELLO);
    });

    bootstrapWs.on('message', (data) => handleMessage(bootstrapWs, data));

    bootstrapWs.on('close', () => {
      connected = peers.size > 0;
      console.log('[network] 부트스트랩 연결 해제. 재연결 예약...');
      scheduleReconnect();
    });

    bootstrapWs.on('error', (err) => {
      // 부트스트랩 서버가 없을 수 있으므로 warn 수준으로만 기록
      console.warn('[network] 부트스트랩 오류:', err.message);
      connected = peers.size > 0;
    });
  } catch (err) {
    console.warn('[network] 부트스트랩 연결 실패:', err.message);
    scheduleReconnect();
  }
}

function scheduleReconnect() {
  if (bootstrapTimer) return;
  bootstrapTimer = setTimeout(() => {
    bootstrapTimer = null;
    connectBootstrap();
  }, RECONNECT_DELAY);
}

function startPing() {
  pingTimer = setInterval(() => {
    peers.forEach((ws) => send(ws, MSG.PING));
    if (bootstrapWs && bootstrapWs.readyState === WebSocket.OPEN) {
      send(bootstrapWs, MSG.PING);
    }
  }, PING_INTERVAL);
}

async function init() {
  startLocalServer();
  connectBootstrap();
  startPing();
}

function isConnected() {
  return connected || peers.size > 0;
}

function getPeerCount() {
  return peers.size;
}

function sendAgentResponse(ws, requestId, result) {
  send(ws, MSG.AGENT_RESPONSE, { requestId, result });
}

function shutdown() {
  if (pingTimer) clearInterval(pingTimer);
  if (bootstrapTimer) clearTimeout(bootstrapTimer);
  if (bootstrapWs) bootstrapWs.close();
  if (wss) wss.close();
  peers.clear();
}

module.exports = {
  init,
  isConnected,
  getPeerCount,
  sendAgentResponse,
  broadcast,
  shutdown,
};
