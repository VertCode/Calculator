import { GrFormClose } from 'react-icons/gr';
import styles from './HistoryTopDisplay.module.scss';

export default function HistoryTopDisplay() {
  const handleClose = () => window.electron.calculator.closeHistory();

  return (
    <div className={styles.content}>
      <h1>History</h1>
      <GrFormClose onClick={handleClose} />
    </div>
  );
}
