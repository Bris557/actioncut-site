import useBaseUrl from '@docusaurus/useBaseUrl';
import clsx from 'clsx';
import styles from './Shot.module.css';

type Props = {
  /** Path under static/, e.g. '/img/screens/event.webp'. */
  src: string;
  className?: string;
  /** Above-the-fold images load right away; the rest wait until they are near the viewport. */
  eager?: boolean;
};

/** A real app screenshot filling a PhoneFrame. Decorative: the frame carries the label. */
export default function Shot({src, className, eager = false}: Props) {
  const url = useBaseUrl(src);
  return (
    <img
      src={url}
      alt=""
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      className={clsx(styles.shot, className)}
    />
  );
}
