import { TestBed } from '@angular/core/testing';
import { UiDateInputComponent } from './date-input.component';

function setup(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(UiDateInputComponent);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  const field = el.querySelector('input') as HTMLInputElement;
  const type = (text: string) => {
    field.value = text;
    field.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };
  const click = (selector: string) => {
    (el.querySelector(selector) as HTMLElement).click();
    fixture.detectChanges();
  };
  const buttons = () => [...el.querySelectorAll<HTMLButtonElement>('[role=dialog] button')];
  return {
    fixture,
    el,
    field,
    type,
    click,
    buttons,
    value: () => fixture.componentInstance.value(),
  };
}

describe('UiDateInputComponent — поле дати', () => {
  it('ДД.ММ.РРРР замість mm/dd/yyyy; введення з маскою віддає ISO', () => {
    const t = setup({ value: '2026-11-02' });
    expect(t.field.value).toBe('02.11.2026');
    expect(t.field.placeholder).toBe('ДД.ММ.РРРР');
    t.type('24112026');
    expect(t.value()).toBe('2026-11-24');
    t.type('31022026');
    expect(t.value()).toBe('31.02.2026');
  });

  it('календар українською, з понеділка; день обирається кліком', () => {
    const t = setup({ value: '2026-12-01' });
    t.click('[aria-label="Відкрити календар"]');
    expect(t.el.textContent).toContain('Грудень 2026');
    expect(t.el.querySelector('[role=dialog] .grid span')?.textContent).toBe('Пн');
    t.buttons()
      .find((b) => b.getAttribute('aria-label') === '19 Грудень 2026')!
      .click();
    t.fixture.detectChanges();
    expect(t.value()).toBe('2026-12-19');
    expect(t.el.querySelector('[role=dialog]')).toBeNull();
  });

  it('заголовок → місяці → роки; стрілки; Очистити', () => {
    const t = setup({ value: '1990-05-10' });
    t.click('[aria-label="Відкрити календар"]');
    t.click('[aria-label="Обрати місяць і рік"]');
    t.click('[aria-label="Обрати рік"]');
    t.buttons()
      .find((b) => b.textContent?.trim() === '1985')!
      .click();
    t.fixture.detectChanges();
    t.buttons()
      .find((b) => b.textContent?.trim() === 'Бер')!
      .click();
    t.fixture.detectChanges();
    expect(t.el.textContent).toContain('Березень 1985');
    t.click('[aria-label="Наступний місяць"]');
    expect(t.el.textContent).toContain('Квітень 1985');
    t.click('[aria-label="Попередній місяць"]');
    t.buttons()
      .find((b) => b.textContent?.trim() === 'Очистити')!
      .click();
    expect(t.value()).toBe('');
  });

  it('з годиною: день, потім година; введення ДД.ММ.РРРР ГГ:ХХ', () => {
    const t = setup({ withTime: true, defaultTime: '18:00' });
    expect(t.field.placeholder).toBe('ДД.ММ.РРРР ГГ:ХХ');
    t.type('191220261830');
    expect(t.value()).toBe('2026-12-19T18:30');
    expect(t.field.value).toBe('19.12.2026 18:30');
    t.type('');
    t.click('[aria-label="Відкрити календар"]');
    t.buttons()
      .find((b) => b.textContent?.trim() === 'Сьогодні')!
      .click();
    t.fixture.detectChanges();
    expect(t.value()).toMatch(/T18:00$/);
    t.buttons()
      .find((b) => b.textContent?.trim() === '17:30')!
      .click();
    expect(t.value()).toMatch(/T17:30$/);
  });

  it('недоступне й лише для читання — календар не відкривається', () => {
    const t = setup({ readonly: true });
    t.fixture.componentInstance['toggle']();
    t.fixture.detectChanges();
    expect(t.el.querySelector('[role=dialog]')).toBeNull();
  });
});
