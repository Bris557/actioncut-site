import {describe, expect, it} from 'vitest';
import {polarPath} from './shapes';

describe('polarPath', () => {
  it('starts at the top centre and closes the path', () => {
    const d = polarPath(9, 0.06);
    expect(d.startsWith('M50.0 0.0')).toBe(true);
    expect(d.endsWith('Z')).toBe(true);
  });

  it('has one point per step', () => {
    const d = polarPath(4, 0.2, 60);
    expect(d.split('L')).toHaveLength(60);
  });

  it('keeps every point inside the 100×100 box', () => {
    const numbers = polarPath(12, 0.045).replace(/[MLZ]/g, ' ').trim().split(/\s+/).map(Number);
    expect(numbers.every((n) => n >= 0 && n <= 100)).toBe(true);
  });
});
