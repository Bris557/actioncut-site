import clsx from 'clsx';
import {useInView, useReducedMotion} from 'motion/react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {CAMERA_PHOTOS} from '@site/src/data/camera';
import {HERO_CLIPS} from '@site/src/data/heroClips';
import {site} from '@site/src/data/site';
import {QUICK_TAGS} from '@site/src/data/tags';
import {formatClock, heroFrame} from '@site/src/lib/heroLoop';
import {MARK_SHARE, overlayAfterMark, pickClips, type HeroClip} from '@site/src/lib/heroVideo';
import Icon from '../brand/Icon';
import Shape from '../brand/Shapes';
import CameraOverlayMock from '../phone/CameraOverlayMock';
import PhoneFrame from '../phone/PhoneFrame';
import ViewfinderVideos from '../phone/ViewfinderVideos';
import Button from '../ui/Button';
import Section from '../ui/Section';
import {StoreBadges} from '../ui/StoreBadge';
import styles from './Hero.module.css';

// Two fixed lines: the width-axis 'breathe' animation must never re-wrap the headline.
const LINES = [['Tap.', 'Tag.'], ['Done.']];
const TRUST = ['No account', 'Videos stay on your phone', 'Works with your camera app'];
const CLIPS_PER_VISIT = 3;
const MARKS_BEFORE = 5;
/** Quick tags close after 5 s; the tick stops a little later. */
const TAGS_MS = 5500;

/**
 * Three random game clips loop in the viewfinder; at two-thirds of each the button "taps", the count
 * grows and the quick tags open — and stay their 5 s even when the next clip has started.
 */
function useGameClips(enabled: boolean) {
  const [clips, setClips] = useState<HeroClip[]>([]);
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);
  const [marks, setMarks] = useState(MARKS_BEFORE);
  const [markedAt, setMarkedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const marked = useRef(false);

  // Picked after hydration, so the server and the first client render match.
  useEffect(() => {
    if (enabled) setClips(pickClips(HERO_CLIPS, CLIPS_PER_VISIT, Math.random));
  }, [enabled]);

  useEffect(() => {
    if (markedAt === null) return undefined;
    const id = window.setInterval(() => {
      const t = performance.now();
      setNow(t);
      if (t - markedAt > TAGS_MS) setMarkedAt(null);
    }, 150);
    return () => window.clearInterval(id);
  }, [markedAt]);

  const mark = useCallback((lateBySeconds: number) => {
    marked.current = true;
    const t = performance.now();
    setNow(t);
    setMarkedAt(t - lateBySeconds * 1000);
    setMarks((m) => Math.min(99, m + 1));
  }, []);

  const onTime = useCallback(
    (seconds: number, duration: number) => {
      if (marked.current || !Number.isFinite(duration)) return;
      const at = duration * MARK_SHARE;
      if (seconds >= at) mark(seconds - at);
    },
    [mark],
  );

  const onEnded = useCallback(() => {
    if (!marked.current) mark(0);
    marked.current = false;
    setActive((a) => (a + 1) % Math.max(1, clips.length));
  }, [clips.length, mark]);

  const onFail = useCallback(() => setFailed(true), []);

  const live = clips.length > 0 && !failed;
  return {
    live,
    clips,
    active,
    onTime,
    onEnded,
    onFail,
    marks,
    sinceMark: markedAt === null ? null : (now - markedAt) / 1000,
  };
}

export default function Hero() {
  const reduce = useReducedMotion();
  // Step 0 on the server and on the first client render; the loop starts after hydration.
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) {
      setStep(3);
      return undefined;
    }
    const id = window.setInterval(() => setStep((s) => s + 1), 1100);
    return () => window.clearInterval(id);
  }, [reduce]);

  const game = useGameClips(!reduce);
  const phone = useRef<HTMLDivElement>(null);
  const inView = useInView(phone, {amount: 0.2});
  // Without the clips (reduced motion, autoplay refused) the photo keeps the old timed loop.
  const frame = game.live
    ? {...heroFrame(step), ...overlayAfterMark(game.sinceMark), count: game.marks}
    : heroFrame(step);

  return (
    <Section tone="cream" className={styles.hero} innerClassName={styles.inner} labelledBy="hero-title">
      <Shape kind="cookie12" color="var(--ac-orange)" spin className={styles.cookie} />
      <Shape kind="pill" color="var(--ac-blue)" className={styles.pill} />
      <Shape kind="clover" color="var(--ac-secondary-container)" spin className={styles.clover} />

      <div className={styles.copy}>
        <span className="ac-eyebrow">By sports parents, for sports parents</span>
        <h1 id="hero-title" className={styles.title}>
          {LINES.map((line, l) => (
            <span key={line.join(' ')} className={styles.line}>
              {line.map((word, w) => (
                <span
                  key={word}
                  className={clsx(styles.word, l === LINES.length - 1 && styles.accent)}
                  style={{animationDelay: `${(l * 2 + w) * 0.12}s`}}>
                  {word}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p className="ac-lead">
          Film your kid’s game with your usual camera and tap the floating button at every great play. ActionCut cuts the
          clips for you — no more digging through hours of video.
        </p>
        <div className={styles.ctas}>
          <Button to="/#beta" size="l" icon={<Icon name="mail" />}>
            Join the beta
          </Button>
          <span className={styles.meta}>Free · {site.minAndroid}</span>
        </div>
        <div className={styles.badges}>
          <StoreBadges />
        </div>
        <ul className={styles.trust}>
          {TRUST.map((t) => (
            <li key={t}>
              <Icon name="check" size={18} strokeWidth={2.6} />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.visual}>
        <div className={styles.phoneWrap} ref={phone}>
          <PhoneFrame label="ActionCut’s floating button over the camera app, with the quick tags Goal, Save and Assist">
            <CameraOverlayMock
              photo={CAMERA_PHOTOS.shot}
              eager
              count={frame.count}
              recTime={formatClock(frame.recSeconds)}
              hot={frame.hot}
              chipsVisible={frame.chipsVisible}
              countdown={frame.countdown}
              chips={QUICK_TAGS.map((t) => ({...t, on: t.name === 'Goal' && frame.goalOn}))}>
              {game.live && (
                <ViewfinderVideos
                  clips={game.clips}
                  active={game.active}
                  playing={inView}
                  onTime={game.onTime}
                  onEnded={game.onEnded}
                  onFail={game.onFail}
                />
              )}
            </CameraOverlayMock>
          </PhoneFrame>
        </div>
      </div>
    </Section>
  );
}
