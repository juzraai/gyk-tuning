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
// @version       1.0.20140727.2243
// ==/UserScript==
if (window.top != window.self) return;

var cssURL = "https://github.com/juzraai/gyk-tuning/raw/master/gyk-tuning.less";

// TODO
// - load answers automatically
// - topic list pagers
// - load menus from JSON. separate list for signedin/signedout states

// build up category list
var catlist = $.parseJSON(GM_getResourceText("catlist"));
console.debug('JSON loaded.');

// hide original site
$('#container').hide();

// reset css
$('head link').remove();

// add new css
$('head').append('<link id="less" rel="stylesheet/less" type="text/css" href="'+cssURL+'" />');
less.sheets.push($('link#less')[0]);
less.refresh();
console.debug('LESS loaded.');

// add new body
newBody();

// start functions
init();

// --- FUNCTIONS ---

function updateCategoryNavigator(href, trigger) {
	var cat0 = href.split('__')[0];
	$('#category').val(cat0);
	updateCat1(cat0, false);
	$('#subcategory').val(href);
	if (trigger) $('#subcategory').trigger('change');
}

function showTopicList(doc) {
	$('#main').fadeOut('fast', function() {
		//$("html, body").scrollTop(0);
		$("html, body").animate({scrollTop: 0}, 'slow');
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

		// pager links: $('table.small.width100 a[href*="oldal"]');

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

function getNickLinks(nick) {
 return '\
		[ <a href="https://www.google.hu/search?q=site%3Agyakorikerdesek.hu%20%22'+encodeURI(nick)+'%20nev%C5%B1%20felhaszn%C3%A1l%C3%B3%20k%C3%A9rd%C3%A9se%22" target="_blank">kérdései</a> ]\
		[ <a href="https://www.google.hu/search?q=site%3Agyakorikerdesek.hu%20%22'+encodeURI(nick)+'%20nev%C5%B1%20felhaszn%C3%A1l%C3%B3%20v%C3%A1lasza%22" target="_blank">válaszai</a> ]\
	';
}

function showTopic(doc) {
	$('#main').fadeOut('fast', function() {
		//$("html, body").scrollTop(0);
		$("html, body").animate({scrollTop: 0}, 'slow');
		$('#main').html('');

		// breadcrumbs
		var cat = $("table.width100 td.jobb_oldal a:eq(1)", doc).attr('href');
		updateCategoryNavigator(cat, false);

		// question box
		var td = $('table.kerdes td:has("h1")', doc);

		// get data
		var question = $('h1', td).text();

		var nick = $('span.sc0', td);
		if (nick.size() > 0) {
			nick = nick.text().replace(" nevű felhasználó kérdése:", '');
			nick = nick + getNickLinks(nick);
		} else {
			nick = "";
		}

		var timestamp = $('table.statusz_kerdes td.datum', doc).text().trim();

		$('h1, div, span.sc0', td).remove();
		var h = td.html().trim();
		while (h.match(/^<br ?\/?>/gi)) h = h.replace(/^<br ?\/?>/gi, '').trim();
		while (h.match(/<br ?\/?>$/gi)) h = h.replace(/<br ?\/?>$/gi, '').trim();
		td.html(h);

		var description = td.html();

		// output
		$('#main').append('<div id="question" class="op"></div>');
		$('#question')
			.append('<div class="nick">'+nick+'</div><div class="timestamp">'+timestamp+'</div>')
			.append('<h1>'+question+'</h1>')
			.append('<p>'+description+'</p>');

		// answers
		$('tr:has(>td.valaszok a[name])', doc).each(function() {
			var tr1 = $(this);
			var tr2 = tr1.next();

			// get data
			var td = $('td:has(a[name])', tr1);
			var clazz = "";
			var nick = $('span.sc0', td);

			var p = $('div.right.small', tr1);
			var userPercentage = "";
			var answerPercentage = "";
			if (p.size() > 0) {
				p = p.text();
				var pattern = /.*A válaszíró ([\d%]+).*/g;
				var match = pattern.exec(p);
				if (match) {
					userPercentage = match[1];
				}
				pattern = /.*A válasz ([\d%]+).*/g;
				match = pattern.exec(p);
				if (match) {
					answerPercentage = match[1];
				}
			}

			$('a[name], div, span.sc0', td).remove();
			var h = td.html().trim();
			while (h.match(/^<br ?\/?>/gi)) h = h.replace(/^<br ?\/?>/gi, '').trim();
			while (h.match(/<br ?\/?>$/gi)) h = h.replace(/<br ?\/?>$/gi, '').trim();
			td.html(h);
			var answer = td.html();

			var id = $('td.sorszam', tr2).text();

			var timestamp = $('td.datum', tr2).text();

			// output
			var nicklinks = "";
			if (nick.size() > 0) {
				nick = nick.text().replace(" nevű felhasználó válasza:", '');
				if (nick.match(/A kérdező.*/)) {
					nick = "Kérdező";
					clazz = "op";
				} else {
					nicklinks = getNickLinks(nick);
				}
			} else {
				nick = "";
			}
			if ($('td.ertekelo', tr2).text()=="Ez a te válaszod.") {
				nick = nick + " (te)";
				clazz = "my";
			}
			if (userPercentage) {
				if (""==nick) nick = "(név elrejtve)";
				nick = nick + " [ " + userPercentage + " ]";
			}
			nick = nick + nicklinks;
			if (answerPercentage) {
				answerPercentage =  " [ " + answerPercentage + " ]";
			} else {
				answerPercentage = "";
			}
			// answerPercentage +=  rate buttons (-1 +0.5 +1), report button

			var cssid = "answer-"+id.replace('# ', '').replace('/', '-');
			$('#main').append('<div class="answer '+clazz+'" id="'+cssid+'"></div>');
			$('#'+cssid)
				.append('<div class="answer-id">'+id+'</div><div class="nick">'+nick+'</div><div class="timestamp">'+timestamp+'</div>')
				.append('<p>'+answer+'</p>')
				.append('<div class="ratings">'+answerPercentage+'</div>');
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
	$('#subcategory option').remove();
	$('#subcategory').append('<option value="'+cat+'">Összes kérdés</option>');
	var f = false;
	for (i = 0; i < catlist.length; i++) {
		var item = catlist[i];
		if (item.href == cat) {
			if (item.sub) {
				f = true;
				for(j = 0; j < item.sub.length; j++) {
					subitem = item.sub[j];
					$('#subcategory').append('<option value="'+subitem.href+'">'+subitem.text+'</option>');
				}
			}
			break;
		}
	}

	if (f) {
		$('#subcategory-block').fadeIn();
	} else {
		$('#subcategory-block').fadeOut();
	}

	if (f || cat=="/kerdeseid") {
		$('#noansblock').fadeIn();
	} else {
		$('#noansblock').fadeOut();
	}

	if (trigger) $('#subcategory').val(cat).trigger('change');
}

function init() {
	console.debug('init()');

	// initialize cat0
	console.debug('catlist = '+catlist);
	for(i = 0; i < catlist.length; i++) {
		item = catlist[i];
		$('#category').append('<option value="'+item.href+'">'+item.text+'</option>');
	}
	console.debug('Categories injected.');

	// cat0 change event
	$('#category').change(function() {
		updateCat1(this.value, true);
	});

	// cat1
	$('#subcategory').change(function() {
		var href = $('#subcategory').val();
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
			$('#category').val($(this).attr('href')).trigger('change');
		});

	// noans
	$('#noans').change(function() {
		$('#subcategory').trigger('change');
	});

	// refresh
	$('#refresh').click(function(){
		$('#subcategory').trigger('change');
	});

	// ---

	nick(document);

	// load page - first in JSON
	$('#category').trigger('change');
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
						<select id="category"></select>\
						<span id="subcategory-block">\
							&raquo;\
							<select id="subcategory"></select>\
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