import {
  uiDisplayToValue,
  uiMaskDateInput,
  uiSplitValue,
  uiTimeSlots,
  uiTodayIso,
  uiValueToDisplay,
} from './date.utils';

describe('date.utils — поле дати', () => {
  it('маска: крапки, пробіл і двокрапка під час введення', () => {
    expect(uiMaskDateInput('0211')).toBe('02.11');
    expect(uiMaskDateInput('02112026')).toBe('02.11.2026');
    expect(uiMaskDateInput('021120261')).toBe('02.11.2026');
    expect(uiMaskDateInput('021120261830', true)).toBe('02.11.2026 18:30');
    expect(uiMaskDateInput('0211202618', true)).toBe('02.11.2026 18');
  });

  it('текст ↔ значення: лише справжній день і час', () => {
    expect(uiDisplayToValue('02.11.2026', false)).toBe('2026-11-02');
    expect(uiDisplayToValue('31.02.2026', false)).toBe('31.02.2026');
    expect(uiDisplayToValue('02.11.2026 18:30', true)).toBe('2026-11-02T18:30');
    expect(uiDisplayToValue('02.11.2026', true)).toBe('2026-11-02');
    expect(uiDisplayToValue('02.11.2026 25:00', true)).toBe('02.11.2026 25:00');
    expect(uiDisplayToValue('02.11.2026 18:30', false)).toBe('02.11.2026 18:30');
    expect(uiValueToDisplay('2026-11-02T18:30')).toBe('02.11.2026 18:30');
    expect(uiValueToDisplay('2026-11-02')).toBe('02.11.2026');
    expect(uiValueToDisplay('02.1')).toBe('02.1');
    expect(uiSplitValue('2026-11-02T24:00')).toBeNull();
  });

  it('години через 30 хв; сьогодні', () => {
    expect(uiTimeSlots()).toHaveLength(48);
    expect(uiTimeSlots()[37]).toBe('18:30');
    expect(uiTodayIso(new Date(2026, 10, 24, 12))).toBe('2026-11-24');
  });
});
