This is an UserScript for improving a Hungarian Q&A site's UI, so the readme will be in Hungarian, sorry guys! :)

---

# GyakoriKérdések UI v2.0 by juzraai

<img hspace="10" src="http://img.shields.io/badge/fejleszt%C3%A9s-alatt%20%3A%29-orange.svg" />
<img hspace="10" src="http://img.shields.io/badge/chrome-m%C5%B1k%C3%B6dik-brightgreen.svg" />
<img hspace="10" src="http://img.shields.io/badge/firefox-m%C5%B1k%C3%B6dik-brightgreen.svg" />

**Tartalom**

* [Mi is ez?](#mi-is-ez)
* [Mit tud?](#mit-tud)
* [Mit fog tudni még?](#mit-fog-tudni-m%C3%A9g)
* [Hogyan telepítsd?](#hogyan-telep%C3%ADtsd)
* [Hogyan működik?](#hogyan-m%C5%B1k%C3%B6dik)
* [Hogyan törölheted?](#hogyan-t%C3%B6r%C3%B6lheted)
* [Fejlesztőknek!](#fejleszt%C5%91knek)
* [Észrevételek](#%C3%89szrev%C3%A9telek)

---



## Mi is ez?

Ez egy felhasználói szkript, amit bőngészőbővítményként lehet használni, és a célja nem más, mint egy kicsikét felturbózni a GyakoriKérdések oldalt. :) A szkript semmi kárt nem okoz, nyugodtan ki lehet próbálni, egy mozdulattal kikapcsolható, törölhető, ha nem nyeri el a tetszésed.



## Mit tud?

Egyelőre nem sok mindent, de a cucc **fejlesztés alatt** van! :)

### A GYK funkcióiból

* lecseréli az oldschool design-t, az én sötét felületemre, ami nem égeti ki a szemed, ha éjjel is a topikokat bújod
* a menü fent és lent foglal helyet, az alsó menü kiegészül a moderátor email címével
* dinamikusan (AJAX) tölti be a tartalmakat, miközben magát az oldalt nem tölti újra és a menü is a helyén marad - szép és gyors
* a topik lista design-ját részben a [prog.hu](http://prog.hu) ihlette, az első oszlopban kiemelve látható a válaszok száma
* meg tudja jeleníteni topik listákat, egyelőre lapozólinkek és rendezés nélkül
* működnek a kategória linkek mindenhonnan
* megjeleníti a kérdéseket és válaszaikat, egyelőre lapozólinkek nélkül

### Plusz funkciók

* az összes kategória és alkategória elérhető a menüből, akárhol is vagy + egyúttal ezek a vezérlők azt is mutatják, éppen milyen listát nézel
* a topikok megjelenítésekor, ha ismert a kérdező/válaszoló nick-je, akkor megjelenít Google keresési linkeket az illető összes kérdéséhez és válaszához (pl. `site:gyakorikerdesek.hu "xyz nevű felhasználó kérdése"`)
* színezi a válaszokat az írójuk szerint: kérdező (zöld), saját válaszok (kék), mindenki más (szürke)


## Mit fog tudni még?

### A GYK funkcióiból

* topik és válasz listák lapozásának kezelése
* topik listák rendezése (ahol elérhető)
* kereső
* bejelentkezés
* privát üzik kezelése
* az összes GYK aloldal (toplista, bannerek, beállítások)
* az összes GYK funkció (válasz szavazás, kérdés jelentés, eltüntetés, feliratkozás, kulcsszóra feliratkozás, stb.)
* böngésző állapot frissítése (URL, ablak fejléc, előzmények)
* elérhetőség a teljes GYK oldalról, a kurrens URL alapján dolgozza fel a lapot

### Saját tuning ötletek

* a válasz doboz a topik válaszai alatt jelenik meg
* a válasz dobozba előre beleírja a szkript, ha talál az oldalon saját választ, hogy pl. "(#3 vagyok)"
* a topik egyetlen oldalon történő megjelenítése - legörgetésre hozzáfűzné a következő oldal válaszait
* a szkript beállításai: kezdő topiklista: saját kérdések / megválaszoltak / figyeltek, tárolás cookie-ban
* szkript on/off gomb



## Hogyan telepítsd?

Ez egy ún. UserScript, vagyis felhasználói szkript, melyet Firefox böngésző esetén a *GreaseMonkey* bővítmény, Chrome esetén pedig a *TamperMonkey* fog tudni működésre bírni.

Telepítés lépései:

1. Navigálj az alábbi címre:

	`https://github.com/juzraai/gyk-tuning/raw/master/gyk-tuning.user.js`

2. A GM/TM ekkor megnyit egy ablakot/lapot, itt válaszd a Telepítés/Install lehetőséget

A GM/TM automatikusan frissíteni fogja a szkriptet bizonyos időközönként (beállításfüggő). Manuális frissítéshez elegendő a fenti lépéseket megismételni, TM esetén a gomb felirata Reinstall lesz.



## Hogyan működik?

A szkript akkor lép működésbe, amikor a http://www.gyakorikerdesek.hu/ címre lépsz a böngésződdel. Ha az utolsó per jel után van még valami, akkor nem fog elindulni (ez direkt van, egyelőre, hogy lehessen használni a GYK-t a saját design-jával is).

A szkript egész egyszerűen le fogja cserélni a GyakoriKérdések főoldalát, amint az betöltődik. Elrejti az eredeti felületet, és beinjekciózza az újat a böngészőbe.

**Megjegyzés:** a szkript még nem kezeli teljesen a GYK be- és kijelentkezést, ezért érdemes a [GYK oldalán bejelentkezni](http://www.gyakorikerdesek.hu/belepes) használata előtt.

**Megjegyzés 2.:** a szkriptben sok dolog még nincs megvalósítva, elképzelhető, hogy bizonyos funkciók, linkek nem működnek. A linkeket jobb klikk -> *Megnyitás új lapon* opcióval tudod ilyen esetben megnyitni, a középső egérgombos kattintás nem fog menni.



## Hogyan törölheted?

Ha nincs más felhasználói szkripted, akkor a *GreaseMonkey*/*TamperMonkey* bővítmény eltávolításával ez a szkript is megszűnik tevékenykedni a böngésződben. Ha a bővítményt megtartanád, csak a szkriptemet törölnéd, olvass tovább:

### Törlés Chrome esetén

1. A böngésző jobb felső sarkában kattints a TM ikonjára
2. A megjelenő menüből válaszd a *Dashboard* opciót
3. Ekkor megjelenik a telepített felhasználói szkriptek listája és benne ez a szkript is
4. A sor jobb oldalán találsz egy kuka ikont, erre kattintva törölheted a szkriptet

### Törlés Firefox esetén

1. A főmenüből válaszd a Kiegészítők lehetőséget, vagy navigálj az [about:addons](about:addons) címre
2. Válaszd ki bal oldalon a User Scripts fület
3. A kiegészítő sorában jobb oldalon válaszd az Eltávolítás lehetőséget.



## Fejlesztőknek!

A repóba felraktam egy [gyk-kategoriak.json](gyk-kategoriak.json) nevű fájlt, ami beszédes nevéhez hűen a GyakoriKérdések kategóriáit és alkategóriáit rejti gyönyörűséges JSON formában. Az adathalmaz tartalmazza a linkeket és a kategóriák neveit is. Ha kedvet kaptál egy saját tuningoló szkripthez, akkor talán jól jöhet. :)

A 2015-ös új kategóriák aktualizálásáért köszönet [neki a GYK-ról](http://www.gyakorikerdesek.hu/szamitastechnika__programozas__6897393-egy-ilyen-custom-gyakori-sitemap-bovitmenyt-chrome-hoz-hogy-lehetne-megirni)!


## Észrevételek

Ha bárkinek bármilyen észrevétele, ötlete támadna, szívesen fogadom. A [blogomon](http://juzraai.blogspot.hu/) található egy kontakt form (alul) ott tudtok nekem írni, illetve hamarosan egy bejegyzést is csinálok a szkripthez, oda is lehet majd kommentelni.