export type GalleryShot = {
  id: string;
  label: string;
  /** Paths under static/: the same screen in the app's light and dark themes. */
  light: string;
  dark: string;
};

const shot = (id: string, label: string, file: string): GalleryShot => ({
  id,
  label,
  light: `/img/screens/${file}.webp`,
  dark: `/img/screens/${file}-dark.webp`,
});

export const gallery: GalleryShot[] = [
  shot('live', 'An event in progress', 'home-live'),
  shot('event', 'Every moment of the game', 'event'),
  shot('filter', 'Filtered by tag', 'event-tag'),
  shot('moment', 'One moment, one clip', 'moment'),
  shot('tags', 'Tags for a moment', 'tags-sheet'),
  shot('custom', 'A custom clip', 'edit-clip'),
  shot('video', 'Marking moments in a video', 'video-moments'),
  shot('save', 'Saving to the gallery', 'save-clips'),
  shot('button', 'Your button, your way', 'settings-button'),
];
