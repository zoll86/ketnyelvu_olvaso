# Átadó — Kétnyelvű olvasó (EPUB nyelvtanuló alkalmazás)

Ez a dokumentum azért készült, hogy egy új beszélgetésben azonnal folytatható legyen a munka. Az utolsó kiadott állapot: **v46**.

## Mi ez

Egyfájlos HTML alkalmazás (PWA), amivel a felhasználó saját **angol vagy dán EPUB** könyveit olvassa, és mondatra koppintva megjelenik a magyar fordítás. A szavak szótárba menthetők, és a beépített ismétlővel (Anki-szerű) gyakorolhatók. Minden adat a készüléken marad, szerver nincs.

A felhasználó magyar, Dániában él, dánul és angolul tanul. **Minden kommunikáció magyarul zajlik.**

## Repó felépítése

```
index.html               a teljes alkalmazás (~140 KB, egy fájl)
sw.js                    service worker (offline működés)
manifest.webmanifest     PWA manifest
icons/icon-192.png, icon-512.png, maskable-512.png, apple-180.png
README.md                telepítési útmutató GitHub Pages-re
ATADO.md                 ez a dokumentum
```

GitHub Pages-re kerül, a felhasználó tölti fel. A kiadás formája: **zip a repó gyökerével + külön index.html és sw.js**.

## Kötelező munkamódszer

1. **Kis lépések.** Egy tool-hívás = egy témakör. Nagy, egybefüggő patch félúton elakad; ez már kétszer megtörtént.
2. **Verziószám két helyen:** `index.html`-ben `const APP_VER='vNN'`, `sw.js`-ben `const VER = 'olvaso-vNN'`. Ha csak az egyik változik, a telefon a cache-elt régit mutatja. A verzió a Beállítások → Alkalmazás szakaszban látszik.
3. **Valódi futtatás minden változás után.** A szintaxis-ellenőrzés nem elég: egy `ReferenceError` a szkript elején az összes gombkezelőt megölte (v28 hibája). A `jsdom` fel van telepítve, és két tesztszkript létezik a `/home/claude` alatt:
   - `runtest.js` — betöltési hibák, gombkezelők, fájlválasztó nyílása
   - `wordtest.js` — nyolc szó szótári feldolgozása hamis fordító- és szótár-válaszokkal
4. **Teljes, letölthető fájlok**, nem kódrészletek. Verziózott fájlnév vagy zip.
5. A patcheléshez Python `str.replace` asserttel — ha a keresett szöveg nincs meg, a hívás elhasal, és nem íródik ki hibás fájl.

### Tesztkörnyezet váza

```js
const {JSDOM}=require('jsdom');
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://x.org/a/',
  beforeParse(w){
    w.JSZip={loadAsync:()=>Promise.resolve({file:()=>null})};
    w.speechSynthesis={cancel(){},speak(){}}; w.SpeechSynthesisUtterance=function(){};
    w.fetch=(u)=>{ /* translate_a → [[[hu+'\n']]] ; dictionaryapi → [{meanings:[...]}] */ };
    w.onerror=(m,s,l)=>errs.push(m+' @'+l);
  }});
```
`pretendToBeVisual:true` kell, különben nincs `requestAnimationFrame`.

## Architektúra (index.html, egyetlen `<script>`)

Sorrendben, kereshető szakaszcímekkel:

