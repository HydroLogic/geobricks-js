define([ "jquery", "module", "message-bus", "spin", "jquery-ui", "jquery.spin", "css-loader" ], function($, module, bus) {
	var config = module.config();
	var containerId = config.containerId;
	if (!containerId) {
		containerId = "#container";
	}

	var mode = config.mode;
	var modes = [ "spinner", "progressbar" ];
	if (!mode || !mode in modes) {
		mode = modes[0];
	}

	var body = $("body");
	var bodyBg = body.css("background");

	var loaderDiv = $("<div/>");
	if (mode == "spinner") {

		var opts = config.opts;
		if (!opts) {
			opts = {
				lines : 13, // The number of lines to draw
				length : 20, // The length of each line
				width : 10, // The line thickness
				radius : 30, // The radius of the inner circle
				corners : 1, // Corner roundness (0..1)
				rotate : 0, // The rotation offset
				direction : 1, // 1: clockwise, -1: counterclockwise
				color : config.foreground, // #rgb or #rrggbb or array of
				// colors
				speed : 1, // Rounds per second
				trail : 60, // Afterglow percentage
				shadow : false, // Whether to render a shadow
				hwaccel : false, // Whether to use hardware acceleration
				zIndex : 2e9, // The z-index (defaults to 2000000000)
			};
		}

		body.css("background", config.background);
		var spinner = $("<div/>").spin(opts);

		loaderDiv.attr("id", "page-loader-spinner");
		spinner.attr("id", "spinner-loader");

		loaderDiv.append(spinner);
	} else if (mode == "progressbar") {
		loaderDiv.attr("id", "page-loader-progressbar");
		var progress = $("<div/>");
		progress.progressbar({
			value : false
		});
		loaderDiv.append($("<p>Loading...</p>"));
		loaderDiv.append(progress);
	}

	body.append(loaderDiv);

	var loadPending = 0;
	var loadEventReceived = false;
	var documentReady = false;

	bus.listen("load-pending", function() {
		loadEventReceived = true;
		if (loadPending >= 0) {
			loadPending++;
		}
	});
	bus.listen("load-finished", function() {
		finishLoad();
	});

	$(document).ready(function() {
		documentReady = true;
		finishLoad();
	});

	function finishLoad() {
		loadPending--;
		var finished = !config.waitForDocument || documentReady;
		finished &= !config.waitForModules || (loadEventReceived && loadPending <= 0);
		if (finished) {
			body.css("background", bodyBg);
			loaderDiv.hide();
			$(containerId).show();
		}
	}
});