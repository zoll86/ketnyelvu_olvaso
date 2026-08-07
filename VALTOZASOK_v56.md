# VÁLTOZÁSOK — v55 → v56: KÉNYELEM ÉS DESIGN

## 1. A borító filter nélkül él
A lejátszó hátterében a borítón eddig egy erős sötétítő átmenet ült (50→96%),
tanuló módban plusz egy réteg. Mindkettő lekerült: az olvashatóságot a
buborékok saját fekete alapja adja (chipek a sorok mögött, kártya az
aktuálison) — a kép filter nélkül, a maga színeivel látszik.

## 2. A Behúzás-kártya csukható
Ritka művelet, mégis a könyvtár alsó felét foglalta. Telefonon csukva indul
(egy sor, a címre koppintva nyílik/csukódik), asztali gépen — ahol tényleg van
egérrel húzás — nyitva marad.

## 3. Beállítások: a mindennapi elöl, az egyszeri csukva
A Megjelenés (betű, ráhagyás, magyar sáv, immerzív) került legfelülre. A
Beszédfelismerés és a Fordítás motor/kulcs-kártyák a „Motorok és kulcsok —
egyszeri beállítás" csoport mögé kerültek, ami koppintásra nyílik; kulcs
nélkül (első használat) nyitva indul, hogy meglegyen az út.

## 4. Könyvtári kártya apróságok
- A ⋯ pötty találati felülete 26 → 40 px (a rajza alig nőtt, a célja igen).
- A „0%" jelvény nem hír, lekerült: jelvény csak folyamatban lévő
  feldolgozásnál (1–98%); szöveg nélküli felvételnél a hiány kimondva:
  „szöveg ✗" (a „hang ✗" mintájára).

---

# VÁLTOZÁS — v54 → v55

A könyvtári kártya ⋯ menüjéből hiányzott a „listába…" (csak a párja, a
„kivétel a listából" volt ott; listába tenni eddig csak a megnyitott felvétel
lejátszó-menüjéből lehetett). Most a kártyáról is megy: ⋯ → „listába…" →
meglévő lista választása vagy új lista.

---

# VÁLTOZÁSOK — v53 → v54: EGYSZERŰSÍTÉS + OLVASÁSI ÉLMÉNY

A vezérelv Zoli diagnózisa volt: „valami nem működött jól, hoztunk rá egy menüt,
nem javítottuk az alapot." Az alap a v52–v53 óta jó — most a rárakódott réteg
tűnt el, és a fő használati eset (angol podcast + magyar olvasás) lett simább.

## 1. A ⋯ menü SZÖVEG szakasza: 10 pontból 4 (ÚJ: textDoctor)
A hat régi javítóeszköz (hiányzó fordítások, szópárok, mondatokra rendezés,
duplikátum-tisztítás, újraépítés, mondathatár-helyreállítás, szétvágás) EGY
gombbá csukódott: **„szöveg rendbetétele"**. Előbb diagnosztizál (másolaton,
a valódihoz nem nyúl), tételesen megmondja, mit talált, és jóváhagyás után
javít — csak az érintett mondatokat fordítja újra. Írásjel nélküli szakaszoknál
magától a teljes újraépítést választja. A régi függvények megmaradtak, ő hívja
őket; csak a menüből tűntek el. Maradt még: újrafordítás, betöltés, beillesztés.

## 2. Olvasási ráhagyás (ÚJ, alapból BE — beállításokban kikapcsolható)
A podcast diktálja a tempót, de a magyar jellemzően hosszabb: a feliratolvasási
plafon ~17 karakter/mp. Ahol a mondat e fölé kényszerítené az olvasót, a mondat
VÉGÉN lélegzetnyi szünet (legfeljebb 2,8 mp), a természetes mondatközt
beszámítva. A hang sebessége érintetlen; a szünet alatt három pont lüktet a
kártya sarkában. Kézi beavatkozás (play/pause, mondatléptetés) azonnal
visszavonja.

## 3. Sikló fókuszvonal
Az aktuális magyar kártya helye eddig is rögzített volt, de a mondatváltás
UGRÁS volt. Most a folyam ~250 ms alatt odasiklik (kisimuló), a mondat alatt
pedig áll — mozgó szöveget olvasni nehezebb. Mindkét sávra érvényes; kézi
görgetés alatt nem szól bele.

## 4. tidySen: a tisztítás iterálva, amíg stabil
A mérés kimutatta: egy menet dedup+rendezés után az összeolvasztott szövegben
ÚJ ismétlés válhat láthatóvá (a friss exporton a 2. kör még 2+4 hibát talált).
A tisztítás+rendezés most 4 körig iterál, amíg mindkettő nullát ad — a
beolvasztásban, a rendbetételben és az újraépítésben is. Teszt igazolja: a
rendbetétel után a második diagnózis 0/0.

## 5. Tipográfia
A magyar sormagasság 1,42/1,5 → 1,55 (a kutatási optimum hosszú szövegre).

## Ellenőrzés
6 új teszt (ráhagyás-matek 4, rendbetétel-konvergencia 2) + a teljes korábbi
kör (17 mondat-elvű, 13 szúrópróba, 4 API-logika) zöld; szintaxis rendben.

---

# VÁLTOZÁSOK — v52 → v53: BUBORÉK = MONDAT

Az alapszabály: az angol buborékban és az alatta lévő magyarban MINDIG ugyanaz
a mondat áll, és a fordítási kérésbe is mondat megy — vágni csak mondathatáron
szabad.

