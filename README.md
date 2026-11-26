# arabic-letters

Ein Quiz für die **allein stehenden arabischen Buchstaben**. Es zeigt einen
Buchstaben — wahlweise mit einem Vokalzeichen — und lässt aus fünf
Aussprachen wählen.

Angular 22, keine weiteren Abhängigkeiten ausser der Schrift.

## Starten

```bash
npm install
npm start          # http://localhost:4200
```

In WebStorm liegen die Startkonfigurationen **ng serve**, **ng test** und
**ng build** schon bereit; das Projekt lässt sich direkt öffnen.

```bash
npm test           # 13 Tests
npm run build      # Bündel nach dist/
```

## Was geprüft wird

Drei Umfänge und vier Stellungen im Wort (Alleine, Anfang, Mitte, Ende), oben umschaltbar.
In Anfang und Mitte fehlen ا د ذ ر ز و und Tanwīn, die keine Form haben, die nach links anschliesst.

Umfänge:

| Umfang | Aufgaben | Inhalt |
|---|---|---|
| nur Buchstaben | 27 | der nackte Buchstabe |
| mit kurzem Vokal | 108 | dazu Fatḥa, Kasra, Ḍamma |
| alle Zeichen | 270 | dazu Šadda, Tanwīn |

## Woher die Daten kommen

`src/app/data/letters.ts` wird **erzeugt**, nicht von Hand gepflegt. Quelle
ist das ePub *Die arabischen Buchstaben*: Farben, Umschrift und die
deutschen Lautbeschreibungen werden daraus gelesen. Damit kann die App
nicht vom Buch abweichen — jeder Buchstabe hat hier dieselbe Farbe wie
dort.

Neu erzeugen, wenn sich das Buch ändert:

```bash
python3 tools/gen_letters.py /pfad/zu/Die_arabischen_Buchstaben.epub \
        src/app/data/letters.ts
```

## Wie die falschen Antworten gewählt werden

Nicht zufällig — sonst wäre das Quiz zu leicht. `src/app/data/quiz.ts`
nimmt der Reihe nach:

1. Buchstaben, die **allein stehend genauso aussehen** (dieselbe
   Rasm-Familie) und **dasselbe Vokalzeichen** tragen. Wer ب und ث
   verwechselt, bekommt genau diese Wahl vorgelegt.
2. Denselben Buchstaben mit einem **anderen Zeichen** — damit auch das
   Zeichen gelesen werden muss, nicht nur der Buchstabe.
3. Erst danach irgendetwas anderes.

Keine zwei Antworten lesen sich gleich, und dieselbe Aufgabe kommt nicht
zweimal hintereinander. Beides ist durch Tests abgesichert.

## Zwei Entscheidungen, die auffallen könnten

**Das Vokalzeichen hat nicht seine eigene Farbe.** In den Büchern sind die
Zeichen grau ausgezeichnet. Hier stehen sie in der Farbe ihres Buchstabens,
und zwar aus einem handfesten Grund: setzt man ein Vokalzeichen in ein
eigenes HTML-Element, löst der Browser es vom Buchstaben ab und stellt es
freischwebend darunter. Welches Zeichen es war, steht nach der Antwort im
Text. Ein angehängtes Alif, Ya oder Waw ist dagegen ein eigener Buchstabe
und behält seine Farbe.

**Die Schrift liegt im Projekt, nicht bei Google.** Amiri kommt als
npm-Paket (`@fontsource/amiri`, SIL Open Font License). So baut das Projekt
auch ohne Netz, und beim Üben wird nichts nach aussen gemeldet.

## Aufbau

```
src/app/
  data/letters.ts     erzeugt: 351 Aufgaben mit Farbe, Lesung, Lautangabe
  data/quiz.ts        Auswahl der Frage und der vier Ablenker
  data/quiz.spec.ts   Tests dazu
  quiz/               die Komponente
tools/gen_letters.py  erzeugt letters.ts aus dem Buch
```
