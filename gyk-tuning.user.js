// ==UserScript==
// @name          juzraai: GyakoriKérdések UI v2.0
// @namespace     http://juzraai.blogspot.hu/
// @description   Felturbózza a GYK oldalt egy csöppet ;)
// @author        Zsolt Jurányi
// @match         http://www.gyakorikerdesek.hu
// @require       http://code.jquery.com/jquery-latest.js
// @require       http://cdnjs.cloudflare.com/ajax/libs/less.js/1.7.3/less.min.js
// @resource      catlist https://github.com/juzraai/gyk-tuning/raw/master/gyk-kategoriak.json
// @downloadURL   https://github.com/juzraai/gyk-tuning/raw/master/gyk-tuning.user.js
// @updateURL     https://github.com/juzraai/gyk-tuning/raw/master/gyk-tuning.user.js
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @grant         GM_xmlhttpRequest
// @version       1.0.20140726.0106
// ==/UserScript==

var cssURL = "https://github.com/juzraai/gyk-tuning/raw/master/gyk-tuning.less";

// TODO
// - answer list
// - topic list pagers



//$('div#img_fejlec').append('\
//	<div style="width:100%;background-color:#000;color:#CCC;font-family:Segoe UI,Arial,sans-serif;">\
//		A GyakoriKérdések UI v2.0 telepítve van, csak ki van kapcsolva ;) [ Kapcsold be itt! ]\
//	</div>\
//	');
//
//throw new Error("Stopped JavaScript.");



/* TODO
	kellenének vissza gombok

	később lehetne olyat, hogy minden linkre egyetlen click handlert,
	ami felismeri, milyen linkről van szó, és az alapján hívja a megfelelő függvényt

	ez azért kéne, hogy később bármelyik aloldalról lehessen használni és az adott URL alapján dolgozzon
*/


// build up category list
var catlist = $.parseJSON(GM_getResourceText("catlist"));

// hide original site
$('#container').hide();

// reset css
$('head link').remove();

// add new css
$('head').append('<link id="less" rel="stylesheet/less" type="text/css" href="'+cssURL+'" />');
less.sheets.push($('link#less')[0]);
less.refresh();

// add new body
newBody();

// start functions
init();

// --- FUNCTIONS ---

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
			var newtr = '<tr><th>'+ans_count+'</th>';
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
			a = a.text().replace(" nevű felhasználó kérdése:", '');
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
			.append('<p id="description">'+d.html()+'</p>');


		// válaszok
		$('td.valaszok:nth-child(2)', doc).each(function(){
			var b = $(this);
			var u = $('span.sc0', b).text().replace(" nevű felhasználó válasza:", '');
			$('span.sc0', b).remove();
			// ....
			$('#main').append('<div class="answer"></div>');
		});

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
		if (item.href == cat) {
			if (item.sub) {
				f = true;
				item.sub.map(function(subitem){
					$('#cat1').append('<option value="'+subitem.href+'">'+subitem.text+'</option>');
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
		$('#cat0').append('<option value="'+item.href+'">'+item.text+'</option>');
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
			<nav id="main-nav">\
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
			</nav>\
			<nav id="category-nav">\
				<ul class="float-left">\
					<li><a href="javascript:void(0)" id="refresh">Frissítés</a></li>\
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
			</nav>\
		</div>\
		<div id="main">\
		</div>\
		<div id="footer">\
			<nav>\
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
			</nav>\
		</div>\
	</div>\
	');
}