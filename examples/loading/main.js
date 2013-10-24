require.config({
	baseUrl : "../geobricks-js/modules",
	paths : {
		"jquery" : "http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min",
		"jquery-ui" : "http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min",
		"spin" : "../lib/spin.min",
		"jquery.spin" : "../lib/jquery.spin"
	},
	shim : {
		"jquery-ui" : {
			deps : [ "jquery" ],
			exports : "jquery-ui"
		}
	}
});

require([ "message-bus", "page-loader" ], function(bus) {
	bus.send("load-pending");
	setTimeout(function() {
		bus.send("load-finished");
	}, 3 * 1000);
});
