define([ "jquery", "time-slider", "message-bus", "layer-list", "olmap" ], function($, timeSlider, bus) {
	var body = $("body");

	var map = $("<div/>").attr("id", "center");
	body.append(map);
	bus.send("init-map", [ map ]);

	var divLayersContainer = $("<div/>").attr("id", "layers_container");
	body.append(divLayersContainer);
	bus.send("init-layerlist", [ divLayersContainer ]);

	var divButtonAdd = $("<div/>").attr("id", "add-point-button");
	body.append(divButtonAdd);
	bus.send("init-add-point", [ divButtonAdd ]);

	var divTimeSlider = $("<div/>").attr("id", "time_slider_pane");
	timeSlider("unique-slider", divTimeSlider);
	body.append(divTimeSlider);

	bus.send("time-slider.add-timestamp.unique-slider", "2001-2-23");
	bus.send("time-slider.add-timestamp.unique-slider", "2003-5-12");
});