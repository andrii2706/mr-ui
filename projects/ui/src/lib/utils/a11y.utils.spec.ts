import { describe, expect, it } from 'vitest';
import { A11Y_DEFAULTS } from '../constants/a11y.constants';
import { a11yAttributes, a11yChanged, parseA11y } from './a11y.utils';

describe('a11y.utils', () => {
  it('falls back to the defaults on nothing, broken JSON or a foreign shape', () => {
    expect(parseA11y(null)).toEqual(A11Y_DEFAULTS);
    expect(parseA11y('{oops')).toEqual(A11Y_DEFAULTS);
    expect(parseA11y('"text"')).toEqual(A11Y_DEFAULTS);
    expect(parseA11y('{"text":"huge","contrast":"yes"}')).toEqual(A11Y_DEFAULTS);
  });

  it('keeps what is known', () => {
    expect(parseA11y('{"text":"xl","contrast":true,"focus":true,"extra":1}')).toEqual({
      ...A11Y_DEFAULTS,
      text: 'xl',
      contrast: true,
      focus: true,
    });
  });

  it('sets only the attributes that differ from the default', () => {
    expect(a11yAttributes(A11Y_DEFAULTS)).toEqual({
      'data-a11y-text': null,
      'data-a11y-contrast': null,
      'data-a11y-motion': null,
      'data-a11y-links': null,
      'data-a11y-spacing': null,
      'data-a11y-focus': null,
    });
    const on = a11yAttributes({
      text: 'lg',
      contrast: true,
      motion: true,
      links: true,
      spacing: true,
      focus: true,
    });
    expect(on).toEqual({
      'data-a11y-text': 'lg',
      'data-a11y-contrast': 'high',
      'data-a11y-motion': 'reduce',
      'data-a11y-links': 'underline',
      'data-a11y-spacing': 'wide',
      'data-a11y-focus': 'strong',
    });
  });

  it('counts the changed settings', () => {
    expect(a11yChanged(A11Y_DEFAULTS)).toBe(0);
    expect(a11yChanged({ ...A11Y_DEFAULTS, text: 'lg', links: true })).toBe(2);
  });
});
