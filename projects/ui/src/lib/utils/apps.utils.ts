import { UI_APPS } from '../constants/apps.constants';
import type { UiAccessAnswer, UiAppInfo, UiLeaving } from '../interfaces/apps.interface';
import type { AppIconId } from '../interfaces/icon.interface';

/** The links of the switcher: the portal (unless this is it) and the open modules of the account but this one. */
export function uiSwitcherLinks(current: AppIconId, open: readonly string[]): UiAppInfo[] {
  return UI_APPS.filter((a) => a.id !== current && (a.id === 'portal' || open.includes(a.id)));
}

/** The open modules from the answer of the portal; anything else (no session, an error) — none. */
export function uiOpenModules(answer: unknown): string[] {
  const modules = (answer as Partial<UiAccessAnswer> | null)?.modules;
  return Array.isArray(modules) ? modules.filter((m) => m?.state === 'open').map((m) => m.id) : [];
}

/** The words on the cover: back to the portal or «Відкриваємо «Військовий облік»…». */
export function uiLeavingText(title: string, app: AppIconId | null): UiLeaving {
  return { app, text: app === 'portal' ? 'Повертаємо на портал…' : `Відкриваємо «${title}»…` };
}

/** A click that leaves this page in this tab: the left button, no modifier, no new tab, no download. */
export function uiLeavesPage(event: MouseEvent, link: HTMLAnchorElement): boolean {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    (!link.target || link.target === '_self') &&
    !link.hasAttribute('download') &&
    !!link.getAttribute('href')
  );
}
