This is an UserScript for improving a Hungarian Q&A site's UI, so the readme will be in Hungarian, sorry guys! :)

---

# GyakoriKérdések UI v2.0 by juzraai

## Mi is ez?

Ez egy felhasználói szkript, amit bőngészőbővítményként lehet használni, és a célja nem más, mint egy kicsikét felturbózni a GyakoriKérdések oldalt. :) A szkript semmi kárt nem okoz, nyugodtan ki lehet próbálni, egy mozdulattal kikapcsolható, törölhető, ha nem nyeri el a tetszésed.

## Mit tud?

* lecseréli az oldschool design-t, az én sötét felületemre, ami nem égeti ki a szemed, ha éjjel is a topikokat bújod
* a menü fent és lent foglal helyet, az alsó menü kiegészül a moderátor email címével
* dinamikusan (AJAX) tölti be a tartalmakat, miközben magát az oldalt nem tölti újra és a menü is a helyén marad - szép és gyors
* az összes kategória és alkategória elérhető a menüből, akárhol is vagy + egyúttal ezek a vezérlők azt is mutatják, éppen milyen listát nézel
* a topik lista design-ját részben a [prog.hu](http://prog.hu) ihlette, az első oszlopban kiemelve látható a válaszok száma
* meg tudja jeleníteni topik listákat, egyelőre lapozólinkek és rendezés nélkül

Egyelőre ennyi, de a cucc **fejlesztés alatt** van! :)

## Mit fog tudni még?

### A GYK funkcióiból

* lapozólinkek a topik listák felett
* topik listák rendezése (ahol elérhető)
* kereső
* bejelentkezés
* az összes GYK aloldal (toplista, bannerek, beállítások)
* az összes GYK funkció (válasz szavazás, kérdés jelentés, eltüntetés, feliratkozás, kulcsszóra feliratkozás, stb.)

### Saját tuning ötletek

* a válasz doboz a topik válaszai alatt jelenik meg
* a válasz dobozba előre beleírja a szkript, ha talál az oldalon saját választ, hogy pl. "(#3 vagyok)"
* a topik egyetlen oldalon történő megjelenítése - legörgetésre hozzáfűzné a következő oldal válaszait

## Hogyan telepítsd?

Ez egy UserScript, vagyis felhasználói szkript, melyet Firefox böngésző esetén a GreaseMonkey bővítmény, Chrome esetén pedig a TamperMonkey fog tudni működésre bírni.

### Telepítés Chrome esetén

1. Telepítsd a [TamperMonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) nevű bővítményt
2. A böngésző jobb felső sarkában kattints a TM ikonjára
3. A megjelenő menüből válaszd az *Add a new script...* opciót
4. A megnyíló oldalon az *Update URL* mezőbe illeszd be ezt a linket:

	**(hamarosan megmondom, csak tesztelnem kell)**

5. Kattints a mentés ikonra (flopi lemezt ábrázol, és balról a 2. gomb)
6. Ekkor megjelenik a telepített felhasználói szkriptek listája és benne egy *My fancy new userscript* nevű szkript
7. Pipáld be a sor elején a jelölőnégyzetet
8. A fent megjelenő lenyíló listában válaszd a *Trigger an update* opciót
9. Kattins mellette a Start gombra
10. Ha minden OK, akkor a listában egy "0 m" fogja jelezni, hogy 0 perce (azaz most) frissítetted a szkriptet, ami azt jelenti, hogy a gépeden van a legfrissebb verzió.

A TM időnként frissíteni fogja a szkripteket, de a 7.-9. lépéssel te is bármikor megteheted.

### Telepítés Firefox esetén

(Hamarosan megírom ezt a részt.)

## Hogyan működik?

A szkript akkor lép működésbe, ha a http://www.gyakorikerdesek.hu/ címre lépsz a böngésződdel. Ha az utolsó per jel után van még valami, akkor nem fog elindulni (ez direkt van, egyelőre, hogy lehessen használni a GYK-t a saját design-jával is).

A szkript egész egyszerűen le fogja cserélni a GyakoriKérdések főoldalát. Elrejti az eredeti felületet, és beinjekciózza az újat a böngészőbe.

**Megjegyzés:** a szkript még nem kezeli teljesen a GYK be- és kijelentkezést, ezért érdemes a [GYK oldalán bejelentkezni](http://www.gyakorikerdesek.hu/belepes) használata előtt.

**Megjegyzés 2.:** a szkriptben sok dolog még nincs megvalósítva, elképzelhető, hogy bizonyos funkciók, linkek nem működnek. A linkeket jobb klikk -> *Megnyitás új lapon* opcióval tudod ilyen esetben megnyitni, a középső egérgombos kattintás nem fog menni.

## Milyen környezetben teszteltem?

Egyelőre csak a legfrissebb Chrome böngészővel.

## Fejlesztőknek!

A repóba felraktam egy [category-list.json](category-list.json) nevű fájlt, ami beszédes nevéhez hűen a GyakoriKérdések kategóriáit és alkategóriáit rejti gyönyörűséges JSON formában. Az adathalmaz tartalmazza a linkeket és a kategóriák neveit is. Ha kedvet kaptál egy saját tuningoló szkripthez, akkor talán jól jöhet. :)