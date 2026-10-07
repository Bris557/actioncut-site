import useBaseUrl from '@docusaurus/useBaseUrl';
import type {ReactNode} from 'react';
import Icon from '../brand/Icon';
import PhoneFrame from './PhoneFrame';
import styles from './Screen.module.css';

type Props = {
  /** Path under static/, e.g. '/img/screens/event.png'. */
  src?: string;
  name: string;
  caption?: string;
  platform?: 'android' | 'iphone';
  /** Shown instead of the placeholder while there is no screenshot. */
  fallback?: ReactNode;
};

export default function Screen({src, name, caption, platform = 'android', fallback}: Props) {
  const url = useBaseUrl(src ?? '/');
  let body: ReactNode;
  if (src) {
    body = <img src={url} alt="" loading="lazy" decoding="async" className={styles.img} />;
  } else if (fallback) {
    body = fallback;
  } else {
    body = (
      <div className={styles.placeholder}>
        <Icon name="crosshair" className={styles.placeholderIcon} />
        <span>Screenshot: {name}</span>
      </div>
    );
  }
  return (
    <figure className={styles.figure}>
      <PhoneFrame platform={platform} label={caption ?? name}>
        {body}
      </PhoneFrame>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
