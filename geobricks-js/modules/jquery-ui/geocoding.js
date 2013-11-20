define([ "jquery", "message-bus", "geocoding-engine", "i18n", "layout", "module", "alerts", "jquery-ui", "spin", "jquery.spin" ], function($, bus, geocoding, i18n, Layout, module) {
	var config = module.config();

	// Spin options
	var spinOpts = config.spinOpts;
	if (!spinOpts) {
		spinOpts = {
			lines : 7, // The number of lines to draw
			length : 5, // The length of each line
			width : 2, // The line thickness
			radius : 2, // The radius of the inner circle
			corners : 1, // Corner roundness (0..1)
			rotate : 0, // The rotation offset
			direction : 1, // 1: clockwise, -1: counterclockwise
			color : '#000',
			speed : 1, // Rounds per second
			trail : 60, // Afterglow percentage
			shadow : false, // Whether to render a shadow
			hwaccel : false, // Whether to use hardware acceleration
			zIndex : 2e9, // The z-index (defaults to 2000000000)
		};
	}

	var container = $("#" + Layout.geocoding);

	// Layout
	var input = $("<input type='text' placeholder='Addresssuche'>");
	var searching = $("<div/>").spin(spinOpts);
	var inputDiv = $("<div/>");
	var resultsDiv = $("<div/>");
	var resultsTitle = $("<div>Results</div>").attr("id", "geocoding-title");
	var resultsClose = $("<div/>");
	var resultsList = $("<ul/>");
	var icon = $("<div/>");

	inputDiv.append(icon);
	inputDiv.append(input);
	inputDiv.append(searching);

	resultsDiv.append(resultsTitle);
	resultsDiv.append(resultsClose);
	resultsDiv.append(resultsList);

	resultsDiv.draggable({
		handle : "#geocoding-title"
	});
	resultsDiv.resizable({
		handles : "n, e, s, w, ne, nw, se, sw"
	});
	resultsDiv.find("div.ui-resizable-se").removeClass("ui-icon-gripsmall-diagonal-se");
	resultsDiv.find("div.ui-resizable-se").removeClass("ui-icon");

	container.append(inputDiv);
	container.append(resultsDiv);

	// CSS
	container.addClass("geocoding-container");
	searching.addClass("geocoding-searching");
	input.addClass("geocoding-input");
	inputDiv.addClass("geocoding-input-div");
	icon.addClass("geocoding-input-icon");
	resultsDiv.addClass("geocoding-results");
	resultsTitle.addClass("geocoding-results-title");
	resultsClose.addClass("geocoding-results-close");
	resultsList.addClass("geocoding-results-list");

	// Visibility
	searching.hide();
	resultsDiv.hide();

	function createResult(result, div) {
		var li = $("<li/>").text(result.address);
		li.addClass("geocoding-result");
		li.click(function() {
			bus.send("center-map", [ result ]);
			console.log(resultsDiv);
			resultsDiv.hide();
		});
		return li;
	}

	// Events
	function success(r) {
		var results = $.grep(r, function(value, index) {
			if (!config.bounds) {
				return true;
			}

			var b = config.bounds;
			return value.left > b.left && value.right < b.right && value.top < b.top && value.bottom > b.bottom;
		});

		searching.hide();
		icon.show();
		resultsList.empty();
		resultsDiv.hide();
		if (results.length == 0) {
			bus.send("alert", [ i18n("No results"), "warning" ]);
		} else if (results.length == 1) {
			bus.send("center-map", [ results[0] ]);
		} else {
			for (var i = 0; i < results.length; i++) {
				resultsList.append(createResult(results[i], resultsDiv));
			}

			resultsDiv.show();
			resultsList.scrollTop(0);
		}
	}

	function error(message) {
		searching.hide();
		bus.send("alert", [ message, "danger" ]);
	}

	function search() {
		searching.show();
		icon.hide();
		geocoding.search(input.val(), success, error);
	}

	input.keypress(function(e) {
		if (e.keyCode == 13) {
			search();
		}
	});
	icon.click(function() {
		search();
	});
	resultsClose.click(function() {
		resultsDiv.hide();
	});
});
