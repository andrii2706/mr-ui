# @mr/ui — бібліотека інтерфейсу платформи «Облік персоналу»

Окремий репозиторій `mr-ui`: бібліотека (`projects/ui`) і галерея (`projects/gallery`, `npm start` → http://localhost:4400).
Усе MIT і без ключів ліцензій: daisyUI 5 дає прості елементи класами, Angular CDK — поведінку (фокус, оверлеї, оголошення),
а поверх ідуть наші компоненти. За замовчуванням усе відповідає WCAG 2.2 AA.

## Як застосунок отримує бібліотеку

Пакет приватний: `@andrii2706/mr-ui` у GitHub Packages. Застосунок ставить його під іменем `@mr/ui` (аліас npm),
тож імпорт усюди `from '@mr/ui'`.

```bash
npm install @mr/ui@npm:@andrii2706/mr-ui     # у package.json: "@mr/ui": "npm:@andrii2706/mr-ui@^0.2.0"
```

- `.npmrc` поруч із `package.json` — `@andrii2706:registry=https://npm.pkg.github.com` і
  `//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}`; сам токен — лише у змінній середовища.
- `styles.css` — `@import 'tailwindcss';`, потім `@import '@mr/ui/theme.css';` і `@source '../node_modules/@mr/ui';`
  (без `@source` Tailwind не побачить класи всередині компонентів пакета).
- `index.html` — `<html lang="uk" data-theme="projects">`; теми: `portal` · `oblik` · `kadry` · `projects`.
- Корінь застосунку — `<ui-skip-link />` першим, далі `<main id="main" tabindex="-1">` і `<ui-long-action-host />`.
  Інжектнути `A11ySettingsService` у корені: тоді вибір людини з «Доступність» застосовується сам.

## Що є (0.1)

| Що                | Як                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Тема модуля       | `theme.css`: 4 теми daisyUI, виправлений контраст рамок і плейсхолдерів, фокус, цілі ≥ 24 px, менше руху, Windows high contrast |
| «Доступність»     | `<ui-a11y-panel />`, `A11ySettingsService` — розмір тексту, контраст, рух, посилання, інтервали, фокус; спільне для домену      |
| Перейти до змісту | `<ui-skip-link target="main" />`                                                                                                |
| Оголошення        | `AnnouncerService.polite()` / `.assertive()`                                                                                    |
| Іконки            | `<ui-icon name="calendar" />` (декоративна) або `label="Календар"` (role=img); `<ui-app-icon id="projects" />`                  |
| Лоадер сторінки   | `delayedBusy()` + `<ui-page-loader label="…" />` — м’ячик daisyUI, після 200 мс, щонайменше 400 мс                              |
| Кістяк частини    | `<ui-skeleton-list [rows]="3" [avatar]="true" />` або класи `.skeleton`                                                         |
| Кнопка в роботі   | `<button class="btn btn-primary" [uiBusy]="saving()" [disabled]="saving()">…</button>` — spinner, колір лишається               |
| Довга дія         | `LongActionService.run('Підписуємо…', () => …)` + `<ui-long-action-host />`; помилка — вікно відкривається знову з даними       |

## Правила

- **Сторінка** показує лоадер, **частина й мала дія** — кістяк, **кнопка** — spinner. Довга дія в модалці закриває модалку
  і показує лоадер; якщо дія не вдалася, модалка відкривається знову з усім, що людина ввела, і з причиною.
- Не лише колір: стан завжди дублюється словом або іконкою з назвою.
- Нічого не з’являється раніше ніж через 200 мс і не зникає раніше ніж через 400 мс.
- Кнопки `cursor-pointer`, ціль ≥ 24 × 24 px, фокус видно завжди (2 px, відступ 2 px; «Сильніший фокус» — 3 px + ореол).
- Високий контраст — білий ґрунт, темніший текст і сірі рамки (#8a8e82), без чорних обведень.

## Розробка

```bash
npm start            # галерея на :4400
npm test             # vitest: утиліти бібліотеки й галереї
npm run a11y         # axe-core WCAG 2.2 AA на кожній сторінці галереї (Chromium з Playwright)
npm run build        # ng-packagr → dist/ui
npm run sync -- ../projects   # скопіювати в застосунок
```

Компоненти daisyUI `button`, `card`, `badge`, `input`, `label` поки вимкнені, бо застосунки мають свої однойменні класи.
Їх увімкнуть на етапі 4.

Наступні етапи:

- 2 — поля: date-input, select, combobox, form-field;
- 3 — файли: завантаження, бланк, налаштування списків, аркуші наклейок, сортований список, мітки шаблонів, підпис КЕП;
- 4 — застосунки переходять на класи daisyUI.
