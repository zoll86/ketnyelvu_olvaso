# TERV — Tanuló mód / beszőtt angol („diglot weave")
*Kétnyelvű hallgató, tervezési dokumentum. Állapot: 2026-08-04. Kód még nincs belőle.*

Ez a fájl a beszélgetésben megszületett döntéseket rögzíti, hogy a következő
munkamenetben ne kelljen újra levezetni őket. Az app aktuális kiadása **v25**;
ez a terv a v26+ munkára vonatkozik.

---

## 1. Honnan jön

Rákoss Péter *Tealandi utazások* című könyve a magyar szövegbe egy idő után angol
szavakat, majd mondatokat sző. A technikának van neve a szakirodalomban: **diglot
weave** (Robert Blair, 1970-es évek): az anyanyelvi szövegbe növekvő arányban
kerülnek célnyelvi elemek — előbb főnevek, aztán szerkezetek, végül tagmondatok.

**Amiben az app többet tud a könyvnél:** a könyv mindenkinek ugyanazt a görbét adja.
Az app tudja, hogy EZ a felhasználó mit hallott már sokszor — és ezt nem egy
podcasten belül, hanem az ÖSSZES eddig hallgatott anyagra összesítve.

---

## 2. Két üzemmód (a felhasználó megfogalmazása)

| | **Pihenő mód** (a mai v25) | **Tanuló mód** (ez a terv) |
|---|---|---|
| Elrendezés | felezett képernyő, felül angol / alul magyar | **teljes képernyő magyar, nagy betűvel** |
| Angol szöveg | végig látszik | nem látszik — csak **hallgatod** |
| Cél | megértés, kikapcsolódás | a fül dolgozik, a szem csak megerősít |
| Beszövés | nincs | igen, a szint szerint |

**Ugyanazt az anyagot hallgatja mindkét módban.** Ebből következik a javasolt
munkafolyamat: első kör pihenő módban végig (a tartalom megismerése), második kör
ugyanarra a fejezetre tanuló módban — ekkor a figyelem már felszabadult a nyelvre.

---

## 3. Adatszerkezetek

### 3.1 A globális szóbank (`bank`)

**Külön tár, nem a rekord része.** Akkor is megmarad, ha a hangfájlt törlöd — a hang
eldobható, a szókincs nem. Ez a funkció lelke: egy új podcast első percétől tudja,
hogy egy szót negyven órányi hallgatás során már sokszor hallottál.

```
bank[lemma] = {
  n:    hányszor hallottad (mondat-alapon számolva, lásd 5.)
  first, last: első és utolsó találkozás ideje
  shown: hányszor mutattuk már angolul a magyar szövegben
  tap:   hányszor koppintottál rá (= nem tudtad)
  pos:   szófaj (n/v/adj/adv/other) — a Claude adja
  rank:  általános gyakorisági rang (a beágyazott 5000-es listából, vagy null)
}
```

Méret: egy háromórás podcast ~3000 egyedi lemma; ötven epizód után 15-20 ezer.
Néhány MB, elhanyagolható.

**Mellékhaszon:** ez egy exportálható szótár, ami hallgatás közben, külön munka
nélkül épül — pont az a formátum, amit a Szókártya és a Mondatbank eszik.

### 3.2 Az n-gram bank (`ngram`)

Ugyanaz a szerkezet 3-5 szavas ismétlődő fordulatokra. Egy podcast-sorozat tele van
a beszélő saját paneljeivel („you know what I mean", „that's the thing"). Ezek nem
szótári tételek, hanem a beszéd szövete — és **pont ezek a legjobb első jelöltek a
tagmondat-beszövésre**, mert annyiszor hallottad őket, hogy már a ritmusuk is megvan.
Olcsó: ugyanaz a számláló, csak n-gramokra.

### 3.3 A mondat mellé tárolt szópárok (`s.pairs`)

**Ez az architektúra kulcsa: nem a kész magyar szöveget cseréljük, hanem párokat
tárolunk, és a csere MEGJELENÍTÉSKOR történik.**

```
s.pairs = [
  { en:'dreams', lemma:'dream', pos:'n', hu:'álmokat', szott:'dream-eket' },
  ...
]
```

Miért így:
- a szint bármikor változtatható **visszamenőleg is**, a régi könyvekben is, és nem
  kell újrafordítani semmit;
- ha holnap több angolt akarsz, a tegnapi fejezet is átáll;
- a `pairs` önmagában szótár, ami a bankot táplálja.

---

## 4. A fordítómotor kimenete

**Ezt csak Claude tudja megcsinálni** (a felhasználó döntése). A DeepL és az Argos
nem ad szópárokat; a Gemma megbízhatatlanul. Tanuló módban más motor nem
engedélyezett — vagy legalábbis figyelmeztetni kell.

