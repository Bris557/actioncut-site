import Layout from '@theme/Layout';
import Icon from '@site/src/components/brand/Icon';
import Button from '@site/src/components/ui/Button';
import {RevealGroup, RevealItem} from '@site/src/components/ui/Reveal';
import Section from '@site/src/components/ui/Section';
import {releases} from '@site/src/data/changelog';
import {site} from '@site/src/data/site';
import {formatReleaseDate, groupByMonth} from '@site/src/lib/changelog';
import styles from './changelog.module.css';

export default function Changelog() {
  const [latest, ...older] = releases;
  return (
    <Layout title="Changelog" description="What’s new in each version of ActionCut for Android.">
      <main>
        <Section tone="cream" labelledBy="changelog-title" className={styles.top}>
          <span className="ac-eyebrow">Changelog</span>
          <h1 id="changelog-title" className={styles.title}>
            What’s new
          </h1>
          <article className={styles.latest}>
            <div className={styles.meta}>
              <span className={styles.badge}>Latest</span>
              <span className={styles.version}>Version {latest.version}</span>
              <span className={styles.date}>{formatReleaseDate(latest.date)}</span>
            </div>
            <h2 className={styles.latestTitle}>{latest.title}</h2>
            <ul className={styles.highlights}>
              {latest.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <div className={styles.actions}>
              <Button to="/#beta" icon={<Icon name="mail" />}>
                Join the beta
              </Button>
              <span className={styles.req}>Free · {site.minAndroid}</span>
            </div>
          </article>
        </Section>

        <Section tone="white" labelledBy="history-title">
          <h2 id="history-title" className="ac-h2">
            Earlier versions
          </h2>
          {groupByMonth(older).map((month) => (
            <div key={month.label} className={styles.month}>
              <h3 className={styles.monthLabel}>{month.label}</h3>
              <RevealGroup className={styles.list}>
                {month.releases.map((release) => (
                  <RevealItem key={release.version} className={styles.entry}>
                    <div className={styles.meta}>
                      <span className={styles.version}>{release.version}</span>
                      <span className={styles.date}>{formatReleaseDate(release.date)}</span>
                    </div>
                    <h4 className={styles.entryTitle}>{release.title}</h4>
                    <ul className={styles.highlights}>
                      {release.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          ))}
        </Section>
      </main>
    </Layout>
  );
}
