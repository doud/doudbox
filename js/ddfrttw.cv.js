/*
(function (window, document) {
//window.console.log(" ########## CV ##########");
//window.console.log(" ########## CV ##########");	
if ('open' in document.createElement('details')) {return; }
 
// made global by myself to be reused elsewhere
var addEvent = (function () {
  if (document.addEventListener) {
	//window.console.log(" if doc addEvent listener");
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.addEventListener(type, fn, false);
		//window.console.log("-- if el && el.nodeName || el === window\n -- el = ", el);
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
			//window.console.log("-- else if el && el.length / for\n -- el[i] = ", el[i]);
        }
      }
    };
  } else {
	//window.console.log(" else doc addEvent listener");
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
			//window.console.log("-- if :: el && el.nodeName || el === window\n -- el = ", el);
        	el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
      } else if (el && el.length) {
        	for (var i = 0; i < el.length; i++) {
				//window.console.log("-- else if el && el.length / for\n -- el[i] = ", el[i]);
          		addEvent(el[i], type, fn);
        }
      }
    };
  }
})();
  
 
// details support - typically in it's own script
// find the first /real/ node
function firstNode(source) {
	//window.console.log(" ++ first node");
  var node = null;
  if (source.firstChild.nodeName != "#text") {
    return source.firstChild; 
  } else {
    source = source.firstChild;
    do {
      source = source.nextSibling;
    } while (source && source.nodeName == '#text');
 
    return source || null;
  }
}
 
function isSummary(el) {
	//window.console.log(" ++ isSummary");
  var nn = el.nodeName.toUpperCase();
  if (nn == 'DETAILS') {
	//window.console.log(" if nn= DETAILS");
    return false;
  } else if (nn == 'SUMMARY') {
	//window.console.log(" els if nn= SUMMARY");
    return true;
  } else {
	//window.console.log(" els return parent node");
    return isSummary(el.parentNode);
  }
}
 
function toggleDetails(event) {
	//window.console.log(" ++ toggleDetails\nenter");
	// more sigh - need to check the clicked object
	var keypress = event.type == 'keypress',
		target = event.target || event.srcElement;
	if (keypress || isSummary(target)) {
		if (keypress) {
		// if it's a keypress, make sure it was enter or space
		keypress = event.which || event.keyCode;
		if (keypress == 32 || keypress == 13) {
        	//window.console.log(" ++ toggleDetails\ndans toggle keypress :: if 32 ou 13");
		} else {
        	//window.console.log(" ++ toggleDetails\ndans toggle keypress :: else 32 ou 13");
			return;
		}
	}
 
    var open = this.getAttribute('open');
    if (open === null) {
      this.setAttribute('open', 'open');
	//window.console.log(" ++ toggleDetails\nif open===null ++ setAttribute");
    } else {
      this.removeAttribute('open');
	//window.console.log(" ++ toggleDetails\nelse open===null ++ setAttribute");
    }
    
    // this.className = open ? 'open' : ''; // Lame
    // trigger reflow (required in IE - sometimes in Safari too)
    setTimeout(function () {
      document.body.className = document.body.className;
    }, 13);
    
    if (keypress) {
      event.preventDefault && event.preventDefault();
	//window.console.log(" ++ toggleDetails\nif (keypress)");
      return false;
    }
  }
}
 
function addStyle() {
	//window.console.log(" ++ addStyle :: debut");
  var style = document.createElement('style'),
      head = document.getElementsByTagName('head')[0],
      key = style.innerText === undefined ? 'textContent' : 'innerText';
      
  var rules = ['details{display: block;}','details > *{display: none;}','details.open > *{display: block;}','details[open] > *{display: block;}','details > summary:first-child{display: block;cursor: pointer;}','details[open]{display: block;}'];
      i = rules.length;
  
  style[key] = rules.join("\n");
  head.insertBefore(style, head.firstChild);
}
 
var details = document.getElementsByTagName('details'), 
    wrapper,
    i = details.length, 
    j,
    first = null, 
    label = document.createElement('summary');

	//window.console.log(" ++ addStyle vars =\n - details = "+details+"\n - wrapper = "+wrapper+"\n - i = "+i+"\n - j = "+j+"\n - label = "+label+"\n---- end variables addstyle ");
 
label.appendChild(document.createTextNode('details'));
	//window.console.log(" ++ addStyle post appendChild details")
while (i--) {
	//window.console.log(" ++ addStyle#\n  while (i--)\n  i = ",i);
	first = firstNode(details[i]);
	//window.console.log(" ++ addStyle#\n  while (i--)\n  i = ",i);
 
  if (first != null && first.nodeName.toUpperCase() == 'SUMMARY') {
	//window.console.log(" ++ addStyle#\n  while (i--)\n  i = ",i);
    // we've found that there's a details label already
  } else {
    // first = label.cloneNode(true); // cloned nodes weren't picking up styles in IE - random
    first = document.createElement('summary');
    first.appendChild(document.createTextNode('details'));
    if (details[i].firstChild) {
      details[i].insertBefore(first, details[i].firstChild);
    } else {
      details[i].appendChild(first);
    }
  }
 
  // this feels *really* nasty, but we can't target details :text in css :(
  j = details[i].childNodes.length;
  while (j--) {
	//window.console.log(" ++ addStyle#\n  while (j--)\n  j = ",j);
    if (details[i].childNodes[j].nodeName === '#text' && (details[i].childNodes[j].nodeValue||'').replace(/\s/g, '').length) {
      wrapper = document.createElement('text');
      wrapper.appendChild(details[i].childNodes[j]);
      details[i].insertBefore(wrapper, details[i].childNodes[j]);
    }
  }
  
  first.legend = true;
  first.tabIndex = 0;
}
 
// trigger details in case this being used on it's own
document.createElement('details');
addEvent(details, 'click', toggleDetails);
addEvent(details, 'keypress', toggleDetails);
addStyle();
//window.console.log(" ########### END CV ##############");
 
})(window, document);
*/
(function() {
	ddfrttw.cv = {
		show: function(url) {
			//window.console.log(">>>>>>>>>>>>>>>>> PAGE SHOW");
			var urlToLoad = url;
			//window.console.log("---- urlToLoad = ",urlToLoad);
			ddfrttw.ajax.load({
				url: urlToLoad,
				dataType: 'html',
				success: function(data) {

					//window.console.log("\nddfrttw.ajax.load SUCCESS from ddfrttw.page.show");
					//window.console.log("---- data = ", data);
					//window.console.log("---- going to showContent\n");
					var tmp = url.split('/'),
						ids = tmp[tmp.length-1],
						tabId = ids.split('.'),
						id = tabId[0];
					ddfrttw.body.attr('id', id);
					tmp = id = null;
					delete(tmp);
					delete(id);

					ddfrttw.showContent(data);

					ddfrttw.loading.stop();
					//window.console.log(">>>>>>>>>>>>>>>>> END PAGE SHOW");
				},
				error: function() {
					ddfrttw.error();
					ddfrttw.loading.stop();
				}
			});
		}
	};
})();