// ==UserScript==
// @name          juzraai: GyakoriKérdések tuning
// @namespace     http://juzraai.blogspot.hu/
// @description   Felturbózza a GYK oldalt egy csöppet ;)
// @author        Zsolt Jurányi
// @match         http://www.gyakorikerdesek.hu
// @require       http://code.jquery.com/jquery-latest.js
// @require       http://cdnjs.cloudflare.com/ajax/libs/less.js/1.7.3/less.min.js
// @downloadURL   https://github.com/juzraai/gyk-tuning/raw/master/gyk-tuning.user.js
// @updateURL     https://github.com/juzraai/gyk-tuning/raw/master/gyk-tuning.user.js
// @grant         GM_addStyle
// @grant         GM_xmlhttpRequest
// @version       1.0.20140725.0002
// ==/UserScript==

//$('div#img_fejlec').append('\
//	<div style="width:100%;background-color:#000;color:#CCC;font-family:Segoe UI,Arial,sans-serif;">\
//		A GyakoriKérdések UI v2.0 telepítve van, csak ki van kapcsolva ;) [ Kapcsold be itt! ]\
//	</div>\
//	');
//
//throw new Error("Stopped JavaScript.");

// https://github.com/juzraai/gyk-tuning/raw/master/gyk-tuning.user.js
// https://github.com/juzraai/gyk-tuning/raw/master/gyk-tuning.css

/* TODO
	kellenének vissza gombok

	később lehetne olyat, hogy minden linkre egyetlen click handlert,
	ami felismeri, milyen linkről van szó, és az alapján hívja a megfelelő függvényt

	ez azért kéne, hogy később bármelyik aloldalról lehessen használni és az adott URL alapján dolgozzon
*/

