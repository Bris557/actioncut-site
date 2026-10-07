import clsx from 'clsx';
import {TAGS} from '@site/src/data/tags';
import {groupRadius} from '@site/src/lib/groupShape';
import Icon from '../brand/Icon';
import TagChip from '../ui/TagChip';
import {LiveBar, LivePill, MomentTile, type MockTile} from './MockBits';
import Scene, {type SceneKind} from './Scene';
import styles from './HomeMock.module.css';

type MockEvent = {title: string; sub: string; kind: SceneKind; shift?: number; live?: boolean};

const LIVE_EVENT: MockEvent = {title: 'Event in progress', sub: 'Started 14:05 · 5 moments', kind: 'pitch', live: true};

const MONTHS: {month: string; events: MockEvent[]}[] = [
  {
    month: 'October',
    events: [
      {title: 'Semi-final vs Lions', sub: 'Oct 4, 13:36 · 1h 34m · 12 moments', kind: 'rink'},
      {title: 'Practice · passing drills', sub: 'Oct 2, 18:00 · 52m · 6 moments', kind: 'pitch', shift: 6},
      {title: 'Oct 1 · 17:20', sub: '1h 12m · 4 moments', kind: 'gym'},
    ],
  },
  {
    month: 'September',
    events: [
      {title: 'Summer cup · day 2', sub: 'Sep 20, 09:40 · 2h 05m · 14 moments', kind: 'pitch', shift: -8},
      {title: 'Sep 13 · 11:15', sub: '1h 20m · 8 moments', kind: 'rink', shift: 10},
    ],
  },
];

const goal = TAGS.goal.color;
const FAVORITES: MockTile[] = [
  {kind: 'rink', shift: -4, time: '15:10', title: 'First goal', tags: [goal], fav: true},
  {kind: 'rink', shift: 3, time: '14:52', tags: [TAGS.assist.color, goal], fav: true},
  {kind: 'rink', shift: 9, time: '13:58', tags: [goal], fav: true},
  {kind: 'pitch', shift: -8, time: '10:47', tags: [goal], fav: true},
  {kind: 'pitch', shift: 5, time: '10:22', title: 'Header!', tags: [goal], fav: true},
  {kind: 'pitch', shift: -2, time: '09:58', tags: [goal], fav: true},
  {kind: 'gym', shift: 7, time: '17:41', tags: [goal], fav: true},
  {kind: 'rink', shift: -11, time: '11:32', tags: [goal], fav: true, interval: 9},
  {kind: 'rink', shift: 12, time: '11:05', tags: [goal], fav: true},
];

const R = 'calc(var(--u) * 20)';
const r = 'calc(var(--u) * 4)';
const FAV_RADIUS = [`${R} ${r} ${r} ${r}`, r, `${r} ${R} ${r} ${r}`, r, r, r, `${r} ${r} ${r} ${R}`, r, `${r} ${r} ${R} ${r}`];

type Props = {
  tab?: 'events' | 'favorites';
  live?: boolean;
  liveTime?: string;
  liveCount?: number;
  /** Pulses the "New event" button (How it works, step 1). */
  highlightNew?: boolean;
};

export default function HomeMock({tab = 'events', live = false, liveTime = '12:34', liveCount = 5, highlightNew = false}: Props) {
  const months = live ? [{month: 'Today', events: [LIVE_EVENT]}, ...MONTHS] : MONTHS;
  const total = months.reduce((n, m) => n + m.events.length, 0);
  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <span className={styles.title}>ActionCut</span>
        <span className={styles.actions}>
          <Icon name="help" />
          <Icon name="settings" />
        </span>
      </div>
      <div className={styles.tabs}>
        <span className={clsx(styles.tab, tab === 'events' && styles.tabOn)}>Events</span>
        <span className={clsx(styles.tab, tab === 'favorites' && styles.tabOn)}>Favorites</span>
      </div>
      {tab === 'events' ? (
        <div className={styles.list}>
          <div className={styles.countRow}>
            <span>{total} events</span>
            <span className={clsx(styles.newBtn, highlightNew && styles.newBtnHot)}>
              <Icon name="plus" />
              New event
            </span>
          </div>
          {months.map((m) => (
            <div key={m.month}>
              <div className={styles.month}>
                <span>{m.month}</span>
                <span className={styles.monthCount}>
                  {m.events.length === 1 ? '1 event' : `${m.events.length} events`}
                  <Icon name="chevronDown" />
                </span>
              </div>
              <div className={styles.group}>
                {m.events.map((e, i) => (
                  <div key={e.title} className={styles.row} style={{borderRadius: groupRadius(i, m.events.length)}}>
                    <span className={styles.thumb}>
                      <Scene kind={e.kind} shift={e.shift} />
                    </span>
                    <span className={styles.rowText}>
                      <span className={styles.rowTitle}>{e.title}</span>
                      <span className={styles.rowSub}>{e.sub}</span>
                    </span>
                    {e.live && <LivePill />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.list}>
          <div className={styles.countRow}>
            <span>9 moments from 4 events</span>
            <span className={styles.link}>Select</span>
          </div>
          <div className={styles.filters}>
            <TagChip name="Goal" color={TAGS.goal.color} ink={TAGS.goal.ink} on />
            <TagChip name="Save" color={TAGS.save.color} />
            <TagChip name="Assist" color={TAGS.assist.color} />
          </div>
          <div className={styles.month}>
            <span>October · Semi-final vs Lions</span>
            <span className={styles.link}>Select all</span>
          </div>
          <div className={styles.grid}>
            {FAVORITES.map((tile, i) => (
              <MomentTile key={`${tile.time}-${i}`} tile={tile} radius={FAV_RADIUS[i]} />
            ))}
          </div>
        </div>
      )}
      {live && <LiveBar time={liveTime} count={liveCount} />}
    </div>
  );
}
