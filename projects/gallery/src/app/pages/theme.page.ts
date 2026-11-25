import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTRAST_PAIRS } from '../shared/gallery.constants';
import { contrast } from '../shared/contrast.utils';

/** The theme: the accent of the module (switch it above), the colour pairs with their contrast, the focus, the targets. */
@Component({
  selector: 'app-theme-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-[26px] font-semibold">Тема й контраст</h1>
    <p class="mt-1 mb-6 max-w-[720px] text-muted">
      Перемкніть тему модуля вгорі — колір змінюється всюди. Кожна пара кольорів порахована формулою
      WCAG.
    </p>

    <div class="grid items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div class="card overflow-x-auto">
        <table class="w-full min-w-[560px] text-sm">
          <caption class="ui-sr-only">
            Контраст кольорів теми
          </caption>
          <thead>
            <tr class="text-left text-xs text-muted">
              <th class="px-4 py-2.5 font-medium" scope="col">Пара</th>
              <th class="px-4 py-2.5 font-medium" scope="col">Колір</th>
              <th class="px-4 py-2.5 font-medium" scope="col">Контраст</th>
              <th class="px-4 py-2.5 font-medium" scope="col">Треба</th>
              <th class="px-4 py-2.5 font-medium" scope="col">AA</th>
            </tr>
          </thead>
          <tbody>
            @for (p of pairs; track p.name) {
              <tr class="border-t border-line">
                <th class="px-4 py-2.5 text-left font-normal" scope="row">
                  {{ p.name }}
                  @if (p.note) {
                    <span class="block text-xs text-muted">{{ p.note }}</span>
                  }
                </th>
                <td class="px-4 py-2.5">
                  <span class="inline-flex items-center gap-2"
                    ><span
                      class="size-4 rounded border border-line"
                      [style.background]="p.fg"
                      aria-hidden="true"
                    ></span
                    ><span class="font-mono text-xs">{{ p.fg }}</span></span
                  >
                </td>
                <td class="px-4 py-2.5 font-mono tabular-nums">{{ p.ratio }} : 1</td>
                <td class="px-4 py-2.5 text-muted">≥ {{ p.need }}</td>
                <td class="px-4 py-2.5">{{ p.ok ? 'так' : 'ні' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <div class="flex flex-col gap-4">
        <section class="card p-5" aria-labelledby="t-accent">
          <h2 id="t-accent" class="mb-3 text-sm font-semibold">Колір модуля</h2>
          <div class="flex flex-wrap items-center gap-2">
            <button type="button" class="btn btn-primary">Основна дія</button>
            <button type="button" class="btn btn-secondary">Другорядна</button>
            <a href="#/theme" class="text-sm text-primary underline underline-offset-4"
              >Посилання</a
            >
          </div>
          <div class="mt-4 flex items-center gap-4">
            <label class="flex items-center gap-2 text-sm"
              ><input type="checkbox" class="toggle toggle-primary" checked /> Перемикач</label
            >
            <kbd class="kbd kbd-sm">C</kbd>
            <span
              class="loading loading-ball loading-md text-primary"
              role="img"
              aria-label="Лоадер"
            ></span>
          </div>
        </section>
        <section class="card p-5" aria-labelledby="t-field">
          <h2 id="t-field" class="mb-3 text-sm font-semibold">Поле: рамка й плейсхолдер</h2>
          <label class="text-[13px] font-medium" for="t-input">Назва задачі</label>
          <input id="t-input" class="input mt-1.5" placeholder="Наприклад, «Маршрут погодження»" />
        </section>
        <section class="card p-5" aria-labelledby="t-focus">
          <h2 id="t-focus" class="mb-2 text-sm font-semibold">Фокус і цілі</h2>
          <p class="text-sm text-muted">
            Натисніть Tab: рамка 2 px кольору модуля з відступом. Найменша кнопка — 24 × 24 px.
          </p>
          <div class="mt-3 flex gap-2">
            <button type="button" class="btn btn-secondary btn-sm">Tab сюди</button>
            <button type="button" class="btn btn-secondary btn-sm" aria-label="Ще дії">⋯</button>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class ThemePage {
  protected readonly pairs = CONTRAST_PAIRS.map((p) => {
    const r = contrast(p.fg, p.bg);
    return { ...p, ratio: r.toFixed(2).replace('.', ','), ok: r >= p.need };
  });
}
