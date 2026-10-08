import type {HeroClip} from '../lib/heroVideo';

/**
 * `video`/`poster` are the first 8 hex of each file's MD5 (`npm test` checks them): the files keep
 * their names, and Cloudflare caches them for a year, so a re-cut needs a new URL to show up.
 */
const clip = (n: number, markAt: number, version: {video: string; poster: string}): HeroClip => ({
  src: `/video/game-${n}.mp4?v=${version.video}`,
  poster: `/video/game-${n}.webp?v=${version.poster}`,
  markAt,
});

/** How many clips one visit loops, picked at random from HERO_CLIPS. */
export const CLIPS_PER_VISIT = 4;

/**
 * Real ActionCut clips from kids' games (H.264, 540 × 960, 30 fps, no sound); the hero loops
 * CLIPS_PER_VISIT of them. `markAt` is the second of the key play: each clip keeps 6 s before it and at most 4 s after (10 s at most).
 */
export const HERO_CLIPS: HeroClip[] = [
  clip(1, 6, {video: '2998c50c', poster: '44126424'}), // 20260602_084643_moment_140
  clip(2, 6, {video: 'a889728e', poster: 'd6124116'}), // 20260602_112222_moment_147
  clip(3, 4, {video: '52d97b47', poster: '857e55ea'}), // 20261004_113431_moment_206: the play is already at 4 s
  clip(4, 6, {video: 'b50a9c50', poster: '13d766db'}), // 20261004_115249_moment_218
  clip(5, 6, {video: 'eb21eaba', poster: '29ffad06'}), // 20261004_120500_moment_223
  clip(6, 6, {video: 'c2992ee2', poster: '1e6b5b1c'}), // 20261004_123632_moment_232
  clip(7, 6, {video: '76ce9396', poster: '10ceb917'}), // 20261004_115840_moment_19
  clip(8, 6, {video: 'c56b8503', poster: 'f7e0971b'}), // 20261004_131454_moment_35
  clip(9, 6, {video: '61ddc866', poster: '89550ca0'}), // 20261004_145033_moment_38
];
