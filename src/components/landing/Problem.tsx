import {motion, useScroll, useTransform} from 'motion/react';
import {useRef} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {CLIP_TILES} from '@site/src/data/clips';
import Icon from '../brand/Icon';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import styles from './Problem.module.css';

const PINS = [12, 31, 38, 63, 86];

function ClipTile({src, label}: {src: string; label: string}) {
  return <img src={useBaseUrl(src)} alt={label} loading="lazy" decoding="async" draggable={false} />;
}

export default function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const {scrollYProgress} = useScroll({target: ref, offset: ['start 0.9', 'end 0.45']});
  // The long recording shrinks as its clips appear (static under reduced motion, see CSS).
  const barScale = useTransform(scrollYProgress, [0, 1], [1, 0.72]);

  return (
    <Section tone="white" labelledBy="problem-title">
      <RevealGroup className={styles.head}>
        <RevealItem>
          <h2 id="problem-title" className="ac-h2">
            A 90-minute game.
            <br />
            Five moments you’ll actually rewatch.
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="ac-lead">
            Nobody scrubs through an hour of shaky footage to find the goal. With ActionCut you mark it the second it
            happens — and the clip is waiting for you after the game.
          </p>
        </RevealItem>
      </RevealGroup>

      <div ref={ref} className={styles.diagram}>
        <div className={styles.rowLabel}>
          <span>Your recording</span>
          <span className="ac-tnum">1h 39m</span>
        </div>
        <motion.div className={styles.bar} style={{scaleX: barScale}}>
          <span className={styles.film} />
          {PINS.map((left, i) => (
            <motion.span
              key={left}
              className={styles.pin}
              style={{left: `${left}%`}}
              initial={{y: -24, opacity: 0}}
              whileInView={{y: 0, opacity: 1}}
              viewport={{once: true, amount: 1}}
              transition={{type: 'spring', stiffness: 500, damping: 22, delay: i * 0.08}}
              data-reveal=""
            />
          ))}
        </motion.div>
        <div className={styles.arrow}>
          <Icon name="arrowRight" />5 moments → 5 clips · 7 s each
        </div>
        <RevealGroup className={styles.clips}>
          {CLIP_TILES.map((tile) => (
            <RevealItem key={tile.src} className={styles.clip}>
              <ClipTile src={tile.src} label={tile.label} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
