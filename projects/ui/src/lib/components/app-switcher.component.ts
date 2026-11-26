import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { UiLeaveDirective } from '../directives/leave.directive';
import type { AppIconId } from '../interfaces/icon.interface';
import { UiAppsService } from '../services/apps.service';
import { uiSwitcherLinks } from '../utils/apps.utils';
import { UiAppIconComponent } from './app-icon.component';

/**
 * The other applications of the domain at the top of the menu of every application — the portal and the modules
 * the account may open: plain links (the session is shared, no second sign-in) with the cover of leaving.
 * `rail` — the menu turns into a rail of icons from 1024 px to 1279 px (as «Військовий облік»): only icons there.
 *
 *   <ui-app-switcher current="kadry" class="mx-3 mb-1" />
 */
@Component({
  selector: 'ui-app-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiAppIconComponent, UiLeaveDirective],
  host: { class: 'block' },
  template: `
    <nav class="rounded-xl bg-base-300 p-1 text-[13px]" aria-label="Застосунки">
      @for (a of links(); track a.id) {
        <a
          [href]="a.href"
          [uiLeave]="a.title"
          [uiLeaveApp]="a.id"
          [attr.title]="rail() ? a.title : null"
          [attr.aria-label]="rail() ? a.title : null"
          class="flex cursor-pointer items-center gap-2.5 truncate rounded-lg px-2 py-1.5 text-muted no-underline hover:bg-base-100 hover:text-base-content"
          [class.lg:justify-center]="rail()"
          [class.xl:justify-start]="rail()"
          ><ui-app-icon [app]="a.id" [size]="20" /><span
            class="truncate"
            [class.lg:hidden]="rail()"
            [class.xl:inline]="rail()"
            >{{ a.title }}</span
          ></a
        >
      }
    </nav>
  `,
})
export class UiAppSwitcherComponent {
  private readonly apps = inject(UiAppsService);
  /** This application — not in the list. */
  readonly current = input.required<AppIconId>();
  /** Icons only from 1024 px to 1279 px. */
  readonly rail = input(false);

  protected readonly links = computed(() => uiSwitcherLinks(this.current(), this.apps.open()));

  constructor() {
    afterNextRender(() => void this.apps.load());
  }
}
