import Link from '@docusaurus/Link';
import Logo from '@site/src/components/brand/Logo';
import {site} from '@site/src/data/site';
import styles from './styles.module.css';

const COLUMNS: {title: string; links: {label: string; to: string}[]}[] = [
  {
    title: 'Product',
    links: [
      {label: 'How it works', to: '/#how-it-works'},
      {label: 'Use cases', to: '/#use-cases'},
      {label: 'Features', to: '/#features'},
      {label: 'iPhone', to: '/#iphone'},
    ],
  },
  {
    title: 'Help',
    links: [
      {label: 'Guide', to: '/guide'},
      {label: 'Troubleshooting', to: '/guide/troubleshooting'},
      {label: 'FAQ', to: '/#faq'},
      {label: 'Changelog', to: '/changelog'},
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo />
          <p>Mark the best moments while you film.</p>
          <a className={styles.download} href={site.apkUrl} download>
            Download for Android
          </a>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title} className={styles.col}>
            <p className={styles.colTitle}>{col.title}</p>
            <ul>
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <nav aria-label="Legal" className={styles.col}>
          <p className={styles.colTitle}>Legal</p>
          <ul>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            {site.contactEmail && (
              <li>
                <a href={`mailto:${site.contactEmail}`}>Contact</a>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <div className={styles.bottom}>© {site.copyrightYear} ActionCut</div>
    </footer>
  );
}
