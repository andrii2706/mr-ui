import type { AppIconId } from '@mr/ui';

/** The four themes the library knows — one per application of the domain. */
export const MODULES: readonly { id: AppIconId; title: string; color: string }[] = [
  { id: 'projects', title: 'Керування проєктами', color: '#8a4b1c' },
  { id: 'kadry', title: 'Облік працівників', color: '#2f5a84' },
  { id: 'oblik', title: 'Військовий облік', color: '#4f5f37' },
  { id: 'portal', title: 'Портал', color: '#1b1f17' },
];

export const NAV: readonly { path: string; label: string }[] = [
  { path: '', label: 'Огляд' },
  { path: 'theme', label: 'Тема й контраст' },
  { path: 'icons', label: 'Іконки' },
  { path: 'loaders', label: 'Лоадери' },
  { path: 'dates', label: 'Поле дати' },
  { path: 'long-action', label: 'Довга дія' },
  { path: 'a11y', label: 'Доступність' },
  { path: 'apps', label: 'Застосунки' },
];

/** Colour pairs of the theme and what WCAG 2.2 asks of them: 4.5 for words, 3 for edges of controls. */
export const CONTRAST_PAIRS: readonly {
  name: string;
  fg: string;
  bg: string;
  need: number;
  note: string;
}[] = [
  { name: 'Текст', fg: '#1b1f17', bg: '#ffffff', need: 4.5, note: '' },
  { name: 'Приглушений текст', fg: '#5d6356', bg: '#ffffff', need: 4.5, note: 'підписи, підказки' },
  { name: 'Приглушений на тлі', fg: '#5d6356', bg: '#f7f7f4', need: 4.5, note: '' },
  { name: 'Проєкти', fg: '#8a4b1c', bg: '#ffffff', need: 4.5, note: 'кнопки, посилання' },
  { name: 'Облік працівників', fg: '#2f5a84', bg: '#ffffff', need: 4.5, note: '' },
  { name: 'Військовий облік', fg: '#4f5f37', bg: '#ffffff', need: 4.5, note: '' },
  { name: 'Помилка', fg: '#b42318', bg: '#ffffff', need: 4.5, note: '' },
  { name: 'Попередження', fg: '#b54708', bg: '#ffffff', need: 4.5, note: '' },
  {
    name: 'Рамка поля',
    fg: '#8a8e82',
    bg: '#ffffff',
    need: 3,
    note: '1.4.11 (було #d8d7cf — 1,44)',
  },
  {
    name: 'Плейсхолдер',
    fg: '#6b7064',
    bg: '#ffffff',
    need: 4.5,
    note: '1.4.3 (було #80867a — 3,74)',
  },
  {
    name: 'Високий контраст: рамки',
    fg: '#8a8e82',
    bg: '#ffffff',
    need: 3,
    note: 'сірі, не чорні',
  },
];
