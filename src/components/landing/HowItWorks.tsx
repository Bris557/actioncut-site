import clsx from 'clsx';
import {AnimatePresence, motion, useInView} from 'motion/react';
import {useEffect, useRef, useState} from 'react';
import {steps, type Step, type StepScreen} from '@site/src/data/steps';
import {QUICK_TAGS} from '@site/src/data/tags';
import Shape from '../brand/Shapes';
import CameraOverlayMock from '../phone/CameraOverlayMock';
import EventMock from '../phone/EventMock';
import HomeMock from '../phone/HomeMock';
import PhoneFrame from '../phone/PhoneFrame';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import styles from './HowItWorks.module.css';

function StepMock({screen}: {screen: StepScreen}) {
  switch (screen) {
    case 'home':
      return <HomeMock highlightNew />;
    case 'camera':
      return <CameraOverlayMock count={0} recTime="00:12" scene="pitch" />;
    case 'tags':
      return (
        <CameraOverlayMock
          count={3}
          recTime="23:41"
          scene="pitch"
          hot
          chipsVisible
          countdown={0.6}
          chips={QUICK_TAGS.map((t) => ({...t, on: t.name === 'Goal'}))}
        />
      );
    case 'event':
      return <EventMock />;
  }
}

function StepItem({index, step, active, onActive}: {index: number; step: Step; active: boolean; onActive: (i: number) => void}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, {amount: 0.6});
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li ref={ref} className={clsx(styles.step, active && styles.stepOn)}>
      <span className={styles.num}>{index + 1}</span>
      <h3 className={styles.stepTitle}>{step.title}</h3>
      <p className={styles.stepBody}>{step.body}</p>
      <div className={styles.inlinePhone}>
        <PhoneFrame label={step.title}>
          <StepMock screen={step.screen} />
        </PhoneFrame>
      </div>
    </li>
  );
}

export default function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <Section id="how-it-works" tone="cream" labelledBy="how-title">
      <RevealGroup className={styles.head}>
        <RevealItem>
          <span className="ac-eyebrow">How it works</span>
        </RevealItem>
        <RevealItem>
          <h2 id="how-title" className="ac-h2">
            You film. You tap.
            <br />
            ActionCut does the cutting.
          </h2>
        </RevealItem>
      </RevealGroup>

      <div className={styles.layout}>
        <ol className={styles.steps}>
          {steps.map((step, i) => (
            <StepItem key={step.title} index={i} step={step} active={active === i} onActive={setActive} />
          ))}
        </ol>

        <div className={styles.stickyCol} aria-hidden="true">
          <div className={styles.sticky}>
            <Shape kind="cookie9" color="var(--ac-container-high)" spin className={styles.shape} />
            <div className={styles.phone}>
              <PhoneFrame label={steps[active].title}>
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active}
                    className={styles.screenLayer}
                    initial={{opacity: 0, x: 40}}
                    animate={{opacity: 1, x: 0}}
                    exit={{opacity: 0, x: -40}}
                    transition={{type: 'spring', stiffness: 300, damping: 32}}>
                    <StepMock screen={steps[active].screen} />
                  </motion.div>
                </AnimatePresence>
              </PhoneFrame>
            </div>
            <div className={styles.dots}>
              {steps.map((step, i) => (
                <span key={step.title} className={clsx(styles.dot, i === active && styles.dotOn)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
