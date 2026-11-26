import { Component, inject } from '@angular/core';
import { Sprache } from './i18n/texte';
import { Uebersetzung } from './i18n/uebersetzung';
import { Quiz } from './quiz/quiz';

/** Der Titel des Buches bleibt in jeder Sprache deutsch. */
const BUCHTITEL = 'Die arabischen Buchstaben';

@Component({
  selector: 'app-root',
  imports: [Quiz],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly uebersetzung = inject(Uebersetzung);
  protected readonly t = this.uebersetzung.t;
  protected readonly buchtitel = BUCHTITEL;

  /** Jede Sprache heisst in der Auswahl so, wie sie sich selbst nennt. */
  protected readonly sprachen: { wert: Sprache; name: string }[] = [
    { wert: 'de', name: 'Deutsch' },
    { wert: 'en', name: 'English' },
  ];
}
