window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
	console.log( Array.prototype.slice.call(arguments) );
  }
};


var BrowserDetect = {

	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	
	isIE: function() {
		return this.browser == "Explorer";
	},
	
	isIE6: function() {
		return this.isIE() && this.version == 6;
	},
	
	isIE7: function() {
		return this.isIE() && this.version == 7;
	},
	
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]
};
BrowserDetect.init();

/*
 * jQuery Address Plugin v${version}
 * http://www.asual.com/jquery/address/
 *
 * Copyright (c) 2009-2010 Rostislav Hristov
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Date: ${timestamp}
 */
(function ($) {

    $.address = (function () {

        var _trigger = function(name) {
                $($.address).trigger(
                    $.extend($.Event(name), 
                        (function() {
                            var parameters = {},
                                parameterNames = $.address.parameterNames();
                            for (var i = 0, l = parameterNames.length; i < l; i++) {
                                parameters[parameterNames[i]] = $.address.parameter(parameterNames[i]);
                            }
                            return {
                                value: $.address.value(),
                                path: $.address.path(),
                                pathNames: $.address.pathNames(),
                                parameterNames: parameterNames,
                                parameters: parameters,
                                queryString: $.address.queryString()
                            };
                        }).call($.address)
                    )
                );
            },
            _bind = function(value, data, fn) {
                $($.address).bind(value, data, fn);
                return $.address;
            },
            _supportsState = function() {
                return (_h.pushState && _opts.state !== UNDEFINED);
            },
            _hrefState = function() {
                return ('/' + _l.pathname.replace(new RegExp(_opts.state), '') + 
                    _l.search + (_hrefHash() ? '#' + _hrefHash() : '')).replace(_re, '/');
            },
            _hrefHash = function() {
                var index = _l.href.indexOf('#');
                return index != -1 ? _crawl(_l.href.substr(index + 1), FALSE) : '';
            },
            _href = function() {
                return _supportsState() ? _hrefState() : _hrefHash();
            },
            _window = function() {
                try {
                    return top.document !== UNDEFINED ? top : window;
                } catch (e) { 
                    return window;
                }
            },
            _js = function() {
                return 'javascript';
            },
            _strict = function(value) {
                value = value.toString();
                return (_opts.strict && value.substr(0, 1) != '/' ? '/' : '') + value;
            },
            _crawl = function(value, direction) {
                if (_opts.crawlable && direction) {
                    return (value != '' ? '!' : '') + value;
                }
                return value.replace(/^\!/, '');
            },
            _cssint = function(el, value) {
                return parseInt(el.css(value), 10);
            },
            _search = function(el) {
                var url, s;
                for (var i = 0, l = el.childNodes.length; i < l; i++) {
                    if (el.childNodes[i].src) {
                        url = String(el.childNodes[i].src);
                    }
                    s = _search(el.childNodes[i]);
                    if (s) {
                        url = s;
                    }
                }
                return url;
            },
            _listen = function() {
                if (!_silent) {
                    var hash = _href(),
                        diff = _value != hash;
                    if (_webkit && _version < 523) {
                        if (_length != _h.length) {
                            _length = _h.length;
                            if (_stack[_length - 1] !== UNDEFINED) {
                                _value = _stack[_length - 1];
                            }
                            _update(FALSE);
                        }
                    } else if (diff) {
                        if (_msie && _version < 7) {
                            _l.reload();
                        } else {
                            if (_msie && _version < 8 && _opts.history) {
                                _st(_html, 50);
                            }
                            _value = hash;
                            _update(FALSE);
                        }
                    }
                }
            },
            _update = function(internal) {
                _trigger(CHANGE);
                _trigger(internal ? INTERNAL_CHANGE : EXTERNAL_CHANGE);
                _st(_track, 10);
            },
            _track = function() {
                if (_opts.tracker !== 'null' && _opts.tracker !== null) {
                    var fn = $.isFunction(_opts.tracker) ? _opts.tracker : _t[_opts.tracker],
                        value = (_l.pathname + _l.search + 
                                ($.address && !_supportsState() ? $.address.value() : ''))
                                .replace(/\/\//, '/').replace(/^\/$/, '');
                    if ($.isFunction(fn)) {
                        fn(value);
                    } else if ($.isFunction(_t.urchinTracker)) {
                        _t.urchinTracker(value);
                    } else if (_t.pageTracker !== UNDEFINED && $.isFunction(_t.pageTracker._trackPageview)) {
                        _t.pageTracker._trackPageview(value);
                    } else if (_t._gaq !== UNDEFINED && $.isFunction(_t._gaq.push)) {
                        _t._gaq.push(['_trackPageview', decodeURI(value)]);
                    }
                }
            },
            _html = function() {
                var src = _js() + ':' + FALSE + ';document.open();document.writeln(\'<html><head><title>' + 
                    _d.title.replace('\'', '\\\'') + '</title><script>var ' + ID + ' = "' + encodeURIComponent(_href()) + 
                    (_d.domain != _l.hostname ? '";document.domain="' + _d.domain : '') + 
                    '";</' + 'script></head></html>\');document.close();';
                if (_version < 7) {
                    _frame.src = src;
                } else {
                    _frame.contentWindow.location.replace(src);
                }
            },
            _options = function() {
                if (_url && _qi != -1) {
                    var param, params = _url.substr(_qi + 1).split('&');
                    for (i = 0; i < params.length; i++) {
                        param = params[i].split('=');
                        if (/^(autoUpdate|crawlable|history|strict|wrap)$/.test(param[0])) {
                            _opts[param[0]] = (isNaN(param[1]) ? /^(true|yes)$/i.test(param[1]) : (parseInt(param[1], 10) !== 0));
                        }
                        if (/^(state|tracker)$/.test(param[0])) {
                            _opts[param[0]] = param[1];
                        }
                    }
                    _url = null;
                }
                _value = _href();
            },
            _load = function() {
                if (!_loaded) {
                    _loaded = TRUE;
                    _options();
                    var complete = function() {
                            _enable.call(this);
                            _unescape.call(this);
                        },
                        body = $('body').ajaxComplete(complete);
                    complete();
                    if (_opts.wrap) {
                        var wrap = $('body > *')
                            .wrapAll('<div style="padding:' + 
                                (_cssint(body, 'marginTop') + _cssint(body, 'paddingTop')) + 'px ' + 
                                (_cssint(body, 'marginRight') + _cssint(body, 'paddingRight')) + 'px ' + 
                                (_cssint(body, 'marginBottom') + _cssint(body, 'paddingBottom')) + 'px ' + 
                                (_cssint(body, 'marginLeft') + _cssint(body, 'paddingLeft')) + 'px;" />')
                            .parent()
                            .wrap('<div id="' + ID + '" style="height:100%;overflow:auto;position:relative;' + 
                                (_webkit ? (window.statusbar.visible && !/chrome/i.test(_agent) ? '' : 'resize:both;') : '') + '" />');
                        $('html, body')
                            .css({
                                height: '100%',
                                margin: 0,
                                padding: 0,
                                overflow: 'hidden'
                            });
                        if (_webkit) {
                            $('<style type="text/css" />')
                                .appendTo('head')
                                .text('#' + ID + '::-webkit-resizer { background-color: #fff; }');
                        }
                    }
                    if (_msie && _version < 8) {
                        var frameset = _d.getElementsByTagName('frameset')[0];
                        _frame = _d.createElement((frameset ? '' : 'i') + 'frame');
                        if (frameset) {
                            frameset.insertAdjacentElement('beforeEnd', _frame);
                            frameset[frameset.cols ? 'cols' : 'rows'] += ',0';
                            _frame.noResize = TRUE;
                            _frame.frameBorder = _frame.frameSpacing = 0;
                        } else {
                            _frame.style.display = 'none';
                            _frame.style.width = _frame.style.height = 0;
                            _frame.tabIndex = -1;
                            _d.body.insertAdjacentElement('afterBegin', _frame);
                        }
                        _st(function() {
                            $(_frame).bind('load', function() {
                                var win = _frame.contentWindow;
                                _value = win[ID] !== UNDEFINED ? $.address.decode(win[ID]) : '';
                                if (_value != _href()) {
                                    _update(FALSE);
                                    _l.hash = _crawl(_value, TRUE);
                                }
                            });
                            if (_frame.contentWindow[ID] === UNDEFINED) {
                                _html();
                            }
                        }, 50);
                    } else if (_webkit) {
                        if (_version < 418) {
                            $(_d.body).append('<form id="' + ID + '" style="position:absolute;top:-9999px;" method="get"></form>');
                            _form = _d.getElementById(ID);
                        }
                        if (_l[ID] === UNDEFINED) {
                            _l[ID] = {};
                        }
                        if (_l[ID][_l.pathname] !== UNDEFINED) {
                            _stack = _l[ID][_l.pathname].split(',');
                        }
                    }

                    _st(function() {
                        _trigger('init');
                        _update(FALSE);
                    }, 1);

                    if (!_supportsState()) {
                        if ((_msie && _version > 7) || (!_msie && ('on' + HASH_CHANGE) in _t)) {
                            if (_t.addEventListener) {
                                _t.addEventListener(HASH_CHANGE, _listen, FALSE);
                            } else if (_t.attachEvent) {
                                _t.attachEvent('on' + HASH_CHANGE, _listen);
                            }
                        } else {
                            _si(_listen, 50);
                        }
                    }
                }
            },
            _enable = function() {
                var el, 
                    elements = $('a'), 
                    length = elements.size(),
                    delay = 1,
                    index = -1;
                _st(function() {
                    if (++index != length) {
                        el = $(elements.get(index));
                        if (el.is('[rel*="address:"]')) {
                            el.address();
                        }
                        _st(arguments.callee, delay);
                    }
                }, delay);
            },
            _popstate = function() {
                if (_value != _href()) {
                    _value = _href();
                    _update(FALSE);
                }
            },
            _unload = function() {
                if (_t.removeEventListener) {
                    _t.removeEventListener(HASH_CHANGE, _listen, FALSE);
                } else if (_t.detachEvent) {
                    _t.detachEvent('on' + HASH_CHANGE, _listen);
                }
            },
            _unescape = function() {
                if (_opts.crawlable) {
                    var base = _l.pathname.replace(/\/$/, ''),
                        fragment = '_escaped_fragment_';
                    if ($('body').html().indexOf(fragment) != -1) {
                        $('a[href]:not([href^=http]), a[href*="' + document.domain + '"]').each(function() {
                            var href = $(this).attr('href').replace(/^http:/, '').replace(new RegExp(base + '/?$'), '');
                            if (href == '' || href.indexOf(fragment) != -1) {
                                $(this).attr('href', '#' + $.address.decode(href.replace(new RegExp('/(.*)\\?' + fragment + '=(.*)$'), '!$2')));
                            }
                        });
                    }
                }
            },
            _decode = function(value) {
                return value.replace(/\+/g, ' ');
            }, 
            _encode = function(value) {
                return _ec(_dc(value)).replace(/%20/g, '+');
            }, 
            _path = function(value) {
                return value.split('#')[0].split('?')[0];
            },
            _pathNames = function(value) {
                var path = _path(value),
                    names = path.replace(_re, '/').split('/');
                if (path.substr(0, 1) == '/' || path.length === 0) {
                    names.splice(0, 1);
                }
                if (path.substr(path.length - 1, 1) == '/') {
                    names.splice(names.length - 1, 1);
                }
                return names;
            },
            _queryString = function(value) {
                var arr = value.split('?');
                return arr.slice(1, arr.length).join('?').split('#')[0];
            },
            _parameter = function(name, value) {
                value = _queryString(value);
                if (value) {
                    var params = value.split('&'),
                        r = [];
                    for (i = 0; i < params.length; i++) {
                        var p = params[i].split('=');
                        if (p[0] == name || $.address.decode(p[0]) == name) {
                            r.push(p.slice(1).join('='));
                        }
                    }
                    if (r.length !== 0) {
                        return r.length != 1 ? r : r[0];
                    }
                }
            },
            _parameterNames = function(value) {
                var qs = _queryString(value),
                    names = [];
                if (qs && qs.indexOf('=') != -1) {
                    var params = qs.split('&');
                    for (var i = 0; i < params.length; i++) {
                        var name = params[i].split('=')[0];
                        if ($.inArray(name, names) == -1) {
                            names.push(name);
                        }
                    }
                }
                return names;
            },
            _hash = function(value) {
                var arr = value.split('#');
                return arr.slice(1, arr.length).join('#');
            },
            UNDEFINED,
            ID = 'jQueryAddress',
            STRING = 'string',
            HASH_CHANGE = 'hashchange',
            INIT = 'init',
            CHANGE = 'change',
            INTERNAL_CHANGE = 'internalChange',
            EXTERNAL_CHANGE = 'externalChange',
            TRUE = true,
            FALSE = false,
            _opts = {
                autoUpdate: TRUE, 
                crawlable: FALSE,
                history: TRUE, 
                strict: TRUE,
                wrap: FALSE
            },
            _browser = $.browser, 
            _version = parseFloat($.browser.version),
            _mozilla = _browser.mozilla,
            _msie = _browser.msie,
            _opera = _browser.opera,
            _webkit = _browser.webkit || _browser.safari,
            _supported = FALSE,
            _t = _window(),
            _d = _t.document,
            _h = _t.history, 
            _l = _t.location,
            _si = setInterval,
            _st = setTimeout,
            _ec = encodeURIComponent,
            _dc = decodeURIComponent,
            _re = /\/{2,9}/g,
            _agent = navigator.userAgent,            
            _frame,
            _form,
            _url = _search(document),
            _qi = _url ? _url.indexOf('?') : -1,
            _title = _d.title, 
            _length = _h.length, 
            _silent = FALSE,
            _loaded = FALSE,
            _justset = TRUE,
            _juststart = TRUE,
            _updating = FALSE,
            _stack = [], 
            _listeners = {}, 
            _value = _href();

        if (_msie) {
            _version = parseFloat(_agent.substr(_agent.indexOf('MSIE') + 4));
            if (_d.documentMode && _d.documentMode != _version) {
                _version = _d.documentMode != 8 ? 7 : 8;
            }
            $(document).bind('propertychange', function() {
                if (_d.title != _title && _d.title.indexOf('#' + _href()) != -1) {
                    _d.title = _title;
                }
            });
        }

        _supported = 
            (_mozilla && _version >= 1) || 
            (_msie && _version >= 6) ||
            (_opera && _version >= 9.5) ||
            (_webkit && _version >= 312);

        if (_supported) {
            for (var i = 1; i < _length; i++) {
                _stack.push('');
            }
            _stack.push(_value);
            if (_opera) {
                history.navigationMode = 'compatible';
            }
            if (document.readyState == 'complete') {
                var interval = setInterval(function() {
                    if ($.address) {
                        _load();
                        clearInterval(interval);
                    }
                }, 50);
            } else {
                _options();
                $(_load);
            }
            var hrefState = _hrefState();
            if (_opts.state !== UNDEFINED) {
                if (_h.pushState) {
                    if (hrefState.substr(0, 3) == '/#/') {
                        _l.replace(_opts.state.replace(/^\/$/, '') + hrefState.substr(2));
                    }
                } else if (hrefState != '/' && hrefState.replace(/^\/#/, '') != _hrefHash()) {
                    _l.replace(_opts.state.replace(/^\/$/, '') + '/#' + hrefState);
                }
            }
            $(window).bind({
                'popstate': _popstate,
                'unload': _unload
            });
        } else if ((!_supported && _hrefHash() != '') || 
            (_webkit && _version < 418 && _hrefHash() != '' && _l.search != '')) {
            _l.replace(_l.href.substr(0, _l.href.indexOf('#')));
        } else {
            _track();
        }

        return {
            bind: function(type, data, fn) {
                return _bind(type, data, fn);
            },
            init: function(fn) {
                return _bind(INIT, fn);
            },
            change: function(fn) {
                return _bind(CHANGE, fn);
            },
            internalChange: function(fn) {
                return _bind(INTERNAL_CHANGE, fn);
            },
            externalChange: function(fn) {
                return _bind(EXTERNAL_CHANGE, fn);
            },
            baseURL: function() {
                var url = _l.href;
                if (url.indexOf('#') != -1) {
                    url = url.substr(0, url.indexOf('#'));
                }
                if (/\/$/.test(url)) {
                    url = url.substr(0, url.length - 1);
                }
                return url;
            },
            autoUpdate: function(value) {
                if (value !== UNDEFINED) {
                    _opts.autoUpdate = value;
                    return this;
                }
                return _opts.autoUpdate;
            },
            crawlable: function(value) {
                if (value !== UNDEFINED) {
                    _opts.crawlable = value;
                    return this;
                }
                return _opts.crawlable;
            },
            history: function(value) {
                if (value !== UNDEFINED) {
                    _opts.history = value;
                    return this;
                }
                return _opts.history;
            },
            state: function(value) {
                if (value !== UNDEFINED) {
                    _opts.state = value;
                    return this;
                }
                return _opts.state;
            },
            strict: function(value) {
                if (value !== UNDEFINED) {
                    _opts.strict = value;
                    return this;
                }
                return _opts.strict;
            },
            tracker: function(value) {
                if (value !== UNDEFINED) {
                    _opts.tracker = value;
                    return this;
                }
                return _opts.tracker;
            },
            wrap: function(value) {
                if (value !== UNDEFINED) {
                    _opts.wrap = value;
                    return this;
                }
                return _opts.wrap;
            },
            update: function() {
                _updating = TRUE;
                this.value(_value);
                _updating = FALSE;
                return this;
            },
            encode: function(value) {
                var pathNames = _pathNames(value),
                    parameterNames = _parameterNames(value),
                    queryString = _queryString(value),
                    hash = _hash(value),
                    first = value.substr(0, 1),
                    last = value.substr(value.length - 1),
                    encoded = '';
                $.each(pathNames, function(i, v) {
                    encoded += '/' + _encode(v);
                });
                if (queryString !== '') {
                    encoded += '?';
                    if (parameterNames.length === 0) {
                        encoded += queryString;
                    } else {
                        $.each(parameterNames, function(i, v) {
                            var pv = _parameter(v, value);
                            if (typeof pv !== STRING) {
                                $.each(pv, function(ni, nv) {
                                    encoded += _encode(v) + '=' + _encode(nv) + '&';
                                });
                            } else {
                                encoded += _encode(v) + '=' + _encode(pv) + '&';
                            }
                        });
                        encoded = encoded.substr(0, encoded.length - 1);
                    }
                }
                if (hash !== '') {
                    encoded += '#' + _encode(hash);
                }
                if (first != '/' && encoded.substr(0, 1) == '/') {
                    encoded = encoded.substr(1);
                }
                if (first == '/' && encoded.substr(0, 1) != '/') {
                    encoded = '/' + encoded;
                }
                if (/#|&|\?/.test(last)) {
                    encoded += last;
                }
                return encoded;
            },
            decode: function(value) {
                if (value !== UNDEFINED) {
                    var result = [],
                        replace = function(value) {
                            return _dc(value.toString().replace(/\+/g, '%20'));
                        };
                    if (typeof value == 'object' && value.length !== UNDEFINED) {
                        for (var i = 0, l = value.length; i < l; i++) {
                            result[i] = replace(value[i]);
                        }
                        return result;
                    } else {
                        return replace(value);
                    }
                }
            },
            title: function(value) {
                if (value !== UNDEFINED) {
                    _st(function() {
                        _title = _d.title = value;
                        if (_juststart && _frame && _frame.contentWindow && _frame.contentWindow.document) {
                            _frame.contentWindow.document.title = value;
                            _juststart = FALSE;
                        }
                        if (!_justset && _mozilla) {
                            _l.replace(_l.href.indexOf('#') != -1 ? _l.href : _l.href + '#');
                        }
                        _justset = FALSE;
                    }, 50);
                    return this;
                }
                return _d.title;
            },
            value: function(value) {
                if (value !== UNDEFINED) {
                    value = _strict(value);
                    if (_opts.autoUpdate) {
                        value = this.encode(value);
                    }
                    if (value == '/') {
                        value = '';
                    }
                    if (_value == value && !_updating) {
                        return;
                    }
                    _justset = TRUE;
                    _value = value;
                    if (_opts.autoUpdate || _updating) {
                        _update(TRUE);
                        if (_supportsState()) {
                            _h[_opts.history ? 'pushState' : 'replaceState']({}, '', 
                                    _opts.state.replace(/\/$/, '') + (_value == '' ? '/' : _value));
                        } else {
                            _silent = TRUE;
                            _stack[_h.length] = _value;
                            if (_webkit) {
                                if (_opts.history) {
                                    _l[ID][_l.pathname] = _stack.toString();
                                    _length = _h.length + 1;
                                    if (_version < 418) {
                                        if (_l.search == '') {
                                            _form.action = '#' + _crawl(_value, TRUE);
                                            _form.submit();
                                        }
                                    } else if (_version < 523 || _value == '') {
                                        var evt = _d.createEvent('MouseEvents');
                                        evt.initEvent('click', TRUE, TRUE);
                                        var anchor = _d.createElement('a');
                                        anchor.href = '#' + _crawl(_value, TRUE);
                                        anchor.dispatchEvent(evt);                
                                    } else {
                                        _l.hash = '#' + _crawl(_value, TRUE);
                                    }
                                } else {
                                    _l.replace('#' + _crawl(_value, TRUE));
                                }
                            } else if (_value != _href()) {
                                if (_opts.history) {
                                    _l.hash = '#' + _crawl(this.decode(_strict(_value)), TRUE);
                                } else {
                                    _l.replace('#' + _crawl(_value, TRUE));
                                }
                            }
                            if ((_msie && _version < 8) && _opts.history) {
                                _st(_html, 50);
                            }
                            if (_webkit) {
                                _st(function(){ _silent = FALSE; }, 1);
                            } else {
                                _silent = FALSE;
                            }
                        }
                    }
                    return this;
                }
                if (!_supported) {
                    return null;
                }
                return this.decode(_strict(_value));
            },
            path: function(value) {
                if (value !== UNDEFINED) {
                    var qs = _queryString(_strict(_value)),
                        hash = _hash(_strict(_value));
                    this.value(value + (qs ? '?' + qs : '') + (hash ? '#' + hash : ''));
                    return this;
                }
                return this.decode(_path(_strict(_value)));
            },
            pathNames: function() {
                return this.decode(_pathNames(_strict(_value)));
            },
            queryString: function(value) {
                if (value !== UNDEFINED) {
                    var hash = _hash(_strict(_value));
                    this.value(this.path() + (value ? '?' + value : '') + (hash ? '#' + hash : ''));
                    return this;
                }
                return this.decode(_queryString(_strict(_value)));
            },
            parameter: function(name, value, append) {
                var i, params;
                if (value !== UNDEFINED) {
                    var names = this.parameterNames();
                    params = [];
                    value = value ? _ec(value) : '';
                    for (i = 0; i < names.length; i++) {
                        var n = names[i],
                            v = this.parameter(n);
                        if (typeof v == STRING) {
                            v = [v];
                        }
                        if (n == name) {
                            v = (value === null || value === '') ? [] : 
                                (append ? v.concat([value]) : [value]);
                        }
                        for (var j = 0; j < v.length; j++) {
                            params.push(n + '=' + _decode(_encode(v[j])));
                        }
                    }
                    if ($.inArray(name, names) == -1 && value !== null && value !== '') {
                        params.push(name + '=' + _decode(_encode(value)));
                    }
                    this.queryString(params.join('&'));
                    return this;
                }
                return this.decode(_parameter(name, _strict(_value)));
            },
            parameterNames: function() {
                return this.decode(_parameterNames(_strict(_value)));
            },
            hash: function(value) {
                if (value !== UNDEFINED) {
                    this.value(_strict(_value).split('#')[0] + (value ? '#' + value : ''));
                    return this;
                }
                return this.decode(_hash(_strict(_value)));
            }
        };
    })();

    $.fn.address = function(fn) {
        if (!$(this).attr('address')) {
            var f = function(e) {
                if ($(this).is('a')) {
                    var value = fn ? fn.call(this) : 
                        /address:/.test($(this).attr('rel')) ? $(this).attr('rel').split('address:')[1].split(' ')[0] : 
                        $.address.state() !== undefined && $.address.state() != '/' ? 
                                $(this).attr('href').replace(new RegExp('^(.*' + $.address.state() + '|\\.)'), '') : 
                                $(this).attr('href').replace(/^(#\!?|\.)/, '');
                    $.address.value(value);
                    e.preventDefault();
                }
            };
            $(this).click(f).live('click', f).live('submit', function(e) {
                if ($(this).is('form')) {
                    var action = $(this).attr('action'),
                        value = fn ? fn.call(this) : (action.indexOf('?') != -1 ? action.replace(/&$/, '') : action + '?') + 
                            $.address.decode($(this).serialize());
                    $.address.value(value);
                    e.preventDefault();
                }
            }).attr('address', true);
        }
        return this;
    };

})(jQuery);

/*!	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/

var swfobject = function() {
	
	var UNDEF = "undefined",
		OBJECT = "object",
		SHOCKWAVE_FLASH = "Shockwave Flash",
		SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
		FLASH_MIME_TYPE = "application/x-shockwave-flash",
		EXPRESS_INSTALL_ID = "SWFObjectExprInst",
		ON_READY_STATE_CHANGE = "onreadystatechange",
		
		win = window,
		doc = document,
		nav = navigator,
		
		plugin = false,
		domLoadFnArr = [main],
		regObjArr = [],
		objIdArr = [],
		listenersArr = [],
		storedAltContent,
		storedAltContentId,
		storedCallbackFn,
		storedCallbackObj,
		isDomLoaded = false,
		isExpressInstallActive = false,
		dynamicStylesheet,
		dynamicStylesheetMedia,
		autoHideShow = true,
	
	/* Centralized function for browser feature detection
		- User agent string detection is only used when no good alternative is possible
		- Is executed directly for optimal performance
	*/	
	ua = function() {
		var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
			u = nav.userAgent.toLowerCase(),
			p = nav.platform.toLowerCase(),
			windows = p ? /win/.test(p) : /win/.test(u),
			mac = p ? /mac/.test(p) : /mac/.test(u),
			webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
			ie = !+"\v1", // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
			playerVersion = [0,0,0],
			d = null;
		if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
			d = nav.plugins[SHOCKWAVE_FLASH].description;
			if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
				plugin = true;
				ie = false; // cascaded feature detection for Internet Explorer
				d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
				playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
				playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
				playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
			}
		}
		else if (typeof win.ActiveXObject != UNDEF) {
			try {
				var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
				if (a) { // a will return null when ActiveX is disabled
					d = a.GetVariable("$version");
					if (d) {
						ie = true; // cascaded feature detection for Internet Explorer
						d = d.split(" ")[1].split(",");
						playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
					}
				}
			}
			catch(e) {}
		}
		return { w3:w3cdom, pv:playerVersion, wk:webkit, ie:ie, win:windows, mac:mac };
	}(),
	
	/* Cross-browser onDomLoad
		- Will fire an event as soon as the DOM of a web page is loaded
		- Internet Explorer workaround based on Diego Perini's solution: http://javascript.nwbox.com/IEContentLoaded/
		- Regular onload serves as fallback
	*/ 
	onDomLoad = function() {
		if (!ua.w3) { return; }
		if ((typeof doc.readyState != UNDEF && doc.readyState == "complete") || (typeof doc.readyState == UNDEF && (doc.getElementsByTagName("body")[0] || doc.body))) { // function is fired after onload, e.g. when script is inserted dynamically 
			callDomLoadFunctions();
		}
		if (!isDomLoaded) {
			if (typeof doc.addEventListener != UNDEF) {
				doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
			}		
			if (ua.ie && ua.win) {
				doc.attachEvent(ON_READY_STATE_CHANGE, function() {
					if (doc.readyState == "complete") {
						doc.detachEvent(ON_READY_STATE_CHANGE, arguments.callee);
						callDomLoadFunctions();
					}
				});
				if (win == top) { // if not inside an iframe
					(function(){
						if (isDomLoaded) { return; }
						try {
							doc.documentElement.doScroll("left");
						}
						catch(e) {
							setTimeout(arguments.callee, 0);
							return;
						}
						callDomLoadFunctions();
					})();
				}
			}
			if (ua.wk) {
				(function(){
					if (isDomLoaded) { return; }
					if (!/loaded|complete/.test(doc.readyState)) {
						setTimeout(arguments.callee, 0);
						return;
					}
					callDomLoadFunctions();
				})();
			}
			addLoadEvent(callDomLoadFunctions);
		}
	}();
	
	function callDomLoadFunctions() {
		if (isDomLoaded) { return; }
		try { // test if we can really add/remove elements to/from the DOM; we don't want to fire it too early
			var t = doc.getElementsByTagName("body")[0].appendChild(createElement("span"));
			t.parentNode.removeChild(t);
		}
		catch (e) { return; }
		isDomLoaded = true;
		var dl = domLoadFnArr.length;
		for (var i = 0; i < dl; i++) {
			domLoadFnArr[i]();
		}
	}
	
	function addDomLoadEvent(fn) {
		if (isDomLoaded) {
			fn();
		}
		else { 
			domLoadFnArr[domLoadFnArr.length] = fn; // Array.push() is only available in IE5.5+
		}
	}
	
	/* Cross-browser onload
		- Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
		- Will fire an event as soon as a web page including all of its assets are loaded 
	 */
	function addLoadEvent(fn) {
		if (typeof win.addEventListener != UNDEF) {
			win.addEventListener("load", fn, false);
		}
		else if (typeof doc.addEventListener != UNDEF) {
			doc.addEventListener("load", fn, false);
		}
		else if (typeof win.attachEvent != UNDEF) {
			addListener(win, "onload", fn);
		}
		else if (typeof win.onload == "function") {
			var fnOld = win.onload;
			win.onload = function() {
				fnOld();
				fn();
			};
		}
		else {
			win.onload = fn;
		}
	}
	
	/* Main function
		- Will preferably execute onDomLoad, otherwise onload (as a fallback)
	*/
	function main() { 
		if (plugin) {
			testPlayerVersion();
		}
		else {
			matchVersions();
		}
	}
	
	/* Detect the Flash Player version for non-Internet Explorer browsers
		- Detecting the plug-in version via the object element is more precise than using the plugins collection item's description:
		  a. Both release and build numbers can be detected
		  b. Avoid wrong descriptions by corrupt installers provided by Adobe
		  c. Avoid wrong descriptions by multiple Flash Player entries in the plugin Array, caused by incorrect browser imports
		- Disadvantage of this method is that it depends on the availability of the DOM, while the plugins collection is immediately available
	*/
	function testPlayerVersion() {
		var b = doc.getElementsByTagName("body")[0];
		var o = createElement(OBJECT);
		o.setAttribute("type", FLASH_MIME_TYPE);
		var t = b.appendChild(o);
		if (t) {
			var counter = 0;
			(function(){
				if (typeof t.GetVariable != UNDEF) {
					var d = t.GetVariable("$version");
					if (d) {
						d = d.split(" ")[1].split(",");
						ua.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
					}
				}
				else if (counter < 10) {
					counter++;
					setTimeout(arguments.callee, 10);
					return;
				}
				b.removeChild(o);
				t = null;
				matchVersions();
			})();
		}
		else {
			matchVersions();
		}
	}
	
	/* Perform Flash Player and SWF version matching; static publishing only
	*/
	function matchVersions() {
		var rl = regObjArr.length;
		if (rl > 0) {
			for (var i = 0; i < rl; i++) { // for each registered object element
				var id = regObjArr[i].id;
				var cb = regObjArr[i].callbackFn;
				var cbObj = {success:false, id:id};
				if (ua.pv[0] > 0) {
					var obj = getElementById(id);
					if (obj) {
						if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) { // Flash Player version >= published SWF version: Houston, we have a match!
							setVisibility(id, true);
							if (cb) {
								cbObj.success = true;
								cbObj.ref = getObjectById(id);
								cb(cbObj);
							}
						}
						else if (regObjArr[i].expressInstall && canExpressInstall()) { // show the Adobe Express Install dialog if set by the web page author and if supported
							var att = {};
							att.data = regObjArr[i].expressInstall;
							att.width = obj.getAttribute("width") || "0";
							att.height = obj.getAttribute("height") || "0";
							if (obj.getAttribute("class")) { att.styleclass = obj.getAttribute("class"); }
							if (obj.getAttribute("align")) { att.align = obj.getAttribute("align"); }
							// parse HTML object param element's name-value pairs
							var par = {};
							var p = obj.getElementsByTagName("param");
							var pl = p.length;
							for (var j = 0; j < pl; j++) {
								if (p[j].getAttribute("name").toLowerCase() != "movie") {
									par[p[j].getAttribute("name")] = p[j].getAttribute("value");
								}
							}
							showExpressInstall(att, par, id, cb);
						}
						else { // Flash Player and SWF version mismatch or an older Webkit engine that ignores the HTML object element's nested param elements: display alternative content instead of SWF
							displayAltContent(obj);
							if (cb) { cb(cbObj); }
						}
					}
				}
				else {	// if no Flash Player is installed or the fp version cannot be detected we let the HTML object element do its job (either show a SWF or alternative content)
					setVisibility(id, true);
					if (cb) {
						var o = getObjectById(id); // test whether there is an HTML object element or not
						if (o && typeof o.SetVariable != UNDEF) { 
							cbObj.success = true;
							cbObj.ref = o;
						}
						cb(cbObj);
					}
				}
			}
		}
	}
	
	function getObjectById(objectIdStr) {
		var r = null;
		var o = getElementById(objectIdStr);
		if (o && o.nodeName == "OBJECT") {
			if (typeof o.SetVariable != UNDEF) {
				r = o;
			}
			else {
				var n = o.getElementsByTagName(OBJECT)[0];
				if (n) {
					r = n;
				}
			}
		}
		return r;
	}
	
	/* Requirements for Adobe Express Install
		- only one instance can be active at a time
		- fp 6.0.65 or higher
		- Win/Mac OS only
		- no Webkit engines older than version 312
	*/
	function canExpressInstall() {
		return !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac) && !(ua.wk && ua.wk < 312);
	}
	
	/* Show the Adobe Express Install dialog
		- Reference: http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75
	*/
	function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {
		isExpressInstallActive = true;
		storedCallbackFn = callbackFn || null;
		storedCallbackObj = {success:false, id:replaceElemIdStr};
		var obj = getElementById(replaceElemIdStr);
		if (obj) {
			if (obj.nodeName == "OBJECT") { // static publishing
				storedAltContent = abstractAltContent(obj);
				storedAltContentId = null;
			}
			else { // dynamic publishing
				storedAltContent = obj;
				storedAltContentId = replaceElemIdStr;
			}
			att.id = EXPRESS_INSTALL_ID;
			if (typeof att.width == UNDEF || (!/%$/.test(att.width) && parseInt(att.width, 10) < 310)) { att.width = "310"; }
			if (typeof att.height == UNDEF || (!/%$/.test(att.height) && parseInt(att.height, 10) < 137)) { att.height = "137"; }
			doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
			var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn",
				fv = "MMredirectURL=" + win.location.toString().replace(/&/g,"%26") + "&MMplayerType=" + pt + "&MMdoctitle=" + doc.title;
			if (typeof par.flashvars != UNDEF) {
				par.flashvars += "&" + fv;
			}
			else {
				par.flashvars = fv;
			}
			// IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
			// because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
			if (ua.ie && ua.win && obj.readyState != 4) {
				var newObj = createElement("div");
				replaceElemIdStr += "SWFObjectNew";
				newObj.setAttribute("id", replaceElemIdStr);
				obj.parentNode.insertBefore(newObj, obj); // insert placeholder div that will be replaced by the object element that loads expressinstall.swf
				obj.style.display = "none";
				(function(){
					if (obj.readyState == 4) {
						obj.parentNode.removeChild(obj);
					}
					else {
						setTimeout(arguments.callee, 10);
					}
				})();
			}
			createSWF(att, par, replaceElemIdStr);
		}
	}
	
	/* Functions to abstract and display alternative content
	*/
	function displayAltContent(obj) {
		if (ua.ie && ua.win && obj.readyState != 4) {
			// IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
			// because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
			var el = createElement("div");
			obj.parentNode.insertBefore(el, obj); // insert placeholder div that will be replaced by the alternative content
			el.parentNode.replaceChild(abstractAltContent(obj), el);
			obj.style.display = "none";
			(function(){
				if (obj.readyState == 4) {
					obj.parentNode.removeChild(obj);
				}
				else {
					setTimeout(arguments.callee, 10);
				}
			})();
		}
		else {
			obj.parentNode.replaceChild(abstractAltContent(obj), obj);
		}
	} 

	function abstractAltContent(obj) {
		var ac = createElement("div");
		if (ua.win && ua.ie) {
			ac.innerHTML = obj.innerHTML;
		}
		else {
			var nestedObj = obj.getElementsByTagName(OBJECT)[0];
			if (nestedObj) {
				var c = nestedObj.childNodes;
				if (c) {
					var cl = c.length;
					for (var i = 0; i < cl; i++) {
						if (!(c[i].nodeType == 1 && c[i].nodeName == "PARAM") && !(c[i].nodeType == 8)) {
							ac.appendChild(c[i].cloneNode(true));
						}
					}
				}
			}
		}
		return ac;
	}
	
	/* Cross-browser dynamic SWF creation
	*/
	function createSWF(attObj, parObj, id) {
		var r, el = getElementById(id);
		if (ua.wk && ua.wk < 312) { return r; }
		if (el) {
			if (typeof attObj.id == UNDEF) { // if no 'id' is defined for the object element, it will inherit the 'id' from the alternative content
				attObj.id = id;
			}
			if (ua.ie && ua.win) { // Internet Explorer + the HTML object element + W3C DOM methods do not combine: fall back to outerHTML
				var att = "";
				for (var i in attObj) {
					if (attObj[i] != Object.prototype[i]) { // filter out prototype additions from other potential libraries
						if (i.toLowerCase() == "data") {
							parObj.movie = attObj[i];
						}
						else if (i.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
							att += ' class="' + attObj[i] + '"';
						}
						else if (i.toLowerCase() != "classid") {
							att += ' ' + i + '="' + attObj[i] + '"';
						}
					}
				}
				var par = "";
				for (var j in parObj) {
					if (parObj[j] != Object.prototype[j]) { // filter out prototype additions from other potential libraries
						par += '<param name="' + j + '" value="' + parObj[j] + '" />';
					}
				}
				el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + '>' + par + '</object>';
				objIdArr[objIdArr.length] = attObj.id; // stored to fix object 'leaks' on unload (dynamic publishing only)
				r = getElementById(attObj.id);	
			}
			else { // well-behaving browsers
				var o = createElement(OBJECT);
				o.setAttribute("type", FLASH_MIME_TYPE);
				for (var m in attObj) {
					if (attObj[m] != Object.prototype[m]) { // filter out prototype additions from other potential libraries
						if (m.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
							o.setAttribute("class", attObj[m]);
						}
						else if (m.toLowerCase() != "classid") { // filter out IE specific attribute
							o.setAttribute(m, attObj[m]);
						}
					}
				}
				for (var n in parObj) {
					if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") { // filter out prototype additions from other potential libraries and IE specific param element
						createObjParam(o, n, parObj[n]);
					}
				}
				el.parentNode.replaceChild(o, el);
				r = o;
			}
		}
		return r;
	}
	
	function createObjParam(el, pName, pValue) {
		var p = createElement("param");
		p.setAttribute("name", pName);	
		p.setAttribute("value", pValue);
		el.appendChild(p);
	}
	
	/* Cross-browser SWF removal
		- Especially needed to safely and completely remove a SWF in Internet Explorer
	*/
	function removeSWF(id) {
		var obj = getElementById(id);
		if (obj && obj.nodeName == "OBJECT") {
			if (ua.ie && ua.win) {
				obj.style.display = "none";
				(function(){
					if (obj.readyState == 4) {
						removeObjectInIE(id);
					}
					else {
						setTimeout(arguments.callee, 10);
					}
				})();
			}
			else {
				obj.parentNode.removeChild(obj);
			}
		}
	}
	
	function removeObjectInIE(id) {
		var obj = getElementById(id);
		if (obj) {
			for (var i in obj) {
				if (typeof obj[i] == "function") {
					obj[i] = null;
				}
			}
			obj.parentNode.removeChild(obj);
		}
	}
	
	/* Functions to optimize JavaScript compression
	*/
	function getElementById(id) {
		var el = null;
		try {
			el = doc.getElementById(id);
		}
		catch (e) {}
		return el;
	}
	
	function createElement(el) {
		return doc.createElement(el);
	}
	
	/* Updated attachEvent function for Internet Explorer
		- Stores attachEvent information in an Array, so on unload the detachEvent functions can be called to avoid memory leaks
	*/	
	function addListener(target, eventType, fn) {
		target.attachEvent(eventType, fn);
		listenersArr[listenersArr.length] = [target, eventType, fn];
	}
	
	/* Flash Player and SWF content version matching
	*/
	function hasPlayerVersion(rv) {
		var pv = ua.pv, v = rv.split(".");
		v[0] = parseInt(v[0], 10);
		v[1] = parseInt(v[1], 10) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
		v[2] = parseInt(v[2], 10) || 0;
		return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
	}
	
	/* Cross-browser dynamic CSS creation
		- Based on Bobby van der Sluis' solution: http://www.bobbyvandersluis.com/articles/dynamicCSS.php
	*/	
	function createCSS(sel, decl, media, newStyle) {
		if (ua.ie && ua.mac) { return; }
		var h = doc.getElementsByTagName("head")[0];
		if (!h) { return; } // to also support badly authored HTML pages that lack a head element
		var m = (media && typeof media == "string") ? media : "screen";
		if (newStyle) {
			dynamicStylesheet = null;
			dynamicStylesheetMedia = null;
		}
		if (!dynamicStylesheet || dynamicStylesheetMedia != m) { 
			// create dynamic stylesheet + get a global reference to it
			var s = createElement("style");
			s.setAttribute("type", "text/css");
			s.setAttribute("media", m);
			dynamicStylesheet = h.appendChild(s);
			if (ua.ie && ua.win && typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0) {
				dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
			}
			dynamicStylesheetMedia = m;
		}
		// add style rule
		if (ua.ie && ua.win) {
			if (dynamicStylesheet && typeof dynamicStylesheet.addRule == OBJECT) {
				dynamicStylesheet.addRule(sel, decl);
			}
		}
		else {
			if (dynamicStylesheet && typeof doc.createTextNode != UNDEF) {
				dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
			}
		}
	}
	
	function setVisibility(id, isVisible) {
		if (!autoHideShow) { return; }
		var v = isVisible ? "visible" : "hidden";
		if (isDomLoaded && getElementById(id)) {
			getElementById(id).style.visibility = v;
		}
		else {
			createCSS("#" + id, "visibility:" + v);
		}
	}

	/* Filter to avoid XSS attacks
	*/
	function urlEncodeIfNecessary(s) {
		var regex = /[\\\"<>\.;]/;
		var hasBadChars = regex.exec(s) != null;
		return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s;
	}
	
	/* Release memory to avoid memory leaks caused by closures, fix hanging audio/video threads and force open sockets/NetConnections to disconnect (Internet Explorer only)
	*/
	var cleanup = function() {
		if (ua.ie && ua.win) {
			window.attachEvent("onunload", function() {
				// remove listeners to avoid memory leaks
				var ll = listenersArr.length;
				for (var i = 0; i < ll; i++) {
					listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
				}
				// cleanup dynamically embedded objects to fix audio/video threads and force open sockets and NetConnections to disconnect
				var il = objIdArr.length;
				for (var j = 0; j < il; j++) {
					removeSWF(objIdArr[j]);
				}
				// cleanup library's main closures to avoid memory leaks
				for (var k in ua) {
					ua[k] = null;
				}
				ua = null;
				for (var l in swfobject) {
					swfobject[l] = null;
				}
				swfobject = null;
			});
		}
	}();
	
	return {
		/* Public API
			- Reference: http://code.google.com/p/swfobject/wiki/documentation
		*/ 
		registerObject: function(objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn) {
			if (ua.w3 && objectIdStr && swfVersionStr) {
				var regObj = {};
				regObj.id = objectIdStr;
				regObj.swfVersion = swfVersionStr;
				regObj.expressInstall = xiSwfUrlStr;
				regObj.callbackFn = callbackFn;
				regObjArr[regObjArr.length] = regObj;
				setVisibility(objectIdStr, false);
			}
			else if (callbackFn) {
				callbackFn({success:false, id:objectIdStr});
			}
		},
		
		getObjectById: function(objectIdStr) {
			if (ua.w3) {
				return getObjectById(objectIdStr);
			}
		},
		
		embedSWF: function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn) {
			var callbackObj = {success:false, id:replaceElemIdStr};
			if (ua.w3 && !(ua.wk && ua.wk < 312) && swfUrlStr && replaceElemIdStr && widthStr && heightStr && swfVersionStr) {
				setVisibility(replaceElemIdStr, false);
				addDomLoadEvent(function() {
					widthStr += ""; // auto-convert to string
					heightStr += "";
					var att = {};
					if (attObj && typeof attObj === OBJECT) {
						for (var i in attObj) { // copy object to avoid the use of references, because web authors often reuse attObj for multiple SWFs
							att[i] = attObj[i];
						}
					}
					att.data = swfUrlStr;
					att.width = widthStr;
					att.height = heightStr;
					var par = {}; 
					if (parObj && typeof parObj === OBJECT) {
						for (var j in parObj) { // copy object to avoid the use of references, because web authors often reuse parObj for multiple SWFs
							par[j] = parObj[j];
						}
					}
					if (flashvarsObj && typeof flashvarsObj === OBJECT) {
						for (var k in flashvarsObj) { // copy object to avoid the use of references, because web authors often reuse flashvarsObj for multiple SWFs
							if (typeof par.flashvars != UNDEF) {
								par.flashvars += "&" + k + "=" + flashvarsObj[k];
							}
							else {
								par.flashvars = k + "=" + flashvarsObj[k];
							}
						}
					}
					if (hasPlayerVersion(swfVersionStr)) { // create SWF
						var obj = createSWF(att, par, replaceElemIdStr);
						if (att.id == replaceElemIdStr) {
							setVisibility(replaceElemIdStr, true);
						}
						callbackObj.success = true;
						callbackObj.ref = obj;
					}
					else if (xiSwfUrlStr && canExpressInstall()) { // show Adobe Express Install
						att.data = xiSwfUrlStr;
						showExpressInstall(att, par, replaceElemIdStr, callbackFn);
						return;
					}
					else { // show alternative content
						setVisibility(replaceElemIdStr, true);
					}
					if (callbackFn) { callbackFn(callbackObj); }
				});
			}
			else if (callbackFn) { callbackFn(callbackObj);	}
		},
		
		switchOffAutoHideShow: function() {
			autoHideShow = false;
		},
		
		ua: ua,
		
		getFlashPlayerVersion: function() {
			return { major:ua.pv[0], minor:ua.pv[1], release:ua.pv[2] };
		},
		
		hasFlashPlayerVersion: hasPlayerVersion,
		
		createSWF: function(attObj, parObj, replaceElemIdStr) {
			if (ua.w3) {
				return createSWF(attObj, parObj, replaceElemIdStr);
			}
			else {
				return undefined;
			}
		},
		
		showExpressInstall: function(att, par, replaceElemIdStr, callbackFn) {
			if (ua.w3 && canExpressInstall()) {
				showExpressInstall(att, par, replaceElemIdStr, callbackFn);
			}
		},
		
		removeSWF: function(objElemIdStr) {
			if (ua.w3) {
				removeSWF(objElemIdStr);
			}
		},
		
		createCSS: function(selStr, declStr, mediaStr, newStyleBoolean) {
			if (ua.w3) {
				createCSS(selStr, declStr, mediaStr, newStyleBoolean);
			}
		},
		
		addDomLoadEvent: addDomLoadEvent,
		
		addLoadEvent: addLoadEvent,
		
		getQueryParamValue: function(param) {
			var q = doc.location.search || doc.location.hash;
			if (q) {
				if (/\?/.test(q)) { q = q.split("?")[1]; } // strip question mark
				if (param == null) {
					return urlEncodeIfNecessary(q);
				}
				var pairs = q.split("&");
				for (var i = 0; i < pairs.length; i++) {
					if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
						return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)));
					}
				}
			}
			return "";
		},
		
		// For internal usage only
		expressInstallCallback: function() {
			if (isExpressInstallActive) {
				var obj = getElementById(EXPRESS_INSTALL_ID);
				if (obj && storedAltContent) {
					obj.parentNode.replaceChild(storedAltContent, obj);
					if (storedAltContentId) {
						setVisibility(storedAltContentId, true);
						if (ua.ie && ua.win) { storedAltContent.style.display = "block"; }
					}
					if (storedCallbackFn) { storedCallbackFn(storedCallbackObj); }
				}
				isExpressInstallActive = false;
			} 
		}
	};
}();


