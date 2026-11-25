import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  UiBusyDirective,
  UiPageLoaderComponent,
  UiSkeletonListComponent,
  delayedBusy,
} from '@mr/ui';

/** The loaders: the sizes of daisyUI, the page, the part, the button — and the 200 / 400 ms rule live. */
@Component({
  selector: 'app-loaders-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiPageLoaderComponent, UiSkeletonListComponent, UiBusyDirective],
  template: `
    <h1 class="text-[26px] font-semibold">Лоадери</h1>
    <p class="mt-1 mb-6 max-w-[720px] text-muted">
      Ціла сторінка — м’ячик, частина сторінки й мала дія — кістяк, кнопка — spinner. З’являються
      лише після 200 мс очікування і тримаються щонайменше 400 мс — швидка відповідь нічого не
      показує, нічого не блимає.
    </p>

    <div class="grid gap-6 lg:grid-cols-2">
      <section class="card p-5" aria-labelledby="l-ball">
        <h2 id="l-ball" class="mb-4 text-sm font-semibold">loading-ball · сторінка</h2>
        <div class="flex items-end justify-around">
          @for (s of sizes; track s) {
            <span class="flex flex-col items-center gap-2">
              <span
                class="loading loading-ball text-primary"
                [class]="'loading-' + s"
                aria-hidden="true"
              ></span>
              <span class="font-mono text-xs text-muted">{{ s }}</span>
            </span>
          }
        </div>
      </section>
      <section class="card p-5" aria-labelledby="l-spin">
        <h2 id="l-spin" class="mb-4 text-sm font-semibold">loading-spinner · кнопки</h2>
        <div class="flex items-end justify-around">
          @for (s of sizes; track s) {
            <span class="flex flex-col items-center gap-2">
              <span
                class="loading loading-spinner text-primary"
                [class]="'loading-' + s"
                aria-hidden="true"
              ></span>
              <span class="font-mono text-xs text-muted">{{ s }}</span>
            </span>
          }
        </div>
      </section>

      <section class="card p-5" aria-labelledby="l-page">
        <h2 id="l-page" class="mb-1 text-sm font-semibold">Сторінка відкривається</h2>
        <p class="mb-3 text-sm text-muted">Відповідь сервера через {{ wait() }} мс.</p>
        <div class="flex flex-wrap gap-2">
          <button type="button" class="btn btn-secondary btn-sm" (click)="open(120)">
            Швидко — 120 мс
          </button>
          <button type="button" class="btn btn-secondary btn-sm" (click)="open(1800)">
            Повільно — 1,8 с
          </button>
        </div>
        <div
          class="mt-4 h-56 overflow-hidden rounded-xl border border-line bg-canvas"
          [attr.aria-busy]="pageBusy()"
        >
          @if (pageLoader()) {
            <ui-page-loader label="Відкриваємо дошку…" [full]="false" />
          } @else if (!pageBusy()) {
            <p class="p-5 text-sm">Дошка відкрита: 4 колонки, 12 задач.</p>
          }
        </div>
      </section>

      <section class="card p-5" aria-labelledby="l-part">
        <h2 id="l-part" class="mb-1 text-sm font-semibold">Частина сторінки — кістяк</h2>
        <p class="mb-3 text-sm text-muted">Учасники проєкту довантажуються.</p>
        <button type="button" class="btn btn-secondary btn-sm" (click)="reloadPart()">
          Оновити список
        </button>
        <div class="mt-4 rounded-xl border border-line p-4" [attr.aria-busy]="partBusy()">
          @if (partLoader()) {
            <span class="ui-sr-only">Завантажуємо учасників</span>
            <ui-skeleton-list [rows]="3" [avatar]="true" />
          } @else if (!partBusy()) {
            <ul class="flex flex-col gap-2 text-sm">
              <li>Олена Петренко · вигадана</li>
              <li>Тарас Іваненко · вигаданий</li>
              <li>Марія Коваль · вигадана</li>
            </ul>
          }
        </div>
      </section>

      <section class="card p-5 lg:col-span-2" aria-labelledby="l-button">
        <h2 id="l-button" class="mb-1 text-sm font-semibold">Кнопка в роботі — uiBusy</h2>
        <p class="mb-3 text-sm text-muted">
          aria-busy одразу, spinner — після 200 мс; колір і ширина ті самі, натиснути вдруге не
          можна.
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="btn btn-primary"
            [uiBusy]="saving()"
            [disabled]="saving()"
            (click)="save()"
          >
            {{ saving() ? 'Зберігаю…' : 'Зберегти' }}
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            [uiBusy]="watching()"
            uiBusySize="xs"
            [disabled]="watching()"
            (click)="watch()"
          >
            {{ watching() ? 'Стежу…' : 'Стежити' }}
          </button>
        </div>
      </section>
    </div>
  `,
})
export class LoadersPage {
  protected readonly sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
  protected readonly wait = signal(1800);
  protected readonly pageBusy = signal(false);
  protected readonly pageLoader = delayedBusy(this.pageBusy);
  protected readonly partBusy = signal(false);
  protected readonly partLoader = delayedBusy(this.partBusy);
  protected readonly saving = signal(false);
  protected readonly watching = signal(false);

  protected open(ms: number) {
    this.wait.set(ms);
    this.pageBusy.set(true);
    setTimeout(() => this.pageBusy.set(false), ms);
  }

  protected reloadPart() {
    this.partBusy.set(true);
    setTimeout(() => this.partBusy.set(false), 1200);
  }

  protected save() {
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 1500);
  }

  protected watch() {
    this.watching.set(true);
    setTimeout(() => this.watching.set(false), 900);
  }
}
