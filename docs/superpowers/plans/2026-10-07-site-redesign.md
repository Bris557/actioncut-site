# actioncut.io Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the template Docusaurus site with a light, animated "Matchday" site for ActionCut (landing, Guide, Changelog, Privacy) that matches the Android app's Material 3 Expressive design and only promises what the app does.

**Architecture:** Stay on Docusaurus 3.8.1. The landing page is a React page composed of one component per section, all copy lives in `src/data/*`, pure logic (demo gesture rules, hero loop, changelog grouping, shapes) lives in `src/lib/*` with vitest tests. App screens are HTML/CSS recreations (`src/components/phone/*`) scaled with container units. Guide articles are MDX docs in `guide/` served at `/guide`.

**Tech Stack:** Docusaurus 3.8.1, React 19, TypeScript 5.6, `motion` 12 (`motion/react`), vitest 4, CSS Modules, Google Fonts (Google Sans Flex, Onest). Visual checks with the Playwright MCP tools.

**Spec:** `docs/superpowers/specs/2026-10-07-site-redesign-design.md` (read it before starting; sections are referenced as "spec §N").

## Global Constraints

- Work on branch `site-redesign`. Commit at the end of every task; every commit message ends with a blank line and `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Package manager: **npm** (`package-lock.json`). Node on this machine is v25.
- Dependencies: add only `motion@^12.43.0` (runtime) and `vitest@^4.1.11` (dev). Import motion from `motion/react`.
- Light theme only: `colorMode: {defaultMode: 'light', disableSwitch: true, respectPrefersColorScheme: false}`.
- Site copy is **English only**, curly apostrophes (’) and real dashes (—) in visible copy.
- Colors only through the CSS tokens of spec §3.1 (`--ac-*`), except the fixed scene/tag colors listed in this plan.
- Never claim: merging clips into one video, "zero data collection", "fully offline", "free forever". Facts must match spec §9.
- The APK link is always a plain `<a href="/actioncut-latest.apk" download>` — never Docusaurus `<Link>` and never `to=`.
- No `Date.now()`, `Math.random()`, `window` or `matchMedia` during render. Browser APIs only in effects and event handlers. First client render must equal the server render.
- Reduced motion: `MotionConfig reducedMotion="user"` at the root, the global CSS rule in `custom.css`, and per-component `@media (prefers-reduced-motion: reduce)` rules for scroll-bound styles. Never branch render output on `useReducedMotion()`.
- Every page works from 360 px wide with no horizontal page scroll.
- Icons: the `Icon` component only. No emoji anywhere.
- Docusaurus must build with `onBrokenLinks: 'throw'` and `onBrokenMarkdownLinks: 'throw'`.

## Review Focus

1. **A 360-px phone.** Hero headline, use-case tabs and the feature bento must wrap or scroll inside their own box; the page itself never scrolls sideways. → Task 5 and Task 10 measure `scrollWidth − clientWidth === 0` at 360 px on every page.
2. **JavaScript off or slow.** Anything that enters with `RevealItem` (initial `opacity: 0`) must still be readable. → Task 2 adds a `<noscript>` override; Task 10 greps the built HTML for it.
3. **Demo button on a touch phone.** The finger slides off, the browser fires `pointercancel`, or a long press tries to open the context menu: no interval may stay stuck "holding", no menu may open. → Task 3 unit-tests `cancel`; Task 6 fires `pointercancel` in the browser and checks the state.
4. **Hydration.** Ticking counters and clocks render on the server; any difference on the first client render throws React errors #418/#423/#425. → Tasks 5, 6 and 10 check the console for them.
5. **Docs on a phone after the navbar restyle.** A `backdrop-filter` on `.navbar` would trap the fixed mobile sidebar inside the pill. → Task 2 opens the hamburger at 390 px and checks the sidebar is full height.

## Browser check procedure

Used by several tasks. Run from the repo root.

1. `npm run build` — must exit 0.
2. Start the server in the background (Bash `run_in_background: true`): `npx docusaurus serve --port 3210 --no-open`.
3. With the Playwright MCP tools: `browser_navigate` to `http://localhost:3210<path>`; `browser_resize` to the widths named in the task; `browser_take_screenshot` with `fullPage: true`; `browser_console_messages` must contain no errors; `browser_evaluate` with `() => document.documentElement.scrollWidth - document.documentElement.clientWidth` must return `0`.
4. Stop the server when the task is done (`TaskStop`, or `pkill -f "docusaurus serve --port 3210"`).

## File map

| Path | Responsibility | Task |
|---|---|---|
| `docusaurus.config.ts`, `sidebars.ts`, `vitest.config.ts`, `package.json` | site config, Guide sidebar, tests | 1, 2, 8 |
| `src/css/custom.css` | tokens, Infima mapping, base, navbar pill, Guide styles | 1, 2, 8 |
| `src/data/site.ts`, `tags.ts` | site constants, tag colors | 1 |
| `src/data/steps.ts`, `useCases.ts`, `features.ts`, `benefits.ts`, `faq.ts`, `changelog.ts` | landing and changelog copy | 5, 7, 9, 10 |
| `src/lib/shapes.ts`, `text.ts`, `groupShape.ts`, `markGesture.ts`, `heroLoop.ts`, `changelog.ts` (+ `*.test.ts`) | pure logic | 2, 3, 4, 5, 9 |
| `src/components/brand/` | `Icon`, `Logo`, `Shapes` | 2 |
| `src/components/ui/` | `Button`, `StoreBadge`, `TagChip`, `Section`, `Reveal` | 2 |
| `src/components/phone/` | `PhoneFrame`, `Screen`, `Scene`, `MockBits`, five app mocks | 4 |
| `src/components/landing/` | one component per landing section | 5, 6, 7, 10 |
| `src/components/legal/ContactLine.tsx` | contact sentence for Privacy | 9 |
| `src/theme/Root.tsx`, `src/theme/Footer/`, `src/theme/MDXComponents.tsx` | motion config, footer, MDX globals | 2, 9, 8 |
| `src/pages/index.tsx`, `changelog.tsx`, `privacy.mdx` | pages | 1→10, 9 |
| `guide/*.mdx` | 11 Guide articles | 1, 8 |
| `static/img/` | `logo.svg`, `favicon.svg`, `favicon.ico`, `og-card.png`, `screens/` | 2, 11 |
| `scripts/og-card.html` | source of the social card | 11 |
| `CLAUDE.md`, `README.md` | contributor docs | 11 |

---

### Task 1: Clean slate and foundation

**Files:**
- Delete: `blog/`, `docs/intro.md`, `docs/tutorial-basics/`, `docs/tutorial-extras/`, `src/pages/actioncut.tsx`, `src/pages/markdown-page.md`, `src/pages/index.module.css`, `src/components/HomepageFeatures/`, `static/img/undraw_docusaurus_mountain.svg`, `static/img/undraw_docusaurus_react.svg`, `static/img/undraw_docusaurus_tree.svg`, `static/img/docusaurus.png`, `static/img/docusaurus-social-card.jpg`, `site.md`
- Modify: `package.json`, `docusaurus.config.ts`, `sidebars.ts`, `src/css/custom.css`, `src/pages/index.tsx`
- Create: `vitest.config.ts`, `src/data/site.ts`, `src/data/tags.ts`, `guide/getting-started.mdx`
- Keep for now: `src/pages/changelog.tsx` (replaced in Task 9), `static/actioncut-*.apk`, `static/.nojekyll`

**Interfaces:**
- Produces: `site: SiteInfo` from `src/data/site.ts` with fields `name, url, description, apkUrl ('/actioncut-latest.apk'), minAndroid ('Android 14 or newer'), minIos ('iOS 26 or newer'), contactEmail: string | null, publisher: string | null, googlePlayUrl: string | null, appStoreUrl: string | null, copyrightYear: 2026`.
- Produces: `TAGS` and `QUICK_TAGS` from `src/data/tags.ts`; each tag is `TagInfo = {name: string; color: string; ink: string}` (`ink` = readable text color on the filled chip).
- Produces: CSS tokens `--ac-*` and global classes `.ac-eyebrow`, `.ac-h2`, `.ac-lead`, `.ac-tnum`, `.ac-cyr`, `.ac-sr-only`; per-section text color hook `--section-muted`.
- Produces: docs plugin at `path: 'guide'`, `routeBasePath: 'guide'`; sidebar id `guideSidebar`; `/guide` = `guide/getting-started.mdx` (`slug: /`).

- [ ] **Step 1: Confirm the branch**

Run: `git branch --show-current`
Expected: `site-redesign`

- [ ] **Step 2: Delete the template content**

```bash
git rm -rq blog docs/intro.md docs/tutorial-basics docs/tutorial-extras \
  src/pages/actioncut.tsx src/pages/markdown-page.md src/pages/index.module.css \
  src/components/HomepageFeatures \
  static/img/undraw_docusaurus_mountain.svg static/img/undraw_docusaurus_react.svg \
  static/img/undraw_docusaurus_tree.svg static/img/docusaurus.png \
  static/img/docusaurus-social-card.jpg site.md
git status --short | head -30
```
Expected: only `D` lines for the files above.

- [ ] **Step 3: Install dependencies and add the test script**

```bash
npm install motion@^12.43.0
npm install -D vitest@^4.1.11
npm pkg set name=actioncut-site
npm pkg set scripts.test="vitest run --passWithNoTests"
```
Expected: `package.json` lists `"motion": "^12.43.0"` in `dependencies`, `"vitest": "^4.1.11"` in `devDependencies`, and `"test": "vitest run --passWithNoTests"`.

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 5: Create `src/data/site.ts`**

```ts
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
```

- [ ] **Step 6: Create `src/data/tags.ts`**

Colors are the app's default tags (`TagSeeds.kt`). `ink` keeps chip text at ≥ 4.5:1 on the filled color.

```ts
export type TagInfo = {name: string; color: string; ink: string};

const DARK_INK = '#1a0e08';

export const TAGS = {
  goal: {name: 'Goal', color: '#FF7A1A', ink: DARK_INK},
  save: {name: 'Save', color: '#0090FF', ink: DARK_INK},
  assist: {name: 'Assist', color: '#8E4EC6', ink: '#FFFFFF'},
  skill: {name: 'Skill', color: '#12A594', ink: DARK_INK},
  funny: {name: 'Funny', color: '#E5489A', ink: DARK_INK},
} satisfies Record<string, TagInfo>;

/** The three tags the app puts in quick access by default. */
export const QUICK_TAGS: TagInfo[] = [TAGS.goal, TAGS.save, TAGS.assist];

export function tagColor(name: string): string {
  const tag = Object.values(TAGS).find((t) => t.name === name);
  return tag ? tag.color : '#8C7264';
}
```

- [ ] **Step 7: Replace `docusaurus.config.ts`**

```ts
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
```

- [ ] **Step 8: Replace `sidebars.ts`**

```ts
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  guideSidebar: [
    {type: 'category', label: 'Basics', collapsible: false, items: ['getting-started']},
  ],
};

export default sidebars;
```

- [ ] **Step 9: Replace `src/css/custom.css`**

```css
/* ActionCut design tokens — light scheme of the Android app (spec §3.1). */
:root {
  --ac-orange: #ff7a1a;
  --ac-on-orange: #5e2700;
  --ac-orange-hover: #ff8a33;
  --ac-primary: #9c4500;
  --ac-surface: #fff8f6;
  --ac-cream: #fff1eb;
  --ac-item: #ffffff;
  --ac-container-high: #fbe3d8;
  --ac-ink: #251912;
  --ac-ink-2: #584236;
  --ac-outline: #8c7264;
  --ac-outline-variant: #e0c0b1;
  --ac-secondary-container: #feab7c;
  --ac-on-secondary-container: #783d17;
  --ac-blue: #00aaf2;
  --ac-on-blue: #003b57;
  --ac-tertiary: #006491;
  --ac-brown: #3b2d26;
  --ac-on-brown: #ffede5;
  --ac-on-brown-2: #e9d3c8;
  --ac-inverse-primary: #ffb68e;
  --ac-on-inverse-primary: #542200;
  --ac-live: #ff5a4f;
  --ac-live-container: #ffdad6;
  --ac-on-live-container: #93000a;
  --ac-info: #ddeffa;
  --ac-on-info: #004c6e;
  --ac-favorite: #d93a3a;

  --ac-radius-s: 12px;
  --ac-radius-m: 20px;
  --ac-radius-l: 28px;
  --ac-radius-sheet: 40px;

  --ac-font: 'Google Sans Flex', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --ac-font-cyr: 'Onest', var(--ac-font);
  --ac-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ac-ease-out: cubic-bezier(0.2, 0, 0, 1);

  /* Infima mapping */
  --ifm-color-primary: #9c4500;
  --ifm-color-primary-dark: #8c3e00;
  --ifm-color-primary-darker: #853b00;
  --ifm-color-primary-darkest: #6d3000;
  --ifm-color-primary-light: #ac4c00;
  --ifm-color-primary-lighter: #b35000;
  --ifm-color-primary-lightest: #ca5a00;
  --ifm-background-color: var(--ac-surface);
  --ifm-background-surface-color: var(--ac-item);
  --ifm-font-family-base: var(--ac-font);
  --ifm-heading-font-family: var(--ac-font);
  --ifm-font-color-base: var(--ac-ink);
  --ifm-heading-color: var(--ac-ink);
  --ifm-color-content-secondary: var(--ac-ink-2);
  --ifm-link-color: var(--ac-primary);
  --ifm-link-hover-color: var(--ac-ink);
  --ifm-font-size-base: 106.25%;
  --ifm-line-height-base: 1.55;
  --ifm-heading-font-weight: 700;
  --ifm-global-radius: 12px;
  --ifm-color-emphasis-300: var(--ac-outline-variant);
  --ifm-toc-border-color: var(--ac-outline-variant);
  --ifm-hr-background-color: var(--ac-outline-variant);
  --ifm-navbar-height: 76px;
  --ifm-navbar-background-color: transparent;
  --ifm-navbar-shadow: none;
  --ifm-menu-color: var(--ac-ink-2);
  --ifm-menu-color-active: var(--ac-primary);
  --ifm-menu-color-background-active: var(--ac-container-high);
  --ifm-menu-color-background-hover: var(--ac-cream);
  --ifm-container-width-xl: 1240px;
  --ifm-code-background: var(--ac-cream);
}

html {
  background: var(--ac-surface);
  scroll-behavior: smooth;
  scroll-padding-top: 96px;
  -webkit-text-size-adjust: 100%;
}

body {
  background: var(--ac-surface);
  text-rendering: optimizeLegibility;
}

h1,
h2,
h3,
h4 {
  font-variation-settings: 'ROND' 100;
  letter-spacing: -0.015em;
  text-wrap: balance;
}

p {
  text-wrap: pretty;
}

::selection {
  background: var(--ac-secondary-container);
  color: var(--ac-ink);
}

:focus-visible {
  outline: 3px solid var(--ac-primary);
  outline-offset: 3px;
}

.ac-tnum {
  font-variant-numeric: tabular-nums;
}

.ac-cyr {
  font-family: var(--ac-font-cyr);
}

.ac-eyebrow {
  display: inline-block;
  margin-bottom: 14px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--section-muted, var(--ac-primary));
}

.ac-h2 {
  margin: 0 0 18px;
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1.02;
  font-weight: 720;
  letter-spacing: -0.025em;
  color: inherit;
}

.ac-lead {
  margin: 0;
  max-width: 40rem;
  font-size: clamp(18px, 1.6vw, 21px);
  line-height: 1.5;
  color: var(--section-muted, var(--ac-ink-2));
}

.ac-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 10: Create `guide/getting-started.mdx`**

```mdx
---
title: Getting started
description: Install ActionCut on your Android phone and allow the permissions it needs.
slug: /
sidebar_label: Getting started
---

ActionCut keeps the best moments of a game without any editing. You film with your usual camera app, tap a floating button whenever something great happens, and ActionCut cuts a short clip around each tap.

## What you need

- An Android phone running **Android 14 or newer**.
- The camera app you already use. ActionCut doesn’t record video itself.
- Five minutes before the game to install the app and allow its permissions.

## Install the app

1. On your phone, open this site and tap **Download for Android**.
2. Open the downloaded file, `actioncut-latest.apk`, from your notifications or the Files app.
3. If Android asks, allow your browser or Files app to **install unknown apps**, then go back and tap **Install**.
4. Open **ActionCut**.

:::info Why not Google Play?
ActionCut is coming to Google Play soon. Until then you install it straight from this site, and you update it the same way: download the latest file and install it over the old one. Your events and moments stay.
:::

## Allow permissions

ActionCut asks for permissions the first time you start an event. If one is missing later, Home shows a banner — **ActionCut needs permissions** — with a **Grant** button.

| Permission | Why ActionCut needs it |
|---|---|
| **Display over other apps** | Shows the floating button on top of your camera app. |
| **Photos and videos** | Finds the videos you recorded during an event so it can cut clips from them, and saves clips to your gallery. Choose **Allow all** — with limited access ActionCut only sees the videos you pick. |
| **Notifications** (optional) | Shows that an event is in progress while you film. |

:::tip
ActionCut never uploads your videos. Every clip is cut on your phone.
:::

## Next

Start your first event — the next page walks through a game from kick-off to the final whistle.
```

- [ ] **Step 11: Replace `src/pages/index.tsx` with a minimal page (rebuilt in Tasks 4–10)**

```tsx
import Layout from '@theme/Layout';
import {site} from '@site/src/data/site';

export default function Home() {
  return (
    <Layout title="Highlight clips from every game" description={site.description}>
      <main className="container margin-vert--xl">
        <h1>Tap. Tag. Done.</h1>
        <p>
          <a href={site.apkUrl} download>
            Download for Android
          </a>
        </p>
      </main>
    </Layout>
  );
}
```

- [ ] **Step 12: Typecheck, test, build**

Run: `npm run typecheck && npm test && npm run build`
Expected: typecheck prints nothing; vitest prints `No test files found, exiting with code 0`; build ends with `[SUCCESS] Generated static files in "build".` (warnings about `/#…` anchors that don't exist yet are fine).

- [ ] **Step 13: Check the APK link and the Guide route in the output**

Run: `grep -o 'href="/actioncut-latest.apk"' build/index.html | head -2; ls build/guide/index.html`
Expected: at least one `href="/actioncut-latest.apk"` and the file path printed.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "chore(site): remove the Docusaurus template, add tokens, config and Guide skeleton

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Brand and UI kit

**Files:**
- Create: `src/lib/shapes.ts`, `src/lib/shapes.test.ts`, `src/lib/text.ts`, `src/lib/text.test.ts`
- Create: `src/components/brand/Icon.tsx`, `src/components/brand/Logo.tsx`, `src/components/brand/Logo.module.css`, `src/components/brand/Shapes.tsx`, `src/components/brand/Shapes.module.css`
- Create: `src/components/ui/Button.tsx`, `Button.module.css`, `StoreBadge.tsx`, `StoreBadge.module.css`, `TagChip.tsx`, `TagChip.module.css`, `Section.tsx`, `Section.module.css`, `Reveal.tsx`
- Create: `src/theme/Root.tsx`, `static/img/logo.svg`, `static/img/favicon.svg`
- Replace: `static/img/favicon.ico`
- Modify: `docusaurus.config.ts` (headTags), `src/css/custom.css` (navbar)

**Interfaces:**
- Produces: `polarPath(lobes: number, amplitude: number, steps?: number): string` (viewBox 0 0 100 100).
- Produces: `containsCyrillic(text: string): boolean`.
- Produces: `Icon({name: IconName, size?: number, className?: string, strokeWidth?: number, fill?: string, title?: string})`; `IconName` = `'crosshair' | 'tag' | 'scissors' | 'timer' | 'layers' | 'heart' | 'scan' | 'download' | 'share' | 'palette' | 'fileUp' | 'sunMoon' | 'video' | 'smartphone' | 'check' | 'play' | 'stop' | 'chevronLeft' | 'chevronRight' | 'chevronDown' | 'plus' | 'help' | 'settings' | 'more' | 'pencil' | 'arrowLeft' | 'arrowRight' | 'lock' | 'cloud' | 'user' | 'zap' | 'interval' | 'swap'`.
- Produces: `Logo()`; `Shape({kind: ShapeKind, color: string, className?: string, spin?: boolean})`, `ShapeKind = 'cookie9' | 'cookie12' | 'clover' | 'burst' | 'pill'`.
- Produces: `Button` — props `{children, variant?: 'filled' | 'tonal' | 'dark' | 'ghost', size?: 'm' | 'l', icon?: ReactNode, className?}` plus exactly one of `{to}` (internal route), `{href, download?}` (plain link), `{onClick}`.
- Produces: `StoreBadge({label: string, caption?: string, href?: string | null})`.
- Produces: `TagChip({name, color, ink?, on?, tone?: 'surface' | 'overlay', className?})`; size follows CSS var `--chip-font` (default 14px).
- Produces: `Section({id?, tone: 'cream' | 'white' | 'orange' | 'blue' | 'brown', labelledBy?, className?, innerClassName?, children})`; sets `--section-muted` per tone.
- Produces: `RevealGroup({children, className?})`, `RevealItem({children, className?})` (named exports of `Reveal.tsx`); items carry `data-reveal=""`.

- [ ] **Step 1: Write the failing tests for the pure helpers**

`src/lib/shapes.test.ts`:
```ts
import {describe, expect, it} from 'vitest';
import {polarPath} from './shapes';

describe('polarPath', () => {
  it('starts at the top centre and closes the path', () => {
    const d = polarPath(9, 0.06);
    expect(d.startsWith('M50.0 0.0')).toBe(true);
    expect(d.endsWith('Z')).toBe(true);
  });

  it('has one point per step', () => {
    const d = polarPath(4, 0.2, 60);
    expect(d.split('L')).toHaveLength(60);
  });

  it('keeps every point inside the 100×100 box', () => {
    const numbers = polarPath(12, 0.045).replace(/[MLZ]/g, ' ').trim().split(/\s+/).map(Number);
    expect(numbers.every((n) => n >= 0 && n <= 100)).toBe(true);
  });
});
```

`src/lib/text.test.ts`:
```ts
import {describe, expect, it} from 'vitest';
import {containsCyrillic} from './text';

describe('containsCyrillic', () => {
  it('detects Cyrillic letters anywhere in the string', () => {
    expect(containsCyrillic('Полуфинал против Львов')).toBe(true);
    expect(containsCyrillic('Game 2 — Ёлка')).toBe(true);
  });

  it('is false for Latin text', () => {
    expect(containsCyrillic('Semi-final vs Lions')).toBe(false);
  });
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./shapes"` and `"./text"`.

- [ ] **Step 3: Implement the helpers**

`src/lib/shapes.ts`:
```ts
/**
 * Closed SVG path (viewBox 0 0 100 100) of a rounded shape with `lobes` bumps:
 * the Material 3 Expressive "cookie" and "clover" family.
 * Rounded to one decimal so server and browser produce the same string.
 */
export function polarPath(lobes: number, amplitude: number, steps = 240): string {
  const points: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const r = 50 * (1 - amplitude + amplitude * Math.cos(lobes * t));
    points.push(`${(50 + r * Math.sin(t)).toFixed(1)} ${(50 - r * Math.cos(t)).toFixed(1)}`);
  }
  return `M${points.join('L')}Z`;
}
```

`src/lib/text.ts`:
```ts
const CYRILLIC = /[Ѐ-ӿ]/;

/** Mirrors the app's UserText rule: Cyrillic user text renders in Onest. */
export function containsCyrillic(text: string): boolean {
  return CYRILLIC.test(text);
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test`
Expected: PASS, 5 tests.

- [ ] **Step 5: Create `src/components/brand/Icon.tsx`**

```tsx
import type {ReactNode} from 'react';

export type IconName =
  | 'crosshair' | 'tag' | 'scissors' | 'timer' | 'layers' | 'heart' | 'scan' | 'download'
  | 'share' | 'palette' | 'fileUp' | 'sunMoon' | 'video' | 'smartphone' | 'check' | 'play'
  | 'stop' | 'chevronLeft' | 'chevronRight' | 'chevronDown' | 'plus' | 'help' | 'settings'
  | 'more' | 'pencil' | 'arrowLeft' | 'arrowRight' | 'lock' | 'cloud' | 'user' | 'zap'
  | 'interval' | 'swap';

const PATHS: Record<IconName, ReactNode> = {
  crosshair: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </>
  ),
  tag: (
    <>
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="6" r="3" />
      <path d="M8.12 8.12 12 12" />
      <path d="M20 4 8.12 15.88" />
      <circle cx="6" cy="18" r="3" />
      <path d="M14.8 14.8 20 20" />
    </>
  ),
  timer: (
    <>
      <path d="M10 2h4" />
      <path d="m12 14 3-3" />
      <circle cx="12" cy="14" r="8" />
    </>
  ),
  layers: (
    <>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </>
  ),
  heart: (
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  ),
  scan: (
    <>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="3" />
      <path d="m16 16-1.9-1.9" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.59 13.51 6.83 3.98" />
      <path d="m15.41 6.51-6.82 3.98" />
    </>
  ),
  palette: (
    <>
      <circle cx="13.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="6.5" cy="12.5" r="1" fill="currentColor" stroke="none" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.55-2.5 5.55-5.55C21.97 6.01 17.46 2 12 2z" />
    </>
  ),
  fileUp: (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M12 12v6" />
      <path d="m15 15-3-3-3 3" />
    </>
  ),
  sunMoon: (
    <>
      <path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" />
    </>
  ),
  video: (
    <>
      <path d="m16 13 5.22 3.48a.5.5 0 0 0 .78-.42V7.87a.5.5 0 0 0-.75-.43L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </>
  ),
  smartphone: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  play: <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />,
  stop: <rect x="5" y="5" width="14" height="14" rx="3" fill="currentColor" stroke="none" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.6" />
      <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  settings: (
    <>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  more: (
    <>
      <circle cx="12" cy="5" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.8" fill="currentColor" stroke="none" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 20h4L19 9l-4-4L4 16v4z" />
      <path d="m13.5 6.5 4 4" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  cloud: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </>
  ),
  zap: (
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  ),
  interval: (
    <>
      <path d="M3 12h18" />
      <path d="m7 8-4 4 4 4" />
      <path d="m17 8 4 4-4 4" />
    </>
  ),
  swap: (
    <>
      <path d="m16 3 4 4-4 4" />
      <path d="M20 7H4" />
      <path d="m8 21-4-4 4-4" />
      <path d="M4 17h16" />
    </>
  ),
};

type Props = {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  fill?: string;
  /** When set, the icon is announced; otherwise it is decorative. */
  title?: string;
};

export default function Icon({name, size = 24, className, strokeWidth = 2, fill = 'none', title}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false">
      {title && <title>{title}</title>}
      {PATHS[name]}
    </svg>
  );
}
```

- [ ] **Step 6: Create `Logo` and `Shapes`**

`src/components/brand/Logo.tsx`:
```tsx
import Icon from './Icon';
import styles from './Logo.module.css';

export default function Logo() {
  return (
    <span className={styles.logo}>
      <span className={styles.badge}>
        <Icon name="crosshair" size={22} />
      </span>
      <span>ActionCut</span>
    </span>
  );
}
```

`src/components/brand/Logo.module.css`:
```css
.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 750;
  letter-spacing: -0.01em;
  font-variation-settings: 'ROND' 100;
  color: var(--ac-ink);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: var(--ac-orange);
  color: #fff;
}
```

`src/components/brand/Shapes.tsx`:
```tsx
import clsx from 'clsx';
import {polarPath} from '@site/src/lib/shapes';
import styles from './Shapes.module.css';

export type ShapeKind = 'cookie9' | 'cookie12' | 'clover' | 'burst' | 'pill';

const PATHS: Record<Exclude<ShapeKind, 'pill'>, string> = {
  cookie9: polarPath(9, 0.06),
  cookie12: polarPath(12, 0.045),
  clover: polarPath(4, 0.2),
  burst: polarPath(10, 0.1),
};

type Props = {
  kind: ShapeKind;
  color: string;
  className?: string;
  /** Slow continuous rotation (off under reduced motion). */
  spin?: boolean;
};

export default function Shape({kind, color, className, spin = false}: Props) {
  if (kind === 'pill') {
    return (
      <svg viewBox="0 0 100 50" aria-hidden="true" focusable="false" className={clsx(styles.shape, className)}>
        <rect width="100" height="50" rx="25" fill={color} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className={clsx(styles.shape, className)}>
      <path d={PATHS[kind]} fill={color} className={spin ? styles.spin : undefined} />
    </svg>
  );
}
```

`src/components/brand/Shapes.module.css`:
```css
.shape {
  display: block;
  pointer-events: none;
  overflow: visible;
}

.spin {
  transform-box: fill-box;
  transform-origin: center;
  animation: spin 48s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```
(Rotation lives on the `<path>`, so the `<svg>` stays free for positioning transforms.)

- [ ] **Step 7: Create `Button`**

