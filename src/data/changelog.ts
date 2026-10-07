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
