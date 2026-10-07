import type {HeroFrame} from './heroLoop';

export type HeroClip = {
  /** Paths under static/. */
  src: string;
  poster: string;
};

/** In ActionCut's clips the play sits about two-thirds in: that's where the parent taps. */
export const MARK_SHARE = 2 / 3;

/** `n` different items in random order; `random` returns [0, 1) like Math.random. */
export function pickClips<T>(all: readonly T[], n: number, random: () => number): T[] {
  const pool = [...all];
  const picked: T[] = [];
  while (picked.length < n && pool.length > 0) {
    const i = Math.min(pool.length - 1, Math.floor(random() * pool.length));
    picked.push(pool.splice(i, 1)[0]);
  }
  return picked;
}

const HOT_S = 1;
const GOAL_S = 2;
/** Quick tags stay beside the button for 5 s in the app. */
const TAGS_S = 5;

export type MarkOverlay = Pick<HeroFrame, 'hot' | 'chipsVisible' | 'goalOn' | 'countdown'>;

/** The button and quick tags `sinceMark` seconds after a tap; `null` before any. */
export function overlayAfterMark(sinceMark: number | null): MarkOverlay {
  if (sinceMark === null || sinceMark < 0 || sinceMark >= TAGS_S) {
    return {hot: false, chipsVisible: false, goalOn: false, countdown: 0};
  }
  return {
    hot: sinceMark < HOT_S,
    chipsVisible: true,
    goalOn: sinceMark >= GOAL_S,
    countdown: 1 - sinceMark / TAGS_S,
  };
}
