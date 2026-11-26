import type { Item } from '../data/letters';
import type { Sprache } from './texte';

/*
 * Die sprachabhängigen Teile der Aufgaben. Deutsch steht in
 * data/letters.ts und kommt aus dem Buch. Das Buch gibt es nur auf
 * Deutsch, darum wird das Englische hier von Hand gepflegt.
 */

/** Das Buch schreibt das lange a als ä; im Englischen ist ā üblich. */
const LANGES_A_DEUTSCH = 'ä';
const LANGES_A_ENGLISCH = 'ā';

/** Lautbeschreibungen je Buchstabe, an englische Beispielwörter angepasst. */
export const HINWEISE_EN: Readonly<Record<string, string>> = {
  ب: 'b',
  ت: 't',
  ث: 'th as in think',
  ج: 'j as in jungle',
  ح: 'h, pressed from deep in the throat',
  خ: 'ch as in Scottish loch',
  د: 'd',
  ذ: 'th as in this',
  ر: 'rolled r',
  ز: 'z as in zoo',
  س: 'sharp s as in sun',
  ش: 'sh as in shoe',
  ص: 's with the tongue drawn back',
  ض: 'd with the tongue drawn back',
  ط: 't with the tongue drawn back',
  ظ: 'th as in this, with the tongue drawn back',
  ع: 'a squeezed sound from the throat — English has nothing like it',
  غ: 'an r made at the uvula, like the French r',
  ف: 'f',
  ق: 'k, far back against the soft palate',
  ك: 'k',
  ل: 'l',
  م: 'm',
  ن: 'n',
  ه: 'h as in house',
  و: 'w as in water; as a vowel, a long u',
  ي: 'y as in yes; as a vowel, a long i',
};

/** Beschriftung je Erweiterung, Schlüssel wie Item.variant. */
export const VARIANTEN_EN: Readonly<Record<string, string>> = {
  blank: 'without marks',
  fatha: 'with Fatḥa',
  kasra: 'with Kasra',
  damma: 'with Ḍamma',
  alif: 'with long a',
  ya: 'with long i',
  waw: 'with long u',
  sch_a: 'doubled, with Fatḥa',
  sch_i: 'doubled, with Kasra',
  sch_u: 'doubled, with Ḍamma',
  tan_a: 'with Tanwīn -an',
  tan_i: 'with Tanwīn -in',
  tan_u: 'with Tanwīn -un',
};

/** Aussprache oder Buchstabenname in der Umschrift der Sprache. */
export function umschrift(text: string, sprache: Sprache): string {
  return sprache === 'en' ? text.replaceAll(LANGES_A_DEUTSCH, LANGES_A_ENGLISCH) : text;
}

export function variantenName(item: Item, sprache: Sprache): string {
  return sprache === 'en' ? VARIANTEN_EN[item.variant] : item.variantLabel;
}

export function lautHinweis(item: Item, sprache: Sprache): string {
  return sprache === 'en' ? HINWEISE_EN[item.letter] : item.hint;
}
