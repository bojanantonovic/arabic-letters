# arabic-letters

A quiz for the **Arabic letters**. It shows a letter — optionally with a
vowel mark — and lets you choose from five pronunciations.

The interface is available in **German and English**.

Angular 22, no further dependencies apart from the font.

## Getting started

```bash
npm install
npm start          # http://localhost:4200
```

The run configurations **ng serve**, **ng test** and **ng build** are ready
to use in WebStorm; the project can be opened directly.

```bash
npm test           # 31 tests
npm run build      # bundle in dist/
```

## Screen sizes

The reference sizes are the **iPhone Air** (420 × 912 points) and the
**iPad Pro 12.9″** (1024 × 1366). On the iPad the base font size grows; on a
phone in landscape, the letter and the answers sit side by side. The size of
the letter follows both the width and the height of the screen.

## What is tested in the quiz

There are three ranges and four positions in the word (Isolated, Initial,
Medial, Final), selectable at the top. Initial and Medial leave out
ا د ذ ر ز و and Tanwīn, which have no form that connects to the left.

Ranges:

| Range | Items | Content |
|---|---|---|
| letters only | 27 | the bare letter |
| with short vowel | 108 | plus Fatḥa, Kasra, Ḍamma |
| all marks | 270 | plus Šadda, Tanwīn |

## Where the data comes from

`src/app/data/letters.ts` is **generated** by `tools/gen_letters.py`, not
maintained by hand. It holds colours, transliteration and the German sound
descriptions.

To regenerate it:

```bash
python3 tools/gen_letters.py <source.epub> src/app/data/letters.ts
```

## Languages

The language is switched at the top right, without reloading; the state of the
round is kept. On the first visit the browser language applies (English if it
is neither German nor English), after that the one chosen last.

```
src/app/i18n/texte.ts          interface texts
src/app/i18n/inhalt.ts         English sound descriptions and labels
src/app/i18n/uebersetzung.ts   selected language
```

The German content is in `data/letters.ts`. The English content is maintained
by hand in `inhalt.ts`: if a sound changes in `letters.ts`, it has to be
updated there as well. In English, the long a is transliterated as ā instead
of ä.

Another language needs an entry in `Sprache` and `TEXTE`, its content in
`inhalt.ts` and a button in `app.ts`.

## How the wrong answers are chosen

Not at random — otherwise the quiz would be too easy. `src/app/data/quiz.ts`
picks, in this order:

1. Letters that **look the same in isolation** (same rasm family) and carry
   the **same vowel mark**. Anyone who confuses ب and ث is offered exactly
   that choice.
2. The same letter with a **different mark** — so that the mark has to be read
   too, not just the letter.
3. Only then anything else.

No two answers read the same, and the same item never appears twice in a row.
Both are covered by tests.

## Two decisions that might stand out

**The vowel mark does not have its own colour.** It takes the colour of its
letter instead of being set in grey, for a very practical reason: if a vowel mark is put into its own HTML element, the browser detaches
it from the letter and places it floating underneath. Which mark it was is
stated in the text after answering. An appended Alif, Ya or Waw, on the other
hand, is a letter of its own and keeps its colour.

**The font is part of the project, not loaded from Google.** Amiri comes as an
npm package (`@fontsource/amiri`, SIL Open Font License). This way the project
also builds without a network connection, and nothing is reported to the
outside while you practise.

## Structure

```
src/app/
  data/letters.ts     generated: 351 items with colour, reading, sound hint
  data/quiz.ts        picks the question and the four distractors
  data/quiz.spec.ts   tests for it
  i18n/               German and English
  quiz/               the component
tools/gen_letters.py  generates letters.ts
```
