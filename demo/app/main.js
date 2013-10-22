require.config({
	baseUrl : "geobricks-js/modules",
	paths : {
		"jquery" : "http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min",
		"jquery-ui" : "http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min",
		"openlayers" : "http://openlayers.org/dev/OpenLayers",
		"bootstrap" : "../lib/bootstrap.min",
		"fancy-box" : "../lib/jquery.fancybox.pack",
		"layout" : "../../app/layout",
		"olmap" : "../../app/olmap"
	},
	shim : {
		"bootstrap" : {
			deps : [ "jquery" ],
			exports : "Bootstrap"
		}
	}
});

require([ "jquery", "message-bus", "css-loader", "layout", "alerts-bootstrap" ], function($, bus) {
	bus.send("css-load", "geobricks-js/styles/jquery-ui-1.8.16.custom.css");
	bus.send("css-load", "geobricks-js/styles/jquery.fancybox.css");
	bus.send("css-load", "geobricks-js/styles/layer-list.css");

	bus.send("add-group", {
		"id" : "basic",
		"name" : "Basic layers"
	});

	bus.send("add-layer", {
		"id" : "blumarble",
		"groupId" : "basic",
		"url" : "http://rdc-snsf.org/diss_geoserver/wms",
		"wmsName" : "common:blue_marble",
		"name" : "Blue marble",
		"infoLink" : "http://rdc-snsf.org/static/loc/en/html/bluemarble_def.html",
		"visible" : "true"
	});

	bus.send("initial-zoom");
});
