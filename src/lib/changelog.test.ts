import {describe, expect, it} from 'vitest';
import {releases, type Release} from '../data/changelog';
import {formatReleaseDate, groupByMonth, isNewestFirst} from './changelog';

const r = (version: string, date: string): Release => ({version, date, title: version, highlights: ['x']});

describe('formatReleaseDate', () => {
  it('formats ISO dates in US English, independent of the time zone', () => {
    expect(formatReleaseDate('2026-10-06')).toBe('October 6, 2026');
    expect(formatReleaseDate('2025-07-23')).toBe('July 23, 2025');
  });
});

describe('groupByMonth', () => {
  it('groups consecutive releases of the same month', () => {
    const groups = groupByMonth([r('3', '2026-10-06'), r('2', '2026-10-04'), r('1', '2026-06-10')]);
    expect(groups.map((g) => g.label)).toEqual(['October 2026', 'June 2026']);
    expect(groups[0].releases.map((x) => x.version)).toEqual(['3', '2']);
  });

  it('returns nothing for no releases', () => {
    expect(groupByMonth([])).toEqual([]);
  });
});

describe('the changelog data', () => {
  it('is sorted newest first', () => {
    expect(isNewestFirst(releases)).toBe(true);
    expect(isNewestFirst([r('1', '2026-01-01'), r('2', '2026-02-01')])).toBe(false);
  });

  it('has unique versions, valid dates and at least one highlight each', () => {
    expect(new Set(releases.map((x) => x.version)).size).toBe(releases.length);
    for (const x of releases) {
      expect(x.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(new Date(`${x.date}T00:00:00Z`).getTime())).toBe(false);
      expect(x.highlights.length).toBeGreaterThan(0);
    }
  });
});
