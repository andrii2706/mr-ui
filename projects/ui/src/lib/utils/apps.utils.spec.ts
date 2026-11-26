import { describe, expect, it } from 'vitest';
import { uiLeavesPage, uiLeavingText, uiOpenModules, uiSwitcherLinks } from './apps.utils';

describe('apps.utils', () => {
  it('перемикач: портал і відкриті модулі, крім поточного', () => {
    expect(uiSwitcherLinks('oblik', ['oblik', 'kadry', 'projects']).map((a) => a.id)).toEqual([
      'portal',
      'kadry',
      'projects',
    ]);
    expect(uiSwitcherLinks('kadry', []).map((a) => a.id)).toEqual(['portal']);
    expect(uiSwitcherLinks('portal', ['projects']).map((a) => a.href)).toEqual([
      '/api/portal/sso/projects',
    ]);
  });

  it('відкриті модулі з відповіді порталу; помилка — жодного', () => {
    expect(
      uiOpenModules({
        modules: [
          { id: 'oblik', state: 'open' },
          { id: 'kadry', state: 'payment' },
        ],
      }),
    ).toEqual(['oblik']);
    expect(uiOpenModules(null)).toEqual([]);
    expect(uiOpenModules({ message: 'Unauthorized' })).toEqual([]);
  });

  it('слова на заставці', () => {
    expect(uiLeavingText('Портал', 'portal').text).toBe('Повертаємо на портал…');
    expect(uiLeavingText('Військовий облік', 'oblik').text).toBe('Відкриваємо «Військовий облік»…');
  });

  it('клік, що веде зі сторінки в цій вкладці', () => {
    const a = document.createElement('a');
    a.href = '/kadry/';
    const click = (init: MouseEventInit = {}) => new MouseEvent('click', { button: 0, ...init });
    expect(uiLeavesPage(click(), a)).toBe(true);
    expect(uiLeavesPage(click({ ctrlKey: true }), a)).toBe(false);
    expect(uiLeavesPage(click({ button: 1 }), a)).toBe(false);
    a.target = '_blank';
    expect(uiLeavesPage(click(), a)).toBe(false);
    a.target = '';
    a.setAttribute('download', '');
    expect(uiLeavesPage(click(), a)).toBe(false);
  });
});
