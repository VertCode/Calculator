import { Channels } from '../main/preload';
import { HistoryType, Theme } from '../utils/Constants';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        on: (channel: Channels, listener: (...args: unknown[]) => void) => void;
        send: (channel: Channels, ...args: unknown[]) => void;
      };
      calculator: {
        calculate: (addToHistory: boolean) => void;
        getAnswer: () => Promise<number>;
        getExpression: () => Promise<string>;
        setExpression: (expression: string) => Promise<void>;
        hasCalculated: () => Promise<boolean>;
        clear(): Promise<void>;

        getHistory: () => Promise<HistoryType[]>;
        openHistory: () => void;
        closeHistory: () => void;
      };
      theme: {
        getCurrentTheme: () => Promise<Theme>;
        setTheme: (theme: Theme) => void;
      };
    };
  }
}

export {};
