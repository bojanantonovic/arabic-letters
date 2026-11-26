import { TestBed } from '@angular/core/testing';
import { BROWSER_SPRACHEN, SPEICHER, SPEICHER_SCHLUESSEL, Uebersetzung } from './uebersetzung';
import { speicherAttrappe } from './uebersetzung.fixtures';

function erzeuge(browser: string[], speicher: Storage | null): Uebersetzung {
  TestBed.configureTestingModule({
    providers: [
      { provide: BROWSER_SPRACHEN, useValue: browser },
      { provide: SPEICHER, useValue: speicher },
    ],
  });
  return TestBed.inject(Uebersetzung);
}

describe('Uebersetzung', () => {
  it('givenDeutscherBrowser_whenErzeugt_thenDeutsch', () => {
    // when
    const uebersetzung = erzeuge(['de-CH', 'en'], speicherAttrappe());

    // then
    expect(uebersetzung.sprache()).toBe('de');
  });

  it('givenErsteSpracheUnbekannt_whenErzeugt_thenNaechsteBekannte', () => {
    // when
    const uebersetzung = erzeuge(['fr-FR', 'de-DE'], speicherAttrappe());

    // then
    expect(uebersetzung.sprache()).toBe('de');
  });

  it('givenKeineBekannteSprache_whenErzeugt_thenEnglisch', () => {
    // when
    const uebersetzung = erzeuge(['fr-FR'], speicherAttrappe());

    // then
    expect(uebersetzung.sprache()).toBe('en');
  });

  it('givenGemerkteSprache_whenErzeugt_thenSieGehtVor', () => {
    // given
    const speicher = speicherAttrappe({ [SPEICHER_SCHLUESSEL]: 'en' });

    // when
    const uebersetzung = erzeuge(['de-CH'], speicher);

    // then
    expect(uebersetzung.sprache()).toBe('en');
  });

  it('givenUnsinnImSpeicher_whenErzeugt_thenBrowsersprache', () => {
    // given
    const speicher = speicherAttrappe({ [SPEICHER_SCHLUESSEL]: 'toString' });

    // when
    const uebersetzung = erzeuge(['de-CH'], speicher);

    // then
    expect(uebersetzung.sprache()).toBe('de');
  });

  it('givenSpeicher_whenWaehle_thenWahlGemerkt', () => {
    // given
    const speicher = speicherAttrappe();
    const uebersetzung = erzeuge(['de-CH'], speicher);

    // when
    uebersetzung.waehle('en');

    // then
    expect(speicher.getItem(SPEICHER_SCHLUESSEL)).toBe('en');
  });

  it('givenKeinSpeicher_whenWaehle_thenSpracheTrotzdemGewechselt', () => {
    // given
    const uebersetzung = erzeuge(['de-CH'], null);

    // when
    uebersetzung.waehle('en');

    // then
    expect(uebersetzung.sprache()).toBe('en');
  });
});