/*! Copyright (c) 2009 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * Version: 3.0.2
 * 
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

$.event.special.mousewheel = {
	setup: function() {
		if ( this.addEventListener )
			for ( var i=types.length; i; )
				this.addEventListener( types[--i], handler, false );
		else
			this.onmousewheel = handler;
	},
	
	teardown: function() {
		if ( this.removeEventListener )
			for ( var i=types.length; i; )
				this.removeEventListener( types[--i], handler, false );
		else
			this.onmousewheel = null;
	}
};

$.fn.extend({
	mousewheel: function(fn) {
		return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
	},
	
	unmousewheel: function(fn) {
		return this.unbind("mousewheel", fn);
	}
});


function handler(event) {
	var args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true;
	
	event = $.event.fix(event || window.event);
	event.type = "mousewheel";
	
	if ( event.wheelDelta ) delta = event.wheelDelta/120;
	if ( event.detail     ) delta = -event.detail/3;
	
	// Add events and delta to the front of the arguments
	args.unshift(event, delta);

	return $.event.handle.apply(this, args);
}

})(jQuery);

(function($,sr){
  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;
 
      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null; 
          };
 
          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);
 
          timeout = setTimeout(delayed, threshold || 100); 
      };
  }
	// smartresize 
	jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
 
})(jQuery,'smartresize');

/*
 * Metadata - jQuery plugin for parsing metadata from elements
 *
 * Copyright (c) 2006 John Resig, Yehuda Katz, J�örn Zaefferer, Paul McLanahan
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.metadata.js 3640 2007-10-11 18:34:38Z pmclanahan $
 *
 */

