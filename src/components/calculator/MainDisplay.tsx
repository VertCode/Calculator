import { BiHistory } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import styles from './MainDisplay.module.scss';
import gridStyle from '../../styles/grid.module.scss';
import { IPCChannels } from '../../utils/Constants';
import ThemeDropDown from './ThemeDropDown';
import formatNumber from '../../utils/StringUtil';

export default function MainDisplay() {
  // Current sum is always stored in the local storage, this is done so the history view can access it
  const [currentExpression, setCurrentExpression] = useState('');
  // The answer is always updated when the current sum is updated
  const [answer, setAnswer] = useState('0');

  useEffect(() => {
    return window.electron.ipcRenderer.on(
      IPCChannels.UPDATE_ANSWER,
      (event, args) => {
        const newAnswer = args as string;
        setAnswer(newAnswer);
      }
    );
  }, [currentExpression]);

  useEffect(() => {
    return window.electron.ipcRenderer.on(
      IPCChannels.UPDATE_EXPRESSION,
      (event, args) => {
        const newExpression = args as string;

        setCurrentExpression(newExpression);

        // Update Scrollbar
        const sumElement = document.getElementById('sum');
        if (sumElement) {
          // Make sure the scrollbar is at the end
          sumElement.scrollLeft = sumElement.scrollWidth;
        }
      }
    );
  }, [currentExpression]);

  return (
    <div className={styles.mainDisplay}>
      <div className={gridStyle.row}>
        <div className={`${gridStyle['col-24']} `}>
          <div className={`${gridStyle.row} ${styles.topBar}`}>
            <div className={gridStyle['col-8']} style={{ display: 'flex' }}>
              <BiHistory
                className={styles.icon}
                onClick={window.electron.calculator.openHistory}
              />
              <ThemeDropDown />
            </div>
            <div
              className={`${gridStyle['col-12']} ${styles.sum} ${styles.longText}`}
              id="sum"
            >
              {currentExpression}
            </div>
          </div>
        </div>
        <div
          className={`${gridStyle['col-24']} ${styles.sumAnswer} ${styles.longText}`}
        >
          {`${formatNumber(answer)}`}
        </div>
      </div>
    </div>
  );
}
