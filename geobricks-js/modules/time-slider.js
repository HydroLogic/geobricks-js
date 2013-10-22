/**
 * This module returns a function for creating a new time slider with the 
 * following parameters:
 *		- id: slider identifier.
 *      - div: where the slider should be added.
 * 
 * Listens:
 *   - time-slider.add-timestamp.<id>
 * 			Adds the given timestamp to the slider.
 * 		@param timestamp - string
 * 		
 * 		Send example: bus.send("time-slider.add-timestamp.id0", ""2001-2-23");
 * 
 * 
 * Sends:
 *   - time-slider.selection.*<id>*
 * 			When the slider value is changed.
 * 		@param date - the new value of the slider.
 */
define([ "jquery", "message-bus", "module", "jquery-ui", "iso8601" ], function($, bus, module) {
	var timestamps = [];

	var getLocalizedDate = function(date) {
		var defaultMonths = [ "Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sep.", "Oct.", "Nov.", "Dec." ];
		var months = module.config().months;
		months = months ? eval(months) : defaultMonths;
		var arr = date.split("-");
		if (arr[1]) {
			arr[1] = months[arr[1] - 1];
		}
		return arr.reverse().join(" ");
	};

	return function(id, div) {
		var divTimeSlider = $("<div/>").attr("id", "time_slider_" + id);
		var divTimeSliderLabel = $("<div/>").attr("id", "time_slider_label_" + id);

		function update(event, ui) {
			var d = new Date();
			d.setISO8601(timestamps[ui.value]);
			divTimeSliderLabel.text(getLocalizedDate(timestamps[ui.value]));
			bus.send("time-slider.selection." + id, d);
		}

		divTimeSlider.slider({
			change : update,
			slide : update
		});
		divTimeSlider.slider("option", "min", 0);
		divTimeSlider.slider("option", "max", 0);

		div.append(divTimeSlider);
		div.append(divTimeSliderLabel);

		bus.listen("time-slider.add-timestamp." + id, function(event, timestamp) {
			var d = new Date();
			if (d.setISO8601(timestamp)) {
				timestamps.push(timestamp);
				timestamps.sort();
			}

			divTimeSlider.slider("option", "max", timestamps.length - 1);
			divTimeSlider.slider("value", timestamps.length - 1);
		});
	};
});
