import Icon from '../brand/Icon';
import Shape from '../brand/Shapes';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import styles from './FreeLater.module.css';

export default function FreeLater() {
  return (
    <Section tone="brown" labelledBy="free-title" innerClassName={styles.inner}>
      <div className={styles.price} aria-hidden="true">
        <Shape kind="burst" color="var(--ac-orange)" spin className={styles.burst} />
        <span className={styles.priceText}>Free</span>
      </div>
      <RevealGroup>
        <RevealItem>
          <h2 id="free-title" className="ac-h2">
            ActionCut is free.
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="ac-lead">No subscription, no account, no ads — every feature included.</p>
        </RevealItem>
        <RevealItem className={styles.later}>
          <p className={styles.laterLabel}>Coming later — optional extras</p>
          <ul className={styles.extras}>
            <li>
              <Icon name="cloud" size={20} />
              Cloud storage for your clips
            </li>
            <li>
              <Icon name="user" size={20} />
              Athlete profiles
            </li>
          </ul>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}
