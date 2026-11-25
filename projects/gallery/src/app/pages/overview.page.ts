import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** What the library is, how an application connects it, what is in it now. */
@Component({
  selector: 'app-overview-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <h1 class="text-[26px] font-semibold">@mr/ui</h1>
    <p class="mt-1 max-w-[720px] text-muted">
      Бібліотека інтерфейсу платформи «Облік персоналу»: портал, військовий облік, облік
      працівників, проєкти. daisyUI — прості елементи класами, Angular CDK — поведінка, поверх —
      наші компоненти. Усе MIT. Мета — WCAG 2.2 AA за замовчуванням.
    </p>

    <h2 class="mt-8 mb-3 text-lg font-semibold">Як підключити</h2>
    <ol class="flex max-w-[860px] list-decimal flex-col gap-3 pl-5 text-sm">
      <li>
        <code class="font-mono">.npmrc</code> застосунку:
        <code class="font-mono">&#64;andrii2706:registry=https://npm.pkg.github.com</code> і
        <code class="font-mono"
          >//npm.pkg.github.com/:_authToken=&#36;{{ '{' }}NODE_AUTH_TOKEN{{ '}' }}</code
        >
        — токена у файлі немає, він у змінній.
      </li>
      <li>
        <code class="rounded bg-sunken px-1.5 py-0.5 font-mono"
          >npm install &#64;mr/ui&#64;npm:&#64;andrii2706/mr-ui</code
        >
        — пакет ляже як <code class="font-mono">&#64;mr/ui</code>, імпорти:
        <code class="font-mono">import {{ '{' }} UiIconComponent {{ '}' }} from '&#64;mr/ui'</code>.
      </li>
      <li>
        <code class="font-mono">styles.css</code>: після
        <code class="font-mono">&#64;import 'tailwindcss';</code> —
        <code class="font-mono">&#64;import '&#64;mr/ui/theme.css';</code> і
        <code class="font-mono">&#64;source '../node_modules/&#64;mr/ui';</code>;
        <code class="font-mono">index.html</code>:
        <code class="font-mono">&lt;html lang="uk" data-theme="projects"&gt;</code>.
      </li>
      <li>
        Корінь застосунку: <code class="font-mono">&lt;ui-skip-link /&gt;</code> першим,
        <code class="font-mono">&lt;main id="main"&gt;</code>,
        <code class="font-mono">&lt;ui-long-action-host /&gt;</code>, інжект
        <code class="font-mono">A11ySettingsService</code>.
      </li>
    </ol>

    <h2 class="mt-8 mb-3 text-lg font-semibold">Що є</h2>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      @for (g of groups; track g.title) {
        <a [routerLink]="g.path" class="card block p-4 no-underline hover:border-[#c9c8bf]">
          <b class="block">{{ g.title }}</b>
          <span class="mt-1 block text-sm text-muted">{{ g.text }}</span>
        </a>
      }
    </div>
  `,
})
export class OverviewPage {
  protected readonly groups = [
    {
      path: '/theme',
      title: 'Тема й контраст',
      text: '4 теми модулів, перевірка контрасту WCAG, фокус, цілі ≥ 24 px.',
    },
    {
      path: '/icons',
      title: 'Іконки',
      text: '57 іконок і плитки модулів; назва — коли іконка сама по собі.',
    },
    {
      path: '/loaders',
      title: 'Лоадери',
      text: 'Сторінка — м’ячик, частина — кістяк, кнопка — spinner; 200 / 400 мс.',
    },
    {
      path: '/long-action',
      title: 'Довга дія',
      text: 'Вікно закривається, лоадер на сторінці; помилка — вікно з даними.',
    },
    {
      path: '/a11y',
      title: 'Доступність',
      text: 'Панель «Доступність», «Перейти до змісту», оголошення для читачів.',
    },
    {
      path: '/apps',
      title: 'Застосунки',
      text: 'Хто що використовує, як оновити копію, зміни версії.',
    },
  ];
}
