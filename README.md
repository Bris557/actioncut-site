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
- **Camera app:** the camera can’t be screenshotted while recording, so it is drawn (`src/components/phone/CameraOverlayMock.tsx`, after a real camera screenshot) over real frames from a game in `static/img/camera/`. In MDX: `<Screen fallback={<CameraStill step="button" frame="scrum" />} />` (or `step="tags"`); `frame` is a key of `CAMERA_PHOTOS` in `src/data/camera.ts`, and each frame is used only once.

**Hero videos:** real ActionCut clips in `static/video/` (`game-N.mp4` + its first frame `game-N.webp`), listed in `src/data/heroClips.ts` with a `?v=` version per file (MD5, checked by `npm test`) so Cloudflare serves a re-cut at once. Each clip keeps 6 s before its play and at most 4 s after; each visit plays four at random in a loop, and the button taps at each clip's `markAt` second. Prepare a clip with:

```bash
ffmpeg -ss <play−6> -t <10> -i clip.mp4 -an -vf "scale=540:960:flags=lanczos,fps=30" -c:v libx264 -preset slow -crf 26 -profile:v high -pix_fmt yuv420p -movflags +faststart static/video/game-N.mp4
ffmpeg -i static/video/game-N.mp4 -frames:v 1 frame.png && magick frame.png -quality 78 static/video/game-N.webp
```

`npm test` checks that every referenced screenshot exists and that no `<Screen>` in the guide is left as a placeholder.

Still missing: a moment with two versions (*Version 1 of 2*) for the “Two phones” use case — until then it shows a drawn screen.

## Beta and feedback form

The form in the Beta section posts to Formspree (project 3107957750802415056, form `beta`); submissions are emailed to the contact address and kept in the Formspree dashboard. Fields and actions are in `formspree.json`. To change them:

```bash
cp .env.example .env   # then set FORMSPREE_DEPLOY_KEY (Formspree → project → Settings)
npx @formspree/cli deploy
```

## Before publishing

- Set `publisher` in `src/data/site.ts` (optional; shown in the Privacy Policy).
- Have the Privacy Policy reviewed.
