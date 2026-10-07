import clsx from 'clsx';
import type {CSSProperties} from 'react';
import {containsCyrillic} from '@site/src/lib/text';
import Icon from '../brand/Icon';
import styles from './TagChip.module.css';

type Props = {
  name: string;
  color: string;
  /** Text color on the filled chip; see TagInfo.ink. */
  ink?: string;
  on?: boolean;
  tone?: 'surface' | 'overlay';
  className?: string;
};

export default function TagChip({name, color, ink = '#FFFFFF', on = false, tone = 'surface', className}: Props) {
  const style = {'--tag': color, '--tag-ink': ink} as CSSProperties;
  return (
    <span className={clsx(styles.chip, styles[tone], on && styles.on, className)} style={style}>
      {on ? <Icon name="check" size={14} strokeWidth={3.2} className={styles.check} /> : <span className={styles.dot} />}
      <span className={containsCyrillic(name) ? 'ac-cyr' : undefined}>{name}</span>
    </span>
  );
}