- **PWA**: `APP_VER`, service worker regisztráció, `checkUpdate()`
- **tárolás**: `store` (localStorage, memória tartalék), `cache`, `vocab`
- **könyvtár**: IndexedDB (`idb`, `libPut/libAll/libGet/libDel`, `bookKey(title,size)`)
- **Claude API + költségmérés**: `MODELS`, `claude()`, `oaiCall()`, `llm()`, `spend`, `drawSpend()`
- **ingyenes fordítómotorok**: `FREE` tömb (Google `translate_a/single`, Lingva, MyMemory), `freeTranslate(txt,from)`, `gtxLines(lines)` kötegelt
- **alaktan**: `IRREG` (kb. 120 rendhagyó ige), `verbForms`, `pluralOf`, `lemmaCandidates`
- **szótári adatok**: `dictLookup` (dictionaryapi.dev, szófajonkénti definíciókkal), `defHu`, `formsHu`, `senseOf`, `pruneSenses`, `buildWordData`, `dataToNote`, `wordInfo`
- **nyelvtan**: `GRAM_EN` (24 minta), `GRAM_DA` (10 minta), `grammarHints`, `whyThis`
- **mondatbontás**: `splitSentences` (angol és dán rövidítéslistával)
- **EPUB**: `epubMeta` (metaadat + borító, teljes feldolgozás nélkül), `loadEpub`, `renderChapter`, `savePos`
- **fordítópanel**: `showTranslation`, `translate`, `transWith`, `provList`, `gloss`, `freeGloss`
- **ismétlő**: `cards(v)`, `cardSt`, `buildQueue`, `schedule`, `previewIvl`, `startStudy`, `nextCard`, `reveal`, `answer`, `undoAnswer`
- **párosítós játék**: `startMatch`, `matchRound`, `tryPair`
- **statisztika**: `streak`, `forecast`, `cardStats`, `drawStats`
- **felkészülés**: `analyzeBook`, `findExamples`, `goodExample`, `openPre`, `preAddRun`, `preAddLlmRun`, `exprMine`
- **karbantartás**: `rebuildCards`, `huFix`, törlések (`arm()` kétlépcsős megerősítéssel)

### Adatszerkezetek

Szótári bejegyzés (`vocab[]`):
```js
{ en, hu, note, nv, d, src, srcHu, book, lang, bury, c:[card0, card1] }
```
- `nv` = jegyzetverzió (`NOTE_VER=3`); ha kisebb, a `rebuildCards()` újraépíti
- `d` = szófajonkénti adatok: `{base, w, poss:['noun','verb'], sense:{noun:{hu,def,defHu,extra:[[label,en,hu]],en}, verb:{...}}, primary}`
- `src` / `srcHu` = példamondat és fordítása
- `c[0]` = idegen→magyar kártya, `c[1]` = magyar→idegen; mindkettő `{due,ivl,ease,reps,lapses,st}`, `st`: 0 új, 1 tanulás, 2 ismétlés
- `bury` = napkulcs; aznap a testvérkártya nem jön elő

Könyv (IndexedDB `books`): `{id, title, author, series, sidx, cover(dataURL), chaps, size, name, added, last, done, data(ArrayBuffer)}`

localStorage kulcsok: `ek_key`, `ek_engine`, `ek_src`, `ek_model`, `ek_oai`, `ek_spend`, `ek_cache`, `ek_vocab`, `ek_read`, `ek_srs`, `ek_counts`, `ek_hist`, `ek_libview`, `ek_libsort`, `ek_seen`, `ek_pos_<bookId>`

## Ami elkészült

**Olvasás.** EPUB betöltés (JSZip), fejezetlista a könyv tartalomjegyzékéből, képek, ReadEra-szerű tipográfia (fekete/grafit/meleg/szépia háttér, négy betűtípus, méret és sortávolság), eltűnő fejléc ⋯ gombbal, alsó eszközsáv, haladás mondatszinten mentve, százalékjelző.

**Fordítás.** Mondatra koppintva, az előző két mondat szövegkörnyezetével. Három ingyenes motor automatikus váltással, ↻ gombbal mondatonkénti újrafordítás a következő motorral. Claude (Haiku 4.5 / Sonnet 5 / Sonnet 4.6) és bármely OpenAI-kompatibilis végpont saját kulccsal, élő költségmérővel.

**Szótár.** Magyar szófaj, magyar magyarázat, szófajonkénti fülek a kártyán, igealakok magyar megfelelőkkel, többesszám, példamondat a könyvből. A jelentéseket **hordozó kifejezésben** fordítja (`to ring`, `the ring`, `he rang`), és kiszűri a látszat-jelentéseket. Anki TSV / CSV export.

**Ismétlő.** Kétirányú kártyák külön ütemezéssel, napi adagolás (20 új / 120 ismétlés, állítható), tanulási lépcső, testvér-elrejtés, intervallum a gombokon, visszavonás, makacs kártyák jelzése, szabad gyakorlás (nem ütemez át). Párosítós játék négy szóval.