Miért a motor és nem utólagos szövegcsere: **a ragozás**. „nézzük meg az dream" törött
mondat. A magyar helyesírás kötőjellel toldalékolja az idegen szót — „a dream-et",
„a script-et" —, és a névelő (a/az) is válthat. Ezt csak az tudja helyesen, aki
egyszerre látja az angolt és a magyart, tehát a fordító. Egy hívásban, alig hosszabb
prompttal.

A kért kimenet mondatonként: a magyar fordítás + 3-5 szópár, mindegyiknél a
**szótári alak** és a **szófaj**. A lemmát is a Claude adja — jobb, mint bármilyen
szabályalapú tövezés, főleg rendhagyó igéknél. A **tulajdonneveket meg kell jelölni**,
hogy soha ne kerüljenek a bankba: a beszélők nevét beszőni értelmetlen.

Költség: a kimenet ~15-20%-kal nő, tehát a fordítási költség is annyival. Nem sok,
de a költségmérő miatt jó előre tudni.

---

## 5. A számlálás szabályai

### 5.1 „Sokszor hallottam" ≠ „lejátszottam"

Ha a számláló a felismert szövegből dolgozik, az áttekert részek is beleszámítanak,
és a rendszer túlbecsüli a tudásod. Kell egy **`heard` intervallumlista** rekordonként:
mely szakaszokat játszottad le ténylegesen. Ugyanaz a szerkezet, mint a `done`, olcsó
— de nélküle az egész görbe hamis alapon áll.

### 5.2 Egy mondat egy munkamenetben egyszer számít

Különben egy A–B ismétlés húszszor felpumpálja a szót, és a rendszer azt hiszi, tudod.
Ha holnap újra meghallgatod ugyanazt a fejezetet, az viszont **valódi új találkozás**
— épp ezért működik a kétszeri hallgatás terve.

---

## 6. A küszöb: két dologból áll

A hallások száma önmagában félrevezet: a *the* ezerszer elhangzik, de nem tanulság.

1. **hallások száma** (`bank[lemma].n`)
2. **általános gyakorisági rang** — beágyazott lista a leggyakoribb ~5000 angol szóról,
   néhány tíz kB

A logika fordítottja lehet az intuíciónak: **a nagyon gyakori szavakat felesleges
beszőni**, mert azokat úgyis mindenhol látod. A valódi haszon a középmezőnyben van:
az a szó, amit már negyvenszer hallottál, de sosem olvastál.

**Szófaji sorrend:** főnevek először (a kontextusból kikövetkeztethetők) → igék →
melléknevek → a kötőszavak és elöljárók a legvégén, mert azok viszik a mondat vázát.

Stopword-lista kell (névelők, segédigék), és a lemmatizálás a Claude dolga (4.).

---

## 7. A sűrűség — ez a valódi paraméter

Nem az számít, hány szót „tudsz", hanem hogy **egy mondatban hány csere van**. Öt
beszőtt szó egy mondatban akkor is olvashatatlan, ha mind az öt ismerős.

```
sűrűség = f( szókincs-szint , ezt a fejezetet hányadszor hallom )
```

- **Kezdet: mondatonként legfeljebb EGY csere**, és sokáig ott is marad.
- Az első kör (pihenő mód, ismeretlen tartalom) → alacsony sűrűség.
- A második kör (tanuló mód, ismert tartalom, felszabadult figyelem) → mehet feljebb.
- Ehhez a könyvtárnak nyilván kell tartania, mely fejezetek vannak meghallgatva.
  Ez amúgy is hasznos, és jó vizuális elem: *„ez a rész készen áll tanuló módra."*

**A görbe kézzel álljon**, ne magától nőjön (a felhasználó döntése alapján kezdésnek):
az automatikus növekedést nem lehet visszavonni, ha félrement.

---

## 8. A megjelenítés

### 8.1 A felvillanás — az ötlet legerősebb pontja

A beszőtt angol szó **pont akkor villanjon fel, amikor elhangzik**. Az adat megvan:
a szó-időbélyegek (`w[]`) ott vannak az angol oldalon.

Szép komplikáció: a magyar szórend más, tehát a szó nem ott áll a magyar mondatban,
ahol az angolban elhangzik — **de fel tud villanni** abban a pillanatban. Halvány
arany, fél másodperc, aztán vissza.

Ez köti össze a fület és a szemet egyetlen szón. Ezt a könyv nem tudja megcsinálni.

### 8.2 Halványodó jelölés — a haladás látható bizonyítéka

- első cserék: erős arany pöttyözött aláhúzás
- ~tizedik alkalom: alig látszik
- ~huszadik: jelöletlen

A szó szó szerint **megérkezik** a szövegbe. Ezt látod, nem egy pontszámban olvasod.

### 8.3 Koppintás = implicit visszajelzés

