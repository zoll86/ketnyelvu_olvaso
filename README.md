# Kétnyelvű hallgató

Hangoskönyv- és podcast-lejátszó nyelvtanuláshoz. Behúzod az `.m4b` fájlt, a program
felismeri a beszédet, mondatokra bontja, lefordítja — és hallgatás közben mindig azt az
egy mondatot mutatja nagyban, ami épp elhangzik, alatta magyarul. A szavak a kimondás
ütemében gyulladnak ki, mint a karaokénál.

Egyetlen HTML fájl, szerver nélkül működik. A hangfájl nem hagyja el a készüléket — csak
a felismeréshez küldött szeletek mennek ki a választott szolgáltatóhoz.

A Kétnyelvű olvasó párja: ugyanaz a dizájn-rendszer, ugyanaz a tanulási logika, csak
olvasás helyett hallgatás.

## Mit tud

- **Kényelem és design (v55–v56)**: listába tétel a könyvtári kártyáról is;
  a borító filter nélkül (a kontrasztot a buborékok alapja adja); a Behúzás
  telefonon csukva indul; a beállításokban a mindennapi (Megjelenés) elöl, a
  motorok/kulcsok egy csukható „egyszeri beállítás" csoportban; nagyobb ⋯
  találati felület, kevesebb jelvény-zaj.
- **Egy gombos rendbetétel + olvasási ráhagyás (v54)**: a ⋯ menü hat
  javítóeszköze egyetlen „szöveg rendbetétele" gombbá csukódott, ami előbb
  diagnosztizál, aztán jóváhagyással javít. Az olvasási ráhagyás ott tart
  lélegzetnyi szünetet a mondat végén, ahol a magyar nem férne bele az angol
  idejébe (~17 kar/mp fölött) — a hang sebességéhez nem nyúl. A magyar folyam
  mondatváltásnál siklik, nem ugrik.
- **Buborék = mondat (v53)**: az angol buborékban és az alatta lévő magyarban
  mindig ugyanaz a mondat áll, és a fordítási kérésbe is mondat megy — vágni
  csak mondathatáron szabad. A felismerő által szétvágott mondat egy töredékké
  olvad, a több mondatot hordozó szétválik; a régi felvételek megnyitáskor
  veszteség nélkül (újrafordítás nélkül) állnak át. A magyar blokk-faragás
  megszűnt: egy mondat = egy magyar buborék
