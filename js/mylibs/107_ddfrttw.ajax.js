(function () {
	var cache = [],
		queue = [],
		statusSuccess = 'success',
		isIE = BrowserDetect.isIE();

	function getCache(url) {
		if (cache[url])
			return cache[url];
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
			// encode uri component for the URL
			if ((!opts['type'] || opts['type']!='post') && opts.success && opts.url.indexOf('/json') == -1) {
				var cached = getCache(opts.url),
					success = opts.success;
				if (cached) {
					// request in cache !
					if ($.isFunction(opts.success)) {
						opts.success.call(opts, cached, statusSuccess, {readyState: 4});
						return;
					}
				} else {
					opts.success = function(data, status, xhr) {
						if (status == statusSuccess && xhr.readyState == 4) {
							cached = ddfrttw.ajax.addCache(opts.url, xhr.responseText);
							success.call(opts, cached, statusSuccess, {readyState: 4})
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
				if (val)
					val.abort();
			});
			queue = [];
		}
	};
})();
