/*
 * ====================
 * Dom Ready
 * ====================
 * Modified (converted to singleton, commented and made the code readable by mortals)
 * by Mike Gieson
 * http://www.gieson.com
 * https://github.com/bobtherobot/domready
 * 
 * Original (core) 
 * by Dustin Diaz
 * http://dustindiaz.com
 * https://github.com/ded/domready
*/


(function() {
	
var ready = function () {

	var user, flush, fns = [], fn, f = false
	, doc 		= document
	, testEl 	= doc.documentElement
	, hack 		= testEl.doScroll
	, domContentLoaded 		= 'DOMContentLoaded'
	, addEventListener 		= 'addEventListener'
	, onreadystatechange 	= 'onreadystatechange'
	, readyState 			= 'readyState'
	, loadedRgx = hack ? /^loaded|^c/ : /^loaded|c/
	, loaded 	= loadedRgx.test(doc[readyState]);
	
	
	// This will get called when the page is ready.
	flush = function (f) {
		
		// Flag that we're ready
		loaded = 1;
		
		// Remove each function, then call it... very tricky ded!
		while (f = fns.shift()) {
			f();
		}
	}
	
	// -------------
	// W3C
	// -------------
	if(doc[addEventListener]){
		
		fn = function () {
			
			// Remove this function.
			doc.removeEventListener(domContentLoaded, fn, f);
			
			// Run the functions.
			flush();

		}
		
		// Add the event listener
		doc[addEventListener]( domContentLoaded, fn, f );
		
		// This is what we'll expose for users to call.
		user = function (fref) {
			
			// Call immediately or store until we flush.
			loaded ? fref() : fns.push(fref);
		}
		
	}
	
	// -------------
	// MSIE
	// -------------
	if(hack){
		
		fn = function () {
			
			// document.readyState can be "loading", "loaded", "Complete", or "interaCtive"
			// Test against "c"... very tricky ded!
			if (/^c/.test(doc[readyState])) {
				doc.detachEvent(onreadystatechange, fn);
				flush();
			}
		}
		
		// Add the event listener - MSIE way.
		doc.attachEvent( onreadystatechange, fn);
		
		// This is what we'll expose for users to call.
		user = function(fref){
			
			// Frames and iFrames honor onreadystatechange?
			if(self != top){
				loaded ? fref() : fns.push(fref);
			
			// ... whereas a normal page does not?
			} else {
				try {
					
					// Will produce errors until the document is completely loaded
					testEl.doScroll('left');
				} catch (e) {
					
					// ... so continue to poll until no errors.
					return setTimeout(function() { user(fref) }, 50);
				}
				
				// We'll only make it here if no errors.
				fref();
			}
		}
	
	}
	
	// Expose the "user" function for users to interact with.
	return user;
	
}

// Namespace. Change "domready" to whatever you think wont clash.
// You can also change "window" to "this" (or whatever) to include 
// within the context of another class or object.
window.domready = ready();
}());