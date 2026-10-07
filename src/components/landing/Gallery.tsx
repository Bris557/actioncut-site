import clsx from 'clsx';
import {motion, useMotionValue, useScroll, useTransform} from 'motion/react';
import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {gallery} from '@site/src/data/gallery';
import Icon from '../brand/Icon';
import PhoneFrame from '../phone/PhoneFrame';
import Shot from '../phone/Shot';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import styles from './Gallery.module.css';

const THEMES = [
  {id: 'light', label: 'Light'},
  {id: 'dark', label: 'Dark'},
] as const;

export default function Gallery() {
  const [dark, setDark] = useState(false);
  // Until hydration the row is a plain horizontal scroller; then page scroll drives it.
  const [linked, setLinked] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const distance = useMotionValue(0);
  // The row starts moving once its top passes 60 % of the window and ends as its bottom passes 30 %.
  const {scrollYProgress} = useScroll({target: viewport, offset: ['start 0.6', 'end 0.3']});
  const x = useTransform([scrollYProgress, distance], ([p, d]: number[]) => -d * Math.min(1, Math.max(0, p)));

  useEffect(() => {
    const v = viewport.current;
    const t = track.current;
    if (!v || !t) return undefined;
    // Far enough for the last phone to line up with the content's right edge.
    const measure = () => {
      const {paddingLeft, paddingRight} = getComputedStyle(v);
      const content = v.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
      distance.set(Math.max(0, t.scrollWidth - content));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(v);
    observer.observe(t);
    setLinked(true);
    return () => observer.disconnect();
  }, [distance]);

  return (
    <Section id="screens" tone="white" labelledBy="screens-title" className={clsx(styles.gallery, dark && styles.dark)}>
      <div className={styles.head}>
        <RevealGroup className={styles.copy}>
          <RevealItem>
            <span className="ac-eyebrow">Inside the app</span>
          </RevealItem>
          <RevealItem>
            <h2 id="screens-title" className="ac-h2">
              Real screens, day game or night game
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="ac-lead">
              Straight from a cup weekend on the ice: 40 moments from one event. ActionCut follows your phone’s theme, or
              you pick one in Settings.
            </p>
          </RevealItem>
        </RevealGroup>
        <div className={styles.toggle} role="group" aria-label="App theme">
          {THEMES.map((theme) => {
            const on = (theme.id === 'dark') === dark;
            return (
              <button
                key={theme.id}
                type="button"
                aria-pressed={on}
                className={clsx(styles.segment, on && styles.segmentOn)}
                onClick={() => setDark(theme.id === 'dark')}>
                {on && <Icon name="check" size={18} strokeWidth={2.6} />}
                {theme.label}
              </button>
            );
          })}
        </div>
      </div>

      <div ref={viewport} className={clsx(styles.viewport, linked && styles.linked)}>
        <motion.ul ref={track} className={styles.track} style={linked ? {x} : undefined}>
          {gallery.map((shot, i) => (
            <li key={shot.id} className={styles.item} style={{'--i': i} as CSSProperties}>
              <PhoneFrame label={`${shot.label}, ${dark ? 'dark' : 'light'} theme`} className={styles.phone}>
                <Shot src={shot.light} />
                <Shot src={shot.dark} className={styles.darkShot} />
              </PhoneFrame>
              <span className={styles.label}>{shot.label}</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </Section>
  );
}
