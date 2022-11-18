import { contextBridge, ipcRenderer } from 'electron';
import { IPCChannels } from '../utils/Constants';

// Map Constants.IPC_CHANNELS -> a | b | c
export type Channels = keyof typeof IPCChannels;

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: (channel: Channels, listener: (...args: unknown[]) => void) => {
      ipcRenderer.on(channel, listener);

      return () => {
        ipcRenderer.removeListener(channel, listener);
      };
    },
    send: (channel: Channels, ...args: unknown[]) => {
      ipcRenderer.send(channel, ...args);
    },
  },
  calculator: {
    calculate: (addToHistory = false) => {
      ipcRenderer.send(IPCChannels.CALCULATE, addToHistory);
    },
    getAnswer: () => {
      return ipcRenderer.invoke(IPCChannels.GET_ANSWER);
    },
    getExpression: async () => {
      return ipcRenderer.invoke(IPCChannels.GET_EXPRESSION);
    },
    setExpression: (expression: string) => {
      ipcRenderer.send(IPCChannels.SET_EXPRESSION, expression);
    },
    hasCalculated: async () => {
      return ipcRenderer.invoke(IPCChannels.HAS_CALCULATED);
    },
    clear: () => {
      ipcRenderer.send(IPCChannels.CLEAR);
    },

    getHistory: async () => {
      return ipcRenderer.invoke(IPCChannels.GET_HISTORY);
    },
    openHistory: () => {
      ipcRenderer.send(IPCChannels.OPEN_HISTORY);
    },
    closeHistory: () => {
      ipcRenderer.send(IPCChannels.CLOSE_HISTORY);
    },
  },
  theme: {
    getCurrentTheme: async () => {
      return ipcRenderer.invoke(IPCChannels.GET_CURRENT_THEME);
    },
    setTheme: (theme: string) => {
      ipcRenderer.send(IPCChannels.SET_THEME, theme);
    },
  },
});
