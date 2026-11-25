import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  ICON_PATHS,
  UiAppIconComponent,
  UiIconComponent,
  type AppIconId,
  type UiIconName,
} from '@mr/ui';

/** The icons: the set (search, copy the name) and the tiles of the modules. */
@Component({
  selector: 'app-icons-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiIconComponent, UiAppIconComponent],
  template: `
    <h1 class="text-[26px] font-semibold">Іконки</h1>
    <p class="mt-1 mb-6 max-w-[720px] text-muted">
      24 × 24, лінія 1,75. Поруч зі словом — прикраса й прихована від читача екрана; сама по собі —
      з назвою:
      <code class="font-mono text-sm">&lt;ui-icon name="more" label="Ще дії" /&gt;</code>.
    </p>

    <section aria-labelledby="i-apps">
      <h2 id="i-apps" class="mb-3 text-lg font-semibold">Плитки модулів</h2>
      <div class="card flex flex-wrap items-end gap-8 p-5">
        @for (a of apps; track a) {
          <div class="flex flex-col items-center gap-2">
            <div class="flex items-end gap-3">
              <ui-app-icon [app]="a" [size]="48" />
              <ui-app-icon [app]="a" [size]="32" />
              <ui-app-icon [app]="a" [size]="16" />
            </div>
            <span class="font-mono text-xs text-muted">{{ a }}</span>
          </div>
        }
        <div class="flex flex-col items-center gap-2">
          <ui-app-icon
            app="kadry"
            [size]="48"
            [locked]="true"
            label="Облік працівників — не підключено"
          />
          <span class="font-mono text-xs text-muted">locked</span>
        </div>
      </div>
    </section>

    <section class="mt-8" aria-labelledby="i-set">
      <div class="mb-3 flex flex-wrap items-center gap-3">
        <h2 id="i-set" class="text-lg font-semibold">Набір · {{ found().length }}</h2>
        <label class="ml-auto flex items-center gap-2 text-sm">
          <span>Пошук</span>
          <input
            class="input w-56"
            [value]="query()"
            (input)="query.set($any($event.target).value)"
            placeholder="calendar, file…"
          />
        </label>
      </div>
      <ul class="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        @for (name of found(); track name) {
          <li class="card flex flex-col items-center gap-2 p-3">
            <ui-icon [name]="name" [size]="22" />
            <span class="font-mono text-[11px] text-muted">{{ name }}</span>
          </li>
        }
      </ul>
    </section>
  `,
})
export class IconsPage {
  protected readonly apps: AppIconId[] = ['portal', 'oblik', 'kadry', 'projects'];
  protected readonly query = signal('');
  private readonly names = Object.keys(ICON_PATHS) as UiIconName[];
  protected readonly found = computed(() => {
    const q = this.query().trim().toLowerCase();
    return q ? this.names.filter((n) => n.toLowerCase().includes(q)) : this.names;
  });
}
