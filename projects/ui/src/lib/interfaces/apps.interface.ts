import type { AppIconId } from './icon.interface';

/** An application of the domain in the switcher: its icon, its name and where a click leads. */
export interface UiAppInfo {
  id: AppIconId;
  title: string;
  href: string;
}

/** The answer of the portal GET /api/portal/auth/access — the modules of the account and whether each is open. */
export interface UiAccessAnswer {
  modules: { id: string; state: string }[];
}

/** Leaving for another application: what opens, its icon and the words on the cover. */
export interface UiLeaving {
  app: AppIconId | null;
  text: string;
}
