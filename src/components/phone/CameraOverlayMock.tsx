import clsx from 'clsx';
import {AnimatePresence, motion} from 'motion/react';
import type {TagInfo} from '@site/src/data/tags';
import Icon from '../brand/Icon';
import TagChip from '../ui/TagChip';
import Scene, {type SceneKind} from './Scene';
import styles from './CameraOverlayMock.module.css';

export type QuickChip = TagInfo & {on: boolean};

type Props = {
  count: number;
  recTime: string;
  scene?: SceneKind;
  /** Red "just marked" state of the button. */
  hot?: boolean;
  chips?: QuickChip[];
  chipsVisible?: boolean;
  /** Share of the 5-s quick-tag window left, 1 → 0. */
  countdown?: number;
};

export default function CameraOverlayMock({
  count,
  recTime,
  scene = 'rink',
  hot = false,
  chips = [],
  chipsVisible = false,
  countdown = 1,
}: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.viewfinder}>
        <Scene kind={scene} orientation="horizontal" players />
      </div>
      <span className={styles.rec}>
        <span className={styles.recDot} />
        {recTime}
      </span>
      <span className={styles.shutter}>
        <span />
      </span>
      <div className={clsx(styles.button, hot && styles.hot)}>
        <Icon name="crosshair" className={styles.crosshair} />
        <span className={styles.badge}>{count > 99 ? '99+' : count}</span>
      </div>
      <AnimatePresence>
        {chipsVisible && (
          <motion.div
            className={styles.chips}
            initial={{opacity: 0, x: 12}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: 12}}
            transition={{type: 'spring', stiffness: 420, damping: 30}}>
            <span className={styles.timer}>
              <span style={{transform: `scaleX(${countdown})`}} />
            </span>
            {chips.map((chip, i) => (
              <motion.span
                key={chip.name}
                initial={{scale: 0.4, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{type: 'spring', stiffness: 500, damping: 26, delay: 0.05 * i}}>
                <TagChip tone="overlay" name={chip.name} color={chip.color} ink={chip.ink} on={chip.on} />
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
