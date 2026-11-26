import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, DestroyRef, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { UI_LEAVE_RESET_MS } from '../constants/apps.constants';
import type { UiLeaving } from '../interfaces/apps.interface';
import type { AppIconId } from '../interfaces/icon.interface';
import { uiLeavingText } from '../utils/apps.utils';
import { AnnouncerService } from './announcer.service';

/**
 * What the page is busy with, for the loaders of ui-activity-host:
 *   — actions (saving, deleting, sending) — the thin bar at the top while a request that changes something runs
 *     (uiActivityInterceptor counts them; a button keeps its own [uiBusy]);
 *   — leaving for another application (the portal ↔ a module) — the cover with the name of what opens, at once,
 *     so the old page is not clicked while the next one loads.
 */
@Injectable({ providedIn: 'root' })
export class UiActivityService {
  private readonly announcer = inject(AnnouncerService);
  private readonly document = inject(DOCUMENT);
  private readonly running = signal(0);
  private readonly away = signal<UiLeaving | null>(null);
  private resetTimer: ReturnType<typeof setTimeout> | undefined;

  /** An action is running (at least one request that changes something). */
  readonly busy = computed(() => this.running() > 0);
  /** Leaving for another application — the cover. */
  readonly leaving = this.away.asReadonly();

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    // «Back» brings the page from the cache of the browser as it was — with the cover; take it away
    const view = this.document.defaultView;
    const shown = (e: PageTransitionEvent) => {
      if (e.persisted) this.stay();
    };
    view?.addEventListener('pageshow', shown);
    inject(DestroyRef).onDestroy(() => {
      view?.removeEventListener('pageshow', shown);
      this.clearTimer();
    });
  }

  /** An action starts; the returned function ends it (once, however often it is called). */
  begin(): () => void {
    this.running.update((n) => n + 1);
    let done = false;
    return () => {
      if (done) return;
      done = true;
      this.running.update((n) => Math.max(0, n - 1));
    };
  }

  /** The page is leaving for `title` (the portal or a module): the cover at once. */
  leave(title: string, app: AppIconId | null = null): void {
    const leaving = uiLeavingText(title, app);
    this.away.set(leaving);
    this.announcer.polite(leaving.text);
    this.clearTimer();
    this.resetTimer = setTimeout(() => this.stay(), UI_LEAVE_RESET_MS);
  }

  /** Not leaving after all (back from the cache of the browser, a download, the time is up). */
  stay(): void {
    this.clearTimer();
    this.away.set(null);
  }

  private clearTimer() {
    if (this.resetTimer !== undefined) clearTimeout(this.resetTimer);
    this.resetTimer = undefined;
  }
}
