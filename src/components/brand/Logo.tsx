import Icon from './Icon';
import styles from './Logo.module.css';

export default function Logo() {
  return (
    <span className={styles.logo}>
      <span className={styles.badge}>
        <Icon name="crosshair" size={22} />
      </span>
      <span>ActionCut</span>
    </span>
  );
}
