export type HeroFrame = {
  count: number;
  hot: boolean;
  chipsVisible: boolean;
  goalOn: boolean;
  /** Share of the quick-tag window left, 1 → 0. */
  countdown: number;
  recSeconds: number;
};

const LOOP = 6;

/** One frame of the hero animation; `step` grows by one every ~1.1 s. */
export function heroFrame(step: number): HeroFrame {
  const phase = step % LOOP;
  const loops = Math.floor(step / LOOP);
  const open = phase >= 1 && phase <= 4;
  return {
    count: Math.min(99, 5 + loops + (phase >= 1 ? 1 : 0)),
    hot: phase === 1,
    chipsVisible: open,
    goalOn: phase >= 3 && phase <= 4,
    countdown: open ? 1 - (phase - 1) / 4 : 0,
    recSeconds: 84 + Math.floor(step * 1.1),
  };
}

export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
