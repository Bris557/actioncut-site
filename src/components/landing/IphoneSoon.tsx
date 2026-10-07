import {site} from '@site/src/data/site';
import Icon, {type IconName} from '../brand/Icon';
import Shape from '../brand/Shapes';
import IphoneLiveMock from '../phone/IphoneLiveMock';
import PhoneFrame from '../phone/PhoneFrame';
import Button from '../ui/Button';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import StoreBadge from '../ui/StoreBadge';
import styles from './IphoneSoon.module.css';

const POINTS: {icon: IconName; title: string; body: string}[] = [
  {icon: 'video', title: 'A camera with Mark built in', body: 'Record and mark in one place: tap for an instant, hold for an interval.'},
  {icon: 'zap', title: 'Mark from anywhere', body: 'Control Center, the Lock Screen and the Action Button can mark a moment while an event runs.'},
  {icon: 'smartphone', title: 'Live Activity', body: 'The timer, your moment count and Mark and Interval buttons stay on the Lock Screen.'},
  {icon: 'swap', title: 'Android ⇄ iPhone', body: 'Export an event on one phone and import it on the other.'},
];

export default function IphoneSoon() {
  return (
    <Section id="iphone" tone="brown" labelledBy="iphone-title" innerClassName={styles.inner}>
      <RevealGroup className={styles.copy}>
        <RevealItem>
          <span className="ac-eyebrow">Coming soon</span>
        </RevealItem>
        <RevealItem>
          <h2 id="iphone-title" className="ac-h2">
            ActionCut for iPhone
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="ac-lead">
            iOS doesn’t let a button float over the Camera app — so the iPhone version brings its own camera, with the
            Mark button built in.
          </p>
        </RevealItem>
        <div className={styles.points}>
          {POINTS.map((p) => (
            <RevealItem key={p.title} className={styles.point}>
              <span className={styles.pointIcon}>
                <Icon name={p.icon} size={22} />
              </span>
              <h3 className={styles.pointTitle}>{p.title}</h3>
              <p className={styles.pointBody}>{p.body}</p>
            </RevealItem>
          ))}
        </div>
        <RevealItem className={styles.actions}>
          <StoreBadge label="iPhone" href={site.appStoreUrl} />
          <span className={styles.req}>{site.minIos}</span>
          <Button to="/guide/iphone" variant="ghost">
            What’s different on iPhone
          </Button>
        </RevealItem>
      </RevealGroup>
      <div className={styles.visual}>
        <Shape kind="burst" color="var(--ac-orange)" spin className={styles.burst} />
        <div className={styles.phone}>
          <PhoneFrame platform="iphone" label="Concept: the ActionCut Live Activity on the iPhone Lock Screen with Mark and Interval buttons">
            <IphoneLiveMock />
          </PhoneFrame>
        </div>
      </div>
    </Section>
  );
}
