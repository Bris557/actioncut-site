import {CAMERA_PHOTOS, type CameraFrame} from '@site/src/data/camera';
import {QUICK_TAGS} from '@site/src/data/tags';
import CameraOverlayMock from './CameraOverlayMock';

export type CameraStep = 'button' | 'tags';

type Props = {
  step: CameraStep;
  /** Which game frame fills the viewfinder; each frame is used once on the site. */
  frame: CameraFrame;
};

/** A real frame from a game with the ActionCut overlay drawn over the camera app. */
export default function CameraStill({step, frame}: Props) {
  const photo = CAMERA_PHOTOS[frame];
  if (step === 'button') return <CameraOverlayMock count={0} recTime="00:12" photo={photo} />;
  return (
    <CameraOverlayMock
      count={3}
      recTime="23:41"
      photo={photo}
      hot
      chipsVisible
      countdown={0.6}
      chips={QUICK_TAGS.map((t) => ({...t, on: t.name === 'Goal'}))}
    />
  );
}
