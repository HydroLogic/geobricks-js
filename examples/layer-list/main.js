require.config({
	baseUrl : "../geobricks-js/modules",
	paths : {
		"jquery" : "http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min",
		"jquery-ui" : "http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min",
		"fancy-box" : "../lib/jquery.fancybox.pack"
	}
});

require([ "jquery", "message-bus", "css-loader", "layer-list" ], function($, bus) {
	// Required styles
	bus.send("css-load", "../geobricks-js/styles/jquery-ui-1.8.16.custom.css");
	bus.send("css-load", "../geobricks-js/styles/jquery.fancybox.css");
	bus.send("css-load", "../geobricks-js/styles/layer-list.css");

	// Initialize layer list
	var body = $("body");

	var div = $("<div/>").attr("id", "layers_container");
	body.append(div);
	bus.send("init-layerlist", [ div ]);

	// Add groups
	bus.send("add-group", {
		name : "Group 1",
		id : "g1"
	});
	bus.send("add-group", {
		name : "Group 2",
		id : "g2"
	});

	// Add layers
	bus.send("add-layer", {
		groupId : "g1",
		name : "layer1",
		id : "layer1",
		visible : true
	});
	bus.send("add-layer", {
		groupId : "g2",
		name : "layer2",
		id : "layer2",
		visible : false
	});

	// Listen to visibility events
	var p = $("<p/>");
	$("body").append(p);
	bus.listen("layer-visibility", function(event, layerId, visibility) {
		p.text("Layer " + layerId + " visibility: " + visibility);
	});
});
