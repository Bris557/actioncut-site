import type {CSSProperties} from 'react';
import {betaMailto, site} from '@site/src/data/site';
import Icon from '../brand/Icon';
import Button from '../ui/Button';
import Section from '../ui/Section';
import {StoreBadges} from '../ui/StoreBadge';
import styles from './FinalCta.module.css';

const FLOATERS = [0, 1, 2, 3, 4, 5];

export default function FinalCta() {
  return (
    <Section id="download" tone="orange" labelledBy="cta-title" innerClassName={styles.inner}>
      <div className={styles.floaters} aria-hidden="true">
        {FLOATERS.map((i) => (
          <span key={i} className={styles.floater} style={{'--i': i} as CSSProperties}>
            <Icon name="crosshair" />
          </span>
        ))}
      </div>
      <h2 id="cta-title" className={styles.title}>
        Ready for the next game?
      </h2>
      <p className="ac-lead">Join the beta and spend the next tournament watching the game — not digging through the video afterwards.</p>
      <div className={styles.ctas}>
        <Button href={betaMailto()} size="l" variant="dark" icon={<Icon name="mail" />}>
          Join the beta
        </Button>
        <span className={styles.meta}>Free · {site.minAndroid}</span>
      </div>
      <div className={styles.badges}>
        <StoreBadges />
      </div>
    </Section>
  );
}