/**
 * Sets the type of metadata to use. Metadata is encoded in JSON, and each property
 * in the JSON will become a property of the element itself.
 *
 * There are four supported types of metadata storage:
 *
 *   attr:  Inside an attribute. The name parameter indicates *which* attribute.
 *          
 *   class: Inside the class attribute, wrapped in curly braces: { }
 *   
 *   elem:  Inside a child element (e.g. a script tag). The
 *          name parameter indicates *which* element.
 *   html5: Values are stored in data-* attributes.
 *          
 * The metadata for an element is loaded the first time the element is accessed via jQuery.
 *
 * As a result, you can define the metadata type, use $(expr) to load the metadata into the elements
 * matched by expr, then redefine the metadata type and run another $(expr) for other elements.
 * 
 * @name $.metadata.setType
 *
 * @example <p id="one" class="some_class {item_id: 1, item_label: 'Label'}">This is a p</p>
 * @before $.metadata.setType("class")
 * @after $("#one").metadata().item_id == 1; $("#one").metadata().item_label == "Label"
 * @desc Reads metadata from the class attribute
 * 
 * @example <p id="one" class="some_class" data="{item_id: 1, item_label: 'Label'}">This is a p</p>
 * @before $.metadata.setType("attr", "data")
 * @after $("#one").metadata().item_id == 1; $("#one").metadata().item_label == "Label"
 * @desc Reads metadata from a "data" attribute
 * 
 * @example <p id="one" class="some_class"><script>{item_id: 1, item_label: 'Label'}</script>This is a p</p>
 * @before $.metadata.setType("elem", "script")
 * @after $("#one").metadata().item_id == 1; $("#one").metadata().item_label == "Label"
 * @desc Reads metadata from a nested script element
 * 
 * @example <p id="one" class="some_class" data-item_id="1" data-item_label="Label">This is a p</p>
 * @before $.metadata.setType("html5")
 * @after $("#one").metadata().item_id == 1; $("#one").metadata().item_label == "Label"
 * @desc Reads metadata from a series of data-* attributes
 *
 * @param String type The encoding type
 * @param String name The name of the attribute to be used to get metadata (optional)
 * @cat Plugins/Metadata
 * @descr Sets the type of encoding to be used when loading metadata for the first time
 * @type undefined
 * @see metadata()
 */

