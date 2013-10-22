require.config({
	baseUrl : "../geobricks-js/modules",
	paths : {
		"jquery" : "http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min"
	}
});

require([ "jquery", "message-bus", "css-loader" ], function($, bus) {
	bus.send("css-load", "main.css");
});
