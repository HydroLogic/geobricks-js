define([ "jquery", "message-bus", "geocoding-engine", "i18n", "css-loader", "module", "require", "alerts", "jquery-ui", "spin", "jquery.spin" ], function($, bus, geocoding, i18n, cssLoader, module, require) {
	var config = module.config();

	var defaultCss = [ "../styles/geocoding.css" ];
	cssLoader.initModule(config.css, defaultCss.map(require.toUrl));

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

	function createResult(id, result, div) {
		var li = $("<li>" + result.address + "</li>");
		li.addClass("geocoding-result");
		li.click(function() {
			bus.send("map-extent", [ id, result ]);
			div.toggle('slow');
		});
		return li;
	}

	return function(id, div) {
		var container = div.attr("id", "geocoding." + id);

		// Layout
		var input = $("<input type='text'>");
		var searching = $("<div/>").spin(spinOpts);
		var more = $("<div/>");
		var inputDiv = $("<div/>");
		var resultsDiv = $("<div/>");

		inputDiv.append(input);
		inputDiv.append(searching);
		inputDiv.append(more);

		container.append(inputDiv);
		container.append(resultsDiv);

		// CSS
		container.addClass("geocoding-container");
		searching.addClass("geocoding-searching");
		more.addClass("geocoding-more");
		input.addClass("geocoding-input");
		inputDiv.addClass("geocoding-input-div");
		resultsDiv.addClass("geocoding-results");

		// Visibility
		searching.hide();
		more.hide();
		resultsDiv.hide();

		// Events
		function success(results) {
			searching.hide();
			resultsDiv.hide();
			if (results.length == 0) {
				bus.send("alert", [ i18n("No results"), "warning" ]);
			} else {
				resultsDiv.empty();
				bus.send("map-extent", [ id, results[0] ]);
				if (results.length > 1) {
					more.show();
					var ul = $("<ul/>").addClass("geocoding-result-list");
					for (var i = 0; i < results.length; i++) {
						ul.append(createResult(id, results[i], resultsDiv));
					}
					resultsDiv.append(ul);

					ul.scrollTop();
					resultsDiv.scrollTop();
				}
			}
		}

		function error(message) {
			searching.hide();
			bus.send("alert", [ message, "danger" ]);
		}

		input.keypress(function(e) {
			if (e.keyCode == 13) {
				searching.show();
				more.hide();
				geocoding(input.val(), success, error);
			}
		});

		more.click(function() {
			resultsDiv.toggle('slow');
		});
	};
});
