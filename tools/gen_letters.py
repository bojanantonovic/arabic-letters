# Erzeugt src/app/data/letters.ts fuer die Quiz-App.
#
# Farben, Umschrift und Lautbeschreibung werden aus dem Buch
# "Die arabischen Buchstaben" gelesen (extract_abc.py), nicht von Hand
# abgeschrieben. So kann die App gar nicht vom Buch abweichen.
#
# Aufruf: python3 gen_letters.py <buch.epub> <ziel.ts>

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract_abc import lies

BUCH, ZIEL = sys.argv[1:3]
F, U, L = lies(BUCH)
GRAU = "#6b6b6b"

FATHA, KASRA, DAMMA = "َ", "ِ", "ُ"
SUKUN, SHADDA = "ْ", "ّ"
TAN_A, TAN_I, TAN_U = "ً", "ٍ", "ٌ"
ALIF, WAW, YA = "ا", "و", "ي"

KONS = list("بتثجحخدذرزسشصضطظعغفقكلمنهوي")

# Welche Buchstaben einander im ALLEIN stehenden Zustand aehnlich sehen.
# Daran richten sich die Ablenker aus: wer ب und ث verwechselt, soll genau
# diese Wahl vorgelegt bekommen - nicht ب gegen ش.
RASM = {
    "schale": "بتثني", "dschim": "جحخ", "dal": "دذ", "ra": "رز",
    "sin": "سش", "sad": "صض", "ta": "طظ", "ain": "عغ", "fa": "فق",
    "ha": "ه", "kaf": "ك", "lam": "ل", "mim": "م", "waw": "و",
}
RASM_VON = {c: k for k, s in RASM.items() for c in s}

NAMEN = {
    "ب": "bā’", "ت": "tā’", "ث": "{th}ā’", "ج": "ǧīm", "ح": "ḥā’", "خ": "ḫā’",
    "د": "dāl", "ذ": "{th}āl", "ر": "rā’", "ز": "zāy", "س": "sīn", "ش": "šīn",
    "ص": "ṣād", "ض": "ḍād", "ط": "ṭā’", "ظ": "ẓā’", "ع": "‘ayn", "غ": "ġayn",
    "ف": "fā’", "ق": "qāf", "ك": "kāf", "ل": "lām", "م": "mīm", "ن": "nūn",
    "ه": "hā’", "و": "wāw", "ي": "yā’",
}

# (Kennung, Zeichen hinter dem Buchstaben, Anhaengsel-Buchstabe, Lesung,
#  Beschriftung). Der Anhaengsel-Buchstabe traegt seine eigene Farbe.
ERWEITERUNG = [
    ("blank", "", "", "{u}", "ohne Zeichen"),
    ("fatha", FATHA, "", "{u}a", "mit Fatḥa"),
    ("kasra", KASRA, "", "{u}i", "mit Kasra"),
    ("damma", DAMMA, "", "{u}u", "mit Ḍamma"),
    ("alif", FATHA, ALIF, "{u}ā", "mit langem a"),
    ("ya", KASRA, YA, "{u}ī", "mit langem i"),
    ("waw", DAMMA, WAW, "{u}ū", "mit langem u"),
    ("sch_a", SHADDA + FATHA, "", "{u}{u}a", "verdoppelt, mit Fatḥa"),
    ("sch_i", SHADDA + KASRA, "", "{u}{u}i", "verdoppelt, mit Kasra"),
    ("sch_u", SHADDA + DAMMA, "", "{u}{u}u", "verdoppelt, mit Ḍamma"),
    ("tan_a", TAN_A, "", "{u}an", "mit Tanwīn -an"),
    ("tan_i", TAN_I, "", "{u}in", "mit Tanwīn -in"),
    ("tan_u", TAN_U, "", "{u}un", "mit Tanwīn -un"),
]


def teile(c, zeichen, anhang):
    """Die Bestandteile des Schriftbildes, jeder mit seiner Farbe.

    Ein Vokalzeichen bekommt KEINEN eigenen Abschnitt, sondern bleibt bei
    seinem Buchstaben. Das ist kein Schoenheitsgrund: steht es in einem
    eigenen Element, loest der Browser es vom Buchstaben ab und setzt es
    freischwebend darunter. Ein eigener Abschnitt beginnt nur dort, wo ein
    neuer BUCHSTABE anfaengt - beim angehaengten Alif, Ya oder Waw des
    langen Vokals, und der traegt dann wieder seine eigene Farbe.

    Dass die Zeichen damit die Farbe ihres Buchstabens annehmen, ist der
    Preis dafuer. Welches Zeichen es ist, steht nach der Antwort im Text."""
    p = [{"t": c + zeichen, "c": F.get(c, "#333333")}]
    if anhang:
        p.append({"t": anhang, "c": F.get(anhang, "#333333")})
    return p


items = []
for c in KONS:
    u = U.get(c, "?").split(",")[0].strip()
    for kennung, zeichen, anhang, muster, beschriftung in ERWEITERUNG:
        items.append({
            "id": "%s_%s" % (kennung, hex(ord(c))),
            "letter": c,
            "name": NAMEN.get(c, "").replace("ā", "ä"),
            "variant": kennung,
            "variantLabel": beschriftung,
            "text": c + zeichen + anhang,
            "parts": teile(c, zeichen, anhang),
            "reading": (NAMEN.get(c, u) if kennung == "blank" else muster.replace("{u}", u)).replace("ā", "ä"),
            "color": F.get(c, "#333333"),
            "rasm": RASM_VON.get(c, c),
            "hint": L.get(c, "").replace("englisches th ", "englisches {th} "),
        })

kopf = """// ACHTUNG: diese Datei wird erzeugt, nicht von Hand gepflegt.
// Quelle ist das Buch "Die arabischen Buchstaben" - Farben, Umschrift und
// Lautbeschreibung werden daraus gelesen (gen_letters.py). So kann die App
// nicht vom Buch abweichen.
//
// %d Aufgaben: %d Buchstaben mal %d Erweiterungen.

export interface Part {
  /** das Zeichen selbst */
  t: string;
  /** seine Farbe - Buchstaben farbig, Vokalzeichen grau */
  c: string;
}

export interface Item {
  id: string;
  /** der nackte Buchstabe, ohne Zeichen */
  letter: string;
  /** sein arabischer Name, z.B. bā' */
  name: string;
  variant: string;
  variantLabel: string;
  /** was angezeigt wird: Buchstabe samt Zeichen */
  text: string;
  parts: Part[];
  /** die richtige Aussprache */
  reading: string;
  color: string;
  /** Familie gleich aussehender Buchstaben - fuer die Ablenker */
  rasm: string;
  /** Beschreibung des Lauts, auf Deutsch */
  hint: string;
}

export const GRAU = '%s';

export const ITEMS: Item[] = %s;
""" % (len(items), len(KONS), len(ERWEITERUNG), GRAU,
       json.dumps(items, ensure_ascii=False, indent=2))

open(ZIEL, "w", encoding="utf-8").write(kopf)
print("%d Aufgaben geschrieben -> %s" % (len(items), ZIEL))
