import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { AnnouncerService, LongActionService } from '@mr/ui';

/**
 * A long action live: the window closes, the page shows what is happening and is out of reach; when it fails the
 * window opens again with everything entered and the reason.
 */
@Component({
  selector: 'app-long-action-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-[26px] font-semibold">Довга дія</h1>
    <p class="mt-1 mb-6 max-w-[720px] text-muted">
      Підпис КЕП, імпорт, документ на багато сторінок. Вікно закривається, на сторінці — лоадер і що
      відбувається, решта сторінки недоступна (inert). Не вдалося — вікно відкривається знову з
      усім, що людина ввела, і з причиною.
    </p>
    <div class="card flex flex-wrap items-center gap-3 p-5">
      <button type="button" class="btn btn-primary" (click)="openDialog()">Підписати листи…</button>
      <label class="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          class="toggle toggle-primary toggle-sm"
          [checked]="fail()"
          (change)="fail.set($any($event.target).checked)"
        />
        Хай не вдасться
      </label>
      @if (done()) {
        <p class="w-full text-sm text-success" role="status">{{ done() }}</p>
      }
    </div>

    <dialog
      #dlg
      class="m-auto w-[min(520px,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-0 shadow-xl backdrop:bg-black/40"
      aria-labelledby="la-title"
      (close)="error.set('')"
    >
      <form
        method="dialog"
        class="flex flex-col gap-4 p-6"
        (submit)="$event.preventDefault(); sign()"
      >
        <h2 id="la-title" class="text-lg font-semibold">Підписати 12 листів КЕП</h2>
        @if (error()) {
          <p class="rounded-lg bg-[#fdf1ef] px-3 py-2 text-sm text-error" role="alert">
            {{ error() }}
          </p>
        }
        <label class="text-[13px] font-medium" for="la-note">Коментар до підпису</label>
        <input
          id="la-note"
          class="input -mt-2.5"
          [value]="note()"
          (input)="note.set($any($event.target).value)"
        />
        <div class="flex justify-end gap-2">
          <button type="button" class="btn btn-secondary" (click)="dlg.close()">Скасувати</button>
          <button type="submit" class="btn btn-primary">
            {{ error() ? 'Підписати решту' : 'Підписати' }}
          </button>
        </div>
      </form>
    </dialog>
  `,
})
export class LongActionPage {
  private readonly actions = inject(LongActionService);
  private readonly announcer = inject(AnnouncerService);
  protected readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
  protected readonly fail = signal(false);
  protected readonly note = signal('Погоджено керівником');
  protected readonly error = signal('');
  protected readonly done = signal('');

  protected openDialog() {
    this.done.set('');
    this.dialog().nativeElement.showModal();
  }

  protected async sign() {
    const fail = this.fail();
    this.dialog().nativeElement.close();
    try {
      await this.actions.run(
        'Підписуємо 12 листів…',
        () =>
          new Promise<void>((ok, no) =>
            setTimeout(() => (fail ? no(new Error('rejected')) : ok()), 2200),
          ),
        { hint: 'Не закривайте сторінку', doneMessage: 'Підписано 12 листів' },
      );
      this.done.set('Підписано 12 листів.');
    } catch {
      // the window again, with what was entered and the reason
      this.error.set('Підписано 9 з 12. Ключ відхилено для 3 — спробуйте ще раз.');
      this.announcer.assertive('Не вдалося підписати 3 листи');
      this.dialog().nativeElement.showModal();
    }
  }
}
