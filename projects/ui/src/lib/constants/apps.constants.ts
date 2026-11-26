import type { UiAppInfo } from '../interfaces/apps.interface';

/**
 * The applications of the domain in the order of the switcher. A module opens through the SSO of the portal
 * (/api/portal/sso/<id>): the portal checks the access and the payment and signs the person in there — no password.
 */
export const UI_APPS: readonly UiAppInfo[] = [
  { id: 'portal', title: 'Портал', href: '/' },
  { id: 'oblik', title: 'Військовий облік', href: '/api/portal/sso/oblik' },
  { id: 'kadry', title: 'Облік працівників', href: '/api/portal/sso/kadry' },
  { id: 'projects', title: 'Керування проєктами', href: '/api/portal/sso/projects' },
];

/** What the account may open (the portal): the switcher shows only the open modules. */
export const UI_PORTAL_ACCESS_URL = '/api/portal/auth/access';

/** The cover of leaving goes away by itself if the next page has not come in this time (a download, a stop). */
export const UI_LEAVE_RESET_MS = 15_000;

/** Requests that change something — an action of the person; reading (GET) has the loaders of its page. */
export const UI_ACTION_METHODS: readonly string[] = ['POST', 'PUT', 'PATCH', 'DELETE'];
