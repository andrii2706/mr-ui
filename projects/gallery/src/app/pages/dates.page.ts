import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiDateInputComponent } from '@mr/ui';

/** The date field of every module: ДД.ММ.РРРР, the calendar of the application, the hour next to it. */
@Component({
  selector: 'app-dates-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiDateInputComponent],
  template: `
    <h1 class="text-[26px] font-semibold">Поле дати</h1>
    <p class="mt-1 mb-6 max-w-[720px] text-muted">
      Замість браузерного mm/dd/yyyy — ДД.ММ.РРРР і календар застосунку, однаковий у кожному
      браузері. Заголовок календаря перемикає на місяці й роки. З годиною — список через 30 хв.
    </p>
    <div class="grid max-w-[720px] gap-6 sm:grid-cols-2">
      <div>
        <label class="mb-1.5 block text-sm font-medium" for="g-date">Оплачено до</label>
        <ui-date-input inputId="g-date" [(value)]="date" />
        <p class="mt-1 font-mono text-xs text-muted">{{ date() || '—' }}</p>
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium" for="g-deadline">Дедлайн</label>
        <ui-date-input
          inputId="g-deadline"
          [withTime]="true"
          defaultTime="18:00"
          align="right"
          [(value)]="deadline"
        />
        <p class="mt-1 font-mono text-xs text-muted">{{ deadline() || '—' }}</p>
      </div>
    </div>
  `,
})
export class DatesPage {
  protected readonly date = signal('2026-12-31');
  protected readonly deadline = signal('2026-12-19T18:00');
}
