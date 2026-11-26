import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { UiActivityService } from '../services/activity.service';
import { delayedBusy } from '../utils/loading.utils';
import { UiAppIconComponent } from './app-icon.component';

/**
 * The loaders of the whole application, once in its shell (next to ui-idle-host):
 *   — the thin bar at the top while an action runs (uiActivityInterceptor) — after 200 ms, so a fast save shows
 *     nothing;
 *   — the cover when the page leaves for the portal or another module (uiLeave, ui-app-switcher) — at once.
 */
@Component({
  selector: 'ui-activity-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiAppIconComponent],
  template: `
    @if (bar()) {
      <div
        class="fixed inset-x-0 top-0 z-[960] h-0.5 overflow-hidden bg-primary/15"
        role="progressbar"
        aria-label="Виконується дія"
      >
        <div class="ui-activity-bar h-full w-1/3 bg-primary"></div>
      </div>
    }
    @if (activity.leaving(); as leaving) {
      <div
        class="fixed inset-0 z-[950] grid place-items-center bg-base-200/95 px-4"
        role="status"
        aria-live="polite"
      >
        <div class="flex flex-col items-center gap-4 text-center">
          @if (leaving.app) {
            <ui-app-icon [app]="leaving.app" [size]="48" />
          }
          <span class="loading loading-ball loading-lg text-primary" aria-hidden="true"></span>
          <p class="text-sm font-medium">{{ leaving.text }}</p>
        </div>
      </div>
    }
  `,
})
export class UiActivityHostComponent {
  protected readonly activity = inject(UiActivityService);
  protected readonly bar = delayedBusy(
    computed(() => this.activity.busy() && !this.activity.leaving()),
  );
}
