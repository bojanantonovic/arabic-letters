# Liest Buchstabe -> Farbe, Umschrift, Lautbeschreibung aus dem Kapitel
# "Die arabische Schrift" eines fertigen Buches.
import re, sys, zipfile
import xml.etree.ElementTree as ET
NS = "{http://www.w3.org/1999/xhtml}"

def lies(epub, datei="OEBPS/schrift.xhtml"):
    root = ET.fromstring(zipfile.ZipFile(epub).read(datei))
    farbe, ums, laut = {}, {}, {}
    for tr in root.iter(NS + "tr"):
        tds = [td for td in tr if td.tag == NS + "td"]
        if len(tds) < 3:
            continue
        txt = "".join(tds[0].itertext()).strip()
        col = re.search(r"color:(#[0-9a-fA-F]{6})", tds[0].get("style", ""))
        if not col:
            for e in tds[0].iter():
                c = re.search(r"color:(#[0-9a-fA-F]{6})", e.get("style", ""))
                if c:
                    col = c
                    break
        if not (txt and col):
            continue
        ar = txt.replace("‍", "").strip()
        if not re.match(r"^[ء-ي]", ar) or len(ar) > 1:
            continue
        farbe.setdefault(ar, col.group(1))
        ums.setdefault(ar, "".join(tds[-2].itertext()).strip())
        laut.setdefault(ar, "".join(tds[-1].itertext()).strip())
    return farbe, ums, laut

if __name__ == "__main__":
    f, u, l = lies(sys.argv[1])
    print(len(f), "Zeichen")
