const CYRILLIC = /[Ѐ-ӿ]/;

/** Mirrors the app's UserText rule: Cyrillic user text renders in Onest. */
export function containsCyrillic(text: string): boolean {
  return CYRILLIC.test(text);
}
