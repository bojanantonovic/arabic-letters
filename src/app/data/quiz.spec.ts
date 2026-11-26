import { ITEMS } from './letters';
import { ablenker, auswahl, frage, inPosition, Wuerfel } from './quiz';

/** Ein berechenbarer "Würfel": gibt eine feste Folge zurück. */
function folge(werte: number[]): Wuerfel {
  let i = 0;
  return () => werte[i++ % werte.length];
}

describe('Daten', () => {
  it('hat 27 Buchstaben und für jeden gleich viele Aufgaben', () => {
    const buchstaben = new Set(ITEMS.map((i) => i.letter));
    expect(buchstaben.size).toBe(27);
    const je = [...buchstaben].map((b) => ITEMS.filter((i) => i.letter === b).length);
    expect(new Set(je).size).toBe(1);
  });

  it('gibt jedem Eintrag eine Farbe und eine Lesung', () => {
    for (const i of ITEMS) {
      expect(i.reading.length).toBeGreaterThan(0);
      expect(i.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(i.parts.length).toBeGreaterThan(0);
      expect(i.parts[0].t.startsWith(i.letter)).toBe(true);
    }
  });

  it('lässt das Vokalzeichen bei seinem Buchstaben', () => {
    // Ein eigener Abschnitt fürs Zeichen würde es vom Buchstaben lösen;
    // der Browser setzt es dann freischwebend darunter.
    const mitZeichen = ITEMS.find((i) => i.variant === 'fatha')!;
    expect(mitZeichen.parts.length).toBe(1);
    expect(mitZeichen.parts[0].t).toBe(mitZeichen.text);
  });

  it('gibt dem angehängten Alif, Ya und Waw eine eigene Farbe', () => {
    for (const v of ['alif', 'ya', 'waw']) {
      const i = ITEMS.find((x) => x.variant === v && x.letter === 'ب')!;
      expect(i.parts.length).toBe(2);
      expect(i.parts[1].c).not.toBe(i.parts[0].c);
    }
  });
});

describe('Umfang', () => {
  it('"nackt" enthält nur Buchstaben ohne Zeichen', () => {
    expect(auswahl('nackt').every((i) => i.variant === 'blank')).toBe(true);
    expect(auswahl('nackt').length).toBe(27);
  });

  it('wächst von nackt über kurz zu alle', () => {
    expect(auswahl('nackt').length).toBeLessThan(auswahl('kurz').length);
    expect(auswahl('kurz').length).toBeLessThan(auswahl('alle').length);
  });
});

describe('Position', () => {
  it('givenUmfangAlle_whenAuswahl_thenKeineVerbundenenFormen', () => {
    // when
    const items = auswahl('alle');

    // then
    expect(items.some((i) => ['alif', 'ya', 'waw'].includes(i.variant))).toBe(false);
    expect(items.length).toBe(27 * 10);
  });

  it('givenAnfang_whenAuswahl_thenOhneBuchstabenOhneLinksanschluss', () => {
    // when
    const items = auswahl('alle', 'anfang');

    // then
    expect(items.some((i) => 'دذرزو'.includes(i.letter))).toBe(false);
    expect(items.some((i) => i.variant.startsWith('tan_'))).toBe(false);
  });

  it('givenEnde_whenAuswahl_thenAlleBuchstaben', () => {
    // when
    const items = auswahl('nackt', 'ende');

    // then
    expect(items.length).toBe(27);
  });

  it('givenBuchstabe_whenInPosition_thenVerbinderAnDerRichtigenSeite', () => {
    // given
    const joiner = '\u200D';

    // then
    expect(inPosition('ب', 'alleine')).toBe('ب');
    expect(inPosition('ب', 'anfang')).toBe('ب' + joiner);
    expect(inPosition('ب', 'mitte')).toBe(joiner + 'ب' + joiner);
    expect(inPosition('ب', 'ende')).toBe(joiner + 'ب');
  });
});

describe('Ablenker', () => {
  const pool = auswahl('alle');

  it('liefert vier, alle verschieden und keiner die richtige Antwort', () => {
    for (const item of pool.slice(0, 40)) {
      const a = ablenker(item, pool, Math.random);
      expect(a.length).toBe(4);
      expect(new Set(a).size).toBe(4);
      expect(a).not.toContain(item.reading);
    }
  });

  it('nimmt zuerst Buchstaben, die genauso aussehen', () => {
    // ب mit Fatha: ت und ث sehen allein stehend gleich aus
    const ba = pool.find((i) => i.letter === 'ب' && i.variant === 'fatha')!;
    const a = ablenker(ba, pool, folge([0]));
    const gleichAussehend = pool
      .filter((k) => k.rasm === ba.rasm && k.variant === ba.variant)
      .map((k) => k.reading);
    expect(a.filter((x) => gleichAussehend.includes(x)).length).toBeGreaterThanOrEqual(2);
  });
});

describe('Frage', () => {
  const pool = auswahl('alle');

  it('hat fünf Möglichkeiten, darunter genau die richtige', () => {
    for (let n = 0; n < 200; n++) {
      const f = frage(pool, Math.random);
      expect(f.optionen.length).toBe(5);
      expect(new Set(f.optionen).size).toBe(5);
      expect(f.optionen[f.richtig]).toBe(f.item.reading);
    }
  });

  it('stellt nicht zweimal hintereinander dieselbe Aufgabe', () => {
    const erste = frage(pool, Math.random);
    for (let n = 0; n < 100; n++) {
      expect(frage(pool, Math.random, erste.item.id).item.id).not.toBe(erste.item.id);
    }
  });

  it('verteilt die richtige Antwort gleichmässig auf alle fünf Plätze', () => {
    // given
    const zaehler = [0, 0, 0, 0, 0];

    // when
    for (let n = 0; n < 2000; n++) zaehler[frage(pool, Math.random).richtig]++;

    // then
    for (const z of zaehler) expect(z).toBeGreaterThan(300);
  });

  it('givenLetzterPlatz_whenFrage_thenRichtigWechseltDenPlatz', () => {
    // given
    const letzterPlatz = 0;

    // when / then
    for (let n = 0; n < 200; n++) {
      expect(frage(pool, Math.random, undefined, letzterPlatz).richtig).not.toBe(letzterPlatz);
    }
  });

  it('funktioniert auch im kleinsten Umfang', () => {
    const klein = auswahl('nackt');
    const f = frage(klein, Math.random);
    expect(f.optionen.length).toBe(5);
    expect(f.optionen[f.richtig]).toBe(f.item.reading);
  });
});
