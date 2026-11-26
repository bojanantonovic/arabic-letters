import { Item, ITEMS } from './letters';

/** Eine fertige Frage: das Schriftbild und fünf Aussprachen zur Wahl. */
export interface Frage {
  item: Item;
  optionen: string[];
  richtig: number;
}

/** Welche Erweiterungen überhaupt vorkommen dürfen. */
export type Umfang = 'nackt' | 'kurz' | 'alle';

/** Wo im Wort der Buchstabe steht. */
export type Position = 'alleine' | 'anfang' | 'mitte' | 'ende';

const KURZ = new Set(['blank', 'fatha', 'kasra', 'damma']);

/** Angehängtes Alif, Ya, Waw: das Schriftbild ist dann verbunden. */
const VERBUNDEN = new Set(['alif', 'ya', 'waw']);

const TANWIN = new Set(['tan_a', 'tan_i', 'tan_u']);

/** Buchstaben, die nie nach links anschliessen: ohne Anfangs- und Mittelform. */
const NICHT_LINKS = new Set(['ا', 'د', 'ذ', 'ر', 'ز', 'و']);

/** Zero Width Joiner: zwingt den Buchstaben in die verbundene Form. */
const ZWJ = '\u200D';

export function auswahl(umfang: Umfang, position: Position = 'alleine'): Item[] {
  let items = ITEMS.filter((i) => !VERBUNDEN.has(i.variant));
  if (umfang === 'nackt') items = items.filter((i) => i.variant === 'blank');
  if (umfang === 'kurz') items = items.filter((i) => KURZ.has(i.variant));
  if (position === 'anfang' || position === 'mitte') {
    // Tanwīn steht nur am Wortende, und manche Buchstaben haben keine
    // Form, die nach links anschliesst.
    items = items.filter((i) => !NICHT_LINKS.has(i.letter) && !TANWIN.has(i.variant));
  }
  return items;
}

/** Das Schriftbild eines Buchstabens (samt Zeichen) in seiner Position. */
export function inPosition(text: string, position: Position): string {
  switch (position) {
    case 'anfang':
      return text + ZWJ;
    case 'mitte':
      return ZWJ + text + ZWJ;
    case 'ende':
      return ZWJ + text;
    default:
      return text;
  }
}

/** Zufallszahl 0..n-1. Als Parameter, damit Tests fest vorgeben können. */
export type Wuerfel = () => number;

function zieh<T>(xs: T[], w: Wuerfel): T {
  return xs[Math.floor(w() * xs.length)];
}

function mische<T>(xs: T[], w: Wuerfel): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(w() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Die vier falschen Antworten werden nicht beliebig gezogen, sondern so,
 * dass sie wehtun: zuerst Buchstaben, die GENAUSO AUSSEHEN wie der
 * gefragte (dieselbe Rasm-Familie) und dasselbe Vokalzeichen tragen - wer
 * ب und ث verwechselt, soll genau diese Wahl vorgelegt bekommen. Dann
 * derselbe Buchstabe mit einem ANDEREN Zeichen, damit auch das Zeichen
 * gelesen werden muss. Erst danach irgendetwas anderes.
 */
export function ablenker(item: Item, pool: Item[], w: Wuerfel, n = 4): string[] {
  const aus: string[] = [];
  const gesehen = new Set([item.reading]);

  const nimm = (kandidaten: Item[]) => {
    for (const k of mische(kandidaten, w)) {
      if (aus.length >= n) return;
      if (gesehen.has(k.reading)) continue;
      gesehen.add(k.reading);
      aus.push(k.reading);
    }
  };

  // 1. sieht gleich aus, gleiches Zeichen
  nimm(pool.filter((k) => k.rasm === item.rasm && k.variant === item.variant));
  // 2. gleicher Buchstabe, anderes Zeichen
  nimm(pool.filter((k) => k.letter === item.letter));
  // 3. gleiches Zeichen, irgendein Buchstabe
  nimm(pool.filter((k) => k.variant === item.variant));
  // 4. was übrig bleibt
  nimm(pool);
  return aus;
}

/**
 * Die richtige Antwort bekommt ihren Platz zuerst und unabhängig von den
 * Ablenkern, gleichverteilt, und nie zweimal hintereinander denselben -
 * sonst wirkt der Zufall schnell wie ein Muster.
 */
export function frage(pool: Item[], w: Wuerfel, letzte?: string, letzterPlatz?: number): Frage {
  const moeglich = letzte && pool.length > 1 ? pool.filter((i) => i.id !== letzte) : pool;
  const item = zieh(moeglich, w);
  const falsche = mische(ablenker(item, pool, w), w);
  const plaetze = Array.from({ length: falsche.length + 1 }, (_, i) => i).filter(
    (i) => i !== letzterPlatz,
  );
  const richtig = zieh(plaetze, w);
  const optionen = [...falsche];
  optionen.splice(richtig, 0, item.reading);
  return { item, optionen, richtig };
}
