import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { delayedBusy } from './loading.utils';

@Component({ selector: 'ui-test-host', template: '' })
class Host {
  readonly busy = signal(false);
  readonly visible = delayedBusy(this.busy, 200, 400);
}

describe('delayedBusy', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const make = () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  };
  const flush = (fixture: ReturnType<typeof make>, ms: number) => {
    TestBed.tick();
    vi.advanceTimersByTime(ms);
    fixture.detectChanges();
  };

  it('shows nothing when the answer is fast', () => {
    const f = make();
    f.componentInstance.busy.set(true);
    flush(f, 150);
    f.componentInstance.busy.set(false);
    flush(f, 300);
    expect(f.componentInstance.visible()).toBe(false);
  });

  it('appears after the delay and stays at least the minimum', () => {
    const f = make();
    f.componentInstance.busy.set(true);
    flush(f, 210);
    expect(f.componentInstance.visible()).toBe(true);
    f.componentInstance.busy.set(false);
    flush(f, 100);
    expect(f.componentInstance.visible()).toBe(true);
    flush(f, 320);
    expect(f.componentInstance.visible()).toBe(false);
  });
});
