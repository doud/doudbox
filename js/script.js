/*
* global
*/
var ddfrttw = {},
	baseUrl = '/';
	
function preloadImg(image) {
	var img = new Image();
	img.src = image;
}

(function () {
	var instance,
		globalHeader = $('#global_header');
	ddfrttw.globalContent = $('#ddfrttw_container');
	ddfrttw.globalMenu = $('#main_nav');
	ddfrttw.title_g = $('#title_general');
	ddfrttw.quote = $('#quote');
	ddfrttw.liGlobalMenu = $("li", ddfrttw.globalMenu);	
	ddfrttw.body = $('body');
	ddfrttw.window = $(window);
	function resize() {
		if (instance){
			instance.height(88);
			instance.rescroller();
		}
	}
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
			url: 'config.json',
			dataType: 'json',
			success: function(data) {
				ddfrttw.config = data;
			},
			error: function(jqXHR, textStatus, errorThrown) {}
		});

		$.ajax({
			url: 'proxy.php?url=http://quotesondesign.com/api/3.0/api-3.0.json&mode=native',
			async: true,
			cache: false,
			success: function(data) {
				ddfrttw.pageData = data;
				var myHtml = [], h = -1;
				myHtml[++h] = '<img class="img_quote" src="/images/quotes_haut.png" alt="decoration image haut de boite" />';
				myHtml[++h] = '<div class="wrapper_scroller"><blockquote id="qod-quote">';
				myHtml[++h] = '<p class="qod-text">';
				myHtml[++h] = ddfrttw.pageData.quote;
				myHtml[++h] = '</p>';
				myHtml[++h] = '<p class="qod-author">';
				myHtml[++h] = '<a rel="self"> &mdash; ';
				myHtml[++h] = ddfrttw.pageData.author;
				myHtml[++h] = '</a></p></blockquote></div>';
				myHtml[++h] = '<a rel="external" href="';
				myHtml[++h] = ddfrttw.pageData.permalink;
				myHtml[++h] = '">';
				myHtml[++h] = '<img class="img_quote" src="/images/quotes_bas.png" alt="decoration image bas de boite" /></a>';
				domQuote = myHtml.join('');
				
				ddfrttw.quote.detach()
					.empty()
					.html(domQuote)
					.appendTo(globalHeader);
				var paddingTitle = ddfrttw.setPaddingTitle();
				ddfrttw.title_g.css('padding', paddingTitle);
				ddfrttw.require(['ui','scroller'], function() {
					instance = $('div.wrapper_scroller');
					ddfrttw.window.smartresize(resize);
					ddfrttw.address.addCallBeforeChange(function() {
						ddfrttw.window.unbind('resize');
					});
					if (instance){
						resize();
						setTimeout(resize, 10);
					}
				});
			},
			error: function(jqXHR, textStatus, errorThrown) {}
		});

		ddfrttw.config.path = path;

		ddfrttw.loading.init();
		ddfrttw.loading.start();
		ddfrttw.address.init();
				
		if(BrowserDetect.OS=="Mac"){
			$('body').addClass("isMac" );
		}
		
		// Bind all clicks
		$('body').delegate('a', 'click', function(e) {
			// big delegate to control users clicks in general
			var me = $(this),
				href = me.attr('href');
			ddfrttw.debug.log("delegate\n ------- $this = "+me);
			
			if (me.is('[rel="external"]') || me.is('[rel="self"]')) {
				var monAttribut = me.attr('rel');
				if (monAttribut == 'external') {
					me.attr('target', '_blank');
					return;
				} else if (monAttribut == 'self') {
					return false;
				}
			}
			if (href.indexOf('http://') > -1) {
				// looks like we requested the index in IE6, rewrite the href accordingly
				href = href.substring(8);
				href = href.substring(href.indexOf(ddfrttw.config.path));
			}
			var monUrl = ddfrttw.urlEncode(href);
			ddfrttw.address.change(monUrl);
			ddfrttw.debug.log("delegate after engine\n");
			return false;
		});
		ddfrttw.loading.stop();
	};
	ddfrttw.setPaddingTitle = function() {
		return '144px 8px 32px 96px';
	};
	ddfrttw.showContent = function() {
		var myJqObj,
			content2inject;
		myJqObj = arguments[0];
		ddfrttw.globalContent
			.detach()
			.empty();
		content2inject = ddfrttw.extractSelector(myJqObj);
		ddfrttw.globalContent.html(content2inject);
		globalHeader.after(ddfrttw.globalContent);
	};
	ddfrttw.error = function() {
		ddfrttw.debug.log(ddfrttw.strings.getString('errors.unknown'));
	};
	ddfrttw.extractSelector = function(oData) {
		var oGlobalElement, oWrapper, oNav;
		
		oGlobalElement = $(oData).find("#ddfrttw_container");
		oNav = $(oData).find("#main_nav");
		oWrapper = $(oData).find("#wrapper_main");
		return oGlobalElement.html();
	};	
	ddfrttw.urlEncode = function(str) {
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
})();
/*
* loading
*/
(function () {
	var nb = 0,
		elem = $('<div />', {
			'id': 'loading'
		}).hide().appendTo(ddfrttw.body);
	ddfrttw.loading = {
		init: function() {
			elem.text(ddfrttw.strings.getString('messages.loading'));
		},
		reinit: function() {
			nb = 0;
			ddfrttw.loading.hide();
		},
		show: function() {
			elem.show();
		},
		hide: function() {
			elem.fadeOut(500);
		},
		start: function() {
			if (nb === 0)
				ddfrttw.loading.show();
			nb++;
		},
		stop: function() {
			nb = Math.max(nb-1, 0);
			if (nb === 0) {
				setTimeout(function() {ddfrttw.loading.hide();}, 500);
			}
		}
	};
})();
/*
* strings
*/
(function () {
	ddfrttw.strings = {
		getString: function(prop) {
			var props = prop.split('.'),
				string = ddfrttw.config.data.strings,
				args = arguments;
			for (var i = 0; i < props.length; i++)
				string = string[props[i]] || {};
			if (typeof(string) != "string")
				string = "";
			return string;
		},
		setString: function (prop, val) {
			var props = prop.split('.'),
				container = ddfrttw.config.data.strings;
			for (var i = 0; i < props.length - 1; i++) {
				if (!container[props[i]]) {
					container[props[i]] = {};
				}
				container = container[props[i]];
			}
			container[props[i]] = value;
		}
	};
})();
/*
* debug
*/
(function () {
	var console = window.console;
	ddfrttw.debug = {
		log: function(msg, important) {
			if (!ddfrttw.config.data.debugMode)
				{return;}
			if (console && console.log)
				{console.log(msg);}
			else if (important)
				{alert(msg);}
		},
		error: function(msg, e) {
			if (!ddfrttw.config.data.debugMode)
				{return;}
			if (console && console.error)
				{console.error(msg);}
			else if (important)
				{alert(msg);}
		},
		fail: function(msg) {
			alert(ddfrttw.strings.getString('errors.failure'));
		}
	};
})();
/*
* require
*/
(function() {
	ddfrttw.require = function(modules, clb) {
		var mod = [];
		$.each(modules, function(i, v) {
			mod.push('js/ddfrttw.'+v+'.js');
		});
		require(mod, clb); // to use once the require engine is set up
	};
	ddfrttw.require.init = function() {
		// Init and configure the require engine
	};
})();
/*
* address
*/
(function() {
	var isInit = false,
		pathNumber,
		callBeforeChange;
	ddfrttw.address = {
		init: function() {
			if (isInit)
				return;
			isInit = true;
			pathNumber = ddfrttw.config.path.split('/').length - 2;
			ddfrttw.loading.start();
			$.address
				.init(function() {
					ddfrttw.loading.stop();
				})
				.tracker(null)	// disable the tracking for jquery address
				.change(function(e) {
					ddfrttw.loading.reinit();
					if ($.isFunction(callBeforeChange)) {
						callBeforeChange();
						callBeforeChange = null;
					}
					var val = e.value;
					if(val != '/'){
						var maValTab = e.pathNames[pathNumber].split("."),
							maVal = maValTab[0],
							text = (e.value === '') ? 'index' : maVal;
							ddfrttw.loading.start();
						switch(text) {
							case 'index':
								ddfrttw.require(['index'], function() {
									ddfrttw.index.show(val);
								});
								break;
							case 'cv':
								ddfrttw.require(['cv'], function() {
									ddfrttw.cv.show(val);
								});
								break;
							case 'contact':
								ddfrttw.require(['contact'], function() {
									ddfrttw.contact.show(val);
								});
								break;
						}
					}
				});
		},
		change: function(url) {
			$.address.value(url);
		},
		addCallBeforeChange: function(clb) {
			callBeforeChange = clb;
		}
	};
})();
/*
* ajax
*/
(function () {
	var cache = [],
		queue = [],
		statusSuccess = 'success',
		isIE = BrowserDetect.isIE();

	function getCache(url) {
		if (cache[url]) {
			return cache[url];
		}
		return false;
	}

	if (isIE) {
		var innerShiv = (function() {
			var d, r;
			return function(h, u) {
				if (!d) {
					d = document.createElement('div');
					r = document.createDocumentFragment();
					/*@cc_on d.style.display = 'none';@*/
				}
				
				var e = d.cloneNode(true);
				/*@cc_on document.body.appendChild(e);@*/
				e.innerHTML = h.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
				/*@cc_on document.body.removeChild(e);@*/
				
				if (u === false) return e.childNodes;
				
				var f = r.cloneNode(true), i = e.childNodes.length;
				while (i--) f.appendChild(e.firstChild);
				
				return f;
			};
		}());
	}
	ddfrttw.ajax = {
		load: function(opts) {
			// encode uri component for the URL
			if ((!opts['type'] || opts['type']!='post') && opts.success) {
				var cached = getCache(opts.url),
					success = opts.success;
				if (cached) {
					// request in cache !
					if ($.isFunction(opts.success)) {
						success.call(opts, cached, statusSuccess, {readyState: 4});
						return;
					}
				} else {
					opts.success = function(data, status, xhr) {
						if (status == statusSuccess && xhr.readyState == 4) {
							cached = ddfrttw.ajax.addCache(opts.url, xhr.responseText);
							success.call(opts, cached, statusSuccess, {readyState: 4});
						}
					};
				}
			}
			var ind = queue.length;
			$.extend(opts, {
				complete: function(xhr) {
					queue[ind] = false;
				}
			});                                                                                                                                                                                                                                                                                                                                                                                                                              
			queue[ind] = $.ajax(opts);
		},
		addCache: function(url, data) {
			if (isIE) {
				data = innerShiv(data, false);
			}
			cache[url] = $(data);
			return cache[url];
		},
		clear: function() {
			$.each(queue, function(ind, val) {
				if (val) {
					val.abort();
				}
			});
			queue = [];
		}
	};
})();

/*
* init globale script
*/
$(function() {
	ddfrttw.init();
});
