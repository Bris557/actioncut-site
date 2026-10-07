import {describe, expect, it} from 'vitest';
import {mailtoLink} from './mailto';

describe('mailtoLink', () => {
  it('encodes the subject and a multi-line body', () => {
    expect(mailtoLink('a@b.co', 'ActionCut beta', 'Hi!\nPhone model:')).toBe(
      'mailto:a@b.co?subject=ActionCut%20beta&body=Hi!%0APhone%20model%3A',
    );
  });

  it('keeps curly apostrophes and ampersands safe', () => {
    expect(mailtoLink('a@b.co', 'Q&A', 'I’d like')).toBe('mailto:a@b.co?subject=Q%26A&body=I%E2%80%99d%20like');
  });
});
