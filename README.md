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
