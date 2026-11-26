import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UiActivityHostComponent } from '../components/activity-host.component';
import { UI_QUIET_REQUEST, uiActivityInterceptor } from '../interceptors/activity.interceptor';
import { UiActivityService } from './activity.service';

describe('UiActivityService — лоадери дій і переходів', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([uiActivityInterceptor])),
        provideHttpClientTesting(),
      ],
    });
  });
  afterEach(() => vi.useRealTimers());

  it('дія (POST) — смужка вгорі після 200 мс; читання (GET) і «тихий» запит — без неї', async () => {
    const http = TestBed.inject(HttpClient);
    const backend = TestBed.inject(HttpTestingController);
    const activity = TestBed.inject(UiActivityService);
    const fixture = TestBed.createComponent(UiActivityHostComponent);
    const bar = () => fixture.nativeElement.querySelector('[role=progressbar]');

    http.get('/api/items').subscribe();
    http
      .post('/api/touch', {}, { context: new HttpContext().set(UI_QUIET_REQUEST, true) })
      .subscribe();
    expect(activity.busy()).toBe(false);
    backend.expectOne('/api/items').flush([]);
    backend.expectOne('/api/touch').flush({});

    http.post('/api/items', { name: 'x' }).subscribe({ error: () => undefined });
    expect(activity.busy()).toBe(true);
    fixture.detectChanges();
    expect(bar()).toBeNull();
    vi.advanceTimersByTime(250);
    fixture.detectChanges();
    expect(bar()?.getAttribute('aria-label')).toBe('Виконується дія');
    backend
      .expectOne({ method: 'POST', url: '/api/items' })
      .flush({}, { status: 500, statusText: 'x' });
    expect(activity.busy()).toBe(false);
    vi.advanceTimersByTime(500);
    fixture.detectChanges();
    expect(bar()).toBeNull();
  });

  it('кінець дії — один раз, скільки б не викликали', () => {
    const activity = TestBed.inject(UiActivityService);
    const a = activity.begin();
    const b = activity.begin();
    a();
    a();
    expect(activity.busy()).toBe(true);
    b();
    expect(activity.busy()).toBe(false);
  });

  it('перехід в інший застосунок — заставка одразу; «назад» з кешу браузера і 15 с — прибирають', () => {
    const activity = TestBed.inject(UiActivityService);
    const fixture = TestBed.createComponent(UiActivityHostComponent);
    activity.leave('Облік працівників', 'kadry');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[role=status]')?.textContent).toContain(
      'Відкриваємо «Облік працівників»…',
    );
    expect(el.querySelector('ui-app-icon')).not.toBeNull();

    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false }));
    expect(activity.leaving()).not.toBeNull();
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
    expect(activity.leaving()).toBeNull();

    activity.leave('Портал', 'portal');
    fixture.detectChanges();
    expect(el.textContent).toContain('Повертаємо на портал…');
    vi.advanceTimersByTime(15_000);
    expect(activity.leaving()).toBeNull();
  });
});
