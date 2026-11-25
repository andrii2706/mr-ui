import { TestBed } from '@angular/core/testing';
import { UiIdleHostComponent } from '../components/idle-host.component';
import { UI_IDLE_ACTIVITY_KEY, UI_IDLE_SIGNED_OUT_KEY } from '../constants/idle.constants';
import { UiIdleService } from './idle.service';

describe('UiIdleService — 10 хв без дій', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date('2026-11-24T10:00:00Z') });
    localStorage.clear();
  });
  afterEach(() => {
    TestBed.inject(UiIdleService).stop();
    vi.useRealTimers();
  });

  it('відлік за хвилину, «Залишитися», потім кінець — заставка до переходу', async () => {
    const expire = vi.fn();
    const idle = TestBed.inject(UiIdleService);
    const fixture = TestBed.createComponent(UiIdleHostComponent);
    fixture.componentRef.setInput('appTitle', 'Тестовий модуль');
    idle.start({ expire });
    vi.advanceTimersByTime(9 * 60_000 + 20_000);
    expect(idle.secondsLeft()).toBe(40);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Вихід через 40 с');
    idle.touch();
    expect(idle.secondsLeft()).toBeNull();
    vi.advanceTimersByTime(10 * 60_000);
    expect(idle.ended()).toBe(true);
    expect(expire).toHaveBeenCalledTimes(1);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('«Тестовий модуль» закрито');
    expect(localStorage.getItem(UI_IDLE_SIGNED_OUT_KEY)).toBeTruthy();
  });

  it('після сну: повернення у вкладку — одразу кінець, перша дія сеанс не оживляє', () => {
    const expire = vi.fn();
    const idle = TestBed.inject(UiIdleService);
    idle.start({ expire });
    vi.setSystemTime(Date.now() + 60 * 60_000);
    window.dispatchEvent(new Event('pointermove'));
    expect(idle.ended()).toBe(true);
    expect(expire).toHaveBeenCalledTimes(1);
  });

  it('активність в іншій вкладці чи апці домену продовжує; вихід там — і тут', () => {
    const expire = vi.fn();
    const idle = TestBed.inject(UiIdleService);
    idle.start({ expire });
    vi.advanceTimersByTime(9 * 60_000);
    window.dispatchEvent(
      new StorageEvent('storage', { key: UI_IDLE_ACTIVITY_KEY, newValue: String(Date.now()) }),
    );
    vi.advanceTimersByTime(5 * 60_000);
    expect(idle.ended()).toBe(false);
    window.dispatchEvent(
      new StorageEvent('storage', { key: UI_IDLE_SIGNED_OUT_KEY, newValue: '1' }),
    );
    expect(idle.ended()).toBe(true);
    expect(expire).toHaveBeenCalled();
  });

  it('повернення у вкладку: visibilitychange і focus перевіряють одразу', () => {
    const expire = vi.fn();
    const idle = TestBed.inject(UiIdleService);
    idle.start({ expire });
    vi.setSystemTime(Date.now() + 11 * 60_000);
    document.dispatchEvent(new Event('visibilitychange'));
    expect(expire).toHaveBeenCalledTimes(1);
  });
});
