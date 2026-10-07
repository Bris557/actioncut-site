/**
 * Rules of the floating button, as in the Android app (OverlayService, QuickTagsPopup):
 * tap = Instant, hold ≥ 500 ms = Interval until release, quick tags for 5 s after a mark.
 */
export const HOLD_THRESHOLD_MS = 500;
export const QUICK_TAGS_MS = 5000;
export const MAX_MARKS = 12;
export const TRACK_MS = 120_000;

const INSTANT_BEFORE_S = 5;
const INSTANT_AFTER_S = 2;
const INTERVAL_BEFORE_S = 3;
const INTERVAL_AFTER_S = 3;

export type MarkKind = 'instant' | 'interval';

export type Mark = {
  id: number;
  kind: MarkKind;
  /** Press time, ms. */
  start: number;
  /** Release time, ms; equals `start` for instants; null while an interval is held. */
  end: number | null;
  tags: string[];
};

export type DemoState = {
  pressedAt: number | null;
  marks: Mark[];
  nextId: number;
  quickTagsFor: number | null;
  quickTagsUntil: number | null;
};

export type DemoEvent =
  | {type: 'press'; at: number}
  | {type: 'release'; at: number}
  | {type: 'cancel'; at: number}
  | {type: 'tick'; at: number}
  | {type: 'toggleTag'; tag: string; at: number}
  | {type: 'reset'};

export const initialDemoState: DemoState = {
  pressedAt: null,
  marks: [],
  nextId: 1,
  quickTagsFor: null,
  quickTagsUntil: null,
};

function openInterval(state: DemoState): Mark | undefined {
  return state.marks.find((m) => m.kind === 'interval' && m.end === null);
}

function addMark(state: DemoState, mark: Omit<Mark, 'id' | 'tags'>): [DemoState, number] {
  const id = state.nextId;
  const marks = [...state.marks, {...mark, id, tags: []}].slice(-MAX_MARKS);
  return [{...state, marks, nextId: id + 1}, id];
}

function openQuickTags(state: DemoState, markId: number, at: number): DemoState {
  return {...state, quickTagsFor: markId, quickTagsUntil: at + QUICK_TAGS_MS};
}

function startIntervalIfHeld(state: DemoState, at: number): DemoState {
  if (state.pressedAt === null || at - state.pressedAt < HOLD_THRESHOLD_MS || openInterval(state)) {
    return state;
  }
  return addMark(state, {kind: 'interval', start: state.pressedAt, end: null})[0];
}

function closeExpiredQuickTags(state: DemoState, at: number): DemoState {
  if (state.quickTagsUntil !== null && at >= state.quickTagsUntil) {
    return {...state, quickTagsFor: null, quickTagsUntil: null};
  }
  return state;
}

function finishPress(state: DemoState, at: number, cancelled: boolean): DemoState {
  if (state.pressedAt === null) return state;
  const pressedAt = state.pressedAt;
  const released: DemoState = {...state, pressedAt: null};

  if (at - pressedAt < HOLD_THRESHOLD_MS) {
    if (cancelled) return released;
    const [next, id] = addMark(released, {kind: 'instant', start: pressedAt, end: pressedAt});
    return openQuickTags(next, id, at);
  }

  const open = openInterval(released);
  if (open) {
    const marks = released.marks.map((m) => (m.id === open.id ? {...m, end: at} : m));
    return openQuickTags({...released, marks}, open.id, at);
  }
  const [next, id] = addMark(released, {kind: 'interval', start: pressedAt, end: at});
  return openQuickTags(next, id, at);
}

function toggleTag(state: DemoState, tag: string, at: number): DemoState {
  if (state.quickTagsFor === null || state.quickTagsUntil === null || at >= state.quickTagsUntil) return state;
  const id = state.quickTagsFor;
  const marks = state.marks.map((m) => {
    if (m.id !== id) return m;
    const tags = m.tags.includes(tag) ? m.tags.filter((t) => t !== tag) : [...m.tags, tag];
    return {...m, tags};
  });
  return {...state, marks};
}

export function demoReducer(state: DemoState, event: DemoEvent): DemoState {
  switch (event.type) {
    case 'press':
      return state.pressedAt === null ? {...state, pressedAt: event.at} : state;
    case 'release':
      return finishPress(state, event.at, false);
    case 'cancel':
      return finishPress(state, event.at, true);
    case 'tick':
      return closeExpiredQuickTags(startIntervalIfHeld(state, event.at), event.at);
    case 'toggleTag':
      return toggleTag(state, event.tag, event.at);
    case 'reset':
      return initialDemoState;
  }
}

export function isHolding(state: DemoState): boolean {
  return openInterval(state) !== undefined;
}

export function quickTagsMark(state: DemoState): Mark | null {
  if (state.quickTagsFor === null) return null;
  return state.marks.find((m) => m.id === state.quickTagsFor) ?? null;
}

export function quickTagsRemaining(state: DemoState, at: number): number {
  if (state.quickTagsUntil === null) return 0;
  return Math.min(1, Math.max(0, (state.quickTagsUntil - at) / QUICK_TAGS_MS));
}

export function clipSeconds(mark: Mark): number {
  if (mark.kind === 'instant') return INSTANT_BEFORE_S + INSTANT_AFTER_S;
  const heldS = Math.round(((mark.end ?? mark.start) - mark.start) / 1000);
  return INTERVAL_BEFORE_S + heldS + INTERVAL_AFTER_S;
}

export function formatClipLength(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export function trackPosition(at: number, origin: number): number {
  const elapsed = Math.max(0, at - origin);
  return (elapsed % TRACK_MS) / TRACK_MS;
}

export function describeMark(mark: Mark): string {
  if (mark.kind === 'instant') return 'Moment marked · Instant';
  const seconds = Math.max(1, Math.round(((mark.end ?? mark.start) - mark.start) / 1000));
  return `Moment marked · Interval · ${seconds} s`;
}
