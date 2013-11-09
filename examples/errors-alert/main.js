require.config({
	baseUrl : "../geobricks-js/modules",
	paths : {
		"jquery" : "http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min"
	}
});

require([ "jquery", "message-bus", "errors-alert" ], function($, bus) {
	var button = $("<button>Click me for an error!</button>");
	$("body").append(button);
	button.click(function() {
		bus.send("alert", [ "An 'unexpected' error has occurred", "danger" ]);
	});
});
