import type {ReactNode} from 'react';
import Icon from '../brand/Icon';
import PhoneFrame from './PhoneFrame';
import Shot from './Shot';
import styles from './Screen.module.css';

type Props = {
  /** Path under static/, e.g. '/img/screens/event.webp'. */
  src?: string;
  name: string;
  caption?: string;
  platform?: 'android' | 'iphone';
  /** A drawn screen shown when there is no screenshot, e.g. the overlay over the camera app. */
  fallback?: ReactNode;
};

export default function Screen({src, name, caption, platform = 'android', fallback}: Props) {
  let body: ReactNode;
  if (src) {
    body = <Shot src={src} />;
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
