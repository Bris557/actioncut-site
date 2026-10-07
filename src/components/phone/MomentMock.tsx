import {TAGS} from '@site/src/data/tags';
import {groupRadius} from '@site/src/lib/groupShape';
import Icon from '../brand/Icon';
import TagChip from '../ui/TagChip';
import Scene from './Scene';
import styles from './MomentMock.module.css';

/** Moment screen; `versions` shows the "Version 1 of 2" dots of a moment filmed from two phones. */
export default function MomentMock({versions = false}: {versions?: boolean}) {
  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <Icon name="arrowLeft" />
        <Icon name="more" />
      </div>
      <div className={styles.player}>
        <Scene kind="rink" shift={versions ? 10 : -4} players />
        <span className={styles.play}>
          <Icon name="play" />
        </span>
        <span className={styles.progress}>
          <span className={styles.time}>0:04</span>
          <span className={styles.track}>
            <span />
          </span>
          <span className={styles.time}>0:07</span>
        </span>
      </div>
      {versions && (
        <div className={styles.versions}>
          <span className={styles.dots}>
            <span className={styles.dotOn} />
            <span />
          </span>
          <span>Version 1 of 2 · from another video</span>
        </div>
      )}
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <span className={styles.title}>First goal</span>
          <Icon name="pencil" className={styles.pencil} />
        </div>
        <div className={styles.sub}>15:10:07 · Oct 4</div>
        <div className={styles.tags}>
          <TagChip name="Goal" color={TAGS.goal.color} ink={TAGS.goal.ink} on />
          <span className={styles.addTag}>
            <Icon name="plus" />
            Tag
          </span>
        </div>
        <div className={styles.rows}>
          <div className={styles.row} style={{borderRadius: groupRadius(0, 2)}}>
            <Icon name="scissors" className={styles.rowIcon} />
            <span className={styles.rowText}>
              <span className={styles.rowTitle}>Clip: 5 s before · 2 s after</span>
              <span className={styles.rowSub}>Event default</span>
            </span>
            <span className={styles.rowAction}>Customize</span>
          </div>
          <div className={styles.row} style={{borderRadius: groupRadius(1, 2)}}>
            <Icon name="video" className={styles.rowIcon} />
            <span className={styles.rowText}>
              <span className={styles.rowTitle}>Source video</span>
              <span className={styles.rowSub}>
                {versions ? 'PXL_20261004_150951.mp4 · 00:09 in video' : 'VID_20261004_150958.mp4 · 01:12 in video'}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span className={styles.toolbar}>
          <Icon name="chevronLeft" />
          <span className={styles.counter}>1/12</span>
          <Icon name="chevronRight" />
          <span className={styles.divider} />
          <span className={styles.heart}>
            <Icon name="heart" fill="currentColor" />
          </span>
          <Icon name="share" />
        </span>
        <span className={styles.save}>
          <Icon name="download" />
          Save
        </span>
      </div>
    </div>
  );
}
