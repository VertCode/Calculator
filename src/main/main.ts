/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import Store from 'electron-store';
import calculate from '../utils/calculations';
import { HistoryType, IPCChannels, THEMES } from '../utils/Constants';

let mainWindow: BrowserWindow | null = null;
let historyWindow: BrowserWindow | null = null;
const schema: any = {
  theme: {
    type: 'string',
    default: THEMES[0].name,
  },
  history: {
    type: 'array',
    default: [],
    items: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
        },
        result: {
          type: 'string',
        },
      },
    },
  },
};
const store: Store = new Store({ schema });

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async (
  route: string,
  onClose: () => void,
  config?: Electron.BrowserWindowConstructorOptions
) => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const browserWindow = new BrowserWindow({
    show: false,
    width: 384,
    height: 575,
    frame: false,
    resizable: false,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    ...config,
  });

  browserWindow.loadURL(
    process.env.NODE_ENV === 'development'
      ? `http://localhost:1212/index.html${route}`
      : `file://${path.resolve(__dirname, '../renderer/index.html')}${route}`
  );

  browserWindow.on('ready-to-show', () => {
    if (!browserWindow) {
      throw new Error(`${route} window is not defined`);
    }

    if (process.env.START_MINIMIZED) {
      browserWindow.minimize();
    } else {
      browserWindow.show();
    }
  });

  browserWindow.on('closed', onClose);

  return browserWindow;
};

/**
 * Add event listeners...
 */
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const createMainWindow = async () => {
  mainWindow = await createWindow('', () => {
    mainWindow = null;

    if (historyWindow) {
      historyWindow.close();
    }
  });

  mainWindow.on('move', () => {
    const x =
      (mainWindow?.getPosition()[0] || 0) +
      (mainWindow?.getSize()[0] || 0) +
      10;
    const y = mainWindow?.getPosition()[1] || 0;
    historyWindow?.setPosition(x, y);
  });

  mainWindow.on('minimize', () => {
    historyWindow?.hide();
  });

  mainWindow.on('restore', () => {
    historyWindow?.show();
  });
};

app
  .whenReady()
  .then(async () => {
    await createMainWindow();

    app.on('activate', async () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) {
        await createMainWindow();
      }
    });
  })

  .catch(console.log);

// Some variables, these will not be stored in the store
let currentAnswer = '';
let currentExpression = '';
let hasCalculated = false;

ipcMain.on(IPCChannels.CALCULATE, async (event, addToHistory) => {
  const expression = currentExpression.replace(/÷/g, '/').replace(/×/g, '*');
  const calculateAnswer = calculate(expression) ?? 'Error';

  // Add to history
  if (addToHistory) {
    const history: HistoryType[] = store.get('history', []) as HistoryType[];

    history.push({
      expression,
      result: `${calculateAnswer}`,
    });
    store.set('history', history);
    historyWindow?.webContents.send(IPCChannels.UPDATE_HISTORY, history);
  }

  currentAnswer = `${calculateAnswer}`;
  hasCalculated = true;

  mainWindow?.webContents.send(IPCChannels.UPDATE_ANSWER, calculateAnswer);
});

ipcMain.on(IPCChannels.CLEAR, async () => {
  currentAnswer = '';
  currentExpression = '';
  hasCalculated = false;

  mainWindow?.webContents.send(IPCChannels.UPDATE_ANSWER, '0');
  mainWindow?.webContents.send(IPCChannels.UPDATE_EXPRESSION, '');
});

ipcMain.handle(IPCChannels.HAS_CALCULATED, () => {
  return hasCalculated;
});

ipcMain.handle(IPCChannels.GET_EXPRESSION, async () => {
  return currentExpression;
});

ipcMain.on(IPCChannels.SET_EXPRESSION, async (event, expression) => {
  currentExpression = expression;
  hasCalculated = false;

  mainWindow?.webContents.send(IPCChannels.UPDATE_EXPRESSION, expression);
});

ipcMain.handle(IPCChannels.GET_ANSWER, async () => {
  return currentAnswer;
});

ipcMain.handle(IPCChannels.GET_HISTORY, async () => {
  return store.get('history', []) as HistoryType[];
});

ipcMain.on(IPCChannels.OPEN_HISTORY, async () => {
  if (!historyWindow) {
    const x =
      (mainWindow?.getPosition()[0] || 0) +
      (mainWindow?.getSize()[0] || 0) +
      10;
    const y = mainWindow?.getPosition()[1] || 0;

    historyWindow = await createWindow(
      '#/history',
      () => {
        historyWindow = null;
      },
      {
        x,
        y,
      }
    );
  } else {
    historyWindow.show();
  }
});

ipcMain.on(IPCChannels.CLOSE_HISTORY, async () => {
  if (historyWindow) {
    historyWindow.close();
  }
});

ipcMain.on(IPCChannels.SET_THEME, async (event, theme) => {
  store.set('theme', theme.name);

  mainWindow?.webContents.send(IPCChannels.UPDATE_THEME, theme);
  historyWindow?.webContents.send(IPCChannels.UPDATE_THEME, theme);
});

ipcMain.handle(IPCChannels.GET_CURRENT_THEME, async () => {
  const themeName = store.get('theme', 'Blue') as string;
  return THEMES.find((t) => t.name === themeName) ?? THEMES[0];
});
