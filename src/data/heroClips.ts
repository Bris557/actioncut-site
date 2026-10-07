import type {HeroClip} from '../lib/heroVideo';

/** Real ActionCut clips from kids' games (H.264, 540 × 960, 30 fps, no sound); the hero loops three, picked at random. */
export const HERO_CLIPS: HeroClip[] = [1, 2, 3, 4, 5].map((n) => ({
  src: `/video/game-${n}.mp4`,
  poster: `/video/game-${n}.webp`,
}));
