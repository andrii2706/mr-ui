import { uiIdlePortalUrl, uiIdleState } from './idle.utils';

describe('idle.utils — вихід через бездіяльність', () => {
  it('ще працює, відлік за хвилину, кінець', () => {
    expect(uiIdleState(0, 5 * 60_000, 600_000, 60_000)).toEqual({
      ended: false,
      secondsLeft: null,
    });
    expect(uiIdleState(0, 559_100, 600_000, 60_000)).toEqual({ ended: false, secondsLeft: 41 });
    expect(uiIdleState(0, 600_000, 600_000, 60_000)).toEqual({ ended: true });
    // the laptop slept an hour
    expect(uiIdleState(0, 3_600_000, 600_000, 60_000)).toEqual({ ended: true });
  });

  it('адреса порталу: звідки й куди повернутись; чужий сайт — ні', () => {
    expect(uiIdlePortalUrl('oblik', '/oblik/employees/1')).toBe(
      '/?idle=oblik&next=%2Foblik%2Femployees%2F1',
    );
    expect(uiIdlePortalUrl('kadry', '//evil.example.com')).toBe('/?idle=kadry');
  });
});
