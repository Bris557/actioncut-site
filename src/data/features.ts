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
