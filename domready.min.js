var domready = function (readyFunc) {

	var ready, flush, fns = [], fn, f = false
	, doc = document
	, testEl = doc.documentElement
	, hack = testEl.doScroll
	, domContentLoaded = 'DOMContentLoaded'
	, addEventListener = 'addEventListener'
	, onreadystatechange = 'onreadystatechange'
	, readyState = 'readyState'
	, loadedRgx = hack ? /^loaded|^c/ : /^loaded|c/
	, loaded = loadedRgx.test(doc[readyState]);
	
	flush = function (f) {
		loaded = 1;
		while (f = fns.shift()) {
			f();
		}
	}
	
	if(doc[addEventListener]){
		fn = function () {
			flush();
			doc.removeEventListener(domContentLoaded, fn, f);
		}
		doc[addEventListener]( domContentLoaded, fn, f );
						
		ready = function (fref) {
			loaded ? fref() : fns.push(fref);
		}
	}

	if(hack){
		fn = function () {
			if (/^c/.test(doc[readyState])) {
				doc.detachEvent(onreadystatechange, fn);
				flush();
			}
		}
		doc.attachEvent( onreadystatechange, fn);
		ready = function(fref){
			if(self != top){
				loaded ? fref() : fns.push(fref);
			} else {
				try {
					testEl.doScroll('left');
				} catch (e) {
					return setTimeout(function() { ready(fref) }, 50);
				}
				fref();
			}
		}
	}
	
	return ready(readyFunc);
}