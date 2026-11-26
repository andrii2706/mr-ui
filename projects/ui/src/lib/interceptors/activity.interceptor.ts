import { HttpContextToken, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { UI_ACTION_METHODS } from '../constants/apps.constants';
import { UiActivityService } from '../services/activity.service';

/** A request that is not an action of the person (a heartbeat, an autosave) — no bar for it. */
export const UI_QUIET_REQUEST = new HttpContextToken<boolean>(() => false);

/**
 * Every request that changes something (POST, PUT, PATCH, DELETE) shows the thin bar of ui-activity-host while it
 * runs — the loader of any action of every application without touching each button.
 *
 *   provideHttpClient(withInterceptors([apiInterceptor, uiActivityInterceptor]))
 */
export const uiActivityInterceptor: HttpInterceptorFn = (req, next) => {
  if (!UI_ACTION_METHODS.includes(req.method) || req.context.get(UI_QUIET_REQUEST))
    return next(req);
  const end = inject(UiActivityService).begin();
  return next(req).pipe(finalize(end));
};
