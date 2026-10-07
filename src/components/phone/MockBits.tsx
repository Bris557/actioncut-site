import clsx from 'clsx';
import Icon from '../brand/Icon';
import Scene, {type SceneKind} from './Scene';
import styles from './MockBits.module.css';

export function LivePill() {
  return (
    <span className={styles.livePill}>
      <span className={styles.livePillDot} />
      LIVE
    </span>
  );
}

export function LiveBar({time, count}: {time: string; count: number}) {
  return (
    <div className={styles.liveBar}>
      <span className={styles.liveDot} />
      <span className={styles.liveText}>
        <span className={styles.liveTitle}>Event in progress</span>
        <span className={styles.liveSub}>
          {time} · {count === 1 ? '1 moment' : `${count} moments`}
        </span>
      </span>
      <span className={styles.liveCam}>
        <Icon name="video" />
      </span>
      <span className={styles.liveStop}>
        <Icon name="stop" />
        Stop
      </span>
    </div>
  );
}

export type MockTile = {
  kind: SceneKind;
  shift?: number;
  time: string;
  title?: string;
  /** Tag colors, shown as dots top-left. */
  tags?: string[];
  fav?: boolean;
  /** Interval length in seconds (badge bottom-right). */
  interval?: number;
  /** Custom clip window (scissors badge bottom-right). */
  cut?: boolean;
};

export function MomentTile({tile, radius}: {tile: MockTile; radius?: string}) {
  return (
    <div className={styles.tile} style={radius ? {borderRadius: radius} : undefined}>
      <Scene kind={tile.kind} shift={tile.shift} />
      {tile.tags && tile.tags.length > 0 && (
        <span className={styles.tileDots}>
          {tile.tags.map((color) => (
            <span key={color} style={{background: color}} />
          ))}
        </span>
      )}
      <Icon name="heart" className={styles.tileHeart} fill={tile.fav ? 'currentColor' : 'none'} />
      <span className={styles.tileLabel}>{tile.title ?? tile.time}</span>
      {tile.interval !== undefined && (
        <span className={styles.tileBadge}>
          <Icon name="interval" strokeWidth={2.6} />
          {tile.interval}s
        </span>
      )}
      {tile.cut && (
        <span className={clsx(styles.tileBadge, styles.tileCut)}>
          <Icon name="scissors" strokeWidth={2.2} />
        </span>
      )}
    </div>
  );
}
