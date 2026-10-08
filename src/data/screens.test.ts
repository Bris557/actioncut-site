import {createHash} from 'node:crypto';
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import {CAMERA_PHOTOS} from './camera';
import {CLIP_TILES} from './clips';
import {gallery} from './gallery';
import {CLIPS_PER_VISIT, HERO_CLIPS} from './heroClips';
import {useCases} from './useCases';

const root = process.cwd();
/** A URL under static/ with its `?v=` cache-busting version dropped. */
const filePath = (url: string) => join(root, 'static', url.split('?')[0]);
const inStatic = (p: string) => existsSync(filePath(p));
const md5 = (url: string) => createHash('md5').update(readFileSync(filePath(url))).digest('hex');

/** Duration in seconds from an MP4's movie header (mvhd box). */
function mp4Seconds(path: string): number {
  const buf = readFileSync(path);
  const at = buf.indexOf('mvhd');
  const version = buf[at + 4];
  const timescale = buf.readUInt32BE(at + (version === 1 ? 24 : 16));
  const duration = version === 1 ? Number(buf.readBigUInt64BE(at + 28)) : buf.readUInt32BE(at + 20);
  return duration / timescale;
}

function guideSources(): string[] {
  const dir = join(root, 'guide');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => readFileSync(join(dir, f), 'utf8'))
    .join('\n')
    .split('<Screen')
    .slice(1)
    .map((tag) => tag.slice(0, tag.indexOf('/>')));
}

describe('screenshots', () => {
  it('every gallery screen has a light and a dark file', () => {
    expect(gallery.length).toBeGreaterThan(0);
    for (const shot of gallery) {
      expect(inStatic(shot.light), shot.light).toBe(true);
      expect(inStatic(shot.dark), shot.dark).toBe(true);
    }
  });

  it('every use-case screenshot exists', () => {
    for (const uc of useCases) {
      if (uc.screen.src) expect(inStatic(uc.screen.src), uc.screen.src).toBe(true);
    }
  });

  it('every clip tile exists', () => {
    expect(CLIP_TILES).toHaveLength(5);
    for (const tile of CLIP_TILES) expect(inStatic(tile.src), tile.src).toBe(true);
  });

  it('every hero clip has its video and poster', () => {
    expect(HERO_CLIPS.length).toBeGreaterThanOrEqual(3);
    for (const clip of HERO_CLIPS) {
      expect(inStatic(clip.src), clip.src).toBe(true);
      expect(inStatic(clip.poster), clip.poster).toBe(true);
    }
  });

  it('every hero clip taps at its play: 6 s in, after trimming the run-up', () => {
    expect(HERO_CLIPS.map((clip) => [clip.src.split('?')[0], clip.markAt])).toEqual([
      ['/video/game-1.mp4', 6],
      ['/video/game-2.mp4', 6],
      ['/video/game-3.mp4', 4],
      ['/video/game-4.mp4', 6],
      ['/video/game-5.mp4', 6],
      ['/video/game-6.mp4', 6],
      ['/video/game-7.mp4', 6],
      ['/video/game-8.mp4', 6],
      ['/video/game-9.mp4', 6],
    ]);
  });

  it('every hero clip and poster URL carries its file’s version, so caches pick up a re-cut', () => {
    for (const clip of HERO_CLIPS) {
      for (const url of [clip.src, clip.poster]) expect(url).toBe(`${url.split('?')[0]}?v=${md5(url).slice(0, 8)}`);
    }
  });

  it('every hero clip is at most 10 s and ends within 4 s after its play', () => {
    for (const clip of HERO_CLIPS) {
      const seconds = mp4Seconds(filePath(clip.src));
      expect(seconds, clip.src).toBeLessThanOrEqual(10.05);
      expect(seconds - clip.markAt, clip.src).toBeLessThanOrEqual(4.05);
    }
  });

  it('each visit loops four different clips', () => {
    expect(CLIPS_PER_VISIT).toBe(4);
    expect(HERO_CLIPS.length).toBeGreaterThan(CLIPS_PER_VISIT);
  });

  it('every camera photo exists', () => {
    for (const photo of Object.values(CAMERA_PHOTOS)) expect(inStatic(photo), photo).toBe(true);
  });

  it('every camera photo is used exactly once across the site', () => {
    const files = [
      ...readdirSync(join(root, 'src'), {recursive: true, encoding: 'utf8'})
        .filter((f) => f.endsWith('.tsx'))
        .map((f) => join(root, 'src', f)),
      ...readdirSync(join(root, 'guide'))
        .filter((f) => f.endsWith('.mdx'))
        .map((f) => join(root, 'guide', f)),
    ];
    const uses = files.flatMap((f) =>
      [...readFileSync(f, 'utf8').matchAll(/CAMERA_PHOTOS\.(\w+)|\bframe="(\w+)"/g)].map((m) => m[1] ?? m[2]),
    );
    expect([...uses].sort()).toEqual(Object.keys(CAMERA_PHOTOS).sort());
  });

  it('every guide screen shows a real screenshot or a drawn screen', () => {
    const tags = guideSources();
    expect(tags.length).toBeGreaterThan(0);
    for (const tag of tags) {
      const src = /src="([^"]+)"/.exec(tag)?.[1];
      if (src) expect(inStatic(src), src).toBe(true);
      else expect(tag, 'a <Screen> with neither src nor fallback').toContain('fallback=');
    }
  });
});
