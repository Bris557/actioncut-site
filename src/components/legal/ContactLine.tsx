import {site} from '@site/src/data/site';

/** Contact sentence for the Privacy Policy; reads the open values in site.ts. */
export default function ContactLine() {
  const publisher = site.publisher ? `ActionCut is published by ${site.publisher}. ` : '';
  if (!site.contactEmail) {
    return <p>{publisher}Contact details will be added here before the site goes live.</p>;
  }
  return (
    <p>
      {publisher}Questions about privacy? Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
    </p>
  );
}
