import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import {CAMERA_PHOTOS} from './camera';
import {gallery} from './gallery';
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

  it('every camera photo exists', () => {
    for (const photo of Object.values(CAMERA_PHOTOS)) expect(inStatic(photo), photo).toBe(true);
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
