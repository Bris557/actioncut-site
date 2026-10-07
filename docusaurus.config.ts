import type {Config, Plugin} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Runs in Node.js — no browser APIs here.

// Links to sections of the landing page (`/#…`) would otherwise count as active on every page.
const NEVER_ACTIVE = '(?!)';

/**
 * Docusaurus minifies CSS with cssnano (advanced preset) plus clean-css restructuring. Both merge rules
 * with the same declarations across CSS modules, which can move a one-class modifier (`.on`, `.stepOn`)
 * above its base rule — so the base wins in production only (the hero videos stayed invisible). This
 * swaps in cssnano's default preset without `mergeRules`; everything else is still minified.
 */
function orderSafeCssMinifier(): Plugin {
  return {
    name: 'order-safe-css-minifier',
    configureWebpack(webpackConfig, isServer) {
      const minimizers = webpackConfig.optimization?.minimizer;
      if (isServer || !Array.isArray(minimizers)) return {};
      const i = minimizers.findIndex((m) => m?.constructor?.name === 'CssMinimizerPlugin');
      if (i === -1) return {};
      const CssMinimizer = minimizers[i].constructor as new (options: object) => (typeof minimizers)[number];
      minimizers[i] = new CssMinimizer({minimizerOptions: {preset: ['default', {mergeRules: false}]}});
      return {};
    },
  };
}

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
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/svg+xml', href: '/img/favicon.svg'}},
    {
      tagName: 'noscript',
      attributes: {},
      innerHTML: '<style>[data-reveal]{opacity:1!important;transform:none!important}</style>',
    },
  ],

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wdth,wght,ROND@6..144,25..151,100..1000,0..100&family=Onest:wght@400..700&display=swap',
  ],

  plugins: [orderSafeCssMinifier],

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
    image: 'img/og-card.png',
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
        {to: '/#how-it-works', label: 'How it works', position: 'left', activeBaseRegex: NEVER_ACTIVE},
        {to: '/#use-cases', label: 'Use cases', position: 'left', activeBaseRegex: NEVER_ACTIVE},
        {to: '/#features', label: 'Features', position: 'left', activeBaseRegex: NEVER_ACTIVE},
        {to: '/#faq', label: 'FAQ', position: 'left', activeBaseRegex: NEVER_ACTIVE},
        {to: '/guide', label: 'Guide', position: 'left', activeBaseRegex: '^/guide'},
        {
          type: 'html',
          position: 'right',
          value: '<a class="ac-navbar-cta" href="/#beta">Join the beta</a>',
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
