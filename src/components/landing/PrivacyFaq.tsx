import Link from '@docusaurus/Link';
import {faqs} from '@site/src/data/faq';
import Icon from '../brand/Icon';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import styles from './PrivacyFaq.module.css';

export default function PrivacyFaq() {
  return (
    <Section id="faq" tone="white" labelledBy="faq-title" innerClassName={styles.inner}>
      <RevealGroup className={styles.privacy}>
        <RevealItem className={styles.card}>
          <span className={styles.lock}>
            <Icon name="lock" size={26} />
          </span>
          <h3 className={styles.cardTitle}>Your videos stay yours</h3>
          <p className={styles.cardBody}>
            ActionCut cuts clips on your phone. Your videos and clips aren’t uploaded, and you don’t need an account. To
            fix bugs, the app sends crash reports and basic usage statistics.
          </p>
          <Link to="/privacy" className={styles.cardLink}>
            Read the Privacy Policy
            <Icon name="arrowRight" size={18} />
          </Link>
        </RevealItem>
      </RevealGroup>

      <div>
        <h2 id="faq-title" className="ac-h2">
          Questions, answered
        </h2>
        <div className={styles.list}>
          {faqs.map((f) => (
            <details key={f.q} className={styles.item}>
              <summary>
                <span>{f.q}</span>
                <Icon name="chevronDown" className={styles.chev} />
              </summary>
              <div className={styles.answer}>
                <p>{f.a}</p>
                {f.link && (
                  <Link to={f.link.to} className={styles.more}>
                    {f.link.label}
                    <Icon name="arrowRight" size={16} />
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
