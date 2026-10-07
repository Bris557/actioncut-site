import {describe, expect, it} from 'vitest';
import {overlayAfterMark, pickClips} from './heroVideo';

/** A fixed sequence standing in for Math.random. */
function sequence(...values: number[]) {
  let i = 0;
  return () => values[i++ % values.length];
}

describe('pickClips — the hero’s random set of game clips', () => {
  const all = ['a', 'b', 'c', 'd', 'e', 'f'];

  it('picks the asked number of different clips', () => {
    const picked = pickClips(all, 3, Math.random);
    expect(picked).toHaveLength(3);
    expect(new Set(picked).size).toBe(3);
    for (const clip of picked) expect(all).toContain(clip);
  });

  it('follows the random source, without repeats', () => {
    // 0.99 → last of 6 ('f'), 0 → first of the remaining 5 ('a'), 0.5 → middle of 4 ('d').
    expect(pickClips(all, 3, sequence(0.99, 0, 0.5))).toEqual(['f', 'a', 'd']);
  });

  it('returns every clip when asked for more than there are', () => {
    expect(pickClips(['a', 'b'], 3, sequence(0)).sort()).toEqual(['a', 'b']);
  });

  it('leaves the list it picks from unchanged', () => {
    const copy = [...all];
    pickClips(all, 3, Math.random);
    expect(all).toEqual(copy);
  });
});

describe('overlayAfterMark — the button and quick tags around a tap on the video', () => {
  it('is idle before the tap', () => {
    expect(overlayAfterMark(null)).toEqual({hot: false, chipsVisible: false, goalOn: false, countdown: 0});
  });

  it('turns red and opens the quick tags right at the tap', () => {
    expect(overlayAfterMark(0)).toEqual({hot: true, chipsVisible: true, goalOn: false, countdown: 1});
  });

  it('tags Goal two seconds in and counts the five-second window down', () => {
    const later = overlayAfterMark(2.5);
    expect(later).toMatchObject({hot: false, chipsVisible: true, goalOn: true});
    expect(later.countdown).toBeCloseTo(0.5);
  });

  it('closes the quick tags after five seconds, as the app does', () => {
    expect(overlayAfterMark(5)).toEqual({hot: false, chipsVisible: false, goalOn: false, countdown: 0});
  });
});