**Felkészülés.** A könyv szókincsének gyakorisági felmérése, ragozott alakok összevonása, példamondat-keresés címlapszűrővel, kötegelt fordítás, LLM-es szószedet a mondatbeli jelentéssel, kifejezésbányászat fejezetenként (vonzatos igék, idiómák).

**Statisztika.** Napi állás, sorozat, hétnapos előrejelzés, szótár összetétele, könyv-lefedettség, költségbecslés.

**Nyelvtan.** „Miért így?" gomb: 24 angol és 10 dán minta felismerése magyar magyarázattal, ingyenesen; LLM-mel összefüggő elemzés.

**Könyvtár.** Több könyv egyszerre behúzva, borítók, rács- és listanézet, rendezés legutóbbi/szerző/sorozat/cím szerint (Calibre `calibre:series` és EPUB3 `belongs-to-collection` olvasásával), könyvmenü (folytatás, szókincsfelmérés, haladás nullázása, befejezettnek jelölés, törlés).

**Karbantartás.** Kártyák újraépítése, fordítás-cache törlése, szótár törlése, minden törlése.

## Meghozott döntések, amiket nem kell újratárgyalni

- **DeepL nem használható**: a szolgáltatás tiltja a böngészőből érkező hívást (403, CORS). Csak saját proxyval lenne járható.
- **Kimi K3 nem tizedáras**: $3/$15 per millió token, mint a Sonnet. A K2.6 ($0.95/$4) versenyképes a Haiku-val. Ezért nem Kimi-specifikus kód készült, hanem általános OpenAI-kompatibilis végpont.
- **Google Drive integráció nem kell**: az Android rendszer-fájlválasztója felkínálja a Drive-ot, tehát a könyvek onnan is behúzhatók. Valódi Drive API OAuth-projektet igényelne.
- **Mappára mutató könyvtár telefonon nem lehetséges**, ezért IndexedDB-tároló készült.
- **Párhuzamos kétnyelvű nézet szándékosan nincs**: elveszi a tanulást, mert a szem a magyarra ugrik.
- **Ingyenes motornál nincs magyar alak, ha a szófaj bizonytalan**: a hamis adat rosszabb a semminél.
- **Kifejezésbányászat csak LLM-mel**: a nyelvbeli gyakoriságot gépi fordító nem tudja megítélni, és a könyvön belüli gyakoriság idiómákra használhatatlan (egy jó író nem ismétli őket).

## Ami még ötlet, nem készült el

1. **Beírásos válasz** a magyar → idegen iránynál (a felhasználó nem kérte, de a legnagyobb tanulási nyereség a maradékból).
2. **Ismert szavak jelölése** („tudom" gomb): kivenné az ismétlésből, de ismertként megjegyezné. Ettől lenne értelmes a könyv-lefedettség.
3. **Meglévő szókészlet importja** ismertként (a felhasználónak van saját dán és angol Anki-anyaga).
4. **Hallás utáni és diktálós kártyatípus** — dánnál ez hozná a legtöbbet.
5. **Kiejtés magyar betűkkel** a szótárban. A felhasználó bevált konvenciója: csak magyar betűk, IPA soha (`kan [ke]`, `ved [vél]`, `her [hea]`).
6. **Makacs kártyák kezelése** a jelzésen túl: félretétel, kártya átírása a programban.
7. **Fejezetenkénti mondatszintű kártyák** a megtapizott mondatokból.

## Nyitott teendő a felhasználónál

A v46 feltöltése után **Beállítások → Alkalmazás → kártyák újraépítése** szükséges: a régi kártyák jegyzete hibás logikával készült (rossz szófajú igealakok, felesleges többesszám), ez írja újra mindet, és a szó fő jelentését is a helyes szófaj szerintire állítja.

## Ismert korlátok

- A Google `translate_a/single` nem hivatalos végpont; tömeges használatnál megtagadhatja a kérést, ilyenkor Lingvára vagy MyMemory-ra vált (utóbbi napi ~5000 karakter névtelenül).
- Az „egyéb API" csak olyan szolgáltatóval működik, amely engedi a böngészős hívást (OpenRouter igen).
- A dán ragozási alakokat csak LLM adja meg; szabályból nem megbízható.
- A szótári adatok a dictionaryapi.dev-től jönnek, ami angol; dánra nincs ingyenes megfelelő.
