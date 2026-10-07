import clsx from 'clsx';
import Icon from '../brand/Icon';
import styles from './StoreBadge.module.css';

type Props = {label: string; caption?: string; href?: string | null};

/** Generic "coming soon" badge — not a store's official artwork. */
export default function StoreBadge({label, caption = 'Coming soon', href}: Props) {
  const body = (
    <>
      <Icon name="smartphone" size={22} />
      <span className={styles.text}>
        <span className={styles.caption}>{caption}</span>
        <span className={styles.label}>{label}</span>
      </span>
    </>
  );
  return href ? (
    <a className={styles.badge} href={href}>
      {body}
    </a>
  ) : (
    <span className={clsx(styles.badge, styles.soon)}>{body}</span>
  );
}
