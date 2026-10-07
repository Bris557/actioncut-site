import {motion, useScroll, useTransform} from 'motion/react';
import {useRef} from 'react';
import {benefits, type Benefit} from '@site/src/data/benefits';
import Section from '../ui/Section';
import styles from './Benefits.module.css';

function BenefitLine({benefit, index}: {benefit: Benefit; index: number}) {
  const ref = useRef<HTMLLIElement>(null);
  const {scrollYProgress} = useScroll({target: ref, offset: ['start 0.95', 'center 0.55']});
  // Light & narrow → bold & wide as the line reaches the middle of the screen.
  const variation = useTransform(
    scrollYProgress,
    (v) => `'ROND' 100, 'wght' ${Math.round(250 + 510 * v)}, 'wdth' ${Math.round(72 + 28 * v)}`,
  );
  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);

  return (
    <li ref={ref} className={styles.item}>
      <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
      <motion.h3 className={styles.title} style={{fontVariationSettings: variation, opacity}} data-reveal="">
        {benefit.title}
      </motion.h3>
      <p className={styles.body}>{benefit.body}</p>
    </li>
  );
}

export default function Benefits() {
  return (
    <Section tone="blue" labelledBy="benefits-title">
      <h2 id="benefits-title" className="ac-h2">
        What you get
      </h2>
      <ol className={styles.list}>
        {benefits.map((b, i) => (
          <BenefitLine key={b.title} benefit={b} index={i} />
        ))}
      </ol>
    </Section>
  );
}