`src/components/ui/Button.tsx`:
```tsx
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import type {ReactNode} from 'react';
import styles from './Button.module.css';

type Common = {
  children: ReactNode;
  variant?: 'filled' | 'tonal' | 'dark' | 'ghost';
  size?: 'm' | 'l';
  icon?: ReactNode;
  className?: string;
};

type Props = Common &
  (
    | {to: string; href?: never; download?: never; onClick?: never}
    | {href: string; download?: boolean; to?: never; onClick?: never}
    | {onClick: () => void; to?: never; href?: never; download?: never}
  );

export default function Button(props: Props) {
  const {children, variant = 'filled', size = 'm', icon, className} = props;
  const cls = clsx(styles.btn, styles[variant], styles[size], className);
  const content = (
    <>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </>
  );
  if (props.to !== undefined) {
    return (
      <Link to={props.to} className={cls}>
        {content}
      </Link>
    );
  }
  if (props.href !== undefined) {
    return (
      <a href={props.href} download={props.download || undefined} className={cls}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={props.onClick} className={cls}>
      {content}
    </button>
  );
}
```

`src/components/ui/Button.module.css`:
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: 9999px;
  font: inherit;
  font-weight: 650;
  text-decoration: none !important;
  white-space: nowrap;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    border-radius 0.35s var(--ac-ease-spring),
    transform 0.35s var(--ac-ease-spring),
    background-color 0.2s,
    box-shadow 0.2s;
}

/* M3 Expressive pressed shape: pill → rounded square. */
.btn:active {
  border-radius: 16px;
  transform: scale(0.97);
}

.m {
  height: 48px;
  padding: 0 22px;
  font-size: 16px;
}

.l {
  height: 60px;
  padding: 0 28px 0 24px;
  font-size: 18px;
}

.filled {
  background: var(--ac-orange);
  color: var(--ac-on-orange) !important;
  box-shadow: 0 6px 16px rgba(156, 69, 0, 0.22);
}

.filled:hover {
  background: var(--ac-orange-hover);
  box-shadow: 0 10px 24px rgba(156, 69, 0, 0.28);
}

.tonal {
  background: var(--ac-secondary-container);
  color: var(--ac-on-secondary-container) !important;
}

.dark {
  background: var(--ac-ink);
  color: var(--ac-cream) !important;
}

.dark:hover {
  background: #3b2d26;
}

.ghost {
  background: transparent;
  color: inherit !important;
  box-shadow: inset 0 0 0 1.5px currentColor;
}

.icon {
  display: inline-flex;
}

.icon svg {
  width: 22px;
  height: 22px;
}
```

- [ ] **Step 8: Create `StoreBadge` and `TagChip`**

`src/components/ui/StoreBadge.tsx`:
```tsx
import clsx from 'clsx';
import Icon from '../brand/Icon';
import styles from './StoreBadge.module.css';

type Props = {label: string; caption?: string; href?: string | null};

/** Generic "coming soon" badge — not a store's official artwork. */
export default function StoreBadge({label, caption = 'Coming soon', href}: Props) {
  const body = (
    <>
      <Icon name="smartphone" size={22} />
      <span className={styles.text}>
        <span className={styles.caption}>{caption}</span>
        <span className={styles.label}>{label}</span>
      </span>
    </>
  );
  return href ? (
    <a className={styles.badge} href={href}>
      {body}
    </a>
  ) : (
    <span className={clsx(styles.badge, styles.soon)}>{body}</span>
  );
}
```

`src/components/ui/StoreBadge.module.css`:
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 18px 0 14px;
  border-radius: 16px;
  color: inherit;
  text-decoration: none;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 32%, transparent);
}

a.badge:hover {
  color: inherit;
  background: color-mix(in srgb, currentColor 8%, transparent);
}

.soon {
  cursor: default;
}

.text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.caption {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--section-muted, var(--ac-ink-2));
}

.label {
  font-size: 16px;
  font-weight: 700;
}
```

`src/components/ui/TagChip.tsx`:
```tsx
import clsx from 'clsx';
import type {CSSProperties} from 'react';
import {containsCyrillic} from '@site/src/lib/text';
import Icon from '../brand/Icon';
import styles from './TagChip.module.css';

type Props = {
  name: string;
  color: string;
  /** Text color on the filled chip; see TagInfo.ink. */
  ink?: string;
  on?: boolean;
  tone?: 'surface' | 'overlay';
  className?: string;
};

export default function TagChip({name, color, ink = '#FFFFFF', on = false, tone = 'surface', className}: Props) {
  const style = {'--tag': color, '--tag-ink': ink} as CSSProperties;
  return (
    <span className={clsx(styles.chip, styles[tone], on && styles.on, className)} style={style}>
      {on ? <Icon name="check" size={14} strokeWidth={3.2} className={styles.check} /> : <span className={styles.dot} />}
      <span className={containsCyrillic(name) ? 'ac-cyr' : undefined}>{name}</span>
    </span>
  );
}
```

`src/components/ui/TagChip.module.css`:
```css
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  height: 2.3em;
  padding: 0 0.86em 0 0.72em;
  border-radius: 1.15em;
  font-size: var(--chip-font, 14px);
  font-weight: 650;
  line-height: 1;
  white-space: nowrap;
}

.surface {
  background: var(--ac-item);
  color: var(--ac-ink);
  box-shadow: inset 0 0 0 1px var(--ac-outline-variant);
}

.overlay {
  height: 2.57em;
  border-radius: 1.3em;
  background: rgba(24, 18, 15, 0.82);
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.on {
  background: var(--tag);
  color: var(--tag-ink);
  box-shadow: none;
}

.dot {
  flex: none;
  width: 0.72em;
  height: 0.72em;
  border-radius: 50%;
  background: var(--tag);
}

.overlay .dot {
  box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.85);
}

.check {
  flex: none;
  width: 1em;
  height: 1em;
}
```

- [ ] **Step 9: Create `Section` and `Reveal`**

`src/components/ui/Section.tsx`:
```tsx
import clsx from 'clsx';
import type {ReactNode} from 'react';
import styles from './Section.module.css';

export type SectionTone = 'cream' | 'white' | 'orange' | 'blue' | 'brown';

type Props = {
  id?: string;
  tone: SectionTone;
  labelledBy?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
};

/** A rounded "sheet" with its own background — the page's rhythm (spec §3.3). */
export default function Section({id, tone, labelledBy, className, innerClassName, children}: Props) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={clsx(styles.sheet, styles[tone], className)}>
      <div className={clsx(styles.inner, innerClassName)}>{children}</div>
    </section>
  );
}
```

`src/components/ui/Section.module.css`:
```css
.sheet {
  position: relative;
  margin: 12px;
  border-radius: var(--ac-radius-sheet);
  overflow: clip;
}

.inner {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(56px, 8vw, 112px) clamp(20px, 5vw, 64px);
}

.cream {
  background: var(--ac-cream);
  color: var(--ac-ink);
}

.white {
  background: var(--ac-item);
  color: var(--ac-ink);
}

.orange {
  --section-muted: var(--ac-on-orange);
  background: var(--ac-orange);
  color: var(--ac-on-orange);
}

.blue {
  --section-muted: var(--ac-on-blue);
  background: var(--ac-blue);
  color: var(--ac-on-blue);
}

.brown {
  --section-muted: var(--ac-on-brown-2);
  background: var(--ac-brown);
  color: var(--ac-on-brown);
}

@media (max-width: 600px) {
  .sheet {
    margin: 8px;
    border-radius: var(--ac-radius-l);
  }
}
```

`src/components/ui/Reveal.tsx`:
```tsx
import {motion, type Variants} from 'motion/react';
import type {ReactNode} from 'react';

const group: Variants = {
  hidden: {},
  shown: {transition: {staggerChildren: 0.06}},
};

const item: Variants = {
  hidden: {opacity: 0, y: 24, scale: 0.96},
  shown: {opacity: 1, y: 0, scale: 1, transition: {type: 'spring', stiffness: 380, damping: 30}},
};

type Props = {children: ReactNode; className?: string};

/** Starts its RevealItems one after another the first time it scrolls into view. */
export function RevealGroup({children, className}: Props) {
  return (
    <motion.div className={className} variants={group} initial="hidden" whileInView="shown" viewport={{once: true, amount: 0.15}}>
      {children}
    </motion.div>
  );
}

/** `data-reveal` lets the <noscript> rule show it without JavaScript. */
export function RevealItem({children, className}: Props) {
  return (
    <motion.div className={className} variants={item} data-reveal="">
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 10: Create `src/theme/Root.tsx`**

```tsx
import {MotionConfig} from 'motion/react';
import type {ReactNode} from 'react';

/** Wraps every page: motion honours the visitor's "reduce motion" setting. */
export default function Root({children}: {children: ReactNode}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
```

- [ ] **Step 11: Logo, favicon and the no-JS override**

`static/img/logo.svg` and `static/img/favicon.svg` (identical content):
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="14" fill="#FF7A1A"/><g fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" transform="translate(4 4) scale(1.6667)"><circle cx="12" cy="12" r="7.5"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3"/></g><circle cx="24" cy="24" r="3.4" fill="#FFFFFF"/></svg>
```

Generate the ICO:
```bash
magick -background none -density 384 static/img/favicon.svg -define icon:auto-resize=48,32,16 static/img/favicon.ico
file static/img/favicon.ico
```
Expected: `MS Windows icon resource - 3 icons`.

In `docusaurus.config.ts`, append to `headTags`:
```ts
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/svg+xml', href: '/img/favicon.svg'}},
    {
      tagName: 'noscript',
      attributes: {},
      innerHTML: '<style>[data-reveal]{opacity:1!important;transform:none!important}</style>',
    },
```

- [ ] **Step 12: Navbar pill — append to `src/css/custom.css`**

```css
/* Navbar: floating pill (M3 floating toolbar). The blur lives on ::before so the
   fixed mobile sidebar inside .navbar is not trapped by backdrop-filter.
   The pill keeps a soft shadow at all times (simpler than the spec's shadow-on-scroll;
   it reads the same over the cream hero). */
.navbar {
  top: 12px;
  height: 64px;
  margin: 12px 12px 0;
  padding: 0 10px 0 18px;
  border-radius: 9999px;
  background: transparent;
  box-shadow: none;
}

.navbar::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: rgba(255, 255, 255, 0.84);
  -webkit-backdrop-filter: saturate(1.6) blur(16px);
  backdrop-filter: saturate(1.6) blur(16px);
  box-shadow:
    0 1px 2px rgba(37, 25, 18, 0.06),
    0 10px 30px rgba(156, 69, 0, 0.1);
}

.navbar__inner {
  max-width: 1240px;
  margin: 0 auto;
}

.navbar__brand {
  margin-right: 20px;
}

.navbar__logo {
  height: 36px;
}

.navbar__title {
  font-size: 19px;
  font-weight: 750;
  letter-spacing: -0.01em;
  font-variation-settings: 'ROND' 100;
}

.navbar__link {
  padding: 8px 14px;
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 600;
  color: var(--ac-ink-2);
  transition: background-color 0.2s;
}

.navbar__link:hover,
.navbar__link--active {
  color: var(--ac-ink);
  background: var(--ac-container-high);
}

.ac-navbar-cta {
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 20px;
  border-radius: 9999px;
  background: var(--ac-orange);
  color: var(--ac-on-orange);
  font-weight: 700;
  text-decoration: none;
  transition: border-radius 0.35s var(--ac-ease-spring);
}

.ac-navbar-cta:hover {
  color: var(--ac-on-orange);
  text-decoration: none;
  background: var(--ac-orange-hover);
}

.ac-navbar-cta:active {
  border-radius: 14px;
}

.navbar-sidebar .ac-navbar-cta {
  margin: 12px;
}

.navbar-sidebar__brand {
  padding-left: 18px;
}
```

- [ ] **Step 13: Typecheck, test, build**

Run: `npm run typecheck && npm test && npm run build`
Expected: typecheck clean; 5 tests pass; build succeeds.

- [ ] **Step 14: Check the no-JS override is in the HTML**

Run: `grep -c '\[data-reveal\]{opacity:1' build/index.html`
Expected: `1`

- [ ] **Step 15: Browser check — navbar and the mobile docs menu (Review Focus 5)**

Follow the Browser check procedure for `/guide`:
- 1440×900: screenshot — the navbar is a white rounded pill 12 px from the top, the logo badge is orange, "Download" is an orange pill on the right.
- 390×844: click the hamburger (`button.navbar__toggle`), then `browser_evaluate` `() => document.querySelector('.navbar-sidebar').getBoundingClientRect().height` — expected ≥ 800 (full height, not trapped in the 64-px pill). Screenshot it.

- [ ] **Step 16: Commit**

```bash
git add -A
git commit -m "feat(ui): icons, logo, M3 shapes, buttons, chips, sections, reveal, navbar pill

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Demo gesture logic (TDD)

Pure rules for the "Try the button" demo, mirroring `OverlayService` / `QuickTagsPopup`: a press shorter than 500 ms is an Instant; holding ≥ 500 ms opens an Interval that closes on release; after each mark, quick tags are open for 5 s; a new mark moves them to the new mark.

**Files:**
- Create: `src/lib/markGesture.ts`, `src/lib/markGesture.test.ts`

**Interfaces:**
- Produces constants: `HOLD_THRESHOLD_MS = 500`, `QUICK_TAGS_MS = 5000`, `MAX_MARKS = 12`, `TRACK_MS = 120_000`.
- Produces types: `MarkKind = 'instant' | 'interval'`; `Mark = {id: number; kind: MarkKind; start: number; end: number | null; tags: string[]}` (instants have `end === start`); `DemoState = {pressedAt: number | null; marks: Mark[]; nextId: number; quickTagsFor: number | null; quickTagsUntil: number | null}`; `DemoEvent` = `{type: 'press' | 'release' | 'cancel' | 'tick'; at: number} | {type: 'toggleTag'; tag: string; at: number} | {type: 'reset'}`.
- Produces functions: `initialDemoState`, `demoReducer(state, event): DemoState`, `isHolding(state): boolean`, `quickTagsMark(state): Mark | null`, `quickTagsRemaining(state, at): number` (1 → 0), `clipSeconds(mark): number`, `formatClipLength(seconds): string` (`'0:07'`), `trackPosition(at, origin): number` (0–1), `describeMark(mark): string`.

- [ ] **Step 1: Write the failing tests**

`src/lib/markGesture.test.ts`:
```ts
import {describe, expect, it} from 'vitest';
import {
  HOLD_THRESHOLD_MS,
  MAX_MARKS,
  QUICK_TAGS_MS,
  TRACK_MS,
  clipSeconds,
  demoReducer,
  describeMark,
  formatClipLength,
  initialDemoState,
  isHolding,
  quickTagsMark,
  quickTagsRemaining,
  trackPosition,
  type DemoEvent,
  type DemoState,
} from './markGesture';

const run = (events: DemoEvent[], from: DemoState = initialDemoState) => events.reduce(demoReducer, from);

describe('tap and hold', () => {
  it('a short press marks an instant at the press time and opens quick tags for 5 s', () => {
    const s = run([{type: 'press', at: 1000}, {type: 'release', at: 1200}]);
    expect(s.marks).toEqual([{id: 1, kind: 'instant', start: 1000, end: 1000, tags: []}]);
    expect(s.pressedAt).toBeNull();
    expect(s.quickTagsFor).toBe(1);
    expect(s.quickTagsUntil).toBe(1200 + QUICK_TAGS_MS);
  });

  it('499 ms is still an instant, 500 ms is an interval', () => {
    expect(run([{type: 'press', at: 0}, {type: 'release', at: HOLD_THRESHOLD_MS - 1}]).marks[0].kind).toBe('instant');
    expect(run([{type: 'press', at: 0}, {type: 'release', at: HOLD_THRESHOLD_MS}]).marks[0].kind).toBe('interval');
  });

  it('holding opens an interval on the first tick past 500 ms and release closes it', () => {
    const held = run([{type: 'press', at: 0}, {type: 'tick', at: 600}]);
    expect(isHolding(held)).toBe(true);
    expect(held.marks).toEqual([{id: 1, kind: 'interval', start: 0, end: null, tags: []}]);

    const done = run([{type: 'release', at: 4000}], held);
    expect(isHolding(done)).toBe(false);
    expect(done.marks).toEqual([{id: 1, kind: 'interval', start: 0, end: 4000, tags: []}]);
    expect(done.quickTagsFor).toBe(1);
    expect(done.quickTagsUntil).toBe(4000 + QUICK_TAGS_MS);
  });

  it('a tick before 500 ms does not open an interval', () => {
    expect(run([{type: 'press', at: 0}, {type: 'tick', at: 300}]).marks).toEqual([]);
  });

  it('ignores a second press while pressed and a release without a press', () => {
    const s = run([{type: 'press', at: 0}, {type: 'press', at: 100}, {type: 'release', at: 200}, {type: 'release', at: 300}]);
    expect(s.marks).toHaveLength(1);
    expect(s.marks[0].start).toBe(0);
  });
});

describe('cancel (finger slid off, browser took over)', () => {
  it('a short cancelled press leaves no mark', () => {
    const s = run([{type: 'press', at: 0}, {type: 'cancel', at: 200}]);
    expect(s.marks).toEqual([]);
    expect(s.pressedAt).toBeNull();
  });

  it('a cancelled hold closes the interval instead of leaving it stuck', () => {
    const s = run([{type: 'press', at: 0}, {type: 'tick', at: 700}, {type: 'cancel', at: 2500}]);
    expect(isHolding(s)).toBe(false);
    expect(s.marks[0]).toMatchObject({kind: 'interval', start: 0, end: 2500});
  });
});

describe('quick tags', () => {
  const marked = run([{type: 'press', at: 0}, {type: 'release', at: 100}]);

  it('toggles a tag on the last mark while the window is open', () => {
    const on = run([{type: 'toggleTag', tag: 'Goal', at: 1000}], marked);
    expect(on.marks[0].tags).toEqual(['Goal']);
    const off = run([{type: 'toggleTag', tag: 'Goal', at: 2000}], on);
    expect(off.marks[0].tags).toEqual([]);
  });

  it('ignores taps after the window closed', () => {
    const late = run([{type: 'toggleTag', tag: 'Goal', at: 100 + QUICK_TAGS_MS}], marked);
    expect(late.marks[0].tags).toEqual([]);
  });

  it('closes on the first tick at the deadline', () => {
    const closed = run([{type: 'tick', at: 100 + QUICK_TAGS_MS}], marked);
    expect(closed.quickTagsFor).toBeNull();
    expect(quickTagsMark(closed)).toBeNull();
  });

  it('moves to the newest mark', () => {
    const second = run([{type: 'press', at: 1000}, {type: 'release', at: 1100}], marked);
    expect(quickTagsMark(second)?.id).toBe(2);
    const tagged = run([{type: 'toggleTag', tag: 'Save', at: 1200}], second);
    expect(tagged.marks[0].tags).toEqual([]);
    expect(tagged.marks[1].tags).toEqual(['Save']);
  });

  it('reports the remaining share of the window', () => {
    expect(quickTagsRemaining(marked, 100)).toBe(1);
    expect(quickTagsRemaining(marked, 100 + QUICK_TAGS_MS / 2)).toBe(0.5);
    expect(quickTagsRemaining(marked, 100 + QUICK_TAGS_MS * 2)).toBe(0);
    expect(quickTagsRemaining(initialDemoState, 0)).toBe(0);
  });
});

describe('limits and reset', () => {
  it(`keeps only the last ${MAX_MARKS} marks`, () => {
    const events: DemoEvent[] = [];
    for (let i = 0; i < MAX_MARKS + 3; i++) {
      events.push({type: 'press', at: i * 1000}, {type: 'release', at: i * 1000 + 100});
    }
    const s = run(events);
    expect(s.marks).toHaveLength(MAX_MARKS);
    expect(s.marks[0].id).toBe(4);
    expect(s.marks[MAX_MARKS - 1].id).toBe(MAX_MARKS + 3);
  });

  it('reset returns to the initial state', () => {
    expect(run([{type: 'press', at: 0}, {type: 'release', at: 10}, {type: 'reset'}])).toEqual(initialDemoState);
  });
});

describe('derived values', () => {
  it('clip length follows the app defaults: 5+2 s for instants, 3+hold+3 s for intervals', () => {
    expect(clipSeconds({id: 1, kind: 'instant', start: 0, end: 0, tags: []})).toBe(7);
    expect(clipSeconds({id: 2, kind: 'interval', start: 0, end: 4000, tags: []})).toBe(10);
    expect(clipSeconds({id: 3, kind: 'interval', start: 0, end: null, tags: []})).toBe(6);
  });

  it('formats clip lengths as m:ss', () => {
    expect(formatClipLength(7)).toBe('0:07');
    expect(formatClipLength(75)).toBe('1:15');
  });

  it('places marks on a 2-minute track that wraps', () => {
    expect(trackPosition(1000, 1000)).toBe(0);
    expect(trackPosition(1000 + TRACK_MS / 4, 1000)).toBe(0.25);
    expect(trackPosition(1000 + TRACK_MS + TRACK_MS / 2, 1000)).toBe(0.5);
    expect(trackPosition(0, 1000)).toBe(0);
  });

  it('describes marks for screen readers', () => {
    expect(describeMark({id: 1, kind: 'instant', start: 0, end: 0, tags: []})).toBe('Moment marked · Instant');
    expect(describeMark({id: 2, kind: 'interval', start: 0, end: 4200, tags: []})).toBe('Moment marked · Interval · 4 s');
    expect(describeMark({id: 3, kind: 'interval', start: 0, end: 300, tags: []})).toBe('Moment marked · Interval · 1 s');
  });
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `npm test -- src/lib/markGesture.test.ts`
Expected: FAIL — `Failed to resolve import "./markGesture"`.

- [ ] **Step 3: Implement `src/lib/markGesture.ts`**

```ts
/**
 * Rules of the floating button, as in the Android app (OverlayService, QuickTagsPopup):
 * tap = Instant, hold ≥ 500 ms = Interval until release, quick tags for 5 s after a mark.
 */
export const HOLD_THRESHOLD_MS = 500;
export const QUICK_TAGS_MS = 5000;
export const MAX_MARKS = 12;
export const TRACK_MS = 120_000;

const INSTANT_BEFORE_S = 5;
const INSTANT_AFTER_S = 2;
const INTERVAL_BEFORE_S = 3;
const INTERVAL_AFTER_S = 3;

export type MarkKind = 'instant' | 'interval';

export type Mark = {
  id: number;
  kind: MarkKind;
  /** Press time, ms. */
  start: number;
  /** Release time, ms; equals `start` for instants; null while an interval is held. */
  end: number | null;
  tags: string[];
};

export type DemoState = {
  pressedAt: number | null;
  marks: Mark[];
  nextId: number;
  quickTagsFor: number | null;
  quickTagsUntil: number | null;
};

export type DemoEvent =
  | {type: 'press'; at: number}
  | {type: 'release'; at: number}
  | {type: 'cancel'; at: number}
  | {type: 'tick'; at: number}
  | {type: 'toggleTag'; tag: string; at: number}
  | {type: 'reset'};

export const initialDemoState: DemoState = {
  pressedAt: null,
  marks: [],
  nextId: 1,
  quickTagsFor: null,
  quickTagsUntil: null,
};

function openInterval(state: DemoState): Mark | undefined {
  return state.marks.find((m) => m.kind === 'interval' && m.end === null);
}

function addMark(state: DemoState, mark: Omit<Mark, 'id' | 'tags'>): [DemoState, number] {
  const id = state.nextId;
  const marks = [...state.marks, {...mark, id, tags: []}].slice(-MAX_MARKS);
  return [{...state, marks, nextId: id + 1}, id];
}

function openQuickTags(state: DemoState, markId: number, at: number): DemoState {
  return {...state, quickTagsFor: markId, quickTagsUntil: at + QUICK_TAGS_MS};
}

function startIntervalIfHeld(state: DemoState, at: number): DemoState {
  if (state.pressedAt === null || at - state.pressedAt < HOLD_THRESHOLD_MS || openInterval(state)) {
    return state;
  }
  return addMark(state, {kind: 'interval', start: state.pressedAt, end: null})[0];
}

function closeExpiredQuickTags(state: DemoState, at: number): DemoState {
  if (state.quickTagsUntil !== null && at >= state.quickTagsUntil) {
    return {...state, quickTagsFor: null, quickTagsUntil: null};
  }
  return state;
}

function finishPress(state: DemoState, at: number, cancelled: boolean): DemoState {
  if (state.pressedAt === null) return state;
  const pressedAt = state.pressedAt;
  const released: DemoState = {...state, pressedAt: null};

  if (at - pressedAt < HOLD_THRESHOLD_MS) {
    if (cancelled) return released;
    const [next, id] = addMark(released, {kind: 'instant', start: pressedAt, end: pressedAt});
    return openQuickTags(next, id, at);
  }

  const open = openInterval(released);
  if (open) {
    const marks = released.marks.map((m) => (m.id === open.id ? {...m, end: at} : m));
    return openQuickTags({...released, marks}, open.id, at);
  }
  const [next, id] = addMark(released, {kind: 'interval', start: pressedAt, end: at});
  return openQuickTags(next, id, at);
}

function toggleTag(state: DemoState, tag: string, at: number): DemoState {
  if (state.quickTagsFor === null || state.quickTagsUntil === null || at >= state.quickTagsUntil) return state;
  const id = state.quickTagsFor;
  const marks = state.marks.map((m) => {
    if (m.id !== id) return m;
    const tags = m.tags.includes(tag) ? m.tags.filter((t) => t !== tag) : [...m.tags, tag];
    return {...m, tags};
  });
  return {...state, marks};
}

export function demoReducer(state: DemoState, event: DemoEvent): DemoState {
  switch (event.type) {
    case 'press':
      return state.pressedAt === null ? {...state, pressedAt: event.at} : state;
    case 'release':
      return finishPress(state, event.at, false);
    case 'cancel':
      return finishPress(state, event.at, true);
    case 'tick':
      return closeExpiredQuickTags(startIntervalIfHeld(state, event.at), event.at);
    case 'toggleTag':
      return toggleTag(state, event.tag, event.at);
    case 'reset':
      return initialDemoState;
  }
}

export function isHolding(state: DemoState): boolean {
  return openInterval(state) !== undefined;
}

export function quickTagsMark(state: DemoState): Mark | null {
  if (state.quickTagsFor === null) return null;
  return state.marks.find((m) => m.id === state.quickTagsFor) ?? null;
}

export function quickTagsRemaining(state: DemoState, at: number): number {
  if (state.quickTagsUntil === null) return 0;
  return Math.min(1, Math.max(0, (state.quickTagsUntil - at) / QUICK_TAGS_MS));
}

export function clipSeconds(mark: Mark): number {
  if (mark.kind === 'instant') return INSTANT_BEFORE_S + INSTANT_AFTER_S;
  const heldS = Math.round(((mark.end ?? mark.start) - mark.start) / 1000);
  return INTERVAL_BEFORE_S + heldS + INTERVAL_AFTER_S;
}

export function formatClipLength(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export function trackPosition(at: number, origin: number): number {
  const elapsed = Math.max(0, at - origin);
  return (elapsed % TRACK_MS) / TRACK_MS;
}

export function describeMark(mark: Mark): string {
  if (mark.kind === 'instant') return 'Moment marked · Instant';
  const seconds = Math.max(1, Math.round(((mark.end ?? mark.start) - mark.start) / 1000));
  return `Moment marked · Interval · ${seconds} s`;
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test`
Expected: PASS — all `markGesture` tests plus the 5 from Task 2.

- [ ] **Step 5: Typecheck and commit**

```bash
npm run typecheck
git add src/lib/markGesture.ts src/lib/markGesture.test.ts
git commit -m "feat(demo): floating-button gesture rules — tap, hold, cancel, quick tags

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Phone frame and app mocks

HTML/CSS recreations of the app screens from the "ActionCut Redesign" artboards (Home, Event, Moment, floating button with quick tags) plus an iPhone Live Activity concept. All mock sizes are in "app pixels" of a 390-px-wide screen: `calc(var(--u) * N)`, where `--u = 100cqw / 390` is set by `PhoneFrame`, so mocks scale crisply at any width.

**Files:**
- Create: `src/lib/groupShape.ts`, `src/lib/groupShape.test.ts`
- Create: `src/components/phone/PhoneFrame.tsx`, `PhoneFrame.module.css`, `Scene.tsx`, `Scene.module.css`, `MockBits.tsx`, `MockBits.module.css`, `CameraOverlayMock.tsx`, `CameraOverlayMock.module.css`, `HomeMock.tsx`, `HomeMock.module.css`, `EventMock.tsx`, `EventMock.module.css`, `MomentMock.tsx`, `MomentMock.module.css`, `IphoneLiveMock.tsx`, `IphoneLiveMock.module.css`, `Screen.tsx`, `Screen.module.css`
- Modify: `src/pages/index.tsx` (temporary gallery of the mocks; replaced in Task 5)

**Interfaces:**
- Consumes: `Icon`, `TagChip` (Task 2), `TAGS`, `QUICK_TAGS`, `TagInfo` (Task 1).
- Produces: `groupRadius(index: number, count: number): string` (CSS radius in `--u` units).
- Produces: `PhoneFrame({children, label: string, platform?: 'android' | 'iphone', className?})` — `role="img"` with `aria-label={label}`; its width comes from the parent/`className`.
- Produces: `Scene({kind: SceneKind, orientation?: 'vertical' | 'horizontal', players?: boolean, shift?: number, className?})`, `SceneKind = 'rink' | 'pitch' | 'gym'`. Uses % sizes, so it also works outside a phone.
- Produces (MockBits): `LivePill()`, `LiveBar({time: string, count: number})`, `MomentTile({tile: MockTile, radius?: string})`, `MockTile = {kind: SceneKind; shift?: number; time: string; title?: string; tags?: string[] /* colors */; fav?: boolean; interval?: number; cut?: boolean}`.
- Produces: `CameraOverlayMock({count: number, recTime: string, scene?: SceneKind, hot?: boolean, chips?: QuickChip[], chipsVisible?: boolean, countdown?: number})`, `QuickChip = TagInfo & {on: boolean}`.
- Produces: `HomeMock({tab?: 'events' | 'favorites', live?: boolean, liveTime?: string, liveCount?: number, highlightNew?: boolean})`, `EventMock({live?: boolean})`, `MomentMock({versions?: boolean})`, `IphoneLiveMock()`.
- Produces: `Screen({name: string, src?: string, caption?: string, platform?: 'android' | 'iphone', fallback?: ReactNode})` — real screenshot when `src` is set, else `fallback`, else a striped placeholder "Screenshot: {name}".

- [ ] **Step 1: Write the failing test for `groupRadius`**

`src/lib/groupShape.test.ts`:
```ts
import {describe, expect, it} from 'vitest';
import {groupRadius} from './groupShape';

const OUT = 'calc(var(--u) * 20)';
const IN = 'calc(var(--u) * 6)';

describe('groupRadius (app GroupShapes: 20 outside, 6 between)', () => {
  it('rounds a single item on all corners', () => {
    expect(groupRadius(0, 1)).toBe(OUT);
  });

  it('rounds the top of the first and the bottom of the last item', () => {
    expect(groupRadius(0, 3)).toBe(`${OUT} ${OUT} ${IN} ${IN}`);
    expect(groupRadius(2, 3)).toBe(`${IN} ${IN} ${OUT} ${OUT}`);
  });

  it('keeps middle items tight', () => {
    expect(groupRadius(1, 3)).toBe(IN);
  });
});
```

Run: `npm test -- src/lib/groupShape.test.ts`
Expected: FAIL — `Failed to resolve import "./groupShape"`.

- [ ] **Step 2: Implement `src/lib/groupShape.ts`**

```ts
const OUTER = 'calc(var(--u) * 20)';
const INNER = 'calc(var(--u) * 6)';

/** Corner radii of an item in a grouped list, as the app's GroupShapes. */
export function groupRadius(index: number, count: number): string {
  if (count <= 1) return OUTER;
  if (index === 0) return `${OUTER} ${OUTER} ${INNER} ${INNER}`;
  if (index === count - 1) return `${INNER} ${INNER} ${OUTER} ${OUTER}`;
  return INNER;
}
```

Run: `npm test`
Expected: PASS.

- [ ] **Step 3: Create `PhoneFrame`**

`src/components/phone/PhoneFrame.tsx`:
```tsx
import clsx from 'clsx';
import type {ReactNode} from 'react';
import styles from './PhoneFrame.module.css';

type Props = {
  children: ReactNode;
  /** What the screen shows, for screen readers (the mock itself is decorative). */
  label: string;
  platform?: 'android' | 'iphone';
  className?: string;
};

export default function PhoneFrame({children, label, platform = 'android', className}: Props) {
  return (
    <div className={clsx(styles.frame, styles[platform], className)} role="img" aria-label={label}>
      <div className={styles.screen}>
        <div className={styles.content}>{children}</div>
      </div>
      <span className={styles.camera} aria-hidden="true" />
    </div>
  );
}
```

`src/components/phone/PhoneFrame.module.css`:
```css
.frame {
  position: relative;
  width: 100%;
  aspect-ratio: 390 / 844;
  padding: 3.4%;
  border-radius: 14% / 6.5%;
  background: #1e1612;
  box-shadow:
    0 40px 80px -30px rgba(94, 39, 0, 0.5),
    0 18px 36px -18px rgba(37, 25, 18, 0.45),
    inset 0 0 0 1.5px rgba(255, 255, 255, 0.08);
}

.screen {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 11% / 5.1%;
  background: var(--ac-cream);
  container-type: inline-size;
  isolation: isolate;
}

/* 1 --u = one pixel of a 390-px-wide app screen. */
.content {
  --u: calc(100cqw / 390);
  position: absolute;
  inset: 0;
  font-family: var(--ac-font);
  font-size: calc(var(--u) * 14);
  line-height: 1.4;
  color: var(--ac-ink);
  text-align: left;
  user-select: none;
}

.camera {
  position: absolute;
  z-index: 3;
  left: 50%;
  top: 4.6%;
  width: 3.4%;
  aspect-ratio: 1;
  transform: translateX(-50%);
  border-radius: 50%;
  background: #0b0807;
}

.iphone .camera {
  top: 4.4%;
  width: 28%;
  aspect-ratio: 3.6;
  border-radius: 9999px;
}
```

- [ ] **Step 4: Create `Scene` (stylized rink / pitch / gym)**

`src/components/phone/Scene.tsx`:
```tsx
import clsx from 'clsx';
import type {CSSProperties} from 'react';
import styles from './Scene.module.css';

export type SceneKind = 'rink' | 'pitch' | 'gym';

type Props = {
  kind: SceneKind;
  orientation?: 'vertical' | 'horizontal';
  players?: boolean;
  /** Moves the lines sideways (% of width) so neighbouring tiles differ. */
  shift?: number;
  className?: string;
};

export default function Scene({kind, orientation = 'vertical', players = false, shift = 0, className}: Props) {
  return (
    <div
      className={clsx(styles.scene, styles[kind], orientation === 'horizontal' && styles.horizontal, className)}
      style={{'--shift': `${shift}%`} as CSSProperties}
      aria-hidden="true">
      <span className={clsx(styles.line, styles.l1)} />
      <span className={clsx(styles.line, styles.mid)} />
      <span className={clsx(styles.line, styles.l2)} />
      <span className={styles.circle} />
      {players && (
        <>
          <span className={clsx(styles.player, styles.p1)} />
          <span className={clsx(styles.player, styles.p2)} />
          <span className={clsx(styles.player, styles.p3)} />
          <span className={styles.ball} />
        </>
      )}
    </div>
  );
}
```

`src/components/phone/Scene.module.css`:
```css
.scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.rink {
  --side: #3d6fd1;
  --mid: #d8414a;
  background: #e3eaef;
}

.pitch {
  --side: rgba(255, 255, 255, 0.7);
  --mid: #ffffff;
  background: #5a9a47;
}

.gym {
  --side: #8a5a2b;
  --mid: #8a5a2b;
  background: #d2a26a;
}

.line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--side);
}

.l1 {
  left: calc(24% + var(--shift));
}

.mid {
  left: calc(50% + var(--shift));
  margin-left: -1px;
  background: var(--mid);
}

.l2 {
  left: calc(76% + var(--shift));
}

.circle {
  position: absolute;
  left: calc(50% + var(--shift));
  top: 50%;
  width: 26%;
  aspect-ratio: 1;
  border: 2px solid var(--mid);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.horizontal .line {
  left: 0;
  right: 0;
  width: auto;
  height: 3px;
  margin: 0;
}

.horizontal .l1 {
  top: 30%;
}

.horizontal .mid {
  top: 52%;
}

.horizontal .l2 {
  top: 74%;
}

.horizontal .circle {
  left: 50%;
  top: 52%;
  width: 34%;
  border-width: 4px;
}

.player {
  position: absolute;
  width: 4.5%;
  aspect-ratio: 1 / 2.1;
  border-radius: 9999px;
  background: #1f2a44;
}

.p1 {
  left: 18%;
  top: 58%;
}

.p2 {
  left: 62%;
  top: 42%;
  background: #f2f2f2;
  box-shadow: 0 0 0 2px #1f2a44;
}

.p3 {
  left: 80%;
  top: 63%;
}

.ball {
  position: absolute;
  left: 47%;
  top: 61%;
  width: 2.6%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #111111;
}

.pitch .ball {
  background: #ffffff;
  box-shadow: 0 0 0 1px #333333;
}
```

- [ ] **Step 5: Create `MockBits` (live pill, live bar, moment tile)**

`src/components/phone/MockBits.tsx`:
```tsx
import clsx from 'clsx';
import Icon from '../brand/Icon';
import Scene, {type SceneKind} from './Scene';
import styles from './MockBits.module.css';

export function LivePill() {
  return (
    <span className={styles.livePill}>
      <span className={styles.livePillDot} />
      LIVE
    </span>
  );
}

export function LiveBar({time, count}: {time: string; count: number}) {
  return (
    <div className={styles.liveBar}>
      <span className={styles.liveDot} />
      <span className={styles.liveText}>
        <span className={styles.liveTitle}>Event in progress</span>
        <span className={styles.liveSub}>
          {time} · {count === 1 ? '1 moment' : `${count} moments`}
        </span>
      </span>
      <span className={styles.liveCam}>
        <Icon name="video" />
      </span>
      <span className={styles.liveStop}>
        <Icon name="stop" />
        Stop
      </span>
    </div>
  );
}

export type MockTile = {
  kind: SceneKind;
  shift?: number;
  time: string;
  title?: string;
  /** Tag colors, shown as dots top-left. */
  tags?: string[];
  fav?: boolean;
  /** Interval length in seconds (badge bottom-right). */
  interval?: number;
  /** Custom clip window (scissors badge bottom-right). */
  cut?: boolean;
};

export function MomentTile({tile, radius}: {tile: MockTile; radius?: string}) {
  return (
    <div className={styles.tile} style={radius ? {borderRadius: radius} : undefined}>
      <Scene kind={tile.kind} shift={tile.shift} />
      {tile.tags && tile.tags.length > 0 && (
        <span className={styles.tileDots}>
          {tile.tags.map((color) => (
            <span key={color} style={{background: color}} />
          ))}
        </span>
      )}
      <Icon name="heart" className={styles.tileHeart} fill={tile.fav ? 'currentColor' : 'none'} />
      <span className={styles.tileLabel}>{tile.title ?? tile.time}</span>
      {tile.interval !== undefined && (
        <span className={styles.tileBadge}>
          <Icon name="interval" strokeWidth={2.6} />
          {tile.interval}s
        </span>
      )}
      {tile.cut && (
        <span className={clsx(styles.tileBadge, styles.tileCut)}>
          <Icon name="scissors" strokeWidth={2.2} />
        </span>
      )}
    </div>
  );
}
```

`src/components/phone/MockBits.module.css`:
```css
.livePill {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: calc(var(--u) * 6);
  height: calc(var(--u) * 24);
  padding: 0 calc(var(--u) * 10);
  border-radius: calc(var(--u) * 12);
  background: var(--ac-live-container);
  color: var(--ac-on-live-container);
  font-size: calc(var(--u) * 11);
  font-weight: 700;
  letter-spacing: 0.06em;
}

.livePillDot {
  width: calc(var(--u) * 6);
  height: calc(var(--u) * 6);
  border-radius: 50%;
  background: currentColor;
}

.liveBar {
  position: absolute;
  left: calc(var(--u) * 12);
  right: calc(var(--u) * 12);
  bottom: calc(var(--u) * 24);
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 12);
  min-height: calc(var(--u) * 72);
  padding: calc(var(--u) * 12) calc(var(--u) * 12) calc(var(--u) * 12) calc(var(--u) * 20);
  border-radius: calc(var(--u) * 24);
  background: var(--ac-brown);
  color: var(--ac-on-brown);
  box-shadow: 0 calc(var(--u) * 6) calc(var(--u) * 16) rgba(0, 0, 0, 0.2);
}

.liveDot {
  flex: none;
  width: calc(var(--u) * 10);
  height: calc(var(--u) * 10);
  border-radius: 50%;
  background: var(--ac-live);
  box-shadow: 0 0 0 calc(var(--u) * 4) rgba(255, 90, 79, 0.28);
  animation: livePulse 1.6s ease-in-out infinite;
}

.liveText {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.liveTitle {
  font-size: calc(var(--u) * 15);
  line-height: 1.33;
  font-weight: 600;
}

.liveSub {
  font-size: calc(var(--u) * 13);
  line-height: 1.38;
  color: var(--ac-on-brown-2);
  font-variant-numeric: tabular-nums;
}

.liveCam {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--u) * 48);
  height: calc(var(--u) * 48);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
}

