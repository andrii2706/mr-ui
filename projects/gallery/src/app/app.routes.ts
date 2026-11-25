import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Огляд · @mr/ui',
    loadComponent: () => import('./pages/overview.page').then((m) => m.OverviewPage),
  },
  {
    path: 'theme',
    title: 'Тема й контраст · @mr/ui',
    loadComponent: () => import('./pages/theme.page').then((m) => m.ThemePage),
  },
  {
    path: 'icons',
    title: 'Іконки · @mr/ui',
    loadComponent: () => import('./pages/icons.page').then((m) => m.IconsPage),
  },
  {
    path: 'loaders',
    title: 'Лоадери · @mr/ui',
    loadComponent: () => import('./pages/loaders.page').then((m) => m.LoadersPage),
  },
  {
    path: 'dates',
    title: 'Поле дати · @mr/ui',
    loadComponent: () => import('./pages/dates.page').then((m) => m.DatesPage),
  },
  {
    path: 'long-action',
    title: 'Довга дія · @mr/ui',
    loadComponent: () => import('./pages/long-action.page').then((m) => m.LongActionPage),
  },
  {
    path: 'a11y',
    title: 'Доступність · @mr/ui',
    loadComponent: () => import('./pages/a11y.page').then((m) => m.A11yPage),
  },
  {
    path: 'apps',
    title: 'Застосунки · @mr/ui',
    loadComponent: () => import('./pages/apps.page').then((m) => m.AppsPage),
  },
  { path: '**', redirectTo: '' },
];
