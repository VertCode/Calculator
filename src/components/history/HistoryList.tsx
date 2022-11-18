import { useEffect, useState } from 'react';
import gridStyle from '../../styles/grid.module.scss';
import { HistoryType, IPCChannels } from '../../utils/Constants';
import HistoryEntry from './HistoryEntry';

export default function HistoryList() {
  const [history, setHistory] = useState<HistoryType[]>([]);

  useEffect(() => {
    return window.electron.ipcRenderer.on(
      IPCChannels.UPDATE_HISTORY,
      (event, args) => {
        setHistory(args as HistoryType[]);
      }
    );
  }, [history]);

  useEffect(() => {
    window.electron.calculator
      .getHistory()
      .then((newHistory) => {
        setHistory(newHistory);
        return true;
      })
      .catch(() => {});
  }, []);

  return (
    <div className={gridStyle.row}>
      {history.reverse().map((item, index) => (
        <HistoryEntry item={item} key={`entry-${index + 1}`} />
      ))}
    </div>
  );
}
