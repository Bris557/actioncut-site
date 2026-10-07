import clsx from 'clsx';
import {LayoutGroup, motion} from 'motion/react';
import {useRef, useState, type KeyboardEvent} from 'react';
import {useCases, type UseCaseMock} from '@site/src/data/useCases';
import Shape from '../brand/Shapes';
import EventMock from '../phone/EventMock';
import HomeMock from '../phone/HomeMock';
import MomentMock from '../phone/MomentMock';
import Screen from '../phone/Screen';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import styles from './UseCases.module.css';

function Mock({kind}: {kind: UseCaseMock}) {
  switch (kind) {
    case 'event':
      return <EventMock />;
    case 'home':
      return <HomeMock live liveTime="31:08" liveCount={4} />;
    case 'moment':
      return <MomentMock />;
    case 'versions':
      return <MomentMock versions />;
    case 'favorites':
      return <HomeMock tab="favorites" />;
  }
}

export default function UseCases() {
  const [selected, setSelected] = useState(0);
  const interacted = useRef(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number, focus: boolean) => {
    interacted.current = true;
    setSelected(i);
    if (focus) tabs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = useCases.length - 1;
    let next: number;
    if (e.key === 'ArrowRight') next = selected === last ? 0 : selected + 1;
    else if (e.key === 'ArrowLeft') next = selected === 0 ? last : selected - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;
    e.preventDefault();
    select(next, true);
  };

  return (
    <Section id="use-cases" tone="white" labelledBy="uc-title">
      <RevealGroup className={styles.head}>
        <RevealItem>
          <span className="ac-eyebrow">Use cases</span>
        </RevealItem>
        <RevealItem>
          <h2 id="uc-title" className="ac-h2">
            Made for every kind of game day
          </h2>
        </RevealItem>
      </RevealGroup>

      <LayoutGroup>
        <div role="tablist" aria-label="Use cases" className={styles.tablist} onKeyDown={onKeyDown}>
          {useCases.map((uc, i) => (
            <button
              key={uc.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`uc-tab-${uc.id}`}
              aria-selected={i === selected}
              aria-controls={`uc-panel-${uc.id}`}
              tabIndex={i === selected ? 0 : -1}
              className={clsx(styles.tab, i === selected && styles.tabOn)}
              onClick={() => select(i, false)}>
              {i === selected && (
                <motion.span layoutId="uc-indicator" className={styles.indicator} transition={{type: 'spring', stiffness: 420, damping: 34}} />
              )}
              <span className={styles.tabLabel}>{uc.label}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      {useCases.map((uc, i) => (
        <div
          key={uc.id}
          role="tabpanel"
          id={`uc-panel-${uc.id}`}
          aria-labelledby={`uc-tab-${uc.id}`}
          hidden={i !== selected}
          tabIndex={0}
          className={styles.panel}>
          <motion.div
            key={i === selected ? 'on' : 'off'}
            className={styles.panelInner}
            initial={interacted.current ? {opacity: 0, y: 16} : false}
            animate={{opacity: 1, y: 0}}
            transition={{type: 'spring', stiffness: 320, damping: 30}}>
            <div className={styles.story}>
              <h3 className={styles.title}>{uc.title}</h3>
              <p className={styles.intro}>{uc.intro}</p>
              <ol className={styles.steps}>
                {uc.steps.map((s, n) => (
                  <li key={s}>
                    <span className={styles.n}>{n + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className={styles.visual}>
              <Shape kind="cookie9" color="var(--ac-cream)" className={styles.shape} />
              <div className={styles.phone}>
                <Screen name={uc.screen.name} src={uc.screen.src} fallback={<Mock kind={uc.screen.mock} />} />
              </div>
            </div>
          </motion.div>
        </div>
      ))}
    </Section>
  );
}
