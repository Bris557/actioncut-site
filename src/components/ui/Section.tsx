import useBrokenLinks from '@docusaurus/useBrokenLinks';
import clsx from 'clsx';
import type {ReactNode} from 'react';
import styles from './Section.module.css';

export type SectionTone = 'cream' | 'white' | 'orange' | 'blue' | 'brown';

type Props = {
  id?: string;
  tone: SectionTone;
  labelledBy?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
};

/** A rounded "sheet" with its own background — the page's rhythm (spec §3.3). */
export default function Section({id, tone, labelledBy, className, innerClassName, children}: Props) {
  // Register the id so Docusaurus' broken-anchor check knows `/#id` links resolve.
  useBrokenLinks().collectAnchor(id);
  return (
    <section id={id} aria-labelledby={labelledBy} className={clsx(styles.sheet, styles[tone], className)}>
      <div className={clsx(styles.inner, innerClassName)}>{children}</div>
    </section>
  );
}
