import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import clsx from 'clsx';
import {useEffect, useRef} from 'react';
import type {HeroClip} from '@site/src/lib/heroVideo';
import styles from './ViewfinderVideos.module.css';

type Props = {
  clips: HeroClip[];
  active: number;
  /** False while the phone is off screen: the active clip pauses. */
  playing: boolean;
  onTime: (seconds: number, duration: number) => void;
  onEnded: () => void;
  /** Autoplay was refused (e.g. battery saver): the caller falls back to the photo. */
  onFail: () => void;
};

/** Game clips stacked in the camera viewfinder; the active one plays, the next one preloads. */
export default function ViewfinderVideos({clips, active, playing, onTime, onEnded, onFail}: Props) {
  const {withBaseUrl} = useBaseUrlUtils();
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  // A new clip starts from its beginning, and the one after it starts loading.
  useEffect(() => {
    const video = videos.current[active];
    if (video) video.currentTime = 0;
    const next = videos.current[(active + 1) % clips.length];
    if (next && next !== video) next.preload = 'auto';
  }, [active, clips.length]);

  useEffect(() => {
    const video = videos.current[active];
    if (!video) return;
    if (!playing) {
      video.pause();
      return;
    }
    video.play().catch((e: unknown) => {
      // An AbortError only means a pause came first; refused or unplayable is a real failure.
      if (e instanceof DOMException && e.name === 'AbortError') return;
      onFail();
    });
  }, [active, playing, onFail]);

  return (
    <>
      {clips.map((clip, i) => (
        <video
          key={clip.src}
          ref={(el) => {
            videos.current[i] = el;
          }}
          className={clsx(styles.video, i === active && styles.on)}
          src={withBaseUrl(clip.src)}
          poster={withBaseUrl(clip.poster)}
          muted
          playsInline
          disablePictureInPicture
          preload={i === active ? 'auto' : 'none'}
          aria-hidden="true"
          onTimeUpdate={i === active ? (e) => onTime(e.currentTarget.currentTime, e.currentTarget.duration) : undefined}
          onEnded={i === active ? onEnded : undefined}
          onError={onFail}
        />
      ))}
    </>
  );
}
