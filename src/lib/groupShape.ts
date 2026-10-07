const OUTER = 'calc(var(--u) * 20)';
const INNER = 'calc(var(--u) * 6)';

/** Corner radii of an item in a grouped list, as the app's GroupShapes. */
export function groupRadius(index: number, count: number): string {
  if (count <= 1) return OUTER;
  if (index === 0) return `${OUTER} ${OUTER} ${INNER} ${INNER}`;
  if (index === count - 1) return `${INNER} ${INNER} ${OUTER} ${OUTER}`;
  return INNER;
}
