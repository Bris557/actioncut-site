import clsx from 'clsx';
import {site} from '@site/src/data/site';
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

/** ActionCut is coming to both stores: Google Play for Android, the App Store for iPhone. */
export function StoreBadges() {
  return (
    <>
      <StoreBadge label="Google Play" href={site.googlePlayUrl} />
      <StoreBadge label="App Store" href={site.appStoreUrl} />
    </>
  );
}
