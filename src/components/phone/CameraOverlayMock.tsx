import useBaseUrl from '@docusaurus/useBaseUrl';
import clsx from 'clsx';
import {AnimatePresence, motion} from 'motion/react';
import type {ReactNode} from 'react';
import type {TagInfo} from '@site/src/data/tags';
import Icon from '../brand/Icon';
import TagChip from '../ui/TagChip';
import styles from './CameraOverlayMock.module.css';

export type QuickChip = TagInfo & {on: boolean};

type Props = {
  count: number;
  recTime: string;
  /** A real camera frame (9:16) under static/, shown in the viewfinder. */
  photo: string;
  /** Load the photo right away (the hero is above the fold). */
  eager?: boolean;
  /** Red "just marked" state of the button. */
  hot?: boolean;
  chips?: QuickChip[];
  chipsVisible?: boolean;
  /** Share of the 5-s quick-tag window left, 1 → 0. */
  countdown?: number;
  /** Drawn over the photo in the viewfinder, e.g. game videos. */
  children?: ReactNode;
};

const ZOOM = ['0.6', '1×', '2', '3', '6'];
const MODES = ['MASTER', 'VIDEO', 'PHOTO', 'PORTRAIT'];

/** The phone's own camera app in video mode, drawn after a real Android camera; the timer shows it's recording. */
function CameraChrome({recTime}: {recTime: string}) {
  return (
    <>
      <span className={styles.privacyDot} />
      <span className={clsx(styles.pill, styles.pillLeft)}>
        <svg viewBox="0 0 24 24" className={styles.roundIcon}>
          <circle cx="12" cy="12" r="10.5" />
          <path d="M13 5.5 8.5 13H12l-1 5.5L15.5 11H12z" />
          <path d="m5 5 14 14" />
        </svg>
        <svg viewBox="0 0 24 24" className={styles.roundIcon}>
          <circle cx="12" cy="12" r="10.5" />
          <path d="M9.5 7.5a5 5 0 1 0 5 8.5M14 6.5a5 5 0 0 1 1.5 6" />
          <path d="m5 5 14 14" />
        </svg>
        <span className={styles.ev}>
          <small>EV</small>0.0
        </span>
      </span>
      <span className={styles.rec}>
        <span className={styles.recDot} />
        {recTime}
      </span>
      <span className={clsx(styles.pill, styles.pillRight)}>1080·60</span>
      <span className={clsx(styles.round, styles.more)}>
        <svg viewBox="0 0 24 24">
          {[6, 12, 18].flatMap((y) => [6, 12, 18].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.9" />))}
        </svg>
      </span>

      <span className={clsx(styles.round, styles.beauty)}>
        <svg viewBox="0 0 24 24" className={styles.lineIcon}>
          <path d="M6 19v-5.5a6 6 0 0 1 9.5-4.9M6 13.5c2.5 0 4.5-1.5 5.5-3.5M11 19v-3a3 3 0 0 1 6 0" />
          <path d="M18 3.5v4M16 5.5h4" />
        </svg>
      </span>
      <span className={styles.zoom}>
        {ZOOM.map((z) => (
          <span key={z} className={clsx(styles.zoomStep, z === '1×' && styles.zoomOn)}>
            {z}
          </span>
        ))}
      </span>
      <span className={clsx(styles.round, styles.filters)}>
        <svg viewBox="0 0 24 24" className={styles.lineIcon}>
          <circle cx="12" cy="8.5" r="5" />
          <circle cx="8.5" cy="14.5" r="5" />
          <circle cx="15.5" cy="14.5" r="5" />
        </svg>
      </span>

      <span className={styles.thumb} />
      <span className={styles.shutter} />

      <span className={styles.modes}>
        {MODES.map((m) => (
          <span key={m} className={clsx(styles.mode, m === 'VIDEO' && styles.modeOn)}>
            {m}
          </span>
        ))}
      </span>
      <span className={styles.homeBar} />
    </>
  );
}

export default function CameraOverlayMock({
  count,
  recTime,
  photo,
  eager = false,
  hot = false,
  chips = [],
  chipsVisible = false,
  countdown = 1,
  children,
}: Props) {
  const photoUrl = useBaseUrl(photo);
  return (
    <div className={styles.root}>
      <div className={styles.viewfinder}>
        <img
          src={photoUrl}
          alt=""
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          className={styles.photo}
        />
        {children}
        <span className={styles.grid} />
      </div>
      <CameraChrome recTime={recTime} />

      {/* ActionCut's floating button, where it sits on the real phone: right of the shutter. */}
      <div className={clsx(styles.button, hot && styles.hot)}>
        <Icon name="crosshair" className={styles.crosshair} />
        {count > 0 && <span className={styles.badge}>{count > 99 ? '99+' : count}</span>}
      </div>
      <AnimatePresence>
        {chipsVisible && (
          <motion.div
            className={styles.chips}
            initial={{opacity: 0, x: 12}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: 12, transition: {duration: 0.15}}}
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
                <TagChip
                  tone="overlay"
                  name={chip.name}
                  color={chip.color}
                  ink={chip.ink}
                  on={chip.on}
                  className={styles.chip}
                />
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
