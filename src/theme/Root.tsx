import {MotionConfig} from 'motion/react';
import type {ReactNode} from 'react';

/** Wraps every page: motion honours the visitor's "reduce motion" setting. */
export default function Root({children}: {children: ReactNode}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
