var ddfrttw = {};

function preloadImg(image) {
	var img = new Image();
	img.src = image;
}

(function () {
	function urlEncode(str) {
		// from http://phpjs.org/functions/urlencode:573
		return encodeURIComponent((str+'').toString())
			.replace(/!/g, '%21')
			.replace(/'/g, '%27')
			.replace(/\(/g, '%28')
			.replace(/\)/g, '%29')
			.replace(/\*/g, '%2A')
			.replace(/%2F/g, '/')
			.replace(/%3A/g, ':')
			.replace(/%20/g, '+');
	};

	var globalHeader = $('#global_header');
	ddfrttw.globalContent = $('#container');
	ddfrttw.body = $('body');
	ddfrttw.window = $(window);
	ddfrttw.quote = $('#quote');
	ddfrttw.init = function() {
	
		$('html').removeClass().addClass('js');

		// Load ini config
		var path = baseUrl;
		
		if (window.location.pathname != path) {
			// not in ajax deep linking, redirect
			window.location = path+'#'+window.location.pathname;
			return;
		}
		$.ajax({
			async: false,
			cache: false,
			url: 'http://www.doudbox.net/config.json',
			dataType: 'json',
			success: function(data) {
				ddfrttw.config = data;
				var myHtml = [], h = -1;
				myHtml[++h] = '<blockquote id="qod-quote">';
				myHtml[++h] = '<p class="qod-text">';
				myHtml[++h] = ddfrttw.config.quote.quote;
				myHtml[++h] = '</p>';
				myHtml[++h] = '<p class="qod-author">';
				myHtml[++h] = '<a href="';
				myHtml[++h] = ddfrttw.config.quote.permalink;
				myHtml[++h] = '"> &mdash; ';
				myHtml[++h] = ddfrttw.config.quote.author;
				myHtml[++h] = '</a></p></blockquote>';
				domQuote = myHtml.join('');
				$('#quote').html(domQuote);
			},
			error: function(jqXHR, textStatus, errorThrown) {}
		});
		ddfrttw.config.path = path;
		
		ddfrttw.loading.init();
		ddfrttw.loading.start();
				
		if(BrowserDetect.OS=="Mac"){
			$('body').attr('class', ddfrttw.body.attr('class')+" isMac" );
		}

		
		// Bind all clicks
		$('body').delegate('a', 'click', function(e) {
			var me = $(this),
				href = me.attr('href');
			
			if (me.is('[rel=external]') || me.is('[rel=self]')) {
				// external link, do nothing
				if (me.attr('rel') == 'external')
					{ me.attr('target', '_blank'); }
				return;
			}
			// go to the normal address engine
			ddfrttw.address.change(urlEncode(href));
		});
				
		ddfrttw.address.init();
		ddfrttw.loading.stop();
	};
	ddfrttw.showContent = function() {
		$('#container')
			.detach()
			.children().remove();
		var ln = arguments.length, i;

		for(i = 0; i < ln; i++) {
			$('#container').append(arguments[i]);
		}
		globalHeader.after(ddfrttw.globalContent);
	};
	ddfrttw.error = function() {
		ddfrttw.debug.log(ddfrttw.strings.getString('errors.unknown'));
	};
})();
