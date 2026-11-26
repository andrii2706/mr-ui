import { Directive, ElementRef, inject, input } from '@angular/core';
import type { AppIconId } from '../interfaces/icon.interface';
import { UiActivityService } from '../services/activity.service';
import { uiLeavesPage } from '../utils/apps.utils';

/**
 * A link to another application of the domain (the portal, a module): a click shows the cover of ui-activity-host —
 * «Відкриваємо «Облік працівників»…» / «Повертаємо на портал…» — while the next page loads.
 * A new tab (Ctrl, the middle button) leaves this page as it is.
 *
 *   <a href="/api/portal/sso/oblik" uiLeave="Військовий облік" uiLeaveApp="oblik">…</a>
 */
@Directive({
  selector: 'a[uiLeave]',
  host: { '(click)': 'onClick($event)' },
})
export class UiLeaveDirective {
  private readonly link = inject<ElementRef<HTMLAnchorElement>>(ElementRef);
  private readonly activity = inject(UiActivityService);
  /** The name of what opens. */
  readonly uiLeave = input.required<string>();
  /** Its icon on the cover; «portal» — «Повертаємо на портал…». */
  readonly uiLeaveApp = input<AppIconId | null>(null);

  protected onClick(event: MouseEvent) {
    if (uiLeavesPage(event, this.link.nativeElement))
      this.activity.leave(this.uiLeave(), this.uiLeaveApp());
  }
}
