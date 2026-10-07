import useBaseUrl from '@docusaurus/useBaseUrl';
import clsx from 'clsx';
import {CAMERA_PHOTOS} from '@site/src/data/camera';
import {QUICK_TAGS} from '@site/src/data/tags';
import Icon from '../brand/Icon';
import TagChip from '../ui/TagChip';
import styles from './IphoneLiveMock.module.css';

/** Concept of the iOS Live Activity "Event in progress" (iOS spec D13). */
export default function IphoneLiveMock() {
  const wallpaper = useBaseUrl(CAMERA_PHOTOS.lockScreen);
  return (
    <div className={styles.root}>
      <div className={styles.wallpaper}>
        <img src={wallpaper} alt="" loading="lazy" decoding="async" draggable={false} />
      </div>
      <div className={styles.date}>Saturday, October 10</div>
      <div className={styles.clock}>10:24</div>
      <div className={styles.activity}>
        <div className={styles.head}>
          <span className={styles.badge}>
            <Icon name="crosshair" />
          </span>
          <span className={styles.headText}>
            <span className={styles.headTitle}>Event in progress</span>
            <span className={styles.headSub}>Semi-final · 9 moments</span>
          </span>
          <span className={styles.timer}>45:12</span>
        </div>
        <div className={styles.buttons}>
          <span className={styles.mark}>
            <Icon name="crosshair" />
            Mark
          </span>
          <span className={styles.interval}>
            <Icon name="interval" />
            Interval
          </span>
        </div>
        <div className={styles.chips}>
          {QUICK_TAGS.map((t) => (
            <TagChip key={t.name} tone="overlay" name={t.name} color={t.color} />
          ))}
        </div>
      </div>
      <span className={clsx(styles.corner, styles.cornerLeft)}>
        <Icon name="zap" />
      </span>
      <span className={clsx(styles.corner, styles.cornerRight)}>
        <Icon name="video" />
      </span>
    </div>
  );
}
