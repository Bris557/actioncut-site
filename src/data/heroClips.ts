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
 * CLIPS_PER_VISIT of them. `markAt` is the second of the key play: each clip is trimmed so the play lands about 6 s in.
 */
export const HERO_CLIPS: HeroClip[] = [
  clip(1, 6), // 20260602_084643_moment_140, first 2 s cut
  clip(2, 6), // 20260602_112222_moment_147, first 4 s cut
  clip(3, 4), // 20261004_113431_moment_206, uncut: the play is already at 4 s
  clip(4, 6), // 20261004_115249_moment_218, first 4 s cut
  clip(5, 6), // 20261004_120500_moment_223, first 4 s cut
  clip(6, 6), // 20261004_123632_moment_232, first 9 s cut
  clip(7, 6), // 20261004_115840_moment_19, first 4 s cut
  clip(8, 6), // 20261004_131454_moment_35, first 2 s cut
  clip(9, 6), // 20261004_145033_moment_38, first 2 s cut
];
