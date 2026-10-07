import {betaMailto, site} from '@site/src/data/site';
import Icon, {type IconName} from '../brand/Icon';
import Shape from '../brand/Shapes';
import Button from '../ui/Button';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import {StoreBadges} from '../ui/StoreBadge';
import styles from './Beta.module.css';

const STEPS: {icon: IconName; title: string; body: string}[] = [
  {icon: 'mail', title: 'Email us', body: 'Tell us your phone model, its Android version and the sport you film.'},
  {icon: 'download', title: 'Get the test version', body: 'We reply with a link to install ActionCut on your phone.'},
  {icon: 'crosshair', title: 'Film a game, tell us how it went', body: 'What worked, what didn’t, what you wish it did.'},
];

export default function Beta() {
  return (
    <Section id="beta" tone="cream" labelledBy="beta-title" innerClassName={styles.inner}>
      <Shape kind="cookie9" color="var(--ac-container-high)" spin className={styles.shape} />
      <RevealGroup className={styles.copy}>
        <RevealItem>
          <span className="ac-eyebrow">Beta testing</span>
        </RevealItem>
        <RevealItem>
          <h2 id="beta-title" className="ac-h2">
            Try ActionCut before everyone else
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="ac-lead">
            ActionCut is in testing before it arrives on Google Play and the App Store. Send us an email and we’ll
            reply with the test version. For now it’s Android-only and needs {site.minAndroid}.
          </p>
        </RevealItem>
        <RevealItem className={styles.actions}>
          <Button href={betaMailto()} size="l" icon={<Icon name="mail" />}>
            Email us to join the beta
          </Button>
          <StoreBadges />
        </RevealItem>
        <RevealItem>
          <p className={styles.address}>
            Or write to <a href={`mailto:${site.contactEmail ?? ''}`}>{site.contactEmail}</a>
          </p>
        </RevealItem>
      </RevealGroup>
      <ol className={styles.steps}>
        {STEPS.map((step, i) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.stepIcon}>
              <Icon name={step.icon} size={22} />
            </span>
            <span className={styles.stepText}>
              <span className={styles.stepTitle}>
                {i + 1}. {step.title}
              </span>
              <span className={styles.stepBody}>{step.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
