require.config({
	baseUrl : "../geobricks-js/modules",
	paths : {
		jquery : "http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min",
		bootstrap : "../lib/bootstrap.min"
	},
	shim : {
		"bootstrap" : {
			deps : [ "jquery" ],
			exports : "Bootstrap"
		}
	}
});

require([ "jquery", "message-bus", "alerts-bootstrap" ], function($, bus) {
	var body = $("body");

	function addButton(type) {
		var button = $("<button>Click me for " + type + "</button>");
		body.append(button);
		button.click(function() {
			bus.send("alert", [  "This is a " + type + " message", type ]);
		});
	}
	
	addButton("success");
	addButton("info");
	addButton("warning");
	addButton("danger");

	var div = $("<div/>").attr("id", "errors");
	body.append(div);
	bus.send("init-alerts", [ div ]);
});