(function($) {

$.extend({
  metadata : {
    defaults : {
      type: 'class',
      name: 'metadata',
      cre: /({.*})/,
      single: 'metadata'
    },
    setType: function( type, name ){
      this.defaults.type = type;
      this.defaults.name = name;
    },
    get: function( elem, opts ){
      var settings = $.extend({},this.defaults,opts);
      // check for empty string in single property
      if ( !settings.single.length ) settings.single = 'metadata';
      
      var data = $.data(elem, settings.single);
      // returned cached data if it already exists
      if ( data ) return data;
      
      data = "{}";
      
      var getData = function(data) {
        if(typeof data != "string") return data;
        
        if( data.indexOf('{') < 0 ) {
          data = eval("(" + data + ")");
        }
      }
      
      var getObject = function(data) {
        if(typeof data != "string") return data;
        
        data = eval("(" + data + ")");
        return data;
      }
      
      if ( settings.type == "html5" ) {
        var object = {};
        $( elem.attributes ).each(function() {
          var name = this.nodeName;
          if(name.match(/^data-/)) name = name.replace(/^data-/, '');
          else return true;
          object[name] = getObject(this.nodeValue);
        });
      } else {
        if ( settings.type == "class" ) {
          var m = settings.cre.exec( elem.className );
          if ( m )
            data = m[1];
        } else if ( settings.type == "elem" ) {
          if( !elem.getElementsByTagName ) return;
          var e = elem.getElementsByTagName(settings.name);
          if ( e.length )
            data = $.trim(e[0].innerHTML);
        } else if ( elem.getAttribute != undefined ) {
          var attr = elem.getAttribute( settings.name );
          if ( attr )
            data = attr;
        }
        object = getObject(data.indexOf("{") < 0 ? "{" + data + "}" : data);
      }
      
      $.data( elem, settings.single, object );
      return object;
    }
  }
});

/**
 * Returns the metadata object for the first member of the jQuery object.
 *
 * @name metadata
 * @descr Returns element's metadata object
 * @param Object opts An object containing settings to override the defaults
 * @type jQuery
 * @cat Plugins/Metadata
 */
$.fn.metadata = function( opts ){
  return $.metadata.get( this[0], opts );
};

})(jQuery);

