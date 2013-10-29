/**
 * Listens:
 *   - init-alerts
 *          Initializes the alert div
 *      @param div - the div where the Bootstrap alerts will be contained
 *      
 *      var div = $("<div/>");
 *      $("body").append(div);
 *      bus.send("init-alerts", [ div ]); 
 * 
 *   - alert
 * 			Shows a Bootstrap alert with the given message.
 * 		@param message - string
 *      @param severity - string, one of 'success', 'info', 'warning' or 'danger'
 * 		
 * 		bus.send("alert", [ "Unexpected error!", "danger" ]); 
 */
define([ "jquery", "message-bus", "css-loader", "module", "require", "bootstrap" ], function($, bus, cssLoader, module, require) {
	var config = module.config();

	var defaultCss = [ "../styles/bootstrap-3.0.0.min.css" ];
	cssLoader.initModule(config.css, defaultCss.map(require.toUrl));

	var severities = [ "success", "info", "warning", "danger" ];
	var prefixes = {
		success : config.successPrefix ? config.successPrefix : "",
		info : config.infoPrefix ? config.infoPrefix : "",
		warning : config.warningPrefix ? config.warningPrefix : "",
		danger : config.dangerPrefix ? config.dangerPrefix : ""
	};

	var divContainer = null;

	bus.listen("init-alerts", function(event, div) {
		divContainer = div;
	});

	bus.listen("alert", function(event, msg, severity) {
		if ($.inArray(severity, severities) == -1) {
			severity = severities[severities.length - 1];
		}

		var button = $('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');
		var text = $("<div><strong>" + prefixes[severity] + "</strong> " + msg + "</div>");
		var div = $("<div/>").addClass("alert alert-dismissable alert-" + severity);
		div.append(button);
		div.append(text);
		divContainer.append(div);
	});
});
