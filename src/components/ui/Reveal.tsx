import {motion, type Variants} from 'motion/react';
import type {ReactNode} from 'react';

const group: Variants = {
  hidden: {},
  shown: {transition: {staggerChildren: 0.06}},
};

const item: Variants = {
  hidden: {opacity: 0, y: 24, scale: 0.96},
  shown: {opacity: 1, y: 0, scale: 1, transition: {type: 'spring', stiffness: 380, damping: 30}},
};

type Props = {children: ReactNode; className?: string};

/** Starts its RevealItems one after another the first time it scrolls into view. */
export function RevealGroup({children, className}: Props) {
  return (
    <motion.div className={className} variants={group} initial="hidden" whileInView="shown" viewport={{once: true, amount: 0.15}}>
      {children}
    </motion.div>
  );
}

/** `data-reveal` lets the <noscript> rule show it without JavaScript. */
export function RevealItem({children, className}: Props) {
  return (
    <motion.div className={className} variants={item} data-reveal="">
      {children}
    </motion.div>
  );
}
