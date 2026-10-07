import clsx from 'clsx';
import type {CSSProperties} from 'react';
import styles from './Scene.module.css';

export type SceneKind = 'rink' | 'pitch' | 'gym';

type Props = {
  kind: SceneKind;
  orientation?: 'vertical' | 'horizontal';
  players?: boolean;
  /** Moves the lines sideways (% of width) so neighbouring tiles differ. */
  shift?: number;
  className?: string;
};

export default function Scene({kind, orientation = 'vertical', players = false, shift = 0, className}: Props) {
  return (
    <div
      className={clsx(styles.scene, styles[kind], orientation === 'horizontal' && styles.horizontal, className)}
      style={{'--shift': `${shift}%`} as CSSProperties}
      aria-hidden="true">
      <span className={clsx(styles.line, styles.l1)} />
      <span className={clsx(styles.line, styles.mid)} />
      <span className={clsx(styles.line, styles.l2)} />
      <span className={styles.circle} />
      {players && (
        <>
          <span className={clsx(styles.player, styles.p1)} />
          <span className={clsx(styles.player, styles.p2)} />
          <span className={clsx(styles.player, styles.p3)} />
          <span className={styles.ball} />
        </>
      )}
    </div>
  );
}
