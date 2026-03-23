const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('agentShare', {
  getStatus: () => ipcRenderer.invoke('get-status'),
  getWallet: () => ipcRenderer.invoke('get-wallet'),
  startAgent: (config) => ipcRenderer.invoke('start-agent', config),
  stopAgent: () => ipcRenderer.invoke('stop-agent'),
  getEarnings: () => ipcRenderer.invoke('get-earnings'),
  chat: (message) => ipcRenderer.invoke('chat-message', message),
  minimize: () => ipcRenderer.invoke('window-minimize'),
  quit: () => ipcRenderer.invoke('window-quit'),
});
