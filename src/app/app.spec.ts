import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
  });

  it('startet', () => {
    expect(TestBed.createComponent(App).componentInstance).toBeTruthy();
  });

  it('zeigt eine Überschrift und das Quiz', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('arabischen Buchstaben');
    expect(el.querySelector('app-quiz')).toBeTruthy();
  });
});
