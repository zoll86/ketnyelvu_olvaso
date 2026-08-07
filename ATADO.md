---

# KIEGÉSZÍTÉS — v55–v56: KÉNYELEM ÉS DESIGN

v55: „listába…" a könyvtári kártya ⋯ menüjébe (eddig csak a lejátszóból ment).
v56: borító sötétítő rétegei le (a kontraszt a buborékok alapjáé); #intake
csukható (érintőn csukva indul); vSet átrendezve (Megjelenés elöl, motorok
#engWrap csukható csoportban, kulcs nélkül nyitva); .bk .more 40px; 0% jelvény
helyett „szöveg ✗" csak ott, ahol tényleg nincs szöveg. Részletek:
VALTOZASOK_v56.md.

# KIEGÉSZÍTÉS — v54: EGYSZERŰSÍTÉS + OLVASÁSI ÉLMÉNY

A ⋯ menü SZÖVEG szakasza 10 → 4 pont: a hat javítóeszköz a textDoctor
(„szöveg rendbetétele") mögé került — diagnózis másolaton, tételes confirm,
javítás. Új: olvasási ráhagyás (BREATH_CPS=17, breathMaybe a tickben, CFG.breath),
sikló fókuszvonal (glideTo a scrollTickben), tidySen (dedup+sentencize iterálva
4 körig — egy menet NEM fixpontos, a mérés bizonyította). Magyar sormagasság
1,55. Részletek: VALTOZASOK_v54.md.

# KIEGÉSZÍTÉS — v53: BUBORÉK = MONDAT

A v53 a mondatot tette fizikai egységgé: a rec.sen elemei mondatok (sentencize
olvaszt és szétválaszt a szó-időbélyegek mentén), a huAlign blokk-faragása
megszűnt (egy egység = egy magyar buborék), a breakLong/pushSen csak az
írásjel nélküli szalagot töri (MAXF fölött, külön egységekre). Megnyitáskor a
régi felvételek veszteség nélkül migrálódnak (a közös full-t hordozó darabok
a full szöveggé olvadnak, a kész magyar átöröklődik). Részletek:
VALTOZASOK_v53.md.

# KIEGÉSZÍTÉS — v52 (a lenti dokumentum v51-es állapotot ír le)

A v51-es ÁTADÓ által előírt mérés megtörtént (pilot fixture, 170 töredék, majd
a friss 206 töredékes export). A lelet és a döntés:

- **A fő bűnös a 4. gyanúsított volt**: a második átfutás részleges
  ismétlés-maradványai (9 vég-eleje, 7 belső „X. X", 7 határon átlógó), amiket a
  mergeSen szövegazonos szűrője nem fogott meg. A „pont+kisbetű" 14 belső
  helyéből 11 ennek a lenyomata volt — a splitSentences szabálya (2. gyanúsított)
  felmentve, változatlan.
- **Az 1. gyanúsított (v51-es contd) mért pontossága 53% volt** — duplikátumokat
  és külön mondatokat is fűzött. Az 5. gyanúsított részben igazolódott: a <2 s
  szünet-szűrő a normSen után 52/52 párt átengedett.
- **Javítás (v52):** dedupSen tisztító (automatikus a mergeSen-ben + kézi
  menüpont); contd duplikátum-őrrel és kötelező pozitív jellel (mért pontosság
  93%); a mergeSen sorrendje dedup → stitch → normSen (a szünet-szűrő az eredeti
  időkkel fut). Emellett: írásjelezés a lánc ELEJÉN (punctAsr a nyers
  felismerő-válaszon, csak ha a needPunct hiányt jelez); a fordítás és a
  szópár-gyártás szétválasztva (SYS_TR mindig egyedül; SYS_PAIRS a kész
  magyarral horgonyoz).
- Ellenőrzés: mindkét fixture-ön 0 duplikátum-maradványos egység, 0 óriás
  egység; a beépített kód round-trip mérése egyezik a fejlesztés közbenivel.

# Átadó — Kétnyelvű hallgató (hangoskönyv karaoke)

Ez a dokumentum azért készült, hogy egy új beszélgetésben azonnal folytatható legyen a
munka. Az utolsó kiadott állapot: **v51**.

## Mi ez

Egyfájlos HTML alkalmazás (PWA), amivel a felhasználó saját **angol hangoskönyveit és
podcastjait** hallgatja úgy, hogy a program felismeri a beszédet, mondatokra bontja,
lefordítja, és karaoke-szerűen mutatja az épp elhangzó mondatot magyar fordítással.
A Kétnyelvű olvasó (EPUB, `ketnyelvu_olvaso_v97`) hangos párja, ugyanazzal a
dizájn-rendszerrel és ugyanazzal a tanulási logikával.

A felhasználó magyar, Dániában él, angolul és dánul tanul. **Minden kommunikáció
magyarul zajlik.**

## Repó felépítése

```
index.html               a teljes alkalmazás (~90 KB, egy fájl)
sw.js                    service worker
manifest.webmanifest     PWA manifest
icons/…                  icon-192, icon-512, maskable-512, apple-180
README.md                telepítés, beállítás, korlátok
ATADO.md                 ez a dokumentum
```

GitHub Pages-re kerül, a felhasználó tölti fel. A kiadás formája: **zip a repó
gyökerével**, verziózott fájlnévvel.

## Kötelező munkamódszer

1. **Kis lépések.** Egy tool-hívás = egy témakör. Nagy, egybefüggő patch félúton elakad.
2. **Verziószám két helyen:** `index.html`-ben `const APP_VER='vNN'`, `sw.js`-ben
   `const VER='hallgato-vNN'` (most `v17`). Ha csak az egyik változik, a telefon a cache-elt régit
   mutatja. A verzió a ⚙ lap *Alkalmazás* szakaszában látszik.
3. **Valódi futtatás minden változás után.** A szintaxis-ellenőrzés nem elég. Két
   tesztszkript van, mindkettő `/home/claude/build` alatt, `jsdom` + `fake-indexeddb`
   kell hozzá:
   - `runtest.js` — betöltési hibák, gombkezelők, **valódi ffmpeg-fájlokon** a
     hangbontás (m4a/mp3/wav/adts, félrenevezett fájl), mondatbontás, hibanapló,
     kivitel. 53 próba.
   - `jobtest.js` — a teljes futószalag hamis felismerővel: több szelet, mentés,
     visszaolvasás, folytatás, duplikátumszűrés. 20 próba.
   - `audiotest.js` — a hang darabolt mentése: bájtpontos visszatöltés, megszakítás,
     törlés, kvótavédelem. 17 próba.
   - `perftest.js` — teljesítménymérés nagy fájlon (`node perftest.js huge.m4b`).
     A nagy tesztfájlok az ffmpeg concat demuxerével, `-c copy`-val készülnek másodpercek
     alatt: 1000× a 125 s-os `t.m4a` = 1 GB, 34,7 óra.
     **Mért értékek (v2):** 236 MB / 8 óra bontása 0,4 s; 1 GB / 34,7 óra 1,2 s; egy
     szelet kivágása 12–56 ms; 286 MB mp3 2,1 s. Ha egy változtatás után ezek
     nagyságrendileg elmozdulnak, valami elromlott.
   A tesztfájlokat az ffmpeg gyártja:
   `ffmpeg -f lavfi -i "sine=frequency=300:duration=125" -c:a aac -b:a 64k -ac 1 t.m4a`
4. **Teljes, letölthető fájlok**, nem kódrészletek.
5. A patcheléshez Python `str.replace` **asserttel** — ha a keresett szöveg nincs meg,
   a hívás elhasal, és nem íródik ki hibás fájl.
6. A konzolból elérhető a `window.HG` felület (tároló, futószalag, bontó függvények) —
   telefonon és asztali gépen is ezzel lehet a leggyorsabban hibát keresni.

## Architektúra (index.html, négy `<script>` blokk)

Kereshető szakaszcímek a fájlban:

- **[1] PWA + tárolás**: `APP_VER`, service worker, `store` (localStorage memória-
  tartalékkal), `CFG` (minden beállítás egy objektumban, `hg_cfg`), `spend`, `cache`
- **[2] IndexedDB**: `hallgato` adatbázis a szöveghez (`txt`) és a v1 örökségének
  (`media`); a hang **külön adatbázisban**: `hallgato-hang` / `aud`. A külön adatbázis
  azért kell, hogy a szöveg mentése soha ne várjon a hang írására. A hang **24 MB-os
  darabokban** megy be (`audSave`, kulcs: `id#k`), betöltésnél `audLoad` fűzi össze
  egyetlen Blobbá. `blobSurvives()` egyszer, nyolc bájton kipróbálja, hogy a böngésző
  egyáltalán képes-e Blobot tárolni; ha nem, nyers bájttömbre vált (`asBlob` realm-
  független ellenőrzéssel). `freeSpace()` a mentés előtti kvótaellenőrzés.
- **[3] hangfájl-bontás**: `mp4Open`/`parseMoov`/`cutMp4`, `buildM4A` (minimális MP4 író),
  `mp3Open`/`cutMp3`, `wavOpen`/`cutWav`, `openMedia`, `cut` — **dekódolás nélkül**
- **[4] beszédfelismerés**: `ASR` presetek (groq/openai/custom), `asrCall` (multipart
  `/audio/transcriptions`, `verbose_json`, szó- és mondat-időbélyeg), `toSentences`,
  `splitSentences`, `breakLong`, `pushSen`
- **[5] fordítás**: `gtxLines` (Google kötegelt), `lingva`, `myMemory`, `claudeCall`,
  `oaiCall`, `llmLines` (JSON tömb), `trBatch` (gyorstárral, motorváltással)
- **[6] futószalag**: `runJob` (szeletenként: vágás → felismerés → mondatok → egyesítés →
  fordítás → mentés), `mergeDone`/`nextGap`/`doneSec` (szakaszkezelés), `mergeSen`
  (átfedés-szűrés), `save` (hibánál jelez, de **nem áll le**), `strip`
- **[7] karaoke lejátszó**: `senAt` (bináris keresés), `renderKara` (±22 mondat ablak),
  `paintCur` (harmadok szabálya szerinti pozicionálás), `tick` (120 ms, szó-követés),
  `gotoSen`, A–B ismétlés, Wake Lock, MediaSession
- **[8] felület, indulás**: könyvtár, fedőlap-menük, beállítások, költségmérő, kivitel,
  `window.HG`

### Adatszerkezetek

A `txt` tároló egy rekordja:
```js
{ id:'név|méret', name, size, dur, kind:'mp4'|'mp3'|'wav'|'whole', added, chaps:[{t,name}],
  done:[[t0,t1],…],          // a már felismert szakaszok, ebből jön a folytatás
  sen:[{a,b,en,hu,w:[t,…]}], // mondatok: kezdet, vég, angol, magyar, szóhatárok
  pos, words, ver:1, hasAudio }
```
A `media` tároló: `{id, blob, name, size, added}` — ugyanaz az `id`, tehát a hang és a
szöveg összetartozik. Ha a felhasználó nem mentette a hangot, a szöveg megmarad, és a
fájl később ugyanazzal a névvel és mérettel behúzva összekapcsolódik vele.

localStorage kulcsok: `hg_cfg`, `hg_spend`, `hg_cache`.

## A v3 tanulságai

- **A felhasználónál a betöltés némán halt el, a tesztkörnyezetben minden zöld volt.**
  A válasz nem több találgatás, hanem láthatóság: minden hiba és a megnyitás minden
  lépése a ⚙ lap **hibanaplójába** kerül (`log()`, `hg_log`, 150 soros körkörös puffer,
  másolás gombbal). A `window.onerror` és `unhandledrejection` is ide fut be. Ha a
  felhasználó azt mondja, „nem megy", első kérdés: *másold ki a hibanaplót.*
- **`readSlice` időkorláttal (20 s) és FileReader-tartalékkal fut.** A néma elakadás fő
  gyanúsítottja a `blob.arrayBuffer()`: van böngésző/WebView, ahol hiányzik vagy nem tér
  vissza. Időkorláttal a végtelen várakozásból naplózott, toastolt hiba lesz.
- **mp3/ADTS keret csak láncolattal érvényes**: a következő keretnek pontosan `len`
  bájttal odébb kell kezdődnie (vagy ID3v1 „TAG"-nek). E nélkül az mp3-kereső egy AAC
  folyam belsejének 0xFF bájtjaiból értelmetlen „mp3-at" épített, teljesen rossz
  időzítéssel — a runtest „csalos.mp3" próbája pont ezt fogta meg.
- **ADTS AAC bontó** (`adtsOpen`/`cutAdts`): podcastoknál gyakori, sokszor `.mp3` vagy
  `.aac` néven. Keretalapú, mint az mp3.
- **`openMedia` minden bontó kudarcának okát naplózza**, és sorban próbálja őket
  (mp4 → mp3 → adts → wav), mielőtt „szeletelhetetlen egész"-re esne.
- **Szeletelhetetlen ÉS 24 MB-nál nagyobb fájlnál** a feldolgozás világos üzenettel áll
  meg, nem a 25 MB-os szelethatárra hivatkozó, félrevezető hibával.
- **Indulás lépésenként védve**: egy rajzolási hiba nem viheti magával a könyvtárat.
- **A lejátszó `loadedmetadata`-ból pótolja a hosszt**, ha a bontók nem adtak (0:00 ellen).
- Örökség: a `media` tároló (v1 egyben-mentés) olvasása megmaradt, írás már csak a
  darabolt `hallgato-hang`/`aud`-ba megy.

## A v4–v5 tanulságai (valós használatból)

- **A tipográfiai hierarchia megfordult, kétszer.** v4: a magyar akkora lett, mint az
  angol. v5, a felhasználó visszajelzésére: a MAGYAR a nagy (φ×) és a legvilágosabb, az
  angol kicsi és halvány, arany szó-követéssel. Ok: az angolt a fül követi, a magyart a
  szem olvassa — a méret oda kell, ahol az olvasás történik. Ezen nem kell újra vitázni.
- **Töredék-mondat = teljes fordítás.** A hosszú mondatok karaoke-célból részekre
  törnek (`breakLong`), de minden rész hordozza a teljes mondatot (`full` mező), és a
  fordítás mindig a teljes mondatból készül (`huKey`, `fillHu`). Minden rész ugyanazt a
  teljes magyar mondatot mutatja — így a vesszőnél elvágott angol alatt sem csonka a
  magyar, és több idő jut elolvasni, mert a részek alatt nem változik.
- **gtxLines szegmens-ága törölve.** A `segs.length===lines.length` egyezés véletlen is
  lehet (a Google saját darabolása), és hibás sor-párosítást adott — a felhasználónál
  egy mondat a RÁKÖVETKEZŐ fordítását kapta. Kötegnél csak a soronkénti egyezés érvényes.
- **Kimaradt fordítások lejátszás közben maguktól pótlódnak** (12 mp-enként, az aktuális
  hely utáni ~40 mondatból max. 12), plusz kézi pótlás a ⋯ menüből.
- **Középre görgetés a pár valós magasságával** (`paintCur`), 10–38%-os korlátokkal.
- **Groq: az ingyenes szint az alapeset** (Whisper ~2000 kérés/nap, egy tízórás könyv
  ~120 kérés → 0 Ft); a szövegek ezt mondják, a 429-re várakozás beépített.

## v6: SRT/TSV visszatöltés

`parseSrt` / `parseTsv` / `importText` (part4). A ⋯ menü és a könyvtár-elem menü
„szöveg betöltése" pontja. A betöltött szakasz `done`-ba kerül (a felismerés nem fut rá
újra), a duplikátumokat a `mergeSen` szűri, és a kieső duplikátum átadja a magyarját,
ha a bent lévőnek nincs (ez az átfedéses felismerésnél is hasznos). Az SRT a jobb
forrás (teljes, záróidőkkel); TSV-nél a záróidő becsült (következő kezdete, híján +4 s).

## v6: SRT/TSV visszatöltés

`parseSrt`/`parseTsv`/`importText` (+ `#fileTxt` rejtett input), menüpont a lejátszó és
a könyvtár ⋯ menüjében. A betöltött szakasz `done`-nak számít (a felismerés nem fut rá
újra), a `mergeSen` visszatöltésnél a meglévő mondat örökli a magyart, ha még nincs neki.
A TSV-ben nincs záróidő — becsüljük; az SRT a teljesebb forrás. Kör-tesztek a
runtest-ben. FIGYELEM: a munkakönyvtár állapota két ízben is egy félbeszakadt korábbi
munkamenet részmunkáit tartalmazta — új munkamenetben először auditálni kell
(`grep`-pel), mit tartalmaznak a part-fájlok, és csak utána patchelni.

## v7: rögzített magyar sáv (a felhasználó kérésére, harmadik iteráció)

A magyar fordítás helye háromszor változott: felső harmad → képernyő közepe → most a
LEJÁTSZÓ PANEL TETEJÉN rögzítve (`#plHu`, `huMode:'pin'`, ez az alapértelmezés, egyszeri
átállással a mentett beállításokon is — `huV2` jelző). Indok: a szem így mindig
ugyanoda néz, a panel alulról nő, tehát a hosszú mondat sem tolja el a gombokat; az
angol a panel fölé görgetődik (`paintCur` pin-ága). A „magyar" gomb négy állást vált:
pin → cur → all → hide. EZ A VÉGSŐ ELRENDEZÉS, a felhasználó explicit kérése — ne
kerüljön vissza középre igazítás.

## v7: a magyar a kezelőgombokhoz rögzítve

A felhasználó panasza: a magyar mondat fele időnként a lejátszósáv ALÁ került. Két
válasz, együtt:
- **„pin" mód (új alapértelmezés)**: a magyar sor a lejátszó panel TETEJÉN ül
  (`#plHu`, `body.pinhu`), tehát fizikailag nem kerülhet a gombok alá; a panel
  alulról nő, a gombok nem mozdulnak. A folyamban az aktuális pár magyar sora ilyenkor
  rejtett. Egyszeri átállás (`CFG.huV2`) a mentett beállításokon is. A „magyar" gomb
  négy állást léptet: pin → mondatnál → mindenhol → rejtve.
- **A többi módban** a `paintCur` a lejátszó valós magasságával (`$('pl').offsetHeight`)
  számol: a pár alja mindig a panel felett marad; ha a pár magasabb a hasznos sávnál,
  az angol teteje lóg ki felül, nem a magyar alja alul.

## v8: két buborék, középre futó karaoke, borító

- **Dokk** (`#dock`): a magyar sáv (`#huCard`) és a kezelők (`#pl`) KÉT külön üveg-
  buborék, közös, alulról rögzített oszlopban. Az „on" jelzés a `#huCard`-on van.
- **A karaoke a dokk feletti maradék sáv közepén fut** (`paintCur`: `dockH` alapján),
  és a pár alja semmilyen módban nem kerülhet a dokk alá.
- **Borító**: m4b-ből a `covr` atom (`mp4Cover`, a meta „full box", +4 bájt!), mp3/adts-
  ből az ID3v2 `APIC` keret (`id3Cover`, syncsafe méret v2.4-nél). A borító a rekordban
  tárolódik (`rec.cover={mime,b:Uint8Array}`), a `strip()` viszi. Megjelenítés:
  `#coverBg` fix réteg sötétítő gradienssel; a sorok fekete háttércsíkot kapnak
  (`box-decoration-break:clone` + box-shadow trükk), hogy a képen is olvashatók
  legyenek. `body.hascover` kapcsolja.
- Az angolt szándékosan NEM tettük külön buborékba: a folyamban maradva látszik az
  előző/következő mondat kontextusa, ami a követést segíti; a „buborék-érzést" a
  fekete háttércsík adja meg borító felett.

## v9: önfrissítés

`checkUpdate(silent)`: no-store fetch-csel kiolvassa a kiszolgálói `APP_VER`-t; ha
újabb, menti a pozíciót és `location.reload()` — kilépés nélkül frissül. Fut a
⚙ gombra és indulás után 4 mp-vel csendben; az `upd_try` kulcs védi a körbepörgéstől,
amíg a GitHub CDN (max-age 600) még a régit adja. A sw a saját fájlokat
`cache:'no-cache'`-csel kéri, különben a böngésző HTTP-gyorsítótára a hálózat mellett
is régit adhatott — valószínűleg ez okozta a „nem frissül v8-ra" panaszt.

## v10: angol buborék + kézi borító

- Az aktuális mondat valódi üveg-buborékot kapott (`.sen.cur` kártyastílus) — három
  egynemű buborék: angol, magyar, kezelők. A fekete háttércsík csak a környező
  (nem aktuális) sorokra vonatkozik (`:not(.cur)`).
- **Kézi borító**: `shrinkImage` (~900px JPEG canvas-szal, tartalék: nyers kép ≤2,5 MB),
  `askCover` + `#fileImg`, menüpont a lejátszó és a könyvtár ⋯ menüjében. Ok: sok
  podcast-fájlban NINCS beágyazott kép (a borító csak az RSS-ben él) — az openMedia
  ezt naplózza is. A régi rekordok beágyazott borítója egy újra-behúzással jön be.

## v11: lejátszás elölről + újrafordítás

- „Lejátszás elölről" a könyvtári és a lejátszó ⋯ menüben.
- `reTranslate(rec)`: a rekord összes mondatának kulcsát TÖRLI a fordítás-gyorstárból
  (különben a régi Google-fordítás jönne vissza), üríti a hu mezőket, majd `fillHu` a
  MOST beállított motorral. Megszakítható (RT/RTSTOP, a progStop kezeli, a JOB-ág
  előtt). Ami elkészült, megmarad; a maradékot a lejátszás közbeni pótló befejezi.

## v12: rögzített angol buborék

Rögzített (pin) módban a `paintCur` az aktuális angol buborékot mindig a fejléc alá
görgeti (`hdr+12`), nem középre — a felhasználó képernyőképe alapján. Az elrendezés
így teljesen kiszámítható: felül az angol karaoke, alul a magyar + kezelők, közte a
halvány szövegkörnyezet. A nem rögzített módokban maradt a dokk feletti középre
igazítás az alsó védelemmel.

## v13: adatkezelési döntés — MyMemory eltávolítva

A MyMemory a beküldött mondatpárokat nyilvános fordítási memóriába gyűjti, ezért a
felhasználó kérésére VÉGLEG kikerült az ingyenes láncból (Google gtx → Lingva maradt).
Ne kerüljön vissza. A beállítások szövege őszintén kiírja, mi hova megy; bizalmas
tartalomhoz a Claude-fordítás az ajánlott út.

## v13: adathatárok a fordításban

- **MyMemory végleg kint**: nyilvános fordítási memóriát épít a beküldött párokból.
  Az ingyenes lánc: Google gtx → Lingva (utóbbi is a Google-be fut, csak proxyn át).
- **Nincs csendes motorváltás**: ha a felhasználó Claude-ot/egyéb API-t választott és a
  hívás elhasal, a `trBatch` üresen hagyja a köteget (naplóz), és a lejátszás közbeni
  pótló ugyanazzal a motorral próbálja újra. A kiválasztott motor adathatár.
- A ⚙ fordítás-megjegyzés kimondja, hova megy a szöveg mindkét módban.

## Helyi feldolgozó (hallgato_helyi.py, v1)

Külön szállított Python-szkript: faster-whisper (helyi Whisper, nincs 25 MB korlát,
nincs szeletelés) + Argos vagy helyi Ollama fordítás → kétnyelvű SRT, amit az app
„szöveg betöltése" pontja fogad. A mondatbontás az app logikájának Python-portja
(ABBR, MAXW=26, hosszú mondat részei a TELJESBŐL fordulnak). `--proba` önteszt
modellek nélkül; a kimenet parseSrt-kompatibilitása kör-teszttel bizonyítva. A
sandboxban a modellek nem tölthetők le (huggingface nincs engedélyezve), ezért az
éles futás a felhasználó gépén történik — a szkript API-illeszkedése (transcribe
paraméterek) pip-telepítéssel ellenőrizve.

## v14: fordítás menet közben

`CFG.trMode`: 'all' (alap) | 'live'. Élő módban a runJob tömeges fordítása kimarad;
a `fillLive` (5 mp-enként + mondatváltáskor azonnal) a lejátszófej előtt ~12 mondatos
ablakban, max 10-es kötegekben fordít, élő módban szünet alatt is. 'all' módban a
fillLive csak pótló (40-es ablak, csak játszás közben). DeepL a telefonos appba NEM
került be: a DeepL API a böngészős hívást CORS-szal tiltja (saját dokumentáció szerint
is) — a DeepL a gépi eszközben él. Teszt-beállító: `HG.setRec(rec,cur)`.

## v15–v17: borító-illesztés, élő fordítás job alatt, kísérő mód

- v15: a borító a kijelző szélességéhez illeszkedik aránytartással (rétegenkénti
  background-size), v17-től a fejléc ALATT kezdődik (`--hdrH` CSS-változó, `setHdrVar`).
- v16: az élő fordítás a futó feldolgozás ALATT is dolgozik (`fillLive`: a JOB-kapu
  csak 'all' módban zár) — e nélkül pont hallgatás közben nem volt magyar.
- v17: **kísérő mód** (`CFG.follow`, kapcsoló a ⋯ feldolgozás-menüben): a
  `followTick` 15 mp-enként `followPlan`-nal nézi, mennyi a felismert ráhagyás a
  lejátszófej előtt; ha <10 perc, ~5 perces falatot indít `runJob(...,{quiet:true})`
  módban (nincs folyamat-panel, hiba toast+napló). Bekapcsolása a fordítást is
  'live'-ra állítja. Tesztek: `followPlan` határesetei a runtestben.

## v51: FÉL MONDATOKAT FORDÍTOTTUNK — a hiba a fordítás oldalán volt

A felhasználó igazította helyre a keresést: „nem a buborék a lényeg, a kezelést
FORDÍTÁSI szempontból vizsgáld". Ott volt a hiba, és a saját felvétele bizonyítja:

```
EN  „…One of them changed a light bulb for her The porch"
HU  „…Egyikük izzót cserélt neki A tornác"
EN  „light She's offering to sell the old light bulb…"
HU  „fény Felajánlja, hogy eladja a régi izzót…"
```

A fordítási egység kulcsa `s.full || s.en`, és a `full` CSAK akkor van kitöltve, ha a
`breakLong` maga vágta szét egy hosszú mondatot. Amikor viszont a **FELISMERŐ** vág a
mondat közepén — mert ott ért véget a szelete —, nincs `full`, tehát a két félmondat
KÜLÖN fordítási egység, és a fordító fél mondatot kap. A magyar ennek megfelelően
csonka, és a hiba nem a megjelenítésben, hanem a bemenetben van: a legjobb tagolás sem
tud utólag egész mondatot csinálni egy fél mondat fordításából.

`stitchGroups` + `stitchSen`: a szomszédos töredékek, amelyek EGY mondatot alkotnak,
közös `full`-t kapnak **még a fordítás előtt**. Folytatásnak az számít, ha a töredék nem
mondatvégre végződik, és a következő 2 s-en belül kezdődik. `MAXF`=60 fölött nem
egyesítünk — de a futamot nem is dobjuk el: annyit fűzünk össze, amennyi belefér, aztán
új egységet kezdünk. (Az első változat egészben dobta el a hosszú futamokat, és emiatt a
felhasználó felvételében 13 futamból csak 3-at talált meg — pont ott nem javított, ahol
a legrosszabb volt.)

**Automatikus:** minden `mergeSen` végén lefut (`force` nélkül, tehát csak azokat fűzi,
amelyeknek MÉG NINCS fordítása — friss felismerésnél ez az összes), és az újraépítés
végén is. Onnantól a fordító teljes mondatot kap, a `huBuild` egy blokknak látja, a
`huAlign` pedig a magyart a töredékek határaihoz igazítja: a meglévő gépezet jól
dolgozik, csak eddig rossz egységeket kapott.

**A meglévő felvételekhez:** ⋯ → szöveg → **„mondatok összefűzése a fordításhoz (N
töredék)"**. Ez `force`-szal fűz, eldobja a fél mondatokból készült magyart, és CSAK az
érintett mondatokat fordítja újra (a felhasználó felvételében 13 mondat, 65 töredék). A
többi fordításhoz nem nyúl.

Teszt: **`stitchtest.js` 32 próba** — a folytatás felismerésének öt esete, a csoportok
képzése és a MAXF-es bontás, hogy kész fordítást kérés nélkül nem dob el, hogy a
fordítóhoz EGYETLEN kérés megy a TELJES mondattal (a teszt a kért sorokat méri), és a
valódi felvételen a teljes menet.

## v50: MONDATHATÁROK — a felismerő nem tett ki írásjelet

A felhasználó exportált felvételét megmérve: **170 töredékből 53 nem írásjelre
végződik és 34 kisbetűvel kezdődik.** Egész szakaszokon egyetlen pont sincs:
„…introduced themselves to her Said they were ten feet tall, radiant And one of them was
black…". Ez a magyarázata annak, hogy „nem kezel egyben mondatokat": a felismerő a
mondatok KÖZEPÉN vágott, és nincs mit tagolni — a `splitSentences` írásjelet keres, ott
pedig nincs. A v48-as újraépítés ezért nem is tudott mondatot csinálni, csak 26 szavas
töredékeket.

Írásjelet a szövegbe csak nyelvi tudás tud tenni. Az LLM-et ezért **kizárólag
írásjelezésre** kérjük (`SYS_PUNCT`): ugyanazok a szavak, ugyanabban a sorrendben, csak
pont, vessző, kérdőjel és nagy kezdőbetű kerül közéjük — se fordítás, se javítás, se
átrendezés.

**Ez ellenőrizhető, és ez a lényeg.** A `punctNorm` a válasz szavait írásjelek és
kisbetű/nagybetű nélkül összefűzi, és összeveti az eredetivel. Ha nem betűre azonos, a
választ **eldobjuk**, és marad a régi szöveg. A `puncttest` szándékosan hazudó modellt
is szimulál (átírja a szöveget, elhagy szavakat, hálózati hiba) — mindhárom esetben a
felismerés eredménye érintetlen marad. **Egy nyelvi modell nem tudja elrontani az
adatot, csak javítani.**

A menetrend: `senRuns` (a szófolyam szakaszai, 2 s-nél nagyobb szünetnél vágva) →
`needPunct` (25 szónál ritkább mondatvég) → `repunct` 600 szavas kérésekben → a szavak
visszaírása a szófolyamba (az IDŐK érintetlenek, mert szó szerinti a megfeleltetés) →
`runsToSen` (a v48-as tagolás, ami most már talál mondatot) → a v48-as fordítás-átvétel
és a v49-es időrend-rendezés.

Menüpont: **„mondathatárok helyreállítása + újraépítés (N szakasz)"**, a ⋯ → szöveg
szakaszban a sima újraépítés mellett. LLM-kulcs kell hozzá (Claude vagy egyéb API); a
szám előre megmutatja, hány szakaszról van szó, tehát a költség becsülhető.

Teszt: **`puncttest.js` 22 próba** — a felismerés (mikor kell írásjelezni), a válasz
ellenőrzésének mindhárom bukó ága, és a felhasználó VALÓDI felvételén: a mondatvégre
végződő töredékek aránya nő, a kisbetűvel kezdődők száma csökken, nincs halott mondat,
minden töredéknek van magyarja, az idők monotonok, és kulcs nélkül nem indul el.

## v49: HALOTT MONDATOK — az igazi ok, amiért „átugorja a talált mondatokat"

A felhasználó exportált SRT-je zárta le a hetekig kerülgetett hibát. A két döntő sor:

```
#110  739.7 → 752.1   The old church down the street, concrete beneath my feet, …
#111  739.7 → 767.7   The shadows of the leaves These add more than these …
```

A #110 az, amit az átfutás megtalált (a dal első sora), a #111 a régi szalag — és
**mind a kettő ugyanabban a másodpercben kezdődik**. Az aktuális mondatot úgy
választjuk, hogy az UTOLSÓ olyan kell, aminek a kezdete még nem múlt el (bináris keresés
az `a` időkre), tehát egyforma kezdetnél mindig a KÉSŐBBI nyer, a korábbi pedig **soha
nem kerül sorra**. Halott mondat: ott van a listában, látszik a szövegben, a lejátszó
mégis átugorja. Szó szerint ezt írta a felhasználó, és minden korábbi javításom
(fordítás, index, sávok, tagolás) mellette ment el.

A felvétel egésze is mutatta a bajt: **170 mondatból 119 fedte az előzőt**, kilenc
mondat 20 s-nél hosszabb, kettő pedig halott volt.

A szabály, amit a felhasználó fogalmazott meg, és ami gépiesítve lett (`normSen`):
**amelyik korábban ér véget, annak kell előbb lennie.** Ezért a rendezés `(a, b)`
szerint, majd:

- **egyforma kezdetnél** a későbbi mondat a korábbi VÉGÉRE tolódik — a rövidebb,
  pontosabb mondat kapja meg a szakasz elejét, a szalag onnan folytatódik (a #110
  játszik 739,7–752,1, a #111 onnantól);
- **részleges átfedésnél** a korábbi mondat FARKA húzódik vissza a következő kezdetéig;
- a szószintű időket a mondat szakaszába szorítjuk;
- négy körben fut, mert egy tolás új átfedést szülhet.

**Automatikus, három ponton:** minden `mergeSen` után (tehát a rendes felismerés, az
átfutás, a hézagkeresés és az importálás is), az újraépítés után, és **megnyitáskor** —
így a régebbi felvételek is maguktól rendbe jönnek, mentéssel, a naplóba írva. Nincs
menüpont, nincs mit elindítani.

Teszt: **`normtest.js` 34 próba, a felhasználó VALÓDI felvételén** (`fix/pilot.json`, az
exportált SRT-ből: 170 mondat, 119 átfedés, 2 halott mondat). Mérve: a szabály mindhárom
ága, a hármas egyforma kezdet feloldása, a szavak a szakaszon belül maradnak; a valódi
felvételen a rendezés után **egyetlen halott mondat sem marad**, a mondatszám és minden
fordítás megmarad, a dal első sora ELŐBB áll, mint a szalag, és — a legfontosabb —
`senAt` **minden** mondatot ki tud választani a saját idejében. Plusz: megnyitáskor
magától javít és ment, rendezett felvételhez pedig nem nyúl.

**Tanulság:** amikor a felhasználó azt mondja, hogy „látszik, de nem számít", az
adatszerkezetben kell keresni a választ, nem a rajzolásban. Egy exportált fájl (170 sor)
öt perc alatt megmutatta azt, amit öt kiadás találgatása nem.

## v48: SZÖVEG ÚJRAÉPÍTÉSE a meglévő felismerésből

A `splitUnits` (v47) célzott javítás. Ez a teljes újraépítés, ugyanabban a ⋯ → szöveg
menüben: **„szöveg újraépítése (angol tagolás + magyar)"**.

**A hangot nem kérdezzük meg újra.** A felismerés eredménye megvan, csak rosszul volt
TAGOLVA — a szavak és az időbélyegek a helyükön vannak. A `wordStream(rec)` ezért
szavakra bontja a meglévő töredékeket: ha van szószintű idő (`w`), az a horgony,
különben a töredék [a,b] szakaszán osztunk egyenletesen; a töredék utolsó szavának a vége
mindig maga a töredék vége (ez biztos pont). A `rebuildSen(rec)` ebből a szófolyamból
építi újra a tagolást a MAI szabályokkal: `splitSentences` → `breakLong` (`MAXW`
töredékek, `MAXF` korlát), és minden új töredék a saját szavainak idejét kapja.

Két óvintézkedés:

- **2 másodpercnél nagyobb szünetnél kötelezően vágunk** (`REBUILD_GAP`). A néma
  szakaszon átnyúló mondat sem a szemnek, sem a fülnek nem mond semmit — és a felismerő
  írásjel nélküli szalagja pont ilyet csinálna.
- **Ami fordítási egység nem változik, annak a magyarja megmarad.** Az újraépítés előtt
  a meglévő fordításokat beírjuk a gyorstárba (kulcs szerint), tehát a változatlan
  egységek szövege akkor sem veszik el, ha a gyorstárat közben törölték; utána csak a
  tényleg ÚJ egységekre kérünk fordítást. A megerősítő kérdés előre megmondja, mennyi
  ez: „N töredék helyett M, K új fordítási egység készül el".

A lezárás ugyanaz a rend, mint az átfutásnál és a szétvágásnál: `senAt`-ból CUR,
`renderKara`, `layoutSplit`, `pgReset`, `renderHu`, `paintCur`, `drawSeek`.

Teszt: **`rebtest.js` 27 próba** — a szófolyam (szószintű idő és annak hiánya), két
mondat egy töredékből kettő lesz, a szöveg egyetlen szava sem tűnik el, a szünetet nem
hidalja át töredék, a 150 szavas szalag sok töredékre esik és egyik sem hordozza a
teljes szalagot, az idők a szakaszon belül maradnak; a teljes műveletnél a gyorstárból
meglévő magyar megmarad, és CSAK az új egységet kérjük le a fordítótól (a teszt a kért
sorokat is méri), a karaoke és a magyar folyam újraépül, a mentés is az új tagolást
tartja, plusz az elfajult esetek és a menüpont jelenléte.

## v47: a MEGLÉVŐ összefolyó szakaszok szétvágása

A felhasználó pontos leírása zárta le a történetet: „a dal elejét újra fel kellett
ismertetnem, mert nem hallotta. De utána nem fűzte be a szövegfolyamba."

Be volt fűzve — csak nem volt látható, hogy be van, mert a felismerő a dalos szakaszra
EGYETLEN, írásjel nélküli, több száz szavas szalagot ad, és abból egy fordítási egység
lett: egy irdatlan buborék összefolyó magyar szöveggel, ami sehol nem vált a hanggal. Ez
pontosan úgy néz ki, mint amikor a program nem fűzte be az új mondatokat.

A v46-os `MAXF=60` korlát csak az ÚJ felismerésre hat, tehát aki már felismertette az
ilyen szakaszt, annak az adata megmarad rossznak. Ezért kellett az utólagos javító:
`splitUnits(rec)` a ⋯ → szöveg szakaszban, **„összefolyó fordítások szétvágása (N
töredék)"** néven (a szám előre látszik).

Amit tesz: a `hugeUnits(rec)` megkeresi azokat a töredékeket, amelyek `full` mezője 60
szónál hosszabb; elveszi tőlük a közös `full`-t, tehát **minden töredék a SAJÁT fordítási
egysége lesz**; törli a hozzájuk tartozó régi magyar szöveget és szópárokat (azok egy
másik egységhez tartoztak); majd CSAK ezeket fordítja újra. A felvétel többi részéhez és
a többi fordításhoz nem nyúl. A lezárás ugyanaz a rend, mint az átfutásnál:
`senAt`-ból CUR, `renderKara`, `layoutSplit`, `pgReset`, `renderHu`.

Teszt: **`gaptest.js` 79 próba** — hat töredék egy 120 szavas szalaggal szétvágás előtt
EGY blokk, utána hat külön blokk külön fordítással, a régi szópárok elmennek, az
érintetlen mondatok fordítása megmarad, mentve is így van, és ha nincs mit szétvágni, azt
megmondja.

**Egy tesztelési tanulság:** a `gaptest` Google-utánzata egyetlen sort adott vissza
akárhány kért sorra, amitől a `gtxLines` (helyesen) „nem illeszkedő köteg"-et dobott, és
a teszt mást mért, mint amit hittem. A hálózat-utánzatnak a valódi szolgáltatás
SZERZŐDÉSÉT kell utánoznia (annyi sor, amennyit kértünk), nem csak „valamit válaszolni".

## v46: egymásra csúszó sávok, halott bezárás gomb, óriás fordítási egység

Három hiba egy képernyőképről, mind az átfutás utáni állapotból.

### A két sáv egymásra csúszott

A képernyőképen az angol buborékok és a magyar blokkok egymáson feküdtek. Az ok: a
felezés (`layoutSplit`) a fejléc és a kezelősáv VALÓDI magasságából számol, a fejlécben
pedig ott a mondatszám („154 mondat" → „176 mondat") — ami sortöréssel más magasságot
adhat. Az átfutás lezárása eddig újrarajzolt, de a felezést nem számolta újra, tehát a
sávok a RÉGI magasságokkal maradtak. A lezárás sorrendje most: `renderKara` (itt frissül
a fejléc) → `layoutSplit` (ehhez mérünk) → `pgReset` + `renderHu`.

### A bezárás gomb nem működött

A `closeRec` egyetlen sorban futtatott le mindent: szünet, elszámolás, bankmentés,
pozíció mentése, videó leállítása, majd `show('vLib')`. **Ha bármelyik lépés kivételt
dobott, a `show('vLib')` már nem futott le** — kívülről ez pontosan úgy néz ki, hogy a
gomb halott. Mostantól minden takarító lépés egyenként védve van, a hiba a naplóba megy,
és a kilépés a végén AKKOR IS megtörténik, ha valami elhasalt.

**Ez a v39c tanulságának a párja:** ha egy műveletnek van egy lépése, amit a
felhasználó a többinél sokkal jobban észrevesz (itt: hogy egyáltalán kilép-e), azt a
lépést nem szabad egy sorba fűzni a takarítással.

### Egy írásjel nélküli szalag lett EGY fordítási egység

A képernyőképen egy irdatlan buborék állt összefolyó magyar szöveggel („A levelek
árnyékai Ezek többet adnak ezeknél Ezek többet adnak ezeknél Mélyebbre ásni…"). Ez nem
a tagolás hibája: a `breakLong` az `f` mezőben a TELJES eredeti mondatot adja tovább
(hogy a vesszőnél elvágott töredék alatt ne legyen csonka a magyar) — dalszövegnél és
zene alatti beszédnél viszont a felismerő egyetlen, írásjel nélküli szalagot ad, akár
több száz szót. Abból egy fordítási egység lett, egyetlen óriás buborékkal.

Új korlát: `MAXF=60`. Ha az „egy mondat" ennél hosszabb, a töredékek NEM kapják meg a
teljes szalagot — mindegyik a saját fordítási egysége lesz. Rendes, hosszú mondatnál (40
szó) minden marad a régiben.

Teszt: **`gaptest.js` 69 próba** — az átfutás újraszámolja a felezést; a bezárás akkor is
kilép, ha a takarítás egyik lépése kivételt dob (a teszt szándékosan dobat), és a hiba a
naplóba kerül; a 40 szavas mondat töredékei a teljes mondatot kapják egységnek, a 200
szavas szalag töredékei viszont mind a sajátjukat.

## v45: „22 új mondatot talált, de nem fűzi be" — három ok, egy tünet

A felismerés végre hozott 22 új mondatot, a felhasználó viszont nem látta őket a
karaokéban. A beolvasztás és a rajzolás mérve jó volt (a `mergeSen` időrendbe fűz, a
`renderKara` újraépül), tehát a tünet máshonnan jött. Három dolog javítva, mind
hozzájárul ehhez az érzethez:

1. **„Menet közben" módban az új mondatok fordítás NÉLKÜL maradtak.** A `runPass` a
   `CFG.trMode!=='live'` feltételhez kötötte a fordítást. Az a feltétel a TÖMEGES
   előre-fordítás elkerülésére van (a kísérő mód épp azt spórolja), de itt nem arról van
   szó: kézzel kért, határos (néhány tucat) mondatról. Fordítás nélkül a mondat alatt
   nincs magyar, tehát a felhasználó joggal látja úgy, hogy „nincs befűzve". Az új
   mondatok fordítása mostantól MINDIG lefut az átfutás végén.
2. **Az `CUR` index elcsúszott.** A beszúrások megváltoztatják a mondatok sorszámát,
   `CUR` viszont SZÁM. Ha a beszúrás az aktuális mondat ELŐTT történt, a kijelző a régi
   számhoz tartozó ablakot mutatta — más szakasz, mint amit a hang játszik. A `tick`
   magától kijavítja, de csak a következő ütemben és csak ha fut; az átfutás lezárása
   ezért mostantól maga számolja újra: `CUR=senAt(A.currentTime)`, majd hard
   újrarajzolás mindkét sávra, plusz `paintCur` és `drawSeek`.
3. **Nem volt mit megnézni.** A „22 új mondat" felirat nem mondja meg, HOVA kerültek. Az
   átfutás végén ezért `sheetNew(ujak)` felsorolja őket időrendben, időbélyeggel és az
   angol szöveggel, és koppintásra ODAUGRIK a lejátszó. Egy másodperc alatt
   ellenőrizhető, hogy a helyükre fűztük-e be őket — és ha nem, az is látszik. A
   naplóba is bekerül minden kör: `átfutás: N új mondat @ 12:34, 15:02…`.

**Tanulság:** ha egy művelet a meglévő adatszerkezetbe SZÚR BE, akkor minden indexet
tartalmazó állapotot (itt `CUR`) újra kell származtatni abból, ami nem csúszik el (itt az
idő). És egy „N darab bekerült" visszajelzés önmagában nem visszajelzés: mutatni kell,
mi és hova.

Teszt: **`gaptest.js` 59 próba** — az új mondat kísérő módban is lefordítva kerül be, a
beszúrás után az aktuális mondatot az IDŐ dönti el (nem a régi index), a karaoke és a
magyar folyam is tartalmazza, és a lezáró lap felsorolja az új mondatokat időbélyeggel.

## v44: a funkció megvolt, az ÚT nem — a menüpont eltűnt kész felvételnél

A felhasználó a ⋯ menüben állt, és nem volt hol elindítania a második átfutást. Az ok
egyetlen feltétel a menüben:

```
!isYtRec() && gap && {t:'feldolgozás folytatása', fn:sheetProcess}
```

A `gap` akkor null, ha a felvétel 100%-ban fel van dolgozva — és ilyenkor a menüpont
ELTŰNT, vele pedig az EGYETLEN bejárat a „mit ismerjünk fel?" lapra, ahol a v43-as
második átfutás lakott. Tehát a funkció megvolt, a hozzá vezető út nem: pont a kész
felvételnél, ahol az újrafutásnak a legtöbb értelme van.

Javítva, feltételek nélkül:

- a ⋯ menüben MINDIG ott van a felismerés pontja (kész felvételnél „felismerés újra
  (Whisper)…" néven), tehát a lap elérhető;
- mellé egy **egy koppintásos** út is: „újra végig Whisperrel (~N kérés)" — a becsült
  kérésszámmal, mert az a döntés, ami a felhasználót érdekli;
- a lapon a második átfutás pontjai is elvesztették a feltételeiket (eddig
  `REC.sen.length`-hez és `t>5`-hez voltak kötve): mondat nélküli felvételnél is ott
  vannak;
- az indítás egy helyen: `passRange(a,b)` — a menü és a lap is ezt hívja, és csak az
  marad feltétel, ami nélkül fizikailag nem megy (felismerő kulcs és a hang).

**Tanulság, a v39c/v40 mellé:** egy funkciót nem elég megírni, az ÚTJÁT is tesztelni
kell. A `gaptest.js` eddig a `runPass`-t hívta közvetlenül, tehát zölden futott, miközben
a felhasználó nem tudott hozzá eljutni. Az új próbák ezért a `pMore` menüt és a
`sheetProcess` lapot RENDEREZIK, és a szövegében keresik a pontot — a funkció mellett a
bejáratot is védik.

Teszt: **`gaptest.js` 52 próba** — teljesen feldolgozott felvételen (ahol nincs hézag)
ott van a felismerés menüpont és az egy koppintásos újrafutás a kérésszámmal, a lapon ott
a teljes felvétel átfutása, és mondat nélküli felvételnél is felajánlja.

## v43: MÁSODIK ÁTFUTÁS — a hézagkeresés kevés volt

A v42 csak a mondatok közti néma foltokat futtatta újra, és élesben ez megbukott: a
felhasználó HALLOTTA a hiányt, a program viszont nem talált hézagot, tehát fel sem
ajánlotta. Ennek az oka szerkezeti: a felismerő úgy is elhagy beszédet, hogy nem hagy
utána elég nagy időrést — a kihagyott mondatot beolvasztja a szomszéd időtartamába,
vagy egymásra beszélésnél egyszerűen csak az egyik szálat írja le. Ilyenkor a
mondatlistán nincs mit észrevenni.

A megoldás nem finomabb hézagkeresés, hanem az, hogy **ne a hézag legyen a feltétel**.
A `runPass(rec,M,ranges,cím)` a `done`-t figyelmen kívül hagyja, és a megadott
szakaszokat egyszerűen újra végigkérdezi. A gazdaságtan ezt engedi: a Groq ingyenes
szintje napi 120 kérés, egy rövid rádiójáték pedig néhány kérés — a KERESÉSSEL nem kell
takarékoskodni. A lapon ezért ott a becsült kérésszám is.

A lap három pontja: **második átfutás: a teljes felvétel**, **innentől a végéig**, és —
ha van elég nagy néma folt — **csak a néma foltok** (az olcsóbb változat, `runGaps`,
ami már csak a `runPass` szűkítése). A hézagküszöb 3 s-ről 1,5 s-re csökkent.

### A döntést a SZÖVEG hozza, nem az idő

Ez a v43 igazi tanulsága, és egy hibán tanultam meg menet közben: az első változat még
azt is vizsgálta, mennyire fedi az új mondat időben a meglévőket (85% fölött eldobta) —
és **pont a valódi találatot dobta el**, mert a kihagyott mondat ott van, ahol a
felismerő egy túl hosszúra nyúlt mondatot jelzett. Az időbeli fedés tehát nem
használható kizárásra: egymásra beszélésnél két mondat ugyanabban a másodpercben van.

A szűrő ezért `simWords(új, meglévő)`: **IRÁNYÍTOTT** egyezés — az ÚJ mondat szavai közül
mennyi szerepel már a közeli meglévőben. 70% fölött ismétlés. Az irány fontos: a
másképp tördelt fél mondat („One two") teljes egészében benne van a meglévőben („One two
three four"), tehát ismétlés; egy valódi új mondat viszont, amiben véletlenül szerepel a
szomszéd egyetlen szava („Missing one" a „One." mellett), nem az. A rövidebbhez
normalizált (szimmetrikus) arány pont ezt rontotta el, és minden rövid szomszéd mellett
elnyelte az új mondatokat.

A hozzáadás továbbra is csak HOZZÁTESZ: a `mergeSen` időrendbe fűz, a meglévő mondatokhoz
és a KÉSZ magyar szöveghez semmi nem nyúl, és a fordítás csak az új mondatokra fut.

Teszt: **`gaptest.js` 47 próba** (a v42-es 34 bővítve) — a `simWords` mindkét iránya, a
fedett szakaszon lévő új mondat BEKERÜL, az átfogalmazott ismétlés nem, a teljes átfutás
akkor is talál, ha nincs hézag, a kérésszám becslése, és hogy néma folt nélkül a
hézagkeresés a második átfutásra irányít. A hangot valódi 40 s-os WAV adja, a hálózat a
`fetch` szintjén elfogva.

## v42: kimaradt mondatok keresése (a felismerő második átfutása)

A felhasználó észrevétele: a Groq/Whisper sem vett észre mindent. A kérés: futtassuk
újra, de úgy, hogy ami már megvan és le van fordítva, az ne sérüljön — csak a
kimaradt mondatokat keressük meg.

**A kulcs, hogy hol keressük.** A felismerő nem csak akkor hagy ki szöveget, ha nem
futott le: a Whisper egy szeleten BELÜL is elhagyhat beszédet (halkabb rész, egymásra
beszélés, zene alatti mondat), és a `done` szerint az a szakasz mégis „kész". Ilyenkor
a kimaradás csak a MONDATOK időbélyegein látszik: két felismert mondat között van egy
néma folt, amit már feldolgozottnak jelöltünk. A `senGaps(rec,minGap)` pontosan ezt
gyűjti — a legalább 3 másodperces foltokat, amelyeket a `done` FED. Amit nem fedett,
ahhoz nem nyúl: azt a rendes felismerés viszi.

**Amiért érdemes újra megkérdezni.** Két dolog változik a második átfutásban: a szelet
pontosan a hézagra esik (nem egy tízperces darab közepén van, ahol a modell átlépte),
és a hőmérséklet 0 helyett 0.2 — a nulla determinisztikus, tehát amit egyszer
elhagyott, azt másodszor is elhagyná. A hézag előtti mondat súgásként (`prompt`) is
elmegy, hogy legyen kontextus.

**Amit nem szabad elrontani.** A visszahozott mondatok a `mergeSen`-en mennek át, ami
időrendbe fűz és az ismétlést eldobja — de előtte a `gapKeep` szűr, mert a ráhagyásból
és a hallucinációkból nem kérünk: csak az marad, aminek a KÖZEPE a hézagba esik, ami a
már felismert szöveget legfeljebb 40%-ban fedi, ami nem üres vagy csupa írásjel, és ami
nem a szomszéd mondat szó szerinti mása. Fordítani pedig CSAK az új mondatokat
fordítjuk (`rec.sen.filter(s=>!s.hu)`), tehát a meglévő magyar szöveg érintetlen.

Egy meglévő viselkedés, amit érdemes tudni: ha egy mondat már bent volt fordítás
NÉLKÜL, és most fordítással jön vissza, a `mergeSen` átveszi a fordítást. A KÉSZ
fordítást viszont semmi nem írja át.

A ⋯ → „mit ismerjünk fel?" lapon új pont: **„kimaradt mondatok keresése (N hézag ·
mm:ss)"** — csak akkor jelenik meg, ha van hézag. Megszakítható és folytatható, mint a
rendes felismerés.

Teszt: **`gaptest.js` 34 próba.** A hálózat a `fetch` szintjén van elfogva, a hangot
pedig egy VALÓDI 40 másodperces WAV adja, tehát az igazi szeletelő fut le. Mérve: a
hézagfelismerés (mondatok közti folt, felvétel eleje, mondat nélküli felvétel, és hogy
a fel nem dolgozott rész NEM hézag), a `gapKeep` mind az öt szűrője, a beolvasztás
sorrendje, hogy a kész fordítást semmi nem írja át, a teljes menet (0.2 hőmérséklet, a
súgásban a hézag előtti mondat, az új mondat bekerül és le is lesz fordítva, a felvétel
mentve), és hogy hézag nélkül nem hívjuk a felismerőt.

## v41: egy MONDAT újrafordítása másik motorral

A gépi fordítás néha egy konkrét mondaton bukik el — és pont azon, amit épp olvasol. A
kérés: legyen újrafordítható, de **teljes mondatokra**, mert a tagolás miatt egy mondat
3-4 buborék is lehet.

**Az egység a mondat, nem a buborék.** A fordítás mindig a teljes mondatra készül, és a
gyorstár kulcsa is az (`huKey` = `s.full||s.en`), tehát a mondat minden töredéke ugyanazt
a magyar szöveget hordozza. A `huUnit(gi)` a blokkból visszakeresi a mondatot: a
`huKey`-t megfogja, és a töredékek listáján kifelé lép, amíg ugyanaz a kulcs. Ez az
egység kerül újrafordításra, tehát a 3-4 buborék EGYSZERRE cserélődik — nem lehet
belőlük fél-új, fél-régi mondat.

**A gyorstárat szándékosan kihagyjuk.** A `trBatch` a gyorstárból válaszol, tehát a
„még egyszer" önmagában semmit nem érne. A `trOne(line,eng,wantPairs)` közvetlenül hívja
a motort, és a motort a HÍVÓ választja meg, nem a `CFG.tr` — így a beállított motor is
kérhető újra („újra ugyanezzel"), ami a gyorstár kihagyása miatt már más eredményt is
adhat. Sikeres csere után a gyorstárba az ÚJ szöveg kerül, különben a lejátszás közbeni
pótló visszaírná a régit.

**Visszavonás.** Az első csere előtti szöveget a töredék `hu0` mezőjében megtartjuk, és
a lap alján megjelenik az „eredeti fordítás visszaállítása". A `tre` mező jegyzi, melyik
motor adta a mostani szöveget — a lapon látszik is.

**Szópárok.** LLM-motornál és bekapcsolt tanuló módnál a `llmRich` út fut, tehát az új
fordítás mellé friss szópárok és tagmondatok is jönnek (`pairs`, `cls`); ha az elhasal,
csak a szöveg cserélődik. Az ingyenes motor nem tud szópárt — ott a tanuló mód
mindenképp a régi párokkal megy tovább.

**A gomb.** Minden buborék markupjába kikerül egy `⟳` (`RTR`), de a CSS csak az
AKTUÁLISON mutatja, és `position:absolute` — a lap magasságába nem szól bele, ami
lapozós módban feltétel (a lapot a magasságok határozzák meg). A gombra koppintás nem
ugrik a mondatra: a kattintás-kezelő `stopPropagation`-nal elfogja. Fontos: az élő
fordítás a buborék tartalmát újraírja (`el.innerHTML=weave(q)`), ezért a gombot ott is
pótolni kell — a `RTR` egy helyen áll, mind a két útvonal ezt használja.

**Két hiba, amit a teszt fogott meg a felszabadítás előtt:** a mentés `cacheSave(false)`
néven hívta a gyorstármentőt, ami nem létezik (a neve `saveCache`), tehát az első
újrafordítás `ReferenceError`-t dobott volna; és a gomb CSS-e meg a kattintás-kezelője
elkészült, de a GOMB markupja nem került be a `renderHu`-ba.

Teszt: **`retrtest.js` 31 próba.** A hálózatot a `fetch` szintjén fogja el, tehát a
valódi motor-útvonal fut le: az egység három töredéket fog össze, a szomszéd mondat
érintetlen, a fordítót a TELJES mondattal hívjuk a gyorstár mellett, a gyorstárba az új
szöveg kerül, a felvétel mentve lesz, a visszavonás mindhárom töredéket visszaállítja,
bukott hálózatnál a régi szöveg marad és a felhasználó hibát lát, és a gomb az élő
fordítás utáni újraírást is túléli.

## v40: a tagolás a SZÖVEGET követi, és megszűnt a görgetés utáni villogás

### A tagolás: egy buborék = egy mondat

A v36–v39 a magyar szöveget az angol töredékek IDEJE arányában osztotta szét, és csak
±2 szón belül keresett írásjelet. Magyar szórenddel ez rendszeresen a szerkezet közepén
vágott, és a felhasználó ezt látta: „a buborékok tagolása még mindig nem igazán követi a
szöveget".

Az új szabály **megfordítja a sorrendet**: először a SZÖVEG mondja meg, hol lehet
vágni, és csak utána jön az idő, hogy a lehetséges helyek közül melyiket választjuk.

- `huCuts(w)` összeszedi a lehetséges határokat erősséggel: mondatvég 4,
  kettőspont/pontosvessző 3, vessző és gondolatjel 2, kötőszó előtti hely 1 (vessző
  nélkül is, mert a gépi fordítás gyakran elhagyja). A rövidítés pontja (`pl.`, `stb.`,
  `dr.`) nem mondatvég.
- A tagolás **minden mondatvégnél vág**, ha mindkét oldal legalább `HU_MINW`=6 szó.
  Tehát egy buborék egy mondat.
- Csak azt a részt bontjuk tovább, ami így is `HU_MAXW`=34 szónál hosszabb — ott már
  tagmondathatárt is elfogadunk, ~16 szavas céllal (`huPick`).
- **Ha nincs egyetlen alkalmas hely sem, a blokk EGYBEN marad.** Inkább egy hosszú
  buborék, mint egy félbevágott szerkezet — és a v39d óta ez nem is probléma: az
  olvasott buborék mindig egészben kifér, a lap alkalmazkodik hozzá.
- Az időhatárok utána a legközelebbi ANGOL TÖREDÉK kezdetére ugranak (monoton, ha lehet
  külön töredékre), tehát a v36 lényege — a két sáv együtt vált — megmarad.

Teszt: **`cuttest.js` 26 próba.** A tétje egy invariáns: **minden blokk vége valódi
határ** — a teszt szavanként ellenőrzi, hogy a blokk utolsó szava írásjelre végződik,
vagy a következő blokk kötőszóval kezdődik. Valódi, a képernyőképről vett mondatokkal,
plusz az elfajult esetek (nincs magyar szöveg, nincs töredék, csupa rövid mondat), és
hogy a szöveg egyetlen szava sem tűnik el a tagolásban.

### A villogás: a magyar sávhoz EGY görgető tartozik

Ujjal görgetés után a `huHold` ötmásodperces időzítője a v37-es `scrollTick`-et hívta.
Az az AKTUÁLIS buborékot húzza a sáv tetejére (és a mondaton belül folyamatosan
görget), a lapozós mód viszont a LAP első buborékját tartja ott — a kettő felváltva
állította a `scrollTop`-ot. Ráadásul ha a `pgPaint` egy pillanatra nem tudott festeni,
a `paintHu` visszaesett a régi festésre, és felkerültek a `near`/`far` osztályok is,
más betűmérettel. Innen a villogás.

- `scrollTick` lapozós módban **nem nyúl a magyar sávhoz** (az angol oldalt továbbra is
  kezeli, ott ő a felelős);
- a `huHold` időzítője lapozós módban a `pgPaint`-et hívja;
- a `paintHu` lapozós módban **soha nem esik vissza** a régi festésre: ha a lap nem
  festhető (az aktuális blokk kicsúszott az ablakból), egyszer újraépíti az ablakot
  (`PGFIX` védi a rekurziót), és kész;
- a lapozás-villanás (`pgTurn`) 600 ms-en belül nem ismételhet.

**Szabály innentől:** egy megjelenítési tulajdonsághoz (görgetés, osztályok) EGY
felelős tartozzon módonként. Ha egy régi és egy új szabály ugyanarra a DOM-tulajdonságra
ír, az nem „redundancia", hanem villogás.

Teszt: a `pagetest.js` 64 próbára bővült — a `scrollTick` nem mozdítja a sávot lapozós
módban, nincs `near`/`far` osztály, és a második lapozás 600 ms-en belül nem villan újra.

## v39d: a következő buborék LÁTSZIK, és a borító visszajött

A felhasználó két észrevétele, mindkettő a lapozós tanuló módra.

**1. A lap alja ne legyen üres.** A v38 elrejtette a lapon kívüli blokkokat (`.off`),
ezért a sáv alja üres maradt, és nem látszott, mi következik. A kérés: a következő
buborék LÁTSZÓDJON, akkor is, ha nem fér ki egészben — és amikor rákerül a sor, AKKOR
kerüljön a képernyő tetejére.

Ez a lap fogalmán nem változtat, csak a rejtésen: a `pgEnd` szabálya ugyanaz marad
(**az éppen olvasott buborék MINDIG egészben kiférjen**), a lap alatti blokkokat viszont
nem rejtjük el — a sávból kicsúszva félig látszanak (a `#huWrap` vágja el őket), és
amikor a kicsúszó buborékra kerül a sor, ő nyitja az új lapot, tehát a sáv tetejére
kerül, egészben. A `.off` osztály és a hozzá tartozó CSS teljesen kikerült; a lap
FÖLÖTTI blokkok amúgy is a görgetés fölött vannak, azokat nem kell elrejteni.

**2. „A háttér eltűnt."** A v39c-ben a borítót tanuló módban elrejtettem az
olvashatóság miatt — a felhasználónak kell. Visszajött, de kap egy erősebb sötétítő
réteget (`body.playing.learn #coverBg:after`, 56%), és a nem aktuális sorok újra halvány
fekete alapot kapnak. A réteg a KÉPEN van, nem a buborékok fölött, tehát a kiemelt
buborék teljes fényét nem tompítja.

Teszt: a `pagetest.js` 59 próbára bővült — a következő buborék `soon` és nem rejtett,
nincs egyetlen `.off` sem, az előző lap utolsó buborékja `done`, és a CSS-oldalon a
borító nincs elrejtve, viszont megvan a sötétítő réteg és a sorok alapja.

## v39c: a kiemelés elveszett újrarajzoláskor (a v38 lapozás igazi hibája)

A felhasználó: „egy darab szövegbuborék sem kap kiemelést". A képernyőképen minden
buborék egyforma szürke volt, és a lapon KÍVÜLI blokkok is látszottak — tehát nem a
CSS hiányzott (a `paged` osztály ott volt), hanem az OSZTÁLYOK nem kerültek fel.

A gyökér: a `renderHu` újraépíti a markupot, és eddig csak a mért geometriát
(`PGM`) érvénytelenítette. Ha közben a lap ÉS az aktuális blokk nem változott — és
pont ez a helyzet **élő fordításnál**, ahol a `syncHuFlow` a megérkező szövegre
`huBuild` + `renderHu(true)`-t hív ugyanarra a blokkra —, a `pgPaint` a „nincs
változás" ágon (`!need && PGgi===gi`) KILÉPETT, a friss elemekre pedig soha nem
került rá a `cur`/`done`/`off`. A tesztek ezért nem fogták meg: ott a render után
mindig más `gi`-vel festettünk.

Két lépésben javítva:
- `renderHu` (és a beszövés-frissítés) mostantól a `PGgi`-t is nullázza, nem csak a
  `PGM`-et: **új markup = az osztályokat újra fel kell tenni**;
- a `pgPaint` „nincs változás" ága ellenőrzi, hogy VAN-e egyáltalán kiemelt buborék a
  lapon (`.hs.cur`), és ha nincs, akkor fest, bármit mondanak a számlálók. Ez az
  öv-és-nadrágtartó: a jelölés nélküli lap sosem maradhat így.

**Tanulság, a v35/v38/v39a mellé:** ha egy állapotot a DOM-ban tartunk (osztályok), az
állapot ÉLETTARTAMA a DOM-elem élettartama. Aki újraépíti a markupot, annak minden
DOM-ban tárolt állapotot érvénytelenítenie kell — nem csak azt, ami épp eszébe jut.

Ráadás, ugyanabból a képernyőképből: **tanuló módban a borító a szöveg mögött maradt**,
és egy zsúfolt podcast-borító pont a kontrasztot viszi el, ami a kiemelést hordozza.
Tanuló módban a `#coverBg` mostantól rejtve van (a pihenő mód felezett képernyőjén
marad), és a sorok mögé sem kell a fekete csík.

Teszt: a `pagetest.js` 55 próbára bővült — újraépítés VÁLTOZATLAN aktuális blokkal
(pontosan egy kiemelt marad, a lapon kívüliek rejtve), a szándékosan letörölt
osztályok visszafestése, és hogy a borító tanuló módban el van rejtve.

## v39b: a fedőlap-sor KÉT műveletet is tud (a kivétel végre kézre áll)

A felhasználó jogos kérdése a lista lapján: „ha a felső részt törölni akarom a
listáról, azt hogy kell? Rányomok és egyből elindul, nincs egy pöcök a részen."

Igaza volt, és a hiba a `sheet()` szerkezetében ült: **egy fedőlap-sor eddig egyetlen
gomb volt**, tehát egy sorhoz egy művelet tartozhatott. A részek sora a lejátszást
kapta meg, a kivétel pedig kénytelen volt máshová menni (v37: csak az ÉPP HALLGATOTT
részre; v39: külön „részek kivétele" lap). Mindkettő kerülőút egy olyan műveletre,
aminek ott a helye, ahol a rész áll.

`sheet()` mostantól ismer egy `x:{t,title,fn}` mezőt: ilyenkor a sor `.shRow` lesz, a
név gombja mellett egy 48 px-es másodlagos gombbal. Két apró, de fontos döntés:

- a **másodlagos gomb NEM zárja be a lapot** (a főgomb igen), mert tipikusan több
  elemet akar az ember egymás után elvégezni — a lap újraépül a maradékkal, és csak
  akkor csukódik be, ha kiürült a lista;
- a sor **nem kap saját margót**, a `.col` gap-je tartja a hézagot, különben dupla
  térköz lenne a sima gombok között.

Ezzel a lista lapján minden rész mellett ott a **✕**: a névre koppintás lejátszás, a
✕-en kivétel (a felvétel megmarad a polcon). A két korábbi kerülőút kikerült — az
„aktuális rész kivétele" és a külön kivétel-lap is —, mert most már mindkettő
ugyanannak a rosszabb változata. A polcon a nyitott lista csempéin lévő ✕ változatlanul
megvan, tehát két helyen, ugyanazzal a jelentéssel.

Teszt: **`qtest.js` 16 próba** — mindhárom részhez kétműveletű sor épül, a ✕ nem indít
lejátszást, a rész kikerül, a felvétel megmarad, a lap nyitva marad és újraépül, az
utolsó rész kivétele bezárja, a régi két kerülőút már nincs a lapon, és a sima
művelet-gombok változatlanok.

## v39a: egymásra csúszó sorok a csempén — két klasszikus CSS-csapda

A felhasználó képernyőképén a „3 rész" jelölés a meta soron ült, a készültség pillje
pedig teljes szélességű sávvá nyúlt, és átfedte a következő sort. Két különböző hiba:

1. **`.bk span` LESZÁRMAZOTT szelektor volt**, tehát a meta soron belüli `.pill`-t is
   eltalálta (az is `span`), és a `display:block`-tól a pill teljes szélességű sávvá
   nyúlt. `.bk > span` a helyes, plusz `.bk .pill{display:inline-block}`, és a meta sor
   `white-space:nowrap` + ellipszis, hogy soha ne tudjon két sorba törni.
2. **A „N rész" jelölés offset-szülője a `.bk` volt**, nem a `.art` — a markupban a
   `.art` MELLETT állt —, tehát a `bottom:8px` a csempe aljára vitte, a meta sorra. A
   `.cnt` bekerült a `.art`-ba, ahol a `position:relative` szülő van, és a scrimen ül.

**Ugyanez a csapda harmadszor jelentkezett** (v35: `querySelector('span')` a sorszámot
találta meg; v38: hiányzó `paged` body-osztály; most a leszármazott szelektor). A
szabály innentől: **a `.bk`/`.item` belsejében minden szelektor közvetlen gyermek
(`>`), vagy saját osztálynevet használ** — leszármazott szelektort ott nem írunk,
mert az új elemek némán beesnek alá.

Ráadás, ugyanabból a családból: `.item .body span` (0,2,1) erősebb, mint a `.pill.ok`
(0,2,0), tehát a LISTA-nézetben a pillek elvesztették a zöld/arany színüket. Egyenlő
erősségű, később álló `span.pill.ok` / `span.pill.part` visszaadja.

Teszt: a `shelftest.js` 51 próbára bővült — a jelölés a borítón belül van, a meta sor
közvetlen gyermek szelektorral van kötve, a pill inline-block, és a pill a meta soron
BELÜL áll.

## v39: a polc élesben megbukott — átrendezés, egy borító, könnyű listakezelés

A v38-as polc valódi anyagon nem működött. A felhasználó képernyőképe alapján, a
megadott dizájn-elvek (`imagine.art/blogs/principles-of-design`) szerint végigmérve:

- **A hierarchia fordítva állt.** A kezdőlap legnagyobb eleme a „Hallgatás két
  nyelven" cím és a magyarázó bekezdés volt — azt egyszer olvassa el az ember, aztán
  soha —, a POLC pedig a hajtás alá került. Amiért az appot megnyitod, az nem lehet a
  harmadik képernyőn. A cím és a bekezdés kikerült, a polc felül áll, a behúzás egy
  saját kártyában alatta (`#intake`), és a YouTube-mező meg a podcast-feed gomb is
  ODA került: egy helyen minden, ahogy egy anyag bekerül.
- **A rács nem polc volt, hanem kártyalista.** A 128 px-es minimum telefonon KÉT
  hatalmas csempét adott. 104 px-re csökkentve három-négy fér ki, és ez már polcnak
  látszik. (Ehhez a meta sor is rövidebb lett: egy mono sor, és amiről nincs mit
  mondani — a 100%-os feldolgozás —, arról nem írunk.)
- **Figure-ground: a „3 rész" jelölés olvashatatlan volt** a zsúfolt borítón. Most a
  borító alján ül, egy sötétítő átmeneten (`.scrim`), ami a haladás sávjának is alapot
  ad.
- **A mozaik hibás volt, és a fogalom is rossz.** A lista borítóját négy rész képéből
  raktuk össze, ezért zajos lett, és egyetlen hibás kép elrontotta az egészet. Most
  **EGY kép**: amit kézzel beállítasz (`l.cov`), különben az első olyan rész beágyazott
  képe, amiben van kép (`listCover`). Egy sorozat minden része ugyanazt a képet
  hordozza, tehát ez a helyes alapérték.
- **A köteg-árnyék elcsúsztatta a polc vonalát.** A `.bk.grp` margója 8 px-szel
  lejjebb és szűkebbre vitte a lista csempéjét, tehát a sorban a polc vonala megtört.
  A `box-shadow` a border-boxon kívül rajzol, margó nélkül is látszik — a margó
  kikerült.

### A törött kép ikon: nem minden „borító" kép

A képernyőképen a mozaik egyik cellájában törött kép ikon volt. Az ok az `id3Cover` és
a `mp4Cover` vakhite: a fejlécben megadott típust elfogadtuk. Az **APIC keret azonban
tarthat a kép helyett CÍMET is** (mime `-->`), a `covr` atomban pedig előfordul csonka
adat — a blob ilyenkor létrejön, csak nem kép. Új `imgKind(b)`: a **magic byte** dönt
(JPEG FFD8, PNG, GIF, WEBP, BMP), és ezen megy át mindhárom út — a kinyerés, a
`coverUrl`, és végül az `<img onerror>` is a monogramra esik vissza. Törött ikon többé
nem jelenhet meg.

### Listakezelés: a kivétel eddig gyakorlatilag elérhetetlen volt

A v37-es logika csak az **éppen hallgatott** részt tudta kivenni a listából
(`sheetQueue` → „az aktuális rész kivétele"). Ha nem az volt megnyitva, nem volt út.
Három helyen lett könnyű:

- a nyitott lista minden részének csempéjén egy **✕** (bal felül) — koppintás, és
  kikerül; a felvétel megmarad a polcon;
- `sheetItem` első pontja **„kivétel a listából (»névi«)"**, ha a felvétel listában van;
- `sheetPrune(lid)`: egy lap, ahol minden rész mellett ✕, és a lap **nyitva marad**,
  tehát több részt is ki lehet venni egymás után.

Mellé: **„a lista borítója képből"** és a beállított borító törlése, valamint
**„lista törlése a részekkel együtt"** (megerősítéssel, a hangot és a szöveget is
törli) — eddig csak feloldás volt, a részeket egyenként kellett törölni.

A lista borítója a CFG-ben lakik (localStorage), tehát **kicsi kell legyen**:
`shrinkDataUrl(f,360)` JPEG dataURL-t készít, és 260 kB fölött hibát jelez. Egy
felvétel borítója ezzel szemben IndexedDB-ben van a rekord mellett, ott a 900 px marad.

Teszt: **`shelftest.js` 45 próba** (a v38-as 32 bővítve): az egy-képes lista-borító, a
kézi felülírás, az érvénytelen borító → monogram, az `imgKind` mindkét ága, a ✕-es
kivétel és hogy a felvétel megmarad, a kezdőlap sorrendje (polc a behúzás előtt, nincs
`h2`, a YouTube-mező és az RSS-gomb a behúzás kártyán). Mellette egy kis
`smoke.js` a `sheetPrune` lapjára és arra, hogy a rajzolás nem ír hibát a naplóba.

## v38: lapozós tanuló mód + könyvespolc

Két kérés egy kiadásban, mindkettő a felhasználó megfogalmazásában.

### A magyar szöveg LAPOZVA (tanuló módban)

A v37-ig minden mondat a sáv tetejére ugrott, amikor sorra került. Pihenő módban ez
jó (a szem az angolt is figyeli), tanuló módban viszont a szem elveszíti a helyét.
Az új szabály:

- egy lapra annyi buborék kerül, amennyi **egészben** kifér a sávba;
- a lapon a buborékok **a helyükön maradnak**, és sorban elhalványulnak, ahogy
  elhangzanak (`.done`), az aktuális arany szegélyt és teli fényt kap;
- amikor a lap utolsó buborékja is lement, **lapozunk** (`pgTurn`, 150 ms halványodás);
- **amit a lap alja elvágna, az egészben a következő lap ELSŐ buborékja lesz** — ez a
  `pgEnd` egyetlen szabálya, és ebből adódik minden más.

Két kényszer, amit a szabály hoz magával, és amit nem szabad visszacsinálni:

1. **A betűméret a lapon kötött.** A v37-es „az aktuális buborék 1,5×" itt
   újratördelné maga alatt az egész lapot, és a többi buborék elmozdulna — pont az,
   amit a felhasználó nem akar. A jelölés ezért fény és szegély, nem méret.
2. **A keret és a belső margó MINDEN buborékon ott van, csak átlátszóan.** Különben a
   jelölt buborék magasabb lenne, mint amikor még nem ő volt az aktuális, és a lap
   megugrana a jelölés pillanatában.

Kód: `pgEnd/pgStart` (a lapszabály, tiszta függvények), `pgMeasure` (a geometria
`sig`-alapú gyorstárral — a tick 120 ms-onként fut, a folyamatos `offsetTop`-olvasás
minden ciklusban újrarendezné a lapot), `pgPaint` (lapválasztás + osztályok + a sáv
állítása), `pgReset` (a lap érvénytelenítése). A `paintHu` és a `tick` a `pagedOn()`
ágon a `scrollTick` HELYETT ezt hívja. **A visszalépés nem tördel újra**: `pgStart`
visszafelé ugyanazt a szabályt alkalmazza, tehát az előző lap ugyanaz, mint amit az
ember látott. Lapozós módban nincsenek „… N korábbi mondat" jelzősorok, és az ablak
±14 blokk (±8 kevés lehet egy laphoz).

A lapon **egyetlen** buborék kiemelt: ami már lement, az `.done` (beszürkül), ami még
nem járt le, az `.soon` (halványabb szürke), és a kiemelés lép lefelé buborékonként —
a szöveg NEM mozdul, amíg a lap tart.

**A v38a hibája és a tanulság.** Az első kiadásban „minden kiemelt" volt. A `paged`
body-osztály ugyanis csak a `learnSet`-ben került fel, tehát ha a tanuló mód MÁR be
volt kapcsolva induláskor (`CFG.learn=1`), az osztály hiányzott, és ezzel a teljes
`body.learn.paged` CSS kimaradt: nem volt `.off`, nem volt `.done`, minden buborék
teli fénnyel látszott, és a lapon kívüliek is ott maradtak. A toggle most az
`applyLook`-ban van (az fut induláskor, megnyitáskor és beállításkor is), a `pgPaint`
pedig pótolja, ha valamiért lemaradt. Tanulság: **egy CSS-állapotot ne csak a
kapcsoló-függvény tegyen fel** — a `body` osztályait ott kell összerakni, ahol a
megjelenés minden más eldől (`applyLook`), különben a „bekapcsolva indul" ág néma
hibával fut.

A ⚙ lapon kikapcsolható (`CFG.paged`, `segPaged`): a „folyamatosan" a régi működés,
érintetlenül.

Teszt: **`pagetest.js` 49 próba.** A jsdom nem tördel, ezért a magasságokat a teszt
adja meg (`offsetTop/offsetHeight` getter) — így a lapválasztás valódi DOM-on mérhető:
négy egyforma buborék egy lapon, lapozás a negyedik után, a magas buborék egészben a
következő lap tetején, a sávnál magasabb buborék saját lapon, visszalépés ugyanarra a
lapra, ugrás közepére, hogy a lapon MINDIG pontosan egy kiemelt buborék van és
közben a sáv nem mozdul, hogy a `paged` osztály magától felkerül, és hogy a folyamatos
mód érintetlen.

### Könyvespolc a könyvtárban

A borító eddig is kinyerődött a fájlból (`mp4Cover` az iTunes-féle `covr` atomból,
`id3Cover` az `APIC` keretből) és képből is beállítható volt — csak a könyvtárban nem
látszott, egyedül a szöveg háttereként (`coverBg`). Most polc lett belőle.

- Négyzetes csempék (`.bk`), a borítón belül alul **arany sáv = hol tartok benne**
  (`rec.pos/dur`), fölötte **kék vonal = mennyit hallgattam végig** (`heardPct`). A
  feldolgozottság pillként a cím alatt, ha még nincs kész.
- A **polc lapja** (`.plc`) mindig a borító alatt, a cím ELŐTT áll — a csempék
  magassága ezért kötött, és a vonal soronként összefüggő polcnak látszik.
- Borító nélkül monogram (`bkIni`) — a ⋯ menü „borító beállítása képből" pontja
  változatlanul működik.
- **Lista = kötegelt borító**: két lap kilátszik alóla (CSS `box-shadow`), bal felül a
  részek száma. A kép a részek borítói közül a **különbözőekből** áll (legfeljebb négy,
  mozaikban) — egy sorozatnál ez általában egyetlen kép, tehát nem lesz zajos. A sáv a
  **teljes listára** vonatkozik: `Σ min(pos,dur) / Σ dur`, mellette a `2 / 4 kész`.
  A számra koppintva nyílik ki a lista (a részek csempéi utána jönnek, `.bk.part`).
- A blob-címek gyorstárazva vannak (`COVU`, `coverSweep`), különben minden
  újrarajzolás szivárogna.
- ⚙-ben váltható (`CFG.shelf`, `segShelf`); a v37-es lista-nézet érintetlenül megvan.

Teszt: **`shelftest.js` 32 próba** — borítós és borító nélküli csempe, a monogram, a
sáv a lejátszási pozícióból, a blob-cím újra nem gyártása és elengedése törléskor, a
lista mozaikja csak a különböző borítókból, a teljes lista százaléka, kinyitás/becsukás
és a megjegyzett állapot, a lista-nézetre váltás, és hogy csonka rekord nem dönti el a
polcot.

## v37: nevesített listák — egy sorozat EGY sor a könyvtárban

A v35-ös globális lista működött, de a felhasználó jogos panasza: „egy ilyen sorozat
nagyon sok sorból áll a könyvtárban". Harminc rész harminc sor, és nem látszik, hogy
ez EGY dolog. Ezért a lista fogalma nevesített lett, és több is lehet egymás mellett.

`CFG.lists = [{id, name, items:[rekordId…], at, cur, open}]` — a v35-ös `CFG.queue`
automatikusan átköltözik egy „lejátszási lista" nevű elembe.

**A könyvtárban** a listák felül állnak, egy-egy sorként: név, `28 rész · 12:40:15 ·
6 / 28 kész · a 7. résznél`, alatta a készültség sávja. A benne lévő felvételek NEM
szerepelnek külön sorként; a `▸/▾` gomb nyitja ki őket (beljebb húzva, arany bal
éllel), és a nyitott állapot megjegyződik. A listán kívüli felvételek alatta,
változatlanul.

- **A sorra koppintva ott folytatja, ahol abbahagytad**: `listResume()` az utoljára
  hallgatott részt adja, vagy ha az kész, az utána következő első befejezetlent.
  A befejezett részeket átlépi — nem kezdi újra az elejét.
- Egy felvétel egyszerre csak EGY listában lehet (`listAdd` kiveszi a többiből),
  különben eltűnne a könyvtárból, és nem derülne ki, hol keresse az ember.
- A ≡ gomb a felvételeken mostantól listaválasztót nyit (`sheetAddTo`): meglévő
  listába, új listába, vagy kivétel.
- A lista ⋯ menüje (`sheetQueue`): a részek sorrendben a megállás helyével („· 12:41",
  „· kész"), az aktuális előbbre/hátrébb/kivétel, átnevezés, név szerinti sorrend,
  feloldás (a felvételek megmaradnak), és a többi lista.
- **A tömeges behúzás magától felajánlja a listát**: a nevet a részek közös
  névkezdetéből javasolja (`commonName` — „Welcome to Night Vale - 250 -…" →
  „Welcome to Night Vale"), és számérzékeny név szerinti sorrendbe rendezi őket.
- `qFillAll` mostantól a listán KÍVÜLI felvételeket teszi egy új listába, közös
  névvel — nem söpri be a már listázottakat.

Teszt: **`queuetest.js` 39 próba** (a nevesített listák műveletei, a könyvtár
egy-soros nézete, kinyitás/becsukás, a folytatás helye befejezett résszel, a hang
nélküli és a törölt elem, a kezelőlap), **`manytest.js` 26** (a behúzás utáni
lista-felajánlás mindhárom ága, a névjavaslat, és hogy 30 rész egyetlen sor lesz).

## v36: a két sáv tagolása SZINKRONBAN (a v23 becslési hibája)

A felhasználó jelzése: „nagyon zavaró, hogy az angol buborékok mennyire máshogy
tagoltak, mint a magyarok — épp más megy a karaoke angolon, mint alatta a magyaron,
így nagyon el lehet veszni." A képernyőképén jól látszott: fent már a következő
buborék futott, alul még az előző magyar blokk állt.

A hiba a v23-as tördelésben volt: a magyar blokkok idejét **karakterarányos
becslésből** számoltam a csoport teljes sávján belül. A becslés soha nem egyezik a
valódi beszédtempóval, tehát a két oldal elcsúszik.

`huAlign(q,S)` a becslést lecseréli **illesztésre**: minden magyar blokk egy (vagy
több szomszédos) ANGOL TÖREDÉK idejét kapja, tehát a blokkhatárok pontosan a
töredékhatárokon vannak, és a két sáv együtt vált.
- Rövid mondat → egy blokk, a teljes csoport idejével.
- Hosszú mondat → annyi blokk, ahány töredék, de blokkonként legalább `HU_MINW=6`
  magyar szót tartunk (kétszavas foszlányt olvasni rossz); ha kevesebb jut, több
  töredék tartozik egy blokkhoz, és az azok együttes sávját fedi.
- A szavak elosztása a töredékcsoportok IDŐTARTAMÁVAL arányos, és a vágás ±2 szón
  belül tagmondathatárra (vessző, pont) igazodik, ha van a közelben.
- A blokk `i0` mezője mostantól a hozzá tartozó ELSŐ töredék indexe (nem a mondaté),
  ezért a koppintás is pontosabban ugrik. A `pairs` és a `hu` minden töredéken
  ugyanaz, tehát a beszövés és a szinkronizálás változatlanul működik.

Mérés (flowtest): a 342 karakteres mondat 4 blokkra bomlik (12, 15, 15, 11 szó),
és a blokkhatárok `0–5, 5–10, 10–15, 15–20` — pontosan az angol töredékek határai.
Két új próba kifejezetten azt ellenőrzi, hogy minden blokk kezdete és vége egy
angol töredékhatár.

## v35: lejátszási lista (sorozatokhoz)

A tömeges behúzás után magától jött a következő igény: a részek menjenek egymás
után, mint egy zenei lejátszási lista, és ott lehessen megállni, ahol akarunk.

- `CFG.queue` rekord-azonosítókat tart SORRENDBEN. Kezelők: `qAdd/qDel/qToggle/
  qMove/qClear/qFillAll/qNextId`.
- A könyvtárban minden felvételnél egy **≡ gomb** (arany, ha listában van), a név
  előtt pedig a **sorszám**. A ⋯ menüben „lejátszási lista (N) — ez a 3." és
  „felvétel a lista végére".
- `qAdvance()` az `ended` eseményre: megnyitja a következőt és el is indítja. Előtte
  elszámolja az épp befejezett mondatot a szókincsbankba (`bankCredit`) és lezárja a
  heard-szakaszt — a lista nem lyukaszthatja ki a statisztikát.
- **A megállás helye rekordonként megmarad** (`rec.pos`), tehát bárhol félbehagyható;
  a lista lapján az elemek mellett látszik, hol állnak.
- **Hang nélküli résznél nem lép tovább**: a böngésző nem adhat fájlt kérés nélkül,
  ezért megállunk és megnevezzük a részt, amit meg kell nyitni. (A tömeges behúzás
  „hang nélkül" ága után ez a tipikus eset.)
- **A törölt felvételt átlépi** és kiveszi a listából, nem akad meg rajta.
- `qFillAll()` a teljes könyvtárat teszi listába NÉV szerinti, számérzékeny
  sorrendben (`localeCompare` numeric) — sorozatnál ez adja a helyes sorrendet,
  nem a hozzáadás ideje.

**Közben egy valódi hiba is előkerült**: a sorszám `<span>`-je a `<b>`-n belülre
került, és a `el.querySelector('span')` ezt találta meg elsőnek — így a hossz és a
százalék a sorszám helyére íródott, a valódi metaadat-sor pedig üresen maradt.
Konkrét szelektorra cserélve (`.body > span`). Tanulság: a `querySelector` első
találata megváltozik, ha új elemet szúrunk a markupba.

Teszt: **`queuetest.js` 27 próba** — sorrend, kétszeres felvétel, kapcsoló,
mozgatás a széleken, a könyvtár sorszámai és jelölései, három egymást követő
továbblépés, megállás a lista végén, a hang nélküli és a törölt elem kezelése,
a név szerinti feltöltés és a kezelőlap.

## v34: több hangfájl egyszerre a könyvtárba

Podcast-sorozatoknál (a felhasználó 30 részt akar egyszerre behúzni) az egyesével
adogatás használhatatlan. A fájlválasztó `multiple` lett, a drop-zóna is az egész
`dataTransfer.files`-t átveszi.

- `addFile(file, opts)` kapott egy **néma módot** (`quiet`): felveszi a rekordot,
  de NEM nyit meg semmit, nem indít feldolgozást, és nem tolakszik toasttal.
  Az `audio:false` a hang mentését is kihagyja.
- `addMany(files)` sorban dolgozza fel őket — párhuzamosan a médiaolvasás és a
  hangmentés I/O-ja megfojtaná a böngészőt. **Egy hibás fájl nem állítja meg a
  többit**, a végén összesítő szól a sikerekről és a bukásokról.
- Behúzás előtt megkérdezi, mentse-e a hangot, és kiírja a teljes méretet: 30 rész
  könnyen több gigabájt. „Csak a könyvtárba, hang nélkül" esetén minden működik,
  csak lejátszás előtt újra ki kell választani a fájlt.
- A ⋯ menü „hangfájl behúzása ehhez" pontja továbbra is EGY fájlt vár (`ONEFILE`
  jelző), mert az egy meglévő felvételhez rendel hangot.

Teszt: **`manytest.js` 16 próba** — a kérdés három ága, a mégse tisztasága, 31
fájl behúzása (köztük egy szándékosan hibás), hogy egyiket sem nyitja meg, a
hangmentés ki- és bekapcsolt ága, és hogy a folyamatjelző nem ragad be.

## v33: az átirat FÁJLBÓL is betölthető (a v28 hiányossága)

A felhasználó kérdése jogos volt: „miért nem tudom a txt-t betölteni, amiben az
átirat van?" A v28-ban a beillesztő mellé nem került oda a fájlos út — a YouTube-
rekord menüjéből ki is vettem a „szöveg betöltése" pontot, az `importText` pedig
csak SRT-t és TSV-t ismert fel. Mobilon a vágólap az egyetlen út, gépen viszont a
mentett .txt a természetesebb.

- `importText` mostantól HÁROM formátumot próbál sorban: SRT → kétnyelvű TSV →
  **YouTube-átirat** (`parseYtTranscript`). A hibaüzenet is mindhármat megnevezi.
- A YouTube-rekord ⋯ menüjében ott az „átirat betöltése fájlból (txt / SRT)".
- Betöltés után **magától indul a fordítás**, ha maradt fordítatlan mondat — eddig
  ezt csak a beillesztő ága csinálta, a fájlos nem.
- A betöltés a magyar folyamot is újraépíti (`huBuild` + `renderHu`), eddig csak az
  angol karaokét frissítette.

Ellenőrizve a VALÓDI fájlon (jr.txt, 4394 sor): **1396 mondat, 9925 s**, az elsőtől
(„Joe Rogan podcast. Check it out.") az utolsóig („Absolutely. Goodbye, everybody.").
A `pastetest.js` 29 próbára bővült (fájlos átirat, SRT-ág változatlansága,
értelmetlen fájl elutasítása).

## v32: átjáró a feedhez (a CORS-fal megkerülése, a felhasználó engedélyével)

A v30-as feed-olvasó élesben nem nyílt meg: a Megaphone nem enged böngészős
lekérést. Utánanézve **nincs olyan közvetlen út, ami mindig működne** — még az
Apple iTunes lookup API-járól is azt jelentik, hogy a CORS-fejlécében csak
`http://localhost` szerepel, tehát élesben az is elhasal. Ez a böngésző biztonsági
modellje, nem a hosztok rosszindulata: a feedet nem böngészős használatra tervezték.

Megoldás, elvhűen:
- `feedLoad(url, allowProxy)` **először MINDIG közvetlenül** próbálkozik. Ha az
  sikerül, semmilyen harmadik fél nem lát semmit.
- Ha elhasal, a hiba `needProxy` jelzőt kap, és a felület **felajánlja** az átjárót,
  megírva, mi megy át rajta (a feed CÍME) és mi nem (a hang, a felismert szöveg és a
  fordítás SOHA). A program magától nem kapcsolja be.
- A döntés megjegyződik (`CFG.proxy`), és a ⚙ lapon visszavonható. Az átjáró címe is
  ott szerkeszthető (`CFG.proxyUrl`, alap: allorigins.win), mert az ilyen ingyenes
  szolgáltatások eltűnhetnek — így a program nem hal meg egy idegen szolgáltatással.
- A HANG letöltése nem megy átjárón (100-200 MB-ot nem küldünk át idegen
  kiszolgálón): ott marad a `feedManual` böngészős letöltés + behúzás.

Teszt: a `feedtest.js` 31 próbára bővült — a `needProxy` jelzés, a felajánlás
megjelenése, hogy magától NEM kapcsol be, a magyarázat megléte, az átjárós lekérés
címe, és hogy engedéllyel is a közvetlen út marad az első.

## v31: a magyar YouTube-felület felolvasó-sorai (valódi átiraton tesztelve)

A felhasználó feltöltötte a JRE #2379 teljes átiratát (4394 sor, 221 kB, 2:45:35).
Kiderült, hogy a magyar felület a másolatba minden időbélyeg mellé egy
**képernyőolvasó-sort** is beletesz: „1 másodperc", „2 óra, 45 perc és 35 másodperc".
A v30-as parser ezeket szövegnek vette, és a mondatok elejére ragadtak
(„6 másodperc Train by day. Joe Rogan podcast by night."). Az első mondat ráadásul
elveszett, mert a legelső időbélyegből csak „01" került a vágólapra.

Javítás a `parseYtTranscript`-ben:
- `ytDurLine()` felismeri és eldobja a felolvasó-sorokat, magyarul és angolul is
  („5 seconds", „2 hours 45 minutes 35 seconds");
- a csupasz 1-2 számjegyű sor csonka időbélyegnek számít (nem szövegnek);
- ha a legelső mondat elől hiányzik az időbélyeg, 0-tól indul;
- **`sawTs` jelző**: ha a bemenetben egyetlen valódi időbélyeg sincs, a parser
  üreset ad — enélkül az idő nélküli első sor kezelése átengedte volna a
  tetszőleges beillesztett szöveget is.

Eredmény a VALÓDI fájlon: **1396 mondat, 9925 s-ig, tiszta szöveggel**, az első
mondattal együtt: „Joe Rogan podcast. Check it out. The Joe Rogan Experience."

Teszt: a `pastetest.js` 24 próbára bővült (a magyar és angol felolvasó-sor, a csonka
első időbélyeg, az első mondat megmaradása).

## v30: podcast RSS-feed közvetlenül az appban

A YouTube-os úton kiderült, hogy az átirat mobilon kimásolhatatlan (több ezer sor),
és a beágyazott lejátszó elveszi a háttérben hallgatást, a felismerést és a tanuló
módot. A nyilvános **RSS-feed** viszont mindezt visszaadja: az `<enclosure>` a hang
közvetlen címe, tehát a teljes eddigi lánc működik vele.

- `feedParse()` — RSS→epizódlista: cím, `pubDate` (olvashatóra rövidítve),
  `itunes:duration`, méret, típus, közvetlen URL. Az `<enclosure>` nélküli elemeket
  kihagyja, a hibás XML-t és a csatorna nélküli dokumentumot elutasítja.
- `feedLoad()` — hálózati betöltés; **CORS-hibánál érthető magyarázat**, nem néma
  elszállás.
- `feedGrab()` — streamelt letöltés folyamatjelzővel (`content-length` alapján),
  a kész blobból `File` lesz, és a MEGLÉVŐ `addFileSafe` láncra megy — onnantól
  minden a szokásos.
- **Ha a kiszolgáló nem engedi a böngészőből való letöltést**, a program nem hasal
  el: `feedManual()` felajánlja a böngészős letöltést, utána a fájl behúzható.
  A CORS-viselkedés kiszolgálónként más, ezért mindkét ág kell.
- A beírt feedek gyorslistába kerülnek (`CFG.feeds`, max 8), a csatorna nevével.
- A könyvtár lapon: „podcast RSS-címről" gomb.

FIGYELEM a felhasználónak elmondva: a Megaphone (és sok más hoszt) **dinamikus
hirdetést szúr be**, ezért ugyanannak az epizódnak két letöltése eltérő hosszú lehet
— a felismert szöveg ahhoz a fájlhoz tartozik, amelyikből készült. Ugyanezért a
YouTube-átirat sem illeszthető az mp3-ra.

A Joe Rogan Experience feedje: `https://feeds.megaphone.fm/GLT1412515089`
(a hoszt 2024 februárja óta Megaphone; a régi libsyn-feed csak az archívum).

Teszt: **`feedtest.js` 21 próba** — a Megaphone-szerkezet feldolgozása, az
enclosure nélküli elem kihagyása, a hibás XML elutasítása, a hálózati betöltés, a
CORS-hiba mindkét helyen (feed és fájl), a lista kirajzolása, a gyorslista, és hogy
a folyamatjelző nem ragad be hibánál.

## v29: útmutató a beillesztőben (a felhasználó nem találta az átiratot)

Kiderült a félreértés: a felhasználó a MI beágyazott lejátszónkban kereste az
„Átirat megjelenítése" gombot. Az átirat-panel csak a **youtube.com saját oldalán**
létezik, a beágyazott lejátszóban nincs. A beillesztő magyarázata ezért átírva, és
került rá egy **„videó megnyitása a YouTube-on"** gomb (`#pasteOpen`), ami új lapon
nyitja a watch-URL-t.

A szövegbe bekerült három gyakori akadály is: mobilböngészőben az „Asztali webhely"
nézet kell hozzá; az időbélyegeket NE kapcsolja ki (a parser azokból dolgozik, és a
kapcsoló Androidon amúgy sem elérhető); ha a lejátszón nincs CC gomb, a videónak
nincs felirata, tehát ez az út nem járható vele.

## v28: YouTube-átirat beillesztése (és MIÉRT nem automatikus)

A felhasználó kérdése: „a szöveget a programnak kellene automatikusan letölteni".
**Böngészőből ez nem lehetséges**, és ezt tartani kell:
- a `timedtext` végpont CORS-t nem enged (ugyanaz a fal, mint a DeepL-nél v13-ban),
  és ma aláírt paramétereket is követel;
- a hivatalos YouTube Data API `captions.download` végpontja **csak a saját videóid**
  feliratát adja le, másokét nem — tehát hivatalos út nincs;
- a gépi feldolgozóból (Python) technikailag menne yt-dlp/transcript-api-val, de az
  a YouTube feltételeibe ütközik, tehát NEM építjük be. Ez ugyanaz a vonal, mint az
  Audible DRM-nél és a videóletöltésnél — nem lazítunk rajta.

Ami tiszta és működik: a felhasználó a SAJÁT böngészőjében megnyitja az átiratot
(a videó alatt ⋯ → Átirat megjelenítése), kijelöli, másolja — a program pedig
feldolgozza. Ehhez épült a beillesztő:

- `#paste` teljes képernyős mező (⋯ → „YouTube-átirat beillesztése"; hangfájloknál
  is elérhető „szöveg beillesztése vágólapról" néven).
- `parseYtTranscript()` kezeli mindkét másolási formátumot: időbélyeg külön sorban
  (Chrome alapértelmezés) és időbélyeg a szöveg előtt egy sorban; az óra is
  (`1:02:14`), a folytatósorok, és a `[Music]`-szerű effektjelölések kiszűrése.
- A panel 3-8 szavas darabjait **26 szavas blokkokká fűzi össze** (a határt a darab
  hozzáadása ELŐTT nézi, különben túlcsordul), mondatvégnél vág — így a buborékok
  ugyanakkorák, mint felismerésnél, és a magyar tördelés is illeszkedik.
- SRT-t is elfogad ugyanabban a mezőben; hibás bemenetnél a mező NYITVA marad, hogy
  ne vesszen el a beillesztett szöveg.
- A beillesztés után **azonnal indul a fordítás** — átiratnál ez az egyetlen
  feldolgozási lépés.

Teszt: **`pastetest.js` 20 próba** — mindkét formátum, óra, effektjelölés, a szöveg
hiánytalansága (összefűzve pontosan az eredetit adja vissza), a blokkhatár, az idők
monotonitása, az elutasítandó esetek, a rekordba írás és az SRT-ág.

## v27: beágyazott YouTube (kísérleti)

A felhasználó kérése: link beírása → a videó a felületbe ágyazva nyílik meg, hogy a
podcast SZEREPLŐI látszódjanak. Jogilag tiszta út: az IFrame Player API-t a YouTube
kifejezetten beágyazásra kínálja (letöltés továbbra sincs, és nem is lesz).

**A lejátszó absztrakciója.** Az `A` eddig maga az `<audio>` elem volt; mostantól
FASÁD (`AEL` + `AEV` eseménycél), ugyanazzal a felülettel (currentTime, paused,
play/pause, playbackRate, addEventListener). Mögötte vagy a hangfájl, vagy a
`YTP` adapter áll. A kód többi része — karaoke, mondatléptetés, A–B, kísérő mód,
szókincsbank — nem tud a különbségről. A meglévő öt tesztfájl változatlanul zöld,
ez a regresszió-bizonyíték.

**Amit a YouTube nem tud, és amit ezért másképp kell csinálni:**
- a beágyazott lejátszó hangjához NEM lehet hozzáférni → **felismerés nincs**; a ⋯
  menüben a „feldolgozás" helyett a „szöveg betöltése (YouTube-átirat / SRT)" áll;
- **háttérben, kikapcsolt képernyővel nem szól** (ez a felhasználónak rendben van:
  itt épp nézni akarja);
- **a tanuló mód videónál nem kapcsolható be** — a lejátszót nem takarhatjuk el (a
  YouTube feltételei is tiltják), és a szereplők látványa itt a lényeg;
- a sebességből a YouTube csak rögzített értékeket enged: a 0,85 kérésből 0,75 lesz,
  az 1,3-ból 1,25 (`ytRateFit`). A felületen a kért érték marad.

**Elrendezés.** `#ytBox` a fejléc alatt, 16:9, de legfeljebb a képernyő 42%-a; a
`layoutSplit` a videó magasságát levonja, tehát a két folyam a maradékon osztozik
(mérve: 880 px-es képernyőn 225 px videó, a szöveg 313 px-től). A videó egy gombbal
összecsukható (`ytmin`), ilyenkor a szöveg visszakapja a helyet.

**Felvétel**: a könyvtár lapon egy beviteli mező; a `ytId()` a watch?v=, youtu.be,
shorts, embed és időbélyeges formákat is felismeri. A cím az oEmbed végpontról jön
(nyilvános, CORS-engedélyezett, csak az azonosítót küldjük ki).

Teszt: **`yttest.js` 35 próba** mockolt IFrame API-val — linkfelismerés hat formára,
a fasád viselkedése (idő, tekerés, események, sebesség-illesztés), a rekord és a
hossz átvétele, az elrendezés geometriája, az összecsukás, mindhárom korlátozás és a
bezáráskori takarítás.

**NYITOTT KÉRDÉS a felhasználó felé:** a YouTube automatikus átirata **nem tartalmaz
beszélő-címkéket** — a diarizáció hiánya ott is megvan. Videónál ezt a KÉP oldja meg
(látod, ki beszél). Ha címke is kell, két út van: WhisperX a gépi feldolgozóban
(pyannote-tal, hangfájlból), vagy a Claude-tól kérni beszélőváltás-jelzést fordítás
közben (nulla plusz futtatás, két szereplőnél jól működik).

## v26: TANULÓ MÓD / beszőtt angol — a terv hat lépcsője megvalósítva

A DIGLOT_tanulomod_terv.md szerint, végig. A terv fájl a csomagban marad, mert a
küszöbök hangolásához a MIÉRT-eket is tudni kell.

**1. `heard` intervallumok.** A felismert (`done`) és a végighallgatott sáv két külön
dolog: az áttekert rész is felismert. `heardTick/heardClose` a lejátszófej
folytonosságát figyeli (2 mp-en belüli előrehaladás), ugrásnál és szünetnél lezár,
a másfél másodpercnél rövidebb foszlányt eldobja. A könyvtárban külön pill:
„hallgatva X%". A `strip` menti (`rec.heard`).

**2. Szópárok a fordítótól.** `SYS_TR_W` + `llmRich()`: a fordítás mellé mondatonként
3-5 tartalmas szó — felszíni alak, **szótári alak**, szófaj (n/v/adj/adv/pn), a magyar
megfelelő, és a magyarosan, KÖTŐJELLEL toldalékolt angol alak („dream-eket",
„reality-t"). Ezt utólagos szövegcserével nem lehet: csak az tudja helyesen ragozni,
aki egyszerre látja az angolt és a magyart. A tulajdonnevet `pn` jelöli, az sosem
kerül a bankba. `CFG.pairs` kapcsolja; hiba esetén visszaesik a sima fordításra.

**3. Globális szókincsbank.** Új IndexedDB objektumtár (`bank`, DB verzió 2), a
könyvektől FÜGGETLENÜL: a hang és a szöveg törölhető, a szókincs marad. `BANK[lemma]
= {n, first, last, shown, tap, pos}`, mellette `NGR` az ismétlődő 3-5 szavas
fordulatokra. **Egy mondat egy munkamenetben egyszer számít** (`SESS`), és csak akkor,
ha a heard-szakasz legalább 60%-ban fedi (`bankCredit`). A ⚙ lapon statisztika és
**szótár-kivitel TSV-be** (a Szókártya/Mondatbank felé).

**4-5. Tanuló mód és beszövés.** `body.learn`: az angol sáv eltűnik, a teljes terület
a magyaré, nagyobb betűvel; a ⋯ menü tetején kapcsolható. LLM-fordító nélkül nem
engedi bekapcsolni, mert ott a gépi hiba félrevezetne (nincs mihez visszanyúlni).
- `wReady(lemma)`: a küszöb a hallások számából ÉS a gyakorisági rangból áll
  (beágyazott ~230 szavas TOP-lista + a saját korpusz becslése). A legygyakoribb
  szavakat NEM szőjük be. Szófaji szorzó: főnév 1, melléknév 1,2, ige 1,4, határozó
  1,6. Minden koppintás +8 hallásnyit emel a küszöbön.
- `weave(q)`: a csere MEGJELENÍTÉSKOR történik a tárolt párokból — a szint bármikor
  változtatható, visszamenőleg is, újrafordítás nélkül.
- **Halványodó jelölés**: `shown<8` erős arany, `<20` halvány, fölötte jelöletlen —
  a szó láthatóan „megérkezik" a szövegbe.
- **Felvillanás** (`flashTick`): a beszőtt szó fél másodpercre felgyullad abban a
  pillanatban, amikor elhangzik (a `s.w` szó-időbélyegekből). A magyar szórend más,
  tehát nem ott áll, ahol elhangzik — de akkor villan.
- **Koppintás = „nem tudtam"**: megmutatja a magyart, `tap++`, és a szó egy időre
  visszaesik. Ez az egyetlen visszajelzés, és az sem munka.
- **Vészkijárat**: hosszú koppintás (550 ms) a mondaton → az eredeti angol mondat
  4 másodpercre (`#peek`).

**6. Tagmondatok.** A prompt legfeljebb két rövid, önmagában megálló angol tagmondatot
is kér (3-6 szó) a magyar megfelelőjével (`s.cls`). `clReady`: minden szava ismerős
KELL legyen (TOP-200 vagy 40+ hallás), a hossz 3-6 szó, ÉS visszatérő fordulat legyen
(`NGR[...].n>=5`) — mert a szerkezet nem következik a szavakból („I should have known"
minden szava gyakori, a szerkezet mégis idegen). **Ha tagmondat került be, szócsere
abban a mondatban nincs.**

**Beállítások** (⚙): beszövés nincs / szavak / szavak+fordulatok; sűrűség 1-3 csere
mondatonként (alap 1). **„Szópárok pótlása"** menüpont: a MÁR lefordított könyvekhez
utólag legyártja a párokat anélkül, hogy a meglévő fordítást átírná.

Teszt: **`learntest.js` 47 próba** — heard-intervallumok és a százalék, a
munkamenet-szabály, a tulajdonnév kizárása, a lemma mint kulcs, a küszöb minden
tényezője (hallás, rang, szófaj, koppintás), a beszövés és a sűrűség, a halványodás
három fokozata, a felvillanás időzítése, a koppintás hatása, a tagmondat feltételei
és hogy mellette nincs szócsere, a mód kapcsolása és a sávgeometria.

## TERV: tanuló mód / beszőtt angol — DIGLOT_tanulomod_terv.md

Külön dokumentumban rögzítve, mert sok döntés született, és kár volna újra levezetni:
**DIGLOT_tanulomod_terv.md** (a projekt mellé teendő, a következő munkamenet elején
elő kell venni). Röviden: a Rákoss Péter-féle *Tealandi utazások* mintájára (a
technika neve a szakirodalomban „diglot weave") a magyar szövegbe a felhasználó
szókincse szerint kerülnének angol szavak, majd tagmondatok.

A lényeg dióhéjban:
- **Két üzemmód**: a mai felezett képernyő = pihenő mód; a tanuló mód TELJES képernyő
  magyar, nagy betűvel, az angolt csak HALLGATJA. Ugyanazt az anyagot hallgatja
  mindkettőben (javasolt: első kör pihenő, második kör ugyanarra tanuló módban).
- **Globális szóbank**, nem podcastenként: az új epizód első percétől tudja, mit
  hallottál már sokszor. A hang törölhető, a bank marad.
- **Nem a kész szöveget cseréljük**: a Claude-fordítás mondatonként 3-5 szópárt is
  visszaad (szótári alak, szófaj, helyesen toldalékolt magyar-kötőjeles alak), a
  csere megjelenítéskor történik — így a szint visszamenőleg is állítható.
- **Csak Claude-dal** működik (DeepL/Argos nem ad párokat); tanuló módban a fordítás
  minősége kritikussá válik, mert nincs mihez visszanyúlni.
- **`heard` intervallumok kellenek** (mit hallgattál VÉGIG, nem mit ismertünk fel),
  és egy mondat egy munkamenetben egyszer számít.
- A beszőtt szó **felvillan, amikor elhangzik** (a `w[]` szó-időbélyegekből), a
  jelölése a találkozásokkal **halványul**, koppintásra megmutatja a magyart — és az
  a koppintás maga a visszajelzés, hogy nem tudtad.
- **Egy mondatban legfeljebb egy csere** kezdetben; tagmondat-beszövésnél legfeljebb
  egy tagmondat, és akkor szócsere abban a mondatban nincs.

Megvalósítási sorrend a terv 12. pontjában; az első három lépés (heard-intervallumok,
bővített fordító-prompt, bank) önmagában is hasznos, beszövés nélkül.

## v25: immerzív mód — eltűnő felület, koppintás-zónák (a felhasználó terve)

Hallgatás közben a fejléc és a kezelősáv az indítástól számított 5 másodperc múlva
elhalványul, és a teljes képernyő szöveg lesz. A vezérlés ilyenkor koppintás-zónákra
vált. A tervet a felhasználó adta; három ponton pontosítottam, mert enélkül ütközések
lettek volna:

1. **A zónák CSAK elrejtett állapotban élnek.** Amíg a kezelők látszanak, a
   buborékra koppintás marad a régi (odaugrás arra a mondatra) — különben elveszne
   a folyamban a visszaugrás lehetősége. A kattintáskezelő elfogási fázisban ül
   (`capture`), és elrejtett állapotban elnyeli a buborékok saját eseményét.
2. **A bal és a jobb szél a TELJES magasságban aktív** (22-22%), a felső harmad
   csak a középső sávban — így nincs ütközés a „felső harmad" és a „szélek" között.
3. **A szünet önmagában nem hozza vissza a kezelőket** (különben a felső harmad
   funkciója felesleges volna). A közép szüneteltet és folytat, a felső harmad
   megállít ÉS visszahozza a felületet.

Zónák: bal 22% → előző mondat · jobb 22% → következő mondat (mindkettő szünetben is
léptet, de nem indít lejátszást) · felső harmad közepe → megáll + kezelők vissza ·
a maradék közép → szünet/folytatás.

- `IMM` állapot, `immSet/immArm/immWake`; az elrejtés a `play` eseménynél indul.
- A `layoutSplit` elrejtett állapotban NULLÁNAK veszi a fejléc és a kezelősáv
  magasságát, tehát a felszabaduló hely a két sáv között oszlik el: mérve
  263 px → 370 px sávonként.
- Az elemek `opacity`-vel tűnnek el (nem `display:none`), így az átmenet sima.
- **Egyszeri zóna-súgó** (`#zones`, `CFG.immTip`): az első elrejtéskor 3 másodpercre
  megjelenik a négy zóna felirattal. Enélkül a mód kitalálhatatlan volna.
- Beállítás: ⚙ → Megjelenés → „kezelők elrejtése hallgatás közben": 5 mp / 10 mp /
  soha (`CFG.immSec`, alap 5).
- Tesztek: `immtest.js` (21 próba: elrejtés, sávnövekedés, mind a négy zóna,
  szünetbeli léptetés, időzítés, a súgó egyszerisége, és hogy látható kezelőknél a
  zónák NEM aktívak).

## v24: a betűtípus-választó valódi neveket mutat

A ⚙ → Megjelenés → betűtípus három gombja korábban „talpas / DM Sans / Hyperlegible"
volt: az első kategórianév, a másik kettő márkanév, tehát a felhasználó nem tudta,
melyik betűt választja (rá is kérdezett, melyik volt „az az angolnál"). Most mindhárom
gombon a valódi név áll — **Literata / DM Sans / Atkinson** —, alattuk pedig egy
megjegyzés (`#fontNote`, `FONTNOTE`) írja ki a teljes nevet és egy mondatban, mire
való. A választott betű mindkét sávra érvényes (`--kff`).

Az alapértelmezés a **Literata** (talpas, hosszú olvasáshoz tervezett kenyérbetű) —
ezt látta a felhasználó az angol oldalon, és ezt kérte vissza.

## v23: a magyar VISSZATÖRDELVE az angol blokkjaihoz (a helyes megoldás)

A v22 lekicsinyítette a hosszú magyar mondatot, hogy elférjen. A felhasználó kérdése:
„nem lehet a szöveget visszatördelni az angolhoz hasonló méretű blokkokba ahelyett,
hogy így lekicsinyítenénk?" — de. Ez a helyes megoldás, mert a felső sáv is pontosan
ezt csinálja (`breakLong`, MAXW=26 szó); a magyar oldalon eddig hiányzott a párja.

- `huSplit(txt)`: a magyar mondat vágása ugyanazzal a logikával, mint az angol
  `breakLong` — mondatvégnél (6 szótól), tagmondat végén (12 szótól), legkésőbb 20
  szónál (`HUMAXW`; a magyar szavak hosszabbak, ezért kevesebb, mint az angol 26).
  A néhány szavas utolsó csonkot az előző blokkhoz olvasztja.
- `huBuild()` két lépésben dolgozik: (1) a töredékek összevonása teljes magyar
  mondattá `huKey` szerint — a FORDÍTÁS továbbra is az egészből készül —, (2) a kész
  mondat visszatördelése blokkokra, **karakterarányos időzítéssel**: minden blokk
  annyi időt kap a mondat sávjából, amennyi szöveg jut rá.
- `huGi()` mostantól IDŐ alapján választ blokkot (egy mondaton belül több van);
  ha a lejátszófej nem az aktuális mondatnál jár (ugrás, szünet), a mondat kezdete
  az alap.
- `syncHuFlow()`: ha a fordítás utólag érkezik (élő mód), a mondatot ÚJRA kell
  tördelni — nem elég a szöveget cserélni.
- A koppintás a blokk kezdetéhez tartozó mondatra ugrik, nem a mondat elejére.
- A `fitFlow()` megmarad biztonsági hálónak, de tördelés után gyakorlatilag nem lép be.

Mérés (flowtest): a 342 karakteres mondat 4 blokkra tördelődik (12, 13, 12, 16 szó),
egyik sem hosszabb az angol töredékeknél, a blokkok időben hézagmentesen követik
egymást, együtt pontosan a teljes mondatot adják vissza, és a betűméret marad az
angoléval azonos 22,7 px.

## v22: az átgördülés ELTÁVOLÍTVA — a mondat eleje mindig látszik

A v21 még mindig gördített a mondaton belül, ha a buborék magasabb volt a sávnál.
A felhasználó képernyőképén ez látszott: a magyar mondat felső sora félbevágva a
felezővonal fölött, „itt nem látom a magyar elejét". A tanulság ugyanaz, mint a
fejléc-fedésnél: **lepillantáskor a mondat ELEJE a fogódzó**, azt elvenni akkor is
hiba, ha a vége cserébe láthatóvá válik.

- `bandTop()` mostantól egyszerűen `cur.offsetTop - pad` — a buborék teteje a sáv
  tetején áll, mindkét sávban, kivétel nélkül.
- Ami nem fér ki, azt **kisebb betű** oldja meg, nem görgetés: `fitFlow()` az
  AKTUÁLIS magyar buborék méretét 1,05×-ről (az angol aktuális buborékkal azonos)
  lépésenként 0,70×-ig csökkenti, amíg a mondat be nem fér a sávba. Rövid mondatnál
  tehát semmi nem változik — pontosan úgy néz ki, mint fent az angol. A nem aktuális
  buborékokról a `paintHu` leszedi az egyedi méretet.
- Ha 0,70×-en sem fér ki (nagyon hosszú, központozás nélküli Whisper-blokk), a vége
  levágva marad, de ujjal görgethető.
- `renderHu` az „ablak nem mozdult" ágon is meghívja a `paintHu`-t, különben a
  kiemelés és a betűméret-illesztés elmaradna.

Mérés (flowtest): 342 karakteres magyar mondat 22,7 px-ről 19,2 px-re csökken és
elfér a 276 px-es sávban; a rövid mondat marad 22,7 px-en, azaz az angollal azonos.

## v21: a görgetés szabálya mindkét sávban (a v19–v20 tempógörgetés hibája)

A felhasználó jelzése: a magyar mondat is „becsúszik a vonal alá, így az eleje
olvashatatlan" — ugyanaz a tünet, mint a fejléc-fedésnél, csak a felezővonalnál.
Az ok a tempógörgetés túlbuzgósága volt: a `flowTop()` a KÖVETKEZŐ buborék tetejéig
interpolált, tehát a mondat közben az aktuális buborék akkor is felfelé kúszott ki
a sávból, ha bőven elfért volna benne.

Az új, mindkét sávra közös szabály (`bandTop()`):
- a buborék teteje a SÁV TETEJÉN áll (12 px);
- görgetés a mondaton belül CSAK akkor, ha a buborék magasabb a sávnál, és akkor is
  legfeljebb a túllógásnyit (`h-(H-24)`), tehát a mondat végén az alja épp a sáv
  aljára ér — a mondat eleje soha nem csúszik ki felül;
- a következő buborékra a váltás a mondathatáron történik, nem folyamatosan.

Ezzel a rövid mondat a mondat alatt egyáltalán nem mozdul (a szem nyugton olvashat),
a hosszú pedig továbbra is a beszéd tempójában gördül végig. A `flowtest` mindkét
esetet méri: 380 px-es buborék 300 px-es sávban 0 → 40 → 89 px-et gördül (a túllógás
104 px, a mondat végéig arányosan), a 120 px-es buborék végig 388 px-en áll.

A magyar folyam betűje amúgy is azonos az angoléval (`.hs{font-family:var(--kff)}`,
az aktuális buborék `1,05×`, mint fent) — a `--kff` a ⚙ lapon állított betűtípus.

## v20: a fejléc-fedés GYÖKÉRHIBÁJA (fontos tanulság)

A felhasználó három kiadáson át jelezte, hogy „az angol szöveg a fejléc fedésében
indul, pedig látnom kellene". Az ok szerkezeti, nem görgetési: a **`#karaWrap` a
`</main>` UTÁN áll**, tehát a `<body>` közvetlen gyereke, és a `position:absolute;
inset:0` a VIEWPORT-hoz mér — a folyam teteje mindig a fejléc mögött volt. Ezt eddig
két dolog rejtette el: a `#kara` 45vh-s felső paddingja, és a pin-ág `off=hdr+12`
értéke, ami a hdr-rel épp lekompenzálta. A v18 split-ága `off=12`-vel dolgozott,
tehát pontosan a fejléc alá tolta a mondatot.

Javítás: `#karaWrap{inset:var(--hdrH,64px) 0 0 0}` a CSS-ben (alapból is helyes,
mielőtt a JS lefut), a `layoutSplit()` pedig mérve is a fejléc aljára állítja a
`top`-ot; a `setHdrVar()` mostantól újraszámolja az elrendezést. A `paintCur` pin-ága
`off=hdr+12` helyett `off=12` — a hdr már a wrap tetejében van, kétszer nem kell.
Melléktermék: a `wrap.clientHeight` végre a sáv VALÓS magassága, tehát a hosszú
buborék átgördülésének számítása (`H-24`) is helyes lett.

Tanulság a következő munkamenetre: ha egy elem `position:absolute` és a `<main>`-en
KÍVÜL van, akkor a viewporthoz méri magát, nem a fejléc alatti sávhoz. A geotest
ezt mostantól ellenőrzi (a `karaWrap` `top`-ja = a fejléc magassága, és a CSS-alapérték
is a fejléc alá tol).

## v19: a felezés KÉT FOLYAMMAL (a v18 elrendezés kijavítva)

A v18 felezése helyes volt, a magyar oldal megvalósítása nem: egyetlen óriási
doboz, egy mondattal, méretre húzott betűvel. A felhasználó szava: „borzasztó
ronda, főleg kevés karakternél, és használhatatlan is." A kért — és most megépített —
viselkedés: **az alsó fél ugyanaz, mint a felső, csak magyarul.**

- `#huWrap` / `#huFlow`: második, önállóan görgethető folyam az alsó sávban,
  ugyanazzal a betűvel és mérettel, mint az angol (`--kff`, `--kfs`, az aktuális
  buborék 1,05×), ugyanolyan üvegbuborékokkal, ugyanazzal a near/far halványítással.
- **Buborék-összevonás** (`huBuild`): a hosszú mondat `breakLong`-töredékei
  ugyanahhoz a `huKey`-hez tartoznak, ezért EGY magyar buborékba olvadnak
  (`HUG` csoportok, `HUMAP` mondat→csoport leképezés). Négy angol töredék → egy
  magyar mondat, pontosan egyszer kiírva.
- **Tempóhoz kötött görgetés** (`flowTop`, `scrollTick`, a `tick`-ből 120 ms-enként):
  a magyar nem ugrik mondatonként, hanem az aktuális buborék tetejétől a következő
  buborék tetejéig ARÁNYOSAN csúszik azzal, ahogy az idő telik a mondaton belül.
  Így a három-négy angol töredékhez tartozó hosszú magyar mondat ugyanabban a
  tempóban fut, mint fent az angol, és végig olvasható marad.
- **Az angol oldal ugyanezt kapja a hosszú buborékra**: ha a buborék magasabb a
  sávnál, átgördül a mondat alatt, tehát az alja sem szorul a dokk alá.
- **Ujjal szabadon görgethető** mindkét folyam: `touchmove`/`wheel` (nem a
  scroll-esemény, mert azt az automatika is kiváltja) öt másodpercre elengedi a
  vezetést, aztán magától visszatér az aktuális mondathoz. A programozott görgetést
  `markSelf()`/`isSelf()` időbélyeg különíti el.
- A magyar buborékra koppintva odaugrik a hang (`gotoSen(q.i0)`).
- A `#huCard`/`#plHu` panel és a `fitHu()` betűméret-illesztés TÖRÖLVE a split
  módból (a panel csak `pin` módban él).

**A mondatonkénti léptetés hibája megjavítva.** A `gotoSen` a mondat kezdete ELŐTT
0,05 s-re állította a hangot, a `senAt()` viszont ilyenkor az ELŐZŐ mondatra sorolja
a pozíciót — ezért a „mondat ▶" gomb nem vitt előre (a felhasználó jelezte:
„az előre tekerés egyáltalán nem is megy"). Most a kezdet UTÁN 0,02 s-re állunk, és
a `seeked` kezelő a `SEEKTO` jelzőből tudja, hogy nem kell újraszámolnia.

**A fejléc alá csúszó angol buborék** oka a görgetés-visszacsatolás volt: a
programozott `scrollTo` scroll-eseményt szült, ami `follow=false`-ra állította a
követést öt másodpercre, így a folyam megállt, majd az újrarajzoláskor rossz helyre
ugrott. Ezt a `markSelf`/`isSelf` elkülönítés és a `scrollTick` hard-set
pozicionálása (smooth animáció nélkül) oldja meg.

Tesztek: `flowtest.js` (18 próba: összevonás, tempógörgetés mérve, mondatléptetés
előre/vissza, görgetés-védelem), `splittest.js` (36), `geotest.js` (4 méret).

## v18: felezett képernyő (a felhasználó kérése, negyedik elrendezés)

A pin-elrendezés hibája élesben derült ki: a magyar sáv alulról nőtt, hosszú mondatnál
a képernyő felét elvitte, a szöveg vége pedig egy görgethető dobozban veszett el —
hallgatás közben senki nem görget. Az „angolhoz illesztett" módok (`cur`, `all`) pedig
azért nem működtek, mert a hosszú fordítás széttolja a folyamot, és pont a követést
teszi lehetetlenné.

Az új alapértelmezés (`CFG.huMode='split'`, `body.splithu`, migráció `CFG.huV3`):
- A fejléc és a kezelősáv közötti sáv KÉT EGYENLŐ félre oszlik. Felül az angol karaoke
  (`#karaWrap` alsó széle JS-ből, `layoutSplit()`), alul a magyar panel
  (`#huCard`, magassága `--huH`). A felhasználó megfogalmazása: „követem az angolt, és ha
  valamit nem értek, hirtelen lepillantok".
- `layoutSplit()` a kezelősáv VALÓS magasságával számol (egy-/kétsoros állapotjelző),
  fut indulás/resize/orientationchange/módváltás/megnyitás idején, és `ResizeObserver`
  figyeli a `#pl`-t. Szűk (fekvő) képernyőn a felezés nem tartható: ott az angol sávnak
  van alsó korlátja (`minEn`), de mindkét sáv életben marad — geotest bizonyítja.
- `fitHu()`: a magyar mondat betűmérete lépésenként csökken (1,45× → 0,72× `--kfs`),
  amíg a TELJES fordítás el nem fér. Csonkítás és görgetés helyett kisebb betű.
  A 197 karakteres valós mondat 28 px-en elfér, az 559 karakteres 16 px-en (fittest).
- `paintCur` split-ága: az angol a felső sáv TETEJÉN kezdődik (`off=12`).
- A magyar sor három állása: `split` → `pin` → `hide`. A `cur` és `all` KIKERÜLT.
  A „magyar" gomb helyén `HU · alul / fent / ki` — a gomb kiírja, hol áll.

Egyéb v18-as változás:
- **Az 5 mp-es tekerés törölve** (a felhasználó sosem használta): `pBack`/`pFwd` helyén
  három nagyobb gomb — `◀ mondat`, `▶`, `mondat ▶`. A MediaSession seek 5 mp-e megmaradt
  (fejhallgató-gombok).
- **A prompt()-os „ugrás a mondatra" törölve** — natív dialógus a saját
  dizájnrendszerben, olyan kérdéssel, amire nincs válasz.
- **A ⋯ menü csoportokra bomlik** (`{head:'…'}` elem a `sheet()`-ben): hallgatás /
  szöveg / fájl. A „bezárás" felkerült a hallgatás csoportba.
- **A kísérő mód látszik**: a `plStat` kiírja, hogy fut és mennyivel jár a hallgatás
  előtt (`· kísérő +8 perc` / `kész`). Csendes módban enélkül hitkérdés volt.
- **Két valódi hiba javítva**: a duplikált `id="fileTxt"` input (a második, halott
  példány törölve), és a verziószám mindkét helyen v18 (`APP_VER` + sw `VER`).
- `:focus-visible` fókuszkeret és `prefers-reduced-motion` támogatás.
- HG-felület bővítve hibakereséshez: `drawSeek, layoutSplit, fitHu, drawHuBtn, gotoSen`.
- Tesztek: `splittest.js` (34 próba: migráció, gombsor, menüszerkezet, módváltás,
  duplikátum), `geotest.js` (felezés négy készülékméreten), `fittest.js` (9 próba:
  betűméret-illesztés szimulált szövegdobozzal).

A dizájn-átvizsgálás nyitott pontjai (a felhasználó egyetértett, még nincs kész):
a `--faint` szín 3,59:1 kontraszttal a 10 px-es szövegeken (AA alatt), az arany
túlhasználata (a szó-követésnek kellene monopólium), az aktuális angol `--dim` színe
a világosabb környezet mellett, és a csúszka, amely nem mutatja sem a felismert
szakaszokat (`done[]`), sem a fejezeteket, sem az A–B tartományt.

## Meghozott döntések, amiket nem kell újratárgyalni

- **A hangot nem dekódoljuk.** A Web Audio `decodeAudioData` a teljes fájlt kéri, és nyers
  PCM-ben egy nyolcórás könyv ~10 GB. Ezért konténer-bontás és -újraépítés készült.
- **WebCodecs sem kell.** Ha nem dekódolunk, nincs is mit dekódolni: az eredeti kockákat
  változatlanul küldjük el. Kevesebb kód, kevesebb böngésző-függés, jobb hangminőség.
- **A `stsd` atomot bájtra másoljuk**, nem értelmezzük. Így ALAC-cal is működik, és nem
  kell AudioSpecificConfig-ot építeni.
- **Nem mikrofonos, élő felismerés.** A Web Speech API csak mikrofonból hallgat, fájlból
  nem, és a hangkimenetet nem lehet visszavezetni. Ezért a szöveg előre készül el
  (szeletenként, azonnali mentéssel), a lejátszás pedig már kész szöveget követ.
- **Böngészőben futó Whisper (transformers.js) nem lett beépítve**: 50–80 MB modell-
  letöltés, és telefonon a valós idejűnél is lassabb — egy tízórás könyv órákig tartana.
  A Groq turbo ugyanezt néhány perc alatt és 140 forintért megteszi.
- **Párhuzamos kétnyelvű nézet nincs**, ugyanazon okból, mint az olvasóban: a szem a
  magyarra ugrik. Ezért alapból csak az aktuális mondatnál látszik a fordítás.
- **A hang mentése nem blokkolja a megnyitást.** A v1-ben a behúzás után a program
  megvárta, míg a teljes fájl bekerül a tárolóba — a haladásjelző 6%-on állt, és nagy
  fájlnál ez percekig tartott. Kívülről ez elakadásnak látszott. A v2-ben a hallgatás és
  a felismerés a behúzott fájlból azonnal indul (`FILE`), a mentés a háttérben fut
  (`bgSaveAudio`), és a felismerés alatt nem is jelenik meg a panelen.
- **A mentés nem állítja meg a felismerést.** Ha a tároló megtelt, jelez, de fut tovább,
  mert a felismerés fizetett munka, és a memóriában lévő szöveg még hallgatható.

## Dizájn-elvek (a felhasználó kérte, hogy érvényesüljenek)

Az `imagine.art/blogs/principles-of-design` szerint, a CSS fejében kommentben is:
hierarchia (az aktuális angol mondat φ = 1,618-szor nagyobb a magyarnál), kontraszt
(méret és fényerő, mert a szín a szó-követésé), igazítás (közös bal él, 2px akcentussáv),
közelség (EN–HU 8px, mondatpárok között 32px), fehér tér (34rem sávszélesség, üres alsó
harmad), harmadok szabálya (az aktuális mondat a felső harmad vonalára görget),
ismétlés (az olvasóval közös token-készlet: arany akcentus, DM Sans, spring easing).

## Ami még ötlet, nem készült el

1. **Szótár és ismétlő**, mint az olvasóban: szóra koppintás → jelentés, mentés, SRS.
   A kivitt TSV ma a Mondatbankba tölthető, de a kör nincs bezárva.
2. **Kényszerített illesztés (forced alignment)**: ha a könyvhöz megvan az EPUB is, nem
   kellene felismerés, csak a meglévő szöveg időbélyegezése — ingyenes és hibátlan
   szöveget adna. Ez a legnagyobb nyereség a maradékból.
3. **Fejezetenkénti előre-dolgozás a lejátszás előtt** (most a felhasználó indítja a
   szakaszt), illetve a hallgatás közbeni folyamatos felismerés.
4. **Dán hangoskönyv**: a felismerő tud dánul, csak a nyelvválasztó nincs kivezetve —
   ma `language=en` van beégetve az `asrCall`-ba.
5. **Hallás utáni kártyák** exportja: mondat + hangszelet, Ankiba.
