import clsx from 'clsx';
import {AnimatePresence, motion, useInView} from 'motion/react';
import {useEffect, useReducer, useRef, useState} from 'react';
import {QUICK_TAGS, tagColor} from '@site/src/data/tags';
import {formatClock} from '@site/src/lib/heroLoop';
import {
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
} from '@site/src/lib/markGesture';
import Icon, {type IconName} from '../brand/Icon';
import Scene, {type SceneKind} from '../phone/Scene';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import TagChip from '../ui/TagChip';
import styles from './ButtonDemo.module.css';

const RULES: {icon: IconName; title: string; body: string}[] = [
  {icon: 'crosshair', title: 'Tap', body: 'Marks an instant. Its clip keeps 5 s before and 2 s after.'},
  {icon: 'interval', title: 'Hold', body: 'Marks an interval for as long as you hold — plus 3 s on each side.'},
  {icon: 'tag', title: 'Tag it', body: 'Goal, Save or Assist: tap one within 5 seconds.'},
];

const SCENES: SceneKind[] = ['pitch', 'rink', 'gym'];

function vibrate(ms: number) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(ms);
}

export default function ButtonDemo() {
  const [state, dispatch] = useReducer(demoReducer, initialDemoState);
  const [now, setNow] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const origin = useRef<number | null>(null);
  const announced = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef);

  const holding = isHolding(state);
  const pressed = state.pressedAt !== null;
  const quick = quickTagsMark(state);
  const closed = state.marks.filter((m) => m.end !== null);

  // Clock and gesture ticks, only while the demo is on screen.
  useEffect(() => {
    if (!inView) return undefined;
    const id = window.setInterval(() => {
      const at = Date.now();
      setNow(at);
      dispatch({type: 'tick', at});
    }, 100);
    return () => window.clearInterval(id);
  }, [inView]);

  // Announce and buzz once per finished mark (instant on release, interval on release).
  useEffect(() => {
    const last = state.marks[state.marks.length - 1];
    if (!last || last.end === null || last.id === announced.current) return;
    announced.current = last.id;
    setAnnouncement(describeMark(last));
    if (last.kind === 'instant') vibrate(50);
  }, [state.marks]);

  // The app buzzes 100 ms when a hold turns into an interval.
  useEffect(() => {
    if (holding) vibrate(100);
  }, [holding]);

  const press = () => {
    const at = Date.now();
    if (origin.current === null) origin.current = at;
    setNow(at);
    dispatch({type: 'press', at});
  };
  const release = () => dispatch({type: 'release', at: Date.now()});
  const cancel = () => dispatch({type: 'cancel', at: Date.now()});
  const toggle = (tag: string) => {
    if (!quick) return;
    setAnnouncement(quick.tags.includes(tag) ? `Removed ${tag}` : `Tagged ${tag}`);
    dispatch({type: 'toggleTag', tag, at: Date.now()});
  };
  const clear = () => {
    origin.current = null;
    announced.current = null;
    setAnnouncement('Cleared');
    dispatch({type: 'reset'});
  };

  const at = now ?? 0;
  const start = origin.current ?? at;
  const clock = formatClock(origin.current === null ? 0 : Math.floor((at - start) / 1000));

  return (
    <Section id="try" tone="orange" labelledBy="try-title">
      <div className={styles.layout}>
        <RevealGroup>
          <RevealItem>
            <span className="ac-eyebrow">Try it</span>
          </RevealItem>
          <RevealItem>
            <h2 id="try-title" className="ac-h2">
              Go on — tap it.
              <br />
              Or hold it.
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="ac-lead">
              This is the button that floats over your camera during a game. Try it right here — no phone needed.
            </p>
          </RevealItem>
          <div className={styles.rules}>
            {RULES.map((rule) => (
              <RevealItem key={rule.title} className={styles.rule}>
                <span className={styles.ruleIcon}>
                  <Icon name={rule.icon} size={22} />
                </span>
                <span>
                  <span className={styles.ruleTitle}>{rule.title}</span>
                  <span className={styles.ruleBody}>{rule.body}</span>
                </span>
              </RevealItem>
            ))}
          </div>
        </RevealGroup>

        <div>
          <div ref={stageRef} className={styles.stage}>
            <div className={styles.stageTop}>
              <span className={styles.rec}>
                <span className={styles.recDot} />
                {clock}
              </span>
              <span>{closed.length === 1 ? '1 moment' : `${closed.length} moments`}</span>
              <button type="button" className={styles.clear} onClick={clear} disabled={state.marks.length === 0}>
                Clear
              </button>
            </div>

            <div className={styles.arena}>
              <div className={styles.chips}>
                <AnimatePresence>
                  {quick && (
                    <motion.div
                      key={quick.id}
                      className={styles.chipStack}
                      initial={{opacity: 0, x: 12}}
                      animate={{opacity: 1, x: 0}}
                      exit={{opacity: 0, x: 12}}
                      transition={{type: 'spring', stiffness: 420, damping: 30}}>
                      <span className={styles.countdown}>
                        <span style={{transform: `scaleX(${quickTagsRemaining(state, at)})`}} />
                      </span>
                      {QUICK_TAGS.map((tag, i) => {
                        const on = quick.tags.includes(tag.name);
                        return (
                          <motion.button
                            key={tag.name}
                            type="button"
                            className={styles.chipBtn}
                            aria-pressed={on}
                            onClick={() => toggle(tag.name)}
                            initial={{scale: 0.4, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            transition={{type: 'spring', stiffness: 500, damping: 26, delay: i * 0.05}}>
                            <TagChip tone="overlay" name={tag.name} color={tag.color} ink={tag.ink} on={on} />
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                className={clsx(styles.big, pressed && styles.pressed, holding && styles.holding)}
                aria-label="Mark a moment"
                aria-describedby="demo-hint"
                onPointerDown={(e) => {
                  if (e.button !== 0) return;
                  e.preventDefault();
                  press();
                  try {
                    // Keeps pointerup/pointercancel on the button if the finger slides off.
                    e.currentTarget.setPointerCapture(e.pointerId);
                  } catch {
                    // No active pointer (already released): release/cancel still end the press.
                  }
                }}
                onPointerUp={release}
                onPointerCancel={cancel}
                onLostPointerCapture={cancel}
                onKeyDown={(e) => {
                  if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
                    e.preventDefault();
                    press();
                  }
                }}
                onKeyUp={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    release();
                  }
                }}
                onBlur={cancel}
                onContextMenu={(e) => e.preventDefault()}>
                <Icon name="crosshair" />
                <span className={styles.count}>{closed.length}</span>
              </button>

              <p id="demo-hint" className={styles.hint}>
                Tap for an instant.
                <br />
                Hold for an interval.
              </p>
            </div>

            <div className={styles.timeline} aria-hidden="true">
              <span className={styles.track} />
              {state.marks.map((mark) => {
                const left = trackPosition(mark.start, start) * 100;
                if (mark.kind === 'instant') {
                  return <span key={mark.id} className={styles.instant} style={{left: `${left}%`}} />;
                }
                const width = Math.min(100 - left, (((mark.end ?? at) - mark.start) / TRACK_MS) * 100);
                return <span key={mark.id} className={styles.interval} style={{left: `${left}%`, width: `${width}%`}} />;
              })}
              {origin.current !== null && <span className={styles.head} style={{left: `${trackPosition(at, start) * 100}%`}} />}
            </div>
            <div className={styles.trackLabels} aria-hidden="true">
              <span>0:00</span>
              <span>2:00</span>
            </div>
          </div>

          <div className={styles.clipsHead}>
            Your clips
            <span>cut with the app’s default lengths</span>
          </div>
          <ul className={styles.clips}>
            {closed.length === 0 && <li className={styles.empty}>Your clips appear here.</li>}
            <AnimatePresence initial={false}>
              {closed
                .slice(-5)
                .reverse()
                .map((mark) => (
                  <motion.li
                    key={mark.id}
                    layout
                    className={styles.clip}
                    initial={{scale: 0.6, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    exit={{scale: 0.6, opacity: 0}}
                    transition={{type: 'spring', stiffness: 420, damping: 28}}>
                    <Scene kind={SCENES[mark.id % SCENES.length]} shift={((mark.id * 7) % 21) - 10} />
                    {mark.tags.length > 0 && (
                      <span className={styles.clipDots}>
                        {mark.tags.map((t) => (
                          <span key={t} style={{background: tagColor(t)}} />
                        ))}
                      </span>
                    )}
                    <span className={styles.clipLen}>{formatClipLength(clipSeconds(mark))}</span>
                    {mark.kind === 'interval' && (
                      <span className={styles.clipKind}>
                        <Icon name="interval" strokeWidth={2.6} />
                      </span>
                    )}
                  </motion.li>
                ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
      <p className="ac-sr-only" aria-live="polite">
        {announcement}
      </p>
    </Section>
  );
}
