import { IoMdColorPalette } from 'react-icons/io';
import styles from './MainDisplay.module.scss';
import { Theme, THEMES } from '../../utils/Constants';

export default function ThemeDropDown() {
  const onClick = (theme: Theme) => {
    window.electron.theme.setTheme(theme);
  };

  // Should be a navigation dropdown
  return (
    <div className={styles.dropdown}>
      <IoMdColorPalette className={styles.icon} />
      <div className={styles.dropdownItems}>
        {THEMES.map((theme) => (
          <button
            className={styles.dropdownItem}
            type="button"
            onClick={() => onClick(theme)}
            key={theme.name}
          >
            <div
              className={styles.themePreview}
              style={{
                background: `linear-gradient(180deg, ${theme.backgroundColor.top} 0%, ${theme.backgroundColor.bottom} 100%) no-repeat`,
              }}
            />
            <p>{theme.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