var catlist = [{"v":"/altalad-megvalaszolt-kerdesek","t":"Válaszaim"},{"v":"/kerdeseid","t":"Kérdéseim"},{"v":"/figyelt-kerdeseid","t":"Figyelt kérdéseim"},{"v":"/figyelt-kulcsszavak","t":"Figyelt kulcsszavak"},{"v":"/allatok","t":"Állatok","s":[{"v":"/allatok__allatvedelem","t":"Állatvédelem"},{"v":"/allatok__halak-akvarisztika","t":"Halak, akvarisztika"},{"v":"/allatok__haszonallatok","t":"Haszonállatok"},{"v":"/allatok__hullok","t":"Hüllők"},{"v":"/allatok__kisemlosok","t":"Kisemlősök"},{"v":"/allatok__kutyak","t":"Kutyák"},{"v":"/allatok__lovak","t":"Lovak"},{"v":"/allatok__macskak","t":"Macskák"},{"v":"/allatok__madarak","t":"Madarak"},{"v":"/allatok__rovarok-izeltlabuak","t":"Rovarok, ízeltlábúak"},{"v":"/allatok__vadallatok","t":"Vadállatok"},{"v":"/allatok__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/csaladi-kapcsolatok","t":"Családi kapcsolatok","s":[{"v":"/csaladi-kapcsolatok__anyos-apos","t":"Anyós, após"},{"v":"/csaladi-kapcsolatok__csaladfa","t":"Családfa"},{"v":"/csaladi-kapcsolatok__eljegyzes","t":"Eljegyzés"},{"v":"/csaladi-kapcsolatok__eskuvo","t":"Esküvő"},{"v":"/csaladi-kapcsolatok__hazassag","t":"Házasság"},{"v":"/csaladi-kapcsolatok__nagyszulok","t":"Nagyszülők"},{"v":"/csaladi-kapcsolatok__rokoni-kapcsolat","t":"Rokoni kapcsolat"},{"v":"/csaladi-kapcsolatok__szulo-gyermek-kapcsolat","t":"Szülő-gyermek kapcsolat"},{"v":"/csaladi-kapcsolatok__testveri-kapcsolat","t":"Testvéri kapcsolat"},{"v":"/csaladi-kapcsolatok__valas","t":"Válás"},{"v":"/csaladi-kapcsolatok__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/egeszseg","t":"Egészség","s":[{"v":"/egeszseg__allergiak","t":"Allergiák"},{"v":"/egeszseg__altalanos-kozerzet","t":"Általános közérzet"},{"v":"/egeszseg__alternativ-gyogyitas","t":"Alternatív gyógyítás"},{"v":"/egeszseg__betegsegek","t":"Betegségek"},{"v":"/egeszseg__bio-eletmod","t":"Bio életmód"},{"v":"/egeszseg__dohanyzas","t":"Dohányzás"},{"v":"/egeszseg__egeszsegugyi-ellatasok","t":"Egészségügyi ellátások"},{"v":"/egeszseg__ferfiak-egeszsege","t":"Férfiak egészsége"},{"v":"/egeszseg__fogak-szajapolas","t":"Fogak, szájápolás"},{"v":"/egeszseg__immunrendszer-fertozesek","t":"Immunrendszer, fertőzések"},{"v":"/egeszseg__mentalis-egeszseg","t":"Mentális egészség"},{"v":"/egeszseg__nok-egeszsege","t":"Nők egészsége"},{"v":"/egeszseg__serulesek-balesetek","t":"Sérülések, balesetek"},{"v":"/egeszseg__szemproblemak","t":"Szemproblémák"},{"v":"/egeszseg__taplalkozas","t":"Táplálkozás"},{"v":"/egeszseg__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/elektronikus-eszkozok","t":"Elektronikus eszközök","s":[{"v":"/elektronikus-eszkozok__fenykepezogepek-kamerak","t":"Fényképezőgépek, kamerák"},{"v":"/elektronikus-eszkozok__gps-navigacio","t":"GPS, navigáció"},{"v":"/elektronikus-eszkozok__haztartasi-gepek","t":"Háztartási gépek"},{"v":"/elektronikus-eszkozok__mobiltelefonok","t":"Mobiltelefonok"},{"v":"/elektronikus-eszkozok__szorakoztato-keszulekek","t":"Szórakoztató készülékek"},{"v":"/elektronikus-eszkozok__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/emberek","t":"Emberek","s":[{"v":"/emberek__baratok-baratsagok","t":"Barátok, barátságok"},{"v":"/emberek__emberi-tulajdonsagok","t":"Emberi tulajdonságok"},{"v":"/emberek__lakohely-szomszedok","t":"Lakóhely, szomszédok"},{"v":"/emberek__magany-egyedullet","t":"Magány, egyedüllét"},{"v":"/emberek__munkahely-kollegak","t":"Munkahely, kollégák"},{"v":"/emberek__tanarok-iskolatarsak","t":"Tanárok, iskolatársak"},{"v":"/emberek__tarsasagi-elet","t":"Társasági élet"},{"v":"/emberek__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/etelek-italok","t":"Ételek, italok","s":[{"v":"/etelek-italok__alkoholmentes-italok","t":"Alkoholmentes italok"},{"v":"/etelek-italok__bor-sor-roviditalok","t":"Bor, sör, röviditalok"},{"v":"/etelek-italok__elelmiszerboltok","t":"Élelmiszerboltok"},{"v":"/etelek-italok__elelmiszerek","t":"Élelmiszerek"},{"v":"/etelek-italok__konyhai-praktikak","t":"Konyhai praktikák"},{"v":"/etelek-italok__nemzetek-etelei-italai","t":"Nemzetek ételei, italai"},{"v":"/etelek-italok__sutes-fozes","t":"Sütés, főzés"},{"v":"/etelek-italok__vegetarianizmus","t":"Vegetarianizmus"},{"v":"/etelek-italok__vendeglatas-ettermek","t":"Vendéglátás, éttermek"},{"v":"/etelek-italok__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/ezoteria","t":"Ezotéria","s":[{"v":"/ezoteria__agykontroll","t":"Agykontroll"},{"v":"/ezoteria__alomfejtes","t":"Álomfejtés"},{"v":"/ezoteria__asztrologia-horoszkop","t":"Asztrológia, horoszkóp"},{"v":"/ezoteria__feng-shui","t":"Feng-shui"},{"v":"/ezoteria__joslas","t":"Jóslás"},{"v":"/ezoteria__magia-okkultizmus","t":"Mágia, okkultizmus"},{"v":"/ezoteria__parapszichologia","t":"Parapszichológia"},{"v":"/ezoteria__reinkarnacio-es-karma","t":"Reinkarnáció és karma"},{"v":"/ezoteria__termeszetfeletti-lenyek","t":"Természetfeletti lények"},{"v":"/ezoteria__ufo-eszlelesek","t":"UFO észlelések"},{"v":"/ezoteria__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/fogyokurak","t":"Fogyókúrák","s":[{"v":"/fogyokurak__90-napos-dieta","t":"90 napos diéta"},{"v":"/fogyokurak__atkins-dieta","t":"Atkins diéta"},{"v":"/fogyokurak__dukan-dieta","t":"Dukan diéta"},{"v":"/fogyokurak__fogyasztoszerek","t":"Fogyasztószerek"},{"v":"/fogyokurak__kaloriaszamlalas","t":"Kalóriaszámlálás"},{"v":"/fogyokurak__paleo-dieta","t":"Paleo diéta"},{"v":"/fogyokurak__szenhidratszegeny-dieta","t":"Szénhidrátszegény diéta"},{"v":"/fogyokurak__update-modszer","t":"Update módszer"},{"v":"/fogyokurak__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/gyerekvallalas-neveles","t":"Gyerekvállalás, nevelés","s":[{"v":"/gyerekvallalas-neveles__altatas","t":"Altatás"},{"v":"/gyerekvallalas-neveles__babak","t":"Babák"},{"v":"/gyerekvallalas-neveles__babakocsik-hordozok","t":"Babakocsik, hordozók"},{"v":"/gyerekvallalas-neveles__babaruhak-gyermekruhak","t":"Babaruhák, gyermekruhák"},{"v":"/gyerekvallalas-neveles__babaszoba-gyerekszoba","t":"Babaszoba, gyerekszoba"},{"v":"/gyerekvallalas-neveles__betegsegek-oltasok","t":"Betegségek, oltások"},{"v":"/gyerekvallalas-neveles__bolcsodek","t":"Bölcsődék"},{"v":"/gyerekvallalas-neveles__csaladi-potlek","t":"Családi pótlék"},{"v":"/gyerekvallalas-neveles__etelek-bevezetese","t":"Ételek bevezetése"},{"v":"/gyerekvallalas-neveles__fogzas","t":"Fogzás"},{"v":"/gyerekvallalas-neveles__gyas-gyes-gyed-gyet","t":"GYÁS, GYES, GYED, GYET"},{"v":"/gyerekvallalas-neveles__iskolak","t":"Iskolák"},{"v":"/gyerekvallalas-neveles__kamaszok","t":"Kamaszok"},{"v":"/gyerekvallalas-neveles__kisgyerekek","t":"Kisgyerekek"},{"v":"/gyerekvallalas-neveles__ovodak","t":"Óvodák"},{"v":"/gyerekvallalas-neveles__orokbeadas-orokbefogadas","t":"Örökbeadás, örökbefogadás"},{"v":"/gyerekvallalas-neveles__problemas-gyerekek","t":"Problémás gyerekek"},{"v":"/gyerekvallalas-neveles__szobatisztasag","t":"Szobatisztaság"},{"v":"/gyerekvallalas-neveles__szoptatas","t":"Szoptatás"},{"v":"/gyerekvallalas-neveles__szules","t":"Szülés"},{"v":"/gyerekvallalas-neveles__tapszeres-taplalas","t":"Tápszeres táplálás"},{"v":"/gyerekvallalas-neveles__teherbeeses","t":"Teherbeesés"},{"v":"/gyerekvallalas-neveles__teherbeesesi-problemak","t":"Teherbeesési problémák"},{"v":"/gyerekvallalas-neveles__terhesgondozas","t":"Terhesgondozás"},{"v":"/gyerekvallalas-neveles__terhesseg","t":"Terhesség"},{"v":"/gyerekvallalas-neveles__terhesseg-megszakitasa","t":"Terhesség megszakítása"},{"v":"/gyerekvallalas-neveles__veteles-missed-ab","t":"Vetélés, missed ab"},{"v":"/gyerekvallalas-neveles__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/kozlekedes","t":"Közlekedés","s":[{"v":"/kozlekedes__autok-motorok","t":"Autók, motorok"},{"v":"/kozlekedes__biztositas-papirmunka","t":"Biztosítás, papírmunka"},{"v":"/kozlekedes__kozlekedesbiztonsag","t":"Közlekedésbiztonság"},{"v":"/kozlekedes__tomegkozlekedes","t":"Tömegközlekedés"},{"v":"/kozlekedes__egyeb-kerdesek","t":"Egyéb kérdések"},{"v":"/kozoktatas-tanfolyamok","t":"Közoktatás, tanfolyamok"},{"v":"/kozoktatas-tanfolyamok__hazifeladat-kerdesek","t":"Házifeladat kérdések"},{"v":"/kozoktatas-tanfolyamok__magyar-iskolak","t":"Magyar iskolák"},{"v":"/kozoktatas-tanfolyamok__nyelvtanulas","t":"Nyelvtanulás"},{"v":"/kozoktatas-tanfolyamok__specialis-tanfolyamok","t":"Speciális tanfolyamok"},{"v":"/kozoktatas-tanfolyamok__tanulas-kulfoldon","t":"Tanulás külföldön"},{"v":"/kozoktatas-tanfolyamok__tanulasi-lehetosegek","t":"Tanulási lehetőségek"},{"v":"/kozoktatas-tanfolyamok__egyeb-kerdesek","t":"Egyéb kérdések"},{"v":"/kultura-es-kozosseg","t":"Kultúra és közösség"},{"v":"/kultura-es-kozosseg__muveszetek","t":"Művészetek"},{"v":"/kultura-es-kozosseg__nepszokasok","t":"Népszokások"},{"v":"/kultura-es-kozosseg__nyelvek","t":"Nyelvek"},{"v":"/kultura-es-kozosseg__szokasok-etikett","t":"Szokások, etikett"},{"v":"/kultura-es-kozosseg__vallas","t":"Vallás"},{"v":"/kultura-es-kozosseg__vallaskritika","t":"Valláskritika"},{"v":"/kultura-es-kozosseg__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/otthon","t":"Otthon","s":[{"v":"/otthon__alberlet","t":"Albérlet"},{"v":"/otthon__barkacsolas","t":"Barkácsolás"},{"v":"/otthon__epitkezes","t":"Építkezés"},{"v":"/otthon__felujitas","t":"Felújítás"},{"v":"/otthon__hazimunka","t":"Házimunka"},{"v":"/otthon__ingatlan-vasarlas-eladas","t":"Ingatlan vásárlás, eladás"},{"v":"/otthon__kartevok","t":"Kártevők"},{"v":"/otthon__kert","t":"Kert"},{"v":"/otthon__lakberendezes","t":"Lakberendezés"},{"v":"/otthon__rezsi","t":"Rezsi"},{"v":"/otthon__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/politika","t":"Politika","s":[{"v":"/politika__hadsereg-hadvezetes","t":"Hadsereg, hadvezetés"},{"v":"/politika__kulfoldi-politika","t":"Külföldi politika"},{"v":"/politika__magyar-politika","t":"Magyar politika"},{"v":"/politika__partok-kormanyzas","t":"Pártok, kormányzás"},{"v":"/politika__rendorseg","t":"Rendőrség"},{"v":"/politika__torvenyek-jog","t":"Törvények, jog"},{"v":"/politika__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/sport-mozgas","t":"Sport, mozgás","s":[{"v":"/sport-mozgas__extrem-sportok","t":"Extrém sportok"},{"v":"/sport-mozgas__kerekparozas","t":"Kerékpározás"},{"v":"/sport-mozgas__labdajatekok","t":"Labdajátékok"},{"v":"/sport-mozgas__teli-sportok","t":"Téli sportok"},{"v":"/sport-mozgas__testepites","t":"Testépítés"},{"v":"/sport-mozgas__versenyek-olimpiak","t":"Versenyek, olimpiák"},{"v":"/sport-mozgas__vizi-sportok","t":"Vizi sportok"},{"v":"/sport-mozgas__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/szamitastechnika","t":"Számítástechnika","s":[{"v":"/szamitastechnika__biztonsag","t":"Biztonság"},{"v":"/szamitastechnika__hardverek","t":"Hardverek"},{"v":"/szamitastechnika__internet","t":"Internet"},{"v":"/szamitastechnika__programok","t":"Programok"},{"v":"/szamitastechnika__programozas","t":"Programozás"},{"v":"/szamitastechnika__weblapkeszites","t":"Weblapkészítés"},{"v":"/szamitastechnika__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/szepseg-es-divat","t":"Szépség és divat","s":[{"v":"/szepseg-es-divat__bor-es-hajapolas","t":"Bőr- és hajápolás"},{"v":"/szepseg-es-divat__modellkedes","t":"Modellkedés"},{"v":"/szepseg-es-divat__oltozkodes","t":"Öltözködés"},{"v":"/szepseg-es-divat__plasztikai-mutetek","t":"Plasztikai műtétek"},{"v":"/szepseg-es-divat__smink-es-kiegeszitok","t":"Smink és kiegészítők"},{"v":"/szepseg-es-divat__tetovalas","t":"Tetoválás"},{"v":"/szepseg-es-divat__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/szerelem-szex","t":"Szerelem, szex","s":[{"v":"/szerelem-szex__fogamzasgatlas","t":"Fogamzásgátlás"},{"v":"/szerelem-szex__ismerkedes","t":"Ismerkedés"},{"v":"/szerelem-szex__parkapcsolatok","t":"Párkapcsolatok"},{"v":"/szerelem-szex__randizas","t":"Randizás"},{"v":"/szerelem-szex__szexualitas","t":"Szexualitás"},{"v":"/szerelem-szex__szuzesseg","t":"Szüzesség"},{"v":"/szerelem-szex__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/szorakozas","t":"Szórakozás","s":[{"v":"/szorakozas__filmek-sorozatok","t":"Filmek, sorozatok"},{"v":"/szorakozas__jatekok","t":"Játékok"},{"v":"/szorakozas__konyvek","t":"Könyvek"},{"v":"/szorakozas__sztarok-bulvar","t":"Sztárok, bulvár"},{"v":"/szorakozas__tevek-tevemusorok","t":"Tévék, tévéműsorok"},{"v":"/szorakozas__zene","t":"Zene"},{"v":"/szorakozas__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/tudomanyok","t":"Tudományok","s":[{"v":"/tudomanyok__alkalmazott-tudomanyok","t":"Alkalmazott tudományok"},{"v":"/tudomanyok__helyesiras","t":"Helyesírás"},{"v":"/tudomanyok__tarsadalomtudomanyok-es-bolcseszet","t":"Társadalomtudományok és bölcsészet"},{"v":"/tudomanyok__termeszettudomanyok","t":"Természettudományok"},{"v":"/tudomanyok__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/utazas","t":"Utazás","s":[{"v":"/utazas__afrika","t":"Afrika"},{"v":"/utazas__ausztralia","t":"Ausztrália"},{"v":"/utazas__azsia","t":"Ázsia"},{"v":"/utazas__biztositasok","t":"Biztosítások"},{"v":"/utazas__del-amerika","t":"Dél-Amerika"},{"v":"/utazas__elokeszuletek","t":"Előkészületek"},{"v":"/utazas__eszak-amerika","t":"Észak-Amerika"},{"v":"/utazas__europa","t":"Európa"},{"v":"/utazas__magyarorszag","t":"Magyarország"},{"v":"/utazas__repules-repulojegyek","t":"Repülés, repülőjegyek"},{"v":"/utazas__szallasok","t":"Szállások"},{"v":"/utazas__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/unnepek","t":"Ünnepek","s":[{"v":"/unnepek__ajandekozas","t":"Ajándékozás"},{"v":"/unnepek__anyak-napja","t":"Anyák napja"},{"v":"/unnepek__ballagas","t":"Ballagás"},{"v":"/unnepek__evfordulo","t":"Évforduló"},{"v":"/unnepek__farsang","t":"Farsang"},{"v":"/unnepek__gyereknap","t":"Gyereknap"},{"v":"/unnepek__husvet","t":"Húsvét"},{"v":"/unnepek__karacsony","t":"Karácsony"},{"v":"/unnepek__mikulas","t":"Mikulás"},{"v":"/unnepek__nevnap","t":"Névnap"},{"v":"/unnepek__nonap","t":"Nőnap"},{"v":"/unnepek__punkosd","t":"Pünkösd"},{"v":"/unnepek__szilveszter-ujev","t":"Szilveszter, Újév"},{"v":"/unnepek__szuletesnap","t":"Születésnap"},{"v":"/unnepek__valentin-nap","t":"Valentin nap"},{"v":"/unnepek__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/uzlet-es-penzugyek","t":"Üzlet és pénzügyek","s":[{"v":"/uzlet-es-penzugyek__adozas-konyveles","t":"Adózás, könyvelés"},{"v":"/uzlet-es-penzugyek__banki-ugyek-kamat-hitel","t":"Banki ügyek, kamat, hitel"},{"v":"/uzlet-es-penzugyek__biztositasok","t":"Biztosítások"},{"v":"/uzlet-es-penzugyek__karrier-fizetes","t":"Karrier, fizetés"},{"v":"/uzlet-es-penzugyek__sajat-vallalkozas","t":"Saját vállalkozás"},{"v":"/uzlet-es-penzugyek__egyeb-kerdesek","t":"Egyéb kérdések"}]},{"v":"/egyeb-kerdesek","t":"Egyéb kérdések","s":[{"v":"/egyeb-kerdesek__gyik","t":"GYIK"},{"v":"/egyeb-kerdesek__humor","t":"Humor"},{"v":"/egyeb-kerdesek__onismereti-kerdesek","t":"Önismereti kérdések"},{"v":"/egyeb-kerdesek__egyeb-kerdesek","t":"Egyéb kérdések"}]}];



function updateCategoryNavigator(href, trigger) {
	var cat0 = href.split('__')[0];
	$('#cat0').val(cat0);
	updateCat1(cat0, false);
	$('#cat1').val(href);
	if (trigger) $('#cat1').trigger('change');
}

function showTopicList(doc) {
	$('#main').fadeOut('fast', function() {
		$('#main').html('<table id="topic-list"></table>');

		var t = $("table.small.width100 ~ table.kerdes_lista, div.center ~ table.kerdes_lista", doc).first();
		$('tr:not(tr:has("table"))', t).each(function(){
			var tr = $(this);
			var topic_a = $('td a[href^="/"]:not(.kerdes_alatt)',tr);
			var topic_name = topic_a.text();
			var topic_href = topic_a.attr('href');
			var cat_a = $('td a.kerdes_alatt[href^="/"]',tr);
			var cat_name = cat_a.text().replace(' - ', '<br/>&raquo; ');
			var cat_href = cat_a.attr('href');
			var last_col = $('td.nowrap', tr);
			var ans_count = last_col.text().trim().replace(/ .*/g, "");
			var last_ans = $('span[title^="Utolsó"]', last_col);
			var newtr = '<tr><th><div>'+ans_count+'</div></th>';
			if (cat_a.size() > 0) newtr += '<td class="cat">'+'<a href="'+cat_href+'">'+cat_name+'</a></td>';
			newtr += '<td class="topic">'+'<a href="'+topic_href+'">'+topic_name+'</a></td>';
			if (last_ans.size() > 0) newtr += '<td class="time">'+last_ans.text()+'</td></tr>';
			$('#topic-list').append(newtr);
		});

		// event handlers
		$('#topic-list tr td.cat a').click(function(event){
			event.preventDefault();
			updateCategoryNavigator($(this).attr('href'), true);
		});

		$('#topic-list tr td.topic a').click(function(event){
			event.preventDefault();
			topicLink($(this).attr('href'));
		});

		$('#main').fadeIn('fast');
	});
} // showTopicList()

function nick(doc) {
	var nick = $("div#img_sajatmenufelul ~ table.menu_tabla strong", doc).first().text();
	if (nick) {
		$('#nick').text(nick);
		$('.signedout').fadeOut();
		$('.signedin').fadeIn();
	} else {
		$('.signedout').fadeIn();
		$('.signedin').fadeOut();
	}
}

function showTopic(doc) {
	$('#main').fadeOut('fast', function() {
		$('#main').html('');

		var cat = $("table.width100 td.jobb_oldal a:eq(1)", doc).attr('href'); // undefined...
		updateCategoryNavigator(cat, false);

		var d = $('table.kerdes td:has("h1")', doc);

		var q = $('h1', d).text();

		var a = $('span.sc0', d);
		if (a.size() > 0) {
			a = a.text().replace(/ nevű.*/, '');
			a = a + ' [ <a href="https://www.google.hu/search?q=site%3Agyakorikerdesek.hu%20%22'+a+'%20nev%C5%B1%20felhaszn%C3%A1l%C3%B3%20k%C3%A9rd%C3%A9se%22" target="_blank">kérdései</a> ]\
				[ <a href="https://www.google.hu/search?q=site%3Agyakorikerdesek.hu%20%22'+a+'%20nev%C5%B1%20felhaszn%C3%A1l%C3%B3%20v%C3%A1lasza%22" target="_blank">válaszai</a> ]';
		} else {
			a = "<em>(név elrejtve)</em>";
		}

		var t = $('table.statusz_kerdes td.datum', doc).text().trim();

		$('h1, div', d).remove();
		$('span.sc0', d).remove();

		$('#main').append('<div id="question"></div>');
		$('#question').append('<p class="field">Kérdező: <span class="value">'+a+'</span></p>')
			.append('<p class="field">Kérdés kiírva: <span class="value">'+t+'</span></p>')
			.append('<p class="field">Kérdés:</p>')
			.append('<h1>'+q+'</h1>')
			.append('<p class="field">Leírás:</p>')
			.append('<p class="description">'+d.html()+'</p>');


		// válaszok

		// alul válasz form!!! - előre beleírhatná, hogy "#1 vagyok", ha lát "Ez a te válaszod" szöveget :)
		// további lapokat betölti ahogy legörgetünk
		// linkek normális formára hozása, hibák javítása, amit lehet

		$('#main').fadeIn('fast');
	});

}

function topicLink(href) {
	$.get(href, function(data){
		showTopic($.parseHTML(data));
	});
}

function updateCat1(cat, trigger) {
	$('#cat1 option').remove();
	$('#cat1').append('<option value="'+cat+'">Összes kérdés</option>');
	var f = false;
	for (i = 0; i < catlist.length; i++) {
		var item = catlist[i];
		if (item.v == cat) {
			if (item.s) {
				f = true;
				item.s.map(function(subitem){
					$('#cat1').append('<option value="'+subitem.v+'">'+subitem.t+'</option>');
				});
			}
			break;
		}
	}

	if (f) {
		$('#cat1block').fadeIn();
	} else {
		$('#cat1block').fadeOut();
	}

	if (f || cat=="/kerdeseid") {
		$('#noansblock').fadeIn();
	} else {
		$('#noansblock').fadeOut();
	}

	if (trigger) $('#cat1').val(cat).trigger('change');
}

function init() {
	// initialize cat0
	catlist.map(function(item) {
		$('#cat0').append('<option value="'+item.v+'">'+item.t+'</option>');
	});

	// cat0 change event
	$('#cat0').change(function() {
		updateCat1(this.value, true);
	});

	// cat1
	$('#cat1').change(function() {
		var href = $('#cat1').val();
		if ($('#noans').is(':checked')) {
			href = href + "__valasz-nelkul";
		}
		$.get(href, function(data){
			showTopicList($.parseHTML(data));
		});
	});

	// main menu
	$('a[href="/kerdeseid"], \
		a[href="/altalad-megvalaszolt-kerdesek"], \
		a[href="/figyelt-kerdeseid"], \
		a[href="/figyelt-kulcsszavak"]').click(function(event){
			event.preventDefault();
			$('#cat0').val($(this).attr('href')).trigger('change');
		});

	// noans
	$('#noans').change(function() {
		$('#cat1').trigger('change');
	});

	// refresh
	$('#refresh').click(function(){
		$('#cat1').trigger('change');
	});

	// ---

	nick(document);

	// load page - first in JSON
	$('#cat0').trigger('change');
	// with updateCategoryNavigator(href, true) we can load any of them
}

function newBody() {
	$('body').prepend('\
	<div id="juzraai-gyk-tuning-body">\
		<div id="header">\
			<div class="horizontal-nav bottom-border">\
				<ul class="float-left">\
					<li class="bold"><a href="/">GyakoriKérdések</a></li>\
				</ul>\
				<ul>\
					<li><a href="/uj-kerdes">Új kérdés</a></li>\
					<li><a href="/kerdeseid" class="signedin">Kérdéseim</a></li>\
					<li><a href="/altalad-megvalaszolt-kerdesek" class="signedin">Válaszaim</a></li>\
					<li><a href="/figyelt-kerdeseid" class="signedin">Figyelt kérdéseim</a></li>\
					<li><a href="/figyelt-kulcsszavak" class="signedin">Figyelt kulcsszavak</a></li>\
					<li><a href="/toplista">Toplista</a></li>\
					<li><a href="/partnerprogram" class="signedin">Bannereim</a></li>\
				</ul>\
				<ul class="float-right" class="signedin">\
					<li><a href="/adatmodositas" title="Beállítások" class="bold" id="nick">nickname</a></li>\
					<li><a href="/kilepes">Kilépés</a></li>\
				</ul>\
				<ul class="float-right" class="signedout">\
					<li><a href="/belepes" class="signedout">Belépés</a></li>\
				</ul>\
			</div>\
		</div>\
		<div id="catnav" class="horizontal-nav bottom-border">\
			<ul class="float-left">\
				<li><a href="#" id="refresh">Frissítés</a></li>\
				<li>\
					<select id="cat0"></select>\
					<span id="cat1block">\
						&raquo;\
						<select id="cat1"></select>\
					</span>\
				</li>\
				<li id="noansblock"><input type="checkbox" id="noans" />Válasz nélküliek</li>\
			</ul>\
			<span>&nbsp;</span>\
			<span class="float-right">searchbox</span>\
		</div>\
		<div id="main">\
		</div>\
		<div id="footer">\
			<div class="horizontal-nav top-border">\
				<ul>\
					<li><a href="/egy_veletlen_kerdes">Random kérdés</a></li>\
					<li><a href="/help">Súgó</a></li>\
					<li><a href="/felhasznaloi_szabalyzat">Szabályzat</a></li>\
					<li><a href="http://www.webminute.hu/gyakorikerdesek.hu">Médiaajánlat</a></li>\
					<li><a href="/jogi_nyilatkozat">Jogi nyilatkozat</a></li>\
					<li><a href="/adatvedelmi_szabalyok">Adatvédelem</a></li>\
					<li><a href="mailto:info@gyakorikerdesek.hu">Kapcsolat</a></li>\
					<li><a href="mailto:moderator@gyakorikerdesek.hu">Moderátor</a></li>\
				</ul>\
				<ul class="float-right">\
					<li class="bold">GYK Tuning v0.1 by <a href="http://juzraai.blogspot.hu/">juzraai</a></li>\
				</ul>\
			</div>\
		</div>\
	</div>\
	');
}

// --- MAIN ---

// hide original site
$('#container').hide();

// reset css
$('head link').remove();

// add new css
    $('head').append('<link id="less" rel="stylesheet/less" type="text/css" href="https://github.com/juzraai/gyk-tuning/raw/master/gyk-tuning.less" />');
	less.sheets.push($('link#less')[0]);
	less.refresh();

    // add new body
    newBody();

    // start functions
	init();

