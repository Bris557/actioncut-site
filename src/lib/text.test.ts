import {describe, expect, it} from 'vitest';
import {containsCyrillic} from './text';

describe('containsCyrillic', () => {
  it('detects Cyrillic letters anywhere in the string', () => {
    expect(containsCyrillic('Полуфинал против Львов')).toBe(true);
    expect(containsCyrillic('Game 2 — Ёлка')).toBe(true);
  });

  it('is false for Latin text', () => {
    expect(containsCyrillic('Semi-final vs Lions')).toBe(false);
  });
});
