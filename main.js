const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage } = require('electron');
const path = require('path');

// ── Gemini chat state ──
let geminiModel = null;
let chatHistory = [];
const mockReplies = [
  '안녕! 나는 AgentShare 에이전트야. 지금은 데모 모드로 실행 중이야.\n\nGEMINI_API_KEY 환경변수를 설정하고 앱을 재시작하면 실제 Gemini AI와 대화할 수 있어!',
  '좋은 질문이야! (데모 모드) GEMINI_API_KEY를 설정하면 진짜 답변을 드릴 수 있어.',
  '흥미롭네! (데모 모드) 터미널에서 export GEMINI_API_KEY=your_key_here 를 실행하고 재시작해봐.',
  '나도 더 알고 싶어! (데모 모드) API 키를 연결하면 훨씬 똑똑해질 거야.',
];
let mockIdx = 0;

function getGemini() {
  if (geminiModel) return geminiModel;
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    geminiModel = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: 'You are AgentShare, a friendly and helpful AI agent embedded in a desktop app. Respond in Korean unless the user writes in English. Be concise, warm, and helpful.',
    });
    console.log('[gemini] 초기화 성공');
    return geminiModel;
  } catch (err) {
    console.warn('[gemini] 초기화 실패:', err.message);
    return null;
  }
}

let mainWindow = null;
let tray = null;
let wallet = null;
let network = null;
let agentManager = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 750,
    minWidth: 360,
    minHeight: 600,
    maxWidth: 600,
    title: 'AgentShare',
    backgroundColor: '#0a0a0a',
    frame: false,
    transparent: true,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  // 닫기 버튼 → 트레이로 최소화
  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  // 트레이 아이콘 (16x16 기본 이미지 생성)
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'AgentShare Node 열기',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      },
    },
    { type: 'separator' },
    {
      label: '종료',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('AgentShare Node');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

async function initServices() {
  try {
    wallet = require('./src/wallet');
    await wallet.init();

    network = require('./src/network');
    await network.init();

    agentManager = require('./src/agent');
  } catch (err) {
    console.error('서비스 초기화 실패:', err);
  }
}

// IPC 핸들러 — 창 컨트롤
ipcMain.handle('window-minimize', () => { if (mainWindow) mainWindow.minimize(); });
ipcMain.handle('window-quit', () => { app.isQuitting = true; app.quit(); });

ipcMain.handle('get-status', async () => {
  return {
    connected: network ? network.isConnected() : false,
    peerCount: network ? network.getPeerCount() : 0,
    walletAddress: wallet ? wallet.getPublicKey() : null,
    balance: wallet ? await wallet.getBalance() : 0,
  };
});

ipcMain.handle('get-wallet', async () => {
  if (!wallet) return null;
  return {
    address: wallet.getPublicKey(),
    balance: await wallet.getBalance(),
  };
});

ipcMain.handle('start-agent', async (_event, config) => {
  if (!agentManager) return { success: false, error: '에이전트 매니저 미초기화' };
  try {
    await agentManager.start(config);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('stop-agent', async () => {
  if (!agentManager) return { success: false };
  try {
    await agentManager.stop();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-earnings', async () => {
  if (!agentManager) return { totalRequests: 0, totalSol: 0, recentTxs: [] };
  return agentManager.getEarnings();
});

ipcMain.handle('chat-message', async (_event, message) => {
  try {
    const model = getGemini();
    if (!model) {
      const reply = mockReplies[mockIdx % mockReplies.length];
      mockIdx++;
      return { success: true, reply };
    }
    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();
    // Keep last 20 turns (10 exchanges)
    chatHistory.push({ role: 'user',  parts: [{ text: message }] });
    chatHistory.push({ role: 'model', parts: [{ text: reply }] });
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
    return { success: true, reply };
  } catch (err) {
    console.error('[gemini] 오류:', err.message);
    return { success: false, error: err.message };
  }
});

app.whenReady().then(async () => {
  await initServices();
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    else mainWindow.show();
  });
});

app.on('window-all-closed', () => {
  // macOS: 트레이 남기기 위해 종료 안 함
  if (process.platform !== 'darwin') {
    // Windows에서도 트레이 유지
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
  if (network) network.shutdown();
});
