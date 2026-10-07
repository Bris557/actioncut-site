import clsx from 'clsx';
import type {ReactNode} from 'react';
import styles from './PhoneFrame.module.css';

type Props = {
  children: ReactNode;
  /** What the screen shows, for screen readers (the mock itself is decorative). */
  label: string;
  platform?: 'android' | 'iphone';
  className?: string;
};

export default function PhoneFrame({children, label, platform = 'android', className}: Props) {
  return (
    <div className={clsx(styles.frame, styles[platform], className)} role="img" aria-label={label}>
      <div className={styles.screen}>
        <div className={styles.content}>{children}</div>
      </div>
      <span className={styles.camera} aria-hidden="true" />
    </div>
  );
}