- **Tiszta fordítási lánc (v52)**: a tördelési és fordítási hibák mérésen alapuló
  javítása. (1) A második átfutás részleges ismétlés-maradványait („their game.
  their game We understand…") egy determinisztikus tisztító automatikusan kiszedi
  a beolvasztáskor, és kézi menüpontként is elérhető a régebbi felvételekhez
  (⋯ → szöveg → „duplikátumok tisztítása"). (2) A mondat-összefűzés szabálya
  szigorodott: duplikátumot soha nem fűz, és pozitív jel kell hozzá — a mért
  pontossága 53%-ról 93%-ra nőtt. (3) Az írásjelezés a lánc ELEJÉRE került:
  ha egy szeletből hiányoznak az írásjelek (dal, zene alatti beszéd), az LLM
  még a tagolás és a fordítás előtt visszateszi őket, így a buborék eleve mondat,
  és a fordító eleve teljes mondatokat kap. (4) A fordítás és a tanuló mód
  szópár-gyártása szétvált: a fordítás mindig a tiszta fordító-prompton fut, a
  szópárak külön, könnyebb kéréssel készülnek, és a KÉSZ magyar fordításhoz
  horgonyzódnak — nem egy eldobott újrafordításhoz
- **Szöveg újraépítése (v47, v48)**: ha a felismerő rosszul tagolt — jellemzően dal vagy
  zene alatti beszéd, ahol egyetlen írásjel nélküli szalagot ad, és abból egy irdatlan
  buborék lesz összefolyó magyar szöveggel —, a ⋯ → szöveg menüben a „szöveg
  újraépítése" a MEGLÉVŐ felismerésből építi újra az angol tagolást és a hozzá tartozó
  magyart. A hangot nem kérdezi meg újra, és ami fordítás nem változik, az megmarad;
  csak az új egységekre kell fordítás. Célzottabb javításhoz az „összefolyó fordítások
  szétvágása" csak a túl hosszú egységeket bontja fel
- **Második átfutás (v42, v43)**: a felismerő egy szeleten belül is elhagyhat beszédet
  — halkabb rész, egymásra beszélés, zene alatti mondat —, és a program mégis késznek
  jelöli azt a szakaszt. A ⋯ → „mit ismerjünk fel?" lapon a „második átfutás" újra
  végigkérdezi a teljes felvételt (vagy innentől a végéig), kicsit emelt
  hőmérséklettel, és a becsült kérésszámot előre kiírja. Csak HOZZÁTESZ: amit eddig
  megtalált és lefordított a program, ahhoz nem nyúl; az új mondatok időrendben
  beépülnek, és csak ők lesznek lefordítva. Ha van elég nagy néma folt a felismert
  szövegben, egy olcsóbb változat csak azokat kérdezi újra
- **Egy mondat újrafordítása másik motorral (v41)**: ha a gépi fordítás pont azon a
  mondaton bukik el, amit olvasol, az aktuális buborék jobb felső sarkában lévő ⟳
  gombbal újrafordíthatod. Az egység a MONDAT, nem a buborék: a tagolás miatt egy
  mondat 3-4 buborék is lehet, és mind egyszerre cserélődik. A gyorstárat kihagyjuk,
  a motort te választod (az ingyenes is, ha nincs kulcs a többihez), és az eredeti
  fordítás egy koppintással visszakérhető
- **Könyvespolc a könyvtárban (v38, v39)**: a polc a kezdőlap tetején áll, alatta a
  behúzás (hangfájl, YouTube-link, podcast-feed egy helyen). A borítók látszanak — a
  hangfájlba beágyazott kép (mp4 `covr` / ID3 `APIC`), vagy amit a ⋯ menüből képből
  beállítasz. A borítón belül alul arany sáv jelzi, hol tartasz benne, kék vonal,
  mennyit hallgattál végig. A lejátszási listák egyetlen, kötegelt csempeként állnak a
  polcon, a teljes listára vonatkozó százalékkal; a borítójuk kézzel választható, vagy
  az első rész beágyazott képe. A részek számára koppintva nyílik ki a lista, és ott
  minden részen egy ✕ veszi ki a listából (a felvétel megmarad). A régi lista-nézet a
  ⚙ lapon visszakapcsolható
- **Tanuló módban a magyar szöveg LAPOZVA (v38)**: a buborékok nem ugranak a képernyő
  tetejére. Egy lapra annyi kerül, amennyi egészben kifér, ezek sorban elhalványulnak,
  ahogy elhangzanak — és amikor a lap alja is lement, új lap jön. Amit a lap alja
  elvágna, az egészben a következő lap tetején kezdődik. A ⚙ lapon
  visszakapcsolható a folyamatos görgetés
- **Felezett képernyő, két folyam (v19, alapértelmezés)**: a fejléc és a kezelősáv
  között két egyenlő sáv — FELÜL fut az angol karaoke, ALUL ugyanaz magyarul,
  ugyanazzal a betűvel és buborékokkal. Az angolt követed, és ha valamit nem értesz,
  lepillantasz: a magyar mindig ugyanott van
- **A magyar ugyanolyan méretű blokkokban fut, mint az angol**: a fordítás a teljes
  mondatból készül, de a kiírás visszatördelve történik, karakterarányos időzítéssel —
  a blokk mindig a sáv tetején kezdődik, tehát a mondat eleje sosem csúszik ki
- **Ujjal bármelyik folyam szabadon görgethető** — öt másodperc múlva magától
  visszatér az aktuális mondathoz
- **Sorozatok egy sorban**: a lejátszási lista a könyvtárban EGYETLEN sor („28 rész ·
  a 7. résznél"), kinyitható, és egy koppintással ott folytatja, ahol abbahagytad.
  A rész végén magától indul a következő; minden rész megjegyzi, hol tartottál.
  Tömeges behúzásnál a program felajánlja, hogy egy listába tegye a részeket
- **Több fájl egyszerre**: akár 30 részt behúzhatsz vagy kiválaszthatsz egyszerre —
  a program sorban felveszi őket a könyvtárba, és megkérdezi, mentse-e a hangot
- **Podcast RSS-címről**: beírod a feed címét, megkapod az epizódlistát, koppintasz —
  a program letölti a hangot, és onnantól minden a szokásos (felismerés, kísérő mód,
  tanuló mód, háttérben hallgatás). Ha a kiszolgáló nem engedi a közvetlen letöltést,
  felajánlja a böngészőset
- **YouTube-link beillesztése**: a videó beágyazva nyílik meg, a szöveg alatta fut —
  így látod, ki beszél. Felismerés itt nincs (a beágyazott lejátszó hangjához nem
  férünk hozzá), a szöveget a YouTube átiratából kell betölteni; háttérben nem szól
- **Átirat betöltése**: a mentett .txt fájl behúzható (⋯ → átirat betöltése fájlból),
  vagy vágólapról beilleszthető — a program mindkettőt felismeri, és rögtön fordít
- **Átirat beillesztése**: a videó alatt ⋯ → Átirat megjelenítése, kijelölés, másolás,
  majd az app ⋯ menüjében „YouTube-átirat beillesztése" — a program felismeri az
  időbélyegeket, blokkokra fűzi és rögtön lefordítja
- **Tanuló mód** (⋯ menü): az angol szöveg eltűnik — csak hallgatod —, a képernyőn
  nagy betűvel a magyar, és abba szövődnek bele azok az angol szavak, amiket már
  sokszor hallottál. A szó felvillan, amikor elhangzik; a jelölése halványul, ahogy
  megszokod; koppintásra megmutatja a magyart (és ettől egy időre visszaesik). Hosszú
  koppintás felfedi az eredeti angol mondatot. LLM-fordítót igényel
- **Szókincs**: minden végighallgatott mondat tartalmas szavai gyűlnek egy globális
  bankba, könyvektől függetlenül — a ⚙ lapon statisztika és TSV-kivitel
- **Immerzív mód**: hallgatás közben a fejléc és a kezelők 5 másodperc után
  elhalványulnak, a képernyő teljesen szöveg lesz. Koppintás: bal szél → előző
  mondat, jobb szél → következő mondat (szünetben is), közép → szünet/folytatás,
  felső harmad → megáll és visszahozza a kezelőket. Kikapcsolható a ⚙ lapon
- **Szó szerinti követés** szó-időbélyegekkel, ha a felismerő ad ilyet
- **Bármelyik mondatra koppintva** oda ugrik a hang
- **Léptetés mondatonként** (◀ mondat / mondat ▶) — nem másodpercekkel
- **A–B ismétlés** egy mondatra vagy szakaszra, **0,7–1,3× sebesség**
- **Magyar sor három módban**: alul, felezve (alapértelmezés) · a gombok felett
  rögzítve · rejtve, koppintásra (utóbbi a legtöbbet tanít: először próbálod
  megérteni, aztán ellenőrzöd)
- **Megszakítható, folytatható feldolgozás** — minden szelet után ment, a félbehagyott
  munka másnap onnan folytatódik
- **Fejezetek** olvasása az m4b fájlból, ugrás fejezetre
- **Kivitel**: kétnyelvű TSV (Anki, Mondatbank) és SRT feliratfájl
- **Betöltés**: a korábban kivitt SRT vagy kétnyelvű TSV visszatölthető (⋯ menü →
  „szöveg betöltése") — verzió- vagy gépváltásnál nem vész el a kész felismerés — és **visszatöltés**
  is: a ⋯ menü „szöveg betöltése" pontjával a korábban kivitt SRT/TSV visszahozható,
  így verzió- vagy gépváltásnál nem kell újra felismertetni
- **Zárolt képernyőn is szól**, a rendszer médiavezérlőivel (előző/következő = mondat)
- Offline elindul, csak a felismerés és a fordítás igényel hálózatot

## Telepítés GitHub Pages-re

1. Új repó a GitHubon, például `ketnyelvu-hallgato`, **Public** láthatósággal.
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
3. **Settings → Pages**, a *Source* legyen `Deploy from a branch`, a branch `main`,
   a mappa `/ (root)`. Mentés.
4. Egy-két perc múlva elérhető: `https://<felhasznalonev>.github.io/ketnyelvu-hallgato/`
5. Telefonon nyisd meg ezt a címet, és a ⚙ lapon nyomd meg a **telepítés a kezdőlapra**
   gombot. Ha nem jelenik meg, a Chrome menüjében: *Hozzáadás a kezdőlaphoz*.

Ezután ikonból indul, böngészőcím nélkül.

## Első beállítás

A ⚙ lapon:

1. **Beszédfelismerés** → *Groq* → illeszd be a kulcsot (console.groq.com, ingyenes
   regisztráció). Az ingyenes szint ehhez bőven elég — a Whisper-keret kb. 2000
   kérés/nap, egy tízórás könyv ~120 kérés, tehát **0 Ft**. Ha a Groq időnként
   lassít (429), a program vár és magától folytatja.
2. Nyomd meg a **próba** gombot. Ha azt írja, hogy *a végpont válaszol, a kulcs jó*,
   kész vagy. Ha CORS-hibát ír, lásd alább.
3. **Fordítás**: hagyd *ingyenes*-en. Ha igényesebb magyar szöveget akarsz, válts
   Claude-ra és add meg a kulcsot — az LLM tízes kötegekben, a szomszédos mondatok
   szövegkörnyezetével fordít.

Utána a kezdőlapon húzd be a hangfájlt. A program felkínálja, hogy a hátralévő részt
vagy csak a következő 10–30 percet ismerje fel. Egy tízórás könyv teljes felismerése
néhány perc, és az ingyenes szinten 0 forint.

### Ha a felismerő nem érhető el böngészőből

Néhány szolgáltató nem engedi a közvetlen böngészős hívást (ez a CORS-korlát, nem a
kulcs hibája). Ilyenkor egy háromsoros átjáró megoldja; Cloudflare Workers ingyenes
csomagjában is elfut:

```js
export default {
  async fetch(req) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, {headers: cors()});
    const target = 'https://api.groq.com/openai/v1' + url.pathname.replace(/^\/v1/, '');
    const res = await fetch(target, {method: req.method, headers: req.headers, body: req.body});
    const out = new Response(res.body, res);
    Object.entries(cors()).forEach(([k, v]) => out.headers.set(k, v));
    return out;
  }
};
const cors = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
});
```

A Worker címét (`https://…workers.dev/v1`) írd be a ⚙ lap **végpont** mezőjébe. A kulcs
így is a telefonon marad, a Worker csak továbbítja.

## Hogyan szeletel — és miért így

A felismerők legfeljebb 25 MB-os kérést fogadnak, tehát egy hangoskönyvet fel kell
szeletelni. A kézenfekvő út — a hang dekódolása a böngészőben — járhatatlan: nyers
PCM-ben egy nyolcórás könyv körülbelül tíz gigabájt, ez telefonon azonnal elfogyasztaná
a memóriát.

Ezért a program **nem dekódol semmit**. Az m4b/m4a fájl szerkezetét bontja szét (moov,
minta-táblák), és a kért időszakasz eredeti, tömörített kockáiból épít egy önálló, apró
M4A fájlt a felismerőnek. A kodek leírását bájtra másolja, tehát nem kell értelmeznie:
AAC-vel és ALAC-cal egyaránt működik. Az mp3-at keret-határon vágja, a wav-ot a fejléc
átírásával. Egyszerre így néhány megabájt van a memóriában, és a hangminőség nem változik.

## Ha valami nem működik

A ⚙ lap alján van a **Hibanapló**: minden hiba és a fájl-megnyitás minden lépése ide
kerül, okkal együtt — az is látszik, ha egy bontó feladta, és miért. A **másolás** gomb
a vágólapra teszi az egészet; ezt beillesztve a hiba távolról is kideríthető. Telefonon
nincs fejlesztői konzol, ezért ez az egyetlen ablak arra, mi történik a program belsejében.

## Nagy fájlok

Mérve, valódi fájlokon:

| fájl | bontás | egy szelet kivágása |
|---|---|---|
| 236 MB · 8 óra · 1,24 millió hangkocka | 0,4 s | 12–24 ms |
| 1,0 GB · 34,7 óra · 5,4 millió hangkocka | 1,2 s | 18–56 ms |
| 286 MB mp3 · 10,4 óra | 2,1 s | 2 ms |

Tehát a megnyitás gyors, akkor is, ha a fájl gigabájtos. Ami hosszú ideig tart, az a
**hang átmásolása a készülék tárolójába** — ez telefonon egy gigabájtnál percekig is
eltarthat. Ezért a program nem várja meg: a hallgatás és a felismerés a behúzott fájlból
azonnal indul, a mentés a háttérben fut, 24 MB-os darabokban, látható haladással. A
darabolásnak három haszna van: látszik, hol tart; kisebb a csúcsmemória; és ha félúton
elfogy a hely, nem veszik el minden.

Ha a szabad hely eleve kevesebb, mint a fájl, a program bele sem kezd, hanem megmondja,
mennyi kellene. A hallgatás ilyenkor is működik, csak a fájlt legközelebb újra be kell
húzni — a felismert szöveg megmarad, és a név és a méret alapján magától összekapcsolódik
vele.

A hang mentése a ⚙ lap *Tárolás* szakaszában kikapcsolható.

## Mi megy ki a készülékről

A hangfájl, a teljes szöveg, a kulcsok és a gyorstár a telefonon marad. Kifelé csak a
feldolgozandó darabok mennek: a hangszeletek a felismerőhöz (Groq/OpenAI), az angol
mondatok a fordítóhoz. A kereskedelmi API-k (Anthropic, Groq) a beküldött tartalomból
nem tanítanak modellt. Az ingyenes fordítás a Google fordítójához megy (közvetlenül
vagy a Lingva proxyn át); a MyMemory-tartalék a v13-ban el lett távolítva, mert az a
mondatpárokat nyilvános adatbázisba gyűjtötte. Saját, bizalmas felvételhez a
Claude-fordítás ajánlott.

## Adatok, költségek

Minden a böngésző tárolójában marad: a hangfájl, a felismert szöveg, a fordítás-gyorstár,
a kulcsok. Ezek a címhez kötődnek, tehát ha a program másik címre költözik, nem jönnek át.

| tétel | nagyságrend |
|---|---|
| felismerés (Groq Whisper turbo) | 0,04 USD / óra → tízórás könyv ≈ 140 Ft |
| fordítás ingyenes motorral | 0 Ft |
| fordítás Claude Haikuval | tízórás könyv ≈ 300–600 Ft |
| felismert szöveg helyfoglalása | ≈ 1 MB / tízórás könyv |

A ⚙ lap költségmérője valós token- és óraelszámolásból számol.

## Ismert korlátok

- A felismerés nem hibátlan: nevek, ritka szavak, erős akcentus megzavarhatja. A hallgatás
  közben ez látszik is, mert a hang az elsődleges — a szöveg csak támogatja.
- Ha a szolgáltató nem ad szó-időbélyeget, a szavak kigyulladása a mondaton belül becsült.
- Zenés, sok beszélős vagy zajos felvételnél a mondathatárok pontatlanabbak.
- A nyers AAC folyamot (ADTS, gyakran `.aac` vagy tévesen `.mp3` néven) a v3 már
  szeleteli. Az ogg/opus/flac fájlokat nem tudja szeletelni, csak egészben elküldeni — tehát csak
  akkor működik, ha a teljes fájl belefér a 25 MB-os korlátba. Az m4b, m4a, mp3 és wav
  bármilyen hosszú lehet.
- DRM-mel védett (Audible `.aa`, `.aax`) fájlt nem nyit meg.
- A hangfájl mentése nagy könyvnél megtöltheti a böngésző tárolóját. Ha nem mented, a
  felismert szöveg akkor is megmarad, csak a hangot kell újra behúzni.
- Néhány böngésző (régebbi Safari) nem tudja a hangot az adatbázisában tárolni; ilyenkor
  a program magától nyers bájtokra vált, de a memóriaigény nagyobb.

## Frissítés

Cseréld le a repóban az `index.html`-t ÉS az `sw.js`-t (a verziószám mindkettőben benne
van, együtt kell lépnie). A telefonon ezután nincs teendő: a program **indításkor
magától észreveszi** az új változatot és újratölt; kézzel a ⚙ lap **frissítés keresése**
gombjával is kérhető — ha talál újabbat, magától frissül, nem kell kilépni. A GitHub
Pages a feltöltés után pár percig még a régi fájlt adhatja; ilyenkor a gomb megmondja,
hogy a kiszolgálón még melyik verzió él.