.liveCam svg {
  width: calc(var(--u) * 22);
  height: calc(var(--u) * 22);
}

.liveStop {
  flex: none;
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 8);
  height: calc(var(--u) * 48);
  padding: 0 calc(var(--u) * 18) 0 calc(var(--u) * 14);
  border-radius: calc(var(--u) * 24);
  background: var(--ac-inverse-primary);
  color: var(--ac-on-inverse-primary);
  font-size: calc(var(--u) * 15);
  font-weight: 600;
}

.liveStop svg {
  width: calc(var(--u) * 14);
  height: calc(var(--u) * 14);
}

@keyframes livePulse {
  50% {
    box-shadow: 0 0 0 calc(var(--u) * 7) rgba(255, 90, 79, 0.12);
  }
}

.tile {
  position: relative;
  height: calc(var(--u) * 116);
  border-radius: calc(var(--u) * 12);
  overflow: hidden;
}

.tileDots {
  position: absolute;
  left: calc(var(--u) * 7);
  top: calc(var(--u) * 7);
  display: flex;
  gap: calc(var(--u) * 4);
}

.tileDots span {
  width: calc(var(--u) * 12);
  height: calc(var(--u) * 12);
  border-radius: 50%;
  box-shadow: 0 0 0 calc(var(--u) * 2) #ffffff;
}

.tileHeart {
  position: absolute;
  right: calc(var(--u) * 9);
  top: calc(var(--u) * 9);
  width: calc(var(--u) * 20);
  height: calc(var(--u) * 20);
  color: #ffffff;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.35));
}

.tileLabel {
  position: absolute;
  left: calc(var(--u) * 6);
  bottom: calc(var(--u) * 6);
  max-width: calc(var(--u) * 72);
  height: calc(var(--u) * 22);
  padding: 0 calc(var(--u) * 7);
  border-radius: calc(var(--u) * 8);
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  font-size: calc(var(--u) * 12);
  line-height: calc(var(--u) * 22);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-variant-numeric: tabular-nums;
}

.tileBadge {
  position: absolute;
  right: calc(var(--u) * 6);
  bottom: calc(var(--u) * 6);
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 3);
  height: calc(var(--u) * 22);
  padding: 0 calc(var(--u) * 6);
  border-radius: calc(var(--u) * 8);
  background: var(--ac-tertiary);
  color: #ffffff;
  font-size: calc(var(--u) * 12);
  font-weight: 600;
}

.tileBadge svg {
  width: calc(var(--u) * 13);
  height: calc(var(--u) * 13);
}

.tileCut {
  justify-content: center;
  width: calc(var(--u) * 24);
  padding: 0;
  background: rgba(0, 0, 0, 0.6);
}
```

- [ ] **Step 6: Create `CameraOverlayMock` (the floating button over a camera app)**

`src/components/phone/CameraOverlayMock.tsx`:
```tsx
import clsx from 'clsx';
import {AnimatePresence, motion} from 'motion/react';
import type {TagInfo} from '@site/src/data/tags';
import Icon from '../brand/Icon';
import TagChip from '../ui/TagChip';
import Scene, {type SceneKind} from './Scene';
import styles from './CameraOverlayMock.module.css';

export type QuickChip = TagInfo & {on: boolean};

type Props = {
  count: number;
  recTime: string;
  scene?: SceneKind;
  /** Red "just marked" state of the button. */
  hot?: boolean;
  chips?: QuickChip[];
  chipsVisible?: boolean;
  /** Share of the 5-s quick-tag window left, 1 → 0. */
  countdown?: number;
};

