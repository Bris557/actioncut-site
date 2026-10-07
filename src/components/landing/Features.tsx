import clsx from 'clsx';
import {features, type Feature} from '@site/src/data/features';
import {QUICK_TAGS} from '@site/src/data/tags';
import Icon from '../brand/Icon';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import TagChip from '../ui/TagChip';
import styles from './Features.module.css';

const SWATCHES = ['#FF7A1A', '#00BFFF', '#A1A1A1'];

function Visual({kind}: {kind: NonNullable<Feature['visual']>}) {
  switch (kind) {
    case 'chips':
      return (
        <div className={styles.visual}>
          <div className={styles.chipStage}>
            {QUICK_TAGS.map((t, i) => (
              <TagChip key={t.name} tone="overlay" name={t.name} color={t.color} ink={t.ink} on={i === 0} />
            ))}
          </div>
        </div>
      );
    case 'window':
      return (
        <div className={styles.visual}>
          <div className={styles.window} aria-label="5 seconds before the tap, 2 seconds after" role="img">
            <span className={styles.before}>5 s before</span>
            <span className={styles.tap}>
              <Icon name="crosshair" size={18} />
            </span>
            <span className={styles.after}>2 s after</span>
          </div>
        </div>
      );
    case 'swatches':
      return (
        <div className={styles.visual} aria-hidden="true">
          {SWATCHES.map((c, i) => (
            <span key={c} className={clsx(styles.swatch, i === 0 && styles.swatchOn)} style={{background: c}} />
          ))}
          <span className={clsx(styles.swatch, styles.swatchCustom)}>
            <Icon name="plus" size={18} />
          </span>
        </div>
      );
  }
}

export default function Features() {
  return (
    <Section id="features" tone="cream" labelledBy="features-title">
      <RevealGroup className={styles.head}>
        <RevealItem>
          <span className="ac-eyebrow">Features</span>
        </RevealItem>
        <RevealItem>
          <h2 id="features-title" className="ac-h2">
            Everything the sideline needs
          </h2>
        </RevealItem>
      </RevealGroup>
      <RevealGroup className={styles.grid}>
        {features.map((f) => (
          // RevealItem owns the entrance transform; the inner card owns the hover lift.
          <RevealItem key={f.id} className={clsx(f.wide && styles.wide)}>
            <div className={clsx(styles.card, f.tone && styles[f.tone])}>
              <span className={styles.icon}>
                <Icon name={f.icon} size={26} />
              </span>
              <h3 className={styles.title}>{f.title}</h3>
              <p className={styles.body}>{f.body}</p>
              {f.visual && <Visual kind={f.visual} />}
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
