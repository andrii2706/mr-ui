import { TestBed } from '@angular/core/testing';
import { UiActivityService } from '../services/activity.service';
import { UiAppSwitcherComponent } from './app-switcher.component';

describe('UiAppSwitcherComponent — інші застосунки домену', () => {
  afterEach(() => vi.unstubAllGlobals());

  async function render(current: string, answer: unknown, ok = true, rail = false) {
    const fetchMock = vi.fn(async () => ({ ok, json: async () => answer }));
    vi.stubGlobal('fetch', fetchMock);
    const fixture = TestBed.createComponent(UiAppSwitcherComponent);
    fixture.componentRef.setInput('current', current);
    fixture.componentRef.setInput('rail', rail);
    await fixture.whenStable();
    await new Promise((r) => setTimeout(r));
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement, fetchMock };
  }

  it('портал і відкриті модулі акаунта, без поточного; модуль — через SSO порталу', async () => {
    const { el, fetchMock } = await render('kadry', {
      modules: [
        { id: 'oblik', state: 'open' },
        { id: 'kadry', state: 'open' },
        { id: 'projects', state: 'payment' },
      ],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/portal/auth/access',
      expect.objectContaining({ credentials: 'same-origin' }),
    );
    const links = [...el.querySelectorAll('a')];
    expect(links.map((a) => [a.textContent?.trim(), a.getAttribute('href')])).toEqual([
      ['Портал', '/'],
      ['Військовий облік', '/api/portal/sso/oblik'],
    ]);
    expect(el.querySelector('nav')?.getAttribute('aria-label')).toBe('Застосунки');
  });

  it('без сесії порталу — лише «Портал»; клік — заставка «Повертаємо на портал…»', async () => {
    const { el } = await render('oblik', { message: 'Unauthorized' }, false);
    const links = [...el.querySelectorAll('a')];
    expect(links.map((a) => a.textContent?.trim())).toEqual(['Портал']);
    links[0]!.addEventListener('click', (e) => e.preventDefault());
    links[0]!.dispatchEvent(
      new MouseEvent('click', { button: 0, bubbles: true, cancelable: true }),
    );
    // preventDefault is called by the test listener after the directive: the directive still sees a plain click
    expect(TestBed.inject(UiActivityService).leaving()?.text).toBe('Повертаємо на портал…');
  });

  it('рейка іконок — назва в title й aria-label', async () => {
    const { el } = await render('oblik', { modules: [] }, true, true);
    const a = el.querySelector('a')!;
    expect(a.getAttribute('aria-label')).toBe('Портал');
    expect(a.querySelector('span')?.classList).toContain('lg:hidden');
  });
});
