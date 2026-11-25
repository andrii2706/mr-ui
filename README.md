# mr-ui

**@mr/ui** — бібліотека інтерфейсу платформи «Облік персоналу» (daisyUI 5 + Angular CDK, WCAG 2.2 AA) і її галерея.
Репозиторій лежить поруч із `portal`, `military-registry`, `kadry`, `projects`.

```bash
npm ci
npm start                     # галерея → http://localhost:4400
npm test                      # тести бібліотеки й галереї
npm run a11y                  # axe-core WCAG 2.2 AA: усі сторінки × 4 теми × звичайний / високий контраст
npm run build                 # пакет у dist/ui; npm run pack — ще й архів .tgz для перевірки
```

## Пакет у GitHub Packages

Бібліотека — приватний пакет **`@andrii2706/mr-ui`** у GitHub Packages. Застосунки ставлять його під іменем `@mr/ui`:

```json
"@mr/ui": "npm:@andrii2706/mr-ui@^0.2.0"
```

У пакет потрапляє лише зібраний `dist/ui` (код, типи, `theme.css`, README, CHANGELOG) — без тестів, галереї й `.env`.

### Нова версія

1. Підняти `version` у `projects/ui/package.json`, дописати `projects/ui/CHANGELOG.md`.
2. `git tag v0.2.0 && git push origin v0.2.0` — workflow `Release` перевірить тег, тести й збірку і опублікує пакет
   власним `GITHUB_TOKEN` (особистих токенів для публікації немає).
3. У застосунках — `npm run ui:update`, закомітити `package.json` і `package-lock.json`.

### Хто може читати (налаштувати один раз)

- **Пакет → Package settings → Manage Actions access:** додати `people-accounting`, `portal`, `kadry`, `projects` з роллю
  Read. Тоді їхні workflow читають пакет своїм `GITHUB_TOKEN` (`permissions: packages: read`).
- **Ваш комп’ютер:** GitHub → Settings → Developer settings → Tokens (classic) → лише `read:packages`, строк — 90 днів.
  Windows: `setx NODE_AUTH_TOKEN "ghp_…"` і новий термінал; macOS/Linux — `export NODE_AUTH_TOKEN=…` у профілі оболонки.
  Токен не пишуть у `.npmrc` проєкту і не комітять. (GitHub Packages для npm приймає лише класичні токени.)
- **Firebase App Hosting** (військовий облік): `firebase apphosting:secrets:set GITHUB_PACKAGES_TOKEN` — окремий класичний
  токен лише з `read:packages`; `apphosting.yaml` дає його `npm ci` тільки на етапі збірки.
- **Docker / docker compose:** `NODE_AUTH_TOKEN` береться зі змінної оболонки як build secret `npm_token` і не лишається
  в образі.

Безкоштовно: 500 МБ сховища й 1 ГБ трафіку на місяць (GitHub Free); завантаження з Actions через `GITHUB_TOKEN` не рахуються.

Документація бібліотеки, правила лоадерів і доступності — [projects/ui/README.md](projects/ui/README.md), зміни —
[projects/ui/CHANGELOG.md](projects/ui/CHANGELOG.md).
