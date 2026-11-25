import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Where the library lives now: what each application uses, how a new version reaches them, what changed. */
@Component({
  selector: 'app-apps-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-[26px] font-semibold">Застосунки</h1>
    <p class="mt-1 mb-6 max-w-[720px] text-muted">
      Усі чотири застосунки працюють на &#64;mr/ui {{ version }}: ставлять приватний пакет
      <code class="font-mono">&#64;andrii2706/mr-ui</code> з GitHub Packages під іменем
      <code class="font-mono">&#64;mr/ui</code> і імпортують
      <code class="font-mono">from '&#64;mr/ui'</code>; копій у
      <code class="font-mono">src/mr-ui</code> більше немає.
    </p>

    <section class="card overflow-x-auto" aria-labelledby="ap-use">
      <h2 id="ap-use" class="px-5 pt-4 pb-2 text-sm font-semibold">
        Що використовує кожен застосунок · кількість файлів
      </h2>
      <table class="w-full min-w-[720px] text-sm">
        <thead>
          <tr class="border-b border-line text-left text-xs text-muted">
            <th scope="col" class="px-5 py-2 font-medium">Застосунок</th>
            @for (c of columns; track c) {
              <th scope="col" class="px-3 py-2 font-mono font-medium">{{ c }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (a of apps; track a.name) {
            <tr class="border-b border-line last:border-0">
              <th scope="row" class="px-5 py-2.5 text-left font-medium">
                <span
                  class="mr-2 inline-block size-2.5 rounded-full"
                  [style.background]="a.color"
                  aria-hidden="true"
                ></span
                >{{ a.name }}
                <span class="block pl-[18px] font-mono text-xs font-normal text-muted">{{
                  a.path
                }}</span>
              </th>
              @for (n of a.uses; track $index) {
                <td class="px-3 py-2.5 tabular-nums" [class.text-muted]="!n">{{ n || '—' }}</td>
              }
            </tr>
          }
        </tbody>
      </table>
    </section>

    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <section class="card p-5" aria-labelledby="ap-sync">
        <h2 id="ap-sync" class="mb-3 text-sm font-semibold">Випустити нову версію</h2>
        <ol class="flex list-decimal flex-col gap-2 pl-5 text-sm">
          <li>
            Змінити код у <code class="font-mono">mr-ui/projects/ui</code>, підняти версію в
            <code class="font-mono">package.json</code> і CHANGELOG.
          </li>
          <li>
            <code class="font-mono">npm test</code> і <code class="font-mono">npm run a11y</code> у
            mr-ui.
          </li>
          <li>
            <code class="font-mono">git tag v0.3.0 &amp;&amp; git push origin v0.3.0</code> — CI
            публікує пакет.
          </li>
          <li>
            У кожному застосунку — <code class="font-mono">npm run ui:update</code>, закомітити
            <code class="font-mono">package.json</code> і
            <code class="font-mono">package-lock.json</code>.
          </li>
        </ol>
      </section>
      <section class="card p-5" aria-labelledby="ap-rm">
        <h2 id="ap-rm" class="mb-3 text-sm font-semibold">Прибрати копії (один раз)</h2>
        <pre class="overflow-x-auto rounded-lg bg-sunken p-3 font-mono text-xs leading-6">{{
          gitRm
        }}</pre>
      </section>
    </div>

    <section class="card mt-6 p-5" aria-labelledby="ap-log">
      <h2 id="ap-log" class="mb-3 text-sm font-semibold">Зміни {{ version }}</h2>
      <ul class="flex max-w-[860px] list-disc flex-col gap-2 pl-5 text-sm">
        @for (c of changes; track c) {
          <li>{{ c }}</li>
        }
      </ul>
    </section>
  `,
})
export class AppsPage {
  protected readonly version = '0.1.0';
  protected readonly columns = [
    'uiBusy',
    'ui-page-loader',
    'ui-skeleton-list',
    'delayedBusy',
    'ui-a11y-panel',
    'ui-icon',
  ];
  protected readonly apps = [
    { name: 'Портал', path: 'portal/web', color: '#1b1f17', uses: [8, 0, 0, 0, 1, 0] },
    {
      name: 'Військовий облік',
      path: 'military-registry/frontend',
      color: '#4f5f37',
      uses: [27, 2, 2, 0, 0, 1],
    },
    {
      name: 'Облік працівників',
      path: 'kadry/frontend',
      color: '#2f5a84',
      uses: [3, 4, 0, 3, 0, 0],
    },
    {
      name: 'Керування проєктами',
      path: 'projects/frontend',
      color: '#8a4b1c',
      uses: [8, 5, 2, 5, 0, 0],
    },
  ];
  protected readonly gitRm = [
    '# portal',
    'git rm -r web/src/mr-ui',
    '# military-registry, kadry, projects',
    'git rm -r frontend/src/mr-ui',
    '# mr-ui',
    'git rm scripts/sync.mjs',
  ].join('\n');
  protected readonly changes = [
    'Пакет @andrii2706/mr-ui у GitHub Packages (приватний): застосунки ставлять його як @mr/ui, копії src/mr-ui і scripts/sync.mjs прибрано.',
    'Поле дати й часу ui-date-input (ДД.ММ.РРРР, календар з місяцями й роками, години) і таймер бездіяльності UiIdleService + ui-idle-host.',
    'Високий контраст: білий ґрунт, темніші підписи, сірі рамки (#8a8e82) замість чорних обведень карток, бейджів і вкладок.',
    'Тема: 4 модулі на daisyUI 5, рамки полів 3,35 : 1, плейсхолдери 5,09 : 1, фокус 2 px, цілі ≥ 24 px, менше руху, Windows high contrast.',
    '«Доступність»: розмір тексту, контраст, рух, підкреслені посилання, інтервали, сильніший фокус — спільні для всього домену.',
    'Лоадери: сторінка — м’ячик, частина — кістяк, кнопка — spinner; з’являються після 200 мс, тримаються ≥ 400 мс.',
    'Довга дія: вікно закривається, сторінка поза досяжністю (inert); помилка — вікно знову з даними й причиною.',
    'Перевірка: axe-core WCAG 2.2 AA — 6 сторінок × 4 теми × звичайний і високий контраст, порушень немає.',
  ];
}
