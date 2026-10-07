/**
 * Real frames from games, shown as the camera viewfinder under the drawn ActionCut overlay.
 * Each one is used in exactly one place, so no two phones on the site show the same shot.
 */
export const CAMERA_PHOTOS = {
  shot: '/img/camera/shot.webp',
  wide: '/img/camera/wide.webp',
  celebration: '/img/camera/celebration.webp',
  scrum: '/img/camera/scrum.webp',
  zone: '/img/camera/zone.webp',
} as const;

export type CameraFrame = keyof typeof CAMERA_PHOTOS;
