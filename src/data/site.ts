export type SiteInfo = {
  name: string;
  url: string;
  description: string;
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
  contactEmail: null,
  publisher: null,
  googlePlayUrl: null,
  appStoreUrl: null,
  copyrightYear: 2026,
};
