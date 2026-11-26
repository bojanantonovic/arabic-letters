import type { Position, Umfang } from '../data/quiz';

export type Sprache = 'de' | 'en';

/**
 * Alle Texte der Oberfläche. Eine Sprache, der ein Eintrag fehlt, lässt
 * sich nicht übersetzen - der Compiler achtet auf Vollständigkeit.
 */
export interface Texte {
  seitentitel: string;
  ueberschrift: string;
  untertitel: string;
  sprachwahl: string;

  umfangGruppe: string;
  umfaenge: Record<Umfang, string>;
  positionGruppe: string;
  positionen: Record<Position, string>;

  frageNummer: (nummer: number, anzahl: number) => string;
  punktestand: (richtig: number, gesamt: number) => string;
  prozent: (quote: number) => string;
  inFolge: (serie: number) => string;

  aufgabe: string;
  richtig: string;
  /** steht vor der richtigen Aussprache */
  falsch: string;
  weiter: string;
  zurAuswertung: string;

  rundeBeendet: string;
  rundenergebnis: (richtig: number, anzahl: number) => string;
  fehlerfrei: string;
  falschGewaehlt: string;
  neueRunde: string;

  laengsteSerie: (serie: number) => string;
  zuruecksetzen: string;
}

const DE: Texte = {
  seitentitel: 'Arabische Buchstaben – Quiz',
  ueberschrift: 'Die arabischen Buchstaben',
  untertitel: 'Ein Buchstabe — wie wird er ausgesprochen?',
  sprachwahl: 'Sprache',

  umfangGruppe: 'Umfang der Aufgaben',
  umfaenge: { nackt: 'nur Buchstaben', kurz: 'mit kurzem Vokal', alle: 'alle Zeichen' },
  positionGruppe: 'Stellung im Wort',
  positionen: { alleine: 'Alleine', anfang: 'Anfang', mitte: 'Mitte', ende: 'Ende' },

  frageNummer: (nummer, anzahl) => `Frage ${nummer} / ${anzahl}`,
  punktestand: (richtig, gesamt) => `${richtig} von ${gesamt}`,
  prozent: (quote) => `${quote} %`,
  inFolge: (serie) => `${serie} in Folge`,

  aufgabe: 'Wie wird das ausgesprochen?',
  richtig: 'Richtig.',
  falsch: 'Nicht ganz — es ist',
  weiter: 'Weiter',
  zurAuswertung: 'Auswertung',

  rundeBeendet: 'Runde beendet',
  rundenergebnis: (richtig, anzahl) => `${richtig} von ${anzahl} richtig.`,
  fehlerfrei: 'Fehlerfrei — kein Buchstabe falsch gewählt.',
  falschGewaehlt: 'Diese Buchstaben wurden falsch gewählt:',
  neueRunde: 'Neue Runde',

  laengsteSerie: (serie) => `längste Serie: ${serie}`,
  zuruecksetzen: 'zurücksetzen',
};

const EN: Texte = {
  seitentitel: 'Arabic Letters – Quiz',
  ueberschrift: 'The Arabic Letters',
  untertitel: 'One letter — how is it pronounced?',
  sprachwahl: 'Language',

  umfangGruppe: 'Range of questions',
  umfaenge: { nackt: 'letters only', kurz: 'with short vowel', alle: 'all marks' },
  positionGruppe: 'Position in the word',
  positionen: { alleine: 'Isolated', anfang: 'Initial', mitte: 'Medial', ende: 'Final' },

  frageNummer: (nummer, anzahl) => `Question ${nummer} / ${anzahl}`,
  punktestand: (richtig, gesamt) => `${richtig} of ${gesamt}`,
  prozent: (quote) => `${quote}%`,
  inFolge: (serie) => `${serie} in a row`,

  aufgabe: 'How is this pronounced?',
  richtig: 'Correct.',
  falsch: 'Not quite — it is',
  weiter: 'Next',
  zurAuswertung: 'Results',

  rundeBeendet: 'Round finished',
  rundenergebnis: (richtig, anzahl) => `${richtig} of ${anzahl} correct.`,
  fehlerfrei: 'Flawless — you did not miss a single letter.',
  falschGewaehlt: 'You missed these letters:',
  neueRunde: 'New round',

  laengsteSerie: (serie) => `longest streak: ${serie}`,
  zuruecksetzen: 'reset',
};

export const TEXTE: Record<Sprache, Texte> = { de: DE, en: EN };
