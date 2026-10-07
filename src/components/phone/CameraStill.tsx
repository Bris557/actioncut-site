import {CAMERA_PHOTOS} from '@site/src/data/camera';
import {QUICK_TAGS} from '@site/src/data/tags';
import CameraOverlayMock from './CameraOverlayMock';

export type CameraStep = 'button' | 'tags';

/** A real frame from a game with the ActionCut overlay drawn over the camera app. */
export default function CameraStill({step}: {step: CameraStep}) {
  if (step === 'button') return <CameraOverlayMock count={0} recTime="00:12" photo={CAMERA_PHOTOS.wide} />;
  return (
    <CameraOverlayMock
      count={3}
      recTime="23:41"
      photo={CAMERA_PHOTOS.close}
      hot
      chipsVisible
      countdown={0.6}
      chips={QUICK_TAGS.map((t) => ({...t, on: t.name === 'Goal'}))}
    />
  );
}