/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 0.22.0+ Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
/*jslint strict: false, plusplus: false */
/*global window: false, navigator: false, document: false, importScripts: false,
  jQuery: false, clearInterval: false, setInterval: false, self: false,
  setTimeout: false */

var require, define;
(function () {
    //Change this version number for each release.
    var version = "0.22.0+",
        commentRegExp = /(\/\*([\s\S]*?)\*\/|\/\/(.*)$)/mg,
        cjsRequireRegExp = /require\(["']([^'"\s]+)["']\)/g,
        currDirRegExp = /^\.\//,
        jsSuffixRegExp = /\.js$/,
        ostring = Object.prototype.toString,
        ap = Array.prototype,
        aps = ap.slice,
        apsp = ap.splice,
        isBrowser = !!(typeof window !== "undefined" && navigator && document),
        isWebWorker = !isBrowser && typeof importScripts !== "undefined",
        //PS3 indicates loaded and complete, but need to wait for complete
        //specifically. Sequence is "loading", "loaded", execution,
        // then "complete". The UA check is unfortunate, but not sure how
        //to feature test w/o causing perf issues.
        readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
                      /^complete$/ : /^(complete|loaded)$/,
        defContextName = "_",
        reqWaitIdPrefix = "_r@@",
        empty = {},
        contexts = {},
        globalDefQueue = [],
        interactiveScript = null,
        isDone = false,
        useInteractive = false,
        //Default plugins that have remapped names, if no mapping
        //already exists.
        requirePlugins = {
            "text": "require/text",
            "i18n": "require/i18n",
            "order": "require/order"
        },
        req, cfg = {}, currentlyAddingScript, s, head, baseElement, scripts, script,
        src, subPath, mainScript, dataMain, i, scrollIntervalId, setReadyState, ctx;

    function isFunction(it) {
        return ostring.call(it) === "[object Function]";
    }

    function isArray(it) {
        return ostring.call(it) === "[object Array]";
    }

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     * This is not robust in IE for transferring methods that match
     * Object.prototype names, but the uses of mixin here seem unlikely to
     * trigger a problem related to that.
     */
    function mixin(target, source, force) {
        for (var prop in source) {
            if (!(prop in empty) && (!(prop in target) || force)) {
                target[prop] = source[prop];
            }
        }
        return req;
    }

    /**
     * Used to set up package paths from a packagePaths or packages config object.
     * @param {Object} pkgs the object to store the new package config
     * @param {Array} currentPackages an array of packages to configure
     * @param {String} [dir] a prefix dir to use.
     */
    function configurePackageDir(pkgs, currentPackages, dir) {
        var i, location, pkgObj;

        for (i = 0; (pkgObj = currentPackages[i]); i++) {
            pkgObj = typeof pkgObj === "string" ? { name: pkgObj } : pkgObj;
            location = pkgObj.location;

            //Add dir to the path, but avoid paths that start with a slash
            //or have a colon (indicates a protocol)
            if (dir && (!location || (location.indexOf("/") !== 0 && location.indexOf(":") === -1))) {
                location = dir + "/" + (location || pkgObj.name);
            }

            //Create a brand new object on pkgs, since currentPackages can
            //be passed in again, and config.pkgs is the internal transformed
            //state for all package configs.
            pkgs[pkgObj.name] = {
                name: pkgObj.name,
                location: location || pkgObj.name,
                lib: pkgObj.lib || "lib",
                //Remove leading dot in main, so main paths are normalized,
                //and remove any trailing .js, since different package
                //envs have different conventions: some use a module name,
                //some use a file name.
                main: (pkgObj.main || "lib/main")
                      .replace(currDirRegExp, '')
                      .replace(jsSuffixRegExp, '')
            };
        }
    }

    //Check for an existing version of require. If so, then exit out. Only allow
    //one version of require to be active in a page. However, allow for a require
    //config object, just exit quickly if require is an actual function.
    if (typeof require !== "undefined") {
        if (isFunction(require)) {
            return;
        } else {
            //assume it is a config object.
            cfg = require;
        }
    }

    /**
     * Creates a new context for use in require and define calls.
     * Handle most of the heavy lifting. Do not want to use an object
     * with prototype here to avoid using "this" in require, in case it
     * needs to be used in more super secure envs that do not want this.
     * Also there should not be that many contexts in the page. Usually just
     * one for the default context, but could be extra for multiversion cases
     * or if a package needs a special context for a dependency that conflicts
     * with the standard context.
     */
    function newContext(contextName) {
        var context, resume,
            config = {
                waitSeconds: 7,
                baseUrl: s.baseUrl || "./",
                paths: {},
                pkgs: {}
            },
            defQueue = [],
            specified = {
                "require": true,
                "exports": true,
                "module": true
            },
            urlMap = {},
            defined = {},
            loaded = {},
            waiting = {},
            waitAry = [],
            waitIdCounter = 0,
            managerCallbacks = {},
            plugins = {},
            pluginsQueue = {},
            resumeDepth = 0,
            normalizedWaiting = {};

        /**
         * Trims the . and .. from an array of path segments.
         * It will keep a leading path segment if a .. will become
         * the first path segment, to help with module name lookups,
         * which act like paths, but can be remapped. But the end result,
         * all paths that use this function should look normalized.
         * NOTE: this method MODIFIES the input array.
         * @param {Array} ary the array of path segments.
         */
        function trimDots(ary) {
            var i, part;
            for (i = 0; (part = ary[i]); i++) {
                if (part === ".") {
                    ary.splice(i, 1);
                    i -= 1;
                } else if (part === "..") {
                    if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                        //End of the line. Keep at least one non-dot
                        //path segment at the front so it can be mapped
                        //correctly to disk. Otherwise, there is likely
                        //no path mapping for a path starting with '..'.
                        //This can still fail, but catches the most reasonable
                        //uses of ..
                        break;
                    } else if (i > 0) {
                        ary.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
        }

        /**
         * Given a relative module name, like ./something, normalize it to
         * a real name that can be mapped to a path.
         * @param {String} name the relative name
         * @param {String} baseName a real name that the name arg is relative
         * to.
         * @returns {String} normalized name
         */
        function normalize(name, baseName) {
            var pkgName, pkgConfig;

            //Adjust any relative paths.
            if (name.charAt(0) === ".") {
                //If have a base name, try to normalize against it,
                //otherwise, assume it is a top-level require that will
                //be relative to baseUrl in the end.
                if (baseName) {
                    if (config.pkgs[baseName]) {
                        //If the baseName is a package name, then just treat it as one
                        //name to concat the name with.
                        baseName = [baseName];
                    } else {
                        //Convert baseName to array, and lop off the last part,
                        //so that . matches that "directory" and not name of the baseName's
                        //module. For instance, baseName of "one/two/three", maps to
                        //"one/two/three.js", but we want the directory, "one/two" for
                        //this normalization.
                        baseName = baseName.split("/");
                        baseName = baseName.slice(0, baseName.length - 1);
                    }

                    name = baseName.concat(name.split("/"));
                    trimDots(name);

                    //Some use of packages may use a . path to reference the
                    //"main" module name, so normalize for that.
                    pkgConfig = config.pkgs[(pkgName = name[0])];
                    name = name.join("/");
                    if (pkgConfig && name === pkgName + '/' + pkgConfig.main) {
                        name = pkgName;
                    }
                }
            }
            return name;
        }

        /**
         * Creates a module mapping that includes plugin prefix, module
         * name, and path. If parentModuleMap is provided it will
         * also normalize the name via require.normalize()
         *
         * @param {String} name the module name
         * @param {String} [parentModuleMap] parent module map
         * for the module name, used to resolve relative names.
         *
         * @returns {Object}
         */
        function makeModuleMap(name, parentModuleMap) {
            var index = name ? name.indexOf("!") : -1,
                prefix = null,
                parentName = parentModuleMap ? parentModuleMap.name : null,
                originalName = name,
                normalizedName, url, pluginModule;

            if (index !== -1) {
                prefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }

            if (prefix) {
                prefix = normalize(prefix, parentName);
                //Allow simpler mappings for some plugins
                prefix = requirePlugins[prefix] || prefix;
            }

            //Account for relative paths if there is a base name.
            if (name) {
                if (prefix) {
                    pluginModule = defined[prefix];
                    if (pluginModule) {
                        //Plugin is loaded, use its normalize method, otherwise,
                        //normalize name as usual.
                        if (pluginModule.normalize) {
                            normalizedName = pluginModule.normalize(name, function (name) {
                                return normalize(name, parentName);
                            });
                        } else {
                            normalizedName = normalize(name, parentName);
                        }
                    } else {
                        //Plugin is not loaded yet, so do not normalize
                        //the name, wait for plugin to load to see if
                        //it has a normalize method. To avoid possible
                        //ambiguity with relative names loaded from another
                        //plugin, use the parent's name as part of this name.
                        normalizedName = '__$p' + parentName + '@' + name;
                    }
                } else {
                    normalizedName = normalize(name, parentName);
                }

                url = urlMap[normalizedName];
                if (!url) {
                    //Calculate url for the module, if it has a name.
                    if (req.toModuleUrl) {
                        //Special logic required for a particular engine,
                        //like Node.
                        url = req.toModuleUrl(context, name, parentModuleMap);
                    } else {
                        url = context.nameToUrl(name, null, parentModuleMap);
                    }

                    //Store the URL mapping for later.
                    urlMap[normalizedName] = url;
                }
            }

            return {
                prefix: prefix,
                name: normalizedName,
                parentMap: parentModuleMap,
                url: url,
                originalName: originalName,
                fullName: prefix ? prefix + "!" + normalizedName : normalizedName
            };
        }

        /**
         * Determine if priority loading is done. If so clear the priorityWait
         */
        function isPriorityDone() {
            var priorityDone = true,
                priorityWait = config.priorityWait,
                priorityName, i;
            if (priorityWait) {
                for (i = 0; (priorityName = priorityWait[i]); i++) {
                    if (!loaded[priorityName]) {
                        priorityDone = false;
                        break;
                    }
                }
                if (priorityDone) {
                    delete config.priorityWait;
                }
            }
            return priorityDone;
        }

        /**
         * Helper function that creates a setExports function for a "module"
         * CommonJS dependency. Do this here to avoid creating a closure that
         * is part of a loop.
         */
        function makeSetExports(moduleObj) {
            return function (exports) {
                moduleObj.exports = exports;
            };
        }

        function makeContextModuleFunc(func, relModuleMap, enableBuildCallback) {
            return function () {
                //A version of a require function that passes a moduleName
                //value for items that may need to
                //look up paths relative to the moduleName
                var args = [].concat(aps.call(arguments, 0)), lastArg;
                if (enableBuildCallback &&
                    isFunction((lastArg = args[args.length - 1]))) {
                    lastArg.__requireJsBuild = true;
                }
                args.push(relModuleMap);
                return func.apply(null, args);
            };
        }

        /**
         * Helper function that creates a require function object to give to
         * modules that ask for it as a dependency. It needs to be specific
         * per module because of the implication of path mappings that may
         * need to be relative to the module name.
         */
        function makeRequire(relModuleMap, enableBuildCallback) {
            var modRequire = makeContextModuleFunc(context.require, relModuleMap, enableBuildCallback);

            mixin(modRequire, {
                nameToUrl: makeContextModuleFunc(context.nameToUrl, relModuleMap),
                toUrl: makeContextModuleFunc(context.toUrl, relModuleMap),
                isDefined: makeContextModuleFunc(context.isDefined, relModuleMap),
                ready: req.ready,
                isBrowser: req.isBrowser
            });
            //Something used by node.
            if (req.paths) {
                modRequire.paths = req.paths;
            }
            return modRequire;
        }

        /**
         * Used to update the normalized name for plugin-based dependencies
         * after a plugin loads, since it can have its own normalization structure.
         * @param {String} pluginName the normalized plugin module name.
         */
        function updateNormalizedNames(pluginName) {

            var oldFullName, oldModuleMap, moduleMap, fullName, callbacks,
                i, j, k, depArray, existingCallbacks,
                maps = normalizedWaiting[pluginName];

            if (maps) {
                for (i = 0; (oldModuleMap = maps[i]); i++) {
                    oldFullName = oldModuleMap.fullName;
                    moduleMap = makeModuleMap(oldModuleMap.originalName, oldModuleMap.parentMap);
                    fullName = moduleMap.fullName;
                    callbacks = managerCallbacks[oldFullName];
                    existingCallbacks = managerCallbacks[fullName];

                    if (fullName !== oldFullName) {
                        //Update the specified object.
                        delete specified[oldFullName];
                        specified[fullName] = true;

                        //Update managerCallbacks to use the correct normalized name.
                        //If there are already callbacks for the normalized name,
                        //just add to them.
                        if (existingCallbacks) {
                            managerCallbacks[fullName] = existingCallbacks.concat(callbacks);
                        } else {
                            managerCallbacks[fullName] = callbacks;
                        }
                        delete managerCallbacks[oldFullName];

                        //In each manager callback, update the normalized name in the depArray.
                        for (j = 0; j < callbacks.length; j++) {
                            depArray = callbacks[j].depArray;
                            for (k = 0; k < depArray.length; k++) {
                                if (depArray[k] === oldFullName) {
                                    depArray[k] = fullName;
                                }
                            }
                        }
                    }
                }
            }

            delete normalizedWaiting[pluginName];
        }

        /*
         * Queues a dependency for checking after the loader is out of a
         * "paused" state, for example while a script file is being loaded
         * in the browser, where it may have many modules defined in it.
         *
         * depName will be fully qualified, no relative . or .. path.
         */
        function queueDependency(dep) {
            //Make sure to load any plugin and associate the dependency
            //with that plugin.
            var prefix = dep.prefix,
                fullName = dep.fullName;

            //Do not bother if the depName is already in transit
            if (specified[fullName] || fullName in defined) {
                return;
            }

            if (prefix && !plugins[prefix]) {
                //Queue up loading of the dependency, track it
                //via context.plugins. Mark it as a plugin so
                //that the build system will know to treat it
                //special.
                plugins[prefix] = undefined;

                //Remember this dep that needs to have normaliztion done
                //after the plugin loads.
                (normalizedWaiting[prefix] || (normalizedWaiting[prefix] = []))
                    .push(dep);

                //Register an action to do once the plugin loads, to update
                //all managerCallbacks to use a properly normalized module
                //name.
                (managerCallbacks[prefix] ||
                (managerCallbacks[prefix] = [])).push({
                    onDep: function (name, value) {
                        if (name === prefix) {
                            updateNormalizedNames(prefix);
                        }
                    }
                });

                queueDependency(makeModuleMap(prefix));
            }

            context.paused.push(dep);
        }

        function execManager(manager) {
            var i, ret, waitingCallbacks,
                cb = manager.callback,
                fullName = manager.fullName,
                args = [],
                ary = manager.depArray;

            //Call the callback to define the module, if necessary.
            if (cb && isFunction(cb)) {
                //Pull out the defined dependencies and pass the ordered
                //values to the callback.
                if (ary) {
                    for (i = 0; i < ary.length; i++) {
                        args.push(manager.deps[ary[i]]);
                    }
                }

                ret = req.execCb(fullName, manager.callback, args);

                if (fullName) {
                    //If using exports and the function did not return a value,
                    //and the "module" object for this definition function did not
                    //define an exported value, then use the exports object.
                    if (manager.usingExports && ret === undefined && (!manager.cjsModule || !("exports" in manager.cjsModule))) {
                        ret = defined[fullName];
                    } else {
                        if (manager.cjsModule && "exports" in manager.cjsModule) {
                            ret = defined[fullName] = manager.cjsModule.exports;
                        } else {
                            if (fullName in defined && !manager.usingExports) {
                                return req.onError(new Error(fullName + " has already been defined"));
                            }
                            defined[fullName] = ret;
                        }
                    }
                }
            } else if (fullName) {
                //May just be an object definition for the module. Only
                //worry about defining if have a module name.
                ret = defined[fullName] = cb;
            }

            if (fullName) {
                //If anything was waiting for this module to be defined,
                //notify them now.
                waitingCallbacks = managerCallbacks[fullName];
                if (waitingCallbacks) {
                    for (i = 0; i < waitingCallbacks.length; i++) {
                        waitingCallbacks[i].onDep(fullName, ret);
                    }
                    delete managerCallbacks[fullName];
                }
            }

            //Clean up waiting.
            if (waiting[manager.waitId]) {
                delete waiting[manager.waitId];
                manager.isDone = true;
                context.waitCount -= 1;
                if (context.waitCount === 0) {
                    //Clear the wait array used for cycles.
                    waitAry = [];
                }
            }

            return undefined;
        }

        function main(inName, depArray, callback, relModuleMap) {
            var moduleMap = makeModuleMap(inName, relModuleMap),
                name = moduleMap.name,
                fullName = moduleMap.fullName,
                uniques = {},
                manager = {
                    //Use a wait ID because some entries are anon
                    //async require calls.
                    waitId: name || reqWaitIdPrefix + (waitIdCounter++),
                    depCount: 0,
                    depMax: 0,
                    prefix: moduleMap.prefix,
                    name: name,
                    fullName: fullName,
                    deps: {},
                    depArray: depArray,
                    callback: callback,
                    onDep: function (depName, value) {
                        if (!(depName in manager.deps)) {
                            manager.deps[depName] = value;
                            manager.depCount += 1;
                            if (manager.depCount === manager.depMax) {
                                //All done, execute!
                                execManager(manager);
                            }
                        }
                    }
                },
                i, depArg, depName, cjsMod;

            if (fullName) {
                //If module already defined for context, or already loaded,
                //then leave.
                if (fullName in defined || loaded[fullName] === true) {
                    return;
                }

                //Set specified/loaded here for modules that are also loaded
                //as part of a layer, where onScriptLoad is not fired
                //for those cases. Do this after the inline define and
                //dependency tracing is done.
                //Also check if auto-registry of jQuery needs to be skipped.
                specified[fullName] = true;
                loaded[fullName] = true;
                context.jQueryDef = (fullName === "jquery");
            }

            //Add the dependencies to the deps field, and register for callbacks
            //on the dependencies.
            for (i = 0; i < depArray.length; i++) {
                depArg = depArray[i];
                //There could be cases like in IE, where a trailing comma will
                //introduce a null dependency, so only treat a real dependency
                //value as a dependency.
                if (depArg) {
                    //Split the dependency name into plugin and name parts
                    depArg = makeModuleMap(depArg, (name ? moduleMap : relModuleMap));
                    depName = depArg.fullName;

                    //Fix the name in depArray to be just the name, since
                    //that is how it will be called back later.
                    depArray[i] = depName;

                    //Fast path CommonJS standard dependencies.
                    if (depName === "require") {
                        manager.deps[depName] = makeRequire(moduleMap);
                    } else if (depName === "exports") {
                        //CommonJS module spec 1.1
                        manager.deps[depName] = defined[fullName] = {};
                        manager.usingExports = true;
                    } else if (depName === "module") {
                        //CommonJS module spec 1.1
                        manager.cjsModule = cjsMod = manager.deps[depName] = {
                            id: name,
                            uri: name ? context.nameToUrl(name, null, relModuleMap) : undefined
                        };
                        cjsMod.setExports = makeSetExports(cjsMod);
                    } else if (depName in defined && !(depName in waiting)) {
                        //Module already defined, no need to wait for it.
                        manager.deps[depName] = defined[depName];
                    } else if (!uniques[depName]) {

                        //A dynamic dependency.
                        manager.depMax += 1;

                        queueDependency(depArg);

                        //Register to get notification when dependency loads.
                        (managerCallbacks[depName] ||
                        (managerCallbacks[depName] = [])).push(manager);

                        uniques[depName] = true;
                    }
                }
            }

            //Do not bother tracking the manager if it is all done.
            if (manager.depCount === manager.depMax) {
                //All done, execute!
                execManager(manager);
            } else {
                waiting[manager.waitId] = manager;
                waitAry.push(manager);
                context.waitCount += 1;
            }
        }

        /**
         * Convenience method to call main for a require.def call that was put on
         * hold in the defQueue.
         */
        function callDefMain(args) {
            main.apply(null, args);
            //Mark the module loaded. Must do it here in addition
            //to doing it in require.def in case a script does
            //not call require.def
            loaded[args[0]] = true;
        }

        /**
         * As of jQuery 1.4.3, it supports a readyWait property that will hold off
         * calling jQuery ready callbacks until all scripts are loaded. Be sure
         * to track it if readyWait is available. Also, since jQuery 1.4.3 does
         * not register as a module, need to do some global inference checking.
         * Even if it does register as a module, not guaranteed to be the precise
         * name of the global. If a jQuery is tracked for this context, then go
         * ahead and register it as a module too, if not already in process.
         */
        function jQueryCheck(jqCandidate) {
            if (!context.jQuery) {
                var $ = jqCandidate || (typeof jQuery !== "undefined" ? jQuery : null);
                if ($ && "readyWait" in $) {
                    context.jQuery = $;

                    //Manually create a "jquery" module entry if not one already
                    //or in process.
                    callDefMain(["jquery", [], function () {
                        return jQuery;
                    }]);

                    //Increment jQuery readyWait if ncecessary.
                    if (context.scriptCount) {
                        $.readyWait += 1;
                        context.jQueryIncremented = true;
                    }
                }
            }
        }

        function forceExec(manager, traced) {
            if (manager.isDone) {
                return undefined;
            }

            var fullName = manager.fullName,
                depArray = manager.depArray,
                depName, i;
            if (fullName) {
                if (traced[fullName]) {
                    return defined[fullName];
                }

                traced[fullName] = true;
            }

            //forceExec all of its dependencies.
            for (i = 0; i < depArray.length; i++) {
                //Some array members may be null, like if a trailing comma
                //IE, so do the explicit [i] access and check if it has a value.
                depName = depArray[i];
                if (depName) {
                    if (!manager.deps[depName] && waiting[depName]) {
                        manager.onDep(depName, forceExec(waiting[depName], traced));
                    }
                }
            }

            return fullName ? defined[fullName] : undefined;
        }

        /**
         * Checks if all modules for a context are loaded, and if so, evaluates the
         * new ones in right dependency order.
         *
         * @private
         */
        function checkLoaded() {
            var waitInterval = config.waitSeconds * 1000,
                //It is possible to disable the wait interval by using waitSeconds of 0.
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                noLoads = "", hasLoadedProp = false, stillLoading = false, prop,
                err, manager;

            //If there are items still in the paused queue processing wait.
            //This is particularly important in the sync case where each paused
            //item is processed right away but there may be more waiting.
            if (context.pausedCount > 0) {
                return undefined;
            }

            //Determine if priority loading is done. If so clear the priority. If
            //not, then do not check
            if (config.priorityWait) {
                if (isPriorityDone()) {
                    //Call resume, since it could have
                    //some waiting dependencies to trace.
                    resume();
                } else {
                    return undefined;
                }
            }

            //See if anything is still in flight.
            for (prop in loaded) {
                if (!(prop in empty)) {
                    hasLoadedProp = true;
                    if (!loaded[prop]) {
                        if (expired) {
                            noLoads += prop + " ";
                        } else {
                            stillLoading = true;
                            break;
                        }
                    }
                }
            }

            //Check for exit conditions.
            if (!hasLoadedProp && !context.waitCount) {
                //If the loaded object had no items, then the rest of
                //the work below does not need to be done.
                return undefined;
            }
            if (expired && noLoads) {
                //If wait time expired, throw error of unloaded modules.
                err = new Error("require.js load timeout for modules: " + noLoads);
                err.requireType = "timeout";
                err.requireModules = noLoads;
                return req.onError(err);
            }
            if (stillLoading || context.scriptCount) {
                //Something is still waiting to load. Wait for it.
                if (isBrowser || isWebWorker) {
                    setTimeout(checkLoaded, 50);
                }
                return undefined;
            }

            //If still have items in the waiting cue, but all modules have
            //been loaded, then it means there are some circular dependencies
            //that need to be broken.
            //However, as a waiting thing is fired, then it can add items to
            //the waiting cue, and those items should not be fired yet, so
            //make sure to redo the checkLoaded call after breaking a single
            //cycle, if nothing else loaded then this logic will pick it up
            //again.
            if (context.waitCount) {
                //Cycle through the waitAry, and call items in sequence.
                for (i = 0; (manager = waitAry[i]); i++) {
                    forceExec(manager, {});
                }

                checkLoaded();
                return undefined;
            }

            //Check for DOM ready, and nothing is waiting across contexts.
            req.checkReadyState();

            return undefined;
        }

        function callPlugin(pluginName, dep) {
            var name = dep.name,
                fullName = dep.fullName;

            //Do not bother if plugin is already defined or being loaded.
            if (fullName in defined || fullName in loaded) {
                return;
            }

            if (!plugins[pluginName]) {
                plugins[pluginName] = defined[pluginName];
            }

            //Only set loaded to false for tracking if it has not already been set.
            if (!loaded[fullName]) {
                loaded[fullName] = false;
            }

            //Use parentName here since the plugin's name is not reliable,
            //could be some weird string with no path that actually wants to
            //reference the parentName's path.
            plugins[pluginName].load(name, makeRequire(dep.parentMap, true), function (ret) {
                //Allow the build process to register plugin-loaded dependencies.
                if (require.onPluginLoad) {
                    require.onPluginLoad(context, pluginName, name, ret);
                }

                execManager({
                    prefix: dep.prefix,
                    name: dep.name,
                    fullName: dep.fullName,
                    callback: function () {
                        return ret;
                    }
                });
                loaded[fullName] = true;
            }, config);
        }

        function loadPaused(dep) {
            //Renormalize dependency if its name was waiting on a plugin
            //to load, which as since loaded.
            if (dep.prefix && dep.name.indexOf('__$p') === 0 && defined[dep.prefix]) {
                dep = makeModuleMap(dep.originalName, dep.parentMap);
            }

            var pluginName = dep.prefix,
                fullName = dep.fullName;

            //Do not bother if the dependency has already been specified.
            if (specified[fullName] || fullName in defined) {
                return;
            } else {
                specified[fullName] = true;
            }

            if (pluginName) {
                //If plugin not loaded, wait for it.
                //set up callback list. if no list, then register
                //managerCallback for that plugin.
                if (defined[pluginName]) {
                    callPlugin(pluginName, dep);
                } else {
                    if (!pluginsQueue[pluginName]) {
                        pluginsQueue[pluginName] = [];
                        (managerCallbacks[pluginName] ||
                        (managerCallbacks[pluginName] = [])).push({
                            onDep: function (name, value) {
                                if (name === pluginName) {
                                    var i, oldModuleMap, ary = pluginsQueue[pluginName];

                                    //Now update all queued plugin actions.
                                    for (i = 0; i < ary.length; i++) {
                                        oldModuleMap = ary[i];
                                        //Update the moduleMap since the
                                        //module name may be normalized
                                        //differently now.
                                        callPlugin(pluginName,
                                                   makeModuleMap(oldModuleMap.originalName, oldModuleMap.parentMap));
                                    }
                                    delete pluginsQueue[pluginName];
                                }
                            }
                        });
                    }
                    pluginsQueue[pluginName].push(dep);
                }
            } else {
                req.load(context, fullName, dep.url);
            }
        }

        /**
         * Resumes tracing of dependencies and then checks if everything is loaded.
         */
        resume = function () {
            var args, i, p;

            resumeDepth += 1;

            if (context.scriptCount <= 0) {
                //Synchronous envs will push the number below zero with the
                //decrement above, be sure to set it back to zero for good measure.
                //require() calls that also do not end up loading scripts could
                //push the number negative too.
                context.scriptCount = 0;
            }

            //Make sure any remaining defQueue items get properly processed.
            while (defQueue.length) {
                args = defQueue.shift();
                if (args[0] === null) {
                    return req.onError(new Error('Mismatched anonymous require.def modules'));
                } else {
                    callDefMain(args);
                }
            }

            //Skip the resume if current context is in priority wait.
            if (config.priorityWait && !isPriorityDone()) {
                return undefined;
            }

            while (context.paused.length) {
                p = context.paused;
                context.pausedCount += p.length;
                //Reset paused list
                context.paused = [];

                for (i = 0; (args = p[i]); i++) {
                    loadPaused(args);
                }
                //Move the start time for timeout forward.
                context.startTime = (new Date()).getTime();
                context.pausedCount -= p.length;
            }

            //Only check if loaded when resume depth is 1. It is likely that
            //it is only greater than 1 in sync environments where a factory
            //function also then calls the callback-style require. In those
            //cases, the checkLoaded should not occur until the resume
            //depth is back at the top level.
            if (resumeDepth === 1) {
                checkLoaded();
            }

            resumeDepth -= 1;

            return undefined;
        };

        //Define the context object. Many of these fields are on here
        //just to make debugging easier.
        context = {
            contextName: contextName,
            config: config,
            defQueue: defQueue,
            waiting: waiting,
            waitCount: 0,
            specified: specified,
            loaded: loaded,
            urlMap: urlMap,
            scriptCount: 0,
            urlFetched: {},
            defined: defined,
            paused: [],
            pausedCount: 0,
            plugins: plugins,
            managerCallbacks: managerCallbacks,
            makeModuleMap: makeModuleMap,
            normalize: normalize,
            /**
             * Set a configuration for the context.
             * @param {Object} cfg config object to integrate.
             */
            configure: function (cfg) {
                var paths, prop, packages, pkgs, packagePaths, requireWait;

                //Make sure the baseUrl ends in a slash.
                if (cfg.baseUrl) {
                    if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== "/") {
                        cfg.baseUrl += "/";
                    }
                }

                //Save off the paths and packages since they require special processing,
                //they are additive.
                paths = config.paths;
                packages = config.packages;
                pkgs = config.pkgs;

                //Mix in the config values, favoring the new values over
                //existing ones in context.config.
                mixin(config, cfg, true);

                //Adjust paths if necessary.
                if (cfg.paths) {
                    for (prop in cfg.paths) {
                        if (!(prop in empty)) {
                            paths[prop] = cfg.paths[prop];
                        }
                    }
                    config.paths = paths;
                }

                packagePaths = cfg.packagePaths;
                if (packagePaths || cfg.packages) {
                    //Convert packagePaths into a packages config.
                    if (packagePaths) {
                        for (prop in packagePaths) {
                            if (!(prop in empty)) {
                                configurePackageDir(pkgs, packagePaths[prop], prop);
                            }
                        }
                    }

                    //Adjust packages if necessary.
                    if (cfg.packages) {
                        configurePackageDir(pkgs, cfg.packages);
                    }

                    //Done with modifications, assing packages back to context config
                    config.pkgs = pkgs;
                }

                //If priority loading is in effect, trigger the loads now
                if (cfg.priority) {
                    //Create a separate config property that can be
                    //easily tested for config priority completion.
                    //Do this instead of wiping out the config.priority
                    //in case it needs to be inspected for debug purposes later.
                    //Hold on to requireWait value, and reset it after done
                    requireWait = context.requireWait;
                    context.requireWait = false;
                    context.require(cfg.priority);
                    //Trigger a resume right away, for the case when
                    //the script with the priority load is done as part
                    //of a data-main call. In that case the normal resume
                    //call will not happen because the scriptCount will be
                    //at 1, since the script for data-main is being processed.
                    resume();
                    //Restore previous state.
                    context.requireWait = requireWait;
                    config.priorityWait = cfg.priority;
                }

                //If a deps array or a config callback is specified, then call
                //require with those args. This is useful when require is defined as a
                //config object before require.js is loaded.
                if (cfg.deps || cfg.callback) {
                    context.require(cfg.deps || [], cfg.callback);
                }

                //Set up ready callback, if asked. Useful when require is defined as a
                //config object before require.js is loaded.
                if (cfg.ready) {
                    req.ready(cfg.ready);
                }
            },

            isDefined: function (moduleName, relModuleMap) {
                return makeModuleMap(moduleName, relModuleMap).fullName in defined;
            },

            require: function (deps, callback, relModuleMap) {
                var moduleName, ret, moduleMap;
                if (typeof deps === "string") {
                    //Synchronous access to one module. If require.get is
                    //available (as in the Node adapter), prefer that.
                    //In this case deps is the moduleName and callback is
                    //the relModuleMap
                    if (req.get) {
                        return req.get(context, deps, callback);
                    }

                    //Just return the module wanted. In this scenario, the
                    //second arg (if passed) is just the relModuleMap.
                    moduleName = deps;
                    relModuleMap = callback;

                    //Normalize module name, if it contains . or ..
                    moduleMap = makeModuleMap(moduleName, relModuleMap);

                    ret = defined[moduleMap.fullName];
                    if (ret === undefined) {
                        return req.onError(new Error("require: module name '" +
                                    moduleMap.fullName +
                                    "' has not been loaded yet for context: " +
                                    contextName));
                    }
                    return ret;
                }

                main(null, deps, callback, relModuleMap);

                //If the require call does not trigger anything new to load,
                //then resume the dependency processing.
                if (!context.requireWait) {
                    while (!context.scriptCount && context.paused.length) {
                        resume();
                    }
                }
                return undefined;
            },

            /**
             * Internal method to transfer globalQueue items to this context's
             * defQueue.
             */
            takeGlobalQueue: function () {
                //Push all the globalDefQueue items into the context's defQueue
                if (globalDefQueue.length) {
                    //Array splice in the values since the context code has a
                    //local var ref to defQueue, so cannot just reassign the one
                    //on context.
                    apsp.apply(context.defQueue,
                               [context.defQueue.length - 1, 0].concat(globalDefQueue));
                    globalDefQueue = [];
                }
            },

            /**
             * Internal method used by environment adapters to complete a load event.
             * A load event could be a script load or just a load pass from a synchronous
             * load call.
             * @param {String} moduleName the name of the module to potentially complete.
             */
            completeLoad: function (moduleName) {
                var args;

                context.takeGlobalQueue();

                while (defQueue.length) {
                    args = defQueue.shift();

                    if (args[0] === null) {
                        args[0] = moduleName;
                        break;
                    } else if (args[0] === moduleName) {
                        //Found matching require.def call for this script!
                        break;
                    } else {
                        //Some other named require.def call, most likely the result
                        //of a build layer that included many require.def calls.
                        callDefMain(args);
                        args = null;
                    }
                }
                if (args) {
                    callDefMain(args);
                } else {
                    //A script that does not call define(), so just simulate
                    //the call for it. Special exception for jQuery dynamic load.
                    callDefMain([moduleName, [],
                                moduleName === "jquery" && typeof jQuery !== "undefined" ?
                                function () {
                                    return jQuery;
                                } : null]);
                }

                //Mark the script as loaded. Note that this can be different from a
                //moduleName that maps to a require.def call. This line is important
                //for traditional browser scripts.
                loaded[moduleName] = true;

                //If a global jQuery is defined, check for it. Need to do it here
                //instead of main() since stock jQuery does not register as
                //a module via define.
                jQueryCheck();

                //Doing this scriptCount decrement branching because sync envs
                //need to decrement after resume, otherwise it looks like
                //loading is complete after the first dependency is fetched.
                //For browsers, it works fine to decrement after, but it means
                //the checkLoaded setTimeout 50 ms cost is taken. To avoid
                //that cost, decrement beforehand.
                if (req.isAsync) {
                    context.scriptCount -= 1;
                }
                resume();
                if (!req.isAsync) {
                    context.scriptCount -= 1;
                }
            },

            /**
             * Converts a module name + .extension into an URL path.
             * *Requires* the use of a module name. It does not support using
             * plain URLs like nameToUrl.
             */
            toUrl: function (moduleNamePlusExt, relModuleMap) {
                var index = moduleNamePlusExt.lastIndexOf("."),
                    ext = null;

                if (index !== -1) {
                    ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
                    moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
                }

                return context.nameToUrl(moduleNamePlusExt, ext, relModuleMap);
            },

            /**
             * Converts a module name to a file path. Supports cases where
             * moduleName may actually be just an URL.
             */
            nameToUrl: function (moduleName, ext, relModuleMap) {
                var paths, pkgs, pkg, pkgPath, syms, i, parentModule, url,
                    config = context.config;

                if (moduleName.indexOf("./") === 0 || moduleName.indexOf("../") === 0) {
                    //A relative ID, just map it relative to relModuleMap's url
                    syms = relModuleMap && relModuleMap.url ? relModuleMap.url.split('/') : [];
                    //Pop off the file name.
                    if (syms.length) {
                        syms.pop();
                    }
                    syms = syms.concat(moduleName.split('/'));
                    trimDots(syms);
                    url = syms.join('/') +
                          (ext ? ext :
                          (req.jsExtRegExp.test(moduleName) ? "" : ".js"));
                } else {

                    //Normalize module name if have a base relative module name to work from.
                    moduleName = normalize(moduleName, relModuleMap);

                    //If a colon is in the URL, it indicates a protocol is used and it is just
                    //an URL to a file, or if it starts with a slash or ends with .js, it is just a plain file.
                    //The slash is important for protocol-less URLs as well as full paths.
                    if (req.jsExtRegExp.test(moduleName)) {
                        //Just a plain path, not module name lookup, so just return it.
                        //Add extension if it is included. This is a bit wonky, only non-.js things pass
                        //an extension, this method probably needs to be reworked.
                        url = moduleName + (ext ? ext : "");
                    } else {
                        //A module that needs to be converted to a path.
                        paths = config.paths;
                        pkgs = config.pkgs;

                        syms = moduleName.split("/");
                        //For each module name segment, see if there is a path
                        //registered for it. Start with most specific name
                        //and work up from it.
                        for (i = syms.length; i > 0; i--) {
                            parentModule = syms.slice(0, i).join("/");
                            if (paths[parentModule]) {
                                syms.splice(0, i, paths[parentModule]);
                                break;
                            } else if ((pkg = pkgs[parentModule])) {
                                //If module name is just the package name, then looking
                                //for the main module.
                                if (moduleName === pkg.name) {
                                    pkgPath = pkg.location + '/' + pkg.main;
                                } else {
                                    pkgPath = pkg.location + '/' + pkg.lib;
                                }
                                syms.splice(0, i, pkgPath);
                                break;
                            }
                        }

                        //Join the path parts together, then figure out if baseUrl is needed.
                        url = syms.join("/") + (ext || ".js");
                        url = (url.charAt(0) === '/' || url.match(/^\w+:/) ? "" : config.baseUrl) + url;
                    }
                }

                return config.urlArgs ? url +
                                        ((url.indexOf('?') === -1 ? '?' : '&') +
                                         config.urlArgs) : url;
            }
        };

        //Make these visible on the context so can be called at the very
        //end of the file to bootstrap
        context.jQueryCheck = jQueryCheck;
        context.resume = resume;

        return context;
    }

    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     *
     * Make a local req variable to help Caja compliance (it assumes things
     * on a require that are not standardized), and to give a short
     * name for minification/local scope use.
     */
    req = require = function (deps, callback) {

        //Find the right context, use default
        var contextName = defContextName,
            context, config;

        // Determine if have config object in the call.
        if (!isArray(deps) && typeof deps !== "string") {
            // deps is a config object
            config = deps;
            if (isArray(callback)) {
                // Adjust args if there are dependencies
                deps = callback;
                callback = arguments[2];
            } else {
                deps = [];
            }
        }

        if (config && config.context) {
            contextName = config.context;
        }

        context = contexts[contextName] ||
                  (contexts[contextName] = newContext(contextName));

        if (config) {
            context.configure(config);
        }

        return context.require(deps, callback);
    };

    req.version = version;
    req.isArray = isArray;
    req.isFunction = isFunction;
    req.mixin = mixin;
    //Used to filter out dependencies that are already paths.
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    s = req.s = {
        contexts: contexts,
        //Stores a list of URLs that should not get async script tag treatment.
        skipAsync: {},
        isPageLoaded: !isBrowser,
        readyCalls: []
    };

    req.isAsync = req.isBrowser = isBrowser;
    if (isBrowser) {
        head = s.head = document.getElementsByTagName("head")[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName("base")[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode;
        }
    }

    /**
     * Any errors that require explicitly generates will be passed to this
     * function. Intercept/override it if you want custom error handling.
     * @param {Error} err the error object.
     */
    req.onError = function (err) {
        throw err;
    };

    /**
     * Does the request to load a module for the browser case.
     * Make this a separate function to allow other environments
     * to override it.
     *
     * @param {Object} context the require context to find state.
     * @param {String} moduleName the name of the module.
     * @param {Object} url the URL to the module.
     */
    req.load = function (context, moduleName, url) {
        var contextName = context.contextName,
            urlFetched = context.urlFetched,
            loaded = context.loaded;
        isDone = false;

        //Only set loaded to false for tracking if it has not already been set.
        if (!loaded[moduleName]) {
            loaded[moduleName] = false;
        }

        if (!urlFetched[url]) {
            context.scriptCount += 1;
            req.attach(url, contextName, moduleName);
            urlFetched[url] = true;

            //If tracking a jQuery, then make sure its readyWait
            //is incremented to prevent its ready callbacks from
            //triggering too soon.
            if (context.jQuery && !context.jQueryIncremented) {
                context.jQuery.readyWait += 1;
                context.jQueryIncremented = true;
            }
        }
    };

    function getInteractiveScript() {
        var scripts, i, script;
        if (interactiveScript && interactiveScript.readyState === 'interactive') {
            return interactiveScript;
        }

        scripts = document.getElementsByTagName('script');
        for (i = scripts.length - 1; i > -1 && (script = scripts[i]); i--) {
            if (script.readyState === 'interactive') {
                return (interactiveScript = script);
            }
        }

        return null;
    }

    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    define = req.def = function (name, deps, callback) {
        var node, context;

        //Allow for anonymous functions
        if (typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
        }

        //This module may not have dependencies
        if (!req.isArray(deps)) {
            callback = deps;
            deps = [];
        }

        //If no name, and callback is a function, then figure out if it a
        //CommonJS thing with dependencies.
        if (!name && !deps.length && req.isFunction(callback)) {
            //Remove comments from the callback string,
            //look for require calls, and pull them into the dependencies,
            //but only if there are function args.
            if (callback.length) {
                callback
                    .toString()
                    .replace(commentRegExp, "")
                    .replace(cjsRequireRegExp, function (match, dep) {
                        deps.push(dep);
                    });

                //May be a CommonJS thing even without require calls, but still
                //could use exports, and such, so always add those as dependencies.
                //This is a bit wasteful for RequireJS modules that do not need
                //an exports or module object, but erring on side of safety.
                //REQUIRES the function to expect the CommonJS variables in the
                //order listed below.
                deps = ["require", "exports", "module"].concat(deps);
            }
        }

        //If in IE 6-8 and hit an anonymous define() call, do the interactive
        //work.
        if (useInteractive) {
            node = currentlyAddingScript || getInteractiveScript();
            if (!node) {
                return req.onError(new Error("ERROR: No matching script interactive for " + callback));
            }
            if (!name) {
                name = node.getAttribute("data-requiremodule");
            }
            context = contexts[node.getAttribute("data-requirecontext")];
        }

        //Always save off evaluating the def call until the script onload handler.
        //This allows multiple modules to be in a file without prematurely
        //tracing dependencies, and allows for anonymous module support,
        //where the module name is not known until the script onload event
        //occurs. If no context, use the global queue, and get it processed
        //in the onscript load callback.
        (context ? context.defQueue : globalDefQueue).push([name, deps, callback]);

        return undefined;
    };

    define.amd = {
        multiversion: true,
        plugins: true
    };

    /**
     * Executes a module callack function. Broken out as a separate function
     * solely to allow the build system to sequence the files in the built
     * layer in the right sequence.
     *
     * @private
     */
    req.execCb = function (name, callback, args) {
        return callback.apply(null, args);
    };

    /**
     * callback for script loads, used to check status of loading.
     *
     * @param {Event} evt the event from the browser for the script
     * that was loaded.
     *
     * @private
     */
    req.onScriptLoad = function (evt) {
        //Using currentTarget instead of target for Firefox 2.0's sake. Not
        //all old browsers will be supported, but this one was easy enough
        //to support and still makes sense.
        var node = evt.currentTarget || evt.srcElement, contextName, moduleName,
            context;

        if (evt.type === "load" || readyRegExp.test(node.readyState)) {
            //Reset interactive script so a script node is not held onto for
            //to long.
            interactiveScript = null;

            //Pull out the name of the module and the context.
            contextName = node.getAttribute("data-requirecontext");
            moduleName = node.getAttribute("data-requiremodule");
            context = contexts[contextName];

            contexts[contextName].completeLoad(moduleName);

            //Clean up script binding.
            if (node.removeEventListener) {
                node.removeEventListener("load", req.onScriptLoad, false);
            } else {
                //Probably IE. If not it will throw an error, which will be
                //useful to know.
                node.detachEvent("onreadystatechange", req.onScriptLoad);
            }
        }
    };

    /**
     * Attaches the script represented by the URL to the current
     * environment. Right now only supports browser loading,
     * but can be redefined in other environments to do the right thing.
     * @param {String} url the url of the script to attach.
     * @param {String} contextName the name of the context that wants the script.
     * @param {moduleName} the name of the module that is associated with the script.
     * @param {Function} [callback] optional callback, defaults to require.onScriptLoad
     * @param {String} [type] optional type, defaults to text/javascript
     */
    req.attach = function (url, contextName, moduleName, callback, type) {
        var node, loaded, context;
        if (isBrowser) {
            //In the browser so use a script tag
            callback = callback || req.onScriptLoad;
            node = document.createElement("script");
            node.type = type || "text/javascript";
            node.charset = "utf-8";
            //Use async so Gecko does not block on executing the script if something
            //like a long-polling comet tag is being run first. Gecko likes
            //to evaluate scripts in DOM order, even for dynamic scripts.
            //It will fetch them async, but only evaluate the contents in DOM
            //order, so a long-polling script tag can delay execution of scripts
            //after it. But telling Gecko we expect async gets us the behavior
            //we want -- execute it whenever it is finished downloading. Only
            //Helps Firefox 3.6+
            //Allow some URLs to not be fetched async. Mostly helps the order!
            //plugin
            node.async = !s.skipAsync[url];

            node.setAttribute("data-requirecontext", contextName);
            node.setAttribute("data-requiremodule", moduleName);

            //Set up load listener.
            if (node.addEventListener) {
                node.addEventListener("load", callback, false);
            } else {
                //Probably IE. If not it will throw an error, which will be
                //useful to know. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous require.def call to a name.
                //However, IE reports the script as being in "interactive"
                //readyState at the time of the require.def call.
                useInteractive = true;
                node.attachEvent("onreadystatechange", callback);
            }
            node.src = url;

            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous require.def
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = node;
            if (baseElement) {
                head.insertBefore(node, baseElement);
            } else {
                head.appendChild(node);
            }
            currentlyAddingScript = null;
            return node;
        } else if (isWebWorker) {
            //In a web worker, use importScripts. This is not a very
            //efficient use of importScripts, importScripts will block until
            //its script is downloaded and evaluated. However, if web workers
            //are in play, the expectation that a build has been done so that
            //only one script needs to be loaded anyway. This may need to be
            //reevaluated if other use cases become common.
            context = contexts[contextName];
            loaded = context.loaded;
            loaded[moduleName] = false;

            importScripts(url);

            //Account for anonymous modules
            context.completeLoad(moduleName);
        }
        return null;
    };

    //Look for a data-main script attribute, which could also adjust the baseUrl.
    if (isBrowser) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        scripts = document.getElementsByTagName("script");

        for (i = scripts.length - 1; i > -1 && (script = scripts[i]); i--) {
            //Set the "head" where we can append children by
            //using the script's parent.
            if (!head) {
                head = script.parentNode;
            }

            //Look for a data-main attribute to set main script for the page
            //to load. If it is there, the path to data main becomes the
            //baseUrl, if it is not already set.
            if ((dataMain = script.getAttribute('data-main'))) {
                if (!cfg.baseUrl) {
                    //Pull off the directory of data-main for use as the
                    //baseUrl.
                    src = dataMain.split('/');
                    mainScript = src.pop();
                    subPath = src.length ? src.join('/')  + '/' : './';

                    //Set final config.
                    cfg.baseUrl = subPath;
                    //Strip off any trailing .js since dataMain is now
                    //like a module name.
                    dataMain = mainScript.replace(jsSuffixRegExp, '');
                }

                //Put the data-main script in the files to load.
                cfg.deps = cfg.deps ? cfg.deps.concat(dataMain) : [dataMain];

                break;
            }
        }
    }

    //Set baseUrl based on config.
    s.baseUrl = cfg.baseUrl;

    //****** START page load functionality ****************
    /**
     * Sets the page as loaded and triggers check for all modules loaded.
     */
    req.pageLoaded = function () {
        if (!s.isPageLoaded) {
            s.isPageLoaded = true;
            if (scrollIntervalId) {
                clearInterval(scrollIntervalId);
            }

            //Part of a fix for FF < 3.6 where readyState was not set to
            //complete so libraries like jQuery that check for readyState
            //after page load where not getting initialized correctly.
            //Original approach suggested by Andrea Giammarchi:
            //http://webreflection.blogspot.com/2009/11/195-chars-to-help-lazy-loading.html
            //see other setReadyState reference for the rest of the fix.
            if (setReadyState) {
                document.readyState = "complete";
            }

            req.callReady();
        }
    };

    //See if there is nothing waiting across contexts, and if not, trigger
    //callReady.
    req.checkReadyState = function () {
        var contexts = s.contexts, prop;
        for (prop in contexts) {
            if (!(prop in empty)) {
                if (contexts[prop].waitCount) {
                    return;
                }
            }
        }
        s.isDone = true;
        req.callReady();
    };

    /**
     * Internal function that calls back any ready functions. If you are
     * integrating RequireJS with another library without require.ready support,
     * you can define this method to call your page ready code instead.
     */
    req.callReady = function () {
        var callbacks = s.readyCalls, i, callback, contexts, context, prop;

        if (s.isPageLoaded && s.isDone) {
            if (callbacks.length) {
                s.readyCalls = [];
                for (i = 0; (callback = callbacks[i]); i++) {
                    callback();
                }
            }

            //If jQuery with readyWait is being tracked, updated its
            //readyWait count.
            contexts = s.contexts;
            for (prop in contexts) {
                if (!(prop in empty)) {
                    context = contexts[prop];
                    if (context.jQueryIncremented) {
                        context.jQuery.ready(true);
                        context.jQueryIncremented = false;
                    }
                }
            }
        }
    };

    /**
     * Registers functions to call when the page is loaded
     */
    req.ready = function (callback) {
        if (s.isPageLoaded && s.isDone) {
            callback();
        } else {
            s.readyCalls.push(callback);
        }
        return req;
    };

    if (isBrowser) {
        if (document.addEventListener) {
            //Standards. Hooray! Assumption here that if standards based,
            //it knows about DOMContentLoaded.
            document.addEventListener("DOMContentLoaded", req.pageLoaded, false);
            window.addEventListener("load", req.pageLoaded, false);
            //Part of FF < 3.6 readystate fix (see setReadyState refs for more info)
            if (!document.readyState) {
                setReadyState = true;
                document.readyState = "loading";
            }
        } else if (window.attachEvent) {
            window.attachEvent("onload", req.pageLoaded);

            //DOMContentLoaded approximation, as found by Diego Perini:
            //http://javascript.nwbox.com/IEContentLoaded/
            if (self === self.top) {
                scrollIntervalId = setInterval(function () {
                    try {
                        //From this ticket:
                        //http://bugs.dojotoolkit.org/ticket/11106,
                        //In IE HTML Application (HTA), such as in a selenium test,
                        //javascript in the iframe can't see anything outside
                        //of it, so self===self.top is true, but the iframe is
                        //not the top window and doScroll will be available
                        //before document.body is set. Test document.body
                        //before trying the doScroll trick.
                        if (document.body) {
                            document.documentElement.doScroll("left");
                            req.pageLoaded();
                        }
                    } catch (e) {}
                }, 30);
            }
        }

        //Check if document already complete, and if so, just trigger page load
        //listeners. NOTE: does not work with Firefox before 3.6. To support
        //those browsers, manually call require.pageLoaded().
        if (document.readyState === "complete") {
            req.pageLoaded();
        }
    }
    //****** END page load functionality ****************

    //Set up default context. If require was a configuration object, use that as base config.
    req(cfg);

    //If modules are built into require.js, then need to make sure dependencies are
    //traced. Use a setTimeout in the browser world, to allow all the modules to register
    //themselves. In a non-browser env, assume that modules are not built into require.js,
    //which seems odd to do on the server.
    if (req.isAsync && typeof setTimeout !== "undefined") {
        ctx = s.contexts[(cfg.context || defContextName)];
        //Indicate that the script that includes require() is still loading,
        //so that require()'d dependencies are not traced until the end of the
        //file is parsed (approximated via the setTimeout call).
        ctx.requireWait = true;
        setTimeout(function () {
            ctx.requireWait = false;

            //Any modules included with the require.js file will be in the
            //global queue, assign them to this context.
            ctx.takeGlobalQueue();

            //Allow for jQuery to be loaded/already in the page, and if jQuery 1.4.3,
            //make sure to hold onto it for readyWait triggering.
            ctx.jQueryCheck();

            if (!ctx.scriptCount) {
                ctx.resume();
            }
            req.checkReadyState();
        }, 0);
    }
}());