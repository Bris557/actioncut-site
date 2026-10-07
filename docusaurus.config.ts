import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Runs in Node.js — no browser APIs here.

const config: Config = {
  title: 'ActionCut',
  tagline: 'Tap. Tag. Done. Mark the best moments while you film.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://actioncut.io',
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'}},
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'}},
    {tagName: 'meta', attributes: {name: 'theme-color', content: '#FFF8F6'}},
  ],

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wdth,wght,ROND@6..144,25..151,100..1000,0..100&family=Onest:wght@400..700&display=swap',
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'guide',
          routeBasePath: 'guide',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    metadata: [
      {name: 'keywords', content: 'sports highlights, kids sports video, highlight clips, mark moments, android app'},
    ],
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'ActionCut',
      logo: {alt: 'ActionCut', src: 'img/logo.svg'},
      items: [
        {to: '/#how-it-works', label: 'How it works', position: 'left'},
        {to: '/#use-cases', label: 'Use cases', position: 'left'},
        {to: '/#features', label: 'Features', position: 'left'},
        {to: '/#iphone', label: 'iPhone', position: 'left'},
        {to: '/#faq', label: 'FAQ', position: 'left'},
        {to: '/guide', label: 'Guide', position: 'left', activeBaseRegex: '^/guide'},
        {
          type: 'html',
          position: 'right',
          value: '<a class="ac-navbar-cta" href="/actioncut-latest.apk" download>Download</a>',
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
