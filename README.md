# Kétnyelvű olvasó

EPUB olvasó nyelvtanuláshoz. Angol vagy dán könyvet töltesz be, koppintasz egy mondatra, és megjelenik magyarul. A szavakat szótárba teheted, és a beépített ismétlővel gyakorolhatod.

Egyetlen HTML fájl, szerver nélkül működik. A könyvek nem hagyják el a készüléket.

## Mit tud

- **Mondatonkénti fordítás** koppintásra, az előző két mondat szövegkörnyezetével
- **Ingyenes fordítás** kulcs nélkül: Google, Lingva, MyMemory — magától arra vált, amelyik válaszol
- **↻ újrafordítás** másik motorral, ha az eredmény furcsa
- **Claude vagy bármely OpenAI-kompatibilis API** (Kimi, OpenRouter, DeepSeek) igényesebb fordításhoz, élő költségmérővel
- **Angol és dán** forrásnyelv, automatikus felismeréssel, saját felolvasással
- **Szótár magyarul**: szófaj, magyarázat, igealakok magyar címkékkel, többesszám
- **Beépített ismétlés** kétirányú kártyákkal (idegen→magyar és magyar→idegen), külön ütemezéssel
- **Anki TSV / CSV export**
- Olvasófelület: fekete/grafit/meleg/szépia háttér, négy betűtípus, méret és sortávolság állítható

## Telepítés GitHub Pages-re

1. Új repó a GitHubon, például `ketnyelvu-olvaso`, **Public** láthatósággal.
2. Töltsd fel a fájlokat a repó gyökerébe, a mappaszerkezetet megtartva:
   ```
   index.html
   manifest.webmanifest
   sw.js
   icons/icon-192.png
   icons/icon-512.png
   icons/maskable-512.png
   icons/apple-180.png
   ```
   Webes felületen: **Add file → Upload files**, majd húzd be az `icons` mappát is.
3. **Settings → Pages**, a *Source* legyen `Deploy from a branch`, a branch `main`, a mappa `/ (root)`. Mentés.
4. Egy-két perc múlva elérhető: `https://<felhasznalonev>.github.io/ketnyelvu-olvaso/`
5. Telefonon nyisd meg ezt a címet, és a kezdőlapon nyomd meg a **telepítés a kezdőlapra** gombot. Ha nem jelenik meg, a Chrome menüjében: *Hozzáadás a kezdőlaphoz*.

Ezután ikonból indul, böngészőcím nélkül, és offline is elindul — csak a fordítás igényel hálózatot.

## Frissítés

Cseréld le az `index.html`-t a repóban, és **írd át a verziót a `sw.js` első sorában** (`const VER = 'olvaso-v18'` → `v19`). E nélkül a régi változat maradhat a cache-ben. A telepített alkalmazás a következő indításnál veszi át az újat.

## Adatok

Minden a böngésző saját tárolójában marad: szótár, ismétlési ütemezés, fordítás-cache, beállítások. Ezek a címhez (origóhoz) kötődnek, tehát ha másik címre költözik az alkalmazás, nem jönnek át automatikusan. Az API kulcs is csak a készüléken tárolódik, nem kerül fel a repóba.

## Költségek

Az ingyenes motorok nem kerülnek semmibe. Ha Claude-ot vagy más API-t állítasz be, a ⚙ panel költségmérője valós token-elszámolásból számol. Nagyságrendileg: egy mondat fordítása Haiku-val 0,0004 dollár körül van, tehát ezer mondat nagyjából 130 forint.

## Ismert korlátok

- A DeepL nem használható, mert a szolgáltatás tiltja a böngészőből érkező hívásokat.
- Az „egyéb API" csak olyan szolgáltatóval működik, amelyik engedi a böngészős hívást; az OpenRouter engedi.
- A dán ragozási alakokat csak LLM motorral adja meg, mert szabályból nem lehet megbízhatóan előállítani.
- A mappára mutató könyvtár telefonos böngészőben nem megvalósítható; a könyveket egyszer kell behúzni.
