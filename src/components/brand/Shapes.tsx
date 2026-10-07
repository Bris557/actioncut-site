import clsx from 'clsx';
import {polarPath} from '@site/src/lib/shapes';
import styles from './Shapes.module.css';

export type ShapeKind = 'cookie9' | 'cookie12' | 'clover' | 'burst' | 'pill';

const PATHS: Record<Exclude<ShapeKind, 'pill'>, string> = {
  cookie9: polarPath(9, 0.06),
  cookie12: polarPath(12, 0.045),
  clover: polarPath(4, 0.2),
  burst: polarPath(10, 0.1),
};

type Props = {
  kind: ShapeKind;
  color: string;
  className?: string;
  /** Slow continuous rotation (off under reduced motion). */
  spin?: boolean;
};

export default function Shape({kind, color, className, spin = false}: Props) {
  if (kind === 'pill') {
    return (
      <svg viewBox="0 0 100 50" aria-hidden="true" focusable="false" className={clsx(styles.shape, className)}>
        <rect width="100" height="50" rx="25" fill={color} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className={clsx(styles.shape, className)}>
      <path d={PATHS[kind]} fill={color} className={spin ? styles.spin : undefined} />
    </svg>
  );
}
