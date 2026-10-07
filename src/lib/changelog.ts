import type {Release} from '../data/changelog';

const DAY = new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC'});
const MONTH = new Intl.DateTimeFormat('en-US', {month: 'long', year: 'numeric', timeZone: 'UTC'});

function toDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function formatReleaseDate(iso: string): string {
  return DAY.format(toDate(iso));
}

export type ReleaseMonth = {label: string; releases: Release[]};

export function groupByMonth(list: Release[]): ReleaseMonth[] {
  const groups: ReleaseMonth[] = [];
  for (const release of list) {
    const label = MONTH.format(toDate(release.date));
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.releases.push(release);
    else groups.push({label, releases: [release]});
  }
  return groups;
}

export function isNewestFirst(list: Release[]): boolean {
  return list.every((release, i) => i === 0 || list[i - 1].date >= release.date);
}
