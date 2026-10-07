import {describe, expect, it} from 'vitest';
import {formatClock, heroFrame} from './heroLoop';

describe('heroFrame — the looping "tap at a goal" in the hero phone', () => {
  it('starts idle with 5 moments', () => {
    expect(heroFrame(0)).toMatchObject({count: 5, hot: false, chipsVisible: false, goalOn: false});
  });

  it('marks on step 1: red button, one more moment, quick tags open', () => {
    expect(heroFrame(1)).toMatchObject({count: 6, hot: true, chipsVisible: true, goalOn: false, countdown: 1});
  });

  it('tags Goal on step 3 and closes the tags after step 4', () => {
    expect(heroFrame(3)).toMatchObject({goalOn: true, chipsVisible: true});
    expect(heroFrame(5)).toMatchObject({chipsVisible: false, goalOn: false, countdown: 0});
  });

  it('keeps counting across loops and stops at 99', () => {
    expect(heroFrame(6).count).toBe(6);
    expect(heroFrame(7).count).toBe(7);
    expect(heroFrame(6 * 200).count).toBe(99);
  });

  it('advances the recording clock', () => {
    expect(heroFrame(0).recSeconds).toBe(84);
    expect(heroFrame(10).recSeconds).toBe(95);
  });
});

describe('formatClock', () => {
  it('pads minutes and seconds', () => {
    expect(formatClock(84)).toBe('01:24');
    expect(formatClock(5)).toBe('00:05');
    expect(formatClock(3600)).toBe('60:00');
  });
});
