import type {HeroClip} from '../lib/heroVideo';

const clip = (n: number, markAt: number): HeroClip => ({
  src: `/video/game-${n}.mp4`,
  poster: `/video/game-${n}.webp`,
  markAt,
});

/** How many clips one visit loops, picked at random from HERO_CLIPS. */
export const CLIPS_PER_VISIT = 4;

/**
 * Real ActionCut clips from kids' games (H.264, 540 × 960, 30 fps, no sound); the hero loops
 * CLIPS_PER_VISIT of them. `markAt` is the second of the key play, set by hand for each clip.
 */
export const HERO_CLIPS: HeroClip[] = [
  clip(1, 8), // 20260602_084643_moment_140
  clip(2, 10), // 20260602_112222_moment_147
  clip(3, 4), // 20261004_113431_moment_206
  clip(4, 10), // 20261004_115249_moment_218
  clip(5, 10), // 20261004_120500_moment_223
  clip(6, 15), // 20261004_123632_moment_232
  clip(7, 10), // 20261004_115840_moment_19
  clip(8, 8), // 20261004_131454_moment_35
  clip(9, 8), // 20261004_145033_moment_38
];
