import { Component, computed, signal } from '@angular/core';
import { Item } from '../data/letters';
import { auswahl, Frage, frage, inPosition, Position, Umfang } from '../data/quiz';

/** Fragen pro Runde; danach folgt die Auswertung. */
const RUNDENLAENGE = 20;

/** Ein Buchstabe und wie oft er in der Runde falsch gewählt wurde. */
interface Fehler {
  letter: string;
  name: string;
  color: string;
  anzahl: number;
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz {
  protected readonly umfang = signal<Umfang>('kurz');
  protected readonly positionen: { wert: Position; name: string }[] = [
    { wert: 'alleine', name: 'Alleine' },
    { wert: 'anfang', name: 'Anfang' },
    { wert: 'mitte', name: 'Mitte' },
    { wert: 'ende', name: 'Ende' },
  ];
  protected readonly position = signal<Position>('alleine');
  protected readonly pool = computed(() => auswahl(this.umfang(), this.position()));

  /** Das Schriftbild der aktuellen Frage in der gewählten Position. */
  protected readonly glyphen = computed(() =>
    this.aktuell().item.parts.map((p, i) => ({
      ...p,
      t: i === 0 ? inPosition(p.t, this.position()) : p.t,
    })),
  );
  protected readonly erklaerZeichen = computed(() =>
    inPosition(this.aktuell().item.letter, this.position()),
  );

  protected readonly aktuell = signal<Frage>(frage(auswahl('kurz'), Math.random));
  /** null = noch nicht geantwortet */
  protected readonly gewaehlt = signal<number | null>(null);

  protected readonly richtige = signal(0);
  protected readonly gesamt = signal(0);
  protected readonly serie = signal(0);
  protected readonly besteSerie = signal(0);

  protected readonly rundenlaenge = RUNDENLAENGE;
  protected readonly runde = signal(0);
  protected readonly rundeRichtig = signal(0);
  protected readonly fehler = signal<Fehler[]>([]);
  protected readonly auswertung = signal(false);

  protected readonly fertig = computed(() => this.gewaehlt() !== null);
  protected readonly getroffen = computed(() => this.gewaehlt() === this.aktuell().richtig);
  protected readonly quote = computed(() =>
    this.gesamt() === 0 ? 0 : Math.round((this.richtige() / this.gesamt()) * 100),
  );

  protected waehle(i: number): void {
    if (this.fertig()) return;
    this.gewaehlt.set(i);
    this.gesamt.update((n) => n + 1);
    this.runde.update((n) => n + 1);
    if (i === this.aktuell().richtig) {
      this.rundeRichtig.update((n) => n + 1);
      this.richtige.update((n) => n + 1);
      this.serie.update((n) => n + 1);
      this.besteSerie.update((b) => Math.max(b, this.serie()));
    } else {
      this.serie.set(0);
      this.merkeFehler(this.item);
    }
  }

  private merkeFehler(item: Item): void {
    this.fehler.update((liste) => {
      const vorhanden = liste.find((f) => f.letter === item.letter);
      if (vorhanden) {
        return liste.map((f) => (f === vorhanden ? { ...f, anzahl: f.anzahl + 1 } : f));
      }
      return [...liste, { letter: item.letter, name: item.name, color: item.color, anzahl: 1 }];
    });
  }

  /** Die Fehler der Runde, die häufigsten zuerst. */
  protected readonly fehlerGeordnet = computed(() =>
    [...this.fehler()].sort((a, b) => b.anzahl - a.anzahl),
  );

  protected weiter(): void {
    if (this.runde() >= RUNDENLAENGE) {
      this.auswertung.set(true);
      return;
    }
    this.naechste();
  }

  protected neueRunde(): void {
    this.runde.set(0);
    this.rundeRichtig.set(0);
    this.fehler.set([]);
    this.auswertung.set(false);
    this.naechste();
  }

  private naechste(): void {
    this.aktuell.set(
      frage(this.pool(), Math.random, this.aktuell().item.id, this.aktuell().richtig),
    );
    this.gewaehlt.set(null);
  }

  protected setzePosition(p: Position): void {
    this.position.set(p);
    this.neueRunde();
  }

  protected setzeUmfang(u: Umfang): void {
    this.umfang.set(u);
    this.neueRunde();
  }

  /** Klasse eines Antwortknopfs, nachdem geantwortet wurde. */
  protected stand(i: number): string {
    if (!this.fertig()) return '';
    if (i === this.aktuell().richtig) return 'richtig';
    return i === this.gewaehlt() ? 'falsch' : 'blass';
  }

  protected zurueck(): void {
    this.richtige.set(0);
    this.gesamt.set(0);
    this.serie.set(0);
    this.besteSerie.set(0);
    this.neueRunde();
  }

  /** Teilt eine Aussprache in den Mitlaut vorn (fett) und den Rest. */
  protected teile(o: string): [string, string] {
    const k = o.match(/^[^aiuäīū]+/)?.[0] ?? '';
    return [k, o.slice(k.length)];
  }

  protected spur(_: number, o: string): string {
    return o;
  }

  protected get item(): Item {
    return this.aktuell().item;
  }
}
