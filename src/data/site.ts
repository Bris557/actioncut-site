export type SiteInfo = {
  name: string;
  url: string;
  description: string;
  /** Direct APK link handed to beta testers by email; not linked from the site. */
  apkUrl: string;
  minAndroid: string;
  /** Open question (spec §12): set before the site is published. */
  contactEmail: string | null;
  /** Formspree form (project 3107957750802415056, `formspree.json`) for beta sign-ups and feedback. */
  formEndpoint: string;
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
    'No more digging through hours of game video. Film your kid’s game with your usual camera, tap a floating button at every great play, and get a short clip of each moment — cut right on your phone.',
  apkUrl: '/actioncut-latest.apk',
  minAndroid: 'Android 14 or newer',
  contactEmail: 'pigmentator@gmail.com',
  formEndpoint: 'https://formspree.io/p/3107957750802415056/f/beta',
  publisher: null,
  googlePlayUrl: null,
  appStoreUrl: null,
  copyrightYear: 2026,
};
