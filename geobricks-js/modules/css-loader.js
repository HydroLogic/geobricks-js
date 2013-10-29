/**
 * Requirejs does not load css. Either we put it here, either in the HTML. See
 * http://requirejs.org/docs/faq-advanced.html#css
 * 
 * This is more modular, but the CSS may take time to load.
 * 
 * Listens:
 *   - css-load
 * 			Adds a 'link' tag with the CSS path to the DOM.
 * 		@param url string
 * 		
 * 		Send example: bus.send("css-load", "css/style.css");
 */
define([ "message-bus" ], function(bus) {
	function add(cssURL) {
		var link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = cssURL;
		document.getElementsByTagName("head")[0].appendChild(link);
	}

	bus.listen("css-load", function(event, cssURL) {
		add(cssURL);
	});

	return {
		initModule : function(css, defaultCss) {
			var toAdd = css ? css : defaultCss;
			for (var i = 0; i < toAdd.length; i++) {
				add(toAdd[i]);
			}
		}
	};
});
