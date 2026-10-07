import {TAGS} from '@site/src/data/tags';
import Icon from '../brand/Icon';
import TagChip from '../ui/TagChip';
import {LiveBar, LivePill, MomentTile, type MockTile} from './MockBits';
import styles from './EventMock.module.css';

const TILES: MockTile[] = [
  {kind: 'rink', shift: -4, time: '15:10', title: 'First goal', tags: [TAGS.goal.color], fav: true},
  {kind: 'rink', shift: 8, time: '15:08', tags: [TAGS.save.color], interval: 12},
  {kind: 'rink', shift: -10, time: '14:59'},
  {kind: 'rink', shift: 3, time: '14:52', tags: [TAGS.assist.color, TAGS.goal.color], fav: true},
  {kind: 'rink', shift: 12, time: '14:41', cut: true},
  {kind: 'rink', shift: -6, time: '14:30', tags: [TAGS.save.color]},
  {kind: 'rink', shift: 0, time: '14:12', interval: 8},
  {kind: 'rink', shift: 9, time: '13:58', tags: [TAGS.goal.color]},
  {kind: 'rink', shift: -12, time: '13:51', fav: true},
  {kind: 'rink', shift: 5, time: '13:46'},
  {kind: 'rink', shift: -2, time: '13:45', tags: [TAGS.skill.color]},
  {kind: 'rink', shift: 11, time: '13:40'},
];

export default function EventMock({live = false}: {live?: boolean}) {
  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <Icon name="arrowLeft" />
        <span className={styles.actions}>
          {!live && <Icon name="download" />}
          <Icon name="more" />
        </span>
      </div>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.title}>Semi-final vs Lions</span>
          <Icon name="pencil" className={styles.pencil} />
        </div>
        <div className={styles.sub}>
          {live && <LivePill />}
          <span>Oct 4, 13:36 · 1h 34m · 12 moments</span>
        </div>
        <div className={styles.filters}>
          <TagChip name="Goal" color={TAGS.goal.color} />
          <TagChip name="Save" color={TAGS.save.color} />
          <TagChip name="Assist" color={TAGS.assist.color} />
        </div>
      </div>
      <div className={styles.grid}>
        {TILES.map((tile) => (
          <MomentTile key={tile.time} tile={tile} />
        ))}
      </div>
      {live && <LiveBar time="45:12" count={12} />}
    </div>
  );
}
