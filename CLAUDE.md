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
- `src/components/phone/*` — phone frame, `Shot` (a screenshot inside it), the drawn camera app with ActionCut's overlay, the drawn moment with versions; sizes in `calc(var(--u) * N)`, 1 `--u` = 1 px of a 390-px screen
- `src/components/ui/*`, `src/components/brand/*` — buttons, chips, sections, reveal, icons, logo, M3 shapes
- `guide/*.mdx` — the Guide, served at `/guide`; `<Screen>` works in MDX without import
- `src/pages/changelog.tsx`, `src/pages/privacy.mdx` — Changelog and Privacy Policy
- `src/theme/` — `Root` (MotionConfig), `Footer`, `MDXComponents`
- `docs/superpowers/` — internal specs and plans (not published)

## Rules

- Design tokens live in `src/css/custom.css` (`--ac-*`, the Android app's light scheme). Light theme only.
- Copy is English and must match what the Android app does (`/Volumes/devssd/dev/actioncut-app`). No merging clips into one video, no "zero data collection".
- The site has no public APK link: CTAs lead to the beta section (`/#beta`, a mailto to `site.contactEmail`). Testers get the direct link `/actioncut-latest.apk` by email.
- No `Date.now()`/`window` during render; respect reduced motion (see the spec).
- CSS is minified by `orderSafeCssMinifier` in `docusaurus.config.ts` (cssnano without `mergeRules`). Docusaurus' default merged rules across modules and moved one-class modifiers above their base in production only (invisible hero videos, faded How it works steps). Keep it, and still write a modifier that overrides its base as a two-class selector (`.video.on`).
- Spec: `docs/superpowers/specs/2026-10-07-site-redesign-design.md`.

## Releasing a new app version

1. Replace `static/actioncut-latest.apk`.
2. Add the release at the top of `src/data/changelog.ts` (`npm test` checks the order).

## Screenshots

Real screenshots are WebP, 720 px wide, in `static/img/screens/` (`<name>.webp` light, `<name>-dark.webp` dark). Pass `src="/img/screens/<name>.webp"` to a `<Screen>` in `guide/*.mdx`, set `screen.src` in `src/data/useCases.ts`, or add a light/dark pair to `src/data/gallery.ts`. The camera app is drawn (`CameraOverlayMock`, `CameraStill`) over real frames in `static/img/camera/`. `npm test` fails on a missing file or a guide `<Screen>` without `src`/`fallback`. The hero phone loops three random game clips from `src/data/heroClips.ts` (`static/video/`, 540 × 960 H.264, no sound) — picked after hydration, paused off screen, skipped under reduced motion. Details and the conversion commands are in README.md.
