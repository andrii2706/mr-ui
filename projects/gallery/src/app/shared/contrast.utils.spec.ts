import { describe, expect, it } from 'vitest';
import { CONTRAST_PAIRS } from './gallery.constants';
import { contrast } from './contrast.utils';

describe('contrast', () => {
  it('black on white is 21 : 1, a colour on itself 1 : 1', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrast('#8a4b1c', '#8a4b1c')).toBe(1);
  });

  it('every pair of the theme passes WCAG 2.2 AA', () => {
    for (const p of CONTRAST_PAIRS)
      expect(contrast(p.fg, p.bg), p.name).toBeGreaterThanOrEqual(p.need);
  });
});