## 1. A mondat a fizikai egység (ÚJ: sentencize + splitFrag)
A rec.sen elemei mondatok, nem felismerő-szeletek:
- a felismerő által szétvágott mondat töredékei EGY töredékké olvadnak
  (nem csak közös fordítási kulcsot kapnak — az angol sáv sem lapoz fél
  mondatokat), a szó-időbélyegek összefűzve öröklődnek a karaokéhoz;
- a több mondatot hordozó töredék mondatonként szétválik, az időket a
  szó-időbélyegek adják;
- automatikusan fut minden beolvasztásnál; kész magyar szöveget kérdés
  nélkül soha nem dob el.

## 2. Veszteségmentes migráció megnyitáskor
A régi felvételek breakLong-darabjai (közös full) megnyitáskor csendben egy
mondattá olvadnak: az egyesített szövegük pont a full, ami eddig is a
fordítási kulcs volt — a kész magyar egy betű újrafordítás és egyetlen
API-hívás nélkül átöröklődik. A buborék = mondat a meglévő felvételeken is.

## 3. Mondaton belül nem tördelünk
- breakLong és pushSen: valódi (írásjeles) mondat egyben marad, akármilyen
  hosszú. Egyetlen kivétel az írásjel nélküli szalag (dal): MAXF=60 szó fölött
  ott muszáj vágni, és a darabok KÜLÖN egységek (v46 tanulsága).
- huAlign: a tagmondat-alapú magyar blokk-faragás megszűnt — egy fordítási
  egység = egy magyar buborék. A magyar sosincs másképp tördelve, mint az angol.

## 4. Kézi menüpont átalakítva
„mondatok összefűzése a fordításhoz" → „mondatokra rendezés (buborék =
mondat)": összeolvaszt ÉS szétválaszt, force-szal, csak az érintetteket
fordítja újra. A régi, fordított csonka futamokat is ez rendezi.

## Ellenőrzés
17 egységteszt zöld; mindkét fixture-ön (170 + 206 töredék) a lánc után
0 több-mondatos buborék és 0 óriás (60+ szavas) buborék. A korábbi v52-es
tesztek (contd, dedup, punctAsr, llmPairs) változatlanul zöldek.

---

# VÁLTOZÁSOK — v51 → v52

Minden változás mérésen alapul (ellenorzes_v52.js, pilot fixture 170 + friss
export 206 töredék). Részletek: ATADO.md eleje.

## 1. Duplikátum-tisztító (ÚJ: dedupSen)
A második átfutás részleges ismétlés-maradványait szedi ki, három
determinisztikus szabállyal (belső „X. X" futam; szomszédos vég-eleje ismétlés;
határon átlógó ismétlés). A dalszöveg valódi (vesszős) ismétléseit védi.
- automatikusan fut minden beolvasztásnál (mergeSen)
- kézi menüpont a régi felvételekhez: ⋯ → szöveg → „duplikátumok tisztítása"
  — csak az érintett mondatokat fordítja újra

## 2. Szigorúbb mondat-összefűzés (contd, v52)
Duplikátum-őr (B eleje = A vége → nem fűz) + kötelező pozitív jel (kisbetűs
folytatás VAGY nyilvánvalóan csonka vég). Mért pontosság: 53% → 93%,
duplikátum-fűzés: 9 → 0.

## 3. Új sorrend a beolvasztásban (mergeSen)
dedup → stitch → normSen (eddig: normSen → stitch). Az összefűzés az EREDETI
felismerői időkkel fut, a <2 s szünet-szűrő újra él.

## 4. Írásjelezés a lánc elején (ÚJ: punctAsr)
Ha a felismerő szeletéből hiányoznak az írásjelek (needPunct), az LLM még a
tagolás ELŐTT visszateszi őket a nyers válaszba — a v50-es szó-ellenőrzéssel
(eltérő szavaknál eldobjuk). Így a buborék eleve mondat, a fordító eleve teljes
mondatokat kap, és nem kell utólag újrafordítani. Normál (írásjeles) podcastnál
egyetlen API-hívás sem történik. Kulcs nélküli (ingyenes) motornál kimarad —
ott a 2. pont hálója dolgozik.

## 5. A fordítás és a szópár-gyártás szétválasztva
- a fordítás MINDIG a tiszta SYS_TR-en fut (eddig bekapcsolt szópároknál a
  nehéz kombinált prompton, ami hosszú mondatoknál csordult, a JSON csonkult,
  és az egész köteg visszaesett vagy üresen maradt)
- a szópárak külön, könnyebb kéréssel készülnek (SYS_PAIRS), és megkapják a
  KÉSZ magyar fordítást — a párok ahhoz horgonyzódnak, ami a képernyőn van
  (a régi pótló újrafordíttatott és a friss magyart eldobta)
- az újrafordítás (más motorral) is így működik
- bekapcsolt szópároknál ez fordításonként EGY további, könnyebb kérést jelent

## Visszavonási utak
- automatikus összefűzés ki: mergeSen-ben a stitchSen(rec,false) sor
  kikommentelése (= v45-ös viselkedés)
- automatikus tisztítás ki: mergeSen-ben a dedupSen(rec) sor kikommentelése
- automatikus írásjelezés ki: runJob/runPass-ban a punctAsr-blokk kikommentelése

## Nem változott
splitSentences (a mérés felmentette), normSen, huAlign/huBuild, tanuló mód,
lapozó, polc, listák, PWA, felismerés-indítás.
