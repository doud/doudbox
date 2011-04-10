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
                        $('a[href]:not([href^=http]), , a[href*=' + document.domain + ']').each(function() {
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
                    params = value.split('&');
                    var r = [];
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
 * @param Object opts An object contianing settings to override the defaults
 * @type jQuery
 * @cat Plugins/Metadata
 */
$.fn.metadata = function( opts ){
  return $.metadata.get( this[0], opts );
};

})(jQuery);

/**
 * @license RequireJS Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
 * Available via the MIT, GPL or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//laxbreak is true to allow build pragmas to change some statements.
/*jslint plusplus: false, laxbreak: true */
/*global window: false, document: false, navigator: false,
setTimeout: false, traceDeps: true, clearInterval: false, self: false,
setInterval: false, importScripts: false */;


var require;
(function () {
    //Change this version number for each release.
    var version = "0.12.0",
            empty = {}, s,
            i, defContextName = "_", contextLoads = [],
            scripts, script, rePkg, src, m, cfg, setReadyState,
            readyRegExp = /^(complete|loaded)$/,
            isBrowser = !!(typeof window !== "undefined" && navigator && document),
            isWebWorker = !isBrowser && typeof importScripts !== "undefined",
            ostring = Object.prototype.toString, scrollIntervalId, req, baseElement;

    function isFunction(it) {
        return ostring.call(it) === "[object Function]";
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
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     */
    require = function (deps, callback, contextName) {
        if (typeof deps === "string" && !isFunction(callback)) {
            //Just return the module wanted. In this scenario, the
            //second arg (if passed) is just the contextName.
            return require.get(deps, callback);
        }

        //Do more work, either 
        return require.def.apply(require, arguments);
    };
    
    //Alias for caja compliance internally -
    //specifically: "Dynamically computed names should use require.async()"
    //even though this spec isn't really decided on.
    req = require;

    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    require.def = function (name, deps, callback, contextName) {
        var config = null, context, newContext, contextRequire, loaded,
            canSetContext, prop, newLength, outDeps,
            mods, pluginPrefix, paths, index, i;

        //Normalize the arguments.
        if (typeof name === "string") {
            //Defining a module. First, pull off any plugin prefix.
            index = name.indexOf("!");
            if (index !== -1) {
                pluginPrefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }

            //Check if there are no dependencies, and adjust args.
            if (!require.isArray(deps)) {
                contextName = callback;
                callback = deps;
                deps = [];
            }

            contextName = contextName || s.ctxName;

            //If module already defined for context, or already waiting to be
            //evaluated, leave.
            context = s.contexts[contextName];
            if (context && (context.defined[name] || context.waiting[name])) {
                return require;
            }
        } else if (require.isArray(name)) {
            //Just some code that has dependencies. Adjust args accordingly.
            contextName = callback;
            callback = deps;
            deps = name;
            name = null;
        } else if (require.isFunction(name)) {
            //Just a function that does not define a module and
            //does not have dependencies. Useful if just want to wait
            //for whatever modules are in flight and execute some code after
            //those modules load.
            callback = name;
            contextName = deps;
            name = null;
            deps = [];
        } else {
            //name is a config object.
            config = name;
            name = null;
            //Adjust args if no dependencies.
            if (require.isFunction(deps)) {
                contextName = callback;
                callback = deps;
                deps = [];
            }

            contextName = contextName || config.context;
        }

        contextName = contextName || s.ctxName;

        
        //Grab the context, or create a new one for the given context name.
        context = s.contexts[contextName];
        if (!context) {
            newContext = {
                contextName: contextName,
                config: {
                    waitSeconds: 7,
                    baseUrl: s.baseUrl || "./",
                    paths: {}
                },
                waiting: [],
                specified: {
                    "require": true,
                    "exports": true,
                    "module": true
                },
                loaded: {
                    "require": true
                },
                urlFetched: {},
                defined: {},
                modifiers: {}
            };

            //Define require for this context.
                        //A placeholder for build pragmas.
            newContext.defined.require = require;
                        
            
            context = s.contexts[contextName] = newContext;
        }

        //If have a config object, update the context's config object with
        //the config values.
        if (config) {
            //Make sure the baseUrl ends in a slash.
            if (config.baseUrl) {
                if (config.baseUrl.charAt(config.baseUrl.length - 1) !== "/") {
                    config.baseUrl += "/";
                }
            }

            //Save off the paths since they require special processing,
            //they are additive.
            paths = context.config.paths;

            //Mix in the config values, favoring the new values over
            //existing ones in context.config.
            require.mixin(context.config, config, true);

            //Adjust paths if necessary.
            if (config.paths) {
                for (prop in config.paths) {
                    if (!(prop in empty)) {
                        paths[prop] = config.paths[prop];
                    }
                }
                context.config.paths = paths;
            }
            
            //If priority loading is in effect, trigger the loads now
            if (config.priority) {
                //Create a separate config property that can be
                //easily tested for config priority completion.
                //Do this instead of wiping out the config.priority
                //in case it needs to be inspected for debug purposes later.
                req(config.priority);
                context.config.priorityWait = config.priority;
            }

            //If a deps array or a config callback is specified, then call
            //require with those args. This is useful when require is defined as a
            //config object before require.js is loaded.
            if (config.deps || config.callback) {
                req(config.deps || [], config.callback);
            }

            
            //If it is just a config block, nothing else,
            //then return.
            if (!deps) {
                return require;
            }
        }

        //Normalize dependency strings: need to determine if they have
        //prefixes and to also normalize any relative paths. Replace the deps
        //array of strings with an array of objects.
        if (deps) {
            outDeps = deps;
            deps = [];
            for (i = 0; i < outDeps.length; i++) {
                deps[i] = require.splitPrefix(outDeps[i], name);
            }
        }

        //Store the module for later evaluation
        newLength = context.waiting.push({
            name: name,
            deps: deps,
            callback: callback
        });

        if (name) {
            //Store index of insertion for quick lookup
            context.waiting[name] = newLength - 1;

            //Mark the module as specified so no need to fetch it again.
            //Important to set specified here for the
            //pause/resume case where there are multiple modules in a file.
            context.specified[name] = true;

                    }

        //If the callback is not an actual function, it means it already
        //has the definition of the module as a literal value.
        if (name && callback && !require.isFunction(callback)) {
            context.defined[name] = callback;
        }

        //If a pluginPrefix is available, call the plugin, or load it.
        
        //See if all is loaded. If paused, then do not check the dependencies
        //of the module yet.
        if (s.paused || context.config.priorityWait) {
            (s.paused || (s.paused = [])).push([pluginPrefix, name, deps, context]);
        } else {
            require.checkDeps(pluginPrefix, name, deps, context);
            require.checkLoaded(contextName);
        }

        //Set loaded here for modules that are also loaded
        //as part of a layer, where onScriptLoad is not fired
        //for those cases. Do this after the inline define and
        //dependency tracing is done.
        if (name) {
            context.loaded[name] = true;
        }
        return require;
    };

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    require.mixin = function (target, source, force) {
        for (var prop in source) {
            if (!(prop in empty) && (!(prop in target) || force)) {
                target[prop] = source[prop];
            }
        }
        return require;
    };

    require.version = version;

    //Set up page state.
    s = require.s = {
        ctxName: defContextName,
        contexts: {},
                //Stores a list of URLs that should not get async script tag treatment.
        skipAsync: {},
        isBrowser: isBrowser,
        isPageLoaded: !isBrowser,
        readyCalls: [],
        doc: isBrowser ? document : null
    };

    require.isBrowser = s.isBrowser;
    if (isBrowser) {
        s.head = document.getElementsByTagName("head")[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName("base")[0];
        if (baseElement) {
            s.head = baseElement.parentNode;
        }
    }

    
    /**
     * Pauses the tracing of dependencies. Useful in a build scenario when
     * multiple modules are bundled into one file, and they all need to be
     * require before figuring out what is left still to load.
     */
    require.pause = function () {
        if (!s.paused) {
            s.paused = [];
        }
    };

    /**
     * Resumes the tracing of dependencies. Useful in a build scenario when
     * multiple modules are bundled into one file. This method is related
     * to require.pause() and should only be called if require.pause() was called first.
     */
    require.resume = function () {
        var i, args, paused;

        //Skip the resume if current context is in priority wait.
        if (s.contexts[s.ctxName].config.priorityWait) {
            return;
        }

        if (s.paused) {
            paused = s.paused;
            delete s.paused;
            for (i = 0; (args = paused[i]); i++) {
                require.checkDeps.apply(require, args);
            }
        }
        require.checkLoaded(s.ctxName);
    };

    /**
     * Trace down the dependencies to see if they are loaded. If not, trigger
     * the load.
     * @param {String} pluginPrefix the plugin prefix, if any associated with the name.
     *
     * @param {String} name: the name of the module that has the dependencies.
     *
     * @param {Array} deps array of dependencies.
     *
     * @param {Object} context: the loading context.
     *
     * @private
     */
    require.checkDeps = function (pluginPrefix, name, deps, context) {
        //Figure out if all the modules are loaded. If the module is not
        //being loaded or already loaded, add it to the "to load" list,
        //and request it to be loaded.
        var i, dep;

        if (pluginPrefix) {
                    } else {
            for (i = 0; (dep = deps[i]); i++) {
                if (!context.specified[dep.fullName]) {
                    context.specified[dep.fullName] = true;

                    //If a plugin, call its load method.
                    if (dep.prefix) {
                                            } else {
                        require.load(dep.name, context.contextName);
                    }
                }
            }
        }
    };

    
    require.isArray = function (it) {
        return ostring.call(it) === "[object Array]";
    };

    require.isFunction = isFunction;

    /**
     * Gets one module's exported value. This method is used by require().
     * It is broken out as a separate function to allow a host environment
     * shim to overwrite this function with something appropriate for that
     * environment.
     *
     * @param {String} moduleName the name of the module.
     * @param {String} [contextName] the name of the context to use. Uses
     * default context if no contextName is provided.
     *
     * @returns {Object} the exported module value.
     */
    require.get = function (moduleName, contextName) {
        if (moduleName === "exports" || moduleName === "module") {
            throw new Error("require of " + moduleName + " is not allowed.");
        }
        contextName = contextName || s.ctxName;
        var ret = s.contexts[contextName].defined[moduleName];
        if (ret === undefined) {
            throw new Error("require: module name '" +
                            moduleName +
                            "' has not been loaded yet for context: " +
                            contextName);
        }
        return ret;
    };

    /**
     * Makes the request to load a module. May be an async load depending on
     * the environment and the circumstance of the load call. Override this
     * method in a host environment shim to do something specific for that
     * environment.
     *
     * @param {String} moduleName the name of the module.
     * @param {String} contextName the name of the context to use.
     */
    require.load = function (moduleName, contextName) {
        var context = s.contexts[contextName],
            urlFetched = context.urlFetched,
            loaded = context.loaded, url;
        s.isDone = false;

        //Only set loaded to false for tracking if it has not already been set.
        if (!loaded[moduleName]) {
            loaded[moduleName] = false;
        }

                    //First derive the path name for the module.
            url = require.nameToUrl(moduleName, null, contextName);
            if (!urlFetched[url]) {
                require.attach(url, contextName, moduleName);
                urlFetched[url] = true;
            }
            context.startTime = (new Date()).getTime();
            };

    require.jsExtRegExp = /\.js$/;

    
    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    require.normalizeName = function (name, baseName) {
        //Adjust any relative paths.
        var part;
        if (name.charAt(0) === ".") {
            //Convert baseName to array, and lop off the last part,
            //so that . matches that "directory" and not name of the baseName's
            //module. For instance, baseName of "one/two/three", maps to
            //"one/two/three.js", but we want the directory, "one/two" for
            //this normalization.
            baseName = baseName.split("/");
            baseName = baseName.slice(0, baseName.length - 1);

            name = baseName.concat(name.split("/"));
            for (i = 0; (part = name[i]); i++) {
                if (part === ".") {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === "..") {
                    name.splice(i - 1, 2);
                    i -= 2;
                }
            }
            name = name.join("/");
        }
        return name;
    };

    /**
     * Splits a name into a possible plugin prefix and
     * the module name. If baseName is provided it will
     * also normalize the name via require.normalizeName()
     * 
     * @param {String} name the module name
     * @param {String} [baseName] base name that name is
     * relative to.
     *
     * @returns {Object} with properties, 'prefix' (which
     * may be null), 'name' and 'fullName', which is a combination
     * of the prefix (if it exists) and the name.
     */
    require.splitPrefix = function (name, baseName) {
        var index = name.indexOf("!"), prefix = null;
        if (index !== -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }

        //Account for relative paths if there is a base name.
        if (baseName) {
            name = require.normalizeName(name, baseName);
        }

        return {
            prefix: prefix,
            name: name,
            fullName: prefix ? prefix + "!" + name : name
        };
    };

    /**
     * Converts a module name to a file path.
     */
    require.nameToUrl = function (moduleName, ext, contextName) {
        var paths, syms, i, parentModule, url,
            config = s.contexts[contextName].config;

        //If a colon is in the URL, it indicates a protocol is used and it is just
        //an URL to a file, or if it starts with a slash or ends with .js, it is just a plain file.
        //The slash is important for protocol-less URLs as well as full paths.
        if (moduleName.indexOf(":") !== -1 || moduleName.charAt(0) === '/' || require.jsExtRegExp.test(moduleName)) {
            //Just a plain path, not module name lookup, so just return it.
            return moduleName;
        } else if (moduleName.charAt(0) === ".") {
            throw new Error("require.nameToUrl does not handle relative module names (ones that start with '.' or '..')");
        } else {
            //A module that needs to be converted to a path.
            paths = config.paths;

            syms = moduleName.split("/");
            //For each module name segment, see if there is a path
            //registered for it. Start with most specific name
            //and work up from it.
            for (i = syms.length; i > 0; i--) {
                parentModule = syms.slice(0, i).join("/");
                if (paths[parentModule]) {
                    syms.splice(0, i, paths[parentModule]);
                    break;
                }
            }

            //Join the path parts together, then figure out if baseUrl is needed.
            url = syms.join("/") + (ext || ".js");
            return ((url.charAt(0) === '/' || url.match(/^\w+:/)) ? "" : config.baseUrl) + url;
        }
    };

    /**
     * Checks if all modules for a context are loaded, and if so, evaluates the
     * new ones in right dependency order.
     *
     * @private
     */
    require.checkLoaded = function (contextName) {
        var context = s.contexts[contextName || s.ctxName],
                waitInterval = context.config.waitSeconds * 1000,
                //It is possible to disable the wait interval by using waitSeconds of 0.
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                loaded, defined = context.defined,
                modifiers = context.modifiers, waiting, noLoads = "",
                hasLoadedProp = false, stillLoading = false, prop, priorityDone,
                priorityName,

                
                i, module, allDone, loads, loadArgs, err,
                traced = {};

        //If already doing a checkLoaded call,
        //then do not bother checking loaded state.
        if (context.isCheckLoaded) {
            return;
        }

        //Determine if priority loading is done. If so clear the priority. If
        //not, then do not check
        if (context.config.priorityWait) {
            priorityDone = true;
            for (i = 0; (priorityName = context.config.priorityWait[i]); i++) {
                if (!context.loaded[priorityName]) {
                    priorityDone = false;
                    break;
                }
            }
            if (priorityDone) {
                //Clean up priority and call resume, since it could have
                //some waiting dependencies to trace.
                delete context.config.priorityWait;
                require.resume();
            } else {
                return;
            }
        }

        //Signal that checkLoaded is being require, so other calls that could be triggered
        //by calling a waiting callback that then calls require and then this function
        //should not proceed. At the end of this function, if there are still things
        //waiting, then checkLoaded will be called again.
        context.isCheckLoaded = true;

        //Grab waiting and loaded lists here, since it could have changed since
        //this function was first called, for instance, by the require.resume()
        waiting = context.waiting;
        loaded = context.loaded;

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
        if (!hasLoadedProp && !waiting.length
                       ) {
            //If the loaded object had no items, then the rest of
            //the work below does not need to be done.
            context.isCheckLoaded = false;
            return;
        }
        if (expired && noLoads) {
            //If wait time expired, throw error of unloaded modules.
            err = new Error("require.js load timeout for modules: " + noLoads);
            err.requireType = "timeout";
            err.requireModules = noLoads;
        }
        if (stillLoading) {
            //Something is still waiting to load. Wait for it.
            context.isCheckLoaded = false;
            if (isBrowser || isWebWorker) {
                setTimeout(function () {
                    require.checkLoaded(contextName);
                }, 50);
            }
            return;
        }

        //Order the dependencies. Also clean up state because the evaluation
        //of modules might create new loading tasks, so need to reset.
        //Be sure to call plugins too.
        context.waiting = [];
        context.loaded = {};

        
        
        //Define the modules, doing a depth first search.
        for (i = 0; (module = waiting[i]); i++) {
            require.exec(module, traced, waiting, context);
        }

        //Indicate checkLoaded is now done.
        context.isCheckLoaded = false;

        if (context.waiting.length
                       ) {
            //More things in this context are waiting to load. They were probably
            //added while doing the work above in checkLoaded, calling module
            //callbacks that triggered other require calls.
            require.checkLoaded(contextName);
        } else if (contextLoads.length) {
                    } else {
            //Make sure we reset to default context.
            s.ctxName = defContextName;
            s.isDone = true;
            if (require.callReady) {
                require.callReady();
            }
        }
    };

    /**
     * Executes the modules in the correct order.
     * 
     * @private
     */
    require.exec = function (module, traced, waiting, context) {
        //Some modules are just plain script files, abddo not have a formal
        //module definition, 
        if (!module) {
            return undefined;
        }

        var name = module.name, cb = module.callback, deps = module.deps, j, dep,
            defined = context.defined, ret, args = [], depModule,
            usingExports = false, depName;

        //If already traced or defined, do not bother a second time.
        if (name) {
            if (traced[name] || name in defined) {
                return defined[name];
            }
    
            //Mark this module as being traced, so that it is not retraced (as in a circular
            //dependency)
            traced[name] = true;
        }

        if (deps) {
            for (j = 0; (dep = deps[j]); j++) {
                depName = dep.name;
                if (depName === "exports") {
                    //CommonJS module spec 1.1
                    depModule = defined[name] = {};
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    depModule = {
                        id: name,
                        uri: name ? require.nameToUrl(name, null, context.contextName) : undefined
                    };
                } else {
                    //Get dependent module. It could not exist, for a circular
                    //dependency or if the loaded dependency does not actually call
                    //require. Favor not throwing an error here if undefined because
                    //we want to allow code that does not use require as a module
                    //definition framework to still work -- allow a web site to
                    //gradually update to contained modules. That is more
                    //important than forcing a throw for the circular dependency case.
                    depModule = depName in defined ? defined[depName] : (traced[depName] ? undefined : require.exec(waiting[waiting[depName]], traced, waiting, context));
                }

                args.push(depModule);
            }
        }

        //Call the callback to define the module, if necessary.
        cb = module.callback;
        if (cb && require.isFunction(cb)) {
            ret = require.execCb(name, cb, args);
            if (name) {
                if (usingExports) {
                    ret = defined[name];
                } else {
                    if (name in defined) {
                        throw new Error(name + " has already been defined");
                    } else {
                        defined[name] = ret;
                    }
                }
            }
        }

        
        return ret;
    };

    /**
     * Executes a module callack function. Broken out as a separate function
     * solely to allow the build system to sequence the files in the built
     * layer in the right sequence.
     * @param {String} name the module name.
     * @param {Function} cb the module callback/definition function.
     * @param {Array} args The arguments (dependent modules) to pass to callback.
     *
     * @private
     */
    require.execCb = function (name, cb, args) {
        return cb.apply(null, args);
    };

    
    /**
     * callback for script loads, used to check status of loading.
     *
     * @param {Event} evt the event from the browser for the script
     * that was loaded.
     *
     * @private
     */
    require.onScriptLoad = function (evt) {
        //Using currentTarget instead of target for Firefox 2.0's sake. Not
        //all old browsers will be supported, but this one was easy enough
        //to support and still makes sense.
        var node = evt.currentTarget || evt.srcElement, contextName, moduleName;
        if (evt.type === "load" || readyRegExp.test(node.readyState)) {
            //Pull out the name of the module and the context.
            contextName = node.getAttribute("data-requirecontext");
            moduleName = node.getAttribute("data-requiremodule");

            //Mark the module loaded. Must do it here in addition
            //to doing it in require.def in case a script does
            //not call require.def
            s.contexts[contextName].loaded[moduleName] = true;

            require.checkLoaded(contextName);

            //Clean up script binding.
            if (node.removeEventListener) {
                node.removeEventListener("load", require.onScriptLoad, false);
            } else {
                //Probably IE.
                node.detachEvent("onreadystatechange", require.onScriptLoad);
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
    require.attach = function (url, contextName, moduleName, callback, type) {
        var node, loaded;
        if (isBrowser) {
            //In the browser so use a script tag
            callback = callback || require.onScriptLoad;
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
            if (!s.skipAsync[url]) {
                node.setAttribute("async", "async");
            }
            node.setAttribute("data-requirecontext", contextName);
            node.setAttribute("data-requiremodule", moduleName);

            //Set up load listener.
            if (node.addEventListener) {
                node.addEventListener("load", callback, false);
            } else {
                //Probably IE.
                node.attachEvent("onreadystatechange", callback);
            }
            node.src = url;

            return baseElement ? s.head.insertBefore(node, baseElement) : s.head.appendChild(node);
        } else if (isWebWorker) {
            //In a web worker, use importScripts. This is not a very
            //efficient use of importScripts, importScripts will block until
            //its script is downloaded and evaluated. However, if web workers
            //are in play, the expectation that a build has been done so that
            //only one script needs to be loaded anyway. This may need to be
            //reevaluated if other use cases become common.
            loaded = s.contexts[contextName].loaded;
            loaded[moduleName] = false;
            importScripts(url);
            //Just mark the script loaded, someone else will check dependencies
            //when all done.
            loaded[moduleName] = true;
        }
        return null;
    };

    //Determine what baseUrl should be if not already defined via a require config object
    s.baseUrl = cfg && cfg.baseUrl;
    if (isBrowser && (!s.baseUrl || !s.head)) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        scripts = document.getElementsByTagName("script");
        if (cfg && cfg.baseUrlMatch) {
            rePkg = cfg.baseUrlMatch;
        } else {
                        rePkg = /(requireplugins-|require-)?jquery[\-\d\.]*(min)?\.js(\W|$)/i;
            
            
            
            
                    }

        for (i = scripts.length - 1; i > -1 && (script = scripts[i]); i--) {
            //Set the "head" where we can append children by
            //using the script's parent.
            if (!s.head) {
                s.head = script.parentNode;
            }
            //Using .src instead of getAttribute to get an absolute URL.
            //While using a relative URL will be fine for script tags, other
            //URLs used for text! resources that use XHR calls might benefit
            //from an absolute URL.
            src = script.src;
            if (src) {
                m = src.match(rePkg);
                if (m) {
                    s.baseUrl = src.substring(0, m.index);
                    break;
                }
            }
        }
    }

    
    //Set up default context. If require was a configuration object, use that as base config.
    if (cfg) {
        req(cfg);
    }
}());

/**
 * yepnope.js 1.0pre
 * by Alex Sexton - AlexSexton@gmail.com
 * &
 * Ralph Holzmann - ralphholzmann@gmail.com
 *
 * Tri-Licensed WTFPL, BSD, & MIT
*/;
( function ( window, doc, undef ) {

var docElement            = doc.documentElement,
    sTimeout              = window.setTimeout,
    docFirst              = docElement.children[ 0 ],
    toString              = {}.toString,
    execStack             = [],
    started               = 0,
    // Before you get mad about browser sniffs, please read:
    // https://github.com/Modernizr/Modernizr/wiki/Undetectables
    // If you have a better solution, we are actively looking to solve the problem
    isGecko               = ( 'MozAppearance' in docElement.style ),
    isGecko18             = isGecko && !! window.Event.prototype.preventBubble,
    // Thanks to @jdalton for showing us this opera detection (by way of @kangax) (and probably @miketaylr too, or whatever...)
    isOpera               = window.opera && toString.call( window.opera ) == '[object Opera]',
    isWebkit              = ( 'webkitAppearance' in docElement.style ),
    strJsElem             = isOpera || ( isGecko && ! isGecko18 ) ? 'img' : ( isGecko ? 'object' : 'script' ),
    strCssElem            = isWebkit ? 'img' : strJsElem,
    isArray               = Array.isArray || function ( obj ) {
      return toString.call( obj ) == '[object Array]';
    },
    isObject              = function ( obj ) {
      // Lame object detection, but don't pass it stupid stuff?
      return typeof obj == 'object';
    },
    isString              = function ( s ) {
      return typeof s == 'string';
    },
    isFunction            = function ( fn ) {
      return toString.call( fn ) == '[object Function]';
    },
    globalFilters         = [],
    prefixes              = {},
    handler,
    yepnope;

  /* Loader helper functions */
  function isFileReady ( readyState ) {
    // Check to see if any of the ways a file can be ready are available as properties on the file's element
    return ( ! readyState || readyState == 'loaded' || readyState == 'complete' );
  }


  function execWhenReady () {
    var execStackReady = 1,
        i              = -1;

    // Loop through the stack of scripts in the cue and execute them when all scripts in a group are ready
    while ( execStack.length - ++i ) {
      if ( execStack[ i ].s && ! ( execStackReady = execStack[ i ].r ) ) {
        // As soon as we encounter a script that isn't ready, stop looking for more
        break;
      }
    }
    // If we've set the stack as ready in the loop, make it happen here
    if ( execStackReady ) {
      executeStack();
    }
  }

  // Takes a preloaded js obj (changes in different browsers) and injects it into the head
  // in the appropriate order
  function injectJs ( oldObj ) {
    var script = doc.createElement( 'script' ),
        done;

    script.src = oldObj.s;

    // Bind to load events
    script.onreadystatechange = script.onload = function () {

      if ( ! done && isFileReady( script.readyState ) ) {

        // Set done to prevent this function from being called twice.
        done = 1;
        execWhenReady();

        // Handle memory leak in IE
        script.onload = script.onreadystatechange = null;
        // Only remove it if we appended it to begin with
        ! oldObj.e && docElement.removeChild( script );
      }
    };

    // 404 Fallback
    sTimeout( function () {
      if ( ! done ) {
        done = 1;
        docElement.removeChild( script );
        execWhenReady();
      }
    }, yepnope.errorTimeout );

    // Inject script into to document
    // or immediately callback if we know there
    // was previously a timeout error
    if ( oldObj.e ) {
      script.onload();
    }
    else {
      docElement.appendChild( script );
    }
  }

  // Takes a preloaded css obj (changes in different browsers) and injects it into the head
  // in the appropriate order
  // Many credits to John Hann (@unscriptable) for a lot of the ideas here - found in the css! plugin for RequireJS
  function injectCss ( oldObj ) {

    // Create stylesheet link
    var link = doc.createElement( 'link' ),
        done;

    // Add attributes
    link.href = oldObj.s;
    link.rel  = 'stylesheet';
    link.type = 'text/css';

    // Poll for changes in webkit and gecko
    if ( isWebkit || isGecko ) {

      // A self executing function with a sTimeout poll to call itself
      // again until the css file is added successfully
      ( function poll ( link ) {
        sTimeout( function () {
          // Don't run again if we're already done
          if ( ! done ) {
            try {
              // In supporting browsers, we can see the length of the cssRules of the file go up
              if ( link.sheet && link.sheet.cssRules && link.sheet.cssRules.length ) {
                // Then turn off the poll
                done = 1;
                // And execute a function to execute callbacks when all dependencies are met
                execWhenReady();
              }
              // otherwise, wait another interval and try again
              else {
                poll( link );
              }
            }
            catch ( ex ) {
              // In the case that the browser does not support the cssRules array (cross domain)
              // just check the error message to see if it's a security error
              if ( ( ex.code == 1e3 ) || ( ex.message.match( /security|denied/i ) ) ) {
                // if it's a security error, that means it loaded a cross domain file, so stop the timeout loop
                done = 1;
                // and execute a check to see if we can run the callback(s) immediately after this function ends
                sTimeout( function () {
                  execWhenReady();
                }, 0 );
              }
              // otherwise, continue to poll
              else {
                poll( link );
              }
            }
          }
        }, 0 );
      } )( link );

    }
    // Onload handler for IE and Opera
    else {
      // In browsers that allow the onload event on link tags, just use it
      link.onload = function () {
        if ( ! done ) {
          // Set our flag to complete
          done = 1;
          // Check to see if we can call the callback
          sTimeout( function () {
            execWhenReady();
          }, 0 );
        }
      };
    }

    // 404 Fallback
    sTimeout( function () {
      if ( ! done ) {
        done = 1;
        docElement.removeChild( link );
        execWhenReady();
      }
    }, yepnope.errorTimeout );

    // Inject CSS
    docElement.insertBefore( link, docFirst );
  }

  function executeStack ( a ) {
    // shift an element off of the stack
    var i   = execStack.shift(),
        src = i ? i.s  : undef,
        t   = i ? i.t : undef;

    started = 1;

    // if a is truthy and the first item in the stack has an src
    if ( a && src ) {
      // Pop another off the stack
      i = execStack.shift();
      // unset the src
      src = undef;
    }

    if ( i ) {
      // if it's a script, inject it into the head with no type attribute
      if ( src && t == 'j' ) {
        // Inject after a timeout so FF has time to be a jerk about it and
        // not double load (ignore the cache)
        sTimeout( function () {
          injectJs( i );
        }, 0 );
      }
      // If it's a css file, fun the css injection function
      else if ( src && t == 'c' ) {
        injectCss( i );
      }
      // Otherwise, just call the function and potentially run the stack
      // reset the started flag for the recursive handling
      else {
        i();
        started = 0;
        execWhenReady();
      }
    }
    else {
      // just reset out of recursive mode
      started = 0;
    }
  }

  function preloadFile ( elem, url, type, splicePoint, docElement ) {

    // Create appropriate element for browser and type
    var preloadElem = doc.createElement( elem ),
        done        = 0,
        stackObject = {
          t: type,  // type
          s: url    // src
        //r: 0      // ready
        //e: 0      // error
        };

    function onload () {

      // If the script/css file is loaded
      if ( ! done && isFileReady( preloadElem.readyState ) ) {

        // Set done to prevent this function from being called twice.
        stackObject.r = done = 1;

        // If the type is set, that means that we're offloading execution
        if ( ! type || ( type && ! started ) ) {
          execWhenReady();
        }

        // Handle memory leak in IE
        preloadElem.onload = preloadElem.onreadystatechange = null;
        type && docElement.removeChild( preloadElem );
      }
    }

    // Just set the src and the data attributes so we don't have differentiate between elem types
    preloadElem.src = preloadElem.data = url;

    // Don't let it show up visually
    preloadElem.width = preloadElem.height = '0';

    // Only if we have a type to add should we set the type attribute (a real script has no type)
    if ( type && elem != 'object' ) {
      preloadElem.type = type;
    }

    // Attach handlers for all browsers
    preloadElem.onload = preloadElem.onreadystatechange = onload;

    // If it's an image
    if ( elem == 'img' ) {
      // Use the onerror callback as the 'completed' indicator
      preloadElem.onerror = onload;
    }
    // Otherwise, if it's a script element
    else if ( elem == 'script' ) {
      // handle errors on script elements when we can
      preloadElem.onerror = function () {
        stackObject.r = 1;
        executeStack( 1 );
      };
    }

    // inject the element into the stack depending on if it's
    // in the middle of other scripts or not
    execStack.splice( splicePoint, 0, stackObject );

    // append the element to the appropriate parent element (scripts go in the head, usually, and objects go in the body usually)
    docElement.appendChild( preloadElem );

    // Special case for opera, since error handling is how we detect onload
    // we can't have a real error handler. So in opera, we
    // have a timeout in order to throw an error if something never loads.
    // Better solutions welcomed.
    if ( ( isOpera && elem == 'script' ) || elem == 'object' ) {
      sTimeout( function () {
        if ( ! done ) {
          // Remove the node from the dom
          docElement.removeChild( preloadElem );
          // Set it to ready to move on
          // indicate that this had a timeout error on our stack object
          stackObject.r = stackObject.e = done = 1;
          // Continue on
          execWhenReady();
        }
      }, yepnope.errorTimeout );
    }
  }

  function load ( resource, type ) {

    var app   = this,
        elem  = ( type == 'c' ? strCssElem : strJsElem );

    // We'll do 'j' for js and 'c' for css, yay for unreadable minification tactics
    type = type || 'j';
    if ( isString( resource ) ) {
      // if the resource passed in here is a string, preload the file
      // use the head when we can (which is the documentElement when the head element doesn't exist)
      // and use the body element for objects. Images seem fine in the head, for some odd reason.
      preloadFile( elem, resource, type, app.i++, docElement );
    } else {
      // Otherwise it's a resource object and we can splice it into the app at the current location
      execStack.splice( app.i++, 0, resource );
    }

    // OMG is this jQueries? For chaining...
    return app;
  }

  // return the yepnope object with a fresh loader attached
  function getYepnope () {
    var y = yepnope;
    y.loader = {
      load: load,
      i : 0
    };
    return y;
  }

  /* End loader helper functions */
    // Yepnope Function
  yepnope = function ( needs ) {

    var i,
        need,
        nlen  = needs.length,
        // start the chain as a plain instance
        chain = this.yepnope.loader;

    function satisfyPrefixes ( url ) {
      // split all prefixes out
      var parts   = url.split( '!' ),
      gLen    = globalFilters.length,
      origUrl = parts.pop(),
      pLen    = parts.length,
      res     = {
        url      : origUrl,
        // keep this one static for callback variable consistency
        origUrl  : origUrl,
        prefixes : parts
      },
      mFunc,
      j,
      z;

      // loop through prefixes
      // if there are none, this automatically gets skipped
      for ( j = 0; j < pLen; j++ ) {
        mFunc = prefixes[ parts[ j ] ];
        if ( mFunc ) {
          res = mFunc( res );
        }
      }

      // Go through our global filters
      for ( z = 0; z < gLen; z++ ) {
        res = globalFilters[ z ]( res );
      }

      // return the final url
      return res;
    }

    function loadScriptOrStyle ( input, callback, chain, index, testResult ) {
      // run through our set of prefixes
      var resource     = satisfyPrefixes( input ),
          autoCallback = resource.autoCallback;

      // if no object is returned or the url is empty/0 just exit the load
      if ( resource.bypass ) {
        return;
      }

      // Determine callback, if any
      if ( callback ) {
        callback = isFunction( callback ) ? callback : callback[ input ] || callback[ index ] || callback[ ( input.split( '/' ).pop().split( '?' )[ 0 ] ) ];
      }

      // if someone is overriding all normal functionality
      if ( resource.instead ) {
        return resource.instead( input, callback, chain, index, testResult );
      }
      else {

        chain.load( resource.url, ( ( resource.forceCSS || ( ! resource.forceJS && /css$/.test( resource.url ) ) ) ) ? 'c' : undef );

        // If we have a callback, we'll start the chain over
        if ( isFunction( callback ) || isFunction( autoCallback ) ) {
          // Call getJS with our current stack of things
          chain.load( function () {
            // Hijack yepnope and restart index counter
            // NOTE:: This can't get minified... perhaps we need to pass it as a param isntead?
            var innernope = getYepnope();
            // Call our callbacks with this set of data
            callback && callback( resource.origUrl, testResult, index, innernope );
            autoCallback && autoCallback( resource.origUrl, testResult, index, innernope );
          } );
        }
      }
    }

    function loadFromTestObject ( testObject, chain) {
        var testResult = !! testObject.test,
            group      = testResult ? testObject.yep : testObject.nope,
            always     = testObject.load || testObject.both,
            callback   = testObject.callback,
            callbackKey;

        // Reusable function for dealing with the different input types
        // NOTE:: relies on closures to keep 'chain' up to date, a bit confusing, but
        // much smaller than the functional equivalent in this case.
        function handleGroup ( needGroup ) {
          // If it's a string
          if ( isString( needGroup ) ) {
            // Just load the script of style
            loadScriptOrStyle( needGroup, callback, chain, 0, testResult );
          }
          // See if we have an object. Doesn't matter if it's an array or a key/val hash
          // Note:: order cannot be guaranteed on an key value object with multiple elements
          // since the for-in does not preserve order. Arrays _should_ go in order though.
          else if ( isObject( needGroup ) ) {
            for ( callbackKey in needGroup ) {
              // Safari 2 does not have hasOwnProperty, but not worth the bytes for a shim
              // patch if needed. Kangax has a nice shim for it. Or just remove the check
              // and promise not to extend the object prototype.
              if ( needGroup.hasOwnProperty( callbackKey ) ) {
                loadScriptOrStyle( needGroup[ callbackKey ], callback, chain, callbackKey, testResult );
              }
            }
          }
        }

        // figure out what this group should do
        handleGroup( group );

        // Run our loader on the load/both group too
        handleGroup( always );

        // Fire complete callback
        if ( testObject.complete ) {
          chain.load( testObject.complete );
        }

    }

    // Someone just decides to load a single script or css file as a string
    if ( isString( needs ) ) {
      loadScriptOrStyle( needs, 0, chain, 0 );
    }
    // Normal case is likely an array of different types of loading options
    else if ( isArray( needs ) ) {
      // go through the list of needs
      for( i = 0; i < nlen; i++ ) {
        need = needs[ i ];

        // if it's a string, just load it
        if ( isString( need ) ) {
          loadScriptOrStyle( need, 0, chain, 0 );
        }
        // if it's an array, call our function recursively
        else if ( isArray( need ) ) {
          yepnope( need );
        }
        // if it's an object, use our modernizr logic to win
        else if ( isObject( need ) ) {
          loadFromTestObject( need, chain );
        }
      }
    }
    // Allow a single object to be passed in
    else if ( isObject( needs ) ) {
      loadFromTestObject( needs, chain );
    }
  };

  // This publicly exposed function is for allowing
  // you to add functionality based on prefixes on the
  // string files you add. 'css!' is a builtin prefix
  //
  // The arguments are the prefix (not including the !) as a string
  // and
  // A callback function. This function is passed a resource object
  // that can be manipulated and then returned. (like middleware. har.)
  //
  // Examples of this can be seen in the officially supported ie prefix
  yepnope.addPrefix = function ( prefix, callback ) {
    prefixes[ prefix ] = callback;
  };

  // A filter is a global function that every resource
  // object that passes through yepnope will see. You can
  // of course conditionally choose to modify the resource objects
  // or just pass them along. The filter function takes the resource
  // object and is expected to return one.
  //
  // The best example of a filter is the 'autoprotocol' officially
  // supported filter
  yepnope.addFilter = function ( filter ) {
    globalFilters.push( filter );
  };

  // Default error timeout to 10sec - modify to alter
  yepnope.errorTimeout = 10000;

  // Webreflection readystate hack
  // safe for jQuery 1.4+ ( i.e. don't use yepnope with jQuery 1.3.2 )
  // if the readyState is null and we have a listener
  if ( doc.readyState == null && doc.addEventListener ) {
    // set the ready state to loading
    doc.readyState = 'loading';
    // call the listener
    doc.addEventListener( 'DOMContentLoaded', handler = function () {
      // Remove the listener
      doc.removeEventListener( 'DOMContentLoaded', handler, 0 );
      // Set it to ready
      doc.readyState = 'complete';
    }, 0 );
  }

  // Attach loader &
  // Leak it
  window.yepnope = yepnope = getYepnope();

} )( this, this.document );
/**
 * Yepnope IE detection prefix
 * 
 * Use a combination of any of these, and they should work
 * Usage: ['ie6!ie6styles.css', 'ie7!ie7styles.css', 'ie!allIEstyles.css', 'ie6!ie7!oldIEstyles.css']
 * Usage: ['iegt5!iebutnot5.css', 'iegt6!ieHigherThan6.css', 'iegt7!gt7.css', 'iegt8!gt8.css']
 * Usage: ['ielt7!ieLessThan7.css', 'ielt8!lt8.css', 'ielt9!lt9.css']
 * 
 * A logical OR will be applied to any combination of the supported prefixes.
 *
 * Official Yepnope Plugin
 *
 * WTFPL License
 *
 * by Alex Sexton | AlexSexton@gmail.com
 */
(function(yepnope){

  // hasOwnProperty shim by kangax needed for Safari 2.0 support
  var _hasOwnProperty = ({}).hasOwnProperty, hasOwnProperty;
  if (typeof _hasOwnProperty !== 'undefined' && typeof _hasOwnProperty.call !== 'undefined') {
    hasOwnProperty = function (object, property) {
      return _hasOwnProperty.call(object, property);
    };
  }
  else {
    hasOwnProperty = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
      return ((property in object) && typeof object.constructor.prototype[property] === 'undefined');
    };
  }


  // ----------------------------------------------------------
  // A short snippet for detecting versions of IE in JavaScript
  // without resorting to user-agent sniffing
  // ----------------------------------------------------------
  // If you're not in IE (or IE version is less than 5) then:
  //     ie === undefined
  // If you're in IE (>=5) then you can determine which version:
  //     ie === 7; // IE7
  // Thus, to detect IE:
  //     if (ie) {}
  // And to detect the version:
  //     ie === 6 // IE6
  //     ie > 7 // IE8, IE9 ...
  //     ie < 9 // Anything less than IE9
  // ----------------------------------------------------------

  // UPDATE: Now using Live NodeList idea from @jdalton

  var ie = (function(){

    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');
    
    while (
      div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
      all[0]
    );
    
    return v > 4 ? v : undef;
    
  }()),

  iePrefixes = {
    ie:    !!ie,
    ie5:   (ie === 5),
    ie6:   (ie === 6),
    ie7:   (ie === 7),
    ie8:   (ie === 8),
    ie9:   (ie === 9),
    iegt5: (ie > 5),
    iegt6: (ie > 6),
    iegt7: (ie > 7),
    iegt8: (ie > 8),
    ielt7: (ie < 7),
    ielt8: (ie < 8),
    ielt9: (ie < 9)
  },
  checkAllIEPrefixes = function(resource) {
    var prefixes = resource.prefixes,
        pfx, k;
    
    // go through all other prefixes
    for (k = 0; k < prefixes.length; k++) {
      pfx = prefixes[k];
      // find other ie related prefixes that aren't this one
      if (hasOwnProperty(iePrefixes, pfx)) {
        // If any of the tests pass, we return true. Logical OR
        if (iePrefixes[pfx]) {
          return true;
        }
      }
    }
    return false;
  },
  i;
  
  // Add each test as a prefix
  for (i in iePrefixes) {
    if (hasOwnProperty(iePrefixes, i)) {
      // add each prefix
      yepnope.addPrefix(i, function(resource){
        // if they all all fail, set a bypass flag
        if (!checkAllIEPrefixes(resource)) {
          resource.bypass = true;
        }
        // otherwise, carry on
        return resource;
      });
    }
  }
})(this.yepnope);
/**
 * Yepnope CSS Force prefix
 * 
 * Use a combination of any prefix, and they should work
 * Usage: ['css!genStyles.php?234', 'normal-styles.css' ]
 *
 * Official Yepnope Plugin
 *
 * WTFPL License
 *
 * by Alex Sexton | AlexSexton@gmail.com
 */
( function ( yepnope ) {
  // add each prefix
  yepnope.addPrefix( 'css', function ( resource ) {
    // Set the force flag
    resource.forceCSS = true;
    //carry on
    return resource;
  } );
} )( this.yepnope );
/**
 * Yepnope AutoProtocol Filter
 * Version 1.0
 * WTFPL
 * Usage: ['//mysite.com/script.js']
 */
yepnope.addFilter(function(resource){
  // protocol adding
  if (/^\/\//.test(resource.url)) {
    resource.url = window.location.protocol + resource.url;
  }
  return resource;
});
/**
 * Yepnope AutoProtocol Filter
 * Version 1.0
 * WTFPL
 * Usage: ['//mysite.com/script.js']
 */;
yepnope.addFilter(function(resource){
  // protocol adding
  if (/^\/\//.test(resource.url)) {
    resource.url = window.location.protocol + resource.url;
  }
  return resource;
});

/**
 * Yepnope CSS Force prefix
 * 
 * Use a combination of any prefix, and they should work
 * Usage: ['css!genStyles.php?234', 'normal-styles.css' ]
 *
 * Official Yepnope Plugin
 *
 * WTFPL License
 *
 * by Alex Sexton | AlexSexton@gmail.com
 */;
( function ( yepnope ) {
  // add each prefix
  yepnope.addPrefix( 'css', function ( resource ) {
    // Set the force flag
    resource.forceCSS = true;
    //carry on
    return resource;
  } );
} )( this.yepnope );

/**
 * Yepnope IE detection prefix
 * 
 * Use a combination of any of these, and they should work
 * Usage: ['ie6!ie6styles.css', 'ie7!ie7styles.css', 'ie!allIEstyles.css', 'ie6!ie7!oldIEstyles.css']
 * Usage: ['iegt5!iebutnot5.css', 'iegt6!ieHigherThan6.css', 'iegt7!gt7.css', 'iegt8!gt8.css']
 * Usage: ['ielt7!ieLessThan7.css', 'ielt8!lt8.css', 'ielt9!lt9.css']
 * 
 * A logical OR will be applied to any combination of the supported prefixes.
 *
 * Official Yepnope Plugin
 *
 * WTFPL License
 *
 * by Alex Sexton | AlexSexton@gmail.com
 */;
(function(yepnope){

  // hasOwnProperty shim by kangax needed for Safari 2.0 support
  var _hasOwnProperty = ({}).hasOwnProperty, hasOwnProperty;
  if (typeof _hasOwnProperty !== 'undefined' && typeof _hasOwnProperty.call !== 'undefined') {
    hasOwnProperty = function (object, property) {
      return _hasOwnProperty.call(object, property);
    };
  }
  else {
    hasOwnProperty = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
      return ((property in object) && typeof object.constructor.prototype[property] === 'undefined');
    };
  }


  // ----------------------------------------------------------
  // A short snippet for detecting versions of IE in JavaScript
  // without resorting to user-agent sniffing
  // ----------------------------------------------------------
  // If you're not in IE (or IE version is less than 5) then:
  //     ie === undefined
  // If you're in IE (>=5) then you can determine which version:
  //     ie === 7; // IE7
  // Thus, to detect IE:
  //     if (ie) {}
  // And to detect the version:
  //     ie === 6 // IE6
  //     ie > 7 // IE8, IE9 ...
  //     ie < 9 // Anything less than IE9
  // ----------------------------------------------------------

  // UPDATE: Now using Live NodeList idea from @jdalton

  var ie = (function(){

    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');
    
    while (
      div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
      all[0]
    );
    
    return v > 4 ? v : undef;
    
  }()),

  iePrefixes = {
    ie:    !!ie,
    ie5:   (ie === 5),
    ie6:   (ie === 6),
    ie7:   (ie === 7),
    ie8:   (ie === 8),
    ie9:   (ie === 9),
    iegt5: (ie > 5),
    iegt6: (ie > 6),
    iegt7: (ie > 7),
    iegt8: (ie > 8),
    ielt7: (ie < 7),
    ielt8: (ie < 8),
    ielt9: (ie < 9)
  },
  checkAllIEPrefixes = function(resource) {
    var prefixes = resource.prefixes,
        pfx, k;
    
    // go through all other prefixes
    for (k = 0; k < prefixes.length; k++) {
      pfx = prefixes[k];
      // find other ie related prefixes that aren't this one
      if (hasOwnProperty(iePrefixes, pfx)) {
        // If any of the tests pass, we return true. Logical OR
        if (iePrefixes[pfx]) {
          return true;
        }
      }
    }
    return false;
  },
  i;
  
  // Add each test as a prefix
  for (i in iePrefixes) {
    if (hasOwnProperty(iePrefixes, i)) {
      // add each prefix
      yepnope.addPrefix(i, function(resource){
        // if they all all fail, set a bypass flag
        if (!checkAllIEPrefixes(resource)) {
          resource.bypass = true;
        }
        // otherwise, carry on
        return resource;
      });
    }
  }
})(this.yepnope);

/*
 * jPlayer Plugin for jQuery JavaScript Library
 * http://www.happyworm.com/jquery/jplayer
 *
 * Copyright (c) 2009 - 2010 Happyworm Ltd
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * Author: Mark J Panaghiston
 * Version: 1.2.0
 * Date: 11th July 2010
 */;

(function(c){function k(a,b){var d=function(e){e=c[a][e]||[];return typeof e=="string"?e.split(/,?\s+/):e}("getter");return c.inArray(b,d)!=-1}c.fn.jPlayer=function(a){var b=typeof a=="string",d=Array.prototype.slice.call(arguments,1);if(b&&a.substring(0,1)=="_")return this;if(b&&k("jPlayer",a,d)){var e=c.data(this[0],"jPlayer");return e?e[a].apply(e,d):undefined}return this.each(function(){var h=c.data(this,"jPlayer");!h&&!b&&c.data(this,"jPlayer",new c.jPlayer(this,a))._init();h&&b&&c.isFunction(h[a])&&
h[a].apply(h,d)})};c.jPlayer=function(a,b){this.options=c.extend({},b);this.element=c(a)};c.jPlayer.getter="jPlayerOnProgressChange jPlayerOnSoundComplete jPlayerVolume jPlayerReady getData jPlayerController";c.jPlayer.defaults={cssPrefix:"jqjp",swfPath:"js",volume:80,oggSupport:false,nativeSupport:true,preload:"none",customCssIds:false,graphicsFix:true,errorAlerts:false,warningAlerts:false,position:"absolute",width:"0",height:"0",top:"0",left:"0",quality:"high",bgcolor:"#ffffff"};c.jPlayer._config=
{version:"1.2.0",swfVersionRequired:"1.2.0",swfVersion:"unknown",jPlayerControllerId:undefined,delayedCommandId:undefined,isWaitingForPlay:false,isFileSet:false};c.jPlayer._diag={isPlaying:false,src:"",loadPercent:0,playedPercentRelative:0,playedPercentAbsolute:0,playedTime:0,totalTime:0};c.jPlayer._cssId={play:"jplayer_play",pause:"jplayer_pause",stop:"jplayer_stop",loadBar:"jplayer_load_bar",playBar:"jplayer_play_bar",volumeMin:"jplayer_volume_min",volumeMax:"jplayer_volume_max",volumeBar:"jplayer_volume_bar",
volumeBarValue:"jplayer_volume_bar_value"};c.jPlayer.count=0;c.jPlayer.timeFormat={showHour:false,showMin:true,showSec:true,padHour:false,padMin:true,padSec:true,sepHour:":",sepMin:":",sepSec:""};c.jPlayer.convertTime=function(a){var b=new Date(a),d=b.getUTCHours();a=b.getUTCMinutes();b=b.getUTCSeconds();d=c.jPlayer.timeFormat.padHour&&d<10?"0"+d:d;a=c.jPlayer.timeFormat.padMin&&a<10?"0"+a:a;b=c.jPlayer.timeFormat.padSec&&b<10?"0"+b:b;return(c.jPlayer.timeFormat.showHour?d+c.jPlayer.timeFormat.sepHour:
"")+(c.jPlayer.timeFormat.showMin?a+c.jPlayer.timeFormat.sepMin:"")+(c.jPlayer.timeFormat.showSec?b+c.jPlayer.timeFormat.sepSec:"")};c.jPlayer.prototype={_init:function(){var a=this,b=this.element;this.config=c.extend({},c.jPlayer.defaults,this.options,c.jPlayer._config);this.config.diag=c.extend({},c.jPlayer._diag);this.config.cssId={};this.config.cssSelector={};this.config.cssDisplay={};this.config.clickHandler={};this.element.data("jPlayer.config",this.config);c.extend(this.config,{id:this.element.attr("id"),
swf:this.config.swfPath+(this.config.swfPath!=""&&this.config.swfPath.slice(-1)!="/"?"/":"")+"Jplayer.swf",fid:this.config.cssPrefix+"_flash_"+c.jPlayer.count,aid:this.config.cssPrefix+"_audio_"+c.jPlayer.count,hid:this.config.cssPrefix+"_force_"+c.jPlayer.count,i:c.jPlayer.count,volume:this._limitValue(this.config.volume,0,100),autobuffer:this.config.preload!="none"});c.jPlayer.count++;if(this.config.ready!=undefined)if(c.isFunction(this.config.ready))this.jPlayerReadyCustom=this.config.ready;else this._warning("Constructor's ready option is not a function.");
this.config.audio=document.createElement("audio");this.config.audio.id=this.config.aid;c.extend(this.config,{canPlayMP3:!!(this.config.audio.canPlayType?""!=this.config.audio.canPlayType("audio/mpeg")&&"no"!=this.config.audio.canPlayType("audio/mpeg"):false),canPlayOGG:!!(this.config.audio.canPlayType?""!=this.config.audio.canPlayType("audio/ogg")&&"no"!=this.config.audio.canPlayType("audio/ogg"):false),aSel:c("#"+this.config.aid)});c.extend(this.config,{html5:!!(this.config.oggSupport?this.config.canPlayOGG?
true:this.config.canPlayMP3:this.config.canPlayMP3)});c.extend(this.config,{usingFlash:!(this.config.html5&&this.config.nativeSupport),usingMP3:!(this.config.oggSupport&&this.config.canPlayOGG&&this.config.nativeSupport)});var d={setButtons:function(g,f){a.config.diag.isPlaying=f;if(a.config.cssId.play!=undefined&&a.config.cssId.pause!=undefined)if(f){a.config.cssSelector.play.css("display","none");a.config.cssSelector.pause.css("display",a.config.cssDisplay.pause)}else{a.config.cssSelector.play.css("display",
a.config.cssDisplay.play);a.config.cssSelector.pause.css("display","none")}if(f)a.config.isWaitingForPlay=false}},e={setFile:function(g,f){try{a._getMovie().fl_setFile_mp3(f);a.config.autobuffer&&b.trigger("jPlayer.load");a.config.diag.src=f;a.config.isFileSet=true;b.trigger("jPlayer.setButtons",false)}catch(j){a._flashError(j)}},clearFile:function(){try{b.trigger("jPlayer.setButtons",false);a._getMovie().fl_clearFile_mp3();a.config.diag.src="";a.config.isFileSet=false}catch(g){a._flashError(g)}},
load:function(){try{a._getMovie().fl_load_mp3()}catch(g){a._flashError(g)}},play:function(){try{a._getMovie().fl_play_mp3()&&b.trigger("jPlayer.setButtons",true)}catch(g){a._flashError(g)}},pause:function(){try{a._getMovie().fl_pause_mp3()&&b.trigger("jPlayer.setButtons",false)}catch(g){a._flashError(g)}},stop:function(){try{a._getMovie().fl_stop_mp3()&&b.trigger("jPlayer.setButtons",false)}catch(g){a._flashError(g)}},playHead:function(g,f){try{a._getMovie().fl_play_head_mp3(f)&&b.trigger("jPlayer.setButtons",
true)}catch(j){a._flashError(j)}},playHeadTime:function(g,f){try{a._getMovie().fl_play_head_time_mp3(f)&&b.trigger("jPlayer.setButtons",true)}catch(j){a._flashError(j)}},volume:function(g,f){a.config.volume=f;try{a._getMovie().fl_volume_mp3(f)}catch(j){a._flashError(j)}}},h={setFile:function(g,f,j){a.config.diag.src=a.config.usingMP3?f:j;a.config.isFileSet&&!a.config.isWaitingForPlay&&b.trigger("jPlayer.pause");a.config.audio.autobuffer=a.config.autobuffer;a.config.audio.preload=a.config.preload;
if(a.config.autobuffer){a.config.audio.src=a.config.diag.src;a.config.audio.load()}else a.config.isWaitingForPlay=true;a.config.isFileSet=true;a.jPlayerOnProgressChange(0,0,0,0,0);clearInterval(a.config.jPlayerControllerId);if(a.config.autobuffer)a.config.jPlayerControllerId=window.setInterval(function(){a.jPlayerController(false)},100);clearInterval(a.config.delayedCommandId)},clearFile:function(){a.setFile("","");a.config.isWaitingForPlay=false;a.config.isFileSet=false},load:function(){if(a.config.isFileSet)if(a.config.isWaitingForPlay){a.config.audio.autobuffer=
true;a.config.audio.preload="auto";a.config.audio.src=a.config.diag.src;a.config.audio.load();a.config.isWaitingForPlay=false;clearInterval(a.config.jPlayerControllerId);a.config.jPlayerControllerId=window.setInterval(function(){a.jPlayerController(false)},100)}},play:function(){if(a.config.isFileSet){if(a.config.isWaitingForPlay){a.config.audio.src=a.config.diag.src;a.config.audio.load()}a.config.audio.play();b.trigger("jPlayer.setButtons",true);clearInterval(a.config.jPlayerControllerId);a.config.jPlayerControllerId=
window.setInterval(function(){a.jPlayerController(false)},100);clearInterval(a.config.delayedCommandId)}},pause:function(){if(a.config.isFileSet){a.config.audio.pause();b.trigger("jPlayer.setButtons",false);clearInterval(a.config.delayedCommandId)}},stop:function(){if(a.config.isFileSet)try{b.trigger("jPlayer.pause");a.config.audio.currentTime=0;clearInterval(a.config.jPlayerControllerId);a.config.jPlayerControllerId=window.setInterval(function(){a.jPlayerController(true)},100)}catch(g){clearInterval(a.config.delayedCommandId);
a.config.delayedCommandId=window.setTimeout(function(){a.stop()},100)}},playHead:function(g,f){if(a.config.isFileSet)try{b.trigger("jPlayer.load");if(typeof a.config.audio.buffered=="object"&&a.config.audio.buffered.length>0)a.config.audio.currentTime=f*a.config.audio.buffered.end(a.config.audio.buffered.length-1)/100;else if(a.config.audio.duration>0&&!isNaN(a.config.audio.duration))a.config.audio.currentTime=f*a.config.audio.duration/100;else throw"e";b.trigger("jPlayer.play")}catch(j){b.trigger("jPlayer.play");
b.trigger("jPlayer.pause");a.config.delayedCommandId=window.setTimeout(function(){a.playHead(f)},100)}},playHeadTime:function(g,f){if(a.config.isFileSet)try{b.trigger("jPlayer.load");a.config.audio.currentTime=f/1E3;b.trigger("jPlayer.play")}catch(j){b.trigger("jPlayer.play");b.trigger("jPlayer.pause");a.config.delayedCommandId=window.setTimeout(function(){a.playHeadTime(f)},100)}},volume:function(g,f){a.config.volume=f;a.config.audio.volume=f/100;a.jPlayerVolume(f)}};this.config.usingFlash?c.extend(d,
e):c.extend(d,h);for(var i in d){e="jPlayer."+i;this.element.unbind(e);this.element.bind(e,d[i])}if(this.config.usingFlash)if(this._checkForFlash(8))if(c.browser.msie){i='<object id="'+this.config.fid+'"';i+=' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';i+=' codebase="'+document.URL.substring(0,document.URL.indexOf(":"))+'://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"';i+=' type="application/x-shockwave-flash"';i+=' width="'+this.config.width+'" height="'+this.config.height+
'">';i+="</object>";d=[];d[0]='<param name="movie" value="'+this.config.swf+'" />';d[1]='<param name="quality" value="high" />';d[2]='<param name="FlashVars" value="id='+escape(this.config.id)+"&fid="+escape(this.config.fid)+"&vol="+this.config.volume+'" />';d[3]='<param name="allowScriptAccess" value="always" />';d[4]='<param name="bgcolor" value="'+this.config.bgcolor+'" />';i=document.createElement(i);for(e=0;e<d.length;e++)i.appendChild(document.createElement(d[e]));this.element.html(i)}else{d=
'<embed name="'+this.config.fid+'" id="'+this.config.fid+'" src="'+this.config.swf+'"';d+=' width="'+this.config.width+'" height="'+this.config.height+'" bgcolor="'+this.config.bgcolor+'"';d+=' quality="high" FlashVars="id='+escape(this.config.id)+"&fid="+escape(this.config.fid)+"&vol="+this.config.volume+'"';d+=' allowScriptAccess="always"';d+=' type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';this.element.html(d)}else this.element.html("<p>Flash 8 or above is not installed. <a href='http://get.adobe.com/flashplayer'>Get Flash!</a></p>");
else{this.config.audio.autobuffer=this.config.autobuffer;this.config.audio.preload=this.config.preload;this.config.audio.addEventListener("canplay",function(){var g=0.1*Math.random();a.config.audio.volume=(a.config.volume+(a.config.volume<50?g:-g))/100},false);this.config.audio.addEventListener("ended",function(){clearInterval(a.config.jPlayerControllerId);a.jPlayerOnSoundComplete()},false);this.element.append(this.config.audio)}this.element.css({position:this.config.position,top:this.config.top,
left:this.config.left});if(this.config.graphicsFix){this.element.append('<div id="'+this.config.hid+'"></div>');c.extend(this.config,{hSel:c("#"+this.config.hid)});this.config.hSel.css({"text-indent":"-9999px"})}this.config.customCssIds||c.each(c.jPlayer._cssId,function(g,f){a.cssId(g,f)});if(!this.config.usingFlash){this.element.css({left:"-9999px"});window.setTimeout(function(){a.volume(a.config.volume);a.jPlayerReady()},100)}},jPlayerReady:function(a){if(this.config.usingFlash){this.config.swfVersion=
a;this.config.swfVersionRequired!=this.config.swfVersion&&this._error("jPlayer's JavaScript / SWF version mismatch!\n\nJavaScript requires SWF : "+this.config.swfVersionRequired+"\nThe Jplayer.swf used is : "+this.config.swfVersion)}else this.config.swfVersion="n/a";this.jPlayerReadyCustom()},jPlayerReadyCustom:function(){},setFile:function(a,b){this.element.trigger("jPlayer.setFile",[a,b])},clearFile:function(){this.element.trigger("jPlayer.clearFile")},load:function(){this.element.trigger("jPlayer.load")},
play:function(){this.element.trigger("jPlayer.play")},pause:function(){this.element.trigger("jPlayer.pause")},stop:function(){this.element.trigger("jPlayer.stop")},playHead:function(a){this.element.trigger("jPlayer.playHead",[a])},playHeadTime:function(a){this.element.trigger("jPlayer.playHeadTime",[a])},volume:function(a){a=this._limitValue(a,0,100);this.element.trigger("jPlayer.volume",[a])},cssId:function(a,b){var d=this;if(typeof b=="string")if(c.jPlayer._cssId[a]){this.config.cssId[a]!=undefined&&
this.config.cssSelector[a].unbind("click",this.config.clickHandler[a]);this.config.cssId[a]=b;this.config.cssSelector[a]=c("#"+b);this.config.clickHandler[a]=function(h){d[a](h);c(this).blur();return false};this.config.cssSelector[a].click(this.config.clickHandler[a]);var e=this.config.cssSelector[a].css("display");if(a=="play")this.config.cssDisplay.pause=e;if(!(a=="pause"&&e=="none")){this.config.cssDisplay[a]=e;a=="pause"&&this.config.cssSelector[a].css("display","none")}}else this._warning("Unknown/Illegal function in cssId\n\njPlayer('cssId', '"+
a+"', '"+b+"')");else this._warning("cssId CSS Id must be a string\n\njPlayer('cssId', '"+a+"', "+b+")")},loadBar:function(a){if(this.config.cssId.loadBar!=undefined){var b=this.config.cssSelector.loadBar.offset();a=a.pageX-b.left;b=this.config.cssSelector.loadBar.width();this.playHead(100*a/b)}},playBar:function(a){this.loadBar(a)},onProgressChange:function(a){if(c.isFunction(a))this.onProgressChangeCustom=a;else this._warning("onProgressChange parameter is not a function.")},onProgressChangeCustom:function(){},
jPlayerOnProgressChange:function(a,b,d,e,h){this.config.diag.loadPercent=a;this.config.diag.playedPercentRelative=b;this.config.diag.playedPercentAbsolute=d;this.config.diag.playedTime=e;this.config.diag.totalTime=h;this.config.cssId.loadBar!=undefined&&this.config.cssSelector.loadBar.width(a+"%");this.config.cssId.playBar!=undefined&&this.config.cssSelector.playBar.width(b+"%");this.onProgressChangeCustom(a,b,d,e,h);this._forceUpdate()},jPlayerController:function(a){var b=0,d=0,e=0,h=0,i=0;if(this.config.audio.readyState>=
1){b=this.config.audio.currentTime*1E3;d=this.config.audio.duration*1E3;d=isNaN(d)?0:d;e=d>0?100*b/d:0;if(typeof this.config.audio.buffered=="object"&&this.config.audio.buffered.length>0){h=100*this.config.audio.buffered.end(this.config.audio.buffered.length-1)/this.config.audio.duration;i=100*this.config.audio.currentTime/this.config.audio.buffered.end(this.config.audio.buffered.length-1)}else{h=100;i=e}}!this.config.diag.isPlaying&&h>=100&&clearInterval(this.config.jPlayerControllerId);a?this.jPlayerOnProgressChange(h,
0,0,0,d):this.jPlayerOnProgressChange(h,i,e,b,d)},volumeMin:function(){this.volume(0)},volumeMax:function(){this.volume(100)},volumeBar:function(a){if(this.config.cssId.volumeBar!=undefined){var b=this.config.cssSelector.volumeBar.offset();a=a.pageX-b.left;b=this.config.cssSelector.volumeBar.width();this.volume(100*a/b)}},volumeBarValue:function(a){this.volumeBar(a)},jPlayerVolume:function(a){if(this.config.cssId.volumeBarValue!=null){this.config.cssSelector.volumeBarValue.width(a+"%");this._forceUpdate()}},
onSoundComplete:function(a){if(c.isFunction(a))this.onSoundCompleteCustom=a;else this._warning("onSoundComplete parameter is not a function.")},onSoundCompleteCustom:function(){},jPlayerOnSoundComplete:function(){this.element.trigger("jPlayer.setButtons",false);this.onSoundCompleteCustom()},getData:function(a){for(var b=a.split("."),d=this.config,e=0;e<b.length;e++)if(d[b[e]]!=undefined)d=d[b[e]];else{this._warning("Undefined data requested.\n\njPlayer('getData', '"+a+"')");return}return d},_getMovie:function(){return document[this.config.fid]},
_checkForFlash:function(a){var b=false,d;if(window.ActiveXObject)try{new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+a);b=true}catch(e){}else if(navigator.plugins&&navigator.mimeTypes.length>0)if(d=navigator.plugins["Shockwave Flash"])if(navigator.plugins["Shockwave Flash"].description.replace(/.*\s(\d+\.\d+).*/,"$1")>=a)b=true;return b},_forceUpdate:function(){this.config.graphicsFix&&this.config.hSel.text(""+Math.random())},_limitValue:function(a,b,d){return a<b?b:a>d?d:a},_flashError:function(a){this._error("Problem with Flash component.\n\nCheck the swfPath points at the Jplayer.swf path.\n\nswfPath = "+
this.config.swfPath+"\nurl: "+this.config.swf+"\n\nError: "+a.message)},_error:function(a){this.config.errorAlerts&&this._alert("Error!\n\n"+a)},_warning:function(a){this.config.warningAlerts&&this._alert("Warning!\n\n"+a)},_alert:function(a){alert("jPlayer "+this.config.version+" : id='"+this.config.id+"' : "+a)}}})(jQuery);
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
			url: 'config.json',
			async: false,
			cache: false,
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
			dataType: 'html',
			success: function(data) {
				
				var myData = data,
					myHtml = [],
					h = -1,
					maQuote = myData.split('":"'),
					monAuthor = myData.split('"author":"');
				
				maQuote = maQuote[1].split('","');
				maQuote = maQuote[0];
				maQuote = maQuote.replace(/\\/g,' ');
				window.console.log("maQuote = ", maQuote);
				monAuthor = monAuthor[1].split('","permalink');
				monAuthor = monAuthor[0];

				myHtml[++h] = '<blockquote id="qod-quote">';
				myHtml[++h] = '<p class="qod-text">';
				myHtml[++h] = maQuote;
				myHtml[++h] = '</p>';
				myHtml[++h] = '<p class="qod-author"><a title="author"> &mdash; ';
				myHtml[++h] = monAuthor;
				myHtml[++h] = '</a></p></blockquote>';
				domQuote = myHtml.join('');
				$('#quote').html(domQuote);
				
				/*
				$('#title_general').css('padding', function() {
					var monPadding;
					monPadding = $('#quote').innerHeight;
					return (monPadding<129 ? '128px 8px 32px 96px' : monPadding+'px 8px 32px 96px');
				});
				*/
			},
			error: function(jqXHR, textStatus, errorThrown) {}
		});

		ddfrttw.config.path = path;

		ddfrttw.address.init();
		ddfrttw.require.init();				
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
			e.preventDefault();
			if (href.indexOf('http://') > -1) {
				// looks like we requested the index in IE6, rewrite the href accordingly
				href = href.substring(8);
				href = href.substring(href.indexOf(ddfrttw.config.path));
			}
			
			// go to the normal address engine
			ddfrttw.address.change(urlEncode(href));
		});
		ddfrttw.loading.stop();
	}
	ddfrttw.showContent = function() {
		
		window.console.log("SHOWCONTENT\n globalContent = "+ddfrttw.globalContent);
		var myContentWrapper = $('#container');
		//myContent.detach().empty();
		var ln = arguments.length, i;
		for(i = 0; i < ln; i++) {
			window.console.log(" dans FOR :");
			window.console.log("---- >arguments[i]  = ",arguments[i]);
			//arguments[i].appendTo(myContentWrapper);
		}
		window.console.log(" sortie de for :");
		//globalHeader.after($('#container'));
	}
	ddfrttw.error = function() {
		window.console.log(ddfrttw.strings.getString('errors.unknown'));
	}
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
			window.console.log("LOADING init\n ddfrttw.strings.getString('messages.loading') = "+ddfrttw.strings.getString('messages.loading'));
			elem.text(ddfrttw.strings.getString('messages.loading'));
		},
		reinit: function() {
			window.console.log("LOADING reinit");
			nb = 0;
			ddfrttw.loading.hide();
		},
		show: function() {
			elem.show();
		},
		hide: function() {
			elem.hide();
		},
		start: function() {
			window.console.log("LOADING start");
			if (nb == 0)
				ddfrttw.loading.show();
			nb++;
		},
		stop: function() {
			window.console.log("LOADING stop");
			nb = Math.max(nb-1, 0);
			if (nb == 0) {
				ddfrttw.loading.hide();
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
* require
*/
(function() {
	ddfrttw.require = function(modules, clb) {
		var mod = [];
		$.each(modules, function(i, v) {
			mod.push('js/ddfrttw.'+v+'.js');
		});
		require(mod, clb); // to use once the require engine i set up
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
			window.console.log("INIT ddfrttw.config.path : "+ddfrttw.config.path);
			ddfrttw.loading.start();
			$.address
				.init(function() {
					ddfrttw.loading.stop();
				})
				.tracker(null)	// disable the tracking for jquery address
				.change(function(e) {
					window.console.log("CHANGE\n e : ",e.value);
					ddfrttw.loading.reinit();
					if ($.isFunction(callBeforeChange)) {
						callBeforeChange();
						callBeforeChange = null;
					}
					var val = e.value;
					switch(e.pathNames[pathNumber]) {
						case 'index.html':
							window.console.log("CHANGE case index\n e.pathNames[pathNumber] = "+e.pathNames[pathNumber]);
							ddfrttw.require(['page', 'scroller'], function() {
								ddfrttw.page.show(val);
							});
							break;
						case 'cv.html':
							window.console.log("CHANGE case cv\n e.pathNames[pathNumber] = "+e.pathNames[pathNumber]);
							ddfrttw.require(['page', 'scroller'], function() {
								ddfrttw.page.show(val);
							});
							break;
						case 'contact.html':
							window.console.log("CHANGE case contact\n e.pathNames[pathNumber] = "+e.pathNames[pathNumber]);
							ddfrttw.require(['page', 'scroller'], function() {
								ddfrttw.page.show(val);
							});
							break;
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
	};

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
			window.console.log("AJAX LOAD REQUEST");
			// encode uri component for the URL
			if ((!opts['type'] || opts['type']!='post') && opts.success) {
				var cached = getCache(opts.url),
					success = opts.success;
				if (cached) {
					// request in cache !
					if ($.isFunction(opts.success)) {
						window.console.log("CACHE REQUEST");
						opts.success.call(opts, cached, statusSuccess, {readyState: 4});
						window.console.log("-------- SUCCESS CACHE REQUEST");
						return;
					}
				} else {
					opts.success = function(data, status, xhr) {
						window.console.log("AJAX REQUEST");
						if (status == statusSuccess && xhr.readyState == 4) {
							cached = ddfrttw.ajax.addCache(opts.url, xhr.responseText);
							success.call(opts, cached, statusSuccess, {readyState: 4})
							window.console.log("-------- SUCCESS AJAX REQUEST");
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
			window.console.log("AJAX ADDCACHE REQUEST");
			if (isIE) {
				data = innerShiv(data, false);
			}
			cache[url] = $(data);
			return cache[url];
		},
		clear: function() {
			$.each(queue, function(ind, val) {
				if (val)
					val.abort();
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
