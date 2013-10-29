require.config({
	baseUrl : "../geobricks-js/modules",
	paths : {
		jquery : "http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min",
		bootstrap : "../lib/bootstrap.min",
		openlayers : "http://openlayers.org/dev/OpenLayers",
		olmap : "../../geocoding/olmap",
		"jquery-ui" : "http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min",
		"spin" : "../lib/spin.min",
		"jquery.spin" : "../lib/jquery.spin",
	},
	map : {
		'*' : {
			"geocoding-engine" : "geocoding-engine-google",
			"alerts" : "alerts-bootstrap"
		}
	},
	shim : {
		"bootstrap" : {
			deps : [ "jquery" ],
			exports : "Bootstrap"
		}
	}
});

require([ "jquery", "message-bus", "geocoding", "alerts-bootstrap", "olmap" ], function($, bus, geocoding) {
	var body = $("body");
	var center = $("<div/>").attr("id", "center");

	var geocodingDiv = $("<div/>");
	geocoding("id", geocodingDiv);
	center.append(geocodingDiv);

	var divAlerts = $("<div/>");
	body.append(divAlerts);
	divAlerts.addClass("alerts-container");
	bus.send("init-alerts", [ divAlerts ]);

	body.append(center);
	bus.send("init-map", [ center ]);
});