export default function CameraOverlayMock({
  count,
  recTime,
  scene = 'rink',
  hot = false,
  chips = [],
  chipsVisible = false,
  countdown = 1,
}: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.viewfinder}>
        <Scene kind={scene} orientation="horizontal" players />
      </div>
      <span className={styles.rec}>
        <span className={styles.recDot} />
        {recTime}
      </span>
      <span className={styles.shutter}>
        <span />
      </span>
      <div className={clsx(styles.button, hot && styles.hot)}>
        <Icon name="crosshair" className={styles.crosshair} />
        <span className={styles.badge}>{count > 99 ? '99+' : count}</span>
      </div>
      <AnimatePresence>
        {chipsVisible && (
          <motion.div
            className={styles.chips}
            initial={{opacity: 0, x: 12}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: 12}}
            transition={{type: 'spring', stiffness: 420, damping: 30}}>
            <span className={styles.timer}>
              <span style={{transform: `scaleX(${countdown})`}} />
            </span>
            {chips.map((chip, i) => (
              <motion.span
                key={chip.name}
                initial={{scale: 0.4, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{type: 'spring', stiffness: 500, damping: 26, delay: 0.05 * i}}>
                <TagChip tone="overlay" name={chip.name} color={chip.color} ink={chip.ink} on={chip.on} />
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

`src/components/phone/CameraOverlayMock.module.css`:
```css
.root {
  --chip-font: calc(var(--u) * 14);
  position: absolute;
  inset: 0;
  background: #0e0c0b;
  color: #ffffff;
}

.viewfinder {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(var(--u) * 70);
  height: calc(var(--u) * 620);
  overflow: hidden;
}

.rec {
  position: absolute;
  top: calc(var(--u) * 26);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 6);
  padding: calc(var(--u) * 4) calc(var(--u) * 10);
  border-radius: calc(var(--u) * 12);
  background: rgba(0, 0, 0, 0.5);
  font-size: calc(var(--u) * 13);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.recDot {
  width: calc(var(--u) * 8);
  height: calc(var(--u) * 8);
  border-radius: 50%;
  background: #ff3b30;
  animation: blink 1.2s steps(2, start) infinite;
}

.shutter {
  position: absolute;
  bottom: calc(var(--u) * 44);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--u) * 72);
  height: calc(var(--u) * 72);
  border: calc(var(--u) * 4) solid #ffffff;
  border-radius: 50%;
}

.shutter span {
  width: calc(var(--u) * 28);
  height: calc(var(--u) * 28);
  border-radius: calc(var(--u) * 6);
  background: #ff3b30;
}

.button {
  position: absolute;
  right: calc(var(--u) * 16);
  top: calc(var(--u) * 360);
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--u) * 64);
  height: calc(var(--u) * 64);
  border-radius: calc(var(--u) * 20);
  background: var(--ac-orange);
  box-shadow: 0 calc(var(--u) * 6) calc(var(--u) * 14) rgba(0, 0, 0, 0.35);
  transition: background-color 0.2s;
  animation: breathe 2.4s ease-in-out infinite;
}

.hot {
  background: #e5484d;
  animation: pulse 0.5s ease-out infinite;
}

.crosshair {
  width: calc(var(--u) * 34);
  height: calc(var(--u) * 34);
  color: #ffffff;
}

.badge {
  position: absolute;
  right: calc(var(--u) * -4);
  top: calc(var(--u) * -4);
  min-width: calc(var(--u) * 22);
  height: calc(var(--u) * 22);
  padding: 0 calc(var(--u) * 5);
  border-radius: calc(var(--u) * 11);
  background: var(--ac-brown);
  color: var(--ac-on-brown);
  font-size: calc(var(--u) * 12);
  font-weight: 700;
  line-height: calc(var(--u) * 22);
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.chips {
  position: absolute;
  right: calc(var(--u) * 92);
  top: calc(var(--u) * 300);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: calc(var(--u) * 6);
  width: calc(var(--u) * 150);
}

.timer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: calc(var(--u) * 3);
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.25);
  overflow: hidden;
}

.timer span {
  width: 100%;
  height: 100%;
  background: #ffffff;
  transform-origin: right center;
  transition: transform 0.3s linear;
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.04);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(229, 72, 77, 0.6);
  }
  100% {
    box-shadow: 0 0 0 calc(var(--u) * 18) rgba(229, 72, 77, 0);
  }
}

@keyframes blink {
  to {
    visibility: hidden;
  }
}
```

- [ ] **Step 7: Create `HomeMock` (events list, favorites, live bar)**

`src/components/phone/HomeMock.tsx`:
```tsx
import clsx from 'clsx';
import {TAGS} from '@site/src/data/tags';
import {groupRadius} from '@site/src/lib/groupShape';
import Icon from '../brand/Icon';
import TagChip from '../ui/TagChip';
import {LiveBar, LivePill, MomentTile, type MockTile} from './MockBits';
import Scene, {type SceneKind} from './Scene';
import styles from './HomeMock.module.css';

type MockEvent = {title: string; sub: string; kind: SceneKind; shift?: number; live?: boolean};

const LIVE_EVENT: MockEvent = {title: 'Event in progress', sub: 'Started 14:05 · 5 moments', kind: 'pitch', live: true};

const MONTHS: {month: string; events: MockEvent[]}[] = [
  {
    month: 'October',
    events: [
      {title: 'Semi-final vs Lions', sub: 'Oct 4, 13:36 · 1h 34m · 12 moments', kind: 'rink'},
      {title: 'Practice · passing drills', sub: 'Oct 2, 18:00 · 52m · 6 moments', kind: 'pitch', shift: 6},
      {title: 'Oct 1 · 17:20', sub: '1h 12m · 4 moments', kind: 'gym'},
    ],
  },
  {
    month: 'September',
    events: [
      {title: 'Summer cup · day 2', sub: 'Sep 20, 09:40 · 2h 05m · 14 moments', kind: 'pitch', shift: -8},
      {title: 'Sep 13 · 11:15', sub: '1h 20m · 8 moments', kind: 'rink', shift: 10},
    ],
  },
];

const goal = TAGS.goal.color;
const FAVORITES: MockTile[] = [
  {kind: 'rink', shift: -4, time: '15:10', title: 'First goal', tags: [goal], fav: true},
  {kind: 'rink', shift: 3, time: '14:52', tags: [TAGS.assist.color, goal], fav: true},
  {kind: 'rink', shift: 9, time: '13:58', tags: [goal], fav: true},
  {kind: 'pitch', shift: -8, time: '10:47', tags: [goal], fav: true},
  {kind: 'pitch', shift: 5, time: '10:22', title: 'Header!', tags: [goal], fav: true},
  {kind: 'pitch', shift: -2, time: '09:58', tags: [goal], fav: true},
  {kind: 'gym', shift: 7, time: '17:41', tags: [goal], fav: true},
  {kind: 'rink', shift: -11, time: '11:32', tags: [goal], fav: true, interval: 9},
  {kind: 'rink', shift: 12, time: '11:05', tags: [goal], fav: true},
];

const R = 'calc(var(--u) * 20)';
const r = 'calc(var(--u) * 4)';
const FAV_RADIUS = [`${R} ${r} ${r} ${r}`, r, `${r} ${R} ${r} ${r}`, r, r, r, `${r} ${r} ${r} ${R}`, r, `${r} ${r} ${R} ${r}`];

type Props = {
  tab?: 'events' | 'favorites';
  live?: boolean;
  liveTime?: string;
  liveCount?: number;
  /** Pulses the "New event" button (How it works, step 1). */
  highlightNew?: boolean;
};

export default function HomeMock({tab = 'events', live = false, liveTime = '12:34', liveCount = 5, highlightNew = false}: Props) {
  const months = live ? [{month: 'Today', events: [LIVE_EVENT]}, ...MONTHS] : MONTHS;
  const total = months.reduce((n, m) => n + m.events.length, 0);
  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <span className={styles.title}>ActionCut</span>
        <span className={styles.actions}>
          <Icon name="help" />
          <Icon name="settings" />
        </span>
      </div>
      <div className={styles.tabs}>
        <span className={clsx(styles.tab, tab === 'events' && styles.tabOn)}>Events</span>
        <span className={clsx(styles.tab, tab === 'favorites' && styles.tabOn)}>Favorites</span>
      </div>
      {tab === 'events' ? (
        <div className={styles.list}>
          <div className={styles.countRow}>
            <span>{total} events</span>
            <span className={clsx(styles.newBtn, highlightNew && styles.newBtnHot)}>
              <Icon name="plus" />
              New event
            </span>
          </div>
          {months.map((m) => (
            <div key={m.month}>
              <div className={styles.month}>
                <span>{m.month}</span>
                <span className={styles.monthCount}>
                  {m.events.length === 1 ? '1 event' : `${m.events.length} events`}
                  <Icon name="chevronDown" />
                </span>
              </div>
              <div className={styles.group}>
                {m.events.map((e, i) => (
                  <div key={e.title} className={styles.row} style={{borderRadius: groupRadius(i, m.events.length)}}>
                    <span className={styles.thumb}>
                      <Scene kind={e.kind} shift={e.shift} />
                    </span>
                    <span className={styles.rowText}>
                      <span className={styles.rowTitle}>{e.title}</span>
                      <span className={styles.rowSub}>{e.sub}</span>
                    </span>
                    {e.live && <LivePill />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.list}>
          <div className={styles.countRow}>
            <span>9 moments from 4 events</span>
            <span className={styles.link}>Select</span>
          </div>
          <div className={styles.filters}>
            <TagChip name="Goal" color={TAGS.goal.color} ink={TAGS.goal.ink} on />
            <TagChip name="Save" color={TAGS.save.color} />
            <TagChip name="Assist" color={TAGS.assist.color} />
          </div>
          <div className={styles.month}>
            <span>October · Semi-final vs Lions</span>
            <span className={styles.link}>Select all</span>
          </div>
          <div className={styles.grid}>
            {FAVORITES.map((tile, i) => (
              <MomentTile key={`${tile.time}-${i}`} tile={tile} radius={FAV_RADIUS[i]} />
            ))}
          </div>
        </div>
      )}
      {live && <LiveBar time={liveTime} count={liveCount} />}
    </div>
  );
}
```

`src/components/phone/HomeMock.module.css`:
```css
.root {
  --chip-font: calc(var(--u) * 13);
  position: absolute;
  inset: 0;
  background: var(--ac-cream);
  color: var(--ac-ink);
}

.topBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: calc(var(--u) * 64);
  margin-top: calc(var(--u) * 28);
  padding: 0 calc(var(--u) * 16) 0 calc(var(--u) * 20);
}

.title {
  font-size: calc(var(--u) * 24);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.actions {
  display: flex;
  gap: calc(var(--u) * 20);
  color: var(--ac-ink-2);
}

.actions svg {
  width: calc(var(--u) * 24);
  height: calc(var(--u) * 24);
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--ac-outline-variant);
}

.tab {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(var(--u) * 48);
  font-size: calc(var(--u) * 14);
  font-weight: 600;
  color: var(--ac-ink-2);
}

.tabOn {
  color: var(--ac-primary);
}

.tabOn::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  width: calc(var(--u) * 64);
  height: calc(var(--u) * 3);
  margin-left: calc(var(--u) * -32);
  border-radius: calc(var(--u) * 3) calc(var(--u) * 3) 0 0;
  background: var(--ac-primary);
}

.list {
  padding: calc(var(--u) * 4) calc(var(--u) * 16) 0;
}

.countRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: calc(var(--u) * 52);
  padding: 0 calc(var(--u) * 4);
  font-size: calc(var(--u) * 14);
  color: var(--ac-ink-2);
}

.newBtn {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--u) * 6);
  height: calc(var(--u) * 36);
  padding: 0 calc(var(--u) * 14) 0 calc(var(--u) * 10);
  border-radius: calc(var(--u) * 18);
  background: var(--ac-secondary-container);
  color: var(--ac-on-secondary-container);
  font-size: calc(var(--u) * 14);
  font-weight: 600;
}

.newBtn svg {
  width: calc(var(--u) * 18);
  height: calc(var(--u) * 18);
}

.newBtnHot {
  animation: hot 1.6s ease-in-out infinite;
}

@keyframes hot {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(255, 122, 26, 0.55);
  }
  50% {
    box-shadow: 0 0 0 calc(var(--u) * 8) rgba(255, 122, 26, 0);
  }
}

.month {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: calc(var(--u) * 44);
  padding: 0 calc(var(--u) * 4);
  font-size: calc(var(--u) * 14);
  font-weight: 600;
}

.monthCount {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--u) * 6);
  font-size: calc(var(--u) * 13);
  font-weight: 400;
  color: var(--ac-ink-2);
}

.monthCount svg {
  width: calc(var(--u) * 20);
  height: calc(var(--u) * 20);
  transform: rotate(180deg);
}

.group {
  display: flex;
  flex-direction: column;
  gap: calc(var(--u) * 2);
  padding-bottom: calc(var(--u) * 6);
}

.row {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 16);
  min-height: calc(var(--u) * 80);
  padding: calc(var(--u) * 12) calc(var(--u) * 16) calc(var(--u) * 12) calc(var(--u) * 12);
  background: var(--ac-item);
}

.thumb {
  position: relative;
  flex: none;
  width: calc(var(--u) * 56);
  height: calc(var(--u) * 56);
  border-radius: calc(var(--u) * 12);
  overflow: hidden;
}

.rowText {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: calc(var(--u) * 2);
}

.rowTitle {
  font-size: calc(var(--u) * 16);
  line-height: 1.5;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rowSub {
  font-size: calc(var(--u) * 14);
  line-height: 1.43;
  color: var(--ac-ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link {
  font-size: calc(var(--u) * 14);
  font-weight: 600;
  color: var(--ac-primary);
}

.filters {
  display: flex;
  gap: calc(var(--u) * 8);
  padding: 0 calc(var(--u) * 4) calc(var(--u) * 6);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: calc(var(--u) * 4);
}
```

- [ ] **Step 8: Create `EventMock`**

`src/components/phone/EventMock.tsx`:
```tsx
import {TAGS} from '@site/src/data/tags';
import Icon from '../brand/Icon';
import TagChip from '../ui/TagChip';
import {LiveBar, LivePill, MomentTile, type MockTile} from './MockBits';
import styles from './EventMock.module.css';

const TILES: MockTile[] = [
  {kind: 'rink', shift: -4, time: '15:10', title: 'First goal', tags: [TAGS.goal.color], fav: true},
  {kind: 'rink', shift: 8, time: '15:08', tags: [TAGS.save.color], interval: 12},
  {kind: 'rink', shift: -10, time: '14:59'},
  {kind: 'rink', shift: 3, time: '14:52', tags: [TAGS.assist.color, TAGS.goal.color], fav: true},
  {kind: 'rink', shift: 12, time: '14:41', cut: true},
  {kind: 'rink', shift: -6, time: '14:30', tags: [TAGS.save.color]},
  {kind: 'rink', shift: 0, time: '14:12', interval: 8},
  {kind: 'rink', shift: 9, time: '13:58', tags: [TAGS.goal.color]},
  {kind: 'rink', shift: -12, time: '13:51', fav: true},
  {kind: 'rink', shift: 5, time: '13:46'},
  {kind: 'rink', shift: -2, time: '13:45', tags: [TAGS.skill.color]},
  {kind: 'rink', shift: 11, time: '13:40'},
];

export default function EventMock({live = false}: {live?: boolean}) {
  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <Icon name="arrowLeft" />
        <span className={styles.actions}>
          {!live && <Icon name="download" />}
          <Icon name="more" />
        </span>
      </div>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.title}>Semi-final vs Lions</span>
          <Icon name="pencil" className={styles.pencil} />
        </div>
        <div className={styles.sub}>
          {live && <LivePill />}
          <span>Oct 4, 13:36 · 1h 34m · 12 moments</span>
        </div>
        <div className={styles.filters}>
          <TagChip name="Goal" color={TAGS.goal.color} />
          <TagChip name="Save" color={TAGS.save.color} />
          <TagChip name="Assist" color={TAGS.assist.color} />
        </div>
      </div>
      <div className={styles.grid}>
        {TILES.map((tile) => (
          <MomentTile key={tile.time} tile={tile} />
        ))}
      </div>
      {live && <LiveBar time="45:12" count={12} />}
    </div>
  );
}
```

`src/components/phone/EventMock.module.css`:
```css
.root {
  --chip-font: calc(var(--u) * 13);
  position: absolute;
  inset: 0;
  background: var(--ac-cream);
  color: var(--ac-ink);
}

.topBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: calc(var(--u) * 64);
  margin-top: calc(var(--u) * 28);
  padding: 0 calc(var(--u) * 16);
}

.topBar svg {
  width: calc(var(--u) * 24);
  height: calc(var(--u) * 24);
}

.actions {
  display: flex;
  gap: calc(var(--u) * 24);
}

.header {
  padding: 0 calc(var(--u) * 20) calc(var(--u) * 12);
}

.titleRow {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 6);
}

.title {
  font-size: calc(var(--u) * 28);
  line-height: 1.29;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pencil {
  flex: none;
  width: calc(var(--u) * 18);
  height: calc(var(--u) * 18);
  color: var(--ac-ink-2);
}

.sub {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 8);
  margin-top: calc(var(--u) * 4);
  font-size: calc(var(--u) * 14);
  color: var(--ac-ink-2);
}

.filters {
  display: flex;
  gap: calc(var(--u) * 8);
  margin-top: calc(var(--u) * 14);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: calc(var(--u) * 4);
  padding: calc(var(--u) * 4) calc(var(--u) * 16) 0;
}
```

- [ ] **Step 9: Create `MomentMock`**

`src/components/phone/MomentMock.tsx`:
```tsx
import {TAGS} from '@site/src/data/tags';
import {groupRadius} from '@site/src/lib/groupShape';
import Icon from '../brand/Icon';
import TagChip from '../ui/TagChip';
import Scene from './Scene';
import styles from './MomentMock.module.css';

/** Moment screen; `versions` shows the "Version 1 of 2" dots of a moment filmed from two phones. */
export default function MomentMock({versions = false}: {versions?: boolean}) {
  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <Icon name="arrowLeft" />
        <Icon name="more" />
      </div>
      <div className={styles.player}>
        <Scene kind="rink" shift={versions ? 10 : -4} players />
        <span className={styles.play}>
          <Icon name="play" />
        </span>
        <span className={styles.progress}>
          <span className={styles.time}>0:04</span>
          <span className={styles.track}>
            <span />
          </span>
          <span className={styles.time}>0:07</span>
        </span>
      </div>
      {versions && (
        <div className={styles.versions}>
          <span className={styles.dots}>
            <span className={styles.dotOn} />
            <span />
          </span>
          <span>Version 1 of 2 · from another video</span>
        </div>
      )}
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <span className={styles.title}>First goal</span>
          <Icon name="pencil" className={styles.pencil} />
        </div>
        <div className={styles.sub}>15:10:07 · Oct 4</div>
        <div className={styles.tags}>
          <TagChip name="Goal" color={TAGS.goal.color} ink={TAGS.goal.ink} on />
          <span className={styles.addTag}>
            <Icon name="plus" />
            Tag
          </span>
        </div>
        <div className={styles.rows}>
          <div className={styles.row} style={{borderRadius: groupRadius(0, 2)}}>
            <Icon name="scissors" className={styles.rowIcon} />
            <span className={styles.rowText}>
              <span className={styles.rowTitle}>Clip: 5 s before · 2 s after</span>
              <span className={styles.rowSub}>Event default</span>
            </span>
            <span className={styles.rowAction}>Customize</span>
          </div>
          <div className={styles.row} style={{borderRadius: groupRadius(1, 2)}}>
            <Icon name="video" className={styles.rowIcon} />
            <span className={styles.rowText}>
              <span className={styles.rowTitle}>Source video</span>
              <span className={styles.rowSub}>
                {versions ? 'PXL_20261004_150951.mp4 · 00:09 in video' : 'VID_20261004_150958.mp4 · 01:12 in video'}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span className={styles.toolbar}>
          <Icon name="chevronLeft" />
          <span className={styles.counter}>1/12</span>
          <Icon name="chevronRight" />
          <span className={styles.divider} />
          <span className={styles.heart}>
            <Icon name="heart" fill="currentColor" />
          </span>
          <Icon name="share" />
        </span>
        <span className={styles.save}>
          <Icon name="download" />
          Save
        </span>
      </div>
    </div>
  );
}
```

`src/components/phone/MomentMock.module.css`:
```css
.root {
  --chip-font: calc(var(--u) * 13);
  position: absolute;
  inset: 0;
  background: var(--ac-cream);
  color: var(--ac-ink);
}

.topBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: calc(var(--u) * 64);
  margin-top: calc(var(--u) * 28);
  padding: 0 calc(var(--u) * 16);
}

.topBar svg {
  width: calc(var(--u) * 24);
  height: calc(var(--u) * 24);
}

.player {
  position: relative;
  height: calc(var(--u) * 216);
  margin: 0 calc(var(--u) * 16);
  border-radius: calc(var(--u) * 28);
  overflow: hidden;
}

.play {
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--u) * 64);
  height: calc(var(--u) * 64);
  margin: calc(var(--u) * -32) 0 0 calc(var(--u) * -32);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  color: #ffffff;
}

.play svg {
  width: calc(var(--u) * 28);
  height: calc(var(--u) * 28);
}

.progress {
  position: absolute;
  left: calc(var(--u) * 16);
  right: calc(var(--u) * 16);
  bottom: calc(var(--u) * 14);
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 10);
  color: #ffffff;
  font-size: calc(var(--u) * 12);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.time {
  padding: calc(var(--u) * 2) calc(var(--u) * 6);
  border-radius: calc(var(--u) * 6);
  background: rgba(0, 0, 0, 0.55);
}

.track {
  position: relative;
  flex: 1;
  height: calc(var(--u) * 4);
  border-radius: calc(var(--u) * 2);
  background: rgba(0, 0, 0, 0.25);
}

.track span {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 55%;
  border-radius: inherit;
  background: #ffffff;
  animation: playback 7s linear infinite;
}

@keyframes playback {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.versions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(var(--u) * 6);
  padding-top: calc(var(--u) * 12);
  font-size: calc(var(--u) * 12);
  color: var(--ac-ink-2);
}

.dots {
  display: flex;
  gap: calc(var(--u) * 8);
}

.dots span {
  width: calc(var(--u) * 8);
  height: calc(var(--u) * 8);
  border-radius: calc(var(--u) * 4);
  background: var(--ac-outline-variant);
}

.dots .dotOn {
  width: calc(var(--u) * 20);
  background: var(--ac-primary);
}

.body {
  padding: calc(var(--u) * 16) calc(var(--u) * 20) 0;
}

.titleRow {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 6);
}

.title {
  font-size: calc(var(--u) * 28);
  line-height: 1.29;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.pencil {
  width: calc(var(--u) * 18);
  height: calc(var(--u) * 18);
  color: var(--ac-ink-2);
}

.sub {
  font-size: calc(var(--u) * 14);
  color: var(--ac-ink-2);
}

.tags {
  display: flex;
  gap: calc(var(--u) * 8);
  margin-top: calc(var(--u) * 14);
}

.addTag {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--u) * 4);
  height: calc(var(--u) * 30);
  padding: 0 calc(var(--u) * 12) 0 calc(var(--u) * 8);
  border-radius: calc(var(--u) * 15);
  box-shadow: inset 0 0 0 1px var(--ac-outline-variant);
  font-size: calc(var(--u) * 13);
  font-weight: 600;
  color: var(--ac-ink-2);
}

.addTag svg {
  width: calc(var(--u) * 16);
  height: calc(var(--u) * 16);
}

.rows {
  display: flex;
  flex-direction: column;
  gap: calc(var(--u) * 2);
  margin-top: calc(var(--u) * 16);
}

.row {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 14);
  min-height: calc(var(--u) * 56);
  padding: calc(var(--u) * 8) calc(var(--u) * 12) calc(var(--u) * 8) calc(var(--u) * 16);
  background: var(--ac-item);
}

.rowIcon {
  flex: none;
  width: calc(var(--u) * 20);
  height: calc(var(--u) * 20);
  color: var(--ac-ink-2);
}

.rowText {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.rowTitle {
  font-size: calc(var(--u) * 15);
  font-weight: 500;
}

.rowSub {
  font-size: calc(var(--u) * 13);
  color: var(--ac-ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rowAction {
  flex: none;
  font-size: calc(var(--u) * 14);
  font-weight: 600;
  color: var(--ac-primary);
}

.bottom {
  position: absolute;
  left: calc(var(--u) * 16);
  right: calc(var(--u) * 16);
  bottom: calc(var(--u) * 28);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(var(--u) * 8);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 12);
  height: calc(var(--u) * 64);
  padding: 0 calc(var(--u) * 16);
  border-radius: calc(var(--u) * 32);
  background: var(--ac-item);
  box-shadow: 0 calc(var(--u) * 4) calc(var(--u) * 14) rgba(0, 0, 0, 0.14);
}

.toolbar svg {
  width: calc(var(--u) * 22);
  height: calc(var(--u) * 22);
}

.counter {
  min-width: calc(var(--u) * 36);
  text-align: center;
  font-size: calc(var(--u) * 14);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.divider {
  width: 1px;
  height: calc(var(--u) * 24);
  background: var(--ac-outline-variant);
}

.heart {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--u) * 40);
  height: calc(var(--u) * 40);
  border-radius: 50%;
  background: var(--ac-live-container);
  color: var(--ac-favorite);
}

.save {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 8);
  height: calc(var(--u) * 64);
  padding: 0 calc(var(--u) * 20) 0 calc(var(--u) * 16);
  border-radius: calc(var(--u) * 20);
  background: var(--ac-orange);
  color: var(--ac-on-orange);
  font-size: calc(var(--u) * 16);
  font-weight: 600;
  box-shadow: 0 calc(var(--u) * 4) calc(var(--u) * 8) rgba(0, 0, 0, 0.16);
}

.save svg {
  width: calc(var(--u) * 22);
  height: calc(var(--u) * 22);
}
```

- [ ] **Step 10: Create `IphoneLiveMock` (Lock Screen with the Live Activity)**

`src/components/phone/IphoneLiveMock.tsx`:
```tsx
import clsx from 'clsx';
import {QUICK_TAGS} from '@site/src/data/tags';
import Icon from '../brand/Icon';
import TagChip from '../ui/TagChip';
import Scene from './Scene';
import styles from './IphoneLiveMock.module.css';

/** Concept of the iOS Live Activity "Event in progress" (iOS spec D13). */
export default function IphoneLiveMock() {
  return (
    <div className={styles.root}>
      <div className={styles.wallpaper}>
        <Scene kind="pitch" orientation="horizontal" players />
      </div>
      <div className={styles.date}>Saturday, October 10</div>
      <div className={styles.clock}>10:24</div>
      <div className={styles.activity}>
        <div className={styles.head}>
          <span className={styles.badge}>
            <Icon name="crosshair" />
          </span>
          <span className={styles.headText}>
            <span className={styles.headTitle}>Event in progress</span>
            <span className={styles.headSub}>Semi-final · 9 moments</span>
          </span>
          <span className={styles.timer}>45:12</span>
        </div>
        <div className={styles.buttons}>
          <span className={styles.mark}>
            <Icon name="crosshair" />
            Mark
          </span>
          <span className={styles.interval}>
            <Icon name="interval" />
            Interval
          </span>
        </div>
        <div className={styles.chips}>
          {QUICK_TAGS.map((t) => (
            <TagChip key={t.name} tone="overlay" name={t.name} color={t.color} />
          ))}
        </div>
      </div>
      <span className={clsx(styles.corner, styles.cornerLeft)}>
        <Icon name="zap" />
      </span>
      <span className={clsx(styles.corner, styles.cornerRight)}>
        <Icon name="video" />
      </span>
    </div>
  );
}
```

`src/components/phone/IphoneLiveMock.module.css`:
```css
.root {
  --chip-font: calc(var(--u) * 13);
  position: absolute;
  inset: 0;
  background: #1b1410;
  color: #ffffff;
}

.wallpaper {
  position: absolute;
  inset: 0;
  opacity: 0.55;
}

.wallpaper::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(20, 12, 8, 0.45);
}

.date {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(var(--u) * 92);
  text-align: center;
  font-size: calc(var(--u) * 19);
  font-weight: 600;
}

.clock {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(var(--u) * 112);
  text-align: center;
  font-size: calc(var(--u) * 104);
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variation-settings: 'wdth' 80;
  font-variant-numeric: tabular-nums;
}

.activity {
  position: absolute;
  left: calc(var(--u) * 12);
  right: calc(var(--u) * 12);
  bottom: calc(var(--u) * 140);
  padding: calc(var(--u) * 16);
  border-radius: calc(var(--u) * 26);
  background: rgba(28, 20, 16, 0.86);
  box-shadow: 0 calc(var(--u) * 10) calc(var(--u) * 30) rgba(0, 0, 0, 0.35);
}

.head {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 12);
}

.badge {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--u) * 36);
  height: calc(var(--u) * 36);
  border-radius: calc(var(--u) * 11);
  background: var(--ac-orange);
  color: #ffffff;
}

.badge svg {
  width: calc(var(--u) * 22);
  height: calc(var(--u) * 22);
}

.headText {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.headTitle {
  font-size: calc(var(--u) * 16);
  font-weight: 600;
}

.headSub {
  font-size: calc(var(--u) * 13);
  color: var(--ac-on-brown-2);
}

.timer {
  font-size: calc(var(--u) * 17);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--ac-inverse-primary);
}

.buttons {
  display: flex;
  gap: calc(var(--u) * 8);
  margin-top: calc(var(--u) * 14);
}

.mark,
.interval {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(var(--u) * 8);
  height: calc(var(--u) * 46);
  border-radius: calc(var(--u) * 23);
  font-size: calc(var(--u) * 15);
  font-weight: 700;
}

.mark {
  background: var(--ac-orange);
  color: var(--ac-on-orange);
  animation: markPulse 2s ease-out infinite;
}

.interval {
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
}

.mark svg,
.interval svg {
  width: calc(var(--u) * 20);
  height: calc(var(--u) * 20);
}

.chips {
  display: flex;
  gap: calc(var(--u) * 6);
  margin-top: calc(var(--u) * 12);
}

.corner {
  position: absolute;
  bottom: calc(var(--u) * 48);
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--u) * 50);
  height: calc(var(--u) * 50);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
}

.corner svg {
  width: calc(var(--u) * 22);
  height: calc(var(--u) * 22);
}

.cornerLeft {
  left: calc(var(--u) * 46);
}

.cornerRight {
  right: calc(var(--u) * 46);
}

@keyframes markPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 122, 26, 0.6);
  }
  70%,
  100% {
    box-shadow: 0 0 0 calc(var(--u) * 12) rgba(255, 122, 26, 0);
  }
}
```

- [ ] **Step 11: Create `Screen` (screenshot in a frame, with fallback)**

`src/components/phone/Screen.tsx`:
```tsx
import useBaseUrl from '@docusaurus/useBaseUrl';
import type {ReactNode} from 'react';
import Icon from '../brand/Icon';
import PhoneFrame from './PhoneFrame';
import styles from './Screen.module.css';

type Props = {
  /** Path under static/, e.g. '/img/screens/event.png'. */
  src?: string;
  name: string;
  caption?: string;
  platform?: 'android' | 'iphone';
  /** Shown instead of the placeholder while there is no screenshot. */
  fallback?: ReactNode;
};

export default function Screen({src, name, caption, platform = 'android', fallback}: Props) {
  const url = useBaseUrl(src ?? '/');
  let body: ReactNode;
  if (src) {
    body = <img src={url} alt="" loading="lazy" decoding="async" className={styles.img} />;
  } else if (fallback) {
    body = fallback;
  } else {
    body = (
      <div className={styles.placeholder}>
        <Icon name="crosshair" className={styles.placeholderIcon} />
        <span>Screenshot: {name}</span>
      </div>
    );
  }
  return (
    <figure className={styles.figure}>
      <PhoneFrame platform={platform} label={caption ?? name}>
        {body}
      </PhoneFrame>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
```

`src/components/phone/Screen.module.css`:
```css
.figure {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  object-fit: cover;
  object-position: top;
}

.placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(var(--u) * 14);
  padding: calc(var(--u) * 32);
  text-align: center;
  font-size: calc(var(--u) * 18);
  font-weight: 600;
  color: var(--ac-ink-2);
  background: repeating-linear-gradient(
    135deg,
    var(--ac-cream) 0 calc(var(--u) * 14),
    var(--ac-container-high) calc(var(--u) * 14) calc(var(--u) * 28)
  );
}

.placeholderIcon {
  width: calc(var(--u) * 56);
  height: calc(var(--u) * 56);
  color: var(--ac-orange);
}

.caption {
  margin-top: 12px;
  text-align: center;
  font-size: 14px;
  color: var(--ac-ink-2);
}
```

- [ ] **Step 12: Temporary mock gallery in `src/pages/index.tsx`**

```tsx
import Layout from '@theme/Layout';
import CameraOverlayMock from '@site/src/components/phone/CameraOverlayMock';
import EventMock from '@site/src/components/phone/EventMock';
import HomeMock from '@site/src/components/phone/HomeMock';
import IphoneLiveMock from '@site/src/components/phone/IphoneLiveMock';
import MomentMock from '@site/src/components/phone/MomentMock';
import PhoneFrame from '@site/src/components/phone/PhoneFrame';
import Screen from '@site/src/components/phone/Screen';
import {QUICK_TAGS} from '@site/src/data/tags';

// Temporary: visual check of the mocks. Replaced by the landing page in Task 5.
export default function Home() {
  return (
    <Layout title="Mocks">
      <main style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 32, padding: 32}}>
        <PhoneFrame label="Camera">
          <CameraOverlayMock count={6} recTime="01:24" chipsVisible countdown={0.6} chips={QUICK_TAGS.map((t) => ({...t, on: t.name === 'Goal'}))} />
        </PhoneFrame>
        <PhoneFrame label="Home">
          <HomeMock highlightNew />
        </PhoneFrame>
        <PhoneFrame label="Home live">
          <HomeMock live />
        </PhoneFrame>
        <PhoneFrame label="Favorites">
          <HomeMock tab="favorites" />
        </PhoneFrame>
        <PhoneFrame label="Event">
          <EventMock />
        </PhoneFrame>
        <PhoneFrame label="Moment">
          <MomentMock versions />
        </PhoneFrame>
        <PhoneFrame platform="iphone" label="iPhone">
          <IphoneLiveMock />
        </PhoneFrame>
        <Screen name="Event screen" caption="Placeholder" />
      </main>
    </Layout>
  );
}
```

- [ ] **Step 13: Typecheck, test, build, look**

Run: `npm run typecheck && npm test && npm run build`
Expected: all green.

Browser check procedure on `/` at 1440×900: full-page screenshot. Compare each phone with the artboards (Home, Event, Moment, OverlayQuick in "ActionCut Redesign"): rounded grouped rows, 3-column tiles with dots/hearts/pills, live bar dark with Stop, orange floating button with count badge and chips to its left. Nothing overflows the screens; text is crisp. Fix anything that does before committing.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat(mocks): phone frame and HTML recreations of the app screens

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Hero, Problem, How it works

**Files:**
- Create: `src/lib/heroLoop.ts`, `src/lib/heroLoop.test.ts`, `src/data/steps.ts`
- Create: `src/components/landing/Hero.tsx`, `Hero.module.css`, `Problem.tsx`, `Problem.module.css`, `HowItWorks.tsx`, `HowItWorks.module.css`
- Replace: `src/pages/index.tsx`

**Interfaces:**
- Consumes: `Section`, `Button`, `StoreBadge`, `RevealGroup`/`RevealItem`, `Shape`, `Icon` (Task 2); `PhoneFrame`, `Scene`, `CameraOverlayMock`, `HomeMock`, `EventMock` (Task 4); `site`, `QUICK_TAGS`, `TAGS` (Task 1).
- Produces: `heroFrame(step: number): HeroFrame` with `HeroFrame = {count: number; hot: boolean; chipsVisible: boolean; goalOn: boolean; countdown: number; recSeconds: number}`; `formatClock(totalSeconds: number): string` (`'01:24'`) — also used by Task 6.
- Produces: `steps: Step[]` with `Step = {title: string; body: string; screen: StepScreen}`, `StepScreen = 'home' | 'camera' | 'tags' | 'event'`.
- Produces: section anchors `#how-it-works`.

- [ ] **Step 1: Write the failing test for the hero loop**

`src/lib/heroLoop.test.ts`:
```ts
import {describe, expect, it} from 'vitest';
import {formatClock, heroFrame} from './heroLoop';

describe('heroFrame — the looping "tap at a goal" in the hero phone', () => {
  it('starts idle with 5 moments', () => {
    expect(heroFrame(0)).toMatchObject({count: 5, hot: false, chipsVisible: false, goalOn: false});
  });

  it('marks on step 1: red button, one more moment, quick tags open', () => {
    expect(heroFrame(1)).toMatchObject({count: 6, hot: true, chipsVisible: true, goalOn: false, countdown: 1});
  });

  it('tags Goal on step 3 and closes the tags after step 4', () => {
    expect(heroFrame(3)).toMatchObject({goalOn: true, chipsVisible: true});
    expect(heroFrame(5)).toMatchObject({chipsVisible: false, goalOn: false, countdown: 0});
  });

  it('keeps counting across loops and stops at 99', () => {
    expect(heroFrame(6).count).toBe(6);
    expect(heroFrame(7).count).toBe(7);
    expect(heroFrame(6 * 200).count).toBe(99);
  });

  it('advances the recording clock', () => {
    expect(heroFrame(0).recSeconds).toBe(84);
    expect(heroFrame(10).recSeconds).toBe(95);
  });
});

describe('formatClock', () => {
  it('pads minutes and seconds', () => {
    expect(formatClock(84)).toBe('01:24');
    expect(formatClock(5)).toBe('00:05');
    expect(formatClock(3600)).toBe('60:00');
  });
});
```

Run: `npm test -- src/lib/heroLoop.test.ts`
Expected: FAIL — `Failed to resolve import "./heroLoop"`.

- [ ] **Step 2: Implement `src/lib/heroLoop.ts`**

```ts
export type HeroFrame = {
  count: number;
  hot: boolean;
  chipsVisible: boolean;
  goalOn: boolean;
  /** Share of the quick-tag window left, 1 → 0. */
  countdown: number;
  recSeconds: number;
};

const LOOP = 6;

/** One frame of the hero animation; `step` grows by one every ~1.1 s. */
export function heroFrame(step: number): HeroFrame {
  const phase = step % LOOP;
  const loops = Math.floor(step / LOOP);
  const open = phase >= 1 && phase <= 4;
  return {
    count: Math.min(99, 5 + loops + (phase >= 1 ? 1 : 0)),
    hot: phase === 1,
    chipsVisible: open,
    goalOn: phase >= 3 && phase <= 4,
    countdown: open ? 1 - (phase - 1) / 4 : 0,
    recSeconds: 84 + Math.floor(step * 1.1),
  };
}

export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
```

Run: `npm test`
Expected: PASS.

- [ ] **Step 3: Create `src/data/steps.ts`**

```ts
export type StepScreen = 'home' | 'camera' | 'tags' | 'event';
export type Step = {title: string; body: string; screen: StepScreen};

export const steps: Step[] = [
  {
    title: 'Start an event',
    body: 'Tap New event before kick-off. A small crosshair button now floats on top of every app.',
    screen: 'home',
  },
  {
    title: 'Film as usual',
    body: 'Record with the camera app you already use. ActionCut doesn’t record anything — it only remembers when you tap.',
    screen: 'camera',
  },
  {
    title: 'Tap at great plays',
    body: 'One tap marks a moment. For a longer play, hold the button and let go when it ends. It buzzes, pulses and counts — and quick tags pop up beside it.',
    screen: 'tags',
  },
  {
    title: 'Review, save, share',
    body: 'Stop the event and ActionCut cuts a clip around every moment: 5 seconds before your tap, 2 after. Save the best ones to the ActionCut album or share them anywhere.',
    screen: 'event',
  },
];
```

- [ ] **Step 4: Create the Hero**

`src/components/landing/Hero.tsx`:
```tsx
import clsx from 'clsx';
import {useReducedMotion} from 'motion/react';
import {useEffect, useState} from 'react';
import {site} from '@site/src/data/site';
import {QUICK_TAGS} from '@site/src/data/tags';
import {formatClock, heroFrame} from '@site/src/lib/heroLoop';
import Icon from '../brand/Icon';
import Shape from '../brand/Shapes';
import CameraOverlayMock from '../phone/CameraOverlayMock';
import PhoneFrame from '../phone/PhoneFrame';
import Button from '../ui/Button';
import Section from '../ui/Section';
import StoreBadge from '../ui/StoreBadge';
import styles from './Hero.module.css';

const WORDS = ['Tap.', 'Tag.', 'Done.'];
const TRUST = ['No account', 'Videos stay on your phone', 'Works with your camera app'];

export default function Hero() {
  const reduce = useReducedMotion();
  // Step 0 on the server and on the first client render; the loop starts after hydration.
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) {
      setStep(3);
      return undefined;
    }
    const id = window.setInterval(() => setStep((s) => s + 1), 1100);
    return () => window.clearInterval(id);
  }, [reduce]);

  const frame = heroFrame(step);

  return (
    <Section tone="cream" className={styles.hero} innerClassName={styles.inner} labelledBy="hero-title">
      <Shape kind="cookie12" color="var(--ac-orange)" spin className={styles.cookie} />
      <Shape kind="pill" color="var(--ac-blue)" className={styles.pill} />
      <Shape kind="clover" color="var(--ac-secondary-container)" spin className={styles.clover} />

      <div className={styles.copy}>
        <span className="ac-eyebrow">For parents on the sideline</span>
        <h1 id="hero-title" className={styles.title}>
          {WORDS.map((word, i) => (
            <span key={word} className={clsx(styles.word, i === WORDS.length - 1 && styles.accent)}>
              {word}
            </span>
          ))}
        </h1>
        <p className="ac-lead">
          Film your kid’s game with your usual camera. Tap the floating button at every great play — ActionCut cuts the
          clips for you.
        </p>
        <div className={styles.ctas}>
          <Button href={site.apkUrl} download size="l" icon={<Icon name="download" />}>
            Download for Android
          </Button>
          <span className={styles.meta}>Free · {site.minAndroid}</span>
        </div>
        <div className={styles.badges}>
          <StoreBadge label="Google Play" href={site.googlePlayUrl} />
          <StoreBadge label="iPhone" href={site.appStoreUrl} />
        </div>
        <ul className={styles.trust}>
          {TRUST.map((t) => (
            <li key={t}>
              <Icon name="check" size={18} strokeWidth={2.6} />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.visual}>
        <div className={styles.phoneWrap}>
          <PhoneFrame label="ActionCut’s floating button over the camera app, with the quick tags Goal, Save and Assist">
            <CameraOverlayMock
              count={frame.count}
              recTime={formatClock(frame.recSeconds)}
              hot={frame.hot}
              chipsVisible={frame.chipsVisible}
              countdown={frame.countdown}
              chips={QUICK_TAGS.map((t) => ({...t, on: t.name === 'Goal' && frame.goalOn}))}
            />
          </PhoneFrame>
        </div>
      </div>
    </Section>
  );
}
```

`src/components/landing/Hero.module.css`:
```css
.hero {
  margin-top: 12px;
}

.inner {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  align-items: center;
  gap: clamp(32px, 5vw, 72px);
  padding-top: clamp(48px, 7vw, 96px);
  padding-bottom: clamp(56px, 7vw, 96px);
}

.copy {
  position: relative;
  z-index: 1;
}

.title {
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.22em;
  margin: 0 0 20px;
  font-size: clamp(56px, 9.5vw, 128px);
  line-height: 0.92;
  font-weight: 780;
  letter-spacing: -0.035em;
  animation: breathe 7s ease-in-out 1.6s infinite;
}

.word {
  display: inline-block;
  animation: rise 0.9s var(--ac-ease-spring) both;
}

.word:nth-child(2) {
  animation-delay: 0.12s;
}

.word:nth-child(3) {
  animation-delay: 0.24s;
}

.accent {
  color: var(--ac-primary);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(0.35em) scale(0.92);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* The headline "breathes" on the variable font's width axis. */
@keyframes breathe {
  0%,
  100% {
    font-variation-settings: 'ROND' 100, 'wdth' 100;
  }
  50% {
    font-variation-settings: 'ROND' 100, 'wdth' 86;
  }
}

.ctas {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 18px;
  margin-top: 32px;
}

.meta {
  font-size: 15px;
  font-weight: 600;
  color: var(--ac-ink-2);
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.trust {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
  font-size: 15px;
  font-weight: 600;
  color: var(--ac-ink-2);
}

.trust li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.trust svg {
  color: var(--ac-primary);
}

.visual {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
}

.phoneWrap {
  width: min(340px, 78vw);
  transform: rotate(2deg);
  animation: phoneIn 1.1s var(--ac-ease-spring) 0.2s both;
}

@keyframes phoneIn {
  from {
    opacity: 0;
    transform: translateY(60px) rotate(6deg);
  }
  to {
    opacity: 1;
    transform: rotate(2deg);
  }
}

.cookie {
  position: absolute;
  right: -6%;
  top: 6%;
  width: clamp(320px, 42vw, 620px);
  z-index: 0;
}

.pill {
  position: absolute;
  left: -60px;
  bottom: -40px;
  width: 220px;
  transform: rotate(-14deg);
  z-index: 0;
}

.clover {
  position: absolute;
  right: 44%;
  top: 40px;
  width: 90px;
  z-index: 0;
}

@media (max-width: 996px) {
  .inner {
    grid-template-columns: 1fr;
  }

  .cookie {
    top: auto;
    bottom: -12%;
    right: -40vw;
    width: 120vw;
  }

  .clover {
    display: none;
  }
}
```

- [ ] **Step 5: Create the Problem section**

`src/components/landing/Problem.tsx`:
```tsx
import {motion, useScroll, useTransform} from 'motion/react';
import {useRef} from 'react';
import {TAGS} from '@site/src/data/tags';
import Icon from '../brand/Icon';
import Scene, {type SceneKind} from '../phone/Scene';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import styles from './Problem.module.css';

const PINS = [12, 31, 38, 63, 86];
const CLIPS: {kind: SceneKind; shift: number; tag?: string}[] = [
  {kind: 'pitch', shift: -6, tag: TAGS.goal.color},
  {kind: 'pitch', shift: 8, tag: TAGS.save.color},
  {kind: 'pitch', shift: 0, tag: TAGS.assist.color},
  {kind: 'pitch', shift: -10, tag: TAGS.goal.color},
  {kind: 'pitch', shift: 5},
];

export default function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const {scrollYProgress} = useScroll({target: ref, offset: ['start 0.9', 'end 0.45']});
  // The long recording shrinks as its clips appear (static under reduced motion, see CSS).
  const barScale = useTransform(scrollYProgress, [0, 1], [1, 0.72]);

  return (
    <Section tone="white" labelledBy="problem-title">
      <RevealGroup className={styles.head}>
        <RevealItem>
          <h2 id="problem-title" className="ac-h2">
            A 90-minute game.
            <br />
            Five moments you’ll actually rewatch.
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="ac-lead">
            Nobody scrubs through an hour of shaky footage to find the goal. With ActionCut you mark it the second it
            happens — and the clip is waiting for you after the game.
          </p>
        </RevealItem>
      </RevealGroup>

      <div ref={ref} className={styles.diagram}>
        <div className={styles.rowLabel}>
          <span>Your recording</span>
          <span className="ac-tnum">1h 39m</span>
        </div>
        <motion.div className={styles.bar} style={{scaleX: barScale}}>
          <span className={styles.film} />
          {PINS.map((left, i) => (
            <motion.span
              key={left}
              className={styles.pin}
              style={{left: `${left}%`}}
              initial={{y: -24, opacity: 0}}
              whileInView={{y: 0, opacity: 1}}
              viewport={{once: true, amount: 1}}
              transition={{type: 'spring', stiffness: 500, damping: 22, delay: i * 0.08}}
              data-reveal=""
            />
          ))}
        </motion.div>
        <div className={styles.arrow}>
          <Icon name="arrowRight" />5 moments → 5 clips · 7 s each
        </div>
        <RevealGroup className={styles.clips}>
          {CLIPS.map((clip, i) => (
            <RevealItem key={i} className={styles.clip}>
              <Scene kind={clip.kind} shift={clip.shift} />
              {clip.tag && <span className={styles.clipTag} style={{background: clip.tag}} />}
              <span className={styles.clipTime}>0:07</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
```

`src/components/landing/Problem.module.css`:
```css
.head {
  max-width: 860px;
}

.diagram {
  margin-top: clamp(40px, 6vw, 72px);
}

.rowLabel {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  font-size: 15px;
  font-weight: 650;
  color: var(--ac-ink-2);
}

.bar {
  position: relative;
  height: 64px;
  border-radius: 22px;
  background: var(--ac-cream);
  box-shadow: inset 0 0 0 1px var(--ac-outline-variant);
  transform-origin: left center;
}

.film {
  position: absolute;
  inset: 12px 14px;
  border-radius: 10px;
  background: repeating-linear-gradient(90deg, var(--ac-container-high) 0 22px, transparent 22px 28px);
}

.pin {
  position: absolute;
  top: -10px;
  width: 6px;
  height: 84px;
  margin-left: -3px;
  border-radius: 3px;
  background: var(--ac-orange);
  box-shadow: 0 4px 10px rgba(156, 69, 0, 0.3);
}

.pin::before {
  content: '';
  position: absolute;
  left: 50%;
  top: -6px;
  width: 16px;
  height: 16px;
  margin-left: -8px;
  border-radius: 50%;
  background: var(--ac-orange);
  box-shadow: 0 0 0 4px var(--ac-item);
}

.arrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 36px 0 20px;
  font-size: 17px;
  font-weight: 700;
  color: var(--ac-primary);
}

.clips {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(8px, 1.5vw, 16px);
}

.clip {
  position: relative;
  aspect-ratio: 3 / 4;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 24px -12px rgba(37, 25, 18, 0.4);
}

.clipTag {
  position: absolute;
  left: 8px;
  top: 8px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #ffffff;
}

.clipTime {
  position: absolute;
  left: 8px;
  bottom: 8px;
  height: 24px;
  padding: 0 8px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  font-size: 13px;
  font-weight: 650;
  line-height: 24px;
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .bar {
    transform: none !important;
  }
}

@media (max-width: 600px) {
  .clip {
    border-radius: 12px;
  }

  .clipTag {
    left: 5px;
    top: 5px;
    width: 10px;
    height: 10px;
  }

  .clipTime {
    left: 4px;
    bottom: 4px;
    height: 20px;
    padding: 0 5px;
    font-size: 11px;
    line-height: 20px;
  }
}
```

- [ ] **Step 6: Create How it works (sticky phone that follows the steps)**

`src/components/landing/HowItWorks.tsx`:
```tsx
import clsx from 'clsx';
import {AnimatePresence, motion, useInView} from 'motion/react';
import {useEffect, useRef, useState} from 'react';
import {steps, type Step, type StepScreen} from '@site/src/data/steps';
import {QUICK_TAGS} from '@site/src/data/tags';
import Shape from '../brand/Shapes';
import CameraOverlayMock from '../phone/CameraOverlayMock';
import EventMock from '../phone/EventMock';
import HomeMock from '../phone/HomeMock';
import PhoneFrame from '../phone/PhoneFrame';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import styles from './HowItWorks.module.css';

function StepMock({screen}: {screen: StepScreen}) {
  switch (screen) {
    case 'home':
      return <HomeMock highlightNew />;
    case 'camera':
      return <CameraOverlayMock count={0} recTime="00:12" scene="pitch" />;
    case 'tags':
      return (
        <CameraOverlayMock
          count={3}
          recTime="23:41"
          scene="pitch"
          hot
          chipsVisible
          countdown={0.6}
          chips={QUICK_TAGS.map((t) => ({...t, on: t.name === 'Goal'}))}
        />
      );
    case 'event':
      return <EventMock />;
  }
}

function StepItem({index, step, active, onActive}: {index: number; step: Step; active: boolean; onActive: (i: number) => void}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, {amount: 0.6});
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li ref={ref} className={clsx(styles.step, active && styles.stepOn)}>
      <span className={styles.num}>{index + 1}</span>
      <h3 className={styles.stepTitle}>{step.title}</h3>
      <p className={styles.stepBody}>{step.body}</p>
      <div className={styles.inlinePhone}>
        <PhoneFrame label={step.title}>
          <StepMock screen={step.screen} />
        </PhoneFrame>
      </div>
    </li>
  );
}

export default function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <Section id="how-it-works" tone="cream" labelledBy="how-title">
      <RevealGroup className={styles.head}>
        <RevealItem>
          <span className="ac-eyebrow">How it works</span>
        </RevealItem>
        <RevealItem>
          <h2 id="how-title" className="ac-h2">
            You film. You tap.
            <br />
            ActionCut does the cutting.
          </h2>
        </RevealItem>
      </RevealGroup>

      <div className={styles.layout}>
        <ol className={styles.steps}>
          {steps.map((step, i) => (
            <StepItem key={step.title} index={i} step={step} active={active === i} onActive={setActive} />
          ))}
        </ol>

        <div className={styles.stickyCol} aria-hidden="true">
          <div className={styles.sticky}>
            <Shape kind="cookie9" color="var(--ac-container-high)" spin className={styles.shape} />
            <div className={styles.phone}>
              <PhoneFrame label={steps[active].title}>
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active}
                    className={styles.screenLayer}
                    initial={{opacity: 0, x: 40}}
                    animate={{opacity: 1, x: 0}}
                    exit={{opacity: 0, x: -40}}
                    transition={{type: 'spring', stiffness: 300, damping: 32}}>
                    <StepMock screen={steps[active].screen} />
                  </motion.div>
                </AnimatePresence>
              </PhoneFrame>
            </div>
            <div className={styles.dots}>
              {steps.map((step, i) => (
                <span key={step.title} className={clsx(styles.dot, i === active && styles.dotOn)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/components/landing/HowItWorks.module.css`:
```css
.head {
  max-width: 760px;
  margin-bottom: clamp(24px, 4vw, 48px);
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(32px, 6vw, 96px);
}

.steps {
  margin: 0;
  padding: 0;
  list-style: none;
}

.step {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 72vh;
  opacity: 0.32;
  transition: opacity 0.4s var(--ac-ease-out);
}

.stepOn {
  opacity: 1;
}

.num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 18px;
  border-radius: 16px;
  background: var(--ac-secondary-container);
  color: var(--ac-on-secondary-container);
  font-size: 20px;
  font-weight: 800;
  transition:
    border-radius 0.5s var(--ac-ease-spring),
    background-color 0.3s,
    color 0.3s;
}

.stepOn .num {
  border-radius: 24px;
  background: var(--ac-orange);
  color: var(--ac-on-orange);
}

.stepTitle {
  margin: 0 0 12px;
  font-size: clamp(30px, 3.4vw, 44px);
  line-height: 1.05;
  font-weight: 720;
}

.stepBody {
  max-width: 30rem;
  margin: 0;
  font-size: 18px;
  line-height: 1.55;
  color: var(--ac-ink-2);
}

.inlinePhone {
  display: none;
}

.stickyCol {
  position: relative;
}

.sticky {
  position: sticky;
  top: max(96px, calc(50vh - 330px));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.shape {
  position: absolute;
  left: 50%;
  top: 46%;
  width: 460px;
  transform: translate(-50%, -50%);
}

.phone {
  position: relative;
  width: 300px;
}

.screenLayer {
  position: absolute;
  inset: 0;
}

.dots {
  position: relative;
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: var(--ac-outline-variant);
  transition:
    width 0.4s var(--ac-ease-spring),
    background-color 0.3s;
}

.dotOn {
  width: 28px;
  background: var(--ac-primary);
}

@media (max-width: 996px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .stickyCol {
    display: none;
  }

  .step {
    min-height: 0;
    padding: 32px 0;
    opacity: 1;
  }

  .inlinePhone {
    display: block;
    width: min(280px, 76vw);
    margin: 28px auto 0;
  }
}
```

- [ ] **Step 7: Replace `src/pages/index.tsx` with the landing page so far**

```tsx
import Layout from '@theme/Layout';
import Hero from '@site/src/components/landing/Hero';
import HowItWorks from '@site/src/components/landing/HowItWorks';
import Problem from '@site/src/components/landing/Problem';
import {site} from '@site/src/data/site';

export default function Home() {
  return (
    <Layout title="Highlight clips from every game" description={site.description}>
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
      </main>
    </Layout>
  );
}
```

- [ ] **Step 8: Typecheck, test, build**

Run: `npm run typecheck && npm test && npm run build`
Expected: all green.

- [ ] **Step 9: Browser check (Review Focus 1 and 4)**

Browser check procedure on `/`:
- 1440×900: full-page screenshot. The hero headline animates in, the phone loops (button turns red, count goes up, chips appear, Goal fills). Scroll through How it works: the phone stays in place and its screen changes per step; the step number turns orange.
- 390×844 and 360×740: `scrollWidth − clientWidth` is `0`; headline wraps; How it works shows one phone under each step.
- `browser_console_messages`: no errors, in particular no `Minified React error #418`, `#423` or `#425`.
- `browser_emulate_media` with `reducedMotion: 'reduce'`, reload: the hero phone shows the static frame (chips open, Goal on), nothing spins.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat(landing): hero with a live phone, problem diagram, sticky how-it-works

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: "Try the button" demo

**Files:**
- Create: `src/components/landing/ButtonDemo.tsx`, `src/components/landing/ButtonDemo.module.css`
- Modify: `src/pages/index.tsx`

**Interfaces:**
- Consumes: everything from `src/lib/markGesture.ts` (Task 3); `formatClock` (Task 5); `TagChip`, `Section`, `Icon`, `RevealGroup`/`RevealItem` (Task 2); `Scene` (Task 4); `QUICK_TAGS`, `tagColor` (Task 1).
- Produces: section anchor `#try`.

- [ ] **Step 1: Create the component**

`src/components/landing/ButtonDemo.tsx`:
```tsx
import clsx from 'clsx';
import {AnimatePresence, motion, useInView} from 'motion/react';
import {useEffect, useReducer, useRef, useState} from 'react';
import {QUICK_TAGS, tagColor} from '@site/src/data/tags';
import {formatClock} from '@site/src/lib/heroLoop';
import {
  TRACK_MS,
  clipSeconds,
  demoReducer,
  describeMark,
  formatClipLength,
  initialDemoState,
  isHolding,
  quickTagsMark,
  quickTagsRemaining,
  trackPosition,
} from '@site/src/lib/markGesture';
import Icon, {type IconName} from '../brand/Icon';
import Scene, {type SceneKind} from '../phone/Scene';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import TagChip from '../ui/TagChip';
import styles from './ButtonDemo.module.css';

const RULES: {icon: IconName; title: string; body: string}[] = [
  {icon: 'crosshair', title: 'Tap', body: 'Marks an instant. Its clip keeps 5 s before and 2 s after.'},
  {icon: 'interval', title: 'Hold', body: 'Marks an interval for as long as you hold — plus 3 s on each side.'},
  {icon: 'tag', title: 'Tag it', body: 'Goal, Save or Assist: tap one within 5 seconds.'},
];

const SCENES: SceneKind[] = ['pitch', 'rink', 'gym'];

function vibrate(ms: number) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(ms);
}

export default function ButtonDemo() {
  const [state, dispatch] = useReducer(demoReducer, initialDemoState);
  const [now, setNow] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const origin = useRef<number | null>(null);
  const announced = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef);

  const holding = isHolding(state);
  const pressed = state.pressedAt !== null;
  const quick = quickTagsMark(state);
  const closed = state.marks.filter((m) => m.end !== null);

  // Clock and gesture ticks, only while the demo is on screen.
  useEffect(() => {
    if (!inView) return undefined;
    const id = window.setInterval(() => {
      const at = Date.now();
      setNow(at);
      dispatch({type: 'tick', at});
    }, 100);
    return () => window.clearInterval(id);
  }, [inView]);

  // Announce and buzz once per finished mark (instant on release, interval on release).
  useEffect(() => {
    const last = state.marks[state.marks.length - 1];
    if (!last || last.end === null || last.id === announced.current) return;
    announced.current = last.id;
    setAnnouncement(describeMark(last));
    if (last.kind === 'instant') vibrate(50);
  }, [state.marks]);

  // The app buzzes 100 ms when a hold turns into an interval.
  useEffect(() => {
    if (holding) vibrate(100);
  }, [holding]);

  const press = () => {
    const at = Date.now();
    if (origin.current === null) origin.current = at;
    setNow(at);
    dispatch({type: 'press', at});
  };
  const release = () => dispatch({type: 'release', at: Date.now()});
  const cancel = () => dispatch({type: 'cancel', at: Date.now()});
  const toggle = (tag: string) => {
    if (!quick) return;
    setAnnouncement(quick.tags.includes(tag) ? `Removed ${tag}` : `Tagged ${tag}`);
    dispatch({type: 'toggleTag', tag, at: Date.now()});
  };
  const clear = () => {
    origin.current = null;
    announced.current = null;
    setAnnouncement('Cleared');
    dispatch({type: 'reset'});
  };

  const at = now ?? 0;
  const start = origin.current ?? at;
  const clock = formatClock(origin.current === null ? 0 : Math.floor((at - start) / 1000));

  return (
    <Section id="try" tone="orange" labelledBy="try-title">
      <div className={styles.layout}>
        <RevealGroup>
          <RevealItem>
            <span className="ac-eyebrow">Try it</span>
          </RevealItem>
          <RevealItem>
            <h2 id="try-title" className="ac-h2">
              Go on — tap it.
              <br />
              Or hold it.
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="ac-lead">
              This is the button that floats over your camera during a game. Try it right here — no phone needed.
            </p>
          </RevealItem>
          <div className={styles.rules}>
            {RULES.map((rule) => (
              <RevealItem key={rule.title} className={styles.rule}>
                <span className={styles.ruleIcon}>
                  <Icon name={rule.icon} size={22} />
                </span>
                <span>
                  <span className={styles.ruleTitle}>{rule.title}</span>
                  <span className={styles.ruleBody}>{rule.body}</span>
                </span>
              </RevealItem>
            ))}
          </div>
        </RevealGroup>

        <div>
          <div ref={stageRef} className={styles.stage}>
            <div className={styles.stageTop}>
              <span className={styles.rec}>
                <span className={styles.recDot} />
                {clock}
              </span>
              <span>{closed.length === 1 ? '1 moment' : `${closed.length} moments`}</span>
              <button type="button" className={styles.clear} onClick={clear} disabled={state.marks.length === 0}>
                Clear
              </button>
            </div>

            <div className={styles.arena}>
              <div className={styles.chips}>
                <AnimatePresence>
                  {quick && (
                    <motion.div
                      key={quick.id}
                      className={styles.chipStack}
                      initial={{opacity: 0, x: 12}}
                      animate={{opacity: 1, x: 0}}
                      exit={{opacity: 0, x: 12}}
                      transition={{type: 'spring', stiffness: 420, damping: 30}}>
                      <span className={styles.countdown}>
                        <span style={{transform: `scaleX(${quickTagsRemaining(state, at)})`}} />
                      </span>
                      {QUICK_TAGS.map((tag, i) => {
                        const on = quick.tags.includes(tag.name);
                        return (
                          <motion.button
                            key={tag.name}
                            type="button"
                            className={styles.chipBtn}
                            aria-pressed={on}
                            onClick={() => toggle(tag.name)}
                            initial={{scale: 0.4, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            transition={{type: 'spring', stiffness: 500, damping: 26, delay: i * 0.05}}>
                            <TagChip tone="overlay" name={tag.name} color={tag.color} ink={tag.ink} on={on} />
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                className={clsx(styles.big, pressed && styles.pressed, holding && styles.holding)}
                aria-label="Mark a moment"
                aria-describedby="demo-hint"
                onPointerDown={(e) => {
                  if (e.button !== 0) return;
                  e.preventDefault();
                  e.currentTarget.setPointerCapture(e.pointerId);
                  press();
                }}
                onPointerUp={release}
                onPointerCancel={cancel}
                onLostPointerCapture={cancel}
                onKeyDown={(e) => {
                  if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
                    e.preventDefault();
                    press();
                  }
                }}
                onKeyUp={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    release();
                  }
                }}
                onBlur={cancel}
                onContextMenu={(e) => e.preventDefault()}>
                <Icon name="crosshair" />
                <span className={styles.count}>{closed.length}</span>
              </button>

              <p id="demo-hint" className={styles.hint}>
                Tap for an instant.
                <br />
                Hold for an interval.
              </p>
            </div>

            <div className={styles.timeline} aria-hidden="true">
              <span className={styles.track} />
              {state.marks.map((mark) => {
                const left = trackPosition(mark.start, start) * 100;
                if (mark.kind === 'instant') {
                  return <span key={mark.id} className={styles.instant} style={{left: `${left}%`}} />;
                }
                const width = Math.min(100 - left, (((mark.end ?? at) - mark.start) / TRACK_MS) * 100);
                return <span key={mark.id} className={styles.interval} style={{left: `${left}%`, width: `${width}%`}} />;
              })}
              {origin.current !== null && <span className={styles.head} style={{left: `${trackPosition(at, start) * 100}%`}} />}
            </div>
            <div className={styles.trackLabels} aria-hidden="true">
              <span>0:00</span>
              <span>2:00</span>
            </div>
          </div>

          <div className={styles.clipsHead}>
            Your clips
            <span>cut with the app’s default lengths</span>
          </div>
          <ul className={styles.clips}>
            {closed.length === 0 && <li className={styles.empty}>Your clips appear here.</li>}
            <AnimatePresence initial={false}>
              {closed
                .slice(-5)
                .reverse()
                .map((mark) => (
                  <motion.li
                    key={mark.id}
                    layout
                    className={styles.clip}
                    initial={{scale: 0.6, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    exit={{scale: 0.6, opacity: 0}}
                    transition={{type: 'spring', stiffness: 420, damping: 28}}>
                    <Scene kind={SCENES[mark.id % SCENES.length]} shift={((mark.id * 7) % 21) - 10} />
                    {mark.tags.length > 0 && (
                      <span className={styles.clipDots}>
                        {mark.tags.map((t) => (
                          <span key={t} style={{background: tagColor(t)}} />
                        ))}
                      </span>
                    )}
                    <span className={styles.clipLen}>{formatClipLength(clipSeconds(mark))}</span>
                    {mark.kind === 'interval' && (
                      <span className={styles.clipKind}>
                        <Icon name="interval" strokeWidth={2.6} />
                      </span>
                    )}
                  </motion.li>
                ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
      <p className="ac-sr-only" aria-live="polite">
        {announcement}
      </p>
    </Section>
  );
}
```

`src/components/landing/ButtonDemo.module.css`:
```css
.layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  align-items: center;
  gap: clamp(32px, 5vw, 72px);
}

.rules {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 28px;
}

.rule {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.28);
}

.ruleIcon {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 13px;
  background: var(--ac-on-orange);
  color: var(--ac-orange);
}

.ruleTitle {
  display: block;
  font-size: 17px;
  font-weight: 750;
}

.ruleBody {
  display: block;
  font-size: 15.5px;
  line-height: 1.45;
}

.stage {
  --chip-font: 14px;
  position: relative;
  padding: 20px;
  border-radius: 32px;
  background: #120c09;
  color: #ffffff;
  box-shadow: 0 30px 60px -24px rgba(94, 39, 0, 0.6);
}

.stageTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
  font-weight: 650;
  color: rgba(255, 255, 255, 0.78);
}

.rec {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-variant-numeric: tabular-nums;
}

.recDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff3b30;
}

.clear {
  height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font: inherit;
  font-size: 14px;
  font-weight: 650;
  cursor: pointer;
}

.clear:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.18);
}

.clear:disabled {
  opacity: 0.4;
  cursor: default;
}

.arena {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  height: 250px;
}

.chips {
  justify-self: end;
  width: 150px;
}

.chipStack {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.countdown {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.25);
  overflow: hidden;
}

.countdown span {
  display: block;
  width: 100%;
  height: 100%;
  background: #ffffff;
  transform-origin: right center;
}

.chipBtn {
  padding: 0;
  border: 0;
  border-radius: 9999px;
  background: none;
  font: inherit;
  cursor: pointer;
}

.chipBtn:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 2px;
}

.big {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112px;
  height: 112px;
  border: 0;
  border-radius: 34px;
  background: var(--ac-orange);
  color: #ffffff;
  cursor: pointer;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
  transition:
    border-radius 0.35s var(--ac-ease-spring),
    transform 0.35s var(--ac-ease-spring),
    background-color 0.15s;
  animation: idle 2.4s ease-in-out infinite;
}

.big svg {
  width: 58px;
  height: 58px;
  pointer-events: none;
}

.big:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 4px;
}

.pressed {
  transform: scale(0.93);
  border-radius: 56px;
  background: #e5484d;
  animation: none;
}

.holding {
  animation: hold 0.9s ease-out infinite;
}

.count {
  position: absolute;
  right: -6px;
  top: -6px;
  min-width: 30px;
  height: 30px;
  padding: 0 8px;
  border-radius: 15px;
  background: var(--ac-brown);
  color: var(--ac-on-brown);
  font-size: 15px;
  font-weight: 750;
  line-height: 30px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.hint {
  justify-self: start;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.72);
}

.timeline {
  position: relative;
  height: 44px;
  margin-top: 8px;
}

.track {
  position: absolute;
  left: 0;
  right: 0;
  top: 19px;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.14);
}

.instant {
  position: absolute;
  top: 7px;
  width: 5px;
  height: 30px;
  margin-left: -2.5px;
  border-radius: 3px;
  background: var(--ac-orange);
  animation: drop 0.5s var(--ac-ease-spring) both;
}

.interval {
  position: absolute;
  top: 15px;
  min-width: 6px;
  height: 14px;
  border-radius: 7px;
  background: #8aceff;
}

.head {
  position: absolute;
  top: 0;
  width: 2px;
  height: 44px;
  margin-left: -1px;
  border-radius: 1px;
  background: #ffffff;
}

.trackLabels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-variant-numeric: tabular-nums;
}

.clipsHead {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px 12px;
  margin: 28px 0 12px;
  font-size: 17px;
  font-weight: 750;
}

.clipsHead span {
  font-size: 15px;
  font-weight: 600;
}

.clips {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  min-height: 120px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.clip {
  position: relative;
  aspect-ratio: 3 / 4;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 18px -10px rgba(0, 0, 0, 0.5);
}

.clipDots {
  position: absolute;
  left: 6px;
  top: 6px;
  display: flex;
  gap: 3px;
}

.clipDots span {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #ffffff;
}

.clipLen {
  position: absolute;
  left: 6px;
  bottom: 6px;
  height: 22px;
  padding: 0 7px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  font-size: 12px;
  font-weight: 650;
  line-height: 22px;
  font-variant-numeric: tabular-nums;
}

.clipKind {
  position: absolute;
  right: 6px;
  bottom: 6px;
  display: flex;
  align-items: center;
  height: 22px;
  padding: 0 5px;
  border-radius: 8px;
  background: var(--ac-tertiary);
  color: #ffffff;
}

.clipKind svg {
  width: 13px;
  height: 13px;
}

.empty {
  grid-column: 1 / -1;
  align-self: center;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
}

@keyframes idle {
  0%,
  100% {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45), 0 0 0 0 rgba(255, 122, 26, 0.5);
  }
  50% {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45), 0 0 0 16px rgba(255, 122, 26, 0);
  }
}

@keyframes hold {
  0% {
    box-shadow: 0 0 0 0 rgba(229, 72, 77, 0.7);
  }
  100% {
    box-shadow: 0 0 0 26px rgba(229, 72, 77, 0);
  }
}

@keyframes drop {
  from {
    transform: translateY(-14px) scaleY(0.3);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}

@media (max-width: 996px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .stage {
    padding: 16px;
    border-radius: 26px;
  }

  .arena {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 0.35fr);
    gap: 10px;
    height: 230px;
  }

  .chips {
    --chip-font: 13px;
    width: 124px;
  }

  .big {
    width: 96px;
    height: 96px;
    border-radius: 30px;
  }

  .big svg {
    width: 50px;
    height: 50px;
  }

  .hint {
    display: none;
  }

  .clips {
    gap: 6px;
  }

  .clip {
    border-radius: 10px;
  }
}
```

- [ ] **Step 2: Add it to the page**

In `src/pages/index.tsx` add `import ButtonDemo from '@site/src/components/landing/ButtonDemo';` and render `<ButtonDemo />` after `<HowItWorks />`.

- [ ] **Step 3: Typecheck, test, build**

Run: `npm run typecheck && npm test && npm run build`
Expected: all green.

- [ ] **Step 4: Browser check — gestures and cancel (Review Focus 3, 4)**

Browser check procedure on `/#try` at 1440×900:
- `browser_click` the "Mark a moment" button → an orange pin on the timeline, chips Goal/Save/Assist with a shrinking bar, one clip tile `0:07`, count `1`. Click "Goal" → the chip fills and the tile gets an orange dot. Wait 6 s → chips gone.
- Hold: `browser_evaluate`
  ```js
  async () => {
    const b = document.querySelector('[aria-label="Mark a moment"]');
    const opts = {bubbles: true, pointerId: 7, button: 0, isPrimary: true};
    b.dispatchEvent(new PointerEvent('pointerdown', opts));
    await new Promise((r) => setTimeout(r, 1300));
    const holding = b.className.includes('holding');
    b.dispatchEvent(new PointerEvent('pointercancel', opts));
    await new Promise((r) => setTimeout(r, 300));
    return {holding, stillHolding: b.className.includes('holding'), intervals: document.querySelectorAll('[class*="interval_"]').length};
  }
  ```
  Expected: `holding: true`, `stillHolding: false`, `intervals` ≥ 1 (the cancelled hold was closed, not left open).
- Keyboard: focus the button, `browser_press_key` `Space` → one more instant.
- 360×740: no horizontal scroll; button, chips and timeline fit.
- Console: no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(landing): interactive floating-button demo with quick tags and clips

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Use cases, Features, What you get

**Files:**
- Create: `src/data/useCases.ts`, `src/data/features.ts`, `src/data/benefits.ts`
- Create: `src/components/landing/UseCases.tsx`, `UseCases.module.css`, `Features.tsx`, `Features.module.css`, `Benefits.tsx`, `Benefits.module.css`
- Modify: `src/pages/index.tsx`

**Interfaces:**
- Consumes: `Screen`, `HomeMock`, `EventMock`, `MomentMock`, `Scene` (Task 4); UI kit (Task 2); `TAGS`, `QUICK_TAGS` (Task 1).
- Produces: `useCases: UseCase[]`, `UseCase = {id: string; label: string; title: string; intro: string; steps: string[]; screen: {name: string; src?: string; mock: UseCaseMock}}`, `UseCaseMock = 'event' | 'home' | 'moment' | 'versions' | 'favorites'`.
- Produces: `features: Feature[]`, `Feature = {id: string; icon: IconName; title: string; body: string; wide?: boolean; tone?: 'orange' | 'blue' | 'peach'; visual?: 'chips' | 'window' | 'swatches' | 'versions'}`.
- Produces: `benefits: Benefit[]`, `Benefit = {title: string; body: string}`.
- Produces: anchors `#use-cases`, `#features`.

- [ ] **Step 1: Create the copy**

`src/data/useCases.ts`:
```ts
export type UseCaseMock = 'event' | 'home' | 'moment' | 'versions' | 'favorites';

export type UseCase = {
  id: string;
  label: string;
  title: string;
  intro: string;
  steps: string[];
  /** Set `src` when the real screenshot exists in static/img/screens/. */
  screen: {name: string; src?: string; mock: UseCaseMock};
};

export const useCases: UseCase[] = [
  {
    id: 'match',
    label: 'Match day',
    title: 'Your kid’s match, minus the scrubbing',
    intro: 'The everyday game: one phone, your usual camera app, ninety minutes.',
    steps: [
      'Start an event before kick-off — the crosshair button appears over your camera.',
      'Film from the stands the way you always do.',
      'Tap at the goal, the save, the celebration — and tag it Goal right there.',
      'After the game, open the event: ActionCut cuts every moment into a clip, ready for the family chat.',
    ],
    screen: {name: 'Event screen', mock: 'event'},
  },
  {
    id: 'practice',
    label: 'Practice',
    title: 'Practice that actually gets reviewed',
    intro: 'For coaches and players who want to see the drill, not the whole session.',
    steps: [
      'Hold the button through a whole drill to capture it as one interval.',
      'Interval clips keep 3 seconds before and after, so nothing gets cut off.',
      'Tag reps with Skill to collect the technique to work on.',
      'Page through the moments one by one with the arrows on the moment screen.',
    ],
    screen: {name: 'Moment screen', mock: 'moment'},
  },
  {
    id: 'tournament',
    label: 'Tournament day',
    title: 'Four games, one phone',
    intro: 'Back-to-back games, lunch in between, and no time to sort anything out.',
    steps: [
      'Start a new event for each game and give it a name, like “Game 2 vs Hawks”.',
      'Back from a break? Resume picks up the same event.',
      'Live in the wrong event? Open the right one and tap Switch here.',
      'Marked a moment in the wrong game? Move it to the right event later.',
    ],
    screen: {name: 'Home screen', mock: 'home'},
  },
  {
    id: 'angles',
    label: 'Two phones',
    title: 'Second phone? Second angle.',
    intro: 'Your partner films from the other side of the field.',
    steps: [
      'Mark the moments on your phone as usual.',
      'Copy your partner’s videos to your phone.',
      'Open the event’s Sources and tap Scan this phone — ActionCut finds them by recording time.',
      'Every moment both videos cover gets two versions. Swipe between them.',
    ],
    screen: {name: 'Moment with two versions', mock: 'versions'},
  },
  {
    id: 'season',
    label: 'Season highlights',
    title: 'The season’s best, in a minute',
    intro: 'End-of-season party? You already have the material.',
    steps: [
      'Tap the heart on the moments you love.',
      'Favorites gathers them by month and event.',
      'Filter by Goal, tap Select all, then Save.',
      'Every clip lands in your gallery’s ActionCut album, ready for the season video.',
    ],
    screen: {name: 'Favorites', mock: 'favorites'},
  },
];
```

`src/data/features.ts`:
```ts
import type {IconName} from '@site/src/components/brand/Icon';

export type Feature = {
  id: string;
  icon: IconName;
  title: string;
  body: string;
  /** Takes two columns of the bento grid. */
  wide?: boolean;
  tone?: 'orange' | 'blue' | 'peach';
  visual?: 'chips' | 'window' | 'swatches' | 'versions';
};

export const features: Feature[] = [
  {id: 'quick-tags', icon: 'tag', title: 'Quick tags', body: 'Goal, Save, Assist: tag a moment in the five seconds after you mark it, right beside the button.', wide: true, tone: 'orange', visual: 'chips'},
  {id: 'clip-length', icon: 'timer', title: 'Clip length, your way', body: 'Choose how much to keep before and after each moment — separately for taps and holds, from 0 to 30 seconds.', wide: true, visual: 'window'},
  {id: 'custom-clip', icon: 'scissors', title: 'Custom clip', body: 'Need more of the build-up? Set a moment’s own start and end right on the video.'},
  {id: 'favorites', icon: 'heart', title: 'Favorites', body: 'Heart a moment and it joins your favorites, grouped by month and event.'},
  {id: 'angles', icon: 'layers', title: 'Several angles', body: 'When two videos cover the same moment, you get a version from each and swipe between them.', wide: true, tone: 'blue', visual: 'versions'},
  {id: 'smart-import', icon: 'scan', title: 'Smart import', body: 'Scan this phone finds an event’s videos by when they were recorded — including ones copied from a second phone.'},
  {id: 'album', icon: 'download', title: 'The ActionCut album', body: 'Save one clip or all of them. They land in your gallery, in their own album.'},
  {id: 'share', icon: 'share', title: 'Share anywhere', body: 'Send a clip to any app on your phone, straight from the moment screen.'},
  {id: 'practice', icon: 'crosshair', title: 'Practice mode', body: 'Before the game, place the button exactly where you want it over the camera.'},
  {id: 'button-style', icon: 'palette', title: 'Make the button yours', body: 'Pick its size, opacity and color — orange, blue, gray or any color you like.', wide: true, tone: 'peach', visual: 'swatches'},
  {id: 'export', icon: 'fileUp', title: 'Export & import', body: 'Move events to another phone as a small file. Your videos stay where they are.'},
  {id: 'theme', icon: 'sunMoon', title: 'Light & dark', body: 'ActionCut follows your phone’s theme, or you pick one.'},
];
```

`src/data/benefits.ts`:
```ts
export type Benefit = {title: string; body: string};

export const benefits: Benefit[] = [
  {title: 'Watch the game, not your screen.', body: 'One tap and your eyes are back on the field.'},
  {title: 'Clips ready right after the game.', body: 'Stop the event and ActionCut cuts every moment on your phone. No editing app, no timeline.'},
  {title: 'Your camera, your quality.', body: 'Keep the zoom, stabilization and resolution of the camera app you trust.'},
  {title: 'Nothing to upload.', body: 'Videos, clips and moments stay on your phone. No account, no sign-up.'},
  {title: 'A season you can find.', body: 'Every game is an event, and every moment has a time, a tag and maybe a heart.'},
];
```

- [ ] **Step 2: Create Use cases (accessible tabs)**

`src/components/landing/UseCases.tsx`:
```tsx
import clsx from 'clsx';
import {LayoutGroup, motion} from 'motion/react';
import {useRef, useState, type KeyboardEvent} from 'react';
import {useCases, type UseCaseMock} from '@site/src/data/useCases';
import Shape from '../brand/Shapes';
import EventMock from '../phone/EventMock';
import HomeMock from '../phone/HomeMock';
import MomentMock from '../phone/MomentMock';
import Screen from '../phone/Screen';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import styles from './UseCases.module.css';

function Mock({kind}: {kind: UseCaseMock}) {
  switch (kind) {
    case 'event':
      return <EventMock />;
    case 'home':
      return <HomeMock live liveTime="31:08" liveCount={4} />;
    case 'moment':
      return <MomentMock />;
    case 'versions':
      return <MomentMock versions />;
    case 'favorites':
      return <HomeMock tab="favorites" />;
  }
}

export default function UseCases() {
  const [selected, setSelected] = useState(0);
  const interacted = useRef(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number, focus: boolean) => {
    interacted.current = true;
    setSelected(i);
    if (focus) tabs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = useCases.length - 1;
    let next: number;
    if (e.key === 'ArrowRight') next = selected === last ? 0 : selected + 1;
    else if (e.key === 'ArrowLeft') next = selected === 0 ? last : selected - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;
    e.preventDefault();
    select(next, true);
  };

  return (
    <Section id="use-cases" tone="white" labelledBy="uc-title">
      <RevealGroup className={styles.head}>
        <RevealItem>
          <span className="ac-eyebrow">Use cases</span>
        </RevealItem>
        <RevealItem>
          <h2 id="uc-title" className="ac-h2">
            Made for every kind of game day
          </h2>
        </RevealItem>
      </RevealGroup>

      <LayoutGroup>
        <div role="tablist" aria-label="Use cases" className={styles.tablist} onKeyDown={onKeyDown}>
          {useCases.map((uc, i) => (
            <button
              key={uc.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`uc-tab-${uc.id}`}
              aria-selected={i === selected}
              aria-controls={`uc-panel-${uc.id}`}
              tabIndex={i === selected ? 0 : -1}
              className={clsx(styles.tab, i === selected && styles.tabOn)}
              onClick={() => select(i, false)}>
              {i === selected && (
                <motion.span layoutId="uc-indicator" className={styles.indicator} transition={{type: 'spring', stiffness: 420, damping: 34}} />
              )}
              <span className={styles.tabLabel}>{uc.label}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      {useCases.map((uc, i) => (
        <div
          key={uc.id}
          role="tabpanel"
          id={`uc-panel-${uc.id}`}
          aria-labelledby={`uc-tab-${uc.id}`}
          hidden={i !== selected}
          tabIndex={0}
          className={styles.panel}>
          <motion.div
            key={i === selected ? 'on' : 'off'}
            className={styles.panelInner}
            initial={interacted.current ? {opacity: 0, y: 16} : false}
            animate={{opacity: 1, y: 0}}
            transition={{type: 'spring', stiffness: 320, damping: 30}}>
            <div className={styles.story}>
              <h3 className={styles.title}>{uc.title}</h3>
              <p className={styles.intro}>{uc.intro}</p>
              <ol className={styles.steps}>
                {uc.steps.map((s, n) => (
                  <li key={s}>
                    <span className={styles.n}>{n + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className={styles.visual}>
              <Shape kind="cookie9" color="var(--ac-cream)" className={styles.shape} />
              <div className={styles.phone}>
                <Screen name={uc.screen.name} src={uc.screen.src} fallback={<Mock kind={uc.screen.mock} />} />
              </div>
            </div>
          </motion.div>
        </div>
      ))}
    </Section>
  );
}
```

`src/components/landing/UseCases.module.css`:
```css
.head {
  max-width: 760px;
  margin-bottom: 28px;
}

.tablist {
  display: flex;
  gap: 8px;
  margin: 0 -4px 36px;
  padding: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}

.tablist::-webkit-scrollbar {
  display: none;
}

.tab {
  position: relative;
  flex: none;
  height: 48px;
  padding: 0 20px;
  border: 0;
  border-radius: 24px;
  background: var(--ac-cream);
  color: var(--ac-ink-2);
  font: inherit;
  font-size: 16px;
  font-weight: 650;
  cursor: pointer;
  transition: background-color 0.2s;
}

.tab:hover {
  background: var(--ac-container-high);
}

.tabOn {
  color: var(--ac-cream);
}

.indicator {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  background: var(--ac-ink);
}

.tabLabel {
  position: relative;
}

.panel:focus-visible {
  outline-offset: 8px;
  border-radius: 20px;
}

.panelInner {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  align-items: center;
  gap: clamp(32px, 5vw, 72px);
}

.title {
  margin: 0 0 10px;
  font-size: clamp(28px, 3vw, 40px);
  line-height: 1.08;
  font-weight: 720;
}

.intro {
  margin: 0 0 24px;
  font-size: 18px;
  color: var(--ac-ink-2);
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.steps li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 16px;
  background: var(--ac-cream);
  border-radius: 6px;
  font-size: 17px;
  line-height: 1.45;
}

.steps li:first-child {
  border-radius: 20px 20px 6px 6px;
}

.steps li:last-child {
  border-radius: 6px 6px 20px 20px;
}

.n {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: var(--ac-secondary-container);
  color: var(--ac-on-secondary-container);
  font-size: 14px;
  font-weight: 800;
}

.visual {
  position: relative;
  display: flex;
  justify-content: center;
}

.shape {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(440px, 110%);
  transform: translate(-50%, -50%);
}

.phone {
  position: relative;
  width: min(290px, 72vw);
}

@media (max-width: 996px) {
  .panelInner {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Create Features (bento)**

`src/components/landing/Features.tsx`:
```tsx
import clsx from 'clsx';
import {features, type Feature} from '@site/src/data/features';
import {QUICK_TAGS} from '@site/src/data/tags';
import Icon from '../brand/Icon';
import Scene from '../phone/Scene';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import TagChip from '../ui/TagChip';
import styles from './Features.module.css';

const SWATCHES = ['#FF7A1A', '#00BFFF', '#A1A1A1'];

function Visual({kind}: {kind: NonNullable<Feature['visual']>}) {
  switch (kind) {
    case 'chips':
      return (
        <div className={styles.visual}>
          {QUICK_TAGS.map((t, i) => (
            <TagChip key={t.name} name={t.name} color={t.color} ink={t.ink} on={i === 0} />
          ))}
        </div>
      );
    case 'window':
      return (
        <div className={styles.visual}>
          <div className={styles.window} aria-label="5 seconds before the tap, 2 seconds after" role="img">
            <span className={styles.before}>5 s before</span>
            <span className={styles.tap}>
              <Icon name="crosshair" size={18} />
            </span>
            <span className={styles.after}>2 s after</span>
          </div>
        </div>
      );
    case 'swatches':
      return (
        <div className={styles.visual} aria-hidden="true">
          {SWATCHES.map((c, i) => (
            <span key={c} className={clsx(styles.swatch, i === 0 && styles.swatchOn)} style={{background: c}} />
          ))}
          <span className={clsx(styles.swatch, styles.swatchCustom)}>
            <Icon name="plus" size={18} />
          </span>
        </div>
      );
    case 'versions':
      return (
        <div className={clsx(styles.visual, styles.versions)} aria-hidden="true">
          <span>
            <Scene kind="pitch" shift={-8} />
          </span>
          <span>
            <Scene kind="pitch" shift={12} />
          </span>
        </div>
      );
  }
}

export default function Features() {
  return (
    <Section id="features" tone="cream" labelledBy="features-title">
      <RevealGroup className={styles.head}>
        <RevealItem>
          <span className="ac-eyebrow">Features</span>
        </RevealItem>
        <RevealItem>
          <h2 id="features-title" className="ac-h2">
            Everything the sideline needs
          </h2>
        </RevealItem>
      </RevealGroup>
      <RevealGroup className={styles.grid}>
        {features.map((f) => (
          // RevealItem owns the entrance transform; the inner card owns the hover lift.
          <RevealItem key={f.id} className={clsx(f.wide && styles.wide)}>
            <div className={clsx(styles.card, f.tone && styles[f.tone])}>
              <span className={styles.icon}>
                <Icon name={f.icon} size={26} />
              </span>
              <h3 className={styles.title}>{f.title}</h3>
              <p className={styles.body}>{f.body}</p>
              {f.visual && <Visual kind={f.visual} />}
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
```

`src/components/landing/Features.module.css`:
```css
.head {
  max-width: 760px;
  margin-bottom: clamp(32px, 5vw, 56px);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-flow: dense;
  gap: 14px;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  min-height: 220px;
  padding: 24px;
  border-radius: var(--ac-radius-l);
  background: var(--ac-item);
  color: var(--ac-ink);
  transition:
    transform 0.45s var(--ac-ease-spring),
    box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 36px -20px rgba(94, 39, 0, 0.35);
}

.wide {
  grid-column: span 2;
}

.orange {
  border-radius: 40px 40px 12px 40px;
  background: var(--ac-orange);
  color: var(--ac-on-orange);
}

.blue {
  border-radius: 12px 40px 40px 40px;
  background: var(--ac-blue);
  color: var(--ac-on-blue);
}

.peach {
  border-radius: 40px 12px 40px 40px;
  background: var(--ac-secondary-container);
  color: var(--ac-on-secondary-container);
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 17px;
  background: var(--ac-container-high);
  color: var(--ac-primary);
  transition:
    transform 0.5s var(--ac-ease-spring),
    border-radius 0.5s var(--ac-ease-spring);
}

.orange .icon,
.blue .icon,
.peach .icon {
  background: rgba(255, 255, 255, 0.4);
  color: inherit;
}

.card:hover .icon {
  transform: rotate(-8deg) scale(1.08);
  border-radius: 26px;
}

.title {
  margin: 8px 0 0;
  font-size: 22px;
  line-height: 1.15;
  font-weight: 720;
  color: inherit;
}

.body {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  color: var(--ac-ink-2);
}

.orange .body,
.blue .body,
.peach .body {
  color: inherit;
}

.visual {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
}

.window {
  display: flex;
  width: 100%;
  max-width: 420px;
  height: 40px;
  border-radius: 12px;
  overflow: hidden;
  font-size: 13px;
  font-weight: 700;
}

.before,
.after {
  display: flex;
  align-items: center;
  justify-content: center;
}

.before {
  flex: 5;
  background: var(--ac-container-high);
}

.tap {
  flex: 0 0 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ac-orange);
  color: var(--ac-on-orange);
}

.after {
  flex: 2;
  background: var(--ac-cream);
}

.swatch {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.08);
}

.swatchOn {
  box-shadow:
    0 0 0 3px var(--ac-secondary-container),
    0 0 0 6px var(--ac-on-secondary-container);
}

.swatchCustom {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  box-shadow: inset 0 0 0 2px currentColor;
}

.versions span {
  position: relative;
  width: 64px;
  height: 84px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.6);
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .wide {
    grid-column: auto;
  }

  .card {
    min-height: 0;
  }
}
```

- [ ] **Step 4: Create What you get (scroll-driven type)**

`src/components/landing/Benefits.tsx`:
```tsx
import {motion, useScroll, useTransform} from 'motion/react';
import {useRef} from 'react';
import {benefits, type Benefit} from '@site/src/data/benefits';
import Section from '../ui/Section';
import styles from './Benefits.module.css';

function BenefitLine({benefit, index}: {benefit: Benefit; index: number}) {
  const ref = useRef<HTMLLIElement>(null);
  const {scrollYProgress} = useScroll({target: ref, offset: ['start 0.95', 'center 0.55']});
  // Light & narrow → bold & wide as the line reaches the middle of the screen.
  const variation = useTransform(
    scrollYProgress,
    (v) => `'ROND' 100, 'wght' ${Math.round(250 + 510 * v)}, 'wdth' ${Math.round(72 + 28 * v)}`,
  );
  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);

  return (
    <li ref={ref} className={styles.item}>
      <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
      <motion.h3 className={styles.title} style={{fontVariationSettings: variation, opacity}} data-reveal="">
        {benefit.title}
      </motion.h3>
      <p className={styles.body}>{benefit.body}</p>
    </li>
  );
}

export default function Benefits() {
  return (
    <Section tone="blue" labelledBy="benefits-title">
      <h2 id="benefits-title" className="ac-h2">
        What you get
      </h2>
      <ol className={styles.list}>
        {benefits.map((b, i) => (
          <BenefitLine key={b.title} benefit={b} index={i} />
        ))}
      </ol>
    </Section>
  );
}
```

`src/components/landing/Benefits.module.css`:
```css
.list {
  margin: clamp(16px, 3vw, 32px) 0 0;
  padding: 0;
  list-style: none;
}

.item {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 0 20px;
  padding: clamp(28px, 4vw, 48px) 0;
  border-top: 1.5px solid color-mix(in srgb, var(--ac-on-blue) 22%, transparent);
}

.index {
  padding-top: 0.6em;
  font-size: 15px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.title {
  margin: 0 0 12px;
  font-size: clamp(38px, 6.4vw, 92px);
  line-height: 0.98;
  letter-spacing: -0.03em;
  color: inherit;
  font-variation-settings: 'ROND' 100, 'wght' 760, 'wdth' 100;
}

.body {
  grid-column: 2;
  max-width: 36rem;
  margin: 0;
  font-size: clamp(17px, 1.5vw, 20px);
  line-height: 1.5;
}

@media (prefers-reduced-motion: reduce) {
  .title {
    opacity: 1 !important;
    font-variation-settings: 'ROND' 100, 'wght' 760, 'wdth' 100 !important;
  }
}

@media (max-width: 600px) {
  .item {
    grid-template-columns: 1fr;
  }

  .index {
    padding: 0 0 6px;
  }

  .body {
    grid-column: 1;
  }
}
```

- [ ] **Step 5: Add the three sections to the page**

In `src/pages/index.tsx` import `UseCases`, `Features`, `Benefits` from `@site/src/components/landing/…` and render, in this order, after `<ButtonDemo />`: `<UseCases />`, `<Features />`, `<Benefits />`.

- [ ] **Step 6: Typecheck, test, build**

Run: `npm run typecheck && npm test && npm run build`
Expected: all green.

- [ ] **Step 7: Browser check**

Browser check procedure on `/`:
- 1440×900: screenshots of `#use-cases`, `#features` and the blue section. Click each use-case tab: the dark indicator slides, the panel text and phone change. With focus on a tab, `ArrowRight` moves to the next tab. Features: 4-column bento with orange/blue/peach wide cards. Benefits: scroll — the big lines grow bolder and wider.
- 360×740: tabs scroll inside their row, the page doesn't (`scrollWidth − clientWidth === 0`); bento is one column.
- Console: no errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(landing): use-case tabs, feature bento, scroll-driven benefits

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Guide

Ten more articles (spec §5), the `<Screen>` component available in MDX without imports, and Guide styling. Screenshots are `<Screen name=… caption=…/>` placeholders until the real files arrive (Task 11 lists the file names).

**Files:**
- Create: `src/theme/MDXComponents.tsx`
- Create: `guide/first-event.mdx`, `guide/floating-button.mdx`, `guide/reviewing-moments.mdx`, `guide/clip-length.mdx`, `guide/tags-and-favorites.mdx`, `guide/other-cameras.mdx`, `guide/saving-and-sharing.mdx`, `guide/moving-and-backup.mdx`, `guide/troubleshooting.mdx`, `guide/iphone.mdx`
- Modify: `sidebars.ts`, `src/css/custom.css`

**Interfaces:**
- Consumes: `Screen` (Task 4).
- Produces: doc routes `/guide/first-event`, `/guide/floating-button`, `/guide/reviewing-moments`, `/guide/clip-length`, `/guide/tags-and-favorites`, `/guide/other-cameras`, `/guide/saving-and-sharing`, `/guide/moving-and-backup`, `/guide/troubleshooting`, `/guide/iphone` (used by Tasks 9 and 10).
- Produces: global CSS class `.ac-screens` (row of screens inside an article).

- [ ] **Step 1: Make `<Screen>` global in MDX**

`src/theme/MDXComponents.tsx`:
```tsx
import MDXComponents from '@theme-original/MDXComponents';
import Screen from '@site/src/components/phone/Screen';

export default {
  ...MDXComponents,
  Screen,
};
```

- [ ] **Step 2: Full sidebar in `sidebars.ts`**

```ts
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  guideSidebar: [
    {type: 'category', label: 'Basics', collapsible: false, items: ['getting-started', 'first-event', 'floating-button']},
    {type: 'category', label: 'Moments and clips', collapsible: false, items: ['reviewing-moments', 'clip-length', 'tags-and-favorites']},
    {type: 'category', label: 'Going further', collapsible: false, items: ['other-cameras', 'saving-and-sharing', 'moving-and-backup']},
    {type: 'category', label: 'Help', collapsible: false, items: ['troubleshooting', 'iphone']},
  ],
};

export default sidebars;
```

- [ ] **Step 3: `guide/first-event.mdx`**

```mdx
---
title: Your first event
description: Start an event, film the game, mark moments and stop when it’s over.
---

An **event** is one game or practice. Everything you mark during it — and every clip cut from it — lives in that event.

## Before kick-off

1. Open ActionCut and tap **New event**.
2. The first time, allow the permissions ActionCut asks for (see [Getting started](./getting-started.mdx)).
3. An orange button with a crosshair appears on your screen. It stays on top of every app until you stop the event.

<div className="ac-screens">
  <Screen name="Home — New event" caption="Home, with the New event button" />
  <Screen name="Floating button over the camera" caption="The floating button over your camera app" />
</div>

:::tip Open the camera automatically
In **Settings → Event start**, switch on **Open camera when an event starts**. ActionCut then opens your camera in video mode as soon as an event starts. You still press record yourself.
:::

## During the game

- Open your usual camera app and **record video** the way you always do. ActionCut doesn’t record — it only remembers when you tap.
- **Tap** the floating button when something great happens. The phone buzzes, the button pulses and its counter goes up.
- **Hold** the button for a longer play — a run down the wing, a power play — and let go when it ends. That’s an *interval*.
- After each mark, **quick tags** appear beside the button for five seconds. Tap **Goal**, **Save** or **Assist** to tag the moment, or just ignore them.

You can stop and start recording as often as you like. ActionCut matches each moment to whichever recording was running at that time. A moment marked while nothing was recording has no video to cut from.

## While the event is running

Back in ActionCut, a dark bar at the bottom shows **Event in progress**, the time since the start and how many moments you’ve marked. From there you can open the camera or tap **Stop**.

<Screen name="Live bar" caption="The live bar while an event is in progress" />

## After the final whistle

1. Tap **Stop** in the live bar.
2. Open the event. ActionCut finds your recordings and cuts a clip around each moment, showing its progress — for example *Preparing clips · 3 of 10*.
3. Tap any tile to watch its clip.

## Pick up where you left off

- **Resume** — stopped too early? For 24 hours after an event’s last activity, Home offers **Resume** for it. An ended event’s own screen has **Resume** too.
- **Switch here** — if another event is running, an event’s screen offers **Switch here** to make that event the live one.

Next: everything the [floating button](./floating-button.mdx) can do.
```

- [ ] **Step 4: `guide/floating-button.mdx`**

```mdx
---
title: The floating button
description: Tap, hold, quick tags, and how to set the button up the way you like.
---

The floating button is how you mark moments. It sits on top of your camera app while an event is running.

## Tap or hold

| You do | You get | The clip keeps, by default |
|---|---|---|
| **Tap** | an *instant* moment | 5 s before the tap and 2 s after |
| **Hold** for half a second or longer | an *interval* that lasts until you let go | 3 s before the start and 3 s after the end |

A tap gives a short buzz, and the button pulses red for the seconds that follow in the clip. Holding gives a longer buzz, and the button keeps pulsing until you let go. The small counter shows how many moments you’ve marked.

You can change the clip lengths for each event — see [Clip length & custom clips](./clip-length.mdx).

## Quick tags

After each moment, up to five tags appear beside the button for **five seconds**, with a bar that counts down. Tap one to tag the moment; tap it again to untag it. Mark another moment and the list moves to the new one.

<Screen name="Quick tags beside the button" caption="Quick tags appear for five seconds after each moment" />

You choose which tags show up — see [Tags & favorites](./tags-and-favorites.mdx).

## Put the button where you want it

Go to **Settings → Floating button → Adjust button position**. ActionCut opens your camera with a practice button in the middle:

- **Drag** it to where your thumb rests and let go — the position is saved.
- **Tap** and **hold** work like the real thing, quick tags included, but nothing is saved.
- Tap **Done** when you’re happy. Practice mode also ends by itself after two minutes without a touch, and it isn’t available while an event is running.

The button stays in the same spot of the screen when you rotate the phone.

## Size, opacity and color

**Settings → Floating button** has a live preview and:

- **Size** — from 32 to 96 dp (60 by default).
- **Opacity** — from 20 to 100 % (45 % by default), so it doesn’t hide the action.
- **Color** — orange, blue, gray or any custom color.
- **Reset to defaults** — puts everything back.

<Screen name="Settings — Floating button" caption="Floating button settings with a live preview" />

## Show it only while filming

**Settings → Experimental → Only while the camera is in use** hides the button whenever no app is using the camera and shows it again when you start filming. It never disappears in the middle of a hold.
```

- [ ] **Step 5: `guide/reviewing-moments.mdx`**

```mdx
---
title: Reviewing moments
description: The event screen, the moment screen, versions and full screen.
---

## The event screen

Open an event from Home to see all its moments as a grid, newest first.

<Screen name="Event screen" caption="An event’s moments" />

Each tile shows:

- **Colored dots** (top left) — the moment’s tags.
- **Heart** (top right) — tap it to add the moment to favorites.
- **Time or title** (bottom left).
- **Interval length** or a **scissors** badge (bottom right) — an interval, or a moment with its own custom clip.
- A **number** on the right edge when the moment has several versions.

Tap the tag chips above the grid to show only moments with any of those tags. When the moments span several days, the grid is split by day.

## The moment screen

Tap a tile to open the moment. Its clip starts playing.

- **‹ ›** in the bottom toolbar go to the previous or next moment.
- The **heart** adds it to favorites; **share** sends the clip to another app.
- **Save** puts the clip in your gallery.
- Tap the time at the top — or **⋮ → Add title** — to give the moment a name, like *First goal*.
- Add or remove **tags** with the chips on the moment screen.
- **Full screen** gives a bigger picture with 5-second skip buttons. Landscape clips turn the screen sideways.
- The **⋮** menu also has **Edit clip**, **Clip info** (clip window, interval length, source file and where in it the clip starts) and **Delete moment**.

<Screen name="Moment screen" caption="A moment with its clip, tags and toolbar" />

## Versions

If two videos cover the same moment — say, one from your phone and one from a second phone — ActionCut cuts a **version** from each. Swipe the player to switch between them; the dots below it show *Version 1 of 2*.

## Select several moments

Long-press a tile to start selecting, then tap more tiles. You can then **Save** them, **Move to event** (another event or a new one) or **Delete** them.
```

- [ ] **Step 6: `guide/clip-length.mdx`**

```mdx
---
title: Clip length & custom clips
description: Choose how much of each moment to keep — for a whole event, or for one moment.
---

Every clip is cut from your recording around the moment you marked.

## Clip length for an event

Open the event and tap **⋮ → Clip length**. Instants and intervals have separate settings:

| Moment | Default | What you set |
|---|---|---|
| **Instant** (tap) | 5 s before + 2 s after = 7 s | seconds before and after the tap |
| **Interval** (hold) | 3 s before + 3 s after the hold | seconds before the start and after the end |

Each slider goes from 0 to 30 seconds, and the sheet shows the result — for example *Each clip: 5 s before the tap + 2 s after = 7 s*. When you save, ActionCut re-cuts the event’s clips with the new lengths.

A new event starts with the clip lengths of your previous one.

<Screen name="Clip length sheet" caption="Clip length for instants and intervals" />

## A custom clip for one moment

Sometimes one moment needs more of the build-up. Open the moment and tap **⋮ → Edit clip**:

1. Scrub the video to where the clip should start and tap **Mark start**.
2. Scrub to where it should end and tap **Mark end**.
3. Check **Start**, **End** and **Length**, then tap **Save**.

The event’s default window shows as a hatched band, so you can see what you’re changing. **Reset to event default** undoes it.

Moments with a custom clip get a **scissors** badge, and they keep their custom clip when you change the event’s clip length.

<Screen name="Edit clip" caption="Setting a moment’s own start and end" />
```

- [ ] **Step 7: `guide/tags-and-favorites.mdx`**

```mdx
---
title: Tags & favorites
description: Tag moments while you film, filter by tag, and keep the best ones in favorites.
---

## Tags

ActionCut starts with five tags: **Goal**, **Save**, **Assist**, **Skill** and **Funny**. Goal, Save and Assist are in *quick access*, so they pop up beside the floating button after each moment.

Manage them in **Settings → Tags → Manage tags**:

- **New tag** — a name of up to 24 characters and one of ten colors, or a custom color.
- **Quick access** — up to five tags that appear beside the button; the list shows, for example, *Quick access · 3 of 5*.
- **Only this event** — a tag for one event, like a player’s name for one tournament. An event’s own tags are under its **⋮ → Tags**.
- Before you delete a tag, ActionCut tells you how many moments use it.

<Screen name="Tags settings" caption="Your tags and quick access" />

### Tag a moment

- **While filming** — tap a quick tag in the five seconds after you mark the moment.
- **Later** — open the moment and use its tag chips.

### Filter by tag

On an event’s screen and in Favorites, tap tag chips above the grid to show only moments with any of the selected tags. With a filter on, **Save** saves just the moments you see.

## Favorites

Tap the **heart** on a tile or on the moment screen. Home → **Favorites** collects every favorite, grouped by month and then by event.

- Tap **Select** — or **Select all** next to an event — then **Save** to put them all in your gallery at once.
- Opening a favorite pages through your favorites, not the whole event.

<Screen name="Favorites" caption="Favorites, grouped by month and event" />
```

- [ ] **Step 8: `guide/other-cameras.mdx`**

```mdx
---
title: Videos from another camera
description: Use recordings from a second phone or a camera, or a video filmed without an event.
---

ActionCut finds the recordings made **on this phone** during an event by itself. For anything else — a second phone, a camera, a video filmed without starting an event — use the event’s **Sources**.

:::info How matching works
ActionCut matches moments to videos by time: it compares when you marked each moment with when each video was recorded. That works when a video’s date and time are right — videos from this phone, or files that kept their original date.
:::

## Open Sources

Open the event and tap **⋮ → Sources**. You see every video of the event with its time range and how many moments it covers. Tap **Import video** to add more.

<Screen name="Sources" caption="An event’s videos" />

## Scan this phone

First copy the other videos to your phone — from the other phone, a cloud drive or a camera’s memory card. Then choose **Import video → Scan this phone**.

ActionCut looks for videos recorded during the event and offers to import them. Videos whose start time could only be estimated are listed separately under *Start time estimated* — switch them on if they look right.

Every moment covered by more than one video gets a [version](./reviewing-moments.mdx#versions) from each.

## Choose a file

**Import video → Choose a file** lets you pick one video yourself. ActionCut asks **When was it filmed?** and fills in the start time it reads from the file — correct it if the camera’s clock was off.

## Mark moments afterwards

Filmed without starting an event? Start and stop a new event, import the video with **Choose a file**, then play it and tap **+ Instant** or **+ Interval** at the right spots. Tap **Save** to keep the new moments; they appear on the video’s timeline.

## Fix or remove a video

In a video’s **⋮** menu:

- **Adjust recording time** (imported videos) — moves the video on the event’s timeline if its clock was wrong. Its clips are re-cut to match.
- **Remove from event** — takes the video out of the event. Tick **Also delete the files from this phone** to delete it as well: ActionCut first cuts any clips that are still missing, then Android asks you to confirm.

If you delete a video and later put a copy back on the phone — for example from Google Photos — ActionCut recognizes it by name and length and links it again.
```

- [ ] **Step 9: `guide/saving-and-sharing.mdx`**

```mdx
---
title: Saving & sharing
description: Put clips in your gallery or send them to any app.
---

Clips live inside ActionCut until you save them. Saving puts a copy in your phone’s gallery, where any app can use it.

## Save clips

- **A whole event** — on the event’s screen tap the **save** icon at the top, then **Save all**, or **Save N** when a tag filter or a selection is on. Confirm in *Save 3 clips?*.
- **One moment** — tap **Save** on the moment screen. If the moment has several versions, choose **All versions** or **This version only**.
- **Favorites** — select them in the Favorites tab and tap **Save**.

When it’s done you’ll see **Clips saved**. Find them in your gallery, in the **ActionCut** album (the folder *Movies/ActionCut*). Each file is dated with its moment’s time, so clips sort in the order they happened.

Saving the same clip again replaces the copy in the gallery instead of making a duplicate.

## Share a clip

On the moment screen tap **share** and pick an app — a messenger, email or a social network. What happens to the clip after that is up to the app you send it to.

:::caution Think before you post
Clips of kids’ games often show other people’s children. Share them with the people they’re meant for.
:::
```

- [ ] **Step 10: `guide/moving-and-backup.mdx`**

```mdx
---
title: Moving & backing up events
description: Move moments between events, and copy events to another phone.
---

## Move moments to another event

Marked moments in the wrong game? On the event’s screen, long-press a tile to select it (and any others), then choose **Move to event** — pick another event or create a new one.

## Export and import events

You can save events to a small file and open it on another phone:

- **One event** — on the event’s screen, **⋮ → Export event data**.
- **All events** — **Settings → Event data → Export all events**.
- **Import** — **Settings → Event data → Import event data**, then pick the file.

The file holds the events and their moments, with titles, tags and clip settings. **It doesn’t contain videos** — put the videos on the new phone too, then use [Scan this phone](./other-cameras.mdx#scan-this-phone).

ActionCut for iPhone will read the same files, so events can move between Android and iPhone.
```

- [ ] **Step 11: `guide/troubleshooting.mdx`**

```mdx
---
title: Troubleshooting
description: Fixes for the most common problems.
---

## The floating button doesn’t appear

- Check that ActionCut may **display over other apps**. If it may not, Home shows **ActionCut needs permissions** with a **Grant** button.
- Make sure an event is running — Home shows the dark **Event in progress** bar.
- If **Settings → Experimental → Only while the camera is in use** is on, the button only shows while an app is using the camera.

## A moment says “Video not on this phone”

The recording the moment came from was deleted or moved, so ActionCut can’t cut its clip. Clips that were already cut stay available. If the video is back on the phone — for example restored from Google Photos — ActionCut links it again. Otherwise add it through [Sources](./other-cameras.mdx).

## Moments don’t line up with the action

ActionCut matches moments to videos by time. If a video’s date and time are off — common with cameras whose clock was never set — open the event’s **Sources**, open the video and choose **⋮ → Adjust recording time**.

## A moment has no clip

If nothing was recording when you tapped, there is no video to cut from. Next time start recording before the action — or add the moment afterwards in the video player (see [Mark moments afterwards](./other-cameras.mdx#mark-moments-afterwards)).

## Clips are still being prepared

Opening an event cuts any clips that are missing and shows its progress, for example *Preparing clips · 12 of 40*. Long events take a little while.

## My phone isn’t supported

ActionCut needs **Android 14 or newer**. An [iPhone version](./iphone.mdx) is on the way.
```

- [ ] **Step 12: `guide/iphone.mdx`**

```mdx
---
title: ActionCut for iPhone
sidebar_label: iPhone (coming soon)
description: What the upcoming iPhone version will do, and how it differs from Android.
---

ActionCut for iPhone is in development. It will have the same events, moments, clips, tags and favorites as the Android app, for iPhones with **iOS 26 or newer**.

## What will be different

iOS doesn’t let a button float over another app, the Camera included. So the iPhone app will mark moments its own ways:

- **Its own camera with a Mark button.** Starting an event opens the ActionCut camera: record, then tap **Mark** for an instant or hold it for an interval, with quick tags beside it. Recordings go to your Photos library.
- **Mark from anywhere.** A *Mark moment* control will work from Control Center, the Lock Screen and the Action Button while an event is running — handy when you film with another camera.
- **Live Activity.** *Event in progress* stays on the Lock Screen with the timer, your moment count, **Mark** and **Interval** buttons and the quick tags of your last moment.

Videos filmed outside the app will work too: ActionCut will find them in Photos by time, and you’ll be able to import them from Photos or Files.

## Android ⇄ iPhone

Events exported on one platform can be imported on the other, so a family with both kinds of phones can share them.

:::info Want to try it?
There’s no sign-up list yet. This page will say when the iPhone version is ready.
:::
```

- [ ] **Step 13: Guide styles — append to `src/css/custom.css`**

```css
/* Guide (docs) */
.theme-doc-sidebar-container {
  border-right: 0 !important;
}

.theme-doc-sidebar-menu {
  padding: 8px 12px 24px;
}

.theme-doc-sidebar-item-category-level-1 > .menu__list-item-collapsible > .menu__link {
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ac-ink-2);
}

.menu__link {
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
}

.menu__link--active:not(.menu__link--sublist) {
  background: var(--ac-container-high);
  color: var(--ac-primary);
}

.theme-doc-markdown h1 {
  margin-bottom: 16px;
  font-size: clamp(36px, 4vw, 52px);
  line-height: 1.05;
  font-weight: 760;
  letter-spacing: -0.03em;
}

.theme-doc-markdown h2 {
  margin-top: 44px;
  font-size: 28px;
  font-weight: 720;
}

.theme-doc-markdown h3 {
  font-size: 21px;
  font-weight: 680;
}

.theme-doc-markdown ol li::marker {
  font-weight: 700;
  color: var(--ac-primary);
}

.theme-doc-markdown table {
  display: table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 20px;
  overflow: hidden;
  background: var(--ac-item);
  box-shadow: inset 0 0 0 1px var(--ac-outline-variant);
}

.theme-doc-markdown thead tr {
  background: var(--ac-cream);
}

.theme-doc-markdown tr,
.theme-doc-markdown tr:nth-child(2n) {
  border: 0;
  background: transparent;
}

.theme-doc-markdown th,
.theme-doc-markdown td {
  padding: 12px 16px;
  border: 0;
  border-bottom: 1px solid var(--ac-outline-variant);
  text-align: left;
  vertical-align: top;
}

.theme-doc-markdown tbody tr:last-child td {
  border-bottom: 0;
}

.theme-admonition {
  border: 0;
  border-radius: 20px;
  padding: 16px 20px;
}

.alert--info {
  --ifm-alert-background-color: var(--ac-info);
  --ifm-alert-foreground-color: var(--ac-on-info);
  --ifm-alert-border-color: transparent;
}

.alert--success {
  --ifm-alert-background-color: var(--ac-container-high);
  --ifm-alert-foreground-color: var(--ac-ink);
  --ifm-alert-border-color: transparent;
}

.alert--warning {
  --ifm-alert-background-color: var(--ac-live-container);
  --ifm-alert-foreground-color: #690005;
  --ifm-alert-border-color: transparent;
}

.pagination-nav__link {
  padding: 16px 20px;
  border: 0;
  border-radius: 20px;
  background: var(--ac-item);
  box-shadow: 0 1px 2px rgba(37, 25, 18, 0.06);
  transition: transform 0.3s var(--ac-ease-spring);
}

.pagination-nav__link:hover {
  transform: translateY(-2px);
}

.pagination-nav__sublabel {
  font-weight: 700;
  color: var(--ac-primary);
}

.breadcrumbs__link {
  border-radius: 9999px;
}

.ac-screens {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin: 24px 0 32px;
}

.theme-doc-markdown figure {
  margin-top: 24px;
  margin-bottom: 32px;
}
```

- [ ] **Step 14: Typecheck, test, build**

Run: `npm run typecheck && npm test && npm run build`
Expected: all green — no broken links or anchors reported as errors (`#versions`, `#scan-this-phone`, `#mark-moments-afterwards` exist as headings).

- [ ] **Step 15: Browser check**

Browser check procedure:
- `/guide/first-event` at 1440×900: sidebar with four uppercase groups, the active item tinted, two striped "Screenshot: …" phones side by side, the tip box in peach, next/previous cards at the bottom.
- `/guide/floating-button` at 390×844: the table fits or scrolls inside itself; `scrollWidth − clientWidth === 0`; the hamburger opens the full-height sidebar with the Guide menu.
- Console: no errors.

- [ ] **Step 16: Commit**

```bash
git add -A
git commit -m "docs(guide): ten Guide articles, MDX Screen component, Guide styling

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Changelog, Privacy Policy, footer

**Files:**
- Create: `src/data/changelog.ts`, `src/lib/changelog.ts`, `src/lib/changelog.test.ts`, `src/pages/changelog.module.css`, `src/pages/privacy.mdx`, `src/components/legal/ContactLine.tsx`, `src/theme/Footer/index.tsx`, `src/theme/Footer/styles.module.css`
- Replace: `src/pages/changelog.tsx`
- Modify: `guide/getting-started.mdx`, `src/css/custom.css`

**Interfaces:**
- Consumes: UI kit (Task 2), `site` (Task 1), Guide routes (Task 8).
- Produces: `Release = {version: string; date: string /* YYYY-MM-DD */; title: string; highlights: string[]}`, `releases: Release[]` (newest first).
- Produces: `formatReleaseDate(iso: string): string` (`'October 6, 2026'`), `groupByMonth(releases): ReleaseMonth[]` with `ReleaseMonth = {label: string /* 'October 2026' */; releases: Release[]}`, `isNewestFirst(releases): boolean`.
- Produces: routes `/changelog`, `/privacy`; the site footer on every page.

- [ ] **Step 1: Write the changelog data (from the app's git history)**

`src/data/changelog.ts`:
```ts
export type Release = {
  version: string;
  /** YYYY-MM-DD */
  date: string;
  title: string;
  highlights: string[];
};

// Versions follow the app's versionName (1.<minor>.<commits − baseline>), see app/build.gradle.kts.
// Add new releases at the top.
export const releases: Release[] = [
  {
    version: '1.5.41',
    date: '2026-10-06',
    title: 'Sources, smart import and practice mode',
    highlights: [
      'Sources: all of an event’s videos on one screen, with Scan this phone to find recordings by time.',
      'Videos put back on the phone, for example from Google Photos, are linked again automatically.',
      'Clips save straight to your gallery, in the ActionCut album.',
      'Missing clips are cut automatically when you open an event.',
      'Practice mode: place the floating button over the camera before the game.',
      'Experimental: show the floating button only while the camera is in use.',
      'Move moments to another event, a full-screen player with 5-second skips, and a light, dark or system theme.',
    ],
  },
  {
    version: '1.5.0',
    date: '2026-10-05',
    title: 'Tags and grouped favorites',
    highlights: [
      'Tags with colors: Goal, Save, Assist, Skill and Funny to start with, plus your own.',
      'Quick tags appear beside the floating button for five seconds after each moment.',
      'Filter an event or your favorites by tag, and save just those clips.',
      'Favorites are grouped by month and event, with Select all for each event.',
    ],
  },
  {
    version: '1.2.65',
    date: '2026-10-04',
    title: 'A brand-new look',
    highlights: [
      'Rebuilt on Material 3 Expressive, in light and dark.',
      'A new Home with a live bar while an event is running.',
      'New Event, Moment and Settings screens, with the main actions where your thumb is.',
    ],
  },
  {
    version: '1.2.33',
    date: '2026-06-10',
    title: 'Custom clips',
    highlights: [
      'Edit clip: set a moment’s own start and end on the video.',
      'The event’s default window shows on the timeline for reference.',
      'Moments with a custom clip get a scissors badge and keep it when the event’s clip length changes.',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-06-07',
    title: 'Export, import and saving favorites',
    highlights: [
      'Export one event or all of them to a file, and import them on another phone.',
      'Select favorites and save them to the gallery in one go.',
      'Opening a favorite pages through your favorites.',
    ],
  },
  {
    version: '1.1.55',
    date: '2026-06-02',
    title: 'Camera shortcuts and safer cleanup',
    highlights: [
      'Open the camera from the app, or automatically when an event starts.',
      'Removing a video can also delete the file from your phone, after Android’s own confirmation.',
      'The floating button stays put when you rotate the phone.',
    ],
  },
  {
    version: '1.0.189',
    date: '2026-05-28',
    title: 'Moments, intervals and favorites',
    highlights: [
      'Hold the floating button to mark an interval; tap it for an instant.',
      'Thumbnails, and a moment screen with playback, titles and next/previous.',
      'Favorites, event names and events you can resume.',
      'Clip length set separately for taps and holds.',
      'Import a video, set when it was filmed to the second, and adjust its recording time later.',
    ],
  },
  {
    version: '0.1',
    date: '2025-07-23',
    title: 'First prototype',
    highlights: ['A floating button that marks moments while you film.', 'Clips cut from your videos around each mark.'],
  },
];
```

- [ ] **Step 2: Write the failing tests**

`src/lib/changelog.test.ts`:
```ts
import {describe, expect, it} from 'vitest';
import {releases, type Release} from '../data/changelog';
import {formatReleaseDate, groupByMonth, isNewestFirst} from './changelog';

const r = (version: string, date: string): Release => ({version, date, title: version, highlights: ['x']});

describe('formatReleaseDate', () => {
  it('formats ISO dates in US English, independent of the time zone', () => {
    expect(formatReleaseDate('2026-10-06')).toBe('October 6, 2026');
    expect(formatReleaseDate('2025-07-23')).toBe('July 23, 2025');
  });
});

describe('groupByMonth', () => {
  it('groups consecutive releases of the same month', () => {
    const groups = groupByMonth([r('3', '2026-10-06'), r('2', '2026-10-04'), r('1', '2026-06-10')]);
    expect(groups.map((g) => g.label)).toEqual(['October 2026', 'June 2026']);
    expect(groups[0].releases.map((x) => x.version)).toEqual(['3', '2']);
  });

  it('returns nothing for no releases', () => {
    expect(groupByMonth([])).toEqual([]);
  });
});

describe('the changelog data', () => {
  it('is sorted newest first', () => {
    expect(isNewestFirst(releases)).toBe(true);
    expect(isNewestFirst([r('1', '2026-01-01'), r('2', '2026-02-01')])).toBe(false);
  });

  it('has unique versions, valid dates and at least one highlight each', () => {
    expect(new Set(releases.map((x) => x.version)).size).toBe(releases.length);
    for (const x of releases) {
      expect(x.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(new Date(`${x.date}T00:00:00Z`).getTime())).toBe(false);
      expect(x.highlights.length).toBeGreaterThan(0);
    }
  });
});
```

Run: `npm test -- src/lib/changelog.test.ts`
Expected: FAIL — `Failed to resolve import "./changelog"`.

- [ ] **Step 3: Implement `src/lib/changelog.ts`**

```ts
import type {Release} from '../data/changelog';

const DAY = new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC'});
const MONTH = new Intl.DateTimeFormat('en-US', {month: 'long', year: 'numeric', timeZone: 'UTC'});

function toDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function formatReleaseDate(iso: string): string {
  return DAY.format(toDate(iso));
}

export type ReleaseMonth = {label: string; releases: Release[]};

export function groupByMonth(list: Release[]): ReleaseMonth[] {
  const groups: ReleaseMonth[] = [];
  for (const release of list) {
    const label = MONTH.format(toDate(release.date));
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.releases.push(release);
    else groups.push({label, releases: [release]});
  }
  return groups;
}

export function isNewestFirst(list: Release[]): boolean {
  return list.every((release, i) => i === 0 || list[i - 1].date >= release.date);
}
```

Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Replace `src/pages/changelog.tsx` and add its styles**

```tsx
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
              <Button href={site.apkUrl} download icon={<Icon name="download" />}>
                Download for Android
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
```

`src/pages/changelog.module.css`:
```css
.top {
  margin-top: 12px;
}

.title {
  margin: 0 0 32px;
  font-size: clamp(48px, 7vw, 96px);
  line-height: 0.95;
  font-weight: 780;
  letter-spacing: -0.035em;
}

.latest {
  max-width: 820px;
  padding: clamp(24px, 4vw, 40px);
  border-radius: 40px 40px 12px 40px;
  background: var(--ac-item);
  box-shadow: 0 24px 48px -28px rgba(94, 39, 0, 0.35);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
  font-size: 15px;
}

.badge {
  padding: 4px 12px;
  border-radius: 9999px;
  background: var(--ac-orange);
  color: var(--ac-on-orange);
  font-size: 13px;
  font-weight: 750;
}

.version {
  font-weight: 750;
  font-variant-numeric: tabular-nums;
}

.date {
  color: var(--ac-ink-2);
}

.latestTitle {
  margin: 14px 0 12px;
  font-size: clamp(28px, 3vw, 38px);
  line-height: 1.1;
  font-weight: 720;
}

.highlights {
  margin: 0;
  padding-left: 1.2em;
  font-size: 17px;
  line-height: 1.55;
}

.highlights li {
  margin: 6px 0;
}

.highlights li::marker {
  color: var(--ac-orange);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
  margin-top: 24px;
}

.req {
  font-size: 15px;
  font-weight: 600;
  color: var(--ac-ink-2);
}

.month + .month {
  margin-top: 40px;
}

.monthLabel {
  margin: 28px 0 14px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ac-primary);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.entry {
  padding: 22px 24px;
  border-radius: 6px;
  background: var(--ac-cream);
}

.entry:first-child {
  border-radius: 20px 20px 6px 6px;
}

.entry:last-child {
  border-radius: 6px 6px 20px 20px;
}

.entry:only-child {
  border-radius: 20px;
}

.entryTitle {
  margin: 8px 0 6px;
  font-size: 21px;
  font-weight: 700;
}
```

- [ ] **Step 5: Privacy Policy**

`src/components/legal/ContactLine.tsx`:
```tsx
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
```

`src/pages/privacy.mdx`:
```mdx
---
title: Privacy Policy
description: What ActionCut keeps on your phone, what it sends, and why.
hide_table_of_contents: true
---

import ContactLine from '@site/src/components/legal/ContactLine';

<div className="ac-legal">

# Privacy Policy

_Last updated: October 7, 2026_

ActionCut is built so your videos stay with you. This page explains in plain words what the Android app keeps on your phone, what it sends, and why.

## The short version

- **Your videos, clips and moments stay on your phone.** ActionCut doesn’t upload them to us or to anyone else.
- **No account.** You don’t sign up or log in.
- **Crash reports and basic usage statistics** go to Google Firebase, so we can find and fix problems.

## What stays on your phone

- The events you create and the moments you mark, with their titles, tags and favorites.
- The clips ActionCut cuts from your videos. They’re stored privately inside the app until you save them to your gallery.
- Your settings, such as clip lengths and how the floating button looks.

ActionCut reads the videos in your gallery only to find the ones recorded during your events and cut clips from them. It doesn’t change your original videos. If you choose **Remove from event** and tick **Also delete the files from this phone**, Android asks you to confirm before anything is deleted.

## What the app sends

ActionCut uses two Google Firebase services:

- **Firebase Crashlytics.** When the app crashes, it sends a crash report: where in the code it failed, the app version, your phone model and Android version, and a random identifier for this installation.
- **Firebase Analytics.** Basic statistics that Firebase collects automatically, such as when the app was first opened, how long it’s used, the app version, phone model, Android version and approximate country. ActionCut doesn’t add any tracking of its own.

Neither service receives your videos, clips, event names, moment titles or tags. Google processes this data for us under its own terms — see [Privacy and Security in Firebase](https://firebase.google.com/support/privacy).

## Backups

If backup is turned on in your phone’s settings, Android can copy ActionCut’s app data — events, moments, settings and the clips stored inside the app — to your own Google account backup. Android limits how much each app can back up. You control this in your phone’s settings.

## Permissions

| Permission | What ActionCut uses it for |
|---|---|
| Display over other apps | Showing the floating button over your camera app during an event. |
| Photos and videos | Finding the videos recorded during your events, cutting clips from them, and saving clips to your gallery. |
| Notifications | Showing that an event is in progress and that clips are being saved. |

## Sharing clips

When you share a clip, you choose the app it goes to, and that app’s privacy policy applies from there. Clips often show children — please share them thoughtfully.

## Children

ActionCut is made for parents, guardians and coaches. It doesn’t ask for anyone’s name, age or contact details.

## Future features

We plan optional paid extras, such as cloud storage for clips. If we add a feature that sends your clips or other content off your phone, we’ll describe it here before it launches, and it will be up to you whether to use it.

## iPhone

This policy covers the Android app. The iPhone app isn’t released yet; this page will be updated when it is.

## Contact

<ContactLine />

</div>
```

Append to `src/css/custom.css`:
```css
/* Privacy Policy and other MDX pages */
.ac-legal {
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 4px 48px;
}

.ac-legal h1 {
  font-size: clamp(40px, 5vw, 64px);
  line-height: 1;
  font-weight: 780;
  letter-spacing: -0.03em;
}

.ac-legal h2 {
  margin-top: 40px;
  font-size: 26px;
  font-weight: 720;
}

.ac-legal table {
  display: table;
  width: 100%;
}
```

- [ ] **Step 6: Footer**

`src/theme/Footer/index.tsx`:
```tsx
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
```

`src/theme/Footer/styles.module.css`:
```css
.footer {
  margin: 12px;
  padding: clamp(40px, 6vw, 64px) clamp(20px, 5vw, 64px) 28px;
  border-radius: var(--ac-radius-sheet);
  background: var(--ac-item);
  color: var(--ac-ink);
}

.inner {
  display: grid;
  grid-template-columns: minmax(0, 2fr) repeat(3, minmax(0, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.brand p {
  margin: 14px 0 18px;
  color: var(--ac-ink-2);
}

.download {
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 20px;
  border-radius: 9999px;
  background: var(--ac-orange);
  color: var(--ac-on-orange);
  font-weight: 700;
  text-decoration: none;
}

.download:hover {
  color: var(--ac-on-orange);
  text-decoration: none;
  background: var(--ac-orange-hover);
}

.colTitle {
  margin: 6px 0 12px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ac-ink-2);
}

.col ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.col li {
  margin: 8px 0;
}

.col a {
  color: var(--ac-ink);
  font-weight: 600;
}

.bottom {
  max-width: 1200px;
  margin: 36px auto 0;
  padding-top: 20px;
  border-top: 1px solid var(--ac-outline-variant);
  font-size: 14px;
  color: var(--ac-ink-2);
}

@media (max-width: 800px) {
  .inner {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 600px) {
  .footer {
    margin: 8px;
    border-radius: var(--ac-radius-l);
  }
}
```

- [ ] **Step 7: Link Privacy and Changelog from Getting started**

In `guide/getting-started.mdx`:
- replace the line `ActionCut is coming to Google Play soon. Until then you install it straight from this site, and you update it the same way: download the latest file and install it over the old one. Your events and moments stay.` with
  `ActionCut is coming to Google Play soon. Until then you install it straight from this site, and you update it the same way: download the latest file and install it over the old one. Your events and moments stay. See what changed in the [changelog](/changelog).`
- replace `ActionCut never uploads your videos. Every clip is cut on your phone.` with
  `ActionCut never uploads your videos. Every clip is cut on your phone — read the [Privacy Policy](/privacy).`

- [ ] **Step 8: Typecheck, test, build**

Run: `npm run typecheck && npm test && npm run build`
Expected: all green; `build/changelog/index.html` and `build/privacy/index.html` exist.

- [ ] **Step 9: Browser check**

Browser check procedure on `/changelog`, `/privacy`, `/guide` at 1440×900 and 390×844: the old dark changelog is gone (the navbar shows again), the latest-release card is white with an orange "Latest" badge, earlier versions are grouped by month; Privacy reads as one column with a table; the white rounded footer appears on every page with Product / Help / Legal. No horizontal scroll, no console errors.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat(site): changelog from the app history, privacy policy, footer

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: iPhone, Free, Privacy & FAQ, final CTA — and the whole landing

**Files:**
- Create: `src/data/faq.ts`
- Create: `src/components/landing/IphoneSoon.tsx`, `IphoneSoon.module.css`, `FreeLater.tsx`, `FreeLater.module.css`, `PrivacyFaq.tsx`, `PrivacyFaq.module.css`, `FinalCta.tsx`, `FinalCta.module.css`
- Modify: `src/pages/index.tsx`

**Interfaces:**
- Consumes: UI kit (Task 2), `PhoneFrame`, `IphoneLiveMock` (Task 4), `site` (Task 1), routes from Tasks 8–9.
- Produces: `faqs: Faq[]`, `Faq = {q: string; a: string; link?: {label: string; to: string}}`; anchors `#iphone`, `#faq`, `#download`.

- [ ] **Step 1: `src/data/faq.ts`**

```ts
export type Faq = {q: string; a: string; link?: {label: string; to: string}};

export const faqs: Faq[] = [
  {
    q: 'Does ActionCut record video?',
    a: 'No. You record with your usual camera app. ActionCut only remembers when you tapped, then finds the recording on your phone and cuts a short clip around each moment.',
  },
  {
    q: 'Which phones does it work on?',
    a: 'Android phones running Android 14 or newer. An iPhone version is on the way.',
  },
  {
    q: 'Does it work with any camera app?',
    a: 'Yes, as long as the app saves its videos to your phone’s gallery with the right date and time — ActionCut matches moments to recordings by when they were filmed.',
  },
  {
    q: 'I forgot to start an event. Can I still get clips?',
    a: 'Yes. Start and stop a new event, import the video in its Sources with Choose a file, then play it and add moments with + Instant and + Interval.',
    link: {label: 'Mark moments afterwards', to: '/guide/other-cameras#mark-moments-afterwards'},
  },
  {
    q: 'Can I use a second phone or camera?',
    a: 'Yes. Copy its videos to your phone, open the event’s Sources and tap Scan this phone. Moments covered by more than one video get a version from each.',
    link: {label: 'Videos from another camera', to: '/guide/other-cameras'},
  },
  {
    q: 'Where do my clips go?',
    a: 'Saved clips land in your gallery, in the ActionCut album (Movies/ActionCut). Saving the same clip again replaces it instead of making a copy.',
  },
  {
    q: 'Can I change the clip length after the game?',
    a: 'Yes. Change the event’s Clip length and ActionCut re-cuts its clips, or use Edit clip to give one moment its own start and end.',
    link: {label: 'Clip length & custom clips', to: '/guide/clip-length'},
  },
  {
    q: 'Do I need an internet connection?',
    a: 'Not for marking or cutting — both happen on your phone.',
  },
  {
    q: 'Is ActionCut free?',
    a: 'Yes. Download it and use every feature. Optional paid extras, such as cloud storage for your clips, may come later.',
  },
];
```

- [ ] **Step 2: iPhone section**

`src/components/landing/IphoneSoon.tsx`:
```tsx
import {site} from '@site/src/data/site';
import Icon, {type IconName} from '../brand/Icon';
import Shape from '../brand/Shapes';
import IphoneLiveMock from '../phone/IphoneLiveMock';
import PhoneFrame from '../phone/PhoneFrame';
import Button from '../ui/Button';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import StoreBadge from '../ui/StoreBadge';
import styles from './IphoneSoon.module.css';

const POINTS: {icon: IconName; title: string; body: string}[] = [
  {icon: 'video', title: 'A camera with Mark built in', body: 'Record and mark in one place: tap for an instant, hold for an interval.'},
  {icon: 'zap', title: 'Mark from anywhere', body: 'Control Center, the Lock Screen and the Action Button can mark a moment while an event runs.'},
  {icon: 'smartphone', title: 'Live Activity', body: 'The timer, your moment count and Mark and Interval buttons stay on the Lock Screen.'},
  {icon: 'swap', title: 'Android ⇄ iPhone', body: 'Export an event on one phone and import it on the other.'},
];

export default function IphoneSoon() {
  return (
    <Section id="iphone" tone="brown" labelledBy="iphone-title" innerClassName={styles.inner}>
      <RevealGroup className={styles.copy}>
        <RevealItem>
          <span className="ac-eyebrow">Coming soon</span>
        </RevealItem>
        <RevealItem>
          <h2 id="iphone-title" className="ac-h2">
            ActionCut for iPhone
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="ac-lead">
            iOS doesn’t let a button float over the Camera app — so the iPhone version brings its own camera, with the
            Mark button built in.
          </p>
        </RevealItem>
        <div className={styles.points}>
          {POINTS.map((p) => (
            <RevealItem key={p.title} className={styles.point}>
              <span className={styles.pointIcon}>
                <Icon name={p.icon} size={22} />
              </span>
              <h3 className={styles.pointTitle}>{p.title}</h3>
              <p className={styles.pointBody}>{p.body}</p>
            </RevealItem>
          ))}
        </div>
        <RevealItem className={styles.actions}>
          <StoreBadge label="iPhone" href={site.appStoreUrl} />
          <span className={styles.req}>{site.minIos}</span>
          <Button to="/guide/iphone" variant="ghost">
            What’s different on iPhone
          </Button>
        </RevealItem>
      </RevealGroup>
      <div className={styles.visual}>
        <Shape kind="burst" color="var(--ac-orange)" spin className={styles.burst} />
        <div className={styles.phone}>
          <PhoneFrame platform="iphone" label="Concept: the ActionCut Live Activity on the iPhone Lock Screen with Mark and Interval buttons">
            <IphoneLiveMock />
          </PhoneFrame>
        </div>
      </div>
    </Section>
  );
}
```

`src/components/landing/IphoneSoon.module.css`:
```css
.inner {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  align-items: center;
  gap: clamp(32px, 5vw, 72px);
}

.points {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 32px;
}

.point {
  padding: 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.07);
}

.pointIcon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--ac-orange);
  color: var(--ac-on-orange);
}

.pointTitle {
  margin: 14px 0 6px;
  font-size: 19px;
  font-weight: 700;
  color: inherit;
}

.pointBody {
  margin: 0;
  font-size: 15.5px;
  line-height: 1.5;
  color: var(--ac-on-brown-2);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
  margin-top: 28px;
}

.req {
  font-size: 15px;
  font-weight: 600;
  color: var(--ac-on-brown-2);
}

.visual {
  position: relative;
  display: flex;
  justify-content: center;
}

.burst {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(460px, 120%);
  transform: translate(-50%, -50%);
  opacity: 0.9;
}

.phone {
  position: relative;
  width: min(300px, 74vw);
  transform: rotate(-3deg);
}

@media (max-width: 996px) {
  .inner {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .points {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Free + Coming later**

`src/components/landing/FreeLater.tsx`:
```tsx
import Icon from '../brand/Icon';
import Shape from '../brand/Shapes';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import styles from './FreeLater.module.css';

export default function FreeLater() {
  return (
    <Section tone="white" labelledBy="free-title" innerClassName={styles.inner}>
      <div className={styles.price} aria-hidden="true">
        <Shape kind="burst" color="var(--ac-orange)" spin className={styles.burst} />
        <span className={styles.priceText}>Free</span>
      </div>
      <RevealGroup>
        <RevealItem>
          <h2 id="free-title" className="ac-h2">
            ActionCut is free.
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="ac-lead">No subscription, no account, no ads. Download it and use every feature.</p>
        </RevealItem>
        <RevealItem className={styles.later}>
          <p className={styles.laterLabel}>Coming later — optional extras</p>
          <ul className={styles.extras}>
            <li>
              <Icon name="cloud" size={20} />
              Cloud storage for your clips
            </li>
            <li>
              <Icon name="user" size={20} />
              Athlete profiles
            </li>
          </ul>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}
```

`src/components/landing/FreeLater.module.css`:
```css
.inner {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: clamp(28px, 5vw, 72px);
}

.price {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(180px, 22vw, 280px);
  aspect-ratio: 1;
}

.burst {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.priceText {
  position: relative;
  font-size: clamp(48px, 6vw, 80px);
  font-weight: 800;
  letter-spacing: -0.03em;
  font-variation-settings: 'ROND' 100;
  color: var(--ac-on-orange);
}

.later {
  margin-top: 28px;
}

.laterLabel {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ac-primary);
}

.extras {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.extras li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 18px 0 14px;
  border-radius: 22px;
  background: var(--ac-cream);
  font-weight: 650;
}

.extras svg {
  color: var(--ac-primary);
}

@media (max-width: 700px) {
  .inner {
    grid-template-columns: 1fr;
    justify-items: start;
  }
}
```

- [ ] **Step 4: Privacy & FAQ**

`src/components/landing/PrivacyFaq.tsx`:
```tsx
import Link from '@docusaurus/Link';
import {faqs} from '@site/src/data/faq';
import Icon from '../brand/Icon';
import {RevealGroup, RevealItem} from '../ui/Reveal';
import Section from '../ui/Section';
import styles from './PrivacyFaq.module.css';

export default function PrivacyFaq() {
  return (
    <Section id="faq" tone="cream" labelledBy="faq-title" innerClassName={styles.inner}>
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
```

`src/components/landing/PrivacyFaq.module.css`:
```css
.inner {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  align-items: start;
  gap: clamp(32px, 5vw, 72px);
}

.privacy {
  position: sticky;
  top: 110px;
}

.card {
  padding: 28px;
  border-radius: 40px 12px 40px 40px;
  background: var(--ac-brown);
  color: var(--ac-on-brown);
}

.lock {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 17px;
  background: var(--ac-orange);
  color: var(--ac-on-orange);
}

.cardTitle {
  margin: 18px 0 10px;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 720;
  color: inherit;
}

.cardBody {
  margin: 0 0 18px;
  font-size: 17px;
  line-height: 1.55;
  color: var(--ac-on-brown-2);
}

.cardLink {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: var(--ac-inverse-primary);
}

.cardLink:hover {
  color: #ffffff;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  interpolate-size: allow-keywords;
}

.item {
  border-radius: 6px;
  background: var(--ac-item);
}

.item:first-child {
  border-radius: 20px 20px 6px 6px;
}

.item:last-child {
  border-radius: 6px 6px 20px 20px;
}

.item summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  font-size: 18px;
  font-weight: 650;
  list-style: none;
  cursor: pointer;
}

.item summary::-webkit-details-marker {
  display: none;
}

.chev {
  flex: none;
  color: var(--ac-primary);
  transition: transform 0.35s var(--ac-ease-spring);
}

.item[open] .chev {
  transform: rotate(180deg);
}

.item::details-content {
  block-size: 0;
  overflow: clip;
  transition: block-size 0.35s var(--ac-ease-out);
}

.item[open]::details-content {
  block-size: auto;
}

.answer {
  padding: 0 20px 20px;
  font-size: 16.5px;
  line-height: 1.55;
  color: var(--ac-ink-2);
}

.answer p {
  margin: 0;
}

.more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-weight: 700;
}

@media (max-width: 996px) {
  .inner {
    grid-template-columns: 1fr;
  }

  .privacy {
    position: static;
  }
}
```

- [ ] **Step 5: Final CTA**

`src/components/landing/FinalCta.tsx`:
```tsx
import type {CSSProperties} from 'react';
import {site} from '@site/src/data/site';
import Icon from '../brand/Icon';
import Button from '../ui/Button';
import Section from '../ui/Section';
import StoreBadge from '../ui/StoreBadge';
import styles from './FinalCta.module.css';

const FLOATERS = [0, 1, 2, 3, 4, 5];

export default function FinalCta() {
  return (
    <Section id="download" tone="orange" labelledBy="cta-title" innerClassName={styles.inner}>
      <div className={styles.floaters} aria-hidden="true">
        {FLOATERS.map((i) => (
          <span key={i} className={styles.floater} style={{'--i': i} as CSSProperties}>
            <Icon name="crosshair" />
          </span>
        ))}
      </div>
      <h2 id="cta-title" className={styles.title}>
        Ready for the next game?
      </h2>
      <p className="ac-lead">Download ActionCut, start an event before kick-off and tap your way to the highlights.</p>
      <div className={styles.ctas}>
        <Button href={site.apkUrl} download size="l" variant="dark" icon={<Icon name="download" />}>
          Download for Android
        </Button>
        <span className={styles.meta}>Free · {site.minAndroid}</span>
      </div>
      <div className={styles.badges}>
        <StoreBadge label="Google Play" href={site.googlePlayUrl} />
        <StoreBadge label="iPhone" href={site.appStoreUrl} />
      </div>
    </Section>
  );
}
```

`src/components/landing/FinalCta.module.css`:
```css
.inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.inner :global(.ac-lead) {
  margin: 0 auto;
}

.title {
  position: relative;
  margin: 0 0 18px;
  font-size: clamp(48px, 8vw, 112px);
  line-height: 0.95;
  font-weight: 780;
  letter-spacing: -0.035em;
  color: inherit;
}

.ctas {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px 18px;
  margin-top: 32px;
}

.meta {
  font-size: 15px;
  font-weight: 650;
}

.badges {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 18px;
}

.floaters {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floater {
  position: absolute;
  color: var(--ac-on-orange);
  opacity: 0.16;
  animation: drift calc(9s + var(--i) * 1.3s) ease-in-out calc(var(--i) * -1.7s) infinite alternate;
}

.floater svg {
  width: 100%;
  height: 100%;
}

.floater:nth-child(1) { left: 4%; top: 12%; width: 72px; height: 72px; }
.floater:nth-child(2) { left: 84%; top: 8%; width: 110px; height: 110px; }
.floater:nth-child(3) { left: 12%; top: 70%; width: 54px; height: 54px; }
.floater:nth-child(4) { left: 72%; top: 66%; width: 64px; height: 64px; }
.floater:nth-child(5) { left: 44%; top: 4%; width: 40px; height: 40px; }
.floater:nth-child(6) { left: 92%; top: 82%; width: 46px; height: 46px; }

@keyframes drift {
  from {
    transform: translate(0, 0) rotate(0deg);
  }
  to {
    transform: translate(18px, -26px) rotate(40deg);
  }
}

@media (max-width: 600px) {
  .floater:nth-child(2) {
    left: 72%;
  }
}
```

- [ ] **Step 6: The complete `src/pages/index.tsx`**

```tsx
import Layout from '@theme/Layout';
import Benefits from '@site/src/components/landing/Benefits';
import ButtonDemo from '@site/src/components/landing/ButtonDemo';
import Features from '@site/src/components/landing/Features';
import FinalCta from '@site/src/components/landing/FinalCta';
import FreeLater from '@site/src/components/landing/FreeLater';
import Hero from '@site/src/components/landing/Hero';
import HowItWorks from '@site/src/components/landing/HowItWorks';
import IphoneSoon from '@site/src/components/landing/IphoneSoon';
import PrivacyFaq from '@site/src/components/landing/PrivacyFaq';
import Problem from '@site/src/components/landing/Problem';
import UseCases from '@site/src/components/landing/UseCases';
import {site} from '@site/src/data/site';

export default function Home() {
  return (
    <Layout title="Highlight clips from every game" description={site.description}>
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <ButtonDemo />
        <UseCases />
        <Features />
        <Benefits />
        <IphoneSoon />
        <FreeLater />
        <PrivacyFaq />
        <FinalCta />
      </main>
    </Layout>
  );
}
```

- [ ] **Step 7: Typecheck, test, build — no anchor warnings left**

Run: `npm run typecheck && npm test && npm run build 2>&1 | tee /tmp/ac-build.log | tail -5; grep -i "broken anchor" /tmp/ac-build.log | head`
Expected: build succeeds; the grep prints nothing (every `/#…` link now has its section).

- [ ] **Step 8: No-JS override present and used (Review Focus 2)**

Run: `grep -c '\[data-reveal\]{opacity:1' build/index.html; grep -o 'data-reveal=""' build/index.html | wc -l`
Expected: `1`, and a count above 20.

- [ ] **Step 9: Full-page browser check (Review Focus 1, 4)**

Browser check procedure on `/` at 1440×900, 390×844 and 360×740:
- Full-page screenshots at each width. The rhythm reads cream → white → cream → orange → white → cream → blue → brown → white → cream → orange, with the white footer last.
- At every width `scrollWidth − clientWidth === 0`.
- Click each navbar link (`How it works`, `Use cases`, `Features`, `iPhone`, `FAQ`) — each scrolls to its section below the navbar pill.
- Open two FAQ items; the chevron turns and the answer shows.
- `browser_console_messages`: no errors, none of `#418`, `#423`, `#425`.
- `browser_emulate_media` `reducedMotion: 'reduce'`, reload, full-page screenshot: everything visible, no faint benefit lines, no spinning shapes.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat(landing): iPhone teaser, free plan, privacy and FAQ, final call to action

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Social card, docs, final verification

**Files:**
- Create: `scripts/og-card.html`, `static/img/og-card.png`
- Modify: `docusaurus.config.ts` (`themeConfig.image`), `CLAUDE.md`, `README.md`

**Interfaces:**
- Consumes: everything above.
- Produces: `static/img/og-card.png` (1200×630) referenced by `themeConfig.image: 'img/og-card.png'`.

- [ ] **Step 1: Social card source `scripts/og-card.html`**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>ActionCut social card</title>
<link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wdth,wght,ROND@6..144,25..151,100..1000,0..100&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #fff1eb; font-family: 'Google Sans Flex', system-ui, sans-serif; color: #251912; position: relative; }
  .cookie { position: absolute; right: -120px; top: -90px; width: 640px; height: 640px; }
  .pill { position: absolute; left: -70px; bottom: -60px; width: 300px; height: 150px; border-radius: 75px; background: #00aaf2; transform: rotate(-14deg); }
  .logo { position: absolute; left: 72px; top: 64px; display: flex; align-items: center; gap: 16px; font-size: 34px; font-weight: 750; font-variation-settings: 'ROND' 100; }
  .badge { width: 60px; height: 60px; border-radius: 18px; background: #ff7a1a; display: flex; align-items: center; justify-content: center; }
  h1 { position: absolute; left: 72px; top: 170px; margin: 0; font-size: 150px; line-height: 0.9; font-weight: 790; letter-spacing: -0.04em; font-variation-settings: 'ROND' 100; }
  h1 span { color: #9c4500; }
  p { position: absolute; left: 76px; top: 480px; margin: 0; width: 640px; font-size: 30px; line-height: 1.3; color: #584236; }
  .button { position: absolute; right: 200px; top: 220px; width: 190px; height: 190px; border-radius: 58px; background: #ff7a1a; box-shadow: 0 30px 60px rgba(94, 39, 0, 0.35); display: flex; align-items: center; justify-content: center; }
  .count { position: absolute; right: -12px; top: -12px; min-width: 64px; height: 64px; border-radius: 32px; background: #3b2d26; color: #ffede5; font-size: 32px; font-weight: 750; line-height: 64px; text-align: center; }
</style>
</head>
<body>
  <svg class="cookie" viewBox="0 0 100 100" aria-hidden="true"><path fill="#ff7a1a" opacity="0.9" d="M50 0 C57 0 60 6 66 8 S80 6 85 12 S88 26 93 31 S100 42 100 50 S94 60 92 66 S94 80 88 85 S74 88 69 93 S58 100 50 100 S40 94 34 92 S20 94 15 88 S12 74 7 69 S0 58 0 50 S6 40 8 34 S6 20 12 15 S26 12 31 7 S42 0 50 0 Z"/></svg>
  <div class="pill"></div>
  <div class="logo">
    <span class="badge"><svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="7.5"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3"/><circle cx="12" cy="12" r="2" fill="#fff" stroke="none"/></svg></span>
    ActionCut
  </div>
  <h1>Tap. Tag.<br><span>Done.</span></h1>
  <p>Mark the best moments while you film. Clips are cut on your phone.</p>
  <div class="button">
    <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="7.5"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3"/><circle cx="12" cy="12" r="2" fill="#fff" stroke="none"/></svg>
    <span class="count">7</span>
  </div>
</body>
</html>
```

- [ ] **Step 2: Render it to PNG**

Start a static server in the background: `python3 -m http.server 3211 --directory scripts`.
With the Playwright MCP tools: `browser_resize` 1200×630, `browser_navigate` `http://localhost:3211/og-card.html`, wait for fonts (`browser_wait_for` 1 s), `browser_take_screenshot` with `filename` = `og-card.png` (viewport, not full page). The tool prints where it saved the file; move it to `static/img/og-card.png`. Stop the server.

Run: `file static/img/og-card.png`
Expected: `PNG image data, 1200 x 630`.

In `docusaurus.config.ts` add `image: 'img/og-card.png',` as the first key of `themeConfig`.

- [ ] **Step 3: Rewrite `CLAUDE.md`**

```markdown
# CLAUDE.md

Guidance for Claude Code in this repository: the marketing site for ActionCut (actioncut.io).

## Stack

Docusaurus 3.8.1 (TypeScript, React 19) at the **repository root** — there is no `my-website/` folder. Animations: `motion` 12 (`motion/react`). Tests: vitest. Package manager: npm.

## Commands

- `npm start` — dev server
- `npm test` — vitest (pure logic in `src/lib/*.test.ts`)
- `npm run typecheck` — TypeScript
- `npm run build` — static site in `build/` (fails on broken links)
- `npm run serve` — serve the build

## Layout

- `src/pages/index.tsx` — landing page, composed of `src/components/landing/*` (one file per section)
- `src/data/*` — all landing copy, tags, changelog, site constants (`site.ts`: APK path, contact, store links)
- `src/lib/*` — pure logic with tests: demo gesture rules, hero loop, changelog, shapes
- `src/components/phone/*` — phone frame and HTML recreations of the app screens; sizes in `calc(var(--u) * N)`, 1 `--u` = 1 px of a 390-px screen
- `src/components/ui/*`, `src/components/brand/*` — buttons, chips, sections, reveal, icons, logo, M3 shapes
- `guide/*.mdx` — the Guide, served at `/guide`; `<Screen>` works in MDX without import
- `src/pages/changelog.tsx`, `src/pages/privacy.mdx` — Changelog and Privacy Policy
- `src/theme/` — `Root` (MotionConfig), `Footer`, `MDXComponents`
- `docs/superpowers/` — internal specs and plans (not published)

## Rules

- Design tokens live in `src/css/custom.css` (`--ac-*`, the Android app's light scheme). Light theme only.
- Copy is English and must match what the Android app does (`/Volumes/devssd/dev/actioncut-app`). No merging clips into one video, no "zero data collection".
- The APK link is a plain `<a href="/actioncut-latest.apk" download>`, never `<Link>`.
- No `Date.now()`/`window` during render; respect reduced motion (see the spec).
- Spec: `docs/superpowers/specs/2026-10-07-site-redesign-design.md`.

## Releasing a new app version

1. Replace `static/actioncut-latest.apk`.
2. Add the release at the top of `src/data/changelog.ts` (`npm test` checks the order).

## Screenshots

Put PNGs (up to 1080 px wide) in `static/img/screens/` and pass `src="/img/screens/<file>.png"` to the matching `<Screen>` in `guide/*.mdx`, or set `screen.src` in `src/data/useCases.ts`. The list of expected files is in README.md.
```

- [ ] **Step 4: Rewrite `README.md`**

```markdown
# actioncut.io

Marketing site for ActionCut — mark the best moments of a game while you film, get a clip of each one. Built with Docusaurus 3.

```bash
npm install
npm start          # dev server
npm test           # unit tests
npm run build      # static site in build/
```

## Screenshots to add

Put these in `static/img/screens/` and set `src` on the matching `<Screen>`:

| File | Where | Shows |
|---|---|---|
| `home-new-event.png` | guide/first-event | Home with the New event button |
| `camera-button.png` | guide/first-event | Camera app with the floating button |
| `live-bar.png` | guide/first-event | Home with "Event in progress" |
| `quick-tags.png` | guide/floating-button | Quick tags beside the button |
| `settings-button.png` | guide/floating-button | Settings → Floating button |
| `event.png` | guide/reviewing-moments, use case "Match day" | Event screen grid |
| `moment.png` | guide/reviewing-moments, use case "Practice" | Moment screen |
| `moment-versions.png` | use case "Two phones" | Moment with Version 1 of 2 |
| `home-live.png` | use case "Tournament day" | Home with a live event |
| `clip-length.png` | guide/clip-length | Clip length sheet |
| `edit-clip.png` | guide/clip-length | Edit clip |
| `tags-settings.png` | guide/tags-and-favorites | Tags settings |
| `favorites.png` | guide/tags-and-favorites, use case "Season highlights" | Favorites with a tag filter |
| `sources.png` | guide/other-cameras | Sources |

## Before publishing

- Set `contactEmail` and `publisher` in `src/data/site.ts`.
- Replace `static/actioncut-latest.apk` with the current build (the changelog says 1.5.41).
- Have the Privacy Policy reviewed.
```

- [ ] **Step 5: Final verification**

Run: `npm test && npm run typecheck && npm run build`
Expected: all tests pass, no type errors, build succeeds.

Browser check procedure, every page at 1440×900, 390×844 and 360×740: `/`, `/guide`, `/guide/first-event`, `/guide/other-cameras`, `/guide/iphone`, `/changelog`, `/privacy`:
- `scrollWidth − clientWidth === 0` everywhere.
- No console errors anywhere.
- The `<head>` of `/` has `og:image` → `browser_evaluate` `() => document.querySelector('meta[property="og:image"]').content` ends with `/img/og-card.png`.
- The favicon is the orange crosshair badge.
- Reduced motion on `/`: all content visible.

Save the 1440 and 390 screenshots of `/` for the hand-off.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "docs: social card, CLAUDE.md and README for the new site

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