A beszőtt szóra koppintva megjelenik a magyar. Ez nem csak kényelmi funkció: az a
koppintás **adat** — „nem tudtam". A szó visszaesik a lépcsőn, és egy ideig újra
magyarul jelenik meg (`bank[lemma].tap++`).

Ez az egyetlen visszacsatolás, ami nem terheli meg a hallgatást: nincs kvíz, nincs
kártyázás, nincs külön munka. Enélkül a rendszer vakon nőne, és pár hét múlva
olvashatatlan makaróniszöveget adna.

### 8.4 Vészkijárat

Lesz olyan pillanat, amikor nem érted, mit mondott, és az **írott angolt** akarod
látni. Hosszú koppintás vagy külön zóna → a teljes angol mondat néhány másodpercre.

A felfedés is adat: az a mondat nehéz volt.

---

## 9. Tagmondat-beszövés

**Felismerés: ez nem külön mechanizmus, hanem a szócsere határesete.** Ha egy
tagmondat minden szavát külön beszőnénk, az a tagmondat úgyis végig angol lenne —
csak magyar szórendbe erőltetve, ami rosszabb, mint az eredeti. Amikor a
szócsere-sűrűség egy tagmondaton belül elérné a 100%-ot, ott a helyes lépés az, hogy
**a tagmondatot hagyjuk békén angolul**. Nem kell külön küszöböt kitalálni: adódik.

Feltételek, konzervatívan:

1. **A tagmondat minden szava az 5000-es listában van, és mindet nagyon sokszor
   hallottad** (a felhasználó feltétele).
2. **Rövid**: 4-6 szó.
3. **Önmagában megálló panel** — „that's the whole point", „it doesn't have to be
   that". Nem szerkezeti újdonság, hanem kész fordulat.
4. **Előny az ismétlődő n-gramoknak** (3.2): amit ettől a beszélőtől már sokszor
   hallottál, az a legjobb jelölt.

**A szerkezet nem következik a szavakból.** „I should have known" — mind a négy szó
az első ötszázban van, mindet ezerszer hallottad, és a szerkezet mégis idegen marad.
A szóismertség szükséges, de nem elégséges feltétel; ezért kell a rövidség és a
panel-jelleg is. A hosszabb, összetettebb tagmondatok maradjanak szócserés
kezelésben, akkor is, ha minden szavuk ismerős.

**Az arány a védelem:** egy magyar mondatban legfeljebb EGY angol tagmondat, és ha
az bekerült, **szócsere abban a mondatban már nincs**. Különben makaróniszöveg lesz,
és pont a megértés vész el, amiért az egész app van.

---

## 10. Amit a tanuló mód megkövetel

- **Claude-fordítás** (4.) — más motorral a mód ne legyen elérhető.
- **A fordítás minősége hirtelen kritikussá válik.** Pihenő módban eltűrjük a gépi
  hibákat („a művészet a életet utánozza"), mert az angol ott van mellette és fejben
  korrigálsz. Ha csak a magyar látszik, a hibás fordítás **félrevezet**, és nincs
  mihez visszanyúlni.
- `heard` intervallumok (5.1) és a fejezetenkénti „meghallgatva" nyilvántartás (7.).

---

## 11. Nyitott kérdések

- A gyakorisági lista forrása és mérete (5000 szó elég-e, honnan).
- Mi számít „munkamenetnek" az 5.2 szabályhoz — időalapú (pl. 6 óra) vagy
  megnyitás-alapú?
- A `pairs` visszamenőleges legyártása a MÁR lefordított könyvekre: külön futtatás
  („szópárok pótlása"), vagy csak az újakra?
- Dán nyelvnél (később) a görbe alja sokkal fontosabb, a beszövés jóval korábban és
  óvatosabban kell hogy induljon — a küszöböket nyelvenként kell tartani.

---

## 12. Javasolt megvalósítási sorrend

1. **`heard` intervallumok** — enélkül minden számlálás hamis. Kicsi, önálló lépés,
   azonnal hasznos (a könyvtárban is látszik, mit hallgattál végig).
2. **A fordító-prompt bővítése** szópárokkal, lemmával, szófajjal; `s.pairs` mentése.
   Ekkor még nincs beszövés — csak gyűlik az adat.
3. **A globális bank** felépítése a `pairs`-ből + a gyakorisági lista beágyazása.
   Ekkor már látható egy statisztika: „ennyi szót hallottál ennyiszer".
4. **Tanuló mód felület**: teljes képernyő magyar, nagy betű, vészkijárat.
5. **Szócsere** + halványodó jelölés + koppintás-visszajelzés + felvillanás.
6. **N-gram bank**, majd **tagmondat-beszövés** — a legvégén, konzervatívan.

Az 1-3. lépés önmagában is értelmes: a szótár épül, a statisztika látszik, és a
beszövés bármikor ráépíthető, amikor már van elég adat mögötte.
