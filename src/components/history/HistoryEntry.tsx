import gridStyle from '../../styles/grid.module.scss';
import styles from './HistoryEntry.module.scss';
import { HistoryType } from '../../utils/Constants';
import formatNumber from '../../utils/StringUtil';

export default function HistoryEntry({ item }: { item: HistoryType }) {
  const onClick = async () => {
    await window.electron.calculator.setExpression(item.expression);
    await window.electron.calculator.calculate(false);
  };

  return (
    <button
      type="button"
      className={`${gridStyle['col-24']} ${styles.entry}`}
      onClick={onClick}
    >
      <div className={styles.wrapper}>
        <p>{item.expression}</p>
        <h1>{formatNumber(item.result)}</h1>
      </div>
    </button>
  );
}
