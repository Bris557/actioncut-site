/**
 * Closed SVG path (viewBox 0 0 100 100) of a rounded shape with `lobes` bumps:
 * the Material 3 Expressive "cookie" and "clover" family.
 * Rounded to one decimal so server and browser produce the same string.
 */
export function polarPath(lobes: number, amplitude: number, steps = 240): string {
  const points: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const r = 50 * (1 - amplitude + amplitude * Math.cos(lobes * t));
    points.push(`${(50 + r * Math.sin(t)).toFixed(1)} ${(50 - r * Math.cos(t)).toFixed(1)}`);
  }
  return `M${points.join('L')}Z`;
}
