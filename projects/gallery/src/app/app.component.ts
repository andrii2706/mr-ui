import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  A11ySettingsService,
  UiAppIconComponent,
  UiLongActionHostComponent,
  UiActivityHostComponent,
  UiSkipLinkComponent,
  type AppIconId,
} from '@mr/ui';
import { MODULES, NAV } from './shared/gallery.constants';

/** The gallery of @mr/ui: every component alive, in the theme of every module. */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    UiSkipLinkComponent,
    UiLongActionHostComponent,
    UiActivityHostComponent,
    UiAppIconComponent,
  ],
  template: `
    <ui-skip-link />
    <div class="flex min-h-screen flex-col md:flex-row">
      <aside class="border-line bg-[#fbfbf9] px-3 py-4 md:w-60 md:shrink-0 md:border-r">
        <div class="flex items-center gap-2.5 px-2 pb-4">
          <ui-app-icon [app]="theme()" [size]="32" />
          <span>
            <b class="block text-sm">@mr/ui</b>
            <span class="block text-xs text-muted">галерея · v{{ version }}</span>
          </span>
        </div>
        <nav aria-label="Розділи галереї" class="flex gap-1 overflow-x-auto md:flex-col">
          @for (item of nav; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-sunken font-semibold"
              [routerLinkActiveOptions]="{ exact: true }"
              ariaCurrentWhenActive="page"
              class="rounded-[9px] px-3 py-2 text-sm whitespace-nowrap no-underline hover:bg-sunken"
              >{{ item.label }}</a
            >
          }
        </nav>
      </aside>
      <div class="flex min-w-0 flex-1 flex-col">
        <header
          class="flex flex-wrap items-center gap-3 border-b border-line bg-surface px-4 py-3 sm:px-8"
        >
          <span id="theme-label" class="text-sm text-muted">Тема модуля</span>
          <div
            role="radiogroup"
            aria-labelledby="theme-label"
            class="flex flex-wrap gap-1.5"
            (keydown)="themeKey($event)"
          >
            @for (m of modules; track m.id) {
              <button
                type="button"
                role="radio"
                class="flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px]"
                [class]="
                  m.id === theme()
                    ? 'border-ink bg-ink text-white'
                    : 'border-line bg-surface hover:bg-sunken'
                "
                [attr.aria-checked]="m.id === theme()"
                [tabIndex]="m.id === theme() ? 0 : -1"
                (click)="setTheme(m.id)"
              >
                <span
                  class="size-2.5 rounded-full"
                  [style.background]="m.color"
                  aria-hidden="true"
                ></span
                >{{ m.title }}
              </button>
            }
          </div>
          <span class="ml-auto text-xs text-muted"
            >Доступність:
            {{ a11y.changed() ? 'змінено ' + a11y.changed() : 'як за замовчуванням' }}</span
          >
        </header>
        <main
          id="main"
          tabindex="-1"
          class="w-full max-w-[1180px] flex-1 px-4 py-8 outline-none sm:px-8"
        >
          <router-outlet />
        </main>
      </div>
    </div>
    <ui-long-action-host />
    <ui-activity-host />
  `,
})
export class AppComponent {
  private readonly document = inject(DOCUMENT);
  protected readonly a11y = inject(A11ySettingsService);
  protected readonly nav = NAV;
  protected readonly modules = MODULES;
  protected readonly version = '0.3.0';
  protected readonly theme = signal<AppIconId>('projects');

  protected setTheme(id: AppIconId) {
    this.theme.set(id);
    this.document.documentElement.dataset['theme'] = id;
  }

  protected themeKey(event: KeyboardEvent) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const at = this.modules.findIndex((m) => m.id === this.theme());
    const next = this.modules[(at + step + this.modules.length) % this.modules.length];
    this.setTheme(next.id);
    (this.document.querySelector(`[role=radio][aria-checked=true]`) as HTMLElement | null)?.focus();
    setTimeout(() =>
      (
        this.document.querySelector(`[role=radio][aria-checked=true]`) as HTMLElement | null
      )?.focus(),
    );
  }
}
