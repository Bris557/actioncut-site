import Link from '@docusaurus/Link';
import clsx from 'clsx';
import type {ReactNode} from 'react';
import styles from './Button.module.css';

type Common = {
  children: ReactNode;
  variant?: 'filled' | 'tonal' | 'dark' | 'ghost';
  size?: 'm' | 'l';
  icon?: ReactNode;
  className?: string;
};

type Props = Common &
  (
    | {to: string; href?: never; download?: never; onClick?: never}
    | {href: string; download?: boolean; to?: never; onClick?: never}
    | {onClick: () => void; to?: never; href?: never; download?: never}
    | {submit: true; disabled?: boolean; to?: never; href?: never; download?: never; onClick?: never}
  );

export default function Button(props: Props) {
  const {children, variant = 'filled', size = 'm', icon, className} = props;
  const cls = clsx(styles.btn, styles[variant], styles[size], className);
  const content = (
    <>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </>
  );
  if (props.to !== undefined) {
    return (
      <Link to={props.to} className={cls}>
        {content}
      </Link>
    );
  }
  if (props.href !== undefined) {
    return (
      <a href={props.href} download={props.download || undefined} className={cls}>
        {content}
      </a>
    );
  }
  if ('submit' in props) {
    return (
      <button type="submit" disabled={props.disabled} className={cls}>
        {content}
      </button>
    );
  }
  return (
    <button type="button" onClick={props.onClick} className={cls}>
      {content}
    </button>
  );
}
