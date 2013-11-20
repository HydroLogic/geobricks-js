define([ "jquery", "message-bus", "css-loader", "module", "layout", "bootstrap" ], function($, bus, cssLoader, module, layout) {
	var config = module.config();

	var severities = [ "success", "info", "warning", "danger" ];
	var prefixes = {
		success : config.successPrefix ? config.successPrefix : "",
		info : config.infoPrefix ? config.infoPrefix : "",
		warning : config.warningPrefix ? config.warningPrefix : "",
		danger : config.dangerPrefix ? config.dangerPrefix : ""
	};

	var divContainer = $("#" + layout.alerts);

	bus.listen("alert", function(event, msg, severity) {
		if ($.inArray(severity, severities) == -1) {
			severity = severities[severities.length - 1];
		}

		console.log(msg);
		console.log(severity);

		var button = $('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');
		var text = $("<div><strong>" + prefixes[severity] + "</strong> " + msg + "</div>");
		var div = $("<div/>").addClass("alert alert-dismissable alert-" + severity);

		div.append(button);
		div.append(text);
		divContainer.append(div);

		setTimeout(function() {
			div.alert("close");
		}, 5000);
	});
});
