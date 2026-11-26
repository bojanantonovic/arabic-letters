import {
  computed,
  DOCUMENT,
  effect,
  inject,
  Injectable,
  InjectionToken,
  signal,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Sprache, TEXTE } from './texte';

/** Unter diesem Namen merkt sich der Browser die gewählte Sprache. */
export const SPEICHER_SCHLUESSEL = 'arabic-letters.sprache';

/** Die Sprachen des Browsers, die bevorzugte zuerst. */
export const BROWSER_SPRACHEN = new InjectionToken<readonly string[]>('BROWSER_SPRACHEN', {
  providedIn: 'root',
  factory: () => inject(DOCUMENT).defaultView?.navigator.languages ?? [],
});

/** null, wenn der Browser das Speichern verbietet. */
export const SPEICHER = new InjectionToken<Storage | null>('SPEICHER', {
  providedIn: 'root',
  factory: () => {
    const fenster = inject(DOCUMENT).defaultView;
    try {
      return fenster?.localStorage ?? null;
    } catch {
      return null;
    }
  },
});

/** Für alle, deren Browser weder Deutsch noch Englisch nennt. */
const ERSATZSPRACHE: Sprache = 'en';

function istSprache(wert: string | null | undefined): wert is Sprache {
  return !!wert && Object.hasOwn(TEXTE, wert);
}

/**
 * Die Sprache der Oberfläche. Es gilt die zuletzt gewählte, sonst die
 * erste Browsersprache, die es hier gibt.
 */
@Injectable({ providedIn: 'root' })
export class Uebersetzung {
  private readonly speicher = inject(SPEICHER);
  private readonly browserSprachen = inject(BROWSER_SPRACHEN);

  private readonly gewaehlt = signal<Sprache>(this.anfangssprache());
  readonly sprache = this.gewaehlt.asReadonly();
  readonly t = computed(() => TEXTE[this.sprache()]);

  constructor() {
    const dokument = inject(DOCUMENT);
    const titel = inject(Title);
    effect(() => {
      dokument.documentElement.lang = this.sprache();
      titel.setTitle(this.t().seitentitel);
    });
  }

  waehle(sprache: Sprache): void {
    this.gewaehlt.set(sprache);
    try {
      this.speicher?.setItem(SPEICHER_SCHLUESSEL, sprache);
    } catch {
      // Ohne Speicher gilt die Wahl nur bis zum Neuladen.
    }
  }

  private anfangssprache(): Sprache {
    return (
      this.gemerkteSprache() ??
      this.browserSprachen.map((s) => s.split('-')[0].toLowerCase()).find(istSprache) ??
      ERSATZSPRACHE
    );
  }

  private gemerkteSprache(): Sprache | undefined {
    try {
      const wert = this.speicher?.getItem(SPEICHER_SCHLUESSEL);
      return istSprache(wert) ? wert : undefined;
    } catch {
      return undefined;
    }
  }
}
