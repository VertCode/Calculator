import gridStyle from '../../../styles/grid.module.scss';
import styles from './Button.module.scss';

export default function Button({
  text,
  size,
  action,
}: {
  text: string;
  size: number;
  action: () => void;
}) {
  return (
    <button
      type="button"
      className={`${gridStyle[`col-${size * 6}`]} ${styles.removeButton}`}
      style={{
        padding: '.5rem',
      }}
      onClick={action}
    >
      <div className={styles.button}>{text}</div>
    </button>
  );
}
