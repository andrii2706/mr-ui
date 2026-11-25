import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiA11yPanelComponent } from '@mr/ui';

/** «Доступність»: the panel as the portal shows it, and what the library does without settings. */
@Component({
  selector: 'app-a11y-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiA11yPanelComponent],
  template: `
    <h1 class="text-[26px] font-semibold">Доступність</h1>
    <p class="mt-1 mb-6 max-w-[720px] text-muted">
      Налаштування людини — діють одразу в усіх модулях домену (один ключ у браузері). Спробуйте
      тут: галерея теж їх слухає.
    </p>
    <div class="grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
      <ui-a11y-panel />
      <section class="card p-5" aria-labelledby="a-always">
        <h2 id="a-always" class="mb-3 text-sm font-semibold">Завжди, без налаштувань</h2>
        <ul class="flex flex-col gap-2.5 text-sm">
          @for (item of always; track item[0]) {
            <li>
              <b class="font-medium">{{ item[0] }}.</b>{{ ' '
              }}<span class="text-muted">{{ item[1] }}</span>
            </li>
          }
        </ul>
      </section>
    </div>
  `,
})
export class A11yPage {
  protected readonly always = [
    ['Перейти до змісту', 'перша зупинка Tab — натисніть Tab на цій сторінці'],
    ['Клавіатура', 'Tab, стрілки в групах (тема модуля вгорі, розмір тексту), Enter, Esc'],
    ['Читачі екрана', 'назви, ролі й стани; оголошення змін без переміщення фокусу'],
    ['Фокус', 'рамка 2 px кольору модуля, не ховається під шапкою'],
    ['Рух', 'системне «менше руху» вимикає анімації саме'],
    ['Високий контраст Windows', 'системні кольори, рамки лишаються видимими'],
    ['Перевірка', 'npm run a11y — axe-core на кожній сторінці галереї'],
  ];
}
