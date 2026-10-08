# ActionCut app screenshots

Original screenshots from the Android app (ActionCut 1.5.41, October 2026), the source for the images on the site. Not published: the site uses compressed WebP copies in `static/img/`.

The number is the capture order. The tables show which site image each screenshot became.

## Light theme (`light/`)

| File | Screen | On the site |
|---|---|---|
| 28-home | Home, Events tab | `screens/home.webp` |
| 29-event | Event screen, moment grid | `screens/event.webp` |
| 30-event-filter-goal-funny | Event filtered by Goal and Funny | `screens/event-filter.webp` |
| 31-event-filter-assist | Event filtered by Assist | `screens/event-tag.webp` |
| 32-save-clips-dialog | "Save 3 clips?" | `screens/save-clips.webp` |
| 33-sources | Sources: the event's videos | `screens/sources.webp` |
| 34-video-moments | A video with its moments, + Instant / Interval | `screens/video-moments.webp` |
| 35-moment-1 | Moment screen | `screens/moment.webp` |
| 36-moment-2 | Moment screen, another frame | — |
| 37-moment-tags-sheet | Tags sheet for a moment | `screens/tags-sheet.webp` |
| 38-how-it-works-sheet | "How it works" help sheet | — |
| 39-settings-button | Settings: theme and floating button | `screens/settings-button.webp` |
| 40-settings-tags-and-data | Settings: tags, event start, event data | `screens/settings-data.webp` |
| 41-favorites-save-dialog | Favorites with "Save 6 clips?" | `screens/favorites-save.webp` |
| 42-custom-clip | Custom clip (Edit clip) | `screens/edit-clip.webp` |
| 43-home-2 | Home, Events tab (later shot) | — |
| 44-home-live | Home with a live event and the floating button | `screens/home-live.webp` |
| 45-home-new-live-event | Home right after starting a new event | `screens/live-bar.webp` |
| 46-clip-length-instant | Clip length, Instant tab (editing locked) | — |
| 47-clip-length-interval | Clip length, Interval tab | `screens/clip-length-interval.webp` |

## Dark theme (`dark/`)

| File | Screen | On the site |
|---|---|---|
| 01-home | Home, Events tab | — |
| 02-favorites | Favorites, grouped by month and event | `screens/favorites-dark.webp` |
| 03-event-live | Event screen while the event is live | — |
| 04-home-live | Home with a live event | `screens/home-live-dark.webp` |
| 05-event | Event screen, moment grid | `screens/event-dark.webp` |
| 06-event-filter-save-assist | Event filtered by Save and Assist | — |
| 07-event-filter-goal | Event filtered by Goal | — |
| 08-event-filter-assist | Event filtered by Assist | `screens/event-tag-dark.webp` |
| 09-save-clips-dialog | "Save 3 clips?" | `screens/save-clips-dark.webp` |
| 10-moment-add-tag | Moment without tags | — |
| 11-moment-1, 12-moment-2, 13-moment-3 | Moment screen, three frames of one clip | 12 → `screens/moment-dark.webp` |
| 14-moment-funny | Moment tagged Funny | — |
| 15-favorites-filtered | Favorites filtered by Goal | — |
| 16-how-it-works-sheet | "How it works" help sheet | — |
| 17-settings-button | Settings: theme and floating button | `screens/settings-button-dark.webp` |
| 18-settings-tags-and-data | Settings: tags, event start, event data | — |
| 19-custom-clip | Custom clip (Edit clip) | `screens/edit-clip-dark.webp` |
| 20-moment-tags-sheet-1, 21-moment-tags-sheet-2 | Tags sheet for a moment | 20 → `screens/tags-sheet-dark.webp` |
| 22-tags-settings | Tags: quick access and all tags | `screens/tags-settings-dark.webp` |
| 23-clip-info | Clip info sheet | — |
| 24-sources-import-video | Sources with the Import video sheet | `screens/import-video-dark.webp` |
| 25-video-marking-interval | Marking an interval in a video | — |
| 26-video-moments | A video with its moments | `screens/video-moments-dark.webp` |
| 27-about-sources-sheet | "About sources" help sheet | — |

## Camera app (`camera/`)

The phone's camera with ActionCut's floating button. The camera can't be screenshotted while recording, so the site draws it from these two (`src/components/phone/CameraOverlayMock.tsx`).

| File | Shows |
|---|---|
| camera-with-button | Camera in video mode with the floating button and its count |
| camera-with-quick-tags | The same, with the quick tags Goal, Save, Assist beside the button |

## Game frames (`camera-frames/`)

Full-screen frames from game videos, used in the drawn camera's viewfinder (cropped to 9:16).

| File | On the site |
|---|---|
| 48-rink-wide, 49-rink-close | First versions, no longer used |
| 50-shot-on-goal | `camera/shot.webp`, hero |
| 51-wide | `camera/wide.webp`, How it works → Film as usual |
| 52-celebration | `camera/celebration.webp`, How it works → Tap at great plays |
| 53-from-the-stands | `story/stands.webp`, "Made by sports parents" |
| 54-attack-zone | `camera/zone.webp`, Guide → quick tags (lower left, without the banner) |
| 55-scrum | `camera/scrum.webp`, Guide → floating button over the camera |

## Event tiles (`event-tiles/`)

Two strips of moment tiles from an event's grid; five tiles became `static/img/clips/*.webp` in the "5 moments → 5 clips" block.
