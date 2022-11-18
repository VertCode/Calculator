import { CSSProperties, ReactNode, useEffect, useState } from 'react';
import { IPCChannels, Theme, THEMES } from '../utils/Constants';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(THEMES[0]);

  useEffect(() => {
    window.electron.theme
      .getCurrentTheme()
      .then((newTheme: Theme) => {
        setTheme(newTheme);
        return true;
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    return window.electron.ipcRenderer.on(
      IPCChannels.UPDATE_THEME,
      (event, args) => {
        const newTheme = args as Theme;
        setTheme(newTheme);
      }
    );
  }, [theme]);

  const style: CSSProperties = {
    width: '100%',
    minHeight: '100vh',
    height: '100%',
    boxSizing: 'border-box',
    padding: '.5rem',
    backgroundImage: `linear-gradient(180deg, ${theme.backgroundColor.top} 0%, ${theme.backgroundColor.bottom} 100%)`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100vh',
    backgroundAttachment: 'fixed',
  };

  return <div style={style}>{children}</div>;
}
