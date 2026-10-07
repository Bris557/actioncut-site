# actioncut.io

Marketing site for ActionCut — mark the best moments of a game while you film, get a clip of each one. Built with Docusaurus 3.

```bash
npm install
npm start          # dev server
npm test           # unit tests
npm run build      # static site in build/
```

## Screenshots

Real app screenshots live in `static/img/screens/` as WebP, 720 px wide (`name.webp` is the light theme, `name-dark.webp` the dark one). Convert a phone screenshot with:

```bash
magick Screenshot.jpg -resize 720x -strip -quality 80 -define webp:method=6 static/img/screens/<name>.webp
```

- **Landing:** How it works (`src/components/landing/HowItWorks.tsx`), use cases (`screen.src` in `src/data/useCases.ts`) and the light/dark gallery (`src/data/gallery.ts` — every entry needs both files).
- **Guide:** `src="/img/screens/<name>.webp"` on a `<Screen>` in `guide/*.mdx`.
- **Camera app:** the camera can’t be screenshotted while recording, so it is drawn (`src/components/phone/CameraOverlayMock.tsx`, after a real camera screenshot) over real frames from a game in `static/img/camera/`. In MDX: `<Screen fallback={<CameraStill step="button" />} />` (or `step="tags"`).

`npm test` checks that every referenced screenshot exists and that no `<Screen>` in the guide is left as a placeholder.

Still missing: a moment with two versions (*Version 1 of 2*) for the “Two phones” use case — until then it shows a drawn screen.

## Before publishing

- Set `publisher` in `src/data/site.ts` (optional; shown in the Privacy Policy).
- Have the Privacy Policy reviewed.
