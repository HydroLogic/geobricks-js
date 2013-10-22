require.config({
	baseUrl : "../geobricks-js/modules",
	paths : {
		"jquery" : "http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min",
		"jquery-ui" : "http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min"
	}
});

require([ "jquery", "message-bus", "time-slider", "css-loader" ], function($, bus, timeSlider) {
	bus.send("css-load", "../geobricks-js/styles/jquery-ui-1.8.16.custom.css");

	var body = $("body");
	var divTimeSlider = $("<div/>").attr("id", "time_slider_pane");
	timeSlider("unique-slider", divTimeSlider);
	body.append(divTimeSlider);

	bus.send("time-slider.add-timestamp.unique-slider", "2001-2-23");
	bus.send("time-slider.add-timestamp.unique-slider", "2003-5-12");

	var p = $("<p/>");
	body.append(p);
	bus.listen("time-slider.selection.unique-slider", function(event, date) {
		p.text("The date is: " + date);
	});
});
