import useBaseUrl from '@docusaurus/useBaseUrl';
import Icon from '../brand/Icon';
import Shape from '../brand/Shapes';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import styles from './MadeByParents.module.css';

export default function MadeByParents() {
  const photo = useBaseUrl('/img/story/stands.webp');
  return (
    <Section id="story" tone="brown" labelledBy="story-title" innerClassName={styles.inner}>
      <RevealGroup className={styles.copy}>
        <RevealItem>
          <span className="ac-eyebrow">Why we built it</span>
        </RevealItem>
        <RevealItem>
          <h2 id="story-title" className="ac-h2">
            Made by sports parents, for sports parents
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="ac-lead">
            We’re parents of young athletes. Kids’ tournaments left us with hours of video on our phones — and never
            enough time to dig through it for the moments that mattered.
          </p>
        </RevealItem>
        <RevealItem>
          <p className={styles.body}>
            So ActionCut does one job: you film the whole game from the stands, mark the great plays as they happen, and
            leave with the highlights already cut and sorted. No scrubbing, no editing — just the moments you’ll want to
            watch again.
          </p>
        </RevealItem>
      </RevealGroup>
      <div className={styles.visual}>
        <Shape kind="cookie9" color="var(--ac-orange)" spin className={styles.shape} />
        <figure className={styles.photo}>
          <img src={photo} alt="A parent in the stands watching a kids’ hockey game" loading="lazy" decoding="async" />
          <figcaption className={styles.caption}>
            <span className={styles.mark}>
              <Icon name="crosshair" size={20} />
            </span>
            Filmed from the stands
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
