import {mailtoLink} from '../lib/mailto';

export type SiteInfo = {
  name: string;
  url: string;
  description: string;
  /** Direct APK link handed to beta testers by email; not linked from the site. */
  apkUrl: string;
  minAndroid: string;
  minIos: string;
  /** Open question (spec §12): set before the site is published. */
  contactEmail: string | null;
  /** Open question (spec §12): set before the site is published. */
  publisher: string | null;
  googlePlayUrl: string | null;
  appStoreUrl: string | null;
  /** Fixed at build time so server and client render the same year. */
  copyrightYear: number;
};

export const site: SiteInfo = {
  name: 'ActionCut',
  url: 'https://actioncut.io',
  description:
    'Film your kid’s game with your usual camera, tap a floating button at every great play, and get a short clip of each moment — cut right on your phone.',
  apkUrl: '/actioncut-latest.apk',
  minAndroid: 'Android 14 or newer',
  minIos: 'iOS 26 or newer',
  contactEmail: 'pigmentator@gmail.com',
  publisher: null,
  googlePlayUrl: null,
  appStoreUrl: null,
  copyrightYear: 2026,
};

/** "Join the beta" email with a short template the tester fills in. */
export function betaMailto(): string {
  return mailtoLink(
    site.contactEmail ?? '',
    'ActionCut beta',
    'Hi! I’d like to test ActionCut.\n\nPhone model:\nAndroid version:\nSport I film:\n',
  );
}
