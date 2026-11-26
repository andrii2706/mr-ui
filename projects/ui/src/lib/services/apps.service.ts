import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { UI_PORTAL_ACCESS_URL } from '../constants/apps.constants';
import { uiOpenModules } from '../utils/apps.utils';

/**
 * The modules the account may open — asked of the portal once (the session of the portal is shared by the domain).
 * Not signed in to the portal or no answer — none: the switcher then shows only «Портал».
 */
@Injectable({ providedIn: 'root' })
export class UiAppsService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly ids = signal<string[]>([]);
  private asked = false;

  /** The ids of the open modules (oblik, kadry, projects). */
  readonly open = this.ids.asReadonly();

  /** Asks the portal once; again with `force` (after a change of the access). */
  async load(force = false): Promise<void> {
    if (!this.browser || (this.asked && !force)) return;
    this.asked = true;
    try {
      const res = await fetch(UI_PORTAL_ACCESS_URL, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      });
      this.ids.set(res.ok ? uiOpenModules(await res.json()) : []);
    } catch {
      this.ids.set([]);
    }
  }
}
