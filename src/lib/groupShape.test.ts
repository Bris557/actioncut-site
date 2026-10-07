import {describe, expect, it} from 'vitest';
import {groupRadius} from './groupShape';

const OUT = 'calc(var(--u) * 20)';
const IN = 'calc(var(--u) * 6)';

describe('groupRadius (app GroupShapes: 20 outside, 6 between)', () => {
  it('rounds a single item on all corners', () => {
    expect(groupRadius(0, 1)).toBe(OUT);
  });

  it('rounds the top of the first and the bottom of the last item', () => {
    expect(groupRadius(0, 3)).toBe(`${OUT} ${OUT} ${IN} ${IN}`);
    expect(groupRadius(2, 3)).toBe(`${IN} ${IN} ${OUT} ${OUT}`);
  });

  it('keeps middle items tight', () => {
    expect(groupRadius(1, 3)).toBe(IN);
  });
});
