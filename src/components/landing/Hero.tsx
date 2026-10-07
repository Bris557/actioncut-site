import clsx from 'clsx';
import {useReducedMotion} from 'motion/react';
import {useEffect, useState} from 'react';
import {CAMERA_PHOTOS} from '@site/src/data/camera';
import {site} from '@site/src/data/site';
import {QUICK_TAGS} from '@site/src/data/tags';
import {formatClock, heroFrame} from '@site/src/lib/heroLoop';
import Icon from '../brand/Icon';
import Shape from '../brand/Shapes';
import CameraOverlayMock from '../phone/CameraOverlayMock';
import PhoneFrame from '../phone/PhoneFrame';
import Button from '../ui/Button';
import Section from '../ui/Section';
import StoreBadge from '../ui/StoreBadge';
import styles from './Hero.module.css';

// Two fixed lines: the width-axis 'breathe' animation must never re-wrap the headline.
const LINES = [['Tap.', 'Tag.'], ['Done.']];
const TRUST = ['No account', 'Videos stay on your phone', 'Works with your camera app'];

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

  const frame = heroFrame(step);

  return (
    <Section tone="cream" className={styles.hero} innerClassName={styles.inner} labelledBy="hero-title">
      <Shape kind="cookie12" color="var(--ac-orange)" spin className={styles.cookie} />
      <Shape kind="pill" color="var(--ac-blue)" className={styles.pill} />
      <Shape kind="clover" color="var(--ac-secondary-container)" spin className={styles.clover} />

      <div className={styles.copy}>
        <span className="ac-eyebrow">For parents on the sideline</span>
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
          Film your kid’s game with your usual camera. Tap the floating button at every great play — ActionCut cuts the
          clips for you.
        </p>
        <div className={styles.ctas}>
          <Button to="/#beta" size="l" icon={<Icon name="mail" />}>
            Join the beta
          </Button>
          <span className={styles.meta}>Free · {site.minAndroid}</span>
        </div>
        <div className={styles.badges}>
          <StoreBadge label="Google Play" href={site.googlePlayUrl} />
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
        <div className={styles.phoneWrap}>
          <PhoneFrame label="ActionCut’s floating button over the camera app, with the quick tags Goal, Save and Assist">
            <CameraOverlayMock
              photo={CAMERA_PHOTOS.wide}
              eager
              count={frame.count}
              recTime={formatClock(frame.recSeconds)}
              hot={frame.hot}
              chipsVisible={frame.chipsVisible}
              countdown={frame.countdown}
              chips={QUICK_TAGS.map((t) => ({...t, on: t.name === 'Goal' && frame.goalOn}))}
            />
          </PhoneFrame>
        </div>
      </div>
    </Section>
  );
}
