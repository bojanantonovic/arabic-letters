import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { BROWSER_SPRACHEN, SPEICHER } from './i18n/uebersetzung';
import { speicherAttrappe } from './i18n/uebersetzung.fixtures';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: BROWSER_SPRACHEN, useValue: ['de-CH'] },
        { provide: SPEICHER, useValue: speicherAttrappe() },
      ],
    }).compileComponents();
  });

  it('givenApp_whenErzeugt_thenStartet', () => {
    // when
    const fixture = TestBed.createComponent(App);

    // then
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('givenDeutscherBrowser_whenAngezeigt_thenDeutscheUeberschriftUndQuiz', async () => {
    // given
    const fixture = TestBed.createComponent(App);

    // when
    await fixture.whenStable();

    // then
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('arabischen Buchstaben');
    expect(el.querySelector('app-quiz')).toBeTruthy();
  });

  it('givenDeutsch_whenEnglischGewaehlt_thenOberflaecheUndSeiteAufEnglisch', async () => {
    // given
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    // when
    el.querySelector<HTMLButtonElement>('.sprachen button[lang="en"]')!.click();
    await fixture.whenStable();

    // then
    expect(el.querySelector('h1')?.textContent).toContain('The Arabic Letters');
    expect(el.querySelector('.aufgabe')?.textContent).toContain('How is this pronounced?');
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe('Arabic Letters – Quiz');
  });

  it('givenBeantworteteFrage_whenSpracheGewechselt_thenStandBleibt', async () => {
    // given
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    el.querySelector<HTMLButtonElement>('.option')!.click();
    await fixture.whenStable();
    const glyphe = el.querySelector('.glyphe')?.textContent;

    // when
    el.querySelector<HTMLButtonElement>('.sprachen button[lang="en"]')!.click();
    await fixture.whenStable();

    // then
    expect(el.querySelector('.glyphe')?.textContent).toBe(glyphe);
    expect(el.querySelector('.zaehler')?.textContent).toContain('of 1');
    expect(el.querySelector('.weiter')?.textContent).toContain('Next');
  });
});
