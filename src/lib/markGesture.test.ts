import {describe, expect, it} from 'vitest';
import {
  HOLD_THRESHOLD_MS,
  MAX_MARKS,
  QUICK_TAGS_MS,
  TRACK_MS,
  clipSeconds,
  demoReducer,
  describeMark,
  formatClipLength,
  initialDemoState,
  isHolding,
  quickTagsMark,
  quickTagsRemaining,
  trackPosition,
  type DemoEvent,
  type DemoState,
} from './markGesture';

const run = (events: DemoEvent[], from: DemoState = initialDemoState) => events.reduce(demoReducer, from);

describe('tap and hold', () => {
  it('a short press marks an instant at the press time and opens quick tags for 5 s', () => {
    const s = run([{type: 'press', at: 1000}, {type: 'release', at: 1200}]);
    expect(s.marks).toEqual([{id: 1, kind: 'instant', start: 1000, end: 1000, tags: []}]);
    expect(s.pressedAt).toBeNull();
    expect(s.quickTagsFor).toBe(1);
    expect(s.quickTagsUntil).toBe(1200 + QUICK_TAGS_MS);
  });

  it('499 ms is still an instant, 500 ms is an interval', () => {
    expect(run([{type: 'press', at: 0}, {type: 'release', at: HOLD_THRESHOLD_MS - 1}]).marks[0].kind).toBe('instant');
    expect(run([{type: 'press', at: 0}, {type: 'release', at: HOLD_THRESHOLD_MS}]).marks[0].kind).toBe('interval');
  });

  it('holding opens an interval on the first tick past 500 ms and release closes it', () => {
    const held = run([{type: 'press', at: 0}, {type: 'tick', at: 600}]);
    expect(isHolding(held)).toBe(true);
    expect(held.marks).toEqual([{id: 1, kind: 'interval', start: 0, end: null, tags: []}]);

    const done = run([{type: 'release', at: 4000}], held);
    expect(isHolding(done)).toBe(false);
    expect(done.marks).toEqual([{id: 1, kind: 'interval', start: 0, end: 4000, tags: []}]);
    expect(done.quickTagsFor).toBe(1);
    expect(done.quickTagsUntil).toBe(4000 + QUICK_TAGS_MS);
  });

  it('a tick before 500 ms does not open an interval', () => {
    expect(run([{type: 'press', at: 0}, {type: 'tick', at: 300}]).marks).toEqual([]);
  });

  it('ignores a second press while pressed and a release without a press', () => {
    const s = run([{type: 'press', at: 0}, {type: 'press', at: 100}, {type: 'release', at: 200}, {type: 'release', at: 300}]);
    expect(s.marks).toHaveLength(1);
    expect(s.marks[0].start).toBe(0);
  });
});

describe('cancel (finger slid off, browser took over)', () => {
  it('a short cancelled press leaves no mark', () => {
    const s = run([{type: 'press', at: 0}, {type: 'cancel', at: 200}]);
    expect(s.marks).toEqual([]);
    expect(s.pressedAt).toBeNull();
  });

  it('a cancelled hold closes the interval instead of leaving it stuck', () => {
    const s = run([{type: 'press', at: 0}, {type: 'tick', at: 700}, {type: 'cancel', at: 2500}]);
    expect(isHolding(s)).toBe(false);
    expect(s.marks[0]).toMatchObject({kind: 'interval', start: 0, end: 2500});
  });
});

describe('quick tags', () => {
  const marked = run([{type: 'press', at: 0}, {type: 'release', at: 100}]);

  it('toggles a tag on the last mark while the window is open', () => {
    const on = run([{type: 'toggleTag', tag: 'Goal', at: 1000}], marked);
    expect(on.marks[0].tags).toEqual(['Goal']);
    const off = run([{type: 'toggleTag', tag: 'Goal', at: 2000}], on);
    expect(off.marks[0].tags).toEqual([]);
  });

  it('ignores taps after the window closed', () => {
    const late = run([{type: 'toggleTag', tag: 'Goal', at: 100 + QUICK_TAGS_MS}], marked);
    expect(late.marks[0].tags).toEqual([]);
  });

  it('closes on the first tick at the deadline', () => {
    const closed = run([{type: 'tick', at: 100 + QUICK_TAGS_MS}], marked);
    expect(closed.quickTagsFor).toBeNull();
    expect(quickTagsMark(closed)).toBeNull();
  });

  it('moves to the newest mark', () => {
    const second = run([{type: 'press', at: 1000}, {type: 'release', at: 1100}], marked);
    expect(quickTagsMark(second)?.id).toBe(2);
    const tagged = run([{type: 'toggleTag', tag: 'Save', at: 1200}], second);
    expect(tagged.marks[0].tags).toEqual([]);
    expect(tagged.marks[1].tags).toEqual(['Save']);
  });

  it('reports the remaining share of the window', () => {
    expect(quickTagsRemaining(marked, 100)).toBe(1);
    expect(quickTagsRemaining(marked, 100 + QUICK_TAGS_MS / 2)).toBe(0.5);
    expect(quickTagsRemaining(marked, 100 + QUICK_TAGS_MS * 2)).toBe(0);
    expect(quickTagsRemaining(initialDemoState, 0)).toBe(0);
  });
});

describe('limits and reset', () => {
  it(`keeps only the last ${MAX_MARKS} marks`, () => {
    const events: DemoEvent[] = [];
    for (let i = 0; i < MAX_MARKS + 3; i++) {
      events.push({type: 'press', at: i * 1000}, {type: 'release', at: i * 1000 + 100});
    }
    const s = run(events);
    expect(s.marks).toHaveLength(MAX_MARKS);
    expect(s.marks[0].id).toBe(4);
    expect(s.marks[MAX_MARKS - 1].id).toBe(MAX_MARKS + 3);
  });

  it('reset returns to the initial state', () => {
    expect(run([{type: 'press', at: 0}, {type: 'release', at: 10}, {type: 'reset'}])).toEqual(initialDemoState);
  });
});

describe('derived values', () => {
  it('clip length follows the app defaults: 5+2 s for instants, 3+hold+3 s for intervals', () => {
    expect(clipSeconds({id: 1, kind: 'instant', start: 0, end: 0, tags: []})).toBe(7);
    expect(clipSeconds({id: 2, kind: 'interval', start: 0, end: 4000, tags: []})).toBe(10);
    expect(clipSeconds({id: 3, kind: 'interval', start: 0, end: null, tags: []})).toBe(6);
  });

  it('formats clip lengths as m:ss', () => {
    expect(formatClipLength(7)).toBe('0:07');
    expect(formatClipLength(75)).toBe('1:15');
  });

  it('places marks on a 2-minute track that wraps', () => {
    expect(trackPosition(1000, 1000)).toBe(0);
    expect(trackPosition(1000 + TRACK_MS / 4, 1000)).toBe(0.25);
    expect(trackPosition(1000 + TRACK_MS + TRACK_MS / 2, 1000)).toBe(0.5);
    expect(trackPosition(0, 1000)).toBe(0);
  });

  it('describes marks for screen readers', () => {
    expect(describeMark({id: 1, kind: 'instant', start: 0, end: 0, tags: []})).toBe('Moment marked · Instant');
    expect(describeMark({id: 2, kind: 'interval', start: 0, end: 4200, tags: []})).toBe('Moment marked · Interval · 4 s');
    expect(describeMark({id: 3, kind: 'interval', start: 0, end: 300, tags: []})).toBe('Moment marked · Interval · 1 s');
  });
});
