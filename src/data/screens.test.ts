import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import {CAMERA_PHOTOS} from './camera';
import {CLIP_TILES} from './clips';
import {gallery} from './gallery';
import {HERO_CLIPS} from './heroClips';
import {useCases} from './useCases';

const root = process.cwd();
const inStatic = (p: string) => existsSync(join(root, 'static', p));

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
