import Link from '@docusaurus/Link';
import {site} from '@site/src/data/site';

/** Contact sentence for the Privacy Policy: all contact goes through the form on the home page. */
export default function ContactLine() {
  const publisher = site.publisher ? `ActionCut is published by ${site.publisher}. ` : '';
  return (
    <p>
      {publisher}Questions about privacy, or a request about your data? Write to us through the{' '}
      <Link to="/#beta">form on the home page</Link> — choose Send feedback.
    </p>
  );
}
